import type { Preset } from '../../core/types.js';

export const graphqlPreset: Preset = {
  id: 'graphql',
  name: 'GraphQL',
  description: 'GraphQL servers with DataLoader, fragments, and persisted queries.',
  type: 'tool',
  rules: [
    {
      content:
        'N+1 is the GraphQL killer. EVERY field that reads from a database needs a DataLoader (`dataloader` package). Loaders batch and dedupe within a request — without them, fetching `posts(authors { name })` fires one query per post.',
      category: 'performance',
    },
    {
      content:
        'Create DataLoaders per request, NOT at module scope. The cache is request-scoped — sharing across requests leaks data between users. In Apollo Server / Yoga, instantiate inside the context factory.',
      category: 'security',
    },
    {
      content:
        'Mask errors in production. Apollo: `formatError: (err) => isDev ? err : { message: \\\'Internal error\\\' }`. Default behavior leaks DB errors, file paths, library versions. Log the full error server-side; return safe messages.',
      category: 'security',
    },
    {
      content:
        'Schema-first vs code-first: schema-first (`.graphql` files) is portable and tool-friendly. Code-first (Pothos, TypeGraphQL, Nexus) gives type-safety from server types. Pick one early — switching is invasive.',
      category: 'architecture',
    },
    {
      content:
        'Resolvers naming convention: object types get one resolver per field. `Query`, `Mutation`, `Subscription` are the entry types. Field resolvers (`User.posts`) are where N+1 manifests — wrap in DataLoader.',
      category: 'conventions',
    },
    {
      content:
        'Fragments group fields a component needs. The Relay convention: each component declares a fragment, the page composes them. Eliminates manually keeping query selections in sync with component data needs.',
      category: 'patterns',
    },
    {
      content:
        'Persisted queries: client sends a hash, server looks up the registered query. Reduces request payload, blocks ad-hoc queries (security), and enables CDN caching of GET requests. Enable in production.',
      category: 'security',
    },
    {
      content:
        'Depth/complexity limiting: install `graphql-depth-limit` and `graphql-cost-analysis`. Without limits, an attacker requests `{ user { posts { author { posts { author { ... } } } } } }` to DoS your DB. Reject queries past a threshold.',
      category: 'security',
    },
    {
      content:
        'Pagination: cursor-based (Relay connections — `edges`, `nodes`, `pageInfo.endCursor`) for stable ordering. Offset-based (`limit`, `offset`) for simpler UIs. Mixing is bad — consumers expect one model.',
      category: 'patterns',
    },
    {
      content:
        'Use input types for mutation args: `mutation createPost(input: CreatePostInput!)`. Easier to evolve than positional args, simpler client code (one variable, not many), and matches REST DTO patterns.',
      category: 'conventions',
    },
    {
      content:
        'Schema directives encode authorization: `@auth(role: ADMIN)`. Implement once in the directive resolver; apply to fields. Beats checking auth in every resolver — central, reusable, visible in the schema.',
      category: 'security',
    },
    {
      content:
        'Subscriptions over WebSocket (`graphql-ws` protocol). Authentication runs ONCE at connection time — refresh tokens during the connection lifetime. Filter events server-side; never broadcast all events and let clients filter.',
      category: 'architecture',
    },
    {
      content:
        'CodeGen: `graphql-codegen` generates types from the schema for both server resolvers and client operations. Without codegen, types drift from the schema and you discover it at runtime.',
      category: 'conventions',
    },
    {
      content:
        'Cache GET requests at the CDN. With persisted queries + GET, Cloudflare/Fastly can cache by URL. Mutations are POST and bypass cache. The combo gives REST-like CDN caching with GraphQL DX.',
      category: 'performance',
    },
  ],
};
