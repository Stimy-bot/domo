# apps/my_fastapi/app/auth/auth_handler.py
import time
import jwt
from decouple import config

JWT_SECRET = config("SECRET", default="supersecretkey")
JWT_ALGORITHM = config("ALGORITHM", default="HS256")


def token_response(token: str) -> dict[str, str]:
    return {"access_token": token}


def signJWT(user_id: str) -> dict[str, str]:
    payload = {
        "user_id": user_id,
        "expires": time.time() + 600,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return token_response(token)

def decodeJWT(token: str) -> dict | None:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token.get("expires", 0) >= time.time() else None
    except Exception:
        return None

# Alias for decodeJWT to satisfy auth.py imports
verify_token = decodeJWT