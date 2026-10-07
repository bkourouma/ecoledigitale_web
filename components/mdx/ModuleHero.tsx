import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';

export interface ModuleHeroProps {
  module: ModuleFrontmatter;
}

export function ModuleHero({ module }: ModuleHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(47,129,250,0.10) 0%, transparent 60%), #fff',
        }}
      />
      <div className="container-content py-16 md:py-24">
        <span
          className={
            module.type === 'socle'
              ? 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-100 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
              : 'inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }
        >
          {module.type === 'socle' ? 'Module socle' : 'Module optionnel'}
        </span>
        <h1 className="text-display-md text-ink mt-4 max-w-3xl font-semibold tracking-tight dark:text-neutral-50">
          {module.name}
        </h1>
        <p className="text-ink-muted mt-3 text-xl font-medium dark:text-slate-300">
          {module.tagline}
        </p>
        <p className="text-ink-muted mt-4 max-w-prose text-base leading-relaxed dark:text-slate-300">
          {module.headline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedDemoCTA placement="hero" size="lg">
            {module.cta.label}
          </TrackedDemoCTA>
        </div>
      </div>
    </section>
  );
}
