import type { Preset } from '../../core/types.js';

export const zodPreset: Preset = {
  id: 'zod',
  name: 'Zod',
  description: 'Zod runtime schema validation with TypeScript inference.',
  type: 'tool',
  rules: [
    {
      content:
        'Schema-first: write the zod schema once, derive the TypeScript type with `z.infer<typeof schema>`. Maintaining a hand-written `interface` AND a zod schema is duplicated work and drifts.',
      category: 'patterns',
    },
    {
      content:
        '`schema.parse(data)` throws on invalid input — fine in places where you control the call site. `schema.safeParse(data)` returns `{ success, data | error }` — better at API boundaries where you want to return a 400 with details.',
      category: 'patterns',
    },
    {
      content:
        '`transform` runs AFTER validation: `z.string().transform(s => s.trim())`. `preprocess` runs BEFORE: `z.preprocess(v => Number(v), z.number())`. Use preprocess for type coercion (URL params are strings), transform for normalization (trim, lowercase).',
      category: 'patterns',
    },
    {
      content:
        'Discriminated unions with `z.discriminatedUnion(\'type\', [schemaA, schemaB])`. The discriminator is checked first — error messages point at the right branch. Plain `z.union(...)` tries each schema in order and returns the union of all errors.',
      category: 'patterns',
    },
    {
      content:
        '`.brand<\\\'UserId\\\'>()` for nominal typing: `const UserId = z.string().uuid().brand<\\\'UserId\\\'>()`. The inferred type rejects plain strings — same approach as TypeScript branded types but enforced at the validation boundary.',
      category: 'patterns',
    },
    {
      content:
        'For optional vs nullable: `z.string().optional()` allows `undefined`; `z.string().nullable()` allows `null`; `z.string().nullish()` allows both. JSON APIs typically want `nullable`; React form state typically wants `optional`.',
      category: 'conventions',
    },
    {
      content:
        '`.default(value)` adds a default if the field is missing/undefined. Combines well with optional. The defaulted value appears in the parsed output — even if the input did not include the field.',
      category: 'patterns',
    },
    {
      content:
        '`.refine(predicate, message)` for custom validation: `z.string().refine(s => isAvailable(s), { message: \'taken\' })`. Multiple `.refine`s short-circuit — first failure stops further checks. Use `.superRefine` to issue multiple errors from one schema.',
      category: 'patterns',
    },
    {
      content:
        'For enums prefer `z.enum([\\\'admin\\\', \\\'user\\\'])` over `z.union([z.literal(\\\'admin\\\'), z.literal(\\\'user\\\')])` — `enum` exposes `.options` for runtime iteration AND has better error messages.',
      category: 'patterns',
    },
    {
      content:
        'Strict objects: `z.object({...}).strict()` rejects unknown keys. Default behavior strips unknowns silently — fine for some APIs, bad for others. Use `.passthrough()` to keep unknowns. Pick deliberately.',
      category: 'security',
    },
    {
      content:
        'Recursive types: `const Post: z.ZodType<PostType> = z.lazy(() => z.object({ id: z.string(), replies: z.array(Post) }))`. The `z.lazy` plus the explicit type annotation is the workaround for Zod\'s inability to infer recursive types.',
      category: 'patterns',
    },
    {
      content:
        'Compose schemas with `.merge`, `.pick`, `.omit`, `.partial`, `.required`. Beats writing variations by hand: `const UserCreate = User.omit({ id: true })`, `const UserUpdate = User.partial()`. Single source of truth.',
      category: 'patterns',
    },
  ],
};
