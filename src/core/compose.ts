import { getPreset, getPresetsByIds } from '../presets/index.js';
import type { DetectedStack, Rule, RuleCategory } from './types.js';

const CATEGORY_ORDER: RuleCategory[] = [
  'architecture',
  'conventions',
  'patterns',
  'imports',
  'errors',
  'security',
  'performance',
  'testing',
];

export interface ComposedRules {
  /** Flat ordered list of rules (deduplicated). */
  rules: Rule[];
  /** Rules grouped by category, in canonical order. */
  byCategory: Record<RuleCategory, Rule[]>;
  /** Preset ids that contributed rules. */
  appliedPresets: string[];
}

/**
 * Resolves a DetectedStack into a flat, deduplicated, ordered list of Rules.
 *
 * Order: base → frameworks → tools → strict.
 * Conditional rules from preset A are included only if their `when` preset id
 * is also in the active set.
 * Deduplication: identical content (case-insensitive, whitespace-collapsed)
 * collapses to the first occurrence.
 */
export function composeRules(stack: DetectedStack): ComposedRules {
  return composeFromIds(buildIdList(stack));
}

export function composeFromIds(presetIds: string[]): ComposedRules {
  const presets = getPresetsByIds(presetIds);
  const activeSet = new Set(presets.map((p) => p.id));
  const seen = new Map<string, true>();
  const rules: Rule[] = [];
  const appliedPresets: string[] = [];

  for (const preset of presets) {
    let contributed = 0;
    for (const rule of preset.rules) {
      if (addRule(rule, rules, seen)) contributed++;
    }
    if (preset.conditionalRules) {
      for (const rule of preset.conditionalRules) {
        if (!activeSet.has(rule.when)) continue;
        const { when: _when, ...plain } = rule;
        void _when;
        if (addRule(plain, rules, seen)) contributed++;
      }
    }
    if (contributed > 0) appliedPresets.push(preset.id);
  }

  const byCategory = groupByCategory(rules);
  return { rules, byCategory, appliedPresets };
}

function addRule(rule: Rule, out: Rule[], seen: Map<string, true>): boolean {
  const key = normalize(rule.content);
  if (seen.has(key)) return false;
  seen.set(key, true);
  out.push(rule);
  return true;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function groupByCategory(rules: Rule[]): Record<RuleCategory, Rule[]> {
  const acc = {
    architecture: [],
    conventions: [],
    patterns: [],
    imports: [],
    errors: [],
    security: [],
    performance: [],
    testing: [],
  } as Record<RuleCategory, Rule[]>;
  for (const r of rules) acc[r.category].push(r);
  // Categories ordered by CATEGORY_ORDER constant — no extra sorting needed
  // since acc keys match the canonical order.
  void CATEGORY_ORDER;
  return acc;
}

/**
 * Builds the canonical preset id list from a DetectedStack:
 *   1. base (always)
 *   2. each framework (skip ids that don't resolve to a preset)
 *   3. each tool (same)
 *
 * `strict` is opt-in — callers that want it must pass the id explicitly.
 */
export function buildIdList(stack: DetectedStack): string[] {
  const ids: string[] = ['base'];
  for (const f of stack.frameworks) {
    if (getPreset(f.id)) ids.push(f.id);
  }
  for (const t of stack.tools) {
    if (getPreset(t.id)) ids.push(t.id);
  }
  return ids;
}
