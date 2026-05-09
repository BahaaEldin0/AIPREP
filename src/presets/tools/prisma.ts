import type { Preset } from '../../core/types.js';

export const prismaPreset: Preset = {
  id: 'prisma',
  name: 'Prisma',
  description: 'Prisma ORM 5/6 with TypeScript: schema, migrations, query patterns.',
  type: 'tool',
  rules: [
    {
      content:
        'Singleton client. In dev/HMR environments (Next.js, Vite, tsx watch), every reload creates a new `PrismaClient()` and exhausts the DB connection pool within seconds. The fix: `globalThis.prisma ??= new PrismaClient(); export const prisma = globalThis.prisma;` and gate the assignment to non-production.',
      category: 'patterns',
    },
    {
      content:
        'Define schema in `prisma/schema.prisma`. After ANY change run `npx prisma generate` to regenerate the client types — without it, your IDE shows the old shape and runtime queries crash. Add a postinstall hook: `"postinstall": "prisma generate"`.',
      category: 'architecture',
    },
    {
      content:
        'Decouple DB naming from TS naming with `@map` (column) and `@@map` (table). DB stays snake_case (`created_at`, `user_profiles`), TS gets camelCase (`createdAt`, `userProfiles`). Mixing styles in code is unmaintainable.',
      category: 'conventions',
    },
    {
      content:
        'Multi-step writes need transactions: `await prisma.$transaction([prisma.post.create(...), prisma.user.update(...)])`. Without it, a failure between steps leaves partial data — partial writes corrupt domain invariants.',
      category: 'patterns',
    },
    {
      content:
        'For dependent transactions (next op needs prev result), use the interactive form: `await prisma.$transaction(async (tx) => { const u = await tx.user.create(...); await tx.profile.create({ data: { userId: u.id } }) })`. Set `maxWait` and `timeout` for long ops.',
      category: 'patterns',
    },
    {
      content:
        'Always `select` or `include` explicitly. `prisma.user.findMany()` returns ALL columns including hashed passwords or large JSON. `select: { id: true, email: true }` returns only what you need — smaller payloads, less leakage.',
      category: 'security',
    },
    {
      content:
        'Migrations: `prisma migrate dev` for development (creates and applies, may reset DB if drift detected). `prisma migrate deploy` for CI/CD/production (applies pending migrations, never resets). Running `dev` in production is destructive.',
      category: 'errors',
    },
    {
      content:
        'NEVER edit a migration file that has been applied to a shared DB. Generate a new migration that alters. Editing breaks the migration hash and `migrate deploy` will refuse to run.',
      category: 'errors',
    },
    {
      content:
        'Seed data goes in `prisma/seed.ts`. Reference in `package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }`. Run with `npx prisma db seed`. Idempotent seeding (upsert) > destructive seeding (delete + create) for shared dev DBs.',
      category: 'patterns',
    },
    {
      content:
        'Connection pooling: set `?connection_limit=10` in DATABASE_URL for serverless (where each instance gets its own pool). Use a pooler (PgBouncer, Supabase pooler, Neon pooler) in front of Postgres for high concurrency. Without it, idle connections starve writes.',
      category: 'performance',
    },
    {
      content:
        '`@db.Decimal` returns Prisma\'s `Decimal.js` instance, NOT a number. Math operations need `.add()`, `.mul()`. Serialize to JSON via `.toString()` or `.toNumber()` (lossy). Most beginners hit this once — type the field and surface explicitly.',
      category: 'errors',
    },
    {
      content:
        'JSON fields: `Json @db.Json` typed as `Prisma.JsonValue` (the recursive any-JSON type). For typed JSON, narrow with zod after read or define a Prisma type alias: `type UserSettings = { theme: \'dark\' | \'light\' }`. Casts directly (`as UserSettings`) lose runtime safety.',
      category: 'conventions',
    },
    {
      content:
        'Index for query patterns. `@@index([status, createdAt])` for "list by status sorted by date." Without indexes, queries seq-scan and slow exponentially with table size. Use `EXPLAIN ANALYZE` (Postgres) to verify the planner uses your index.',
      category: 'performance',
    },
    {
      content:
        'For soft delete, add a `deletedAt DateTime?` column and use Prisma middleware (or `$extends` in v5+) to filter deleted rows by default: `where: { deletedAt: null }`. Without middleware, every query needs the filter and one slip = data leak.',
      category: 'patterns',
    },
    {
      content:
        'Raw queries are the last resort: `prisma.$queryRaw\\`SELECT ...\\`` (typed) or `prisma.$queryRawUnsafe(...)` (any). Use ONLY for queries the query builder can\'t express (CTEs, window functions, vendor-specific). Always parameterize — string concatenation = SQL injection.',
      category: 'security',
    },
  ],
};
