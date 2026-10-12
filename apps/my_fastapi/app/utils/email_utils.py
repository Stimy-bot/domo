# apps/my_fastapi/app/utils/email_utils.py
import logging
from pathlib import Path
import resend
from fastapi.templating import Jinja2Templates
from app.config.config import settings

logger = logging.getLogger(__name__)

APP_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = APP_DIR / "templates"

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


def send_email(
    to_email: str,
    subject: str,
    plain_text: str,
    html_content: str | None = None,
) -> None:
    api_key = settings.resend_api_key.get_secret_value()

    if not api_key or not api_key.startswith("re_"):
        logger.error(f"Resend API key missing or invalid format. Got: '{api_key[:4]}...'")
        return

    resend.api_key = api_key

    params: resend.Emails.SendParams = {
        "from": settings.mail_from,
        "to": [to_email],
        "subject": subject,
        "text": plain_text,
    }

    if html_content:
        params["html"] = html_content

    try:
        response = resend.Emails.send(params)
        logger.info(f"Email sent to {to_email}. Response: {response}")
    except resend.exceptions.ResendError as e:
        logger.error(f"Resend API error sending to {to_email}: {e}")
    except Exception as e:
        logger.error(f"Unexpected error sending email: {e}")


def send_password_reset_email(to_email: str, username: str, token: str) -> None:
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"

    template = templates.get_template("email/password_reset.html")
    html_content = template.render(reset_url=reset_url, username=username)

    plain_text = f"""Hi {username},

You requested to reset your password. Click the link below to set a new password:

{reset_url}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

Best regards,
The FastAPI Blog Team
"""

    send_email(
        to_email=to_email,
        subject="Reset Your Password - Domo Blog",
        plain_text=plain_text,
        html_content=html_content,
    )