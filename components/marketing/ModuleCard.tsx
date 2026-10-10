import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { TrackedModuleLink } from '@/components/marketing/TrackedModuleLink';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/ui/cn';

export interface ModuleCardProps {
  module: ModuleFrontmatter;
  /** Inclinaison légère, pour que les blocs semblent écrits à la main. */
  tilt?: number;
}

/** Un module écrit à la craie dans un cadre tracé à main levée. À poser sur une ardoise. */
export function ModuleCard({ module, tilt = 0 }: ModuleCardProps) {
  const isSocle = module.type === 'socle';

  return (
    <article
      className={cn(
        'group chalk-box relative flex h-full flex-col p-6 transition-transform duration-200 ease-out focus-within:rotate-0 hover:rotate-0',
        isSocle && 'border-chalk-yellow/90 p-7 md:p-8',
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <h3
        className={cn(
          'chalk font-display leading-none font-bold',
          isSocle ? 'text-5xl md:text-6xl' : 'text-4xl',
        )}
      >
        {module.name}
      </h3>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 10"
        className="text-chalk-yellow mt-2 h-2.5 w-44"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path
          className="chalk-draw"
          style={{ ['--len' as string]: 240 }}
          d="M3 6c30-5 52 3 88-1s70 3 126-2"
        />
      </svg>
      <p className="text-ink-muted mt-4 flex-1 text-base leading-relaxed">{module.tagline}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <span className="font-display text-chalk-yellow text-2xl leading-none font-bold">
          {isSocle ? 'Le socle de base' : 'Module optionnel'}
        </span>
        <TrackedModuleLink
          href={`/modules/${module.slug}`}
          className="text-chalk decoration-chalk-yellow hover:text-chalk-yellow inline-flex items-center gap-1.5 text-base font-bold underline decoration-2 underline-offset-4 after:absolute after:inset-0"
        >
          Voir le module
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </TrackedModuleLink>
      </div>
    </article>
  );
}
