import { Check } from 'lucide-react';
import type { ModuleFrontmatter } from '@/lib/content/module.schema';

export interface ModuleBenefitsProps {
  module: ModuleFrontmatter;
}

export function ModuleBenefits({ module }: ModuleBenefitsProps) {
  return (
    <section className="bg-surface-subtle border-y border-slate-100 py-16">
      <div className="container-content">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Ce que ce module apporte à votre établissement
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {module.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-sm leading-relaxed text-ink">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
