# apps/my_fastapi/app/schemas.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserPublic(BaseModel):
    id: str
    email: EmailStr


class SessionData(BaseModel):
    session_id: str
    user_id: str
    created_at: datetime
    expires_at: datetime