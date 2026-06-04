import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { loadModules } from '@/lib/content/modules';

export function ModulesCompareTable() {
  const modules = loadModules();

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-card dark:border-white/10 dark:bg-white/6">
      <table className="w-full divide-y divide-neutral-200 text-left text-sm dark:divide-white/10">
        <caption className="sr-only">Vue comparative des modules EcoleDigitale</caption>
        <thead className="sticky top-0 bg-neutral-50 dark:bg-white/8">
          <tr>
            {['Module', 'Type', 'Positionnement', 'Détails'].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-ink-soft last:text-right dark:text-neutral-400"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
          {modules.map(({ frontmatter }) => (
            <tr key={frontmatter.slug} className="transition-colors hover:bg-neutral-50 dark:hover:bg-white/8">
              <th scope="row" className="whitespace-nowrap px-5 py-4 font-semibold text-ink dark:text-white">
                {frontmatter.name}
              </th>
              <td className="whitespace-nowrap px-5 py-4">
                <span
                  className={
                    frontmatter.type === 'socle'
                      ? 'inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-800 dark:bg-primary-400/15 dark:text-primary-200'
                      : 'inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800 dark:bg-accent-400/15 dark:text-accent-200'
                  }
                >
                  {frontmatter.type === 'socle' ? 'Socle de base' : 'Activable en option'}
                </span>
              </td>
              <td className="min-w-72 px-5 py-4 text-ink-muted dark:text-neutral-300">
                {frontmatter.tagline}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-right">
                <Link
                  href={`/modules/${frontmatter.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-primary-700 underline-offset-4 hover:text-accent-700 hover:underline dark:text-primary-200 dark:hover:text-accent-200"
                >
                  Voir
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
