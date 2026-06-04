import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    question: 'Combien coûte EcoleDigitale ?',
    answer: (
      <>
        Le prix dépend du nombre d'étudiants, des modules activés et de la durée d'engagement. Nous
        construisons une offre adaptée après un premier échange — pas de tarif standard affiché
        publiquement.{' '}
        <Link href="/demander-demo" className="font-medium text-primary-700 hover:underline dark:text-accent-300">
          Demandez un devis personnalisé
        </Link>
        .
      </>
    ),
  },
  {
    question: 'Combien de temps pour démarrer ?',
    answer: (
      <>
        Comptez 1 à 3 semaines entre la signature et la mise en service réelle. Nous importons vos
        données existantes (étudiants, classes, programmes) et formons vos équipes clés sur cette
        période.
      </>
    ),
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: (
      <>
        Vos données sont hébergées en Union Européenne avec sauvegardes régulières, contrôle d'accès
        par rôle et chiffrement en transit. Voir notre{' '}
        <Link href="/confidentialite" className="font-medium text-primary-700 hover:underline dark:text-accent-300">
          politique de confidentialité
        </Link>{' '}
        pour le détail.
      </>
    ),
  },
  {
    question: 'Faut-il activer tous les modules ?',
    answer: (
      <>
        Non. Le Socle EcoleDigitale est suffisant pour la plupart des établissements. Vous activez
        les autres modules (Parcours BTS, Parcours Supérieur, ProFormation, Campus Live) uniquement
        si votre activité le justifie, et au moment où vous en avez besoin.
      </>
    ),
  },
  {
    question: 'Peut-on migrer depuis un autre outil ou un fichier Excel ?',
    answer: (
      <>
        Oui. Nous importons les données existantes sous forme de fichiers structurés (Excel, CSV) ou
        via les exports de votre outil actuel. L'équipe d'onboarding accompagne cette étape.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section className="container-wide py-20">
      <Reveal className="max-w-2xl">
        <p className="section-kicker">Questions fréquentes</p>
        <h2 className="mt-3 font-display text-display-sm font-semibold text-ink dark:text-white">
          Les réponses aux questions des décideurs
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
          Pas la réponse à votre question ? Posez-la directement à notre équipe via le formulaire de
          démonstration.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card dark:border-white/10 dark:bg-white/6">
        {FAQS.map((faq, index) => (
          <details key={index} className="group border-b border-neutral-200/70 last:border-b-0 dark:border-white/10">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-neutral-50 dark:hover:bg-white/8">
              <h3 className="text-sm font-semibold text-ink dark:text-white">{faq.question}</h3>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-ink-muted transition-transform duration-200 group-open:rotate-45 dark:border-white/10 dark:text-neutral-300"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </span>
            </summary>
            <div className="px-6 pb-5 pt-0">
              <p className="text-sm leading-relaxed text-ink-muted dark:text-neutral-300">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
