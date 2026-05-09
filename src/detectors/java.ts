import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

export async function detectJava(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const pomPath = join(cwd, 'pom.xml');
  const gradleKts = join(cwd, 'build.gradle.kts');
  const gradle = join(cwd, 'build.gradle');

  let text: string | null = null;
  let packageManager = 'maven';
  if (existsSync(pomPath)) {
    text = readFileSync(pomPath, 'utf8');
  } else if (existsSync(gradleKts)) {
    text = readFileSync(gradleKts, 'utf8');
    packageManager = 'gradle';
  } else if (existsSync(gradle)) {
    text = readFileSync(gradle, 'utf8');
    packageManager = 'gradle';
  } else {
    return null;
  }

  const frameworks: DetectedItem[] = [];
  if (text.includes('spring-boot') || text.includes('org.springframework.boot')) {
    frameworks.push({ id: 'spring-boot', name: 'Spring Boot', confidence: 1 });
  }

  return { runtime: 'java', packageManager, frameworks, tools: [] };
}
