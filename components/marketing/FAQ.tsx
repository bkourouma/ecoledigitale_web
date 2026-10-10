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
        <Link
          href="/demander-demo"
          className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
        >
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
        <Link
          href="/confidentialite"
          className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
        >
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
    <section aria-labelledby="faq-heading" className="container-wide py-16 md:py-20">
      <Reveal className="max-w-2xl">
        <h2 id="faq-heading" className="font-display text-display-sm text-primary-800 font-bold">
          Les réponses aux <span className="marker">questions</span> des décideurs
        </h2>
        <p className="text-ink-muted mt-3 text-lg leading-relaxed">
          Pas la réponse à votre question ? Posez-la directement à notre équipe via le formulaire de
          démonstration.
        </p>
      </Reveal>

      <Reveal className="border-primary-700/70 mt-10 max-w-5xl border-t-2">
        {FAQS.map((faq, index) => (
          <details key={index} className="group border-primary-200 border-b-2 border-dashed">
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
    </section>
  );
}
