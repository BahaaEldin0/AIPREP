import type { Preset } from '../core/types.js';

const registry = new Map<string, Preset>();

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
 * Returns presets in canonical apply order: meta(base) → frameworks → tools → meta(strict).
 */
export function getPresetsByIds(ids: string[]): Preset[] {
  const seen = new Set<string>();
  const out: Preset[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const preset = registry.get(id);
    if (!preset) continue;
    out.push(preset);
    seen.add(id);
  }
  return out;
}
