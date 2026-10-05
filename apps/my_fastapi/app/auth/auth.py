import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any
from uuid import uuid4

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.config import Settings
from app.config.database import get_database
from app.models import (
    AuthTokenResponse,
    RefreshTokenRequest,
    UserCreate,
    UserLogin,
    UserPublic,
)

from .auth_handler import TokenType, decode_token, sign_token

router = APIRouter(prefix="/auth", tags=["authentication"])
password_hash = PasswordHash.recommended()
bearer_scheme = HTTPBearer(auto_error=False)
ACCESS_COOKIE_NAME = "accessToken"
REFRESH_COOKIE_NAME = "refreshToken"
ACCESS_TOKEN_TYPE: TokenType = "access"
REFRESH_TOKEN_TYPE: TokenType = "refresh"


def _public_user(document: dict[str, Any]) -> UserPublic:
    return UserPublic(id=str(document["_id"]), email=document["email"])


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def _session_is_active(session: dict[str, Any] | None) -> bool:
    if session is None:
        return False
    expires_at = session.get("expires_at")
    if not isinstance(expires_at, datetime):
        return False
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    return datetime.now(UTC) < expires_at


def _set_auth_cookies(
    response: Response,
    *,
    access_token: str,
    refresh_token: str,
    settings: Settings,
) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
    )


def _clear_auth_cookies(response: Response, settings: Settings) -> None:
    for cookie_name in (ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME):
        response.delete_cookie(
            key=cookie_name,
            httponly=True,
            secure=settings.auth_cookie_secure,
            samesite="lax",
        )


async def _create_session_and_tokens(
    database: AsyncDatabase[dict[str, Any]],
    user: dict[str, Any],
    settings: Settings,
) -> tuple[str, str]:
    now = datetime.now(UTC)
    session_id = uuid4().hex
    refresh_jti = secrets.token_urlsafe(32)
    expires_at = now + timedelta(days=settings.refresh_token_expire_days)
    await database["sessions"].insert_one(
        {
            "session_id": session_id,
            "user_id": str(user["_id"]),
            "refresh_jti": refresh_jti,
            "created_at": now,
            "expires_at": expires_at,
        }
    )

    access_token = sign_token(
        {
            "userId": str(user["_id"]),
            "sessionId": session_id,
            "jti": secrets.token_urlsafe(16),
        },
        token_type=ACCESS_TOKEN_TYPE,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        settings=settings,
    )
    refresh_token = sign_token(
        {
            "userId": str(user["_id"]),
            "sessionId": session_id,
            "jti": refresh_jti,
        },
        token_type=REFRESH_TOKEN_TYPE,
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
        settings=settings,
    )
    return access_token, refresh_token


async def get_current_user(
    request: Request,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ] = None,
) -> UserPublic:
    settings: Settings = request.app.state.settings
    token = (
        credentials.credentials
        if credentials is not None
        else request.cookies.get(ACCESS_COOKIE_NAME)
    )
    if not token:
        raise _unauthorized()

    payload = decode_token(token, token_type=ACCESS_TOKEN_TYPE, settings=settings)
    if payload is None:
        raise _unauthorized()

    session_id = payload.get("sessionId")
    user_id = payload.get("userId")
    if not isinstance(session_id, str) or not isinstance(user_id, str):
        raise _unauthorized()

    session = await database["sessions"].find_one({"session_id": session_id})
    if (
        not _session_is_active(session)
        or session is None
        or session.get("user_id") != user_id
    ):
        raise _unauthorized()

    try:
        user_object_id = ObjectId(user_id)
    except (InvalidId, TypeError) as error:
        raise _unauthorized() from error

    user = await database["users"].find_one({"_id": user_object_id})
    if user is None:
        raise _unauthorized()
    return _public_user(user)


@router.post(
    "/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: UserCreate,
    request: Request,
    response: Response,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
) -> AuthTokenResponse:
    settings: Settings = request.app.state.settings
    user = {
        "email": str(payload.email).strip().lower(),
        "hashed_password": password_hash.hash(payload.password),
    }
    try:
        result = await database["users"].insert_one(user)
    except DuplicateKeyError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        ) from error

    user["_id"] = result.inserted_id
    access_token, refresh_token = await _create_session_and_tokens(
        database, user, settings
    )
    _set_auth_cookies(
        response,
        access_token=access_token,
        refresh_token=refresh_token,
        settings=settings,
    )
    return AuthTokenResponse(
        user=_public_user(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/login", response_model=AuthTokenResponse)
@router.post("/token", response_model=AuthTokenResponse, include_in_schema=False)
async def login(
    payload: UserLogin,
    request: Request,
    response: Response,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
) -> AuthTokenResponse:
    user = await database["users"].find_one(
        {"email": str(payload.email).strip().lower()}
    )
    if user is None or not password_hash.verify(
        payload.password, user["hashed_password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    settings: Settings = request.app.state.settings
    access_token, refresh_token = await _create_session_and_tokens(
        database, user, settings
    )
    _set_auth_cookies(
        response,
        access_token=access_token,
        refresh_token=refresh_token,
        settings=settings,
    )
    return AuthTokenResponse(
        user=_public_user(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh")
async def refresh(
    request: Request,
    response: Response,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
    payload: RefreshTokenRequest | None = None,
) -> dict[str, str]:
    settings: Settings = request.app.state.settings
    refresh_token = (
        payload.refresh_token if payload is not None else request.cookies.get(REFRESH_COOKIE_NAME)
    )
    if not refresh_token:
        raise _unauthorized()

    claims = decode_token(
        refresh_token,
        token_type=REFRESH_TOKEN_TYPE,
        settings=settings,
    )
    if claims is None:
        raise _unauthorized()
    session_id = claims.get("sessionId")
    user_id = claims.get("userId")
    old_jti = claims.get("jti")
    if not all(isinstance(value, str) for value in (session_id, user_id, old_jti)):
        raise _unauthorized()

    session = await database["sessions"].find_one({"session_id": session_id})
    if (
        not _session_is_active(session)
        or session is None
        or session.get("user_id") != user_id
    ):
        raise _unauthorized()

    stored_jti = session.get("refresh_jti")
    if not isinstance(stored_jti, str) or not secrets.compare_digest(
        stored_jti, old_jti
    ):
        raise _unauthorized()

    try:
        user_object_id = ObjectId(user_id)
    except (InvalidId, TypeError) as error:
        raise _unauthorized() from error
    user = await database["users"].find_one({"_id": user_object_id})
    if user is None:
        raise _unauthorized()

    new_refresh_jti = secrets.token_urlsafe(32)
    new_refresh_token = sign_token(
        {
            "userId": user_id,
            "sessionId": session_id,
            "jti": new_refresh_jti,
        },
        token_type=REFRESH_TOKEN_TYPE,
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
        settings=settings,
    )
    new_access_token = sign_token(
        {
            "userId": user_id,
            "sessionId": session_id,
            "jti": secrets.token_urlsafe(16),
        },
        token_type=ACCESS_TOKEN_TYPE,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        settings=settings,
    )
    update_result = await database["sessions"].update_one(
        {"session_id": session_id, "refresh_jti": old_jti},
        {
            "$set": {
                "refresh_jti": new_refresh_jti,
                "expires_at": datetime.now(UTC)
                + timedelta(days=settings.refresh_token_expire_days),
            }
        },
    )
    if update_result.modified_count != 1:
        raise _unauthorized()
    _set_auth_cookies(
        response,
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        settings=settings,
    )
    return {"accessToken": new_access_token, "refreshToken": new_refresh_token}


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ] = None,
) -> dict[str, str]:
    settings: Settings = request.app.state.settings
    token = (
        credentials.credentials
        if credentials is not None
        else request.cookies.get(ACCESS_COOKIE_NAME)
    )
    if not token:
        raise _unauthorized()

    claims = decode_token(token, token_type=ACCESS_TOKEN_TYPE, settings=settings)
    session_id = claims.get("sessionId") if claims else None
    if not isinstance(session_id, str):
        raise _unauthorized()

    await database["sessions"].delete_one({"session_id": session_id})
    _clear_auth_cookies(response, settings)
    return {"message": "Logout successful"}


@router.get("/sessions", response_model=list[dict[str, Any]])
async def list_user_sessions(
    request: Request,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
    current_user: Annotated[UserPublic, Depends(get_current_user)],
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ] = None,
) -> list[dict[str, Any]]:
    cursor = database["sessions"].find({"user_id": current_user.id})
    sessions = await cursor.to_list(length=100)
    current_token = (
        credentials.credentials
        if credentials is not None
        else request.cookies.get(ACCESS_COOKIE_NAME)
    )
    current_claims = (
        decode_token(
            current_token,
            token_type=ACCESS_TOKEN_TYPE,
            settings=request.app.state.settings,
        )
        if current_token
        else None
    )
    current_session_id = (
        current_claims.get("sessionId") if current_claims is not None else None
    )
    return [
        {
            "session_id": session["session_id"],
            "created_at": session.get("created_at"),
            "expires_at": session.get("expires_at"),
            "is_current": session["session_id"] == current_session_id,
        }
        for session in sessions
    ]


@router.get("/me", response_model=UserPublic)
async def read_current_user(
    current_user: Annotated[UserPublic, Depends(get_current_user)],
) -> UserPublic:
    return current_user
