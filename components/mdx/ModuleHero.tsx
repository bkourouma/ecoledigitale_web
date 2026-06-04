import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';

export interface ModuleHeroProps {
  module: ModuleFrontmatter;
}

export function ModuleHero({ module }: ModuleHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(47,129,250,0.10) 0%, transparent 60%), #fff',
        }}
      />
      <div className="container-content py-16 md:py-24">
        <span
          className={
            module.type === 'socle'
              ? 'inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800'
              : 'inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700'
          }
        >
          {module.type === 'socle' ? 'Module socle' : 'Module optionnel'}
        </span>
        <h1 className="mt-4 max-w-3xl text-display-md font-semibold tracking-tight text-ink">
          {module.name}
        </h1>
        <p className="mt-3 text-xl font-medium text-ink-muted">{module.tagline}</p>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-muted">
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
