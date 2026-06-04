import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gauge, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { TrackedDemoCTA, TrackedModulesCTA } from '@/components/marketing/TrackedDemoCTA';
import { ModulesGrid } from '@/components/marketing/ModulesGrid';
import { BenefitsByRole } from '@/components/marketing/BenefitsByRole';
import { TrustBand } from '@/components/marketing/TrustBand';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { FAQ } from '@/components/marketing/FAQ';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
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

const PROOF_ITEMS = [
  { value: 5, label: 'modules activables' },
  { value: 48, suffix: ' h', label: 'pour une première réponse' },
  { value: 3, prefix: '1-', label: 'semaines de mise en service' },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildFaqPage(HOME_FAQ)} />

      <section className="relative overflow-hidden premium-surface dark:dark-premium-surface">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40 dark:opacity-10" aria-hidden="true" />
        <div aria-hidden="true" className="animate-blob pointer-events-none absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-500/20" />
        <div aria-hidden="true" className="animate-blob-delayed pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-accent-400/10 blur-3xl dark:bg-accent-500/16" />
        <div aria-hidden="true" className="animate-blob-slow pointer-events-none absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-primary-300/8 blur-3xl dark:bg-accent-600/10" />

        <div className="container-wide grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur dark:border-primary-300/20 dark:bg-white/8">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-800 dark:text-primary-200">
                Plateforme SaaS pour l'éducation
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-display-lg font-semibold text-ink dark:text-white">
              EcoleDigitale centralise la{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent animate-gradient-text dark:from-primary-300 dark:via-primary-200 dark:to-accent-300">
                gestion académique, pédagogique et financière
              </span>{' '}
              de votre établissement.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
              Du cycle BTS à la formation professionnelle, une plateforme modulaire avec des
              espaces dédiés pour chaque profil — direction, enseignants, étudiants, parents,
              formateurs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedDemoCTA placement="hero" size="lg">
                Demander une démonstration
              </TrackedDemoCTA>
              <TrackedModulesCTA placement="hero" size="lg" variant="secondary">
                Voir les modules
              </TrackedModulesCTA>
            </div>

            <p className="mt-5 text-xs text-ink-soft dark:text-neutral-400">
              Réponse sous 48 heures — pas de carte bancaire, pas d'engagement.
            </p>

            <RevealGroup className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {PROOF_ITEMS.map((item) => (
                <RevealItem key={item.label}>
                  <div className="rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-xs backdrop-blur dark:border-white/10 dark:bg-white/6">
                    <p className="font-display text-2xl font-semibold text-ink dark:text-white">
                      {item.prefix}
                      <AnimatedCounter value={item.value} suffix={item.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-ink-muted dark:text-neutral-300">{item.label}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <div className="animate-float">
            <div className="rounded-[2rem] border border-neutral-200/80 bg-white/85 p-3 shadow-elevated backdrop-blur dark:border-white/10 dark:bg-white/8">
              <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950">
                <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/8">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-400" />
                  <span className="ml-2 text-xs font-medium text-ink-soft dark:text-neutral-400">
                    Tableau de bord établissement
                  </span>
                </div>
                <div className="grid gap-4 p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: Users, label: 'Profils', value: 'Direction' },
                      { icon: GraduationCap, label: 'Cycles', value: 'BTS & Sup.' },
                      { icon: Gauge, label: 'Pilotage', value: 'Temps réel' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-white/6">
                        <Icon className="h-5 w-5 text-primary-700 dark:text-primary-200" aria-hidden="true" />
                        <p className="mt-3 text-xs text-ink-soft dark:text-neutral-400">{label}</p>
                        <p className="text-sm font-semibold text-ink dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-white/6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-ink dark:text-white">Modules actifs</p>
                        <p className="mt-1 text-xs text-ink-muted dark:text-neutral-300">
                          Socle, Parcours BTS, Campus Live
                        </p>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-accent-600 dark:text-accent-300" aria-hidden="true" />
                    </div>
                    <div className="mt-5 space-y-3">
                      {['Inscriptions', 'Notes & bulletins', 'Paiements'].map((label, index) => (
                        <div key={label} className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-accent-600 dark:text-accent-300" aria-hidden="true" />
                          <span className="w-28 text-xs font-medium text-ink-muted dark:text-neutral-300">{label}</span>
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10">
                            <span
                              className="block h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400 animate-grow-bar"
                              style={{
                                '--bar-width': `${88 - index * 12}%`,
                                '--bar-delay': `${0.5 + index * 0.18}s`,
                              } as React.CSSProperties}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TrustBand />

      <section className="container-wide py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Modules</p>
            <h2 className="mt-3 font-display text-display-sm font-semibold text-ink dark:text-white">
              5 modules pour s'adapter à votre activité
            </h2>
            <p className="mt-2 text-lg text-ink-muted dark:text-neutral-300">
              Commencez par le socle, ajoutez les modules selon vos besoins.
            </p>
          </div>
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 underline-offset-4 hover:text-accent-700 hover:underline dark:text-primary-200 dark:hover:text-accent-200"
          >
            Comparer tous les modules
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal className="mt-10">
          <ModulesGrid />
        </Reveal>
      </section>

      <BenefitsByRole />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
    </>
  );
}
