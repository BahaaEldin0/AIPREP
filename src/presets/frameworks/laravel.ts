import type { Preset } from '../../core/types.js';

export const laravelPreset: Preset = {
  id: 'laravel',
  name: 'Laravel',
  description: 'Laravel 11+ with Eloquent, queues, and FormRequest validation.',
  type: 'framework',
  rules: [
    {
      content:
        'Eloquent N+1: every loop accessing a relation runs a query per iteration. ALWAYS eager-load: `Post::with([\'author\', \'tags\'])->get()`. Install `barryvdh/laravel-debugbar` (dev) or `Telescope` to spot N+1 in development.',
      category: 'performance',
    },
    {
      content:
        'Use route model binding: `Route::get(\'/posts/{post}\', ...)`. Laravel auto-resolves `$post` to a `Post` model by ID, returning 404 if missing. No more `Post::findOrFail($id)` boilerplate.',
      category: 'patterns',
    },
    {
      content:
        'Validate input with FormRequest classes — never inside controllers. `php artisan make:request StorePostRequest` generates a class with `rules()` and `authorize()`. Inject it into the controller method and access validated data via `$request->validated()`.',
      category: 'security',
    },
    {
      content:
        'Authorization: Policies (`php artisan make:policy PostPolicy`) for model-level checks, Gates for non-model checks. Use `$this->authorize(\'update\', $post)` in controllers — throws 403 automatically.',
      category: 'security',
    },
    {
      content:
        'Queue ALL slow operations: emails, image processing, third-party API calls. `dispatch(new SendEmail($user))` returns immediately; the queue worker processes asynchronously. Sync execution by default kills request latency.',
      category: 'performance',
    },
    {
      content:
        'Queue driver: `redis` for production (or sqs/sns for managed). NEVER `database` driver in high-throughput — it polls and locks rows, doesn\'t scale. NEVER `sync` outside tests — it runs in the request and defeats the purpose.',
      category: 'architecture',
    },
    {
      content:
        'Config caching (`php artisan config:cache`) freezes config at deploy time. After this, `env()` calls OUTSIDE the `config/` files return null. Read all env vars in `config/*.php` files; reference via `config(\'services.foo.key\')`.',
      category: 'errors',
    },
    {
      content:
        'Migrations: one logical change per file. `php artisan make:migration create_posts_table`. NEVER edit a migration that\'s deployed — generate a new migration to alter. The `migrations` table tracks applied state.',
      category: 'architecture',
    },
    {
      content:
        'Use database transactions for multi-step writes: `DB::transaction(fn () => { Post::create(...); $user->increment(\'post_count\'); })`. Without transactions, a failure mid-way leaves orphaned data.',
      category: 'patterns',
    },
    {
      content:
        'Mass assignment protection: `protected $fillable = [\'title\', \'body\']` on every model. Without it, `Post::create($request->all())` with an unexpected `is_admin` field elevates privileges. `$guarded = []` is the dangerous opposite — never do this in production.',
      category: 'security',
    },
    {
      content:
        'Model factories for tests/seeds: `Post::factory()->count(10)->create()`. Define in `database/factories/`. Combined with `RefreshDatabase` trait, gives reproducible test data without fixture files.',
      category: 'testing',
    },
    {
      content:
        'Use Laravel\'s built-in pagination: `Post::paginate(15)`. Returns a paginator with metadata; in API resources, this serializes to `{data, meta, links}`. Never `take/skip` for user-facing lists — it lacks total counts.',
      category: 'patterns',
    },
    {
      content:
        'API responses: use Eloquent API Resources (`php artisan make:resource PostResource`). Centralizes serialization — change one resource, all endpoints update. Never return models directly from JSON APIs (leaks columns).',
      category: 'security',
    },
    {
      content:
        'Caching: `Cache::remember(\'key\', $ttl, fn () => expensiveQuery())`. Use Redis backend in production. For model-level caching, look at `spatie/laravel-responsecache` or HTTP-level caching via headers.',
      category: 'performance',
    },
    {
      content:
        'Logging: `Log::info(\'msg\', [\'context\' => $value])`. Configure channels in `config/logging.php`. Production: stack channel (file + Sentry/papertrail). Avoid `dd($x)` in committed code.',
      category: 'errors',
    },
    {
      content:
        'CSRF protection is automatic for web routes via the `web` middleware group. API routes (`api` middleware) skip CSRF — they should authenticate via Sanctum or Passport tokens instead.',
      category: 'security',
    },
    {
      content:
        'Use `Schedule::command(\'app:cleanup\')->daily()` in `routes/console.php` (Laravel 11+) instead of cron entries. The single cron entry `* * * * * php artisan schedule:run` dispatches all scheduled tasks.',
      category: 'patterns',
    },
    {
      content:
        'Artisan commands for one-off tasks: `php artisan make:command FixOldPosts`. Schedule via `Schedule::command(...)`, run manually via `artisan`. Never write standalone PHP scripts in `public/` — they bypass the framework.',
      category: 'patterns',
    },
    {
      content:
        'Tests with PHPUnit/Pest. Use `RefreshDatabase` trait so each test runs in a transaction that rolls back. Pest has cleaner syntax (`it(\'creates a post\', function () {...})`) — adopt for new projects.',
      category: 'testing',
    },
    {
      content:
        'Production deploy: `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`, `php artisan event:cache`. The four caches significantly reduce per-request overhead. Re-run after every code change in CI/CD.',
      category: 'performance',
    },
  ],
};
