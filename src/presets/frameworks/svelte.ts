import type { Preset } from '../../core/types.js';

export const sveltePreset: Preset = {
  id: 'svelte',
  name: 'Svelte',
  description: 'Plain Svelte 5 components without SvelteKit (no routing, no load functions).',
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
        'Mount the root component yourself: `import { mount } from \'svelte\'; const app = mount(App, { target: document.getElementById(\'app\')!, props: { ... } });`. The Svelte 4 `new App({ target })` pattern still works in Svelte 5 in legacy mode but is deprecated.',
      category: 'patterns',
    },
    {
      content:
        'Use `<script lang="ts">` for type-checked components. Pair with `svelte-check` in your build/CI. Without `lang="ts"` the compiler accepts JSDoc types but does not type-check expressions in the template.',
      category: 'conventions',
    },
    {
      content:
        'CSS in `<style>` is scoped by default — Svelte adds a hash class. To target child components, use `:global(...)`. Global styles go in a top-level `app.css` imported from your entry script, not from a component.',
      category: 'conventions',
    },
    {
      content:
        'For cross-component shared state outside of a component tree, use `writable`/`readable`/`derived` from `svelte/store`. Inside a single component prefer `$state` runes — stores are for state that needs to live longer than any one component.',
      category: 'patterns',
    },
    {
      content:
        'Two-way binding requires explicit `$bindable()` on the prop in Svelte 5: `let { value = $bindable() } = $props()`. Without it, `<Child bind:value />` from a parent will not propagate writes — a silent footgun versus Svelte 4.',
      category: 'patterns',
    },
    {
      content:
        'Snippets replace slots in Svelte 5: `{#snippet item(x)} ... {/snippet}` defines a reusable block; `<Child>{@render item(thing)}</Child>` passes it. Slots still work for backwards compat but are legacy. New components should accept snippet props.',
      category: 'patterns',
    },
    {
      content:
        'Event handling uses plain attributes in Svelte 5: `<button onclick={handler}>` (NOT `on:click`). The `on:` directive is still parsed for backwards compat but is deprecated. Modifiers like `|preventDefault` are gone — call `event.preventDefault()` inside the handler.',
      category: 'conventions',
    },
    {
      content:
        'Test components with Vitest + `@testing-library/svelte` and a jsdom or happy-dom environment. Configure `resolve.conditions: [\'browser\']` in `vite.config.ts` so `svelte` resolves to the browser entry; without it test runs hit the server entry and fail to mount.',
      category: 'testing',
    },
    {
      content:
        'Plain Svelte (no Kit) means no built-in router, no SSR, no `+page.svelte` files, no `$app/*` imports. If you need routing add `svelte-spa-router` or `tinro`; if you need SSR or file-based routing, switch to SvelteKit instead of bolting them on.',
      category: 'architecture',
    },
    {
      content:
        'For production builds, use `vite build` (most plain-Svelte projects scaffold from `npm create vite@latest -- --template svelte-ts`). Configure `@sveltejs/vite-plugin-svelte` in `vite.config.ts`; without the plugin Vite cannot compile `.svelte` files.',
      category: 'architecture',
    },
  ],
};
