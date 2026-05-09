import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem, DetectedStack, ProjectInfo } from '../core/types.js';

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

function detectPackageManager(cwd: string): string {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
}

function allDeps(pkg: PackageJson): Record<string, string> {
  return { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
}

function pickVersion(deps: Record<string, string>, name: string): string | undefined {
  return deps[name]?.replace(/^[\^~>=<]+/, '');
}

function makeItem(
  id: string,
  name: string,
  version: string | undefined,
  confidence = 1,
): DetectedItem {
  return version ? { id, name, version, confidence } : { id, name, confidence };
}

export async function detectNode(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
  project: Pick<ProjectInfo, 'name' | 'scripts'>;
} | null> {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return null;

  let pkg: PackageJson;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as PackageJson;
  } catch {
    return null;
  }

  const deps = allDeps(pkg);
  const has = (name: string): boolean => name in deps;
  const frameworks: DetectedItem[] = [];
  const tools: DetectedItem[] = [];

  // Frameworks — Next.js (decide app router vs pages by file presence)
  if (has('next')) {
    const v = pickVersion(deps, 'next');
    const isAppRouter = existsSync(join(cwd, 'app')) || existsSync(join(cwd, 'src/app'));
    frameworks.push(
      isAppRouter
        ? makeItem('nextjs-approuter', 'Next.js (App Router)', v)
        : makeItem('nextjs-pages', 'Next.js (Pages Router)', v),
    );
  }

  // Remix (BEFORE generic React check — Remix uses React internally)
  if (has('@remix-run/react') || has('@remix-run/node') || has('@remix-run/serve')) {
    frameworks.push(makeItem('remix', 'Remix', pickVersion(deps, '@remix-run/react')));
  }

  // Astro
  if (has('astro')) {
    frameworks.push(makeItem('astro', 'Astro', pickVersion(deps, 'astro')));
  }

  // SvelteKit / Svelte
  if (has('@sveltejs/kit') || has('svelte')) {
    frameworks.push(
      makeItem(
        'svelte-sveltekit',
        'SvelteKit',
        pickVersion(deps, '@sveltejs/kit') ?? pickVersion(deps, 'svelte'),
      ),
    );
  }

  // Vue / Nuxt
  if (has('nuxt') || has('vue')) {
    frameworks.push(
      makeItem('vue-nuxt', 'Vue/Nuxt', pickVersion(deps, 'nuxt') ?? pickVersion(deps, 'vue')),
    );
  }

  // Angular
  if (has('@angular/core')) {
    frameworks.push(makeItem('angular', 'Angular', pickVersion(deps, '@angular/core')));
  }

  // React + Vite (only if no Next/Remix already chose)
  const hasNext = frameworks.some((f) => f.id.startsWith('nextjs'));
  const hasRemix = frameworks.some((f) => f.id === 'remix');
  if (!hasNext && !hasRemix && has('react') && has('vite')) {
    frameworks.push(makeItem('react-vite', 'React + Vite', pickVersion(deps, 'react')));
  }

  // Backend frameworks
  if (has('@nestjs/core')) {
    frameworks.push(makeItem('nestjs', 'NestJS', pickVersion(deps, '@nestjs/core')));
  } else if (has('fastify')) {
    frameworks.push(makeItem('fastify', 'Fastify', pickVersion(deps, 'fastify')));
  } else if (has('hono')) {
    frameworks.push(makeItem('hono', 'Hono', pickVersion(deps, 'hono')));
  } else if (has('express')) {
    frameworks.push(makeItem('express', 'Express', pickVersion(deps, 'express')));
  }

  // Tools / libraries
  if (has('typescript')) {
    tools.push(makeItem('typescript', 'TypeScript', pickVersion(deps, 'typescript')));
  }
  if (has('tailwindcss')) {
    tools.push(makeItem('tailwind', 'Tailwind CSS', pickVersion(deps, 'tailwindcss')));
  }
  if (has('prisma') || has('@prisma/client')) {
    tools.push(
      makeItem('prisma', 'Prisma', pickVersion(deps, '@prisma/client') ?? pickVersion(deps, 'prisma')),
    );
  }
  if (has('drizzle-orm')) {
    tools.push(makeItem('drizzle', 'Drizzle ORM', pickVersion(deps, 'drizzle-orm')));
  }
  if (has('zod')) {
    tools.push(makeItem('zod', 'Zod', pickVersion(deps, 'zod')));
  }
  if (has('eslint')) {
    tools.push(makeItem('eslint', 'ESLint', pickVersion(deps, 'eslint')));
  }
  if (has('prettier')) {
    tools.push(makeItem('prettier', 'Prettier', pickVersion(deps, 'prettier')));
  }
  if (has('zustand')) {
    tools.push(makeItem('zustand', 'Zustand', pickVersion(deps, 'zustand')));
  }
  if (has('@tanstack/react-query') || has('@tanstack/query-core')) {
    tools.push(
      makeItem(
        'tanstack-query',
        'TanStack Query',
        pickVersion(deps, '@tanstack/react-query') ?? pickVersion(deps, '@tanstack/query-core'),
      ),
    );
  }
  if (has('@trpc/server') || has('@trpc/client')) {
    tools.push(
      makeItem(
        'trpc',
        'tRPC',
        pickVersion(deps, '@trpc/server') ?? pickVersion(deps, '@trpc/client'),
      ),
    );
  }
  if (has('graphql') || has('@apollo/server') || has('apollo-server')) {
    tools.push(makeItem('graphql', 'GraphQL', pickVersion(deps, 'graphql')));
  }
  if (has('@supabase/supabase-js')) {
    tools.push(makeItem('supabase', 'Supabase', pickVersion(deps, '@supabase/supabase-js')));
  }
  if (has('vitest')) {
    tools.push(makeItem('vitest', 'Vitest', pickVersion(deps, 'vitest')));
  } else if (has('jest')) {
    tools.push(makeItem('jest', 'Jest', pickVersion(deps, 'jest')));
  }
  if (has('@playwright/test')) {
    tools.push(makeItem('playwright', 'Playwright', pickVersion(deps, '@playwright/test')));
  }
  if (has('cypress')) {
    tools.push(makeItem('cypress', 'Cypress', pickVersion(deps, 'cypress')));
  }
  if (has('@storybook/react') || has('storybook')) {
    tools.push(
      makeItem(
        'storybook',
        'Storybook',
        pickVersion(deps, '@storybook/react') ?? pickVersion(deps, 'storybook'),
      ),
    );
  }
  if (has('redis') || has('ioredis')) {
    tools.push(
      makeItem('redis', 'Redis', pickVersion(deps, 'redis') ?? pickVersion(deps, 'ioredis')),
    );
  }

  return {
    runtime: 'node',
    packageManager: detectPackageManager(cwd),
    frameworks,
    tools,
    project: {
      name: pkg.name ?? '',
      scripts: pkg.scripts ?? {},
    },
  };
}
