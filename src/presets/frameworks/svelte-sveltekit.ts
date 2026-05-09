import type { Preset } from '../../core/types.js';

export const svelteSveltekitPreset: Preset = {
  id: 'svelte-sveltekit',
  name: 'Svelte / SvelteKit',
  description: 'Svelte 5 runes and SvelteKit conventions.',
  type: 'framework',
  rules: [
    {
      content:
        'Use Svelte 5 runes for reactivity: `let count = $state(0)` (reactive value), `let doubled = $derived(count * 2)` (computed), `$effect(() => { ... })` (side effects). The pre-runes `$:` reactive label still works but is legacy — do not start new components with it.',
      category: 'architecture',
    },
    {
      content:
        'Component props in Svelte 5: `let { name, count = 0 } = $props()`. Old-style `export let name` still works but is going away. Bindable props: `let { value = $bindable() } = $props()` so a parent can `bind:value`.',
      category: 'conventions',
    },
    {
      content:
        'SvelteKit routing: each folder under `src/routes/` is a URL segment, with `+page.svelte` (UI), `+layout.svelte` (shared shell), `+error.svelte` (error UI), `+page.ts` / `+page.server.ts` (data load). Brackets denote dynamic segments: `[slug]`, rest: `[...rest]`.',
      category: 'architecture',
    },
    {
      content:
        '`+page.ts` runs in BOTH server and browser (universal). `+page.server.ts` runs ONLY on the server — put DB calls, secrets, and admin SDK calls there. Anything imported by `+page.ts` ends up in the client bundle.',
      category: 'security',
    },
    {
      content:
        'Form mutations use form actions: `+page.server.ts` exports `actions = { default: async ({ request }) => {...}, delete: async (...) => {...} }`. Submit with `<form method="POST" action="?/delete">`. Returns from actions are merged into `form` exposed in the page.',
      category: 'patterns',
    },
    {
      content:
        'Progressive enhancement out of the box: forms work with JS disabled. Add `use:enhance` to the form to upgrade it to client-side submission with optimistic UI — without losing the no-JS path.',
      category: 'patterns',
    },
    {
      content:
        'In Svelte 5, `$app/state` (note: state, not stores) replaces `$app/stores` for `page`, `navigating`, `updated`. The new API gives you reactive values directly: `import { page } from \'$app/state\'; <h1>{page.url.pathname}</h1>`.',
      category: 'imports',
    },
    {
      content:
        'For navigation: `goto(url, options)` from `$app/navigation` (programmatic), or `<a href="/foo">` (declarative). SvelteKit hijacks `<a>` clicks to do client-side routing automatically — no `<Link>` component needed.',
      category: 'patterns',
    },
    {
      content:
        'Use `$lib` (resolves to `src/lib`) for shared code: `import { db } from \'$lib/server/db\'`. The `$lib/server/` subpath is enforced server-only — importing from a client-reachable file errors at build.',
      category: 'imports',
    },
    {
      content:
        'Page data flows: load function in `+page.server.ts`/`+page.ts` returns data → SvelteKit injects it into the `data` prop of `+page.svelte`. Type with `import type { PageData } from \'./$types\'` (auto-generated, not hand-written).',
      category: 'patterns',
    },
    {
      content:
        'Hooks (`src/hooks.server.ts`, `src/hooks.client.ts`) intercept every request/navigation. `handle({ event, resolve })` is the most common — wrap `resolve(event)` with auth checks, custom headers, or transforms. Returning early short-circuits routing.',
      category: 'architecture',
    },
    {
      content:
        'Environment variables come from `$env/static/private` (server-only, build-time-fixed), `$env/static/public` (PUBLIC_-prefixed, build-time-fixed), `$env/dynamic/private` (runtime, server), `$env/dynamic/public` (runtime, public). Pick the narrowest one — static is fastest and tree-shakes unused vars.',
      category: 'security',
    },
    {
      content:
        'API endpoints: `+server.ts` files export `GET`, `POST`, etc. Return `Response` directly (use `json()` helper from `@sveltejs/kit`). These coexist with `+page.svelte` files in the same folder.',
      category: 'architecture',
    },
    {
      content:
        'Error handling inside load functions: throw `error(404, \'Not found\')` from `@sveltejs/kit` to render the nearest `+error.svelte`. Throw `redirect(303, \'/login\')` to redirect. Both helpers throw — code after them is unreachable, do not put cleanup there.',
      category: 'errors',
    },
    {
      content:
        'CSS in `<style>` is scoped by default — Svelte adds a hash class. To target child components, use `:global(...)`. Global styles go in `app.css` imported from a layout.',
      category: 'conventions',
    },
    {
      content:
        'Stores from `svelte/store` (`writable`, `readable`, `derived`) still work in Svelte 5 — they remain useful for cross-component shared state outside of component boundaries. Inside a component, prefer `$state` runes.',
      category: 'patterns',
    },
    {
      content:
        'For prerendered pages, set `export const prerender = true` in `+page.server.ts` or `+layout.server.ts`. The build crawls links from prerendered pages — make sure all reachable URLs render fine. Mixed prerender/SSR pages are fine.',
      category: 'performance',
    },
    {
      content:
        'Adapters control deployment target: `@sveltejs/adapter-auto` picks for Vercel/Netlify/Cloudflare automatically; pin to a specific adapter in `svelte.config.js` for Node, static, or other platforms. Wrong adapter = wrong runtime APIs.',
      category: 'architecture',
    },
    {
      content:
        'Test SvelteKit pages with Playwright (E2E) and component tests with Vitest + `@testing-library/svelte`. Component testing requires `vitePlugin: { jsdom }` in the Vitest config — Svelte 5 components can be mounted in jsdom.',
      category: 'testing',
    },
    {
      content:
        'Form validation pattern: on the server action, validate with zod, return `fail(400, { errors, values })` for validation errors so the form re-renders with feedback. Do not throw on validation — `fail` preserves the form state in the page\'s `form` prop.',
      category: 'errors',
    },
  ],
};
