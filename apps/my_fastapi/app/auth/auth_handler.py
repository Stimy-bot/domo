import hashlib
import hmac
from datetime import UTC, datetime, timedelta
from typing import Any, Literal

import jwt

from app.config import Settings

TokenType = Literal["access", "refresh"]


def _signing_secret(settings: Settings, token_type: TokenType) -> str:
    if settings.jwt_secret_key is None:
        raise RuntimeError("JWT_SECRET_KEY must be configured before using authentication")

    secret = settings.jwt_secret_key.get_secret_value()
    if token_type == "refresh":
        return hmac.new(secret.encode(), b"fastapi-refresh-token", hashlib.sha256).hexdigest()
    return secret


def sign_token(
    payload: dict[str, Any],
    *,
    token_type: TokenType,
    expires_delta: timedelta,
    settings: Settings,
) -> str:
    now = datetime.now(UTC)
    claims = {
        **payload,
        "tokenType": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(
        claims,
        _signing_secret(settings, token_type),
        algorithm=settings.jwt_algorithm,
    )


def decode_token(
    token: str,
    *,
    token_type: TokenType,
    settings: Settings,
) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(
            token,
            _signing_secret(settings, token_type),
            algorithms=[settings.jwt_algorithm],
            options={"require": ["exp", "iat"]},
        )
    except jwt.InvalidTokenError:
        return None

    if payload.get("tokenType") != token_type:
        return None
    return payload
