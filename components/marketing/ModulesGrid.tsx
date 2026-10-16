import { ModuleCard } from '@/components/marketing/ModuleCard';
import { Board } from '@/components/ui/Board';
import { loadModules } from '@/lib/content/modules';

export interface ModulesGridProps {
  className?: string;
  heading?: string;
  lead?: string;
}

const TILTS = [-0.5, 0.4, -0.3, 0.5];

/**
 * Le socle et les 4 packs au tableau : le socle d'un côté, les packs par cycle qui
 * s'y ajoutent de l'autre. Source unique pour l'accueil et `/modules`.
 */
export function ModulesGrid({ className, heading, lead }: ModulesGridProps) {
  const modules = loadModules();
  const socle = modules.find(({ frontmatter }) => frontmatter.type === 'socle');
  const packs = modules.filter(({ frontmatter }) => frontmatter.type !== 'socle');

  return (
    <Board className={className} innerClassName="px-5 py-10 md:px-10 md:py-14">
      {heading && (
        <div className="mb-10 max-w-3xl">
          <h2 className="chalk font-display text-display-sm font-bold">{heading}</h2>
          {lead && <p className="text-ink-muted mt-3 text-lg leading-relaxed">{lead}</p>}
        </div>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[5fr_3.5fr_3.5fr] lg:gap-x-10">
        {socle && (
          <li className="relative sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <ModuleCard module={socle.frontmatter} tilt={-0.4} />
            <span
              aria-hidden="true"
              className="chalk font-display absolute -bottom-7 left-1/2 -translate-x-1/2 text-5xl leading-none font-bold lg:top-1/2 lg:-right-8 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2"
            >
              +
            </span>
          </li>
        )}
        {packs.map(({ frontmatter }, index) => (
          <li key={frontmatter.slug}>
            <ModuleCard module={frontmatter} tilt={TILTS[index % TILTS.length]} />
          </li>
        ))}
      </ul>
    </Board>
  );
}
