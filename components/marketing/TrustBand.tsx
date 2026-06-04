import { Building2, Database, ShieldCheck, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface TrustItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: 'Données sécurisées',
    description: "Hébergement européen, contrôle d'accès par rôle, sauvegardes régulières.",
  },
  {
    icon: Building2,
    title: 'Multi-établissement',
    description: 'Gérez plusieurs établissements et campus depuis une seule plateforme.',
  },
  {
    icon: Database,
    title: 'Données centralisées',
    description:
      "Une source unique pour l'académique, l'administratif, le financier et le pédagogique.",
  },
  {
    icon: Sparkles,
    title: 'Plateforme modulaire',
    description: 'Activez uniquement les modules pertinents pour votre activité.',
  },
];

export function TrustBand() {
  return (
    <section className="border-y border-neutral-200 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 dark:border-white/10 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
      <div className="container-wide py-14">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, description }) => (
            <RevealItem key={title}>
              <article className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent-300/70 hover:shadow-card-hover dark:border-white/10 dark:bg-white/6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-all duration-200 group-hover:scale-110 group-hover:bg-accent-50 group-hover:text-accent-700 group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.14)] dark:bg-primary-400/12 dark:text-primary-200 dark:ring-primary-300/20 dark:group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink dark:text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted dark:text-neutral-300">
                  {description}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
