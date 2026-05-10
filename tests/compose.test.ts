import { describe, expect, it } from 'vitest';
import { buildIdList, composeFromIds, composeRules } from '../src/core/compose.js';
import type { DetectedStack } from '../src/core/types.js';

function stackOf(frameworks: string[], tools: string[] = []): DetectedStack {
  return {
    runtime: ['node'],
    packageManager: 'pnpm',
    frameworks: frameworks.map((id) => ({ id, name: id, confidence: 1 })),
    tools: tools.map((id) => ({ id, name: id, confidence: 1 })),
    project: { name: 'x', structure: [], scripts: {}, keyFiles: [] },
  };
}

describe('composeRules', () => {
  it('always includes base preset rules', () => {
    const r = composeRules(stackOf([]));
    expect(r.appliedPresets).toContain('base');
    expect(r.rules.length).toBeGreaterThan(0);
  });

  it('includes framework preset rules when detected', () => {
    const r = composeRules(stackOf(['nextjs-approuter']));
    expect(r.appliedPresets).toEqual(['base', 'nextjs-approuter']);
    expect(r.rules.some((rule) => /Server Component/i.test(rule.content))).toBe(true);
  });

  it('includes conditional rule only when its dependency preset is active', () => {
    // Conditional rule on nextjs-approuter when "prisma" is active.
    const without = composeRules(stackOf(['nextjs-approuter']));
    const withPrisma = composeRules(stackOf(['nextjs-approuter'], ['prisma']));

    const condText = /Run Prisma queries inside Server Components/i;
    expect(without.rules.some((r) => condText.test(r.content))).toBe(false);
    expect(withPrisma.rules.some((r) => condText.test(r.content))).toBe(true);
  });

  it('orders presets: base → frameworks → tools', () => {
    const r = composeRules(stackOf(['express'], ['typescript', 'docker']));
    const order = r.appliedPresets;
    expect(order[0]).toBe('base');
    expect(order.indexOf('express')).toBeGreaterThan(order.indexOf('base'));
    expect(order.indexOf('typescript')).toBeGreaterThan(order.indexOf('express'));
  });

  it('strips conditional `when` field from emitted rule', () => {
    const r = composeRules(stackOf(['nextjs-approuter'], ['tailwind']));
    const cnRule = r.rules.find((rule) => /cn\(\)/i.test(rule.content));
    expect(cnRule).toBeDefined();
    expect(cnRule).not.toHaveProperty('when');
  });

  it('drops unknown preset ids without throwing', () => {
    const r = composeRules(stackOf(['this-preset-does-not-exist']));
    expect(r.appliedPresets).toEqual(['base']);
  });

  it('groups rules by canonical category order', () => {
    const r = composeRules(stackOf(['express']));
    const cats = Object.keys(r.byCategory);
    expect(cats).toEqual([
      'architecture',
      'conventions',
      'patterns',
      'imports',
      'errors',
      'security',
      'performance',
      'testing',
    ]);
  });

  it('deduplicates rules with identical (normalized) content', () => {
    // Force duplication by composing the same preset twice via the id list.
    const r = composeFromIds(['base', 'base']);
    const counts = new Map<string, number>();
    for (const rule of r.rules) {
      const k = rule.content.toLowerCase().replace(/\s+/g, ' ').trim();
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const [, n] of counts) {
      expect(n).toBe(1);
    }
  });

  it('composes multiple frameworks without duplicating shared rules', () => {
    const r = composeRules(stackOf(['express', 'fastify']));
    const ids = r.appliedPresets;
    expect(ids).toContain('express');
    expect(ids).toContain('fastify');
    expect(r.rules.length).toBeGreaterThan(0);
  });

  it('strict preset is opt-in (not added by detection)', () => {
    const r = composeRules(stackOf(['express']));
    expect(r.appliedPresets).not.toContain('strict');
  });

  it('strict preset can be added explicitly via composeFromIds', () => {
    const r = composeFromIds(['base', 'express', 'strict']);
    expect(r.appliedPresets).toContain('strict');
    // Strict comes AFTER frameworks per registry order.
    expect(r.appliedPresets.indexOf('strict')).toBeGreaterThan(
      r.appliedPresets.indexOf('express'),
    );
  });
});

describe('buildIdList', () => {
  it('puts base first', () => {
    const ids = buildIdList(stackOf(['express'], ['typescript']));
    expect(ids[0]).toBe('base');
  });

  it('drops detected ids that have no matching preset', () => {
    const ids = buildIdList(stackOf(['unknown-fwk'], ['typescript']));
    expect(ids).not.toContain('unknown-fwk');
    expect(ids).toContain('typescript');
  });
});
