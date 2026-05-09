import type { Preset } from '../../core/types.js';

export const fastapiPreset: Preset = {
  id: 'fastapi',
  name: 'FastAPI',
  description: 'FastAPI on Python 3.11+ with Pydantic v2 and async SQLAlchemy.',
  type: 'framework',
  rules: [
    {
      content:
        'Define every request body, query, and response with Pydantic v2 models. The framework validates input automatically, generates OpenAPI from the models, and serializes responses. Skipping models defeats the entire framework.',
      category: 'architecture',
    },
    {
      content:
        'Pydantic v2 model config: use `model_config = ConfigDict(...)` (NOT v1\'s `class Config`). Common settings: `from_attributes=True` (replaces `orm_mode`), `populate_by_name=True`, `str_strip_whitespace=True`.',
      category: 'conventions',
    },
    {
      content:
        'Endpoint signature decides async-ness. `async def` runs in the event loop — use for I/O (DB, HTTP, files). Plain `def` runs in a thread pool — use for CPU-bound or sync libraries. Mixing wrong = blocked event loop or wasted threads.',
      category: 'performance',
    },
    {
      content:
        'Use `Depends(...)` for everything reusable: DB sessions, auth, settings, common query params. The result is cached per-request by default (each `Depends(get_db)` returns the same session within one request). Disable per-request caching with `Depends(get_db, use_cache=False)` only when needed.',
      category: 'patterns',
    },
    {
      content:
        'For DB sessions, use a yield-style dependency: `async def get_db(): async with SessionLocal() as s: yield s`. The `yield` makes it a context manager — cleanup runs after the response. Without yield, sessions leak.',
      category: 'patterns',
    },
    {
      content:
        'Set `response_model=UserOut` on the endpoint decorator for output filtering. Without it, FastAPI returns whatever the function returns — possibly leaking fields. The response model strips and coerces.',
      category: 'security',
    },
    {
      content:
        'Use APIRouter to split endpoints by domain: `users_router = APIRouter(prefix=\'/users\', tags=[\'users\'])`. Mount with `app.include_router(users_router)`. One giant `app.py` file is unmaintainable past ~5 endpoints.',
      category: 'architecture',
    },
    {
      content:
        'HTTP status codes via the `status` module: `status.HTTP_201_CREATED`, `status.HTTP_404_NOT_FOUND`. Pass via `@router.post(..., status_code=status.HTTP_201_CREATED)`. Magic numbers (`200`, `404`) make code review harder.',
      category: 'conventions',
    },
    {
      content:
        'Custom exception handlers: `@app.exception_handler(MyError) async def handler(request, exc): return JSONResponse(...)`. Map domain exceptions to HTTP responses centrally — endpoint code stays free of HTTP details.',
      category: 'errors',
    },
    {
      content:
        'Background tasks via `BackgroundTasks` parameter: `def endpoint(bg: BackgroundTasks): bg.add_task(send_email, ...)`. Runs AFTER the response is sent — quick "fire and forget" only. For real queues use Celery, RQ, Arq, or Dramatiq — backed by Redis/RabbitMQ.',
      category: 'patterns',
    },
    {
      content:
        'Lifespan handler replaces deprecated `on_event(\'startup\'/\'shutdown\')`: `@asynccontextmanager async def lifespan(app): await db.connect(); yield; await db.disconnect()`. Pass to `FastAPI(lifespan=lifespan)`.',
      category: 'patterns',
    },
    {
      content:
        'Configuration: `pydantic-settings` (`BaseSettings`). Reads from env vars, validates types at boot. Inject as a dependency: `def settings() -> Settings: return Settings()` (cached).',
      category: 'security',
    },
    {
      content:
        'Authentication: `OAuth2PasswordBearer` for token URL boilerplate, then write a `get_current_user` dependency that decodes the JWT and fetches the user. Apply to routers via `dependencies=[Depends(require_auth)]` for whole-router protection.',
      category: 'security',
    },
    {
      content:
        'CORS: `app.add_middleware(CORSMiddleware, allow_origins=[FRONTEND_URL], allow_credentials=True, allow_methods=[\'*\'], allow_headers=[\'*\'])`. `allow_origins=[\'*\']` with `allow_credentials=True` is rejected by browsers.',
      category: 'security',
    },
    {
      content:
        'Pagination: explicit `limit: int = Query(20, le=100)` and `offset: int = Query(0, ge=0)`. Cap `limit` to prevent denial-of-service via huge result sets. Or use cursor-based pagination for large tables.',
      category: 'security',
    },
    {
      content:
        'For SQLAlchemy 2 async, use `AsyncSession` + `select(...)` style. The 1.x `query(...)` API works but blocks the event loop. Drivers: `asyncpg` for Postgres, `aiomysql` for MySQL — never `psycopg2` in async paths.',
      category: 'performance',
    },
    {
      content:
        'Type endpoint return values explicitly. Return Pydantic models or dicts that match `response_model`. FastAPI doesn\'t infer return types — annotation is documentation, not enforcement.',
      category: 'conventions',
    },
    {
      content:
        'Logging: configure once at app startup with `logging.config.dictConfig(LOGGING)`. Production logs in JSON (use `python-json-logger`). FastAPI itself uses `uvicorn` access logs — disable in production if you have an LB log.',
      category: 'errors',
    },
    {
      content:
        'Tests: `pytest-asyncio` + `httpx.AsyncClient(app=app)`. The client speaks ASGI directly — no socket binding. Use a separate test database with transaction rollback per test (factory or `pytest-postgresql`).',
      category: 'testing',
    },
    {
      content:
        'Production server: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app`. NEVER `uvicorn --reload` in production — it\'s dev-mode. Worker count = `2 * cores + 1` for CPU-bound, fewer for high-memory.',
      category: 'performance',
    },
    {
      content:
        'Validate environment-derived secrets at app construction, not on first use. A missing SECRET_KEY at request #10000 (when first JWT is signed) is much worse than a startup crash.',
      category: 'security',
    },
    {
      content:
        'Generate the OpenAPI spec for clients: `app.openapi()` returns the dict. Pin OpenAPI version, customize the schema generator if needed (`app.openapi = custom_openapi`). Front-end teams consume this for typed clients.',
      category: 'conventions',
    },
  ],
};
