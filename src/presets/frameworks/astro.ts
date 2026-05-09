import type { Preset } from '../../core/types.js';

export const astroPreset: Preset = {
  id: 'astro',
  name: 'Astro',
  description: 'Astro 4+ component islands, content collections, view transitions.',
  type: 'framework',
  rules: [
    {
      content:
        'By default Astro renders zero JavaScript to the client. Components ship as HTML/CSS only. Only components with a client directive (`client:load`, `client:idle`, `client:visible`, `client:media`, `client:only`) hydrate as interactive islands.',
      category: 'architecture',
    },
    {
      content:
        'Choose the narrowest hydration directive. `client:load` blocks the page; `client:idle` waits for the main thread to settle; `client:visible` waits for IntersectionObserver — usually the right choice for below-the-fold UI; `client:media="(min-width: 768px)"` skips on mobile.',
      category: 'performance',
    },
    {
      content:
        '`client:only="react"` skips SSR entirely and renders only on the client. Use for components that crash during SSR (browser-only libraries) — but accept the layout shift and lack of SEO content.',
      category: 'performance',
    },
    {
      content:
        'Astro components (`.astro`) can mix any UI framework — React, Vue, Svelte, Solid — in the same page. Each framework needs an integration installed (`@astrojs/react`, etc.) and listed in `astro.config.mjs`.',
      category: 'architecture',
    },
    {
      content:
        'Content Collections: define schemas in `src/content/config.ts` with zod, store entries in `src/content/<collection>/`. Query via `getCollection(\'blog\')` / `getEntry(\'blog\', \'post-slug\')`. Schemas catch frontmatter typos at build, not runtime.',
      category: 'architecture',
    },
    {
      content:
        'Pages live in `src/pages/`. File path = URL: `src/pages/blog/[slug].astro` → `/blog/:slug`. For dynamic routes, export `getStaticPaths()` returning the param array. Without `getStaticPaths`, dynamic routes 404 at build.',
      category: 'architecture',
    },
    {
      content:
        'Server endpoints: `.ts`/`.js` files in `src/pages/api/` exporting `GET`/`POST`/etc. They return `Response` directly. Available only when the page is server-rendered — set `export const prerender = false` if needed.',
      category: 'architecture',
    },
    {
      content:
        'Frontmatter (between `---` fences in `.astro`) runs at build (or per-request in SSR). Anything you write here is server-only — secrets, DB calls, file reads are safe. The component template renders below.',
      category: 'security',
    },
    {
      content:
        'Pass data into hydrated islands via props: `<MyReactComponent client:visible name="Bahaa" />`. Props must be JSON-serializable — functions, classes, Date objects do not survive serialization.',
      category: 'patterns',
    },
    {
      content:
        'For server-side rendering set `output: \'server\'` (everything SSR) or `output: \'hybrid\'` (static by default, opt into SSR per page with `export const prerender = false`). Static `output: \'static\'` is the default and fastest.',
      category: 'performance',
    },
    {
      content:
        'View Transitions: opt in by adding `<ClientRouter />` (Astro 5+ — formerly `<ViewTransitions />`) to the layout `<head>`. Pages animate between with the browser View Transition API. Style transitions in CSS with `::view-transition-*` pseudo-elements.',
      category: 'patterns',
    },
    {
      content:
        'Inside `.astro` files, `Astro.props` reads component props, `Astro.url` is the current URL, `Astro.request` is the Request object (SSR only), `Astro.locals` is per-request mutable state set by middleware.',
      category: 'patterns',
    },
    {
      content:
        'Middleware lives in `src/middleware.ts` exporting `onRequest({ request, locals }, next)`. Set `locals.user` for downstream pages. Order matters: each middleware MUST `return next()` or return a Response.',
      category: 'architecture',
    },
    {
      content:
        'Style with scoped `<style>` blocks in `.astro` (component-scoped by default), Tailwind via `@astrojs/tailwind`, or `<style is:global>` for genuinely global rules. Avoid `<style is:global>` unless necessary — it leaks across components.',
      category: 'conventions',
    },
    {
      content:
        'Image optimization: `<Image>` and `<Picture>` from `astro:assets`. Local images (`import logo from \'../assets/logo.png\'`) get fingerprinted and optimized; remote images need `image.domains` or `image.remotePatterns` in config.',
      category: 'performance',
    },
    {
      content:
        'Markdown/MDX pages: `.md`/`.mdx` files in `src/pages/` become routes. For pages that need a layout, export `layout` in frontmatter pointing to an `.astro` file that wraps `<slot />`.',
      category: 'architecture',
    },
    {
      content:
        'Environment variables: `import.meta.env.PUBLIC_FOO` is exposed to client code (must be PUBLIC_-prefixed). Server-only env vars are read via `astro:env/server`. Never reference unprefixed env in client islands.',
      category: 'security',
    },
    {
      content:
        'Test pages with Playwright. Astro components are best tested at the page level via E2E — there is no widely used unit test harness for `.astro` files. Framework components inside (React/Vue/Svelte) test with their respective tools.',
      category: 'testing',
    },
  ],
};
