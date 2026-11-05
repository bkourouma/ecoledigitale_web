import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Board } from '@/components/ui/Board';
import { Reveal } from '@/components/ui/Reveal';
import { PUBLISHER } from '@/lib/site/contact';

export const metadata: Metadata = buildMetadata({
  title: 'À propos du logiciel de gestion scolaire',
  description:
    'Logiciel de gestion scolaire édité par Alliance Consultants à Abidjan, pour les établissements de la maternelle au supérieur en Afrique francophone.',
  path: '/a-propos',
  ogImage: DEFAULT_OG_IMAGE,
});

const CONVICTIONS = [
  "Les outils dispersés (tableurs, emails, papier) finissent par coûter plus cher que la dette technique qu'ils cachent.",
  "Une plateforme adoptée à 30 % n'est pas une plateforme — c'est un nouveau silo.",
  'Un établissement de formation ne devrait pas avoir à choisir entre rigueur académique et fluidité administrative.',
];

const AUDIENCE_TYPES = [
  {
    title: 'Maternelle et primaire',
    description:
      'Pack Primary : classes, notes et bulletins selon les règles ivoiriennes, absences, portail parents et suivi de l’éligibilité au CEPE.',
    href: '/modules/ecoledigitale-primary',
  },
  {
    title: 'Collèges et lycées',
    description:
      'Pack Secondary : moyennes, conseils de classe, vie scolaire et suivi de l’éligibilité au BEPC et au BAC.',
    href: '/modules/ecoledigitale-secondary',
  },
  {
    title: 'Supérieur, BTS et centres de formation',
    description:
      'Pack Higher : filières, programmes, évaluations, relevés de notes et frais de scolarité par programme.',
    href: '/modules/ecoledigitale-higher',
  },
  {
    title: 'Formation à distance',
    description:
      'Pack Virtual : cours en ligne, devoirs, classes virtuelles et certificats, reliés à la gestion de l’établissement.',
    href: '/modules/ecoledigitale-virtual',
  },
];

const VALUES: { title: string; description: string }[] = [
  {
    title: 'Pragmatisme métier',
    description:
      "Nous construisons les fonctionnalités demandées par les directions d'établissement et les équipes pédagogiques. Pas de feature gadget — chaque écran sert un usage concret.",
  },
  {
    title: 'Modularité',
    description:
      "Vous activez le socle d'abord, puis les packs de vos cycles. Pas de plateforme monolithique qu'on adopte à 30 %.",
  },
  {
    title: 'Confiance et durabilité',
    description:
      "Contrôle d'accès par rôle, sauvegardes régulières et chiffrement en transit. Vos informations restent les vôtres.",
  },
  {
    title: 'Ancrage ivoirien et africain',
    description:
      "EcoleDigitale est conçu pour les écoles d'Afrique francophone, avec la Côte d'Ivoire pour référence : cycles et examens ivoiriens, paiement des frais par Mobile Money, parents joignables par SMS et WhatsApp.",
  },
];

const COMMITMENTS: { title: string; description: string }[] = [
  {
    title: 'Accompagnement à la prise en main',
    description:
      'Configuration de votre instance, import de vos données existantes et formation de vos équipes clés. Comptez 1 à 3 semaines pour démarrer.',
  },
  {
    title: 'Support de proximité',
    description:
      'Une équipe joignable en français par email, WhatsApp ou téléphone selon votre préférence. Pas de chatbot intermédiaire avant de parler à un humain.',
  },
  {
    title: 'Évolution continue',
    description:
      'Vos besoins changent ? Nous activons de nouveaux modules sans interruption de service. La plateforme évolue au rythme de votre établissement.',
  },
];

const BRIEF = [
  { term: 'Produit', def: 'Logiciel de gestion scolaire en ligne, en français' },
  { term: 'Édité par', def: `${PUBLISHER.name}, ${PUBLISHER.city}, ${PUBLISHER.country}` },
  { term: 'Marché de référence', def: "Côte d'Ivoire, puis l'Afrique francophone" },
  { term: 'Cycles couverts', def: 'Maternelle, primaire, collège, lycée, supérieur, à distance' },
  { term: 'Offre', def: 'Un socle et 4 packs, sur devis' },
  { term: 'Mise en service', def: '1 à 3 semaines' },
];

const RULED_ITEM = 'border-b-2 border-dashed border-primary-200 py-5';

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: 'Accueil', url: '/' },
          { name: 'À propos', url: '/a-propos' },
        ])}
      />

      <section className="container-wide grid gap-14 pt-12 pb-12 md:pt-16 lg:grid-cols-[1.4fr_0.6fr] lg:items-start lg:gap-12">
        <div>
          <h1 className="font-display text-display-md text-primary-800 font-bold">
            Une plateforme pour celles et ceux qui font{' '}
            <span className="marker">tourner l&apos;éducation</span>.
          </h1>
          <p className="text-ink-muted mt-6 max-w-2xl text-lg leading-relaxed">
            EcoleDigitale est un logiciel de gestion scolaire : notes et bulletins, absences, frais
            de scolarité et communication avec les parents dans une seule plateforme. Il est édité
            par {PUBLISHER.name} à {PUBLISHER.city}, {PUBLISHER.country}, et équipe les écoles,
            collèges, lycées, établissements supérieurs et centres de formation d&apos;Afrique
            francophone.
          </p>
          <p className="text-ink-muted mt-4 max-w-2xl text-lg leading-relaxed">
            Ne pas confondre avec une école du numérique : EcoleDigitale est un outil de gestion
            pour les établissements, pas un établissement de formation.
          </p>
        </div>

        <Reveal delay={0.1} className="mx-auto w-full max-w-sm lg:max-w-none">
          <aside
            aria-labelledby="brief-heading"
            className="sheet tape rotate-[1.5deg] px-6 pt-8 pb-6"
          >
            <h2
              id="brief-heading"
              className="font-display text-primary-800 text-3xl leading-none font-bold"
            >
              En bref
            </h2>
            <dl className="mt-4 space-y-3 text-base leading-snug">
              {BRIEF.map(({ term, def }) => (
                <div key={term}>
                  <dt className="text-primary-800 font-bold">{term}</dt>
                  <dd className="text-ink-muted">{def}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </Reveal>
      </section>

      <section className="container-wide border-primary-700/70 grid gap-10 border-t-2 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="font-display text-display-sm text-primary-800 font-bold">
            Trois constats simples qui guident notre travail
          </h2>
          <p className="text-ink-muted mt-4 max-w-prose text-lg">
            EcoleDigitale est né du constat que beaucoup d&apos;établissements fonctionnent encore
            avec une combinaison de tableurs, de groupes de messagerie et de registres papier. Cette
            dispersion coûte cher en temps et en information perdue.
          </p>
        </div>
        <ul>
          {CONVICTIONS.map((conviction) => (
            <li key={conviction} className={RULED_ITEM}>
              <p className="font-display text-primary-700 text-3xl leading-tight font-bold">
                {conviction}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-wide border-primary-700/70 grid gap-10 border-t-2 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <h2 className="font-display text-display-sm text-primary-800 font-bold">
          Du temps rendu à <span className="marker">l&apos;enseignement</span>
        </h2>
        <div className="text-ink-muted space-y-4 text-lg leading-relaxed">
          <p>
            Permettre aux établissements de consacrer plus de temps à l&apos;enseignement et au
            suivi des élèves, et moins à la saisie, à la recherche d&apos;information et au
            rapprochement administratif.
          </p>
          <p>
            Nous remplaçons les tableurs, les outils dispersés et les ressaisies par une plateforme
            unique où chaque profil (direction, enseignant, élève, parent, formateur) accède à ce
            dont il a besoin, sans surcouche inutile.
          </p>
        </div>
      </section>

      <section className="container-wide border-primary-700/70 border-t-2 py-14">
        <h2 className="font-display text-display-sm text-primary-800 max-w-2xl font-bold">
          À qui s&apos;adresse EcoleDigitale
        </h2>
        <p className="text-ink-muted mt-3 max-w-2xl text-lg">
          Un seul socle, quatre packs : chaque établissement active ceux de ses cycles.
        </p>
        <ul className="mt-8 grid gap-x-14 md:grid-cols-2">
          {AUDIENCE_TYPES.map((audience) => (
            <li key={audience.title} className={RULED_ITEM}>
              <h3 className="font-display text-primary-800 text-3xl leading-none font-bold">
                <Link
                  href={audience.href}
                  className="hover:text-primary-600 underline-offset-4 hover:underline"
                >
                  {audience.title}
                </Link>
              </h3>
              <p className="text-ink-muted mt-2 text-base leading-relaxed">
                {audience.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-wide border-primary-700/70 grid gap-10 border-t-2 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>
          <h2 className="font-display text-display-sm text-primary-800 font-bold">
            Un socle qui <span className="marker">grandit avec vous</span>
          </h2>
          <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed">
            EcoleDigitale est pensé comme un socle qui s&apos;enrichit progressivement. Vous
            commencez par les fonctions essentielles (élèves, classes, notes, absences, frais de
            scolarité) puis vous ajoutez les packs de vos cycles : Primary, Secondary, Higher,
            Virtual.
          </p>
          <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed">
            Pas besoin de remplacer toute votre organisation d&apos;un coup. Pas besoin non plus de
            payer pour des fonctionnalités que vous n&apos;utiliserez pas. Chaque établissement
            construit sa configuration au rythme de ses priorités.
          </p>
        </div>
        <ul className="text-ink space-y-3 self-center text-lg">
          {[
            'Activation des packs selon vos cycles',
            'Aucun engagement à long terme imposé',
            'Évolution sans interruption de service',
            'Migration possible depuis Excel ou un autre outil',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <Check
                className="text-accent-600 mt-1.5 h-5 w-5 shrink-0"
                strokeWidth={3}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-wide py-10 md:py-14">
        <Board innerClassName="px-6 py-12 md:px-14 md:py-16">
          <h2 className="chalk font-display text-display-sm max-w-2xl font-bold">
            Ce qui guide nos choix produit
          </h2>
          <p className="text-ink-muted mt-3 max-w-2xl text-lg">
            Quatre principes qui orientent nos décisions et notre relation avec les établissements
            clients.
          </p>
          <ul className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {VALUES.map(({ title, description }) => (
              <li key={title}>
                <h3 className="chalk font-display text-4xl leading-none font-bold">{title}</h3>
                <p className="text-ink-muted mt-2 text-base leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </Board>
      </section>

      <section className="container-wide py-14">
        <h2 className="font-display text-display-sm text-primary-800 max-w-2xl font-bold">
          Ce que vous pouvez attendre de <span className="marker">notre équipe</span>
        </h2>
        <p className="text-ink-muted mt-3 max-w-2xl text-lg">
          Au-delà du produit, nous nous engageons sur trois axes concrets.
        </p>
        <ul className="mt-8 grid gap-x-12 md:grid-cols-3">
          {COMMITMENTS.map(({ title, description }) => (
            <li key={title} className="border-primary-700/70 border-t-2 py-6">
              <h3 className="font-display text-primary-800 text-3xl leading-none font-bold">
                {title}
              </h3>
              <p className="text-ink-muted mt-3 text-base leading-relaxed">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <FinalCTA
        title="Discutons de votre établissement"
        description="En 30 minutes, nous comprenons votre contexte et vous montrons EcoleDigitale en conditions réelles. Les offres sont établies sur devis."
        ctaLabel="Demander une démonstration"
      />
    </>
  );
}
