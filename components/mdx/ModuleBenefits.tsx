import { Check } from 'lucide-react';
import type { ModuleFrontmatter } from '@/lib/content/module.schema';

export interface ModuleBenefitsProps {
  module: ModuleFrontmatter;
}

export function ModuleBenefits({ module }: ModuleBenefitsProps) {
  return (
    <section className="bg-surface-subtle border-y border-slate-100 py-16 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container-content">
        <h2 className="text-ink text-2xl font-semibold tracking-tight dark:text-neutral-50">
          Ce que ce module apporte à votre établissement
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {module.benefits.map((benefit) => (
            <li
              key={benefit}
              className="shadow-card flex gap-3 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-ink text-sm leading-relaxed dark:text-neutral-50">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
