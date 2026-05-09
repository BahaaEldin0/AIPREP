import type { Preset } from '../../core/types.js';

export const expressPreset: Preset = {
  id: 'express',
  name: 'Express',
  description: 'Express.js with TypeScript: middleware, async errors, routing.',
  type: 'framework',
  rules: [
    {
      content:
        'Middleware order is load-bearing. Apply in this sequence: `helmet()` → `cors()` → `compression()` → body parsers (`express.json()`, `express.urlencoded()`) → request logger → routes → 404 handler → error handler. Wrong order = security headers missing or CORS preflight failing.',
      category: 'architecture',
    },
    {
      content:
        'Error-handling middleware MUST take 4 arguments: `(err, req, res, next) => {...}`. Express identifies it by arity. Three-arg versions are never invoked on error. Place it LAST — after all routes.',
      category: 'errors',
    },
    {
      content:
        'Express 4 does NOT auto-catch async errors. Either install `express-async-errors` (top of entry file) which monkey-patches the router, or wrap every async handler: `const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`. Express 5 fixes this — but most projects are still on 4.',
      category: 'errors',
    },
    {
      content:
        'Use `express.Router()` to split routes into files: `routes/users.ts` exports a router, `app.use(\'/users\', usersRouter)`. One giant `app.get(...)` file is unmaintainable past ~10 endpoints.',
      category: 'architecture',
    },
    {
      content:
        'Validate every request input — body, query, params, headers — at the route boundary BEFORE business logic. Use zod or joi: `const dto = Schema.parse(req.body)` and let the error bubble to the error handler. Never trust types — they\'re erased at runtime.',
      category: 'security',
    },
    {
      content:
        'Read configuration once at boot from environment variables, validate with zod, freeze the result. Code reads from a typed `config` module — NEVER `process.env.X` scattered through business logic.',
      category: 'patterns',
    },
    {
      content:
        'Use `pino` (with `pino-http` middleware) or `winston` for logging. NO `console.log` in production paths — pino is 5-10x faster, JSON-structured by default, and integrates with log aggregators.',
      category: 'errors',
    },
    {
      content:
        'Always send a response. Forgetting `return res.json(...)` after a guard clause leads to "Cannot set headers after they are sent" — caused by both the guard AND the rest of the handler responding. Use `return` or early-throw.',
      category: 'errors',
    },
    {
      content:
        'Return consistent response shapes. Pick one: `{ ok: true, data }` / `{ ok: false, error: { code, message } }`. Mixed shapes (sometimes `{data}`, sometimes raw arrays) force every client to special-case.',
      category: 'conventions',
    },
    {
      content:
        'Set explicit HTTP status codes. `res.json(data)` defaults to 200 — wrong for created (201), no content (204), or partial errors. `res.status(201).json(data)`.',
      category: 'conventions',
    },
    {
      content:
        'Apply rate limiting on auth and write endpoints with `express-rate-limit`. Protect login from credential stuffing (e.g., 5 attempts per 15 min per IP) and writes from accidental DoS. Use a Redis store in production — in-memory loses state on restart.',
      category: 'security',
    },
    {
      content:
        'Configure CORS narrowly: `cors({ origin: env.FRONTEND_URL, credentials: true })`. `origin: \'*\'` with `credentials: true` is invalid per spec — browsers reject it. Whitelist explicitly.',
      category: 'security',
    },
    {
      content:
        'Set body parser limits: `express.json({ limit: \'1mb\' })`. Default 100kb is OK for JSON APIs; large uploads should bypass JSON parser entirely and stream via `multer` or busboy.',
      category: 'security',
    },
    {
      content:
        'Add a request-ID middleware (`express-request-id` or hand-rolled): generate a UUID per request, attach to `req.id`, include in every log line. Without correlation IDs you cannot trace a request across logs.',
      category: 'patterns',
    },
    {
      content:
        'Graceful shutdown: listen for `SIGTERM`/`SIGINT`, stop accepting new connections (`server.close()`), close the DB pool, then exit. Without this Kubernetes/PM2 may kill in-flight requests.',
      category: 'patterns',
    },
    {
      content:
        'Authentication middleware mounted before protected routes attaches `req.user`. Type extension: declare a global namespace augmenting `Request` so `req.user` is typed throughout. Without it, downstream handlers cast to `any`.',
      category: 'security',
    },
    {
      content:
        'Routes are thin: validate input, call a service, return the result. NO business logic inside route handlers — extract to a service layer (`services/userService.ts`). This keeps tests free of mocking Express internals.',
      category: 'architecture',
    },
    {
      content:
        'Custom error classes carry HTTP status: `class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }`. The error middleware reads `err.status` (defaulting to 500) and renders the response.',
      category: 'errors',
    },
    {
      content:
        'Health check endpoint `/health` (or `/healthz`) returns 200 with no auth and minimal work. Liveness vs readiness probes: liveness should NOT check DB (DB outage shouldn\'t kill pods); readiness can.',
      category: 'patterns',
    },
    {
      content:
        'Trust proxy when behind a load balancer: `app.set(\'trust proxy\', 1)`. Without it `req.ip` shows the LB\'s IP, breaking rate limits and audit logs. Set the right number of hops — `1` for one proxy, more for nested.',
      category: 'security',
    },
    {
      content:
        'Use `dotenv` only for local dev; in containers and CI, env vars come from the platform. Calling `dotenv.config()` in production is fine but unnecessary. Do NOT commit `.env` — `.env.example` documents the keys.',
      category: 'security',
    },
    {
      content:
        'Test routes with `supertest`: `await request(app).post(\'/users\').send({...}).expect(201)`. Test the service layer separately with unit tests. Mocking Express internals (`mockRequest`, `mockResponse`) is brittle.',
      category: 'testing',
    },
    {
      content:
        'TypeScript: type route handlers with `RequestHandler<Params, ResBody, ReqBody, Query>`. Hand-rolling `(req: Request, res: Response)` loses inference of `req.params` and `req.body`.',
      category: 'conventions',
    },
    {
      content:
        'Static files served from `app.use(express.static(\'public\', { maxAge: \'1y\', immutable: true }))`. Serve cache-busting filenames (with hashes) — without `immutable`/`maxAge`, the CDN keeps revalidating.',
      category: 'performance',
    },
  ],
};
