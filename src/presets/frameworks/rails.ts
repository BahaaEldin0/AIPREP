import type { Preset } from '../../core/types.js';

export const railsPreset: Preset = {
  id: 'rails',
  name: 'Ruby on Rails',
  description: 'Rails 7+ with Hotwire (Turbo + Stimulus) and ActiveRecord conventions.',
  type: 'framework',
  rules: [
    {
      content:
        'Strong parameters in controllers: `params.require(:user).permit(:name, :email)`. NEVER `params[:user]` directly — it allows any field, including `is_admin`. Strong params is the canonical mass-assignment defense in Rails.',
      category: 'security',
    },
    {
      content:
        'ActiveRecord N+1: install `bullet` gem (development env) — it logs every N+1 to the browser and console. Fix with `.includes(:author)` (separate query, joined in Ruby) or `.preload(:author)`. `.eager_load(:author)` does a single LEFT OUTER JOIN.',
      category: 'performance',
    },
    {
      content:
        'Fat models, thin controllers: validation, callbacks, and business logic on the model. Controllers translate HTTP. If a model exceeds ~300 lines, extract POROs (plain Ruby objects) into `app/services/` or `app/queries/`.',
      category: 'architecture',
    },
    {
      content:
        'ActiveRecord callbacks (`before_save`, `after_create`) are dangerous when they touch other models or external services. Long callback chains hide ordering and break tests. Prefer service objects or domain events.',
      category: 'patterns',
    },
    {
      content:
        'Use Concerns SPARINGLY. They are mixins under another name. Reach for them only when 2+ models genuinely share behavior; do not use them as a junk drawer for "stuff that doesn\'t fit elsewhere."',
      category: 'architecture',
    },
    {
      content:
        'Background jobs: ActiveJob abstracts the backend. In production use Sidekiq (Redis, threads) or SolidQueue (Rails 7.1+ DB-backed, simpler ops). NEVER perform email/HTTP synchronously inside a request.',
      category: 'performance',
    },
    {
      content:
        'Database migrations: one logical change per file. NEVER edit a migration that\'s been merged. Generate a new migration that alters. The schema is reproducible from `schema.rb` (or `structure.sql` for Postgres-specific features).',
      category: 'architecture',
    },
    {
      content:
        'Use `add_index` on every foreign key. Rails generates them via `add_reference :posts, :user, foreign_key: true, index: true`. Without indexes, joins and `WHERE user_id = X` table-scan on a large table.',
      category: 'performance',
    },
    {
      content:
        'Hotwire (Turbo + Stimulus) is the Rails default for interactivity. Turbo Frames update sub-views server-side; Turbo Streams push updates over WebSocket. Reach for React/Vue only when the app is genuinely SPA-shaped — Hotwire covers most CRUD.',
      category: 'architecture',
    },
    {
      content:
        'ActionCable for real-time. Channels live in `app/channels/`. Avoid sending large payloads over the channel — broadcast a small event and let the client fetch the data. Set `ActionCable.server.config.disable_request_forgery_protection = false`.',
      category: 'security',
    },
    {
      content:
        'Sidekiq jobs: keep them idempotent — retries are inevitable on transient failures. Pass IDs, not objects (objects serialized at enqueue may be stale at dequeue). Set `sidekiq_options retry: 3` explicitly per job.',
      category: 'patterns',
    },
    {
      content:
        'Strong migrations: install `strong_migrations` gem to catch unsafe migrations (adding NOT NULL without default on a populated table, removing columns still in code). Production migrations need careful staging.',
      category: 'patterns',
    },
    {
      content:
        'Authentication: `bcrypt` + `has_secure_password` for the simple case, Devise for the full stack (registration, password reset, lockable). Rails 8 will ship a generated authentication scaffold — until then, Devise is the safe default.',
      category: 'security',
    },
    {
      content:
        'CSRF: `protect_from_forgery with: :exception` is in `ApplicationController` by default. Skip it ONLY for API-only endpoints that authenticate via token (`skip_before_action :verify_authenticity_token`). Never globally.',
      category: 'security',
    },
    {
      content:
        'Caching: low-level (`Rails.cache.fetch(key, expires_in: 5.minutes) { expensive }`), fragment caching in views (`<% cache @post do %>`), and Russian-doll caching for nested. Configure a Redis store in production.',
      category: 'performance',
    },
    {
      content:
        'Use `find_each` for iterating large collections — it loads in batches. `User.all.each` loads everything into memory and OOMs on big tables. Default batch size 1000.',
      category: 'performance',
    },
    {
      content:
        'Tests: Minitest (Rails default) or RSpec. Use FactoryBot for fixtures (or fixtures themselves for static data). Wrap DB tests in transactions (`use_transactional_tests = true` — default).',
      category: 'testing',
    },
    {
      content:
        'Routes file: namespace by version for APIs (`namespace :api do; namespace :v1 do; resources :posts; end; end`). Avoid `match :all, via: :all` — too permissive. Stick to RESTful resources.',
      category: 'architecture',
    },
    {
      content:
        'Active Storage for file uploads. NEVER store paths to local disk in models — Active Storage abstracts S3/Azure/GCS. Configure `config.active_storage.variant_processor = :vips` for image transforms (faster than MiniMagick).',
      category: 'patterns',
    },
    {
      content:
        'Rails credentials: `bin/rails credentials:edit` opens encrypted credentials in $EDITOR. Master key is in `config/master.key` (gitignored) or env var `RAILS_MASTER_KEY` for production. Never commit raw secrets.',
      category: 'security',
    },
  ],
};
