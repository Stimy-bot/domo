from typing import Annotated
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse
import logging

from app.auth.auth import CurrentUser
from app.utils.email_utils import send_email
from app.config.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Contact"])


@router.post("/send_email", response_class=HTMLResponse)
async def send_contact_email(
    request: Request,
    current_user: CurrentUser,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
):
    try:
        full_name = f"{first_name} {last_name}"
        admin_email = settings.mail_from

        plain_text = f"""New contact form submission from logged-in user:

User ID: {current_user.id}
Username: {current_user.username}
Name: {full_name}
Email: {email}
Subject: {subject}

Message:
{message}
"""

        html_content = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Submitted by:</strong> {current_user.username} (ID: {current_user.id})</p>
            <p><strong>Name:</strong> {full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
            <p><strong>Subject:</strong> {subject}</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">{message}</p>
        </div>
        """

        send_email(
            to_email=admin_email,
            subject=f"Contact Form: {subject}",
            plain_text=plain_text,
            html_content=html_content,
        )

        return '<span class="text-green-600 font-medium">Thank you! Your message has been sent successfully.</span>'

    except Exception as e:
        logger.error(f"Failed to send contact form email: {e}")
        return '<span class="text-red-600 font-medium">Failed to send message. Please try again later.</span>'