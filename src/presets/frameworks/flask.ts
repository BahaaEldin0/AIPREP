import type { Preset } from '../../core/types.js';

export const flaskPreset: Preset = {
  id: 'flask',
  name: 'Flask',
  description: 'Flask 3 with application factory pattern, blueprints, SQLAlchemy.',
  type: 'framework',
  rules: [
    {
      content:
        'Use the application factory pattern: `def create_app(config_name)` returns a configured app. Avoids global app instance, makes testing trivial (one app per test), and supports multiple configs in the same codebase.',
      category: 'architecture',
    },
    {
      content:
        'Organize features as Blueprints (`from flask import Blueprint; bp = Blueprint(\'users\', __name__, url_prefix=\'/users\')`). Each blueprint registers routes, error handlers, and CLI commands within its scope. Register via `app.register_blueprint(bp)` in the factory.',
      category: 'architecture',
    },
    {
      content:
        'Application context vs request context: `current_app` is the active app, `g` is per-request mutable state, `request` is the incoming HTTP request, `session` is signed-cookie data. Pushing contexts manually (`app.app_context()`) is needed in CLI scripts and tests.',
      category: 'patterns',
    },
    {
      content:
        'Flask-SQLAlchemy 3 changed init: `db = SQLAlchemy()` at module scope, `db.init_app(app)` in the factory. Models inherit from `db.Model`. Old single-step `SQLAlchemy(app)` is incompatible with the factory pattern.',
      category: 'architecture',
    },
    {
      content:
        'Use Flask-Migrate (Alembic wrapper) for schema changes: `flask db init`, `flask db migrate -m "add x"`, `flask db upgrade`. Hand-edit generated migrations only when Alembic gets autogenerate wrong. Commit migrations.',
      category: 'patterns',
    },
    {
      content:
        'Configuration: `app.config.from_object(\'config.ProductionConfig\')` for class-based config, plus `app.config.from_envvar(\'APP_SETTINGS\')` for env-driven. Validate required keys at factory time — fail fast.',
      category: 'security',
    },
    {
      content:
        'Jinja2 autoescaping is ON by default for `.html`/`.htm`/`.xml`. NEVER mark user input as `|safe` — that bypasses escaping and creates XSS. If you need to render trusted HTML, sanitize first with `bleach`.',
      category: 'security',
    },
    {
      content:
        'CSRF protection via `Flask-WTF` (`CSRFProtect(app)`). Forms in templates: `{{ form.csrf_token }}`. AJAX requests need the token from `<meta>` or a JSON endpoint, sent as `X-CSRFToken`.',
      category: 'security',
    },
    {
      content:
        'Error handlers: `@app.errorhandler(404) def not_found(e): return render_template(\'404.html\'), 404`. Register at app or blueprint level. Catch-all: `@app.errorhandler(Exception) def all_errors(e):` for production fallback.',
      category: 'errors',
    },
    {
      content:
        'For APIs use Flask-RESTful, Flask-Smorest (with marshmallow), or write thin route functions returning `jsonify(data)`. With many endpoints, switch to FastAPI — Flask\'s tooling lags for typed APIs.',
      category: 'architecture',
    },
    {
      content:
        'Authentication: Flask-Login for session-based, Flask-JWT-Extended for token-based. `@login_required` decorator on protected routes. Roll your own auth ONLY for unusual requirements — these libs handle CSRF, session fixation, etc.',
      category: 'security',
    },
    {
      content:
        'Background jobs: Celery (mature, complex) or RQ (simple, Redis-only). Define tasks in their own module imported by the worker AND the web app. NEVER use threads — they die with the WSGI worker.',
      category: 'patterns',
    },
    {
      content:
        'Production WSGI server: gunicorn (`gunicorn -w 4 wsgi:app`) or uWSGI. NEVER `flask run` in production — Werkzeug\'s dev server is single-threaded and shouts at you in the logs.',
      category: 'performance',
    },
    {
      content:
        'Logging: `app.logger.info(...)` writes to a logger named after the app. Configure in factory: `logging.config.dictConfig(...)`. Production: JSON format, levels per logger, errors to a separate handler (e.g., Sentry).',
      category: 'errors',
    },
    {
      content:
        'Tests: `pytest` + `app.test_client()`. Use a fixture that creates an app with `TESTING=True` config and rolls back DB transactions between tests. Pytest fixtures beat unittest setUp for sharing.',
      category: 'testing',
    },
    {
      content:
        'Static files: `app.send_static_file(\'logo.png\')` works for dev. In production, serve `static/` via nginx or a CDN — Flask serves them but slower than nginx by an order of magnitude.',
      category: 'performance',
    },
  ],
};
