from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.config import Settings
from app.database import get_database
from app.schemas import TokenResponse, UserCreate, UserLogin, UserPublic

router = APIRouter(prefix="/auth", tags=["authentication"])
password_hash = PasswordHash.recommended()
bearer_scheme = HTTPBearer(auto_error=False)


def _public_user(document: dict[str, Any]) -> UserPublic:
    return UserPublic(id=str(document["_id"]), email=document["email"])


def _create_access_token(subject: str, settings: Settings) -> str:
    if settings.jwt_secret_key is None:
        raise RuntimeError("JWT_SECRET_KEY must be configured before issuing tokens")
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode(
        {"sub": subject, "exp": expires_at},
        settings.jwt_secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


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


@router.post("/token", response_model=TokenResponse)
async def create_token(
    payload: UserLogin,
    request: Request,
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
) -> TokenResponse:
    user = await database["users"].find_one({"email": str(payload.email).lower()})
    if user is None or not password_hash.verify(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    settings: Settings = request.app.state.settings
    return TokenResponse(access_token=_create_access_token(str(user["_id"]), settings))


async def get_current_user(
    request: Request,
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    database: Annotated[AsyncDatabase[dict[str, Any]], Depends(get_database)],
) -> UserPublic:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    settings: Settings = request.app.state.settings
    if settings.jwt_secret_key is None:
        raise RuntimeError("JWT_SECRET_KEY must be configured before validating tokens")
    try:
        claims = jwt.decode(
            credentials.credentials,
            settings.jwt_secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
        )
        subject = claims.get("sub")
        if not isinstance(subject, str):
            raise unauthorized
    except jwt.InvalidTokenError as error:
        raise unauthorized from error

    try:
        user_id = ObjectId(subject)
    except (InvalidId, TypeError) as error:
        raise unauthorized from error

    user = await database["users"].find_one({"_id": user_id})
    if user is None:
        raise unauthorized
    return _public_user(user)


@router.get("/me", response_model=UserPublic)
async def read_current_user(
    current_user: Annotated[UserPublic, Depends(get_current_user)],
) -> UserPublic:
    return current_user
