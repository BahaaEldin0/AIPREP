import type { Preset } from '../../core/types.js';

export const supabasePreset: Preset = {
  id: 'supabase',
  name: 'Supabase',
  description: 'Supabase platform: Postgres + Auth + Storage + Realtime + Edge Functions.',
  type: 'tool',
  rules: [
    {
      content:
        'Row Level Security (RLS) is NOT optional. Enable on EVERY table holding user data: `ALTER TABLE posts ENABLE ROW LEVEL SECURITY`. Without RLS, your `anon`/`authenticated` keys bypass the schema and read everyone\'s rows.',
      category: 'security',
    },
    {
      content:
        '`service_role` key has bypass-RLS privileges and MUST never reach the browser. Use only in server-side code (Edge Functions, your backend). The `anon` key is safe to expose — RLS protects the data.',
      category: 'security',
    },
    {
      content:
        'RLS policies use `auth.uid()` to identify the current user: `USING (auth.uid() = user_id)`. Without `auth.uid()` checks the policy applies to all rows — equivalent to no protection.',
      category: 'security',
    },
    {
      content:
        'Test policies before deploy. The Supabase dashboard\'s SQL editor lets you `SET ROLE authenticated; SET request.jwt.claims = ...`. Run the queries the app will run; verify denied rows are denied.',
      category: 'security',
    },
    {
      content:
        'Storage RLS is SEPARATE from database RLS. Bucket policies live in `storage.objects` table. `auth.uid()` in storage policies must match the path: `bucket_id = \\\'avatars\\\' AND (storage.foldername(name))[1] = auth.uid()::text`.',
      category: 'security',
    },
    {
      content:
        'Realtime subscriptions need cleanup. `const channel = supabase.channel(...).on(...).subscribe()` returns the channel. Always `await supabase.removeChannel(channel)` on component unmount — leaks tax both client memory and server connections.',
      category: 'patterns',
    },
    {
      content:
        'Realtime authorization: by default any authenticated user receives all events on the channel. For private data, send messages through your backend or use Postgres Changes filtered by RLS — Realtime respects RLS in v2.',
      category: 'security',
    },
    {
      content:
        'Edge Functions run on Deno. Imports use URLs: `import { createClient } from \\\'jsr:@supabase/supabase-js@2\\\'`. Cold-start times depend on import graph — minimize dependencies. Reuse the Supabase client across requests if the runtime caches modules.',
      category: 'performance',
    },
    {
      content:
        'Database functions for complex queries — write SQL or PL/pgSQL functions, call via `supabase.rpc(\\\'function_name\\\', { arg: value })`. Encapsulates business rules in the DB; respects RLS automatically when called via `authenticated` role.',
      category: 'patterns',
    },
    {
      content:
        'Type generation: `supabase gen types typescript --project-id <id> > types.ts`. Pass to the client: `createClient<Database>(url, key)`. Without generated types, every query returns `any` and you lose autocomplete.',
      category: 'conventions',
    },
    {
      content:
        'Auth: prefer email + Magic Link or social OAuth over password. Supabase manages session tokens automatically; access via `supabase.auth.getSession()`. NEVER store the access token outside Supabase\'s default storage — security guarantees rely on its rotation.',
      category: 'security',
    },
    {
      content:
        'For server components / server-side fetch in Next.js use `@supabase/ssr` package — it handles cookie-based session reading. The plain `@supabase/supabase-js` doesn\'t know about cookies.',
      category: 'patterns',
    },
    {
      content:
        'Migrations live in `supabase/migrations/`. Create with `supabase migration new add_posts_table` — generates a timestamped SQL file. Apply with `supabase db push` (remote) or `supabase db reset` (local). Never edit applied migrations.',
      category: 'architecture',
    },
    {
      content:
        'Pagination via `range`: `.range(0, 9)` for first 10 rows. With `count: \\\'exact\\\'` you also get total count — slow on large tables. Use `count: \\\'planned\\\'` (estimate) for large tables, or skip count entirely.',
      category: 'performance',
    },
  ],
};
