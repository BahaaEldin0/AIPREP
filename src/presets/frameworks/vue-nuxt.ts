import type { Preset } from '../../core/types.js';

export const vueNuxtPreset: Preset = {
  id: 'vue-nuxt',
  name: 'Vue / Nuxt',
  description: 'Vue 3 single-file components, Nuxt 3 conventions and auto-imports.',
  type: 'framework',
  rules: [
    {
      content:
        'Single-file components use `<script setup lang="ts">` — the Composition API with the SFC compiler macro. The Options API (`export default { data, methods }`) is supported but generates more code, weaker types, and is not idiomatic Vue 3.',
      category: 'architecture',
    },
    {
      content:
        'Use compiler macros for component contracts: `defineProps<{ id: string; count?: number }>()`, `defineEmits<{ (e: \'update\', value: string): void }>()`. These are NOT imports — they are erased by the compiler and only valid inside `<script setup>`.',
      category: 'conventions',
    },
    {
      content:
        'Reactive primitives: `ref()` for any value (objects too — recommended); `reactive()` only for objects. Both unwrap to `.value` reads in script, but templates auto-unwrap refs. Mixing styles within one file is the #1 readability bug.',
      category: 'patterns',
    },
    {
      content:
        'Composables are reusable hook-equivalents. They go in `composables/` (Nuxt auto-imports) or `src/composables/` (Vue), and start with `use`. They run during component setup — do not call them inside `onMounted` or click handlers.',
      category: 'patterns',
    },
    {
      content:
        'Nuxt auto-imports components from `components/`, composables from `composables/`, utilities from `utils/`. You do not write `import` for these. Disable auto-import with `imports: { autoImport: false }` if you prefer explicit (but then accept the boilerplate).',
      category: 'imports',
    },
    {
      content:
        'For server-fetched data in Nuxt, use `useFetch` (URL-based, deduplicated by URL+params) or `useAsyncData` (key-based, arbitrary fetcher). Both run on the server during SSR and hydrate the result — they do NOT re-fetch on the client unless you tell them to.',
      category: 'patterns',
    },
    {
      content:
        'Pass an explicit key to `useState`, `useFetch`, `useAsyncData`. Auto-derived keys can collide between components and produce mixed-up payloads at hydration. Bad: `useState(() => 0)`. Good: `useState(\'cart-count\', () => 0)`.',
      category: 'patterns',
    },
    {
      content:
        'State management: Pinia (the official replacement for Vuex). Define stores with `defineStore(\'name\', () => { ... })` (composition style) and consume with `const store = useStore()`. Vuex is end-of-life — do not start new projects with it.',
      category: 'architecture',
    },
    {
      content:
        'Page metadata via `definePageMeta({ title, layout, middleware })` at the top of `pages/<route>.vue`. The macro is hoisted at compile time — do not call it conditionally inside `if` blocks.',
      category: 'conventions',
    },
    {
      content:
        'Server endpoints live in `server/api/` (returns JSON via `defineEventHandler`) and `server/routes/` (any response). Use h3 helpers: `getQuery(event)`, `readBody(event)`, `getCookie(event, name)`, `setHeader(event, key, value)`. These are tree-shaken into the Nitro server build.',
      category: 'architecture',
    },
    {
      content:
        'Layouts go in `layouts/`. The default layout is `layouts/default.vue`; pages opt into a different one via `definePageMeta({ layout: \'admin\' })`. Layouts must contain a `<slot />` for page content.',
      category: 'architecture',
    },
    {
      content:
        'Vue\'s `v-for` requires `:key` — same rule as React. Use the entity ID, not the array index. Without keys, mutations to lists move DOM nodes incorrectly and lose component state.',
      category: 'patterns',
    },
    {
      content:
        'Use `v-model` for two-way binding on form fields. `v-model:propName` lets a child component participate in two-way binding by emitting `update:propName` and accepting `propName` as a prop.',
      category: 'patterns',
    },
    {
      content:
        '`computed()` for derived state, `watch()` / `watchEffect()` for side effects. NEVER mutate state inside `computed` — it must be pure. Watchers run after the component re-renders, so chaining `set state → watch → set state` causes infinite loops.',
      category: 'patterns',
    },
    {
      content:
        'Lifecycle hooks: `onMounted`, `onUpdated`, `onUnmounted`, `onBeforeMount`. They MUST be called synchronously inside `setup()` / `<script setup>` — calling them inside an `await` or callback breaks the binding to the current component.',
      category: 'patterns',
    },
    {
      content:
        'For SSR-safe code, gate browser-only code with `if (import.meta.client)` (Nuxt) or `if (typeof window !== \'undefined\')` (Vue). Reading `window`, `document`, or `localStorage` during SSR throws.',
      category: 'errors',
    },
    {
      content:
        'Error handling: wrap async logic in `try/catch` and surface via Nuxt\'s `createError({ statusCode, statusMessage })`. The framework renders `error.vue` for uncaught errors. `showError(err)` lets you trigger it imperatively.',
      category: 'errors',
    },
    {
      content:
        'For Vue Router middleware, return a navigation directive: `return navigateTo(\'/login\')` to redirect, `return abortNavigation()` to cancel, or nothing to allow. Throwing inside middleware is treated as an unhandled error.',
      category: 'patterns',
    },
    {
      content:
        'CSS scoping: `<style scoped>` adds a unique data attribute and rewrites selectors so styles do not leak. Use `:deep(...)` to pierce into a child component\'s scoped styles when you must — the CSS specificity bump is intentional friction.',
      category: 'conventions',
    },
    {
      content:
        'For TypeScript prop typing with default values, use the type-only generic with destructuring: `const { id, count = 0 } = defineProps<Props>()`. The runtime declaration form (`{ count: { type: Number, default: 0 } }`) loses literal types.',
      category: 'conventions',
    },
    {
      content:
        'Test components with `@vue/test-utils` + Vitest. `mount()` creates a wrapper; query with `wrapper.find(\'[data-test=submit]\')`. For Nuxt-specific composables, use `@nuxt/test-utils` so auto-imports and Nuxt context work in tests.',
      category: 'testing',
    },
    {
      content:
        'Production: `nuxt build` produces a `.output/` directory with both server (`.output/server`) and static assets (`.output/public`). Deploy by running `node .output/server/index.mjs`. `nuxt generate` produces a fully static site instead.',
      category: 'patterns',
    },
  ],
};
