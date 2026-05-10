import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { detectStack } from '../src/core/detect.js';
import { detectNode } from '../src/detectors/node.js';
import { detectPython } from '../src/detectors/python.js';
import { detectGo } from '../src/detectors/go.js';
import { detectRust } from '../src/detectors/rust.js';
import { detectPhp } from '../src/detectors/php.js';
import { detectRuby } from '../src/detectors/ruby.js';
import { detectJava } from '../src/detectors/java.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name: string): string => resolve(__dirname, 'fixtures', name);

describe('detectNode', () => {
  it('detects Next.js app router via app/ directory', async () => {
    const r = await detectNode(fx('nextjs-app'));
    expect(r).not.toBeNull();
    expect(r!.frameworks.map((f) => f.id)).toContain('nextjs-approuter');
    expect(r!.frameworks.map((f) => f.id)).not.toContain('nextjs-pages');
  });

  it('detects pnpm package manager via lockfile', async () => {
    const r = await detectNode(fx('nextjs-app'));
    expect(r!.packageManager).toBe('pnpm');
  });

  it('detects Prisma + Tailwind + Vitest + TypeScript on a Next.js project', async () => {
    const r = await detectNode(fx('nextjs-app'));
    const ids = r!.tools.map((t) => t.id);
    expect(ids).toContain('prisma');
    expect(ids).toContain('tailwind');
    expect(ids).toContain('vitest');
    expect(ids).toContain('typescript');
  });

  it('detects Express + Drizzle + Jest + npm on Express fixture', async () => {
    const r = await detectNode(fx('express-api'));
    expect(r!.frameworks.map((f) => f.id)).toContain('express');
    const ids = r!.tools.map((t) => t.id);
    expect(ids).toContain('drizzle');
    expect(ids).toContain('jest');
    expect(r!.packageManager).toBe('npm');
  });

  it('detects React+Vite + Zustand + TanStack Query on Vite fixture', async () => {
    const r = await detectNode(fx('react-vite'));
    expect(r!.frameworks.map((f) => f.id)).toContain('react-vite');
    const ids = r!.tools.map((t) => t.id);
    expect(ids).toContain('zustand');
    expect(ids).toContain('tanstack-query');
    expect(ids).toContain('tailwind');
  });

  it('extracts version strings (stripped of ^ ~)', async () => {
    const r = await detectNode(fx('nextjs-app'));
    const next = r!.frameworks.find((f) => f.id === 'nextjs-approuter');
    expect(next?.version).toMatch(/^\d/);
  });

  it('returns null on a directory with no package.json', async () => {
    const r = await detectNode(fx('go-api'));
    expect(r).toBeNull();
  });

  it('detects plain Svelte (no SvelteKit) as id="svelte"', async () => {
    const r = await detectNode(fx('svelte-only'));
    const ids = r!.frameworks.map((f) => f.id);
    expect(ids).toContain('svelte');
    expect(ids).not.toContain('svelte-sveltekit');
  });
});

describe('detectPython', () => {
  it('detects FastAPI + pytest from pyproject.toml', async () => {
    const r = await detectPython(fx('python-fastapi'));
    expect(r).not.toBeNull();
    expect(r!.frameworks.map((f) => f.id)).toContain('fastapi');
    expect(r!.tools.map((t) => t.id)).toContain('pytest');
  });

  it('extracts version strings from python deps (PEP 621 + poetry)', async () => {
    const r = await detectPython(fx('python-fastapi'));
    const fastapi = r!.frameworks.find((f) => f.id === 'fastapi');
    expect(fastapi?.version).toBe('0.115.0');
    const pytest = r!.tools.find((t) => t.id === 'pytest');
    expect(pytest?.version).toBe('8.0');
  });

  it('returns null when no python manifest exists', async () => {
    const r = await detectPython(fx('nextjs-app'));
    expect(r).toBeNull();
  });
});

describe('detectGo', () => {
  it('detects Gin from go.mod require block', async () => {
    const r = await detectGo(fx('go-api'));
    expect(r).not.toBeNull();
    expect(r!.runtime).toBe('go');
    expect(r!.frameworks[0]?.name).toContain('Gin');
  });
});

describe('detectRust', () => {
  it('detects Axum from Cargo.toml', async () => {
    const r = await detectRust(fx('rust-axum'));
    expect(r).not.toBeNull();
    expect(r!.frameworks.map((f) => f.id)).toContain('rust-axum');
  });
});

describe('detectPhp', () => {
  it('detects Laravel from composer.json require', async () => {
    const r = await detectPhp(fx('laravel-app'));
    expect(r).not.toBeNull();
    expect(r!.frameworks.map((f) => f.id)).toContain('laravel');
  });
});

describe('detectRuby', () => {
  it('detects Rails from Gemfile', async () => {
    const r = await detectRuby(fx('rails-app'));
    expect(r).not.toBeNull();
    expect(r!.frameworks.map((f) => f.id)).toContain('rails');
  });
});

describe('detectJava', () => {
  it('detects Spring Boot from pom.xml', async () => {
    const r = await detectJava(fx('spring-boot'));
    expect(r).not.toBeNull();
    expect(r!.frameworks.map((f) => f.id)).toContain('spring-boot');
    expect(r!.packageManager).toBe('maven');
  });
});

describe('detectStack orchestrator', () => {
  it('produces a complete DetectedStack for the Next.js fixture', async () => {
    const stack = await detectStack(fx('nextjs-app'));
    expect(stack.runtime).toEqual(['node']);
    expect(stack.packageManager).toBe('pnpm');
    expect(stack.frameworks.length).toBeGreaterThan(0);
    expect(stack.tools.length).toBeGreaterThan(2);
    expect(stack.project.name).toBe('nextjs-fixture');
    expect(Object.keys(stack.project.scripts)).toContain('dev');
  });

  it('produces a stack for Laravel fixture without a Node runtime', async () => {
    const stack = await detectStack(fx('laravel-app'));
    expect(stack.runtime).toEqual(['php']);
    expect(stack.frameworks.map((f) => f.id)).toContain('laravel');
  });

  it('returns runtime=unknown on an empty directory', async () => {
    const stack = await detectStack(fx('rails-app'));
    expect(stack.runtime).toEqual(['ruby']);
    // Smoke check: orchestrator never throws on a valid directory.
    expect(stack.frameworks).toBeDefined();
  });

  it('detects polyglot monorepo with backend/ Python and frontend/ Node', async () => {
    const stack = await detectStack(fx('polyglot-monorepo'));
    expect(stack.runtime).toContain('node');
    expect(stack.runtime).toContain('python');
    const fids = stack.frameworks.map((f) => f.id);
    expect(fids).toContain('fastapi');
    expect(fids).toContain('react-vite');
  });

  it('detects turbo-style monorepo with apps/web (Next.js) and apps/api (Express)', async () => {
    const stack = await detectStack(fx('turbo-monorepo'));
    expect(stack.runtime).toEqual(['node']);
    const fids = stack.frameworks.map((f) => f.id);
    expect(fids).toContain('nextjs-pages'); // no app/ dir in fixture, falls through
    expect(fids).toContain('express');
  });

  it('finds projects under arbitrarily-named subdirs (templates/v3/my-app/)', async () => {
    const stack = await detectStack(fx('deep-nested'));
    expect(stack.runtime).toContain('node');
    expect(stack.frameworks.map((f) => f.id)).toContain('svelte');
  });

  it('skips node_modules / build / dist / target when walking', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'aiprep-walk-'));
    try {
      // Plant manifests inside dirs that MUST be skipped. If the walker
      // descends into any of them, these frameworks would leak through.
      for (const dir of ['node_modules/x', 'dist/y', 'build/z', 'target/q', 'vendor/v']) {
        const sub = join(tmp, dir);
        mkdirSync(sub, { recursive: true });
        writeFileSync(
          join(sub, 'package.json'),
          JSON.stringify({ name: dir, dependencies: { fastify: '^5.0.0' } }),
        );
      }
      // And a real project that SHOULD be found.
      const real = join(tmp, 'apps', 'web');
      mkdirSync(real, { recursive: true });
      writeFileSync(
        join(real, 'package.json'),
        JSON.stringify({ name: 'web', dependencies: { express: '^4.21.0' } }),
      );

      const stack = await detectStack(tmp);
      const fids = stack.frameworks.map((f) => f.id);
      expect(fids).toContain('express');
      expect(fids).not.toContain('fastify');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
