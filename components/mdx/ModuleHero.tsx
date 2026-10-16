import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';

export interface ModuleHeroProps {
  module: ModuleFrontmatter;
}

export function ModuleHero({ module }: ModuleHeroProps) {
  return (
    <section className="container-content py-14 md:py-20">
      <p className="font-display text-primary-700 text-3xl leading-none font-bold">{module.name}</p>
      <h1 className="font-display text-display-lg text-primary-800 mt-3 max-w-3xl font-bold">
        <span className="marker">{module.h1}</span>
      </h1>
      <p className="font-display text-primary-700 mt-5 max-w-2xl text-3xl leading-tight font-bold">
        {module.tagline}
      </p>
      <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed">{module.headline}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <TrackedDemoCTA placement="hero" size="lg">
          {module.cta.label}
        </TrackedDemoCTA>
        <p className="red-note self-center text-2xl">
          {module.type === 'socle' ? 'Le socle commun' : 'Pack à ajouter au socle'}
        </p>
      </div>
    </section>
  );
}
