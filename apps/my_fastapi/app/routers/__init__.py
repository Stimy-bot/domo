# apps/my_fastapi/app/routers/__init__.py
from app.routers.posts import router as posts_router
from app.routers.users import router as users_router
from app.routers.contact import router as contact_router

__all__ = ["posts_router", "users_router", contact_router]