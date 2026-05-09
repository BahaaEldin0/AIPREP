import type { Preset } from '../../core/types.js';

export const honoPreset: Preset = {
  id: 'hono',
  name: 'Hono',
  description: 'Hono router for edge runtimes (Cloudflare Workers, Deno, Bun, Node).',
  type: 'framework',
  rules: [
    {
      content:
        'Hono runs on the Web Standard `Request`/`Response` API — not Node-specific. That means no `req.body` (use `await c.req.json()`), no `res.send` (return `c.json(data)`), no Node streams (use Web Streams).',
      category: 'architecture',
    },
    {
      content:
        'Type the app with generics: `new Hono<{ Bindings: Env; Variables: { user: User } }>()`. `Bindings` is platform env (Cloudflare KV/D1/Queue). `Variables` is per-request state set by middleware via `c.set(\'user\', user)`.',
      category: 'conventions',
    },
    {
      content:
        'Middleware chain runs in registration order. Each middleware MUST call `await next()` to continue or return a Response to short-circuit. Forgetting `await next()` silently hangs the request.',
      category: 'patterns',
    },
    {
      content:
        'Validate input with `@hono/zod-validator`: `app.post(\'/users\', zValidator(\'json\', schema), (c) => { const data = c.req.valid(\'json\'); ... })`. The validator runs before the handler and rejects with a 400 on failure.',
      category: 'security',
    },
    {
      content:
        'Compose sub-routers with `app.route(\'/users\', usersRouter)`. Each router has its own type chain. Mounting preserves path prefix and middleware scope — children inherit parent middleware.',
      category: 'architecture',
    },
    {
      content:
        'Use `c.req.param(\'id\')` for path params, `c.req.query(\'q\')` for query, `c.req.header(\'authorization\')` for headers. The `c.req.raw` is the underlying `Request` for advanced cases (streaming, signal).',
      category: 'patterns',
    },
    {
      content:
        'Edge runtime constraints: NO `fs`, NO `process` (use `c.env`), NO `Buffer` (use `Uint8Array`). Top-level `await` is allowed; long-running async (`setInterval`) is NOT — Workers terminate after the response.',
      category: 'architecture',
    },
    {
      content:
        'For Cloudflare Workers, environment access goes through the context: `c.env.DATABASE_URL`. Direct `process.env` is undefined. The `Env` type generic (`new Hono<{ Bindings: Env }>()`) gives you autocomplete.',
      category: 'security',
    },
    {
      content:
        'Built-in middleware: `cors()`, `logger()`, `prettyJSON()`, `secureHeaders()`, `csrf()`, `bearerAuth()`, `basicAuth()`. Import from `hono/<name>` — the modular imports keep cold start small.',
      category: 'imports',
    },
    {
      content:
        'For JWT auth, `import { jwt } from \'hono/jwt\'`. Apply per route: `app.use(\'/api/*\', jwt({ secret: c.env.JWT_SECRET }))`. The decoded payload is on `c.get(\'jwtPayload\')`.',
      category: 'security',
    },
    {
      content:
        'RPC pattern: chain `.get/.post` returns and export the type. The client uses `hc<typeof app>(\'http://...\')` for fully typed fetch — no separate API client. This is the Hono headline DX feature; use it.',
      category: 'patterns',
    },
    {
      content:
        'Streaming: return a `streamSSE(c, async (stream) => { await stream.writeSSE({...}) })` for SSE, `stream(c, async (stream) => {...})` for raw streams. Never assemble the whole response in memory if it can stream.',
      category: 'performance',
    },
    {
      content:
        'Error handling: `app.onError((err, c) => { console.error(err); return c.json({ error: err.message }, 500) })`. For 404 use `app.notFound((c) => c.json({ error: \'not found\' }, 404))`.',
      category: 'errors',
    },
    {
      content:
        'Deploy targets differ in package: Cloudflare Workers uses `wrangler deploy`, Bun uses `Bun.serve`, Node uses `@hono/node-server`. The Hono app code is identical — only the entry adapter changes.',
      category: 'architecture',
    },
    {
      content:
        'Test with `app.request(\'/path\', { method: \'POST\', body })` — returns a `Response` directly. No HTTP server needed; ideal for unit tests. Combine with vitest for fast feedback.',
      category: 'testing',
    },
    {
      content:
        'CORS: `app.use(\'*\', cors({ origin: c => c.env.FRONTEND_URL, credentials: true }))`. The function form of `origin` runs per request — useful for multi-tenant apps where origin depends on the request.',
      category: 'security',
    },
  ],
};
