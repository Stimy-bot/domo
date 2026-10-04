# apps/my_fastapi/app/auth/auth.py
import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from pwdlib import PasswordHash
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.config import Settings
from app.config.database import get_database
from app.models import SessionData, UserCreate, UserLogin, UserPublic
from .auth_handler import verify_token  # or decodeJWT depending on your setup
from .auth_handler import decodeJWT

router = APIRouter(prefix="/auth", tags=["authentication"])
password_hash = PasswordHash.recommended()

COOKIE_NAME = "session_id"


def _public_user(document: dict[str, Any]) -> UserPublic:
    return UserPublic(id=str(document["_id"]), email=document["email"])


# ------------------------------------------------------------------
# SESSION VALIDATION DEPENDENCY
# ------------------------------------------------------------------
async def get_current_user(
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
    session_id: Annotated[str | None, Cookie(alias=COOKIE_NAME)] = None,
) -> UserPublic:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate session credentials",
    )
    if not session_id:
        raise unauthorized

    # Find the session in MongoDB
    session = await database["sessions"].find_one({"session_id": session_id})
    if session is None:
        raise unauthorized

    # Check expiration
    expires_at = session.get("expires_at")
    if expires_at and datetime.now(UTC) > expires_at.replace(tzinfo=UTC):
        await database["sessions"].delete_one({"session_id": session_id})
        raise unauthorized

    # Look up user attached to session
    try:
        user_id = ObjectId(session["user_id"])
    except (InvalidId, TypeError, KeyError) as err:
        raise unauthorized from err

    user = await database["users"].find_one({"_id": user_id})
    if user is None:
        raise unauthorized

    return _public_user(user)


# ------------------------------------------------------------------
# CREATE SESSION (LOGIN)
# ------------------------------------------------------------------
@router.post("/login", response_model=UserPublic)
async def login(
    payload: UserLogin,
    request: Request,
    response: Response,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
) -> UserPublic:
    user = await database["users"].find_one({"email": str(payload.email).lower()})
    if user is None or not password_hash.verify(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    settings: Settings = request.app.state.settings
    session_ttl_minutes = getattr(settings, "session_expire_minutes", 1440)

    # Generate secure random session token
    session_id = secrets.token_hex(32)
    now = datetime.now(UTC)
    expires_at = now + timedelta(minutes=session_ttl_minutes)

    # 1. Save session to MongoDB "sessions" collection
    await database["sessions"].insert_one({
        "session_id": session_id,
        "user_id": str(user["_id"]),
        "created_at": now,
        "expires_at": expires_at,
    })

    # 2. Set HTTP-only cookie on response
    response.set_cookie(
        key=COOKIE_NAME,
        value=session_id,
        httponly=True,
        secure=False,
        samesite="lax",
        expires=int(timedelta(minutes=session_ttl_minutes).total_seconds()),
    )

    return _public_user(user)


# ------------------------------------------------------------------
# GET ALL ACTIVE SESSIONS FOR CURRENT USER
# ------------------------------------------------------------------
@router.get("/sessions", response_model=list[dict[str, Any]])
async def list_user_sessions(
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
    current_user: Annotated[UserPublic, Depends(get_current_user)],
    session_id: Annotated[str | None, Cookie(alias=COOKIE_NAME)] = None,
) -> list[dict[str, Any]]:
    # Retrieve all active session documents for the logged-in user
    cursor = database["sessions"].find({"user_id": current_user.id})
    sessions = await cursor.to_list(length=100)

    # Format the session list and mark which one belongs to the current request
    session_list = []
    for s in sessions:
        session_list.append({
            "session_id": s["session_id"],
            "created_at": s.get("created_at"),
            "expires_at": s.get("expires_at"),
            "is_current": s["session_id"] == session_id,
        })

    return session_list


# ------------------------------------------------------------------
# DELETE SESSION (LOGOUT)
# ------------------------------------------------------------------
@router.post("/logout")
async def logout(request: Request, response: Response):
    # Get access token from cookies
    access_token = request.cookies.get("accessToken")
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token",
        )

    # Verify JWT
    payload = verify_token(access_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )

    # Load user
    user = await UserModel.get(payload["userId"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Audit log
    await log_auth_event(
        request=request,
        user={
            "_id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
        },
        event_type="user_logout",
        metadata={"method": "manual"},
    )

    # Delete session
    await SessionModel.delete(payload["sessionId"])

    # Clear cookies
    clear_auth_cookies(response)

    return {"message": "Logout successful"}


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserCreate,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
) -> UserPublic:
    user = {
        "email": str(payload.email).lower(),
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
    return _public_user(user)


@router.get("/me", response_model=UserPublic)
async def read_current_user(
    current_user: Annotated[UserPublic, Depends(get_current_user)],
) -> UserPublic:
    return current_user
