# apps/my_fastapi/app/config/config.py
from pathlib import Path
from pydantic import AliasChoices, Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

# File location: /home/dominic/github/domo/apps/my_fastapi/app/config/config.py
CONFIG_DIR = Path(__file__).resolve().parent
APP_DIR = CONFIG_DIR.parent                                 # apps/my_fastapi/app
PROJECT_DIR = APP_DIR.parent                               # apps/my_fastapi
MONOREPO_DIR = PROJECT_DIR.parent                           # /home/dominic/github/domo

APP_ENV = PROJECT_DIR / ".env"                              # apps/my_fastapi/.env
MONOREPO_ENV = MONOREPO_DIR / ".env"                        # /home/dominic/github/domo/.env

class Settings(BaseSettings):
    resend_api_key: SecretStr = Field(
        validation_alias=AliasChoices("RESEND_API_KEY", "resend_api_key"),
    )

    database_url: str

    user: str = "onboarding@resend.dev"
    to: str = "delivered@resend.dev"
    gmailpass: str | None = None

    secret_key: SecretStr = Field(
        default=SecretStr("dev-secret-key-change-in-production"),
        validation_alias=AliasChoices("SECRET_KEY", "secret_key"),
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    max_upload_size_bytes: int = 5 * 1024 * 1024
    posts_per_page: int = 10
    reset_token_expire_minutes: int = 60

    mail_server: str = "localhost"
    mail_enabled: bool = False
    mail_port: int = 587
    mail_username: str = ""
    mail_password: SecretStr = SecretStr("")
    mail_from: str = "FastAPI Blog <onboarding@resend.dev>"
    mail_use_tls: bool = True

    frontend_url: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=(str(APP_ENV), str(MONOREPO_ENV)),
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()