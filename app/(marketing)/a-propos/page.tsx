import type { Metadata } from 'next';
import {
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  HeartHandshake,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'À propos — EcoleDigitale',
  description:
    'EcoleDigitale est une plateforme SaaS modulaire conçue pour digitaliser la gestion des écoles, instituts BTS, post-BTS et centres de formation professionnelle francophones.',
  path: '/a-propos',
});

const CONVICTIONS = [
  "Les outils dispersés (tableurs, emails, papier) finissent par coûter plus cher que la dette technique qu'ils cachent.",
  "Une plateforme adoptée à 30 % n'est pas une plateforme — c'est un nouveau silo.",
  'Un établissement de formation ne devrait pas avoir à choisir entre rigueur académique et fluidité administrative.',
];

const AUDIENCE_TYPES = [
  {
    title: 'Écoles privées',
    description:
      'Pour digitaliser la scolarité du primaire au secondaire — inscriptions, notes, présences, paiements, communications parents.',
  },
  {
    title: 'Instituts BTS et post-BTS',
    description:
      'Pour piloter les cycles courts et longs avec bulletins automatisés, suivi des coefficients et reporting consolidé.',
  },
  {
    title: 'Centres de formation professionnelle',
    description:
      'Pour vendre, organiser et suivre vos formations — catalogue public, sessions, inscriptions B2B, paiements en ligne.',
  },
  {
    title: 'Organismes de cours en ligne',
    description:
      'Pour planifier des cours synchrones, hybrides ou distants avec visioconférence intégrée et trace pédagogique complète.',
  },
];

const VALUES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Compass,
    title: 'Pragmatisme métier',
    description:
      "Nous construisons les fonctionnalités demandées par les directions d'établissement et les équipes pédagogiques. Pas de feature gadget — chaque écran sert un usage concret.",
  },
  {
    icon: Sparkles,
    title: 'Modularité',
    description:
      "Vous activez le socle d'abord, puis les modules selon vos besoins. Pas de plateforme monolithique qu'on adopte à 30 %.",
  },
  {
    icon: ShieldCheck,
    title: 'Confiance et durabilité',
    description:
      "Données hébergées en Union Européenne, contrôle d'accès par rôle, sauvegardes régulières. Vos informations restent les vôtres.",
  },
  {
    icon: Building2,
    title: 'Ancrage francophone',
    description:
      "Nous connaissons les spécificités des établissements d'Afrique francophone et de France — cycles BTS, formations professionnelles, paiements échelonnés, parcours hybrides.",
  },
];

const COMMITMENTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: HeartHandshake,
    title: 'Accompagnement à la prise en main',
    description:
      'Configuration de votre instance, import de vos données existantes et formation de vos équipes clés. Vous démarrez en moins de 3 semaines.',
  },
  {
    icon: LifeBuoy,
    title: 'Support de proximité',
    description:
      'Une équipe joignable en français par email, WhatsApp ou téléphone selon votre préférence. Pas de chatbot intermédiaire avant de parler à un humain.',
  },
  {
    icon: TrendingUp,
    title: 'Évolution continue',
    description:
      'Vos besoins changent ? Nous activons de nouveaux modules sans interruption de service. La plateforme évolue au rythme de votre établissement.',
  },
];

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'À propos', url: '/a-propos' },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden premium-surface dark:dark-premium-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(47,129,250,0.10) 0%, transparent 60%), #fff',
          }}
        />
        <div className="container-content py-20 md:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 shadow-xs dark:border-primary-300/20 dark:bg-white/10 dark:text-primary-100">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            À propos
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-display-md font-semibold text-ink dark:text-white">
            Une plateforme pensée pour celles et ceux qui font tourner l'éducation au quotidien.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
            EcoleDigitale centralise la gestion académique, pédagogique, administrative et
            financière dans une seule plateforme SaaS modulaire. Nous équipons les écoles,
            instituts BTS, établissements post-bac et centres de formation francophones qui
            veulent gagner du temps et piloter sereinement leur activité.
          </p>
        </div>
      </section>

      {/* Conviction */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 dark:border-white/10 dark:bg-neutral-950">
        <div className="container-content grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">
              Notre conviction
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-white">
              Trois constats simples qui guident notre travail
            </h2>
            <p className="mt-4 text-ink-muted dark:text-neutral-300">
              EcoleDigitale est né du constat que la majorité des établissements de formation
              fonctionne encore avec une combinaison de tableurs, de groupes de messagerie et de
              registres papier. Cette dispersion coûte cher en temps, en information perdue et en
              opportunités commerciales.
            </p>
          </div>

          <ul className="space-y-4">
            {CONVICTIONS.map((conviction, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card dark:border-white/10 dark:bg-white/6"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-base text-ink dark:text-neutral-100">{conviction}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="container-content py-16">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">
              Notre mission
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-white">
              Du temps rendu à l'enseignement
            </h2>
          </div>
          <div className="space-y-4 text-ink-muted md:col-span-2 dark:text-neutral-300">
            <p>
              Permettre aux établissements de formation de consacrer plus de temps à
              l'enseignement et au suivi des apprenants — et moins à la saisie, à la recherche
              d'information et au rapprochement administratif.
            </p>
            <p>
              Nous remplaçons les tableurs, les outils dispersés et les ressaisies par une
              plateforme unique où chaque profil — direction, enseignant, étudiant, parent,
              formateur — accède à ce dont il a besoin, sans surcouche inutile.
            </p>
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 dark:border-white/10 dark:bg-neutral-950">
        <div className="container-content">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">Pour qui</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-white">
              À qui s'adresse EcoleDigitale
            </h2>
            <p className="mt-2 text-ink-muted dark:text-neutral-300">
              Notre plateforme s'adapte à des contextes variés — un seul socle, des modules
              activables selon votre activité.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {AUDIENCE_TYPES.map((audience) => (
              <li
                key={audience.title}
                className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-primary-400/15">
                  <GraduationCap className="h-5 w-5 text-brand-700 dark:text-primary-200" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink dark:text-white">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-neutral-300">
                    {audience.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approche */}
      <section className="container-content py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">
              Notre approche
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-white">
              Un socle qui grandit avec vous
            </h2>
            <p className="mt-4 text-ink-muted dark:text-neutral-300">
              EcoleDigitale est pensé comme un socle qui s'enrichit progressivement. Vous
              commencez par les fonctions essentielles — utilisateurs, classes, notes, présences,
              paiements — puis vous ajoutez les modules adaptés à votre activité : Parcours BTS,
              Parcours Supérieur, ProFormation, Campus Live.
            </p>
            <p className="mt-4 text-ink-muted dark:text-neutral-300">
              Pas besoin de remplacer toute votre organisation d'un coup. Pas besoin non plus de
              payer pour des fonctionnalités que vous n'utiliserez pas. Chaque établissement
              construit sa configuration au rythme de ses priorités.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-ink dark:text-neutral-100">
              {[
                'Activation modulaire selon votre activité',
                'Aucun engagement à long terme imposé',
                'Évolution sans interruption de service',
                'Migration possible depuis Excel ou un autre outil',
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-accent-300"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="self-start rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-card dark:border-white/10 dark:bg-white/6">
            <h3 className="text-sm font-semibold text-ink dark:text-white">En bref</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                { term: 'Modèle', def: 'SaaS modulaire en français' },
                { term: 'Hébergement', def: 'Union Européenne' },
                { term: 'Profils couverts', def: 'Direction, enseignants, étudiants, parents, formateurs' },
                { term: 'Modules disponibles', def: '5 (socle + 4 optionnels)' },
                { term: 'Mise en service', def: '1 à 3 semaines' },
              ].map(({ term, def }) => (
                <div key={term} className="border-b border-neutral-200 pb-3 last:border-0 last:pb-0 dark:border-white/10">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-neutral-400">{term}</dt>
                  <dd className="mt-1 text-ink-muted dark:text-neutral-300">{def}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Principes */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-16 dark:border-white/10 dark:bg-neutral-950">
        <div className="container-content">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">
              Nos principes
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-white">
              Ce qui guide nos choix produit
            </h2>
            <p className="mt-2 text-ink-muted dark:text-neutral-300">
              Quatre principes qui orientent nos décisions et notre relation avec les
              établissements clients.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-primary-400/15">
                  <Icon className="h-5 w-5 text-brand-700 dark:text-primary-200" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-neutral-300">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Engagements */}
      <section className="container-content py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-primary-200">
            Notre engagement
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink dark:text-white">
            Ce que vous pouvez attendre de notre équipe
          </h2>
          <p className="mt-2 text-ink-muted dark:text-neutral-300">
            Au-delà du produit, nous nous engageons sur trois axes concrets.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {COMMITMENTS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-primary-400/15">
                <Icon className="h-5 w-5 text-brand-700 dark:text-primary-200" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-neutral-300">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <FinalCTA
        title="Discutons de votre établissement"
        description="En 30 minutes, nous comprenons votre contexte et vous montrons EcoleDigitale en conditions réelles."
        ctaLabel="Demander une démonstration"
      />
    </>
  );
}
