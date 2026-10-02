# apps/my_fastapi/app/main.py
import time
import pathlib
from collections.abc import Callable
from contextlib import asynccontextmanager
from typing import Annotated, Any
from uuid import uuid4
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Path, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import PyMongoError
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

from app.auth import get_current_user
from app.auth import router as auth_router
from app.config import Settings, get_settings
from app.schemas import UserPublic

MongoClientFactory = Callable[..., AsyncMongoClient]
BASE_DIR = pathlib.Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
 

def create_app(
    settings: Settings | None = None,
    *,
    mongo_client_factory: MongoClientFactory = AsyncMongoClient,
) -> FastAPI:
    @asynccontextmanager
    async def lifespan(application: FastAPI):
        app_settings = settings or get_settings()
        secret = app_settings.jwt_secret_key
        if secret is None or len(secret.get_secret_value()) < 32:
            raise RuntimeError("JWT_SECRET_KEY must contain at least 32 characters")
        if app_settings.access_token_expire_minutes < 1:
            raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be greater than zero")

        client = mongo_client_factory(
            app_settings.mongodb_uri,
            serverSelectionTimeoutMS=5000,
        )
        try:
            database: AsyncDatabase[dict[str, Any]] = client[app_settings.mongodb_database]
            await database.command("ping")
            await database["users"].create_index("email", unique=True)
            application.state.settings = app_settings
            application.state.database = database
            yield
        finally:
            await client.close()

    application = FastAPI(
        title="FastAPI MongoDB Starter",
        description="Typed request parameters, middleware, MongoDB, and JWT authentication.",
        version="0.1.0",
        lifespan=lifespan,
    )
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

    @application.get("/examples/{item_id}", tags=["examples"])
    async def read_example(
        item_id: Annotated[int, Path(ge=1, description="A positive item identifier")],
        q: Annotated[str | None, Query(max_length=100)] = None,
        session_id: Annotated[str | None, Cookie()] = None,
        x_client_version: Annotated[str | None, Header()] = None,
    ) -> dict[str, int | str | None]:
        return {
            "item_id": item_id,
            "q": q,
            "session_id": session_id,
            "client_version": x_client_version,
        }

    @application.get("/users/me", response_model=UserPublic, tags=["users"])
    async def current_user(
        user: Annotated[UserPublic, Depends(get_current_user)],
    ) -> UserPublic:
        return user

    return application


app = create_app()
