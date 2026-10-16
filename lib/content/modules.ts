import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  ModuleFrontmatterSchema,
  validateModuleCatalog,
  type ModuleFrontmatter,
  type ModuleSlug,
} from '@/lib/content/module.schema';

const MODULES_DIR = join(process.cwd(), 'content', 'modules');

export interface ModuleBundle {
  frontmatter: ModuleFrontmatter;
  body: string;
}

let cachedModules: ModuleBundle[] | null = null;

/**
 * Charge les 5 modules MDX (socle + 4 packs) depuis content/modules/, valide chaque frontmatter
 * via Zod, et valide les invariants cross-modules.
 *
 * Cache en mémoire : un seul disk-read par process.
 * Le build Next.js exécute ce loader une fois pendant SSG → cache propre.
 */
export function loadModules(): ModuleBundle[] {
  if (cachedModules) return cachedModules;

  const files = readdirSync(MODULES_DIR).filter((f) => f.endsWith('.mdx'));
  const bundles: ModuleBundle[] = [];

  for (const file of files) {
    const slugFromFile = file.replace(/\.mdx$/, '');
    const raw = readFileSync(join(MODULES_DIR, file), 'utf-8');
    const parsed = matter(raw);

    const result = ModuleFrontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      throw new Error(
        `Invalid module frontmatter in ${file}:\n${result.error.issues
          .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
          .join('\n')}`,
      );
    }

    if (result.data.slug !== slugFromFile) {
      throw new Error(
        `Module slug mismatch in ${file}: frontmatter has "${result.data.slug}", expected "${slugFromFile}".`,
      );
    }

    bundles.push({ frontmatter: result.data, body: parsed.content });
  }

  validateModuleCatalog(bundles.map((b) => b.frontmatter));

  bundles.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  cachedModules = bundles;
  return bundles;
}

export function getModuleBySlug(slug: ModuleSlug): ModuleBundle {
  const bundle = loadModules().find((m) => m.frontmatter.slug === slug);
  if (!bundle) throw new Error(`Module not found: ${slug}`);
  return bundle;
}

export function getAllModuleSlugs(): ModuleSlug[] {
  return loadModules().map((m) => m.frontmatter.slug);
}

/** Utilitaire pour les tests. */
export function _resetModulesCacheForTests(): void {
  cachedModules = null;
}
