import hashlib
import pathlib
import time
from collections.abc import Callable
from contextlib import asynccontextmanager
from functools import lru_cache
from typing import Annotated, Any
from uuid import uuid4

from fastapi import (
    BackgroundTasks,
    Cookie,
    Depends,
    FastAPI,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Request,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import PyMongoError
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

from app.auth import get_current_user, router as auth_router
from app.config import Settings, get_settings
from app.models import UserPublic

MongoClientFactory = Callable[..., AsyncMongoClient]
BASE_DIR = pathlib.Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@lru_cache(maxsize=1024)
def get_file_hash(filepath: str) -> str:
    """Compute and cache an MD5 hash of static asset files for cache busting."""
    path = STATIC_DIR / filepath
    if path.is_file():
        return hashlib.md5(path.read_bytes()).hexdigest()[:8]
    return ""


def url_for_static(request: Request, name: str, path: str) -> str:
    """Custom url_for helper that appends a cache-busting version query param."""
    url = request.url_for(name, path=path)
    if name == "static":
        file_hash = get_file_hash(path)
        if file_hash:
            return f"{url}?v={file_hash}"
    return str(url)


# Register static_url helper into Jinja2 globals
templates.env.globals["static_url"] = url_for_static


def write_notification(email: str, message=""):
    with open("log.txt", mode="a") as email_file:
        content = f"notification for {email}: {message}\n"
        email_file.write(content)


def create_app(
    settings: Settings | None = None,
    *,
    mongo_client_factory: MongoClientFactory = AsyncMongoClient,
) -> FastAPI:
    @asynccontextmanager
    async def lifespan(application: FastAPI):
        app_settings = settings or get_settings()

        client = mongo_client_factory(
            app_settings.mongodb_uri,
            serverSelectionTimeoutMS=5000,
        )
        try:
            database: AsyncDatabase[dict[str, Any]] = client[app_settings.mongodb_database]
            await database.command("ping")

            # Unique index on user email
            await database["users"].create_index("email", unique=True)

            # TTL index on sessions.expires_at to auto-delete expired documents
            await database["sessions"].create_index("expires_at", expireAfterSeconds=0)

            application.state.settings = app_settings
            application.state.database = database
            yield
        finally:
            await client.close()

    application = FastAPI(
        title="FastAPI MongoDB Starter",
        description="Typed request parameters, middleware, MongoDB, and Session authentication.",
        version="0.1.0",
        lifespan=lifespan,
    )

    application.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    application.add_middleware(
        CORSMiddleware,
        allow_origins=(settings or Settings()).cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Authorization", "Content-Type", "X-Client-Version"],
    )

    @application.middleware("http")
    async def add_request_metadata(
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        request_id = str(uuid4())
        started_at = time.perf_counter()
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{time.perf_counter() - started_at:.6f}"
        return response

    application.include_router(auth_router)

    @application.get("/", response_class=HTMLResponse)
    async def index(request: Request):
        return templates.TemplateResponse(request=request, name="index.html")

    @application.get("/health", tags=["health"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    @application.get("/ready", tags=["health"])
    async def readiness(request: Request) -> dict[str, str]:
        try:
            await request.app.state.database.command("ping")
        except PyMongoError as error:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database is unavailable",
            ) from error
        return {"status": "ready"}

    @application.post("/contact")
    async def send_notification(
        background_tasks: BackgroundTasks,
        email: str = Form(),
    ):
        background_tasks.add_task(write_notification, email, message="some notification")
        return {"message": "Email sent in the background"}

    @application.get("/users/me", response_model=UserPublic, tags=["users"])
    async def current_user(
        user: Annotated[UserPublic, Depends(get_current_user)],
    ) -> UserPublic:
        return user

    # Ensure return application is at the very end of create_app()
    return application


app = create_app()