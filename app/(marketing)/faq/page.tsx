import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { InlineText } from '@/components/marketing/InlineText';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { ALL_FAQ, FAQ_GROUPS, FAQ_PAGE, answerWithInlineLink } from '@/lib/marketing/faq';
import { stripInlineLinks } from '@/lib/marketing/inline-links';
import { buildBreadcrumbList, buildFaqPage, buildWebPage } from '@/lib/seo/jsonld';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';

const PATH = FAQ_PAGE.path;
const DESCRIPTION = FAQ_PAGE.seo.description;

export const metadata: Metadata = buildMetadata({
  title: FAQ_PAGE.seo.title,
  description: DESCRIPTION,
  path: PATH,
  ogImage: DEFAULT_OG_IMAGE,
});

const LINK_CLASS =
  'text-primary-700 hover:bg-marker-soft inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4';

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbList([
            { name: 'Accueil', url: '/' },
            { name: 'Questions fréquentes', url: PATH },
          ]),
          buildWebPage({
            name: 'Questions fréquentes sur EcoleDigitale',
            description: DESCRIPTION,
            path: PATH,
          }),
          buildFaqPage(
            ALL_FAQ.map((entry) => ({
              question: entry.question,
              answer: stripInlineLinks(answerWithInlineLink(entry)),
            })),
          ),
        ]}
      />

      <section className="container-content py-14 md:py-20">
        <p className="font-display text-primary-700 text-3xl leading-none font-bold">FAQ</p>
        <h1 className="font-display text-display-md text-primary-800 mt-3 max-w-4xl font-bold">
          <span className="marker">Questions fréquentes sur EcoleDigitale</span>
        </h1>
        <p className="text-ink-muted mt-6 max-w-2xl text-lg leading-relaxed">
          EcoleDigitale est un logiciel de gestion scolaire pour les établissements d&apos;Afrique
          francophone, avec la Côte d&apos;Ivoire pour marché de référence. Retrouvez ici les
          réponses aux questions que les directeurs nous posent le plus souvent, avant de demander
          une démonstration.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <TrackedDemoCTA placement="hero" size="lg">
            Poser une question
          </TrackedDemoCTA>
          <Link href="/fonctions" className={LINK_CLASS}>
            Voir les fonctions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {FAQ_GROUPS.map((group, index) => (
        <section
          key={group.heading}
          aria-labelledby={`faq-group-${index}`}
          className="container-content border-primary-700/70 border-t-2 py-10 md:py-12"
        >
          <h2
            id={`faq-group-${index}`}
            className="font-display text-display-sm text-primary-800 font-bold"
          >
            {group.heading}
          </h2>
          <FaqAccordion
            items={group.entries.map((entry) => ({
              question: entry.question,
              answer: <InlineText text={answerWithInlineLink(entry)} />,
            }))}
            className="border-primary-700/70 mt-6 border-t-2"
          />
        </section>
      ))}

      <section className="container-content py-12 md:py-16" aria-labelledby="faq-aller-plus-loin">
        <h2
          id="faq-aller-plus-loin"
          className="font-display text-display-sm text-primary-800 font-bold"
        >
          Aller <span className="marker">plus loin</span>
        </h2>
        <ul className="mt-6 space-y-3 text-lg">
          <li>
            <Link href="/cote-d-ivoire" className={LINK_CLASS}>
              Logiciel de gestion scolaire en Côte d&apos;Ivoire
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/modules/socle-ecoledigitale" className={LINK_CLASS}>
              Le socle EcoleDigitale, commun à tous les établissements
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/modules" className={LINK_CLASS}>
              Comparer le socle et les packs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/tarifs" className={LINK_CLASS}>
              Tarifs : des offres sur devis
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/ressources" className={LINK_CLASS}>
              Guides et glossaire
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </section>

      <FinalCTA
        title="Une question qui n'est pas ici ?"
        description="Posez-la à un conseiller lors d'une démonstration : nous répondons sous 48 h ouvrées."
      />
    </>
  );
}
