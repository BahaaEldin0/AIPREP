import type { Preset } from '../../core/types.js';

export const dockerPreset: Preset = {
  id: 'docker',
  name: 'Docker',
  description: 'Docker / OCI images and docker-compose for local dev.',
  type: 'tool',
  rules: [
    {
      content:
        'Multi-stage builds: one stage for `deps`, one for `build`, one for `runner`. The runner stage `COPY --from=build /app/dist /app/dist` and ships only the production artifact. Single-stage images include node_modules + sources + build tools — orders of magnitude bigger.',
      category: 'performance',
    },
    {
      content:
        '`.dockerignore` MUST exclude `node_modules`, `.git`, `.env`, `dist`, `coverage`, `.next`, `.turbo`. Without it, the build context contains everything in the project — slow upload to Docker daemon and accidental secret leakage.',
      category: 'security',
    },
    {
      content:
        'Run as a non-root user: `USER node` (Node images ship a `node` user). Or create one: `RUN adduser -D appuser && chown -R appuser /app && USER appuser`. Containers running as root that get exploited can break out more easily.',
      category: 'security',
    },
    {
      content:
        'Pin base images to specific digests in production: `FROM node:20.11.0-alpine@sha256:...`. The `:latest` tag is a moving target — same Dockerfile builds different images over time. Renovate/Dependabot can update digests.',
      category: 'security',
    },
    {
      content:
        '`COPY package.json package-lock.json ./` THEN `RUN npm ci` THEN `COPY . .`. Putting source last means dep installs hit the layer cache when only source changed. Reverse order = full reinstall on every code change.',
      category: 'performance',
    },
    {
      content:
        'One process per container. Run init systems / supervisord ONLY when truly necessary (and prefer `tini` for proper signal handling). Multi-process containers complicate logging, scaling, and health checks.',
      category: 'architecture',
    },
    {
      content:
        '`HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1`. Without it, orchestrators treat any running container as healthy — a wedged process keeps receiving traffic. Set realistic `--interval` and `--start-period`.',
      category: 'patterns',
    },
    {
      content:
        'Environment variables via `-e KEY=VALUE` or env files. NEVER `ENV API_KEY=...` in the Dockerfile — that bakes the secret into image layers visible to anyone with `docker history`. Build-time secrets use BuildKit `--secret` mounts.',
      category: 'security',
    },
    {
      content:
        '`docker-compose.yaml` (NOT `docker-compose.yml` — both work but the `.yaml` form is the spec) for local dev. Define services with `depends_on` for ordering, `volumes` for hot reload, `networks` for isolation.',
      category: 'patterns',
    },
    {
      content:
        'Named volumes for state: `volumes: [\\\'pgdata:/var/lib/postgresql/data\\\']`. Bind mounts (`./data:/var/lib/...`) work but tie data to the host filesystem. Named volumes survive `docker-compose down` and recreate cleanly.',
      category: 'patterns',
    },
    {
      content:
        'Layer ordering: most-stable to least-stable. `FROM`, system packages, runtime install (`npm ci`), source `COPY`, build, expose, command. Each later step invalidates only later layers — keeps cache hot.',
      category: 'performance',
    },
    {
      content:
        '`ENTRYPOINT [\\\"node\\\", \\\"server.js\\\"]` + `CMD []` for fixed entrypoints with optional CLI args. Using shell form (`CMD node server.js`) wraps in `/bin/sh -c` and breaks signal handling — SIGTERM goes to sh, not the app.',
      category: 'errors',
    },
    {
      content:
        'For Node specifically, install `tini`: `RUN apk add --no-cache tini; ENTRYPOINT [\\\"/sbin/tini\\\", \\\"--\\\"]`. Without an init, your app inherits PID 1 and signal handling is wonky — SIGTERM may not trigger graceful shutdown.',
      category: 'errors',
    },
  ],
};
