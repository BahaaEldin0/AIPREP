import type { Preset } from '../../core/types.js';

export const nextjsAppRouterPreset: Preset = {
  id: 'nextjs-approuter',
  name: 'Next.js (App Router)',
  description: 'Next.js 13+ with the app/ directory: RSC, Server Actions, streaming.',
  type: 'framework',
  rules: [
    // Architecture
    {
      content:
        'Default every component to a Server Component. Add `\'use client\'` ONLY when the file uses: useState/useReducer/useEffect/useLayoutEffect, event handlers, browser-only APIs (window, localStorage, IntersectionObserver), or context providers that depend on those. The directive turns the WHOLE module + everything imported under it into a client bundle — push it as far down the tree as possible.',
      category: 'architecture',
    },
    {
      content:
        'Use the App Router file conventions exactly: `page.tsx` (route segment), `layout.tsx` (shared shell), `loading.tsx` (Suspense fallback), `error.tsx` (error boundary), `not-found.tsx` (404), `route.ts` (HTTP handler), `template.tsx` (re-mounted layout). Wrong filename = Next ignores it silently.',
      category: 'architecture',
    },
    {
      content:
        'Group routes with `(groupName)` directories — these segments are stripped from the URL but let you scope a layout to a subset of pages. Use intercepting routes `(.)folder` and parallel routes `@slot` for modals and split UI.',
      category: 'architecture',
    },
    {
      content:
        'Fetch data in Server Components with plain `async/await` — never via `useEffect` + state. The runtime executes the component on the server, awaits, and streams the result. Pulling data into a Client Component forces a client roundtrip.',
      category: 'architecture',
    },
    {
      content:
        'Colocate route-only code (components, schemas, helpers) inside the route segment directory. If a component is shared by multiple routes, lift it to `app/_components/` (the leading underscore opts out of routing) or `src/components/`. Do NOT export from a `page.tsx` file.',
      category: 'architecture',
    },
    {
      content:
        'For dynamic segments use `app/[slug]/page.tsx`. The page receives `params: Promise<{ slug: string }>` in Next.js 15 — `await` it before accessing fields. In Next 14 and earlier, `params` was synchronous.',
      category: 'architecture',
    },
    // Conventions
    {
      content:
        'Define page metadata via `export const metadata: Metadata = {...}` or `export async function generateMetadata({ params }) {...}` at the route file. Never render `<Head>` from `next/head` — that is Pages Router only and is a no-op in app/.',
      category: 'conventions',
    },
    {
      content:
        'Use `<Image>` from `next/image` for every raster image. Provide explicit `width` and `height` (or `fill` with a `position: relative` parent). Without dimensions Next cannot prevent layout shift and falls back to an unoptimized loader.',
      category: 'conventions',
    },
    {
      content:
        'Use `<Link>` from `next/link` for in-app navigation. Plain `<a href="/foo">` triggers a full document reload, blowing away client state and prefetched data. External links keep `<a target="_blank" rel="noopener noreferrer">`.',
      category: 'conventions',
    },
    {
      content:
        'Load fonts via `next/font/google` or `next/font/local` in the root `layout.tsx`. Apply them as a CSS variable on `<html>`. Avoid linking to Google Fonts in `<head>` — the next/font loader self-hosts and eliminates a render-blocking request.',
      category: 'conventions',
    },
    {
      content:
        'Import from `next/navigation` (App Router): `useRouter`, `usePathname`, `useSearchParams`, `redirect`, `notFound`. Importing from `next/router` is a Pages Router artifact and crashes at runtime in app/.',
      category: 'imports',
    },
    {
      content:
        'Route-segment directory names are lowercase-kebab-case (`/blog-posts/[slug]`). Component file names follow your project convention (PascalCase or kebab-case) but `page`, `layout`, `loading`, `error`, `not-found`, `route` MUST be lowercase exactly — they are reserved.',
      category: 'conventions',
    },
    // Patterns
    {
      content:
        'For form submissions and mutations, write a Server Action: a function annotated with `\'use server\'` either at top of file or as the first line of the function body. Pass it directly to `<form action={action}>` or to `useFormState`. Server Actions are POST endpoints under the hood and integrate with revalidation.',
      category: 'patterns',
    },
    {
      content:
        'After mutating data, call `revalidatePath(\'/blog\')` or `revalidateTag(\'posts\')` in the Server Action. Without revalidation the next request still serves the stale cached page. Tag-based invalidation requires fetches that opted into the tag: `fetch(url, { next: { tags: [\'posts\'] } })`.',
      category: 'patterns',
    },
    {
      content:
        'For static generation of dynamic routes, export `generateStaticParams()` returning an array of param objects. This replaces the Pages Router `getStaticPaths`. Pages not returned will respond with 404 unless `dynamicParams = true` (default) is set.',
      category: 'patterns',
    },
    {
      content:
        'Wrap slow data fetches in `<Suspense fallback={...}>` boundaries. Each boundary streams independently — finer boundaries unblock above-the-fold UI sooner. A `loading.tsx` file in a route segment becomes the implicit Suspense boundary for that segment.',
      category: 'patterns',
    },
    {
      content:
        'Deduplicate identical fetches across one render pass with React\'s `cache()` (from `react`, not `next/cache`). Wrap a function once at module scope: `export const getUser = cache(async (id) => ...)`. Calls with the same args inside the same request return the same promise.',
      category: 'performance',
    },
    {
      content:
        'Reaching for `cookies()`, `headers()`, or `searchParams` makes a route segment dynamic — it opts OUT of static rendering and full-route caching. Be intentional: if you need request-scoped data, accept that this segment is server-rendered every request.',
      category: 'performance',
    },
    {
      content:
        'Force route behavior with the segment options when defaults bite: `export const dynamic = \'force-dynamic\' | \'force-static\'`, `export const revalidate = 60` (ISR seconds), `export const fetchCache = \'force-cache\' | \'force-no-store\'`. Default is `\'auto\'` and depends on the data fetches inside.',
      category: 'performance',
    },
    {
      content:
        'Authentication checks belong in `middleware.ts` for redirect-on-unauthenticated. Inside Server Components / Server Actions, read the session via the auth library\'s `auth()`/`getSession()` helper — do not import auth state from a Client Component.',
      category: 'security',
    },
    {
      content:
        'Use Parallel Routes (`@modal`, `@sidebar`) when one URL must render multiple independent panels. Use Intercepting Routes (`(.)photo/[id]`) when the same URL should render differently depending on whether it was navigated to or refreshed (e.g., modal vs. full page).',
      category: 'patterns',
    },
    // Errors
    {
      content:
        'Every route segment that can throw should have an `error.tsx` boundary. The file MUST start with `\'use client\'` (Error boundaries must be Client Components), accept `{ error, reset }` props, and call `reset()` to retry rendering.',
      category: 'errors',
    },
    {
      content:
        'Place `app/global-error.tsx` for errors that escape the root layout. Unlike segment-level `error.tsx`, it must render its own `<html>` and `<body>` — the root layout is unmounted at this point.',
      category: 'errors',
    },
    {
      content:
        'Inside a Server Component or Server Action, call `notFound()` from `next/navigation` to render the nearest `not-found.tsx`. Call `redirect(url)` to redirect — both functions throw, so do not wrap them in try/catch and do not put cleanup code after them.',
      category: 'errors',
    },
    {
      content:
        'Route Handlers in `route.ts` must export named HTTP method functions (`GET`, `POST`, etc.) and return a `NextResponse`. Use `NextResponse.json(data, { status: 400 })` rather than constructing `new Response`. Always set explicit status codes; default 200 on a failure path is a bug.',
      category: 'errors',
    },
    // Testing
    {
      content:
        'For component tests use `@testing-library/react`. Mock `next/navigation` (not `next/router`): `vi.mock(\'next/navigation\', () => ({ useRouter: () => ({ push: vi.fn() }) }))`. Server Components are best tested via Playwright/Cypress against a built app.',
      category: 'testing',
    },
    {
      content:
        'Use the official `@playwright/test` runner with the Next dev server for end-to-end. Run against `next start` (production build) in CI — `next dev` reroutes through HMR and produces flaky network timing.',
      category: 'testing',
    },
    // Security
    {
      content:
        'Validate every Server Action input with zod (or equivalent). The browser can call any Server Action with arbitrary payloads — type annotations are erased at runtime. Reject early and return typed errors via `useFormState`.',
      category: 'security',
    },
    {
      content:
        'Mark server-only modules with `import \'server-only\'` at the top. If a Client Component imports it transitively, the build fails — protecting you from leaking DB credentials or admin SDKs into the browser bundle.',
      category: 'security',
    },
    {
      content:
        'Never expose API keys to the client. Variables prefixed `NEXT_PUBLIC_` are inlined into the client bundle and visible in DevTools. Anything sensitive stays unprefixed and is read only inside Server Components, Route Handlers, or Server Actions.',
      category: 'security',
    },
    {
      content:
        'Set Content Security Policy via `middleware.ts` using a per-request nonce. Inline scripts (including some Next.js scripts) need the nonce — read it from headers in Server Components and pass it to the relevant `<Script nonce={nonce}>`.',
      category: 'security',
    },
  ],
  conditionalRules: [
    {
      when: 'prisma',
      content:
        'Run Prisma queries inside Server Components, Route Handlers, and Server Actions only. Never import the Prisma client into a Client Component — it pulls the entire engine bundle into the browser. Use a `lib/db.ts` module that exports a singleton via `globalThis` to survive HMR.',
      category: 'architecture',
    },
    {
      when: 'tailwind',
      content:
        'Conditionally compose Tailwind classes with a `cn()` helper that wraps `clsx` + `tailwind-merge` so conflicting utilities (`p-2 p-4`) resolve to the last one. Place it in `lib/utils.ts` and import everywhere class names are dynamic.',
      category: 'patterns',
    },
    {
      when: 'tanstack-query',
      content:
        'TanStack Query needs a Client Component provider. Create `app/providers.tsx` with `\'use client\'`, instantiate `QueryClient` inside `useState(() => new QueryClient())` (so it is per-render not module-shared), and wrap `children` with `<QueryClientProvider>`. For SSR data, hydrate with `HydrationBoundary` + `dehydrate`.',
      category: 'patterns',
    },
  ],
};
