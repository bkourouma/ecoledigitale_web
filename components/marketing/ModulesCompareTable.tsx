import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { loadModules } from '@/lib/content/modules';

export function ModulesCompareTable() {
  const modules = loadModules();

  return (
    <div className="border-primary-700/70 shadow-card overflow-x-auto border-2 bg-white">
      <table className="w-full text-left text-base">
        <caption className="sr-only">Vue comparative des modules EcoleDigitale</caption>
        <thead>
          <tr className="border-primary-700/70 bg-marker-soft/70 border-b-2">
            {['Module', 'Type', 'Positionnement', 'Détails'].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="font-display text-primary-800 px-5 py-3 text-2xl leading-none font-bold last:text-right"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map(({ frontmatter }) => (
            <tr
              key={frontmatter.slug}
              className="border-primary-200 hover:bg-marker-soft/40 border-b border-dashed transition-colors last:border-b-0"
            >
              <th
                scope="row"
                className="font-display text-primary-800 px-5 py-4 text-2xl font-bold whitespace-nowrap"
              >
                {frontmatter.name}
              </th>
              <td className="px-5 py-4 whitespace-nowrap">
                <span
                  className={
                    frontmatter.type === 'socle'
                      ? 'marker text-primary-800 font-bold'
                      : 'text-accent-700 font-bold'
                  }
                >
                  {frontmatter.type === 'socle' ? 'Socle de base' : 'Activable en option'}
                </span>
              </td>
              <td className="text-ink-muted min-w-72 px-5 py-4">{frontmatter.tagline}</td>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <Link
                  href={`/modules/${frontmatter.slug}`}
                  className="text-primary-700 hover:bg-marker-soft inline-flex items-center gap-1 font-bold underline decoration-2 underline-offset-4"
                >
                  Voir
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
