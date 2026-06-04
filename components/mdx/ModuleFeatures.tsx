import type { ModuleFrontmatter } from '@/lib/content/module.schema';

export interface ModuleFeaturesProps {
  module: ModuleFrontmatter;
}

export function ModuleFeatures({ module }: ModuleFeaturesProps) {
  return (
    <section className="container-content py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Principales fonctionnalités
      </h2>
      <p className="mt-2 max-w-prose text-ink-muted">
        Un aperçu de ce que vos équipes utiliseront au quotidien.
      </p>
      <ul className="mt-8 grid gap-x-8 gap-y-3 text-sm text-ink md:grid-cols-2">
        {module.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 border-b border-slate-100 pb-3">
            <span
              aria-hidden="true"
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
