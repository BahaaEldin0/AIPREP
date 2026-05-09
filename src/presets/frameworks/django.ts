import type { Preset } from '../../core/types.js';

export const djangoPreset: Preset = {
  id: 'django',
  name: 'Django',
  description: 'Django 5+ with the ORM, DRF, and Postgres conventions.',
  type: 'framework',
  rules: [
    {
      content:
        'Fat models, thin views. Business logic and validation belong on the model (or a service module called by the model). Views translate HTTP to method calls. Templates know about presentation, not domain rules.',
      category: 'architecture',
    },
    {
      content:
        'Class-based views (CBV) for CRUD (`ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`). Function-based views for one-off custom logic. Mixing both is fine — pick by complexity, not dogma.',
      category: 'architecture',
    },
    {
      content:
        'NEVER write raw SQL when an ORM query suffices. Raw SQL bypasses model events, sanitization, and database-vendor portability. When you must, use parameterized queries: `Model.objects.raw(\'SELECT * FROM tbl WHERE id = %s\', [id])` — never f-strings.',
      category: 'security',
    },
    {
      content:
        '`select_related(\'user\', \'category\')` for ForeignKey/OneToOne lookups on the SAME query (SQL JOIN). `prefetch_related(\'tags\', \'comments\')` for ManyToMany/reverse-FK (separate query, joined in Python). N+1 queries kill Django apps in production — install `django-debug-toolbar` and `nplusone` to catch them.',
      category: 'performance',
    },
    {
      content:
        'Settings split: `settings/base.py` (shared), `settings/development.py` (DEBUG=True, SQLite OK), `settings/production.py` (security headers, S3 storage). Set `DJANGO_SETTINGS_MODULE` per environment.',
      category: 'architecture',
    },
    {
      content:
        'Custom user model from day 1: `class User(AbstractUser)` in your `accounts/models.py`. `AUTH_USER_MODEL = \'accounts.User\'` in settings. Switching later requires a data migration nightmare — set it before first migrate.',
      category: 'architecture',
    },
    {
      content:
        'For API endpoints use Django REST Framework. Serializers (`ModelSerializer`) validate input AND format output. Validation lives on the serializer, not the view. Use `ViewSet` + `Router` for standard CRUD — eliminates URL conf boilerplate.',
      category: 'patterns',
    },
    {
      content:
        'Migrations: `python manage.py makemigrations` after model changes, `python manage.py migrate` to apply. NEVER edit a migration that has been pushed to a shared branch — generate a new migration that reverses or amends it. Never delete a migration file from history.',
      category: 'architecture',
    },
    {
      content:
        'Atomic operations: wrap multi-step writes in `transaction.atomic()` (decorator or context manager). Without it, a failure mid-way leaves partial data. For high-throughput writes, prefer `select_for_update()` over optimistic patterns.',
      category: 'patterns',
    },
    {
      content:
        'Signals are dangerous. They create implicit ordering and hide side effects. Reach for them only when the event has many possible listeners and the senders don\'t know about them. Otherwise call the function directly.',
      category: 'patterns',
    },
    {
      content:
        'Querysets are LAZY. They don\'t hit the DB until iterated, sliced, or `len()`/`bool()`. Take advantage by chaining filters, but watch for accidental evaluation in templates (`{% if queryset %}` evaluates).',
      category: 'performance',
    },
    {
      content:
        'Use `Model.objects.values(\'field1\', \'field2\')` for read-only selects when you don\'t need the full model. Faster, less memory, and serializes directly to JSON without going through model construction.',
      category: 'performance',
    },
    {
      content:
        'CSRF protection is enabled by default — keep it on. For API-only views authenticated by token, exempt with `@csrf_exempt` ONLY on those views, never globally. Forms in templates use `{% csrf_token %}`.',
      category: 'security',
    },
    {
      content:
        'Background tasks: Celery + Redis/RabbitMQ for production. `django-q2` for simpler setups. NEVER `threading.Thread(target=task)` — it dies with the request worker and has no retry.',
      category: 'patterns',
    },
    {
      content:
        'Static files: `python manage.py collectstatic` collects from `STATICFILES_DIRS` to `STATIC_ROOT`. Serve via WhiteNoise (in-process, fine up to mid-traffic) or a CDN. Do NOT serve static via the WSGI app in production.',
      category: 'patterns',
    },
    {
      content:
        'Forms: `forms.Form` for arbitrary data, `forms.ModelForm` for model-bound. ModelForm `Meta.fields` MUST be explicit (a list) — never `\'__all__\'` for user-facing forms. `\'__all__\'` exposes any new field added later.',
      category: 'security',
    },
    {
      content:
        'Use `django-environ` or `python-decouple` to read env vars in settings. Validate types and presence at boot — fail fast on misconfiguration.',
      category: 'security',
    },
    {
      content:
        'Database connection pooling: PgBouncer in transaction-pooling mode in front of Postgres. `CONN_MAX_AGE` in settings keeps connections alive between requests. Default of 0 reconnects every request — slow.',
      category: 'performance',
    },
    {
      content:
        'Caching: Redis backend (`django-redis`). Cache hot querysets with `cache.get_or_set(key, lambda: expensive_query(), timeout=300)`. Use cache versioning (incr a version key) to invalidate without scanning.',
      category: 'performance',
    },
    {
      content:
        'Tests: `pytest-django` (preferred) or Django\'s built-in `TestCase`. Use `factory_boy` for fixtures — explicit factories beat shared `setUp` data. Mark DB tests so they run in transactions and roll back.',
      category: 'testing',
    },
    {
      content:
        'Admin: register models with `@admin.register(Model) class ModelAdmin`. Customize `list_display`, `search_fields`, `list_filter`. The default admin is dangerous on production — restrict access by IP or behind VPN.',
      category: 'security',
    },
    {
      content:
        'Time zones: `USE_TZ = True`. Store all times as UTC; convert at the boundary. Naive datetimes from `datetime.now()` are a bug — use `django.utils.timezone.now()`.',
      category: 'errors',
    },
  ],
};
