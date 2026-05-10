import type { Preset } from '../core/types.js';
import { basePreset } from './meta/base.js';
import { strictPreset } from './meta/strict.js';
import { angularPreset } from './frameworks/angular.js';
import { astroPreset } from './frameworks/astro.js';
import { djangoPreset } from './frameworks/django.js';
import { expressPreset } from './frameworks/express.js';
import { fastapiPreset } from './frameworks/fastapi.js';
import { fastifyPreset } from './frameworks/fastify.js';
import { flaskPreset } from './frameworks/flask.js';
import { goStdlibPreset } from './frameworks/go-stdlib.js';
import { honoPreset } from './frameworks/hono.js';
import { laravelPreset } from './frameworks/laravel.js';
import { nestjsPreset } from './frameworks/nestjs.js';
import { nextjsAppRouterPreset } from './frameworks/nextjs-approuter.js';
import { nextjsPagesPreset } from './frameworks/nextjs-pages.js';
import { railsPreset } from './frameworks/rails.js';
import { reactVitePreset } from './frameworks/react-vite.js';
import { remixPreset } from './frameworks/remix.js';
import { rustAxumPreset } from './frameworks/rust-axum.js';
import { springBootPreset } from './frameworks/spring-boot.js';
import { sveltePreset } from './frameworks/svelte.js';
import { svelteSveltekitPreset } from './frameworks/svelte-sveltekit.js';
import { vueNuxtPreset } from './frameworks/vue-nuxt.js';
import { drizzlePreset } from './tools/drizzle.js';
import { eslintPreset } from './tools/eslint.js';
import { graphqlPreset } from './tools/graphql.js';
import { prettierPreset } from './tools/prettier.js';
import { prismaPreset } from './tools/prisma.js';
import { supabasePreset } from './tools/supabase.js';
import { tailwindPreset } from './tools/tailwind.js';
import { tanstackQueryPreset } from './tools/tanstack-query.js';
import { trpcPreset } from './tools/trpc.js';
import { typescriptPreset } from './tools/typescript.js';
import { zodPreset } from './tools/zod.js';
import { zustandPreset } from './tools/zustand.js';
import { vitestPreset } from './tools/vitest.js';
import { jestPreset } from './tools/jest.js';
import { pytestPreset } from './tools/pytest.js';
import { playwrightPreset } from './tools/playwright.js';
import { cypressPreset } from './tools/cypress.js';
import { storybookPreset } from './tools/storybook.js';
import { dockerPreset } from './tools/docker.js';
import { turborepoPreset } from './tools/monorepo-turborepo.js';
import { redisPreset } from './tools/redis.js';

const registry = new Map<string, Preset>();

function register(preset: Preset): void {
  registry.set(preset.id, preset);
}

// Meta — always available.
register(basePreset);
register(strictPreset);

// JS/TS frameworks.
register(nextjsAppRouterPreset);
register(nextjsPagesPreset);
register(reactVitePreset);
register(vueNuxtPreset);
register(sveltePreset);
register(svelteSveltekitPreset);
register(remixPreset);
register(astroPreset);
register(angularPreset);

// Backend frameworks (Node + non-Node).
register(expressPreset);
register(fastifyPreset);
register(nestjsPreset);
register(honoPreset);
register(djangoPreset);
register(fastapiPreset);
register(flaskPreset);
register(goStdlibPreset);
register(rustAxumPreset);
register(laravelPreset);
register(railsPreset);
register(springBootPreset);

// Core tools.
register(typescriptPreset);
register(tailwindPreset);
register(prismaPreset);
register(drizzlePreset);
register(zodPreset);
register(eslintPreset);
register(prettierPreset);
register(zustandPreset);
register(tanstackQueryPreset);
register(trpcPreset);
register(graphqlPreset);
register(supabasePreset);

// Testing + DevOps tools.
register(vitestPreset);
register(jestPreset);
register(pytestPreset);
register(playwrightPreset);
register(cypressPreset);
register(storybookPreset);
register(dockerPreset);
register(turborepoPreset);
register(redisPreset);

// Frameworks and tools are registered as they land in subsequent commits.
export function registerPreset(preset: Preset): void {
  registry.set(preset.id, preset);
}

export function getPreset(id: string): Preset | undefined {
  return registry.get(id);
}

export function getAllPresets(): Preset[] {
  return Array.from(registry.values());
}

/**
 * Returns presets in apply order: base → frameworks → tools → strict.
 * Unknown ids are silently dropped (CLI surfaces this separately).
 */
export function getPresetsByIds(ids: string[]): Preset[] {
  const requested = new Set(ids);
  const out: Preset[] = [];

  // base first if requested
  if (requested.has('base')) {
    const p = registry.get('base');
    if (p) out.push(p);
    requested.delete('base');
  }

  // frameworks
  for (const id of requested) {
    const p = registry.get(id);
    if (p?.type === 'framework') {
      out.push(p);
    }
  }

  // tools
  for (const id of requested) {
    const p = registry.get(id);
    if (p?.type === 'tool') {
      out.push(p);
    }
  }

  // strict last (after framework/tool rules so it can override)
  if (requested.has('strict')) {
    const p = registry.get('strict');
    if (p) out.push(p);
  }

  return out;
}
