# apps/my_fastapi/app/model/models.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    created_at: datetime
    expires_at: datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    is_admin: bool = False
    phone_number: str | None = None
    profile_picture: str | None = Field(default=None, serialization_alias="profile_picture")
    role: list[str] = Field(default=["user"])
    active: bool = True
    verified: bool = False
    birthdate: datetime | None = None
    bio: str = Field(default="", max_length=500)
    created_at: datetime | None = None
    updated_at: datetime | None = None


class AuthTokenResponse(BaseModel):
    user: UserPublic
    access_token: str = Field(serialization_alias="accessToken")
    refresh_token: str = Field(serialization_alias="refreshToken")


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(validation_alias="refreshToken")


class SessionData(BaseModel):
    session_id: str
    user_id: str
    created_at: datetime
    expires_at: datetime

class SendEmail(BaseModel):
    email: EmailStr = Field(
        ...,
        description="Recipient email address",
        json_schema_extra={"example": "user@example.com"}
    )
    subject: str = Field(default="Welcome!", json_schema_extra={"example": "Hello"})
    message: str = Field(..., json_schema_extra={"example": "This is a test email."})

