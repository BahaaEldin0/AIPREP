import type { Preset } from '../../core/types.js';

export const drizzlePreset: Preset = {
  id: 'drizzle',
  name: 'Drizzle ORM',
  description: 'Drizzle ORM with TypeScript schema-as-source-of-truth.',
  type: 'tool',
  rules: [
    {
      content:
        'Schema is the source of truth — TypeScript files in `db/schema.ts` define tables, columns, relations. `drizzle-kit generate` produces SQL migrations from the diff. Never hand-edit the generated SQL unless the kit gets it wrong.',
      category: 'architecture',
    },
    {
      content:
        'Define relations separately from tables via `relations(table, ({ many, one }) => ...)`. Drizzle does not infer relations from foreign keys alone; the helper is what makes `db.query.users.findMany({ with: { posts: true } })` work.',
      category: 'patterns',
    },
    {
      content:
        'Two query styles: SQL-like builder (`db.select().from(users).where(eq(users.id, id))`) and relational query API (`db.query.users.findFirst({ where: eq(users.id, id), with: { posts: true } })`). Builder is closer to SQL; relational is for nested reads. Pick a primary style per project.',
      category: 'patterns',
    },
    {
      content:
        'Use `.with()` for joins in relational API; `leftJoin()`/`innerJoin()` in builder API. The relational `with` produces a single optimized query — no N+1 — but requires `relations()` declarations. Without them, fall back to manual joins.',
      category: 'performance',
    },
    {
      content:
        'Prepared statements for hot paths: `const prepared = db.select().from(users).where(eq(users.id, sql.placeholder(\'id\'))).prepare(\'find_user\')`, then `prepared.execute({ id: 1 })`. Saves the SQL parsing per call — measurable for high-frequency queries.',
      category: 'performance',
    },
    {
      content:
        'Transactions: `await db.transaction(async (tx) => { ... })`. The `tx` is a transaction-scoped client — do not use `db` inside, or you\'ll create operations outside the tx. Throwing rolls back; returning commits.',
      category: 'patterns',
    },
    {
      content:
        'Infer types from schema. `type User = typeof users.$inferSelect` (read shape) vs `typeof users.$inferInsert` (insert shape — nullable defaults differ). Declaring types by hand drifts from the schema and causes runtime mismatches.',
      category: 'conventions',
    },
    {
      content:
        'Validation with `drizzle-zod`: `const insertUserSchema = createInsertSchema(users)`. Auto-derives a zod schema from the table — keep them in sync without two declarations. Customize specific columns with `createInsertSchema(users, { email: z.string().email() })`.',
      category: 'patterns',
    },
    {
      content:
        'Indexes go on the table definition: `users.email.unique()` for unique constraints, `index(\'name_idx\').on(users.name)` exported alongside the table. Run `drizzle-kit generate` to capture the index in a migration.',
      category: 'performance',
    },
    {
      content:
        'Composite primary keys: `pk: primaryKey({ columns: [t.userId, t.roleId] })` in the second-arg config object. Forgetting the composite key on a join table makes duplicate rows possible.',
      category: 'architecture',
    },
    {
      content:
        'Pick the right driver: `drizzle-orm/node-postgres` for Node + `pg`; `drizzle-orm/postgres-js` for postgres.js (smaller, faster); `drizzle-orm/neon-http` / `vercel-postgres` for serverless edges; `drizzle-orm/better-sqlite3` for local SQLite. Wrong driver = wrong type semantics.',
      category: 'architecture',
    },
    {
      content:
        'Serverless connection pooling: do NOT keep a long-lived pool in serverless functions — every cold start opens new connections. Use the HTTP driver (`neon-http`, `vercel-postgres`) which is connectionless, or a pooler URL (Supabase pgbouncer transaction mode).',
      category: 'performance',
    },
  ],
};
