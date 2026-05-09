import type { Preset } from '../../core/types.js';

export const trpcPreset: Preset = {
  id: 'trpc',
  name: 'tRPC',
  description: 'tRPC v11 typed RPC between TypeScript client and server.',
  type: 'tool',
  rules: [
    {
      content:
        'Compose routers with `router({ users: usersRouter, posts: postsRouter })`. Each sub-router is a self-contained module exporting procedures. The root router type (`type AppRouter = typeof appRouter`) is what the client imports — keep it as `type` only on the client to avoid bundling server code.',
      category: 'architecture',
    },
    {
      content:
        'Context is built per request: `createContext({ req, res })` returns `{ db, session }`. Procedures access via `ctx`. Heavy work (DB connect, auth lookup) belongs in middleware, not in `createContext` — that runs even for unauthenticated calls.',
      category: 'architecture',
    },
    {
      content:
        'Auth via middleware: `const isAuthed = t.middleware(({ ctx, next }) => { if (!ctx.session) throw new TRPCError({ code: \\\'UNAUTHORIZED\\\' }); return next({ ctx: { session: ctx.session } }) })`. Chain on procedures: `t.procedure.use(isAuthed).query(...)`.',
      category: 'security',
    },
    {
      content:
        'Validate every input with zod (or yup, valibot). Type annotations are erased at runtime — clients can send any payload. `t.procedure.input(z.object({...})).query(({input}) => ...)`.',
      category: 'security',
    },
    {
      content:
        'Mutations vs queries: queries are GET, idempotent, cacheable; mutations are POST, side-effectful, never cached. Pick based on semantics. Calling a mutation as a query (or vice versa) confuses tooling and disables caching/SSR.',
      category: 'conventions',
    },
    {
      content:
        'Batching is enabled by default with the HTTP batch link. Calls within ~10ms are coalesced into one HTTP request. Disable per-call with `httpLink` over `httpBatchLink` only when batching is genuinely wrong (long-poll-style requests).',
      category: 'performance',
    },
    {
      content:
        'For SSR / RSC: `createServerSideHelpers` (or `createTRPCProxyClient` with the server adapter) lets you call procedures directly on the server without HTTP. Used for prefetching in Next.js loaders / Server Components.',
      category: 'patterns',
    },
    {
      content:
        'Errors: throw `new TRPCError({ code: \\\'BAD_REQUEST\\\', message })` from procedures. The client receives typed errors. Built-in codes: BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INTERNAL_SERVER_ERROR, etc. Map domain errors to codes in middleware.',
      category: 'errors',
    },
    {
      content:
        'For the React client use `@trpc/react-query` — the integration with TanStack Query is what gives you `useQuery`/`useMutation` hooks with caching. Without it you call procedures via raw promises and lose the cache.',
      category: 'patterns',
    },
    {
      content:
        'Subscriptions over WebSocket: `t.procedure.subscription(...)` returns an `observable`. Requires the WS adapter (`createWSSHandler` server side, `wsLink` client side). Use sparingly — subscriptions are stateful and harder to scale.',
      category: 'architecture',
    },
    {
      content:
        'For monorepos, the tRPC server lives in `packages/api`, exports `type AppRouter = typeof appRouter`. The client app imports the type only: `import type { AppRouter } from \\\'@app/api\\\'`. Importing values pulls server code into the client bundle.',
      category: 'imports',
    },
    {
      content:
        'For file uploads, do NOT route through tRPC — use a direct REST endpoint or pre-signed S3 URLs. tRPC\'s payload is JSON; binary upload through it is inefficient.',
      category: 'patterns',
    },
    {
      content:
        'Output schemas: `.output(z.object(...))` validates the response too. Useful for catching accidental over-returning of fields (passwords, internal flags). Skipped at runtime in production by default — enable with `transformer` config.',
      category: 'security',
    },
    {
      content:
        'For Next.js App Router, the FetchAdapter (`createFetchHandler`) is the modern integration. Mount under `app/api/trpc/[trpc]/route.ts` exporting GET/POST. The legacy Next adapter is for Pages Router only.',
      category: 'architecture',
    },
  ],
};
