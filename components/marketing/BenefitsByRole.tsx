import { Check } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface RoleBlock {
  title: string;
  benefits: string[];
  /** Couleur du surligneur propre à chaque matière. */
  highlight: string;
}

const ROLE_BLOCKS: RoleBlock[] = [
  {
    title: 'Direction',
    benefits: [
      'Tableaux de bord académiques et financiers',
      'Pilotage multi-établissement et alertes',
      'Vision consolidée par cycle ou par programme',
    ],
    highlight: 'bg-marker',
  },
  {
    title: 'Administration',
    benefits: [
      'Inscriptions et dossiers étudiants centralisés',
      'Échéanciers de paiement et relances automatisées',
      'Reporting de recouvrement en temps réel',
    ],
    highlight: 'bg-chalk-blue',
  },
  {
    title: 'Enseignants',
    benefits: [
      'Saisie des notes et coefficients sans ressaisie',
      'Bulletins et moyennes générés automatiquement',
      'Présences, devoirs et planning au même endroit',
    ],
    highlight: 'bg-chalk-pink',
  },
  {
    title: 'Parents & étudiants',
    benefits: [
      'Résultats, présences et bulletins en temps réel',
      'Communications et documents centralisés',
      'Paiements et factures accessibles à tout moment',
    ],
    highlight: 'bg-accent-200',
  },
  {
    title: 'Formateurs',
    benefits: [
      'Catalogue, sessions et inscriptions partagés',
      'Supports, présences et messages dans un seul espace',
      'Suivi des heures et reporting commercial',
    ],
    highlight: 'bg-marker-soft',
  },
];

export function BenefitsByRole() {
  return (
    <section aria-labelledby="roles-heading" className="container-wide py-16 md:py-20">
      <Reveal className="max-w-2xl">
        <h2 id="roles-heading" className="font-display text-display-sm text-primary-800 font-bold">
          Des bénéfices concrets pour <span className="marker">chaque profil</span>
        </h2>
        <p className="text-ink-muted mt-3 text-lg leading-relaxed">
          Chaque utilisateur retrouve dans EcoleDigitale ce dont il a besoin au quotidien, sans
          surcouche inutile.
        </p>
      </Reveal>

      <RevealGroup className="mt-12">
        {ROLE_BLOCKS.map(({ title, benefits, highlight }) => (
          <RevealItem key={title}>
            <article className="border-primary-700/70 grid gap-4 border-t-2 py-8 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12">
              <h3 className="font-display text-primary-800 text-4xl leading-none font-bold">
                <span className="relative isolate inline-block">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-[-0.15em] bottom-[0.08em] -z-10 h-[0.5em] -rotate-1 ${highlight}`}
                  />
                  {title}
                </span>
              </h3>
              <ul className="text-ink-muted space-y-2.5 text-base">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <Check
                      className="text-accent-600 mt-1 h-5 w-5 shrink-0"
                      strokeWidth={3}
                      aria-hidden="true"
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
