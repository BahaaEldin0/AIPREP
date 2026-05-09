import type { Preset } from '../../core/types.js';

export const nextjsPagesPreset: Preset = {
  id: 'nextjs-pages',
  name: 'Next.js (Pages Router)',
  description: 'Legacy Next.js with pages/ directory: getServerSideProps, getStaticProps, ISR.',
  type: 'framework',
  rules: [
    {
      content:
        'Choose the data-fetching method per page: `getStaticProps` for build-time HTML; `getStaticProps` + `revalidate: N` for ISR (regenerate at most every N seconds); `getServerSideProps` for per-request rendering. NEVER use both on the same page — Next will throw at build.',
      category: 'architecture',
    },
    {
      content:
        'For dynamic static routes, pair `getStaticProps` with `getStaticPaths`. Set `fallback: \'blocking\'` for production (server-renders unknown paths on demand and caches), `fallback: false` for a fixed set, `fallback: true` for a placeholder loading state in the page.',
      category: 'architecture',
    },
    {
      content:
        'API routes live under `pages/api/`. Default body parser limit is 1 MB — for file uploads either disable via `export const config = { api: { bodyParser: false } }` and parse manually, or raise the limit via `bodyParser: { sizeLimit: \'10mb\' }`.',
      category: 'architecture',
    },
    {
      content:
        'Customize the document shell in `pages/_document.tsx` (one-time HTML/Head setup, never re-renders). Customize per-render layout/state in `pages/_app.tsx`. Do not put `<Head>` content in `_document` that needs to be page-specific — that goes in `_app` or the page.',
      category: 'architecture',
    },
    {
      content:
        'Use `next/router` (NOT `next/navigation` — that is App Router only). Inside components: `import { useRouter } from \'next/router\'`. Imperative navigation: `router.push(url, as, options)`.',
      category: 'imports',
    },
    {
      content:
        'Set page metadata via `<Head>` from `next/head`. The Metadata API (`export const metadata`) is App Router only — it is silently ignored in Pages Router pages.',
      category: 'conventions',
    },
    {
      content:
        'Per-page layouts: assign `Page.getLayout = (page) => <Layout>{page}</Layout>` and inside `_app.tsx` call `Component.getLayout?.(<Component {...pageProps} />) ?? <Component />`. Without this you get full re-renders of the layout on every navigation.',
      category: 'patterns',
    },
    {
      content:
        'Avoid `getInitialProps` — it disables Automatic Static Optimization and forces every page to SSR. Reach for `getServerSideProps` / `getStaticProps` instead. Only `_app` legitimately uses `getInitialProps` for app-wide data, and even there prefer alternatives.',
      category: 'performance',
    },
    {
      content:
        'For ISR with on-demand revalidation, call `await res.revalidate(\'/blog\')` from an API route protected by a secret. Hitting it repeatedly is cheap; the regeneration is debounced.',
      category: 'patterns',
    },
    {
      content:
        'API handlers must return after writing the response: `res.status(200).json({ ok: true })` then `return`. Forgetting `return` after a guard clause sends two responses and crashes the runtime.',
      category: 'errors',
    },
    {
      content:
        'Use `<Link>` from `next/link` with `prefetch={true}` (default) for in-app navigation. As of Next.js 13 the obsolete `<a>` child is no longer required — `<Link href>` renders the anchor itself.',
      category: 'conventions',
    },
    {
      content:
        'Images go through `<Image>` from `next/image` — same rules as App Router. The image optimizer requires `next.config.js` `images.domains` (or `remotePatterns`) entries for any external host you load from.',
      category: 'performance',
    },
    {
      content:
        'For client-side data fetching, prefer SWR or TanStack Query over raw `useEffect + fetch`. Both deduplicate, cache, and revalidate on focus/reconnect — `useEffect` does none of that and creates inconsistent UI state.',
      category: 'patterns',
    },
    {
      content:
        'Environment variables prefixed `NEXT_PUBLIC_` are inlined into the client bundle. Anything else is server-only (available in `getServerSideProps`, `getStaticProps`, API routes, `_app` server side).',
      category: 'security',
    },
    {
      content:
        'Custom 404/500 pages: `pages/404.tsx`, `pages/500.tsx`. They are statically generated unless they use `getServerSideProps` or `getInitialProps`. The default 500 page does not show stack traces — implement your own only if you need branded error UI.',
      category: 'errors',
    },
    {
      content:
        'When migrating to App Router incrementally, you can host both `pages/` and `app/` together. The App Router takes precedence for matching routes. Move pages one at a time and delete the `pages/` version only after verifying the new one renders.',
      category: 'architecture',
    },
    {
      content:
        'Configure the production server explicitly: `next start -p 3000`. Do not run `next dev` in production — it ships HMR, source maps, and unoptimized builds. The build step is `next build` followed by `next start`.',
      category: 'performance',
    },
    {
      content:
        'Use `getServerSideProps` (or middleware) for authentication redirects: return `{ redirect: { destination: \'/login\', permanent: false } }`. Inside a component, redirect via `router.replace` only AFTER first paint — server-side redirect avoids a flash of protected content.',
      category: 'security',
    },
    {
      content:
        'For TypeScript, type props returned from `getStaticProps`/`getServerSideProps` with `InferGetStaticPropsType<typeof getStaticProps>` and `InferGetServerSidePropsType<typeof getServerSideProps>`. Hand-rolled prop types drift from the implementation.',
      category: 'conventions',
    },
    {
      content:
        'Tests use `@testing-library/react` and mock `next/router`: `jest.mock(\'next/router\', () => ({ useRouter: () => ({ push: jest.fn(), pathname: \'/\' }) }))`. For end-to-end use Playwright against `next build && next start`.',
      category: 'testing',
    },
  ],
};
