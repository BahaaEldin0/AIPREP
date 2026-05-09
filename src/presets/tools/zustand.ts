import type { Preset } from '../../core/types.js';

export const zustandPreset: Preset = {
  id: 'zustand',
  name: 'Zustand',
  description: 'Zustand small global state with selectors and middleware.',
  type: 'tool',
  rules: [
    {
      content:
        'Always select with a function: `const count = useStore(s => s.count)`. Selecting the whole store (`useStore(s => s)`) re-renders the consumer on every state change. Selectors limit re-renders to the watched slice.',
      category: 'performance',
    },
    {
      content:
        'For multi-field selections, use `useShallow`: `const { count, name } = useStore(useShallow(s => ({ count: s.count, name: s.name })))`. Without shallow comparison, returning a new object every time triggers re-render even when fields unchanged.',
      category: 'performance',
    },
    {
      content:
        'Co-locate state and updaters in the same store: `create((set) => ({ count: 0, increment: () => set(s => ({ count: s.count + 1 })) }))`. Updaters use the function form when next state depends on previous — avoids stale closures.',
      category: 'patterns',
    },
    {
      content:
        'For complex apps, split into slices and combine: `create<Combined>()((...a) => ({ ...userSlice(...a), ...cartSlice(...a) }))`. Each slice is a function returning its state + actions. One store with slices > many small stores (avoids cross-store sync).',
      category: 'architecture',
    },
    {
      content:
        '`immer` middleware enables mutation-style updaters: `set(s => { s.users.push(user) })`. Without immer you must spread immutably (`set(s => ({ users: [...s.users, user] }))`). For deeply nested state, immer is significantly clearer.',
      category: 'patterns',
    },
    {
      content:
        '`persist` middleware syncs to localStorage/AsyncStorage: `persist(creator, { name: \\\'app-storage\\\' })`. Use `partialize` to exclude transient state: `partialize: (s) => ({ user: s.user })` — only persists what matters across reloads.',
      category: 'patterns',
    },
    {
      content:
        '`devtools` middleware connects to Redux DevTools: `devtools(persist(creator, ...), { name: \\\'app\\\' })`. Wrap with conditional in production: `import.meta.env.DEV ? devtools(creator) : creator` — devtools adds runtime overhead.',
      category: 'patterns',
    },
    {
      content:
        'Subscribe outside React with `store.subscribe(state => ...)` for analytics, logging, side effects that don\'t need to render. Cleanup the subscription on app teardown.',
      category: 'patterns',
    },
    {
      content:
        'For SSR (Next.js): create the store inside a context per request, do NOT module-export. Module-level stores leak state between requests on the server. Use a provider that creates a per-request store.',
      category: 'errors',
    },
    {
      content:
        'TypeScript: type the store with `create<State>()(...)` (note the double parens — it\'s a curried generic for middleware compatibility). Without it, middleware-wrapped stores lose inference.',
      category: 'conventions',
    },
  ],
};
