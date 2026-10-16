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
      'Pilotage de plusieurs établissements depuis un seul compte',
      'Suivi des frais de scolarité payés, restants et en retard',
    ],
    highlight: 'bg-marker',
  },
  {
    title: 'Secrétariat et économat',
    benefits: [
      'Inscriptions et dossiers des élèves centralisés',
      'Import de vos listes depuis Excel',
      'Certificats, attestations et frais de scolarité par élève',
    ],
    highlight: 'bg-chalk-blue',
  },
  {
    title: 'Enseignants',
    benefits: [
      'Saisie des notes, moyennes et bulletins selon les règles ivoiriennes',
      'Appel et absences depuis le téléphone',
      'Emploi du temps et conseil de classe au même endroit',
    ],
    highlight: 'bg-chalk-pink',
  },
  {
    title: 'Parents et élèves',
    benefits: [
      'Résultats, absences et bulletins dans un portail',
      'Messages de l’école par SMS et par WhatsApp',
      'Paiement des frais de scolarité par Mobile Money',
    ],
    highlight: 'bg-accent-200',
  },
  {
    title: 'Formateurs et classes virtuelles',
    benefits: [
      'Cours en ligne et devoirs sur la plateforme LMS',
      'Classes virtuelles rattachées à vos classes',
      'Certificats et attestations pour les apprenants',
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
