from collections.abc import Iterator
from typing import Any

import pytest
from bson import ObjectId
from fastapi.testclient import TestClient
from pymongo.errors import DuplicateKeyError

from app.config import Settings
from app.main import create_app


class FakeCollection:
    def __init__(self) -> None:
        self.documents: list[dict[str, Any]] = []

    async def create_index(self, *_args: Any, **_kwargs: Any) -> None:
        return None

    async def insert_one(self, document: dict[str, Any]) -> Any:
        if document.get("email") and any(
            existing.get("email") == document["email"] for existing in self.documents
        ):
            raise DuplicateKeyError("duplicate email")
        stored = {**document}
        if "_id" not in stored:
            stored["_id"] = ObjectId()
        self.documents.append(stored)
        return type("InsertResult", (), {"inserted_id": stored["_id"]})()

    async def find_one(self, query: dict[str, Any]) -> dict[str, Any] | None:
        for document in self.documents:
            if all(document.get(key) == value for key, value in query.items()):
                return document
        return None

    def find(self, query: dict[str, Any]) -> Any:
        matching = [
            document
            for document in self.documents
            if all(document.get(key) == value for key, value in query.items())
        ]

        class Cursor:
            async def to_list(self, length: int) -> list[dict[str, Any]]:
                return matching[:length]

        return Cursor()

    async def update_one(
        self, query: dict[str, Any], update: dict[str, Any]
    ) -> Any:
        document = await self.find_one(query)
        if document is not None:
            document.update(update["$set"])
            return type("UpdateResult", (), {"modified_count": 1})()
        return type("UpdateResult", (), {"modified_count": 0})()

    async def delete_one(self, query: dict[str, Any]) -> None:
        document = await self.find_one(query)
        if document is not None:
            self.documents.remove(document)


class FakeDatabase:
    def __init__(self) -> None:
        self.collections: dict[str, FakeCollection] = {}

    def __getitem__(self, name: str) -> FakeCollection:
        return self.collections.setdefault(name, FakeCollection())

    async def command(self, command: str) -> dict[str, int]:
        assert command == "ping"
        return {"ok": 1}


class FakeMongoClient:
    def __init__(self, *_args: Any, **_kwargs: Any) -> None:
        self.database = FakeDatabase()

    def __getitem__(self, _name: str) -> FakeDatabase:
        return self.database

    async def close(self) -> None:
        return None


@pytest.fixture
def client() -> Iterator[TestClient]:
    settings = Settings(
        jwt_secret_key="test-only-secret-that-is-long-enough-for-jwt-signing",
        cors_origins=["http://localhost:3000"],
        auth_cookie_secure=False,
    )
    application = create_app(settings, mongo_client_factory=FakeMongoClient)
    with TestClient(application) as test_client:
        yield test_client


def test_typed_path_query_cookie_and_header_parameters(client: TestClient) -> None:
    client.cookies.set("session_id", "session-value")
    response = client.get(
        "/examples/12?q=search",
        headers={"X-Client-Version": "1.2.3"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "item_id": 12,
        "q": "search",
        "session_id": "session-value",
        "client_version": "1.2.3",
    }
    assert response.headers["x-request-id"]
    assert float(response.headers["x-process-time"]) >= 0


def test_path_validation_rejects_non_positive_ids(client: TestClient) -> None:
    response = client.get("/examples/0")

    assert response.status_code == 422


def test_cors_preflight_allows_configured_origin(client: TestClient) -> None:
    response = client.options(
        "/examples/1",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-credentials"] == "true"


def test_register_login_and_protected_profile(client: TestClient) -> None:
    registration = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "a-long-test-password"},
    )
    assert registration.status_code == 201
    registration_body = registration.json()
    assert registration_body["user"]["email"] == "user@example.com"
    assert registration_body["accessToken"]
    assert registration_body["refreshToken"]
    assert "hashed_password" not in registration_body["user"]
    assert "accessToken" in registration.headers["set-cookie"]
    assert "refreshToken" in registration.headers["set-cookie"]

    login = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "a-long-test-password"},
    )
    assert login.status_code == 200
    assert login.json()["accessToken"]
    assert login.json()["refreshToken"]

    profile = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {login.json()['accessToken']}"},
    )
    assert profile.status_code == 200
    assert profile.json() == registration_body["user"]

    cookie_profile = client.get("/users/me")
    assert cookie_profile.status_code == 200
    assert cookie_profile.json() == registration_body["user"]


def test_refresh_rotates_refresh_token_and_logout_revokes_session(
    client: TestClient,
) -> None:
    registration = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "a-long-test-password"},
    )
    tokens = registration.json()

    refreshed = client.post(
        "/auth/refresh", json={"refreshToken": tokens["refreshToken"]}
    )
    assert refreshed.status_code == 200
    new_tokens = refreshed.json()
    assert new_tokens["accessToken"] != tokens["accessToken"]
    assert new_tokens["refreshToken"] != tokens["refreshToken"]

    old_refresh = client.post(
        "/auth/refresh", json={"refreshToken": tokens["refreshToken"]}
    )
    assert old_refresh.status_code == 401

    logout = client.post(
        "/auth/logout",
        headers={"Authorization": f"Bearer {new_tokens['accessToken']}"},
    )
    assert logout.status_code == 200
    assert logout.json() == {"message": "Logout successful"}

    profile = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {new_tokens['accessToken']}"},
    )
    assert profile.status_code == 401


def test_registration_rejects_duplicate_email(client: TestClient) -> None:
    payload = {"email": "user@example.com", "password": "a-long-test-password"}
    assert client.post("/auth/register", json=payload).status_code == 201

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 409


def test_login_rejects_invalid_password(client: TestClient) -> None:
    client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "a-long-test-password"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_protected_profile_rejects_invalid_token(client: TestClient) -> None:
    response = client.get("/users/me", headers={"Authorization": "Bearer invalid"})

    assert response.status_code == 401


def test_startup_requires_a_configured_jwt_secret() -> None:
    application = create_app(
        Settings(jwt_secret_key=None), mongo_client_factory=FakeMongoClient
    )

    with pytest.raises(RuntimeError, match="JWT_SECRET_KEY"), TestClient(application):
        pass
