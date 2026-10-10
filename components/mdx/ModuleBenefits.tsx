import { Check } from 'lucide-react';
import type { ModuleFrontmatter } from '@/lib/content/module.schema';
import { Board } from '@/components/ui/Board';

export interface ModuleBenefitsProps {
  module: ModuleFrontmatter;
}

/** Ce que le module apporte, écrit à la craie au tableau. */
export function ModuleBenefits({ module }: ModuleBenefitsProps) {
  return (
    <section className="container-content py-10 md:py-14">
      <Board innerClassName="px-6 py-10 md:px-12 md:py-14">
        <h2 className="chalk font-display text-display-sm max-w-2xl font-bold">
          Ce que ce module apporte à votre établissement
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {module.benefits.map((benefit) => (
            <li key={benefit} className="text-ink flex gap-3 text-lg leading-snug">
              <Check
                className="text-chalk-yellow mt-1 h-5 w-5 shrink-0"
                strokeWidth={3}
                aria-hidden="true"
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </Board>
    </section>
  );
}
