import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { TrackedModuleLink } from '@/components/marketing/TrackedModuleLink';
import { ArrowRight, Layers } from 'lucide-react';

export interface ModuleCardProps {
  module: ModuleFrontmatter;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent-300/70 hover:shadow-card-hover focus-within:shadow-card-hover dark:border-white/10 dark:bg-white/6 dark:hover:border-accent-400/50">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-accent-400 to-primary-400 opacity-80"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-2">
        <span
          className={
            module.type === 'socle'
              ? 'inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-800 dark:bg-primary-400/15 dark:text-primary-200'
              : 'inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800 dark:bg-accent-400/15 dark:text-accent-200'
          }
        >
          {module.type === 'socle' ? 'Socle de base' : 'Module optionnel'}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-50 text-primary-700 transition-colors group-hover:bg-accent-50 group-hover:text-accent-700 dark:bg-white/8 dark:text-primary-200 dark:group-hover:bg-accent-400/12 dark:group-hover:text-accent-200">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink dark:text-white">
        {module.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted dark:text-neutral-300">
        {module.tagline}
      </p>
      <TrackedModuleLink
        href={`/modules/${module.slug}`}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 underline-offset-4 hover:text-accent-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 dark:text-primary-200 dark:hover:text-accent-200"
      >
        Voir le module
        <ArrowRight
          className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </TrackedModuleLink>
    </article>
  );
}
