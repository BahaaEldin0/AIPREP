import type { Preset } from '../../core/types.js';

export const remixPreset: Preset = {
  id: 'remix',
  name: 'Remix',
  description: 'Remix routes with loader/action data flow on top of React Router.',
  type: 'framework',
  rules: [
    {
      content:
        'Each route file in `app/routes/` exports the data contract: `loader` (GET, runs on server, returns data), `action` (mutating verbs, runs on server), and a default React component receiving `useLoaderData()`. Wrong export name silently does nothing.',
      category: 'architecture',
    },
    {
      content:
        'Use `<Form method="post">` (from `@remix-run/react`) instead of raw `<form>`. The Remix `<Form>` integrates with `action` exports, handles redirects via `redirect()`, and progressively enhances submissions without losing no-JS support.',
      category: 'patterns',
    },
    {
      content:
        'Use `useFetcher()` for non-navigating mutations (delete-row, like, autosave). Unlike `<Form>`, fetcher submissions do not change the URL or revalidate every loader by default — they revalidate just the affected ones.',
      category: 'patterns',
    },
    {
      content:
        'Loaders return data via `json(data, init)` (from `@remix-run/node`). Always set Cache-Control headers for cacheable data: `json(data, { headers: { \'Cache-Control\': \'max-age=60, s-maxage=300, stale-while-revalidate=86400\' } })`. Default is no caching.',
      category: 'performance',
    },
    {
      content:
        'Redirect from a loader/action with `throw redirect(\'/login\')`. Redirect THROWS — do not put cleanup code after it. For permanent redirects pass `{ status: 301 }`.',
      category: 'patterns',
    },
    {
      content:
        'Error UI: each route can export `ErrorBoundary` to handle thrown errors and `CatchBoundary` (Remix v1) / responses thrown via `Response` (v2) for expected non-200 responses. Without these, errors bubble to the root error boundary.',
      category: 'errors',
    },
    {
      content:
        'File-based routing: Remix v2 flat routes use dot notation. `app/routes/blog.$slug.tsx` = `/blog/:slug`. `app/routes/_index.tsx` = `/`. Underscored segments are pathless layouts. Mixing v1 nested and v2 flat conventions is an anti-pattern.',
      category: 'architecture',
    },
    {
      content:
        'Use `useNavigation()` for global pending state (during navigation), `fetcher.state` for fetcher-specific pending. Treat them as the source of truth for spinners — do not roll your own loading state with `useState`.',
      category: 'patterns',
    },
    {
      content:
        'Validate form input on the server with zod. The browser can post any payload — TypeScript loader/action signatures are erased. On validation failure, return `json({ errors }, { status: 400 })` and surface from `useActionData()`.',
      category: 'security',
    },
    {
      content:
        'Authentication: a custom `requireUser(request)` helper inside loaders/actions that throws `redirect(\'/login\')` on missing session. Read sessions via `getSession(request.headers.get(\'Cookie\'))` — Remix\'s session storage is a thin wrapper, you choose cookie/db backed.',
      category: 'security',
    },
    {
      content:
        'Headers function (`export function headers()`) sets HTTP headers on the rendered HTML response. Use it for CSP, caching, and ETag. Loader headers and route headers compose — the framework picks the most specific.',
      category: 'performance',
    },
    {
      content:
        'Resource routes (no default export, only `loader`/`action`) serve non-HTML responses: JSON APIs, file downloads, robots.txt, RSS. Same routing rules apply.',
      category: 'architecture',
    },
    {
      content:
        'Environment variables come from `process.env` on the server. To expose a value to the client, return it from the root `loader` and read via `useLoaderData()` — never bundle secrets directly into the client.',
      category: 'security',
    },
    {
      content:
        'Optimistic UI: read submission data before the server responds via `fetcher.formData` / `useNavigation().formData`. Render the predicted next state immediately; revalidate corrects if wrong. Optimistic UI is the headline Remix DX win — use it on every mutation.',
      category: 'patterns',
    },
    {
      content:
        'Cookie/session: use `createCookieSessionStorage` for small data (≤4KB). For larger sessions use `createDatabaseSessionStorage` or Redis-backed. Sign cookies with a strong secret read from env.',
      category: 'security',
    },
    {
      content:
        'Type loader/action return values with `LoaderFunctionArgs`/`ActionFunctionArgs` parameter types and `useLoaderData<typeof loader>()` to infer the return type. Hand-rolled types drift from the implementation.',
      category: 'conventions',
    },
    {
      content:
        'Static assets: import them (`import logo from \'~/assets/logo.svg\'`) so they get URL-fingerprinted, OR put them in `public/` to serve at fixed paths. The bundler does not see `public/` — those paths must be hand-coded.',
      category: 'conventions',
    },
    {
      content:
        'For UI-only side effects (analytics events, auto-focus), use `useEffect` inside the component. For server-side logging in loaders, just call your logger — loaders run only on the server.',
      category: 'patterns',
    },
    {
      content:
        'Test E2E with Playwright against `remix vite:build && remix-serve build`. Loader/action logic can be unit-tested by importing and calling them directly with a mock `Request` — no React render required.',
      category: 'testing',
    },
    {
      content:
        'Adapter choice (Node, Vercel, Cloudflare Workers, Bun) constrains runtime APIs. Cloudflare Workers do not have Node\'s `fs`/`crypto`-by-default — pick the adapter early because changes are invasive.',
      category: 'architecture',
    },
  ],
};
