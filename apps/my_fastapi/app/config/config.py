# apps/my_fastapi/app/config.py
from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

from pydantic import AliasChoices, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

APP_DIR = Path(__file__).resolve().parents[2]
WORKSPACE_ROOT = APP_DIR.parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(WORKSPACE_ROOT / ".env", APP_DIR / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    # Core Database & Cache
    mongodb_uri: str = Field(
        default="mongodb://localhost:27017",
        validation_alias=AliasChoices("MONGODB_URI", "MONGO_URI", "DATABASE_URL"),
    )
    mongodb_database: str = "fastapi_demo"
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        validation_alias=AliasChoices("REDIS_URL"),
    )

    # Auth & App Settings
    jwt_secret_key: SecretStr | None = Field(
        default=None,
        validation_alias=AliasChoices("JWT_SECRET_KEY", "JWT_SECRET"),
    )
    jwt_algorithm: Literal["HS256"] = Field(
        default="HS256",
        validation_alias=AliasChoices("JWT_ALGORITHM"),
    )
    access_token_expire_minutes: int = Field(default=15, gt=0)
    refresh_token_expire_days: int = Field(default=30, gt=0)
    auth_cookie_secure: bool = True
    cors_origins: list[str] = ["http://localhost:5173"]
    domain: str = Field(
        default="localhost",
        validation_alias=AliasChoices("DOMAIN"),
    )

    # Mail Configuration
    mail_username: str = Field(default="", validation_alias=AliasChoices("MAIL_USERNAME"))
    mail_password: SecretStr | None = Field(default=None, validation_alias=AliasChoices("MAIL_PASSWORD"))
    mail_from: str = Field(default="noreply@example.com", validation_alias=AliasChoices("MAIL_FROM"))
    mail_port: int = Field(default=587, validation_alias=AliasChoices("MAIL_PORT"))
    mail_server: str = Field(default="smtp.gmail.com", validation_alias=AliasChoices("MAIL_SERVER"))
    mail_from_name: str = Field(default="Domo App", validation_alias=AliasChoices("MAIL_FROM_NAME"))
    mail_starttls: bool = Field(default=True, validation_alias=AliasChoices("MAIL_STARTTLS"))
    mail_ssl_tls: bool = Field(default=False, validation_alias=AliasChoices("MAIL_SSL_TLS"))
    use_credentials: bool = Field(default=True, validation_alias=AliasChoices("USE_CREDENTIALS"))
    validate_certs: bool = Field(default=True, validation_alias=AliasChoices("VALIDATE_CERTS"))

    @field_validator("mongodb_uri")
    @classmethod
    def validate_mongodb_uri(cls, value: str) -> str:
        parsed_uri = urlsplit(value)
        if parsed_uri.scheme not in {"mongodb", "mongodb+srv"} or not parsed_uri.hostname:
            raise ValueError("must be a mongodb:// or mongodb+srv:// URI with a hostname")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()