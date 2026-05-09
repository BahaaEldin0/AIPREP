import type { Preset } from '../core/types.js';
import { basePreset } from './meta/base.js';
import { strictPreset } from './meta/strict.js';
import { angularPreset } from './frameworks/angular.js';
import { astroPreset } from './frameworks/astro.js';
import { nextjsAppRouterPreset } from './frameworks/nextjs-approuter.js';
import { nextjsPagesPreset } from './frameworks/nextjs-pages.js';
import { reactVitePreset } from './frameworks/react-vite.js';
import { remixPreset } from './frameworks/remix.js';
import { svelteSveltekitPreset } from './frameworks/svelte-sveltekit.js';
import { vueNuxtPreset } from './frameworks/vue-nuxt.js';

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
register(svelteSveltekitPreset);
register(remixPreset);
register(astroPreset);
register(angularPreset);

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
