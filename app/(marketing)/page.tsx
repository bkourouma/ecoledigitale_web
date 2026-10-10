import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TrackedDemoCTA, TrackedModulesCTA } from '@/components/marketing/TrackedDemoCTA';
import { ModulesGrid } from '@/components/marketing/ModulesGrid';
import { BenefitsByRole } from '@/components/marketing/BenefitsByRole';
import { TrustBand } from '@/components/marketing/TrustBand';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { FAQ } from '@/components/marketing/FAQ';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildFaqPage } from '@/lib/seo/jsonld';
import { HOME_FAQ } from '@/lib/marketing/faq';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'EcoleDigitale — gestion scolaire et formation',
  description:
    'Plateforme SaaS modulaire pour digitaliser la gestion académique, pédagogique et financière de votre établissement, du cycle BTS à la formation professionnelle.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildFaqPage(HOME_FAQ)} />

      <section className="container-wide grid gap-14 pt-12 pb-12 md:pt-16 md:pb-16 lg:grid-cols-[1.5fr_0.5fr] lg:items-start lg:gap-10">
        <div>
          <h1 className="font-display text-display-lg text-primary-800 font-bold">
            <span
              className="written block"
              style={{
                ['--write-duration' as string]: '0.9s',
                ['--write-delay' as string]: '0.15s',
              }}
            >
              EcoleDigitale centralise la
            </span>
            <span
              className="written block"
              style={{ ['--write-duration' as string]: '1.3s', ['--write-delay' as string]: '1s' }}
            >
              <span className="marker">gestion académique, pédagogique et financière</span>
            </span>
            <span
              className="written block"
              style={{ ['--write-duration' as string]: '1s', ['--write-delay' as string]: '2.3s' }}
            >
              de votre établissement.
            </span>
          </h1>

          <p className="text-ink-muted mt-8 max-w-xl text-lg leading-relaxed">
            Du cycle BTS à la formation professionnelle, une plateforme modulaire avec des espaces
            dédiés pour chaque profil : direction, enseignants, étudiants, parents, formateurs.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-5">
            <TrackedDemoCTA placement="hero" size="lg">
              Demander une démonstration
            </TrackedDemoCTA>
            <TrackedModulesCTA placement="hero" size="lg" variant="ghost">
              Voir les modules
            </TrackedModulesCTA>
          </div>

          <p
            className="red-note note-in mt-7 inline-block text-2xl"
            style={{ ['--note-delay' as string]: '3s' }}
          >
            Réponse sous 48 heures, pas de carte bancaire, pas d&apos;engagement.
          </p>
        </div>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm lg:mt-6 lg:max-w-none">
          <aside
            aria-label="Exemple de bulletin d'établissement"
            className="sheet tape rotate-[2deg] px-6 pt-8 pb-7"
          >
            <p className="font-display text-primary-800 text-3xl leading-none font-bold">
              Bulletin de l&apos;établissement
            </p>
            <p className="text-ink-soft mt-1 text-sm">Exemple illustratif</p>

            <ul className="text-ink mt-6 space-y-[calc(var(--unit)-1.4rem)] text-base">
              {['Inscriptions', 'Notes & bulletins', 'Paiements'].map((label) => (
                <li key={label} className="flex items-center gap-3 leading-7">
                  <Check
                    className="text-accent-600 h-5 w-5 shrink-0"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  <span className="font-bold">{label}</span>
                  <span
                    aria-hidden="true"
                    className="border-primary-300 h-0 flex-1 border-b-2 border-dotted"
                  />
                  <span className="font-display text-primary-700 text-2xl leading-none font-bold">
                    suivi
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 text-base leading-7">
              <div className="flex gap-2">
                <dt className="font-bold">Modules actifs</dt>
                <dd className="text-ink-muted">Socle, Parcours BTS, Campus Live</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Cycles</dt>
                <dd className="text-ink-muted">BTS &amp; Supérieur</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Pilotage</dt>
                <dd className="text-ink-muted">En temps réel</dd>
              </div>
            </dl>

            <p
              className="red-note note-in absolute right-4 -bottom-6 text-4xl"
              style={{ ['--note-delay' as string]: '2.6s' }}
            >
              Très bien !
            </p>
          </aside>
        </Reveal>
      </section>

      <TrustBand />

      <section className="container-wide py-12 md:py-16">
        <Reveal>
          <ModulesGrid
            heading="5 modules pour s'adapter à votre activité"
            lead="Commencez par le socle, ajoutez les modules selon vos besoins."
          />
        </Reveal>
        <div className="mt-8 flex justify-end">
          <Link
            href="/modules"
            className="font-display text-primary-700 pen-underline hover:text-primary-900 inline-flex items-center gap-1.5 text-3xl leading-none font-bold"
          >
            Comparer tous les modules
            <ArrowRight className="h-6 w-6" strokeWidth={3} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <BenefitsByRole />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
    </>
  );
}
