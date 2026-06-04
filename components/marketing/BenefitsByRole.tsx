import { Briefcase, ClipboardList, GraduationCap, Presentation, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface RoleBlock {
  icon: LucideIcon;
  title: string;
  benefits: string[];
  topAccent: string;
}

const ROLE_BLOCKS: RoleBlock[] = [
  {
    icon: Briefcase,
    title: 'Direction',
    benefits: [
      'Tableaux de bord académiques et financiers',
      'Pilotage multi-établissement et alertes',
      'Vision consolidée par cycle ou par programme',
    ],
    topAccent: 'border-t-primary-600',
  },
  {
    icon: ClipboardList,
    title: 'Administration',
    benefits: [
      'Inscriptions et dossiers étudiants centralisés',
      'Échéanciers de paiement et relances automatisées',
      'Reporting de recouvrement en temps réel',
    ],
    topAccent: 'border-t-primary-800',
  },
  {
    icon: Presentation,
    title: 'Enseignants',
    benefits: [
      'Saisie des notes et coefficients sans ressaisie',
      'Bulletins et moyennes générés automatiquement',
      'Présences, devoirs et planning au même endroit',
    ],
    topAccent: 'border-t-accent-500',
  },
  {
    icon: Users,
    title: 'Parents & étudiants',
    benefits: [
      'Résultats, présences et bulletins en temps réel',
      'Communications et documents centralisés',
      'Paiements et factures accessibles à tout moment',
    ],
    topAccent: 'border-t-accent-400',
  },
  {
    icon: GraduationCap,
    title: 'Formateurs',
    benefits: [
      'Catalogue, sessions et inscriptions partagés',
      'Supports, présences et messages dans un seul espace',
      'Suivi des heures et reporting commercial',
    ],
    topAccent: 'border-t-primary-400',
  },
];

export function BenefitsByRole() {
  return (
    <section className="container-wide py-20 bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-950 dark:to-neutral-950">
      <Reveal className="max-w-2xl">
        <p className="section-kicker">Bénéfices par profil</p>
        <h2 className="mt-3 font-display text-display-sm font-semibold text-ink dark:text-white">
          Des bénéfices concrets pour chaque profil
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
          Chaque utilisateur retrouve dans EcoleDigitale ce dont il a besoin au quotidien, sans
          surcouche inutile.
        </p>
      </Reveal>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ROLE_BLOCKS.map(({ icon: Icon, title, benefits, topAccent }) => (
          <RevealItem key={title}>
            <article className={`group flex h-full flex-col rounded-2xl border border-neutral-200/80 border-t-2 ${topAccent} bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-accent-300/70 hover:shadow-card-hover dark:border-white/10 dark:bg-white/6`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-all duration-200 group-hover:scale-110 group-hover:bg-accent-50 group-hover:text-accent-700 group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.14)] dark:bg-primary-400/12 dark:text-primary-200 dark:ring-primary-300/20 dark:group-hover:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink dark:text-white">{title}</h3>
              <ul className="mt-3 flex-1 space-y-2 text-sm text-ink-muted dark:text-neutral-300">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
