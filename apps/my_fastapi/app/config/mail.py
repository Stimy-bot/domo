from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from pathlib import Path
from app.config import get_settings

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = BASE_DIR.parent / "templates"

mail_config = ConnectionConfig(
    MAIL_USERNAME=get_settings().mail_username,
    MAIL_PASSWORD=get_settings().mail_password,
    MAIL_FROM=get_settings().mail_from,
    MAIL_PORT=get_settings().mail_port,
    MAIL_SERVER=get_settings().mail_server,
    MAIL_FROM_NAME=get_settings().mail_from_name,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=TEMPLATE_DIR,
)


mail = FastMail(config=mail_config)


def create_message(recipients: list[str], subject: str, body: str) -> MessageSchema:

    message = MessageSchema(
        recipients=recipients, 
        subject=subject,
        body=body, subtype=MessageType.html
    )

    return message