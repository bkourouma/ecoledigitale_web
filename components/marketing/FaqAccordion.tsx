import { Plus } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export interface FaqAccordionItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqAccordionProps {
  items: readonly FaqAccordionItem[];
  /** Classes du conteneur ; par défaut une liste ligne à ligne sous un titre de section. */
  className?: string;
}

/**
 * Questions fréquentes en accordéon natif (`<details>`), sans JavaScript.
 * Le texte affiché doit rester identique à celui du JSON-LD `FAQPage` de la page.
 */
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  return (
    <Reveal className={className ?? 'border-primary-700/70 mt-10 max-w-5xl border-t-2'}>
      {items.map((faq) => (
        <details key={faq.question} className="group border-primary-200 border-b-2 border-dashed">
          <summary className="hover:bg-marker-soft/60 flex list-none items-center justify-between gap-4 py-5 transition-colors [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-primary-800 text-3xl leading-tight font-bold">
              {faq.question}
            </h3>
            <Plus
              className="text-pen-600 h-6 w-6 shrink-0 transition-transform duration-200 group-open:rotate-45"
              strokeWidth={3}
              aria-hidden="true"
            />
          </summary>
          <div className="pr-10 pb-6">
            <p className="text-ink-muted text-base leading-relaxed">{faq.answer}</p>
          </div>
        </details>
      ))}
    </Reveal>
  );
}
