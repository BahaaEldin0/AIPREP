import type { Preset } from '../../core/types.js';

export const tanstackQueryPreset: Preset = {
  id: 'tanstack-query',
  name: 'TanStack Query',
  description: 'TanStack Query (React Query v5) for server state.',
  type: 'tool',
  rules: [
    {
      content:
        'The `queryKey` is the dependency array. EVERY value the query function reads from outside MUST appear in the key: `queryKey: [\\\'user\\\', userId, { include: \\\'posts\\\' }]`. Missing values = stale results when args change.',
      category: 'patterns',
    },
    {
      content:
        'Distinguish `staleTime` from `gcTime`. `staleTime` = how long data is considered fresh (no refetch). `gcTime` = how long unused data stays in cache before GC. `staleTime: 0` (default) refetches on mount; `staleTime: Infinity` never auto-refetches.',
      category: 'performance',
    },
    {
      content:
        'Optimistic updates with `useMutation({ onMutate, onError, onSettled })`. `onMutate` snapshots the cache and applies the optimistic value (returning context). `onError` restores from context. `onSettled` always runs — invalidate there.',
      category: 'patterns',
    },
    {
      content:
        'Choose `invalidateQueries` (refetch) vs `setQueryData` (write directly) based on certainty. After a successful mutation: `setQueryData` if the response contains the new server state; `invalidateQueries` if the response is incomplete.',
      category: 'patterns',
    },
    {
      content:
        'Infinite queries use `useInfiniteQuery` with `getNextPageParam: (lastPage) => lastPage.cursor`. The `pageParam` defaults to `undefined` for the first request — the query function reads it from the args. Returning `undefined` from `getNextPageParam` signals end of data.',
      category: 'patterns',
    },
    {
      content:
        'Enable suspense for query: `useSuspenseQuery({...})` (v5+). Pairs with `<Suspense>` boundaries; loading state is rendered by Suspense fallback, not `isLoading`. Better DX for nested data dependencies.',
      category: 'patterns',
    },
    {
      content:
        'Centralize query keys with a factory: `const userKeys = { all: [\\\'users\\\'] as const, detail: (id) => [...userKeys.all, id] as const }`. Beats stringly-typed keys — typed and refactor-friendly.',
      category: 'conventions',
    },
    {
      content:
        'Configure default options in the QueryClient: `new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } })`. Project-wide defaults beat per-query repetition. Override in specific queries when needed.',
      category: 'conventions',
    },
    {
      content:
        'Server-side rendering: `prefetchQuery` on the server, `dehydrate` the client into the page payload, `<HydrationBoundary state={dehydrated}>` on the client. The query starts populated — no client-side waterfall.',
      category: 'patterns',
    },
    {
      content:
        'For React Suspense: enable `experimental_prefetchInRender` (v5) or use `useSuspenseQuery`. Without one of these, child components that suspend after the parent renders cause waterfalls.',
      category: 'performance',
    },
    {
      content:
        '`refetchOnWindowFocus: true` (default) is great for users-coming-back-from-a-tab freshness. Disable on rarely-changing data (`staleTime: Infinity`) or when the refetch is expensive.',
      category: 'performance',
    },
    {
      content:
        'For mutations that affect multiple queries, pass an array to `invalidateQueries` matchers: `queryClient.invalidateQueries({ queryKey: [\\\'users\\\'] })` invalidates everything starting with `users`. Specific keys (`[\\\'users\\\', id]`) match exact prefixes.',
      category: 'patterns',
    },
    {
      content:
        'Use `enabled: !!userId` to gate queries on dependencies. Without `enabled`, the query function fires with `undefined` ID and crashes. Combine with `placeholderData` for skeleton-free transitions.',
      category: 'patterns',
    },
    {
      content:
        'Test with `QueryClientProvider` wrapping the rendered tree, `gcTime: 0` and `retry: false` in the test client to make tests deterministic. `waitFor` for async state changes.',
      category: 'testing',
    },
  ],
};
