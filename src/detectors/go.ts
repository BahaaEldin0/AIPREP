import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

export async function detectGo(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const modPath = join(cwd, 'go.mod');
  if (!existsSync(modPath)) return null;

  const text = readFileSync(modPath, 'utf8');
  const requireLines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const has = (needle: string): boolean => requireLines.some((l) => l.includes(needle));

  const frameworks: DetectedItem[] = [];
  if (has('github.com/gin-gonic/gin')) {
    frameworks.push({ id: 'go-stdlib', name: 'Go (Gin)', confidence: 1 });
  } else if (has('github.com/labstack/echo')) {
    frameworks.push({ id: 'go-stdlib', name: 'Go (Echo)', confidence: 1 });
  } else if (has('github.com/gofiber/fiber')) {
    frameworks.push({ id: 'go-stdlib', name: 'Go (Fiber)', confidence: 1 });
  } else if (has('github.com/go-chi/chi')) {
    frameworks.push({ id: 'go-stdlib', name: 'Go (Chi)', confidence: 1 });
  } else {
    frameworks.push({ id: 'go-stdlib', name: 'Go (stdlib net/http)', confidence: 0.7 });
  }

  return { runtime: 'go', packageManager: 'go-mod', frameworks, tools: [] };
}
