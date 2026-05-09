import type { Preset } from '../../core/types.js';

export const rustAxumPreset: Preset = {
  id: 'rust-axum',
  name: 'Axum',
  description: 'Rust web framework on Tokio + Tower with strong typed extractors.',
  type: 'framework',
  rules: [
    {
      content:
        'Handlers are async functions that return anything implementing `IntoResponse`. Common returns: `Json<T>`, `(StatusCode, Json<T>)`, `Result<Json<T>, AppError>`. Avoid `Response<Body>` directly — `IntoResponse` is more ergonomic.',
      category: 'architecture',
    },
    {
      content:
        'Extractor order in handler signature matters. `Body`-consuming extractors (`Json`, `Form`, `Bytes`) MUST be the LAST argument — there\'s only one body. Putting `Json<T>` before `State<S>` compiles but might confuse readers.',
      category: 'patterns',
    },
    {
      content:
        '`State<T>` (axum 0.7+) for application state shared across handlers — `Router::new().with_state(state)`. `Extension<T>` is the older mechanism; prefer `State` for new code (compile-time enforced, no runtime panic on missing).',
      category: 'patterns',
    },
    {
      content:
        'Custom error type: `enum AppError { NotFound, BadRequest(String), Internal(anyhow::Error) }` with `impl IntoResponse`. Handlers return `Result<T, AppError>`; the impl maps to status codes and JSON. Centralizes error → HTTP mapping.',
      category: 'errors',
    },
    {
      content:
        'Convert anyhow/thiserror errors at the boundary: `?` propagation works if you `impl From<E> for AppError`. Don\'t leak `anyhow::Error` to the client — it formats poorly and may include sensitive context.',
      category: 'errors',
    },
    {
      content:
        'Middleware via Tower layers: `Router::new().layer(TraceLayer::new_for_http()).layer(CompressionLayer::new())`. Layer ordering: layers are wrapped OUTSIDE-IN — last `.layer()` call wraps first. Or use `ServiceBuilder` for clearer top-down ordering.',
      category: 'architecture',
    },
    {
      content:
        'For shared mutable state (caches, counters), wrap in `Arc<RwLock<T>>` or `Arc<Mutex<T>>`. For DB pools (sqlx::PgPool, deadpool), the pool itself is `Clone` and internally synchronized — wrap in `Arc` only if you also need other state.',
      category: 'patterns',
    },
    {
      content:
        'JSON: `Json<T>` extractor (with `serde::Deserialize`) validates and parses input; `Json<U>` response (with `serde::Serialize`) writes output. Always derive `#[serde(deny_unknown_fields)]` on input DTOs to reject extra keys (security).',
      category: 'security',
    },
    {
      content:
        'Validation via `validator` crate or `garde`: derive `Validate` on the DTO, then `payload.validate()?` after extraction. Axum doesn\'t auto-validate — extract, then validate, then process.',
      category: 'security',
    },
    {
      content:
        'Tracing for observability: `tracing` + `tracing-subscriber`. Span every request via `TraceLayer::new_for_http()`. Inside handlers: `tracing::info!(user_id = %user.id, "fetched user")`. Structured fields = queryable logs.',
      category: 'errors',
    },
    {
      content:
        'Graceful shutdown: `axum::serve(listener, app).with_graceful_shutdown(shutdown_signal()).await`. The signal future awaits SIGINT/SIGTERM; the server drains in-flight before returning.',
      category: 'patterns',
    },
    {
      content:
        'Handler types: ALL extractors are `Send + Sync`-bounded by axum. Holding non-Send types (e.g., `Rc`, `RefCell`) across an `.await` is a compile error — use `Arc` and `Mutex`/`RwLock`.',
      category: 'errors',
    },
    {
      content:
        'For routes with path params, use typed extractors: `Path((id, slug)): Path<(Uuid, String)>`. Without typing, you get strings and lose validation. UUID parse failures convert to 400 automatically.',
      category: 'patterns',
    },
    {
      content:
        'CORS via `tower_http::cors::CorsLayer`. Configure narrowly: `CorsLayer::new().allow_origin([\"https://app.example.com\".parse().unwrap()]).allow_credentials(true)`. `Any` + credentials is rejected by browsers.',
      category: 'security',
    },
    {
      content:
        'Body size limits via `RequestBodyLimitLayer`. Default in axum is unlimited — set explicitly. Pair with timeout layers (`tower_http::timeout::TimeoutLayer`) for DoS resistance.',
      category: 'security',
    },
    {
      content:
        'Routing: `Router::new().route("/users/:id", get(get_user).post(update_user)).nest("/admin", admin_router)`. Sub-routers compose cleanly; `.nest` strips the prefix from the inner router\'s view.',
      category: 'architecture',
    },
    {
      content:
        'Tests: write integration tests using `axum::Router` + `TestServer` (axum-test crate) OR `tower::ServiceExt::oneshot` to call the router directly. No need for a TCP socket in unit tests.',
      category: 'testing',
    },
    {
      content:
        'Async runtime: Tokio — `#[tokio::main(flavor = "multi_thread")]` for the binary. Worker threads default to CPU count; tune `worker_threads` if your workload is mostly I/O-bound (lower) vs CPU-bound (higher).',
      category: 'performance',
    },
  ],
};
