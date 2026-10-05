# FastAPI service

Python API starter located at `apps/fastapi`. It demonstrates typed path, query,
cookie, and header parameters; request metadata middleware; configured CORS;
MongoDB persistence; and JWT bearer authentication.

## Run locally

Requirements: Python 3.11+, [uv](https://docs.astral.sh/uv/), and Docker Compose.

```sh
cd apps/fastapi
cp .env.example .env
```

Set `JWT_SECRET_KEY` in `.env` to a private random value of at least 32 characters.
For example, generate one with `openssl rand -hex 32`. Do not commit `.env` or
use the example value in a deployed environment.

Start MongoDB and the API:

```sh
docker compose up -d mongodb
uv sync
uv run uvicorn app.main:app --reload
```

The interactive API documentation is available at
<http://127.0.0.1:8000/docs>. `GET /health` checks that the API process is
running; `GET /ready` checks MongoDB connectivity.

## Included endpoints

- `GET /examples/{item_id}?q=...` demonstrates positive integer path validation,
  a bounded query parameter, `session_id` cookie input, and the
  `X-Client-Version` header. Path and query constraints appear in OpenAPI.
- `POST /auth/register` creates a user with an Argon2 password hash, creates a
  session, and returns `user`, `accessToken`, and `refreshToken`. Email
  addresses have a unique MongoDB index.
- `POST /auth/login` (also available as `/auth/token`) verifies JSON
  email/password credentials and returns a new access/refresh token pair.
- Access tokens are valid for 15 minutes and refresh tokens for 30 days.
  Refresh tokens rotate at `POST /auth/refresh`; sessions are revocable with
  `POST /auth/logout`. Tokens are also set as HttpOnly cookies; set
  `AUTH_COOKIE_SECURE=false` only for local HTTP development.
- `GET /users/me` requires `Authorization: Bearer <accessToken>` or the
  `accessToken` HttpOnly cookie.
- `GET /health` and `GET /ready` provide process and database health checks.

The HTTP middleware returns an `X-Request-ID` and `X-Process-Time` header for
each completed response. CORS origins are configured by `CORS_ORIGINS`; keep
them explicit when credentials are enabled.

## Nx commands

From the workspace root (after installing workspace dependencies):

```sh
pnpm nx run fastapi:serve
pnpm nx run fastapi:test
pnpm nx run fastapi:lint
```

Equivalent commands can be run from `apps/fastapi` using `uv run`.
