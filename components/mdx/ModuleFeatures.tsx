import { Check } from 'lucide-react';
import type { ModuleFrontmatter } from '@/lib/content/module.schema';

export interface ModuleFeaturesProps {
  module: ModuleFrontmatter;
}

export function ModuleFeatures({ module }: ModuleFeaturesProps) {
  return (
    <section className="container-content py-12 md:py-16">
      <h2 className="font-display text-display-sm text-primary-800 font-bold">
        Principales <span className="marker">fonctionnalités</span>
      </h2>
      <p className="text-ink-muted mt-2 max-w-prose text-lg">
        Un aperçu de ce que vos équipes utiliseront au quotidien.
      </p>
      <ul className="border-primary-700/70 mt-8 grid gap-x-12 border-t-2 md:grid-cols-2">
        {module.features.map((feature) => (
          <li
            key={feature}
            className="border-primary-200 text-ink flex gap-3 border-b-2 border-dashed py-4 text-base"
          >
            <Check
              className="text-accent-600 mt-1 h-5 w-5 shrink-0"
              strokeWidth={3}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
