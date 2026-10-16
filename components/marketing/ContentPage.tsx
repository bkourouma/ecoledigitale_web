import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { InlineText } from '@/components/marketing/InlineText';
import { TrackedDemoCTA } from '@/components/marketing/TrackedDemoCTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { getModuleBySlug } from '@/lib/content/modules';
import type { ContentPageData } from '@/lib/marketing/pages';
import { stripInlineLinks } from '@/lib/marketing/inline-links';
import { cn } from '@/lib/ui/cn';
import { buildBreadcrumbList, buildFaqPage, buildWebPage } from '@/lib/seo/jsonld';

const LINK_CLASS =
  'text-primary-700 hover:bg-marker-soft inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4';

export interface ContentPageProps {
  page: ContentPageData;
  /** Fil d'Ariane (accueil compris). */
  breadcrumb: readonly { name: string; url: string }[];
}

/**
 * Gabarit commun de la page Côte d'Ivoire et des pages par fonction : un seul H1, des sections
 * H2, les packs concernés, une FAQ visible (reprise à l'identique en JSON-LD `FAQPage`),
 * le maillage « Voir aussi » et l'appel à la démonstration.
 */
export function ContentPage({ page, breadcrumb }: ContentPageProps) {
  const packs = page.packs.map((slug) => getModuleBySlug(slug).frontmatter);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbList(breadcrumb),
          buildWebPage({
            name: page.h1,
            description: page.seo.description,
            path: page.path,
          }),
          buildFaqPage(
            page.faq.map((entry) => ({
              question: entry.question,
              answer: stripInlineLinks(entry.answer),
            })),
          ),
        ]}
      />

      <section className="container-content py-14 md:py-20">
        <p className="font-display text-primary-700 text-3xl leading-none font-bold">
          {page.kicker}
        </p>
        <h1
          className={cn(
            'font-display text-primary-800 mt-3 max-w-4xl font-bold',
            page.h1.length > 60 ? 'text-display-sm' : 'text-display-md',
          )}
        >
          <span className="marker">{page.h1}</span>
        </h1>
        <p className="text-ink-muted mt-6 max-w-2xl text-lg leading-relaxed">{page.lead}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <TrackedDemoCTA placement="hero" size="lg">
            Demander une démonstration
          </TrackedDemoCTA>
          <Link href="/ressources" className={LINK_CLASS}>
            Guides et glossaire
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {page.sections.map((section) => (
        <section
          key={section.heading}
          className="container-content border-primary-700/70 grid gap-6 border-t-2 py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-14"
        >
          <h2 className="font-display text-display-sm text-primary-800 font-bold">
            {section.heading}
          </h2>
          <div className="text-ink-muted max-w-prose space-y-4 text-lg leading-relaxed">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>
                <InlineText text={paragraph} />
              </p>
            ))}
            {section.bullets && (
              <ul className="space-y-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <Check
                      className="text-accent-600 mt-1.5 h-5 w-5 shrink-0"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                    <span>
                      <InlineText text={bullet} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <section
        aria-labelledby="packs-heading"
        className="container-content border-primary-700/70 border-t-2 py-12 md:py-14"
      >
        <h2 id="packs-heading" className="font-display text-display-sm text-primary-800 font-bold">
          Les packs <span className="marker">concernés</span>
        </h2>
        <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
          {packs.map((pack) => (
            <li key={pack.slug} className="border-primary-200 border-b-2 border-dashed py-5">
              <Link href={`/modules/${pack.slug}`} className="group block">
                <h3 className="font-display text-primary-700 group-hover:text-primary-900 text-3xl leading-none font-bold">
                  {pack.name}
                </h3>
                <p className="text-ink-muted mt-2 text-base leading-relaxed">{pack.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="page-faq-heading"
        className="container-content border-primary-700/70 border-t-2 py-12 md:py-14"
      >
        <Reveal>
          <h2
            id="page-faq-heading"
            className="font-display text-display-sm text-primary-800 font-bold"
          >
            Questions <span className="marker">fréquentes</span>
          </h2>
        </Reveal>
        <FaqAccordion
          items={page.faq.map((entry) => ({
            question: entry.question,
            answer: <InlineText text={entry.answer} />,
          }))}
          className="border-primary-700/70 mt-8 border-t-2"
        />
      </section>

      <section aria-labelledby="page-see-also-heading" className="container-content py-12 md:py-16">
        <h2
          id="page-see-also-heading"
          className="font-display text-display-sm text-primary-800 font-bold"
        >
          Voir <span className="marker">aussi</span>
        </h2>
        <ul className="mt-6 space-y-3 text-lg">
          {page.seeAlso.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={LINK_CLASS}>
                {link.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
          <li>
            <Link href="/modules" className={LINK_CLASS}>
              Comparer le socle et les packs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link href="/demander-demo" className={LINK_CLASS}>
              Demander une démonstration
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </section>

      <FinalCTA />
    </>
  );
}
