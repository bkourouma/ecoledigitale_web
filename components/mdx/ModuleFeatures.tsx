import type { ModuleFrontmatter } from '@/lib/content/module.schema';

export interface ModuleFeaturesProps {
  module: ModuleFrontmatter;
}

export function ModuleFeatures({ module }: ModuleFeaturesProps) {
  return (
    <section className="container-content py-16">
      <h2 className="text-ink text-2xl font-semibold tracking-tight dark:text-neutral-50">
        Principales fonctionnalités
      </h2>
      <p className="text-ink-muted mt-2 max-w-prose dark:text-slate-300">
        Un aperçu de ce que vos équipes utiliseront au quotidien.
      </p>
      <ul className="text-ink mt-8 grid gap-x-8 gap-y-3 text-sm md:grid-cols-2 dark:text-neutral-50">
        {module.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2.5 border-b border-slate-100 pb-3 dark:border-slate-800"
          >
            <span
              aria-hidden="true"
              className="bg-brand-500 mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
