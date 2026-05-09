import type { Preset } from '../../core/types.js';

export const fastifyPreset: Preset = {
  id: 'fastify',
  name: 'Fastify',
  description: 'Fastify with schema validation, plugins, and TypeBox/zod integration.',
  type: 'framework',
  rules: [
    {
      content:
        'Define request and response schemas on every route. Fastify uses them for validation (input rejected with 400 on failure) AND for serialization (response body is fast-stringified by JIT-compiled code). Skipping schemas costs 30-50% throughput.',
      category: 'patterns',
    },
    {
      content:
        'For schema authoring choose ONE: TypeBox (TypeScript-first, JIT-friendly) or zod via `fastify-type-provider-zod`. JSON Schema literals work but lose type inference. Mixing styles within one project is confusing.',
      category: 'conventions',
    },
    {
      content:
        'Encapsulate features in plugins. Without `fastify-plugin`, decorators/hooks/decorations are confined to the registering scope (good — that is the encapsulation model). Wrap with `fp(plugin)` ONLY when you genuinely want to break encapsulation (e.g., shared DB pool).',
      category: 'architecture',
    },
    {
      content:
        'Decorate the instance with shared resources: `fastify.decorate(\'db\', dbPool)`. Inside handlers: `request.server.db.query(...)`. Type the decoration with module augmentation so `server.db` is typed across files.',
      category: 'patterns',
    },
    {
      content:
        'Async handlers: just `return result` or `throw err`. Fastify catches the rejection and serializes via the registered error handler. Try/catch is only needed if you want to transform errors before re-throwing.',
      category: 'errors',
    },
    {
      content:
        '`reply.send(payload)` returns the reply object — do NOT `return reply.send(...)` then also `return data` afterwards. Either `return data` (Fastify calls send) OR `await reply.send(data)` then return nothing. Mixing the two is a "double send" bug.',
      category: 'errors',
    },
    {
      content:
        'Centralized error handling: `fastify.setErrorHandler((err, req, reply) => {...})` per scope. Plugin scopes can have their own — child scopes inherit parent\'s if none set. Log with `req.log.error({ err })`, send appropriate status.',
      category: 'errors',
    },
    {
      content:
        'Type routes with `RouteGenericInterface`: `fastify.get<{ Params: { id: string }; Querystring: { limit?: number } }>(...)`. Pair with the type provider (`@sinclair/typebox` or zod) for automatic schema-to-types.',
      category: 'conventions',
    },
    {
      content:
        'Use Fastify\'s built-in pino logger (`request.log.info({ ... })`). Adding a second logger duplicates output and adds overhead. Configure via the constructor: `Fastify({ logger: { level: \'info\', redact: [\'req.headers.authorization\'] } })`.',
      category: 'errors',
    },
    {
      content:
        'Lifecycle hooks (`onRequest`, `preParsing`, `preValidation`, `preHandler`, `preSerialization`, `onSend`, `onResponse`) run in order. Auth checks belong in `preHandler`. `onRequest` is too early to read body; `onSend` is too late to short-circuit.',
      category: 'architecture',
    },
    {
      content:
        'Custom content-type parsers: `fastify.addContentTypeParser(\'application/jwt\', { parseAs: \'string\' }, (req, body, done) => done(null, decode(body)))`. Built-in parsers cover JSON, urlencoded, and binary streams.',
      category: 'patterns',
    },
    {
      content:
        'Graceful shutdown: `await fastify.close()` in your SIGTERM handler. Plugins\' `onClose` hooks run in reverse-registration order — your DB plugin closes after the route plugin stops accepting requests.',
      category: 'patterns',
    },
    {
      content:
        'Rate limiting via `@fastify/rate-limit`. Configure per-route by adding `config.rateLimit` to the route options. Use Redis store in production (multi-instance).',
      category: 'security',
    },
    {
      content:
        'Security headers via `@fastify/helmet`. CORS via `@fastify/cors`. Cookie via `@fastify/cookie`. JWT auth via `@fastify/jwt`. The official plugins are tested against Fastify\'s plugin system; community alternatives often miss encapsulation rules.',
      category: 'security',
    },
    {
      content:
        'Declare routes synchronously inside a plugin or at top level. Async route declaration (e.g., inside a `setTimeout`) means the route may not be registered when `listen` is called. Fastify enforces "ready" state.',
      category: 'errors',
    },
    {
      content:
        'Never mutate `request.body` after validation — validators populate it from raw input. Add transformed copies as `request.context` decorations: `request.parsedBody = ...`.',
      category: 'patterns',
    },
    {
      content:
        'For multi-part uploads use `@fastify/multipart`. Default file size limit is 1MB — raise via `attachFieldsToBody: true, limits: { fileSize: 10_000_000 }`. Always set a limit; unbounded uploads are a DoS vector.',
      category: 'security',
    },
    {
      content:
        'Reply streams: `reply.send(stream)` works directly with Node streams. For server-sent events use `@fastify/sse-v2` or write directly with `reply.raw.write(...)` — but then YOU manage backpressure.',
      category: 'patterns',
    },
    {
      content:
        'Test with `fastify.inject({ method, url, payload })` — synthetic HTTP requests without binding a port. Faster than supertest and isolates from network. Plain unit tests for service modules called by routes.',
      category: 'testing',
    },
    {
      content:
        'Configure trust-proxy when behind a load balancer: `Fastify({ trustProxy: true })`. Set the count of hops if multiple — same correctness concern as Express.',
      category: 'security',
    },
  ],
};
