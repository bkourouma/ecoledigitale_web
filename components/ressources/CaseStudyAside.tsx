import Link from 'next/link';
import { cn } from '@/lib/ui/cn';
import { ModuleSlugSchema } from '@/lib/content/module.schema';
import { getModuleBySlug } from '@/lib/content/modules';
import type { CaseStudyFrontmatter } from '@/lib/content/resource.schema';

interface CaseStudyAsideProps {
  caseStudy: CaseStudyFrontmatter['caseStudy'];
  className?: string;
}

/**
 * Encadré « En bref » d'une étude de cas : établissement, profil et modules
 * activés (chips cliquables vers les pages module). Les slugs de modules sont
 * validés au build par `validateResourceCatalog`.
 */
export function CaseStudyAside({ caseStudy, className }: CaseStudyAsideProps) {
  const modules = caseStudy.modulesActivated
    .map((slug) => {
      const parsed = ModuleSlugSchema.safeParse(slug);
      return parsed.success ? getModuleBySlug(parsed.data) : null;
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);

  return (
    <aside
      className={cn(
        'rounded-2xl border border-slate-200 bg-surface-subtle p-6',
        className,
      )}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        En bref
      </h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-ink">Établissement</dt>
          <dd className="text-ink-muted">{caseStudy.establishment}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">Profil</dt>
          <dd className="text-ink-muted">{caseStudy.establishmentType}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">Modules activés</dt>
          <dd className="mt-1.5 flex flex-wrap gap-2">
            {modules.map((module) => (
              <Link
                key={module.frontmatter.slug}
                href={`/modules/${module.frontmatter.slug}`}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
              >
                {module.frontmatter.name}
              </Link>
            ))}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
