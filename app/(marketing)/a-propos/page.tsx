import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbList } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Board } from '@/components/ui/Board';
import { Reveal } from '@/components/ui/Reveal';

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

const VALUES: { title: string; description: string }[] = [
  {
    title: 'Pragmatisme métier',
    description:
      "Nous construisons les fonctionnalités demandées par les directions d'établissement et les équipes pédagogiques. Pas de feature gadget — chaque écran sert un usage concret.",
  },
  {
    title: 'Modularité',
    description:
      "Vous activez le socle d'abord, puis les modules selon vos besoins. Pas de plateforme monolithique qu'on adopte à 30 %.",
  },
  {
    title: 'Confiance et durabilité',
    description:
      "Données hébergées en Union Européenne, contrôle d'accès par rôle, sauvegardes régulières. Vos informations restent les vôtres.",
  },
  {
    title: 'Ancrage francophone',
    description:
      "Nous connaissons les spécificités des établissements d'Afrique francophone et de France — cycles BTS, formations professionnelles, paiements échelonnés, parcours hybrides.",
  },
];

const COMMITMENTS: { title: string; description: string }[] = [
  {
    title: 'Accompagnement à la prise en main',
    description:
      'Configuration de votre instance, import de vos données existantes et formation de vos équipes clés. Vous démarrez en moins de 3 semaines.',
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
  { term: 'Modèle', def: 'SaaS modulaire en français' },
  { term: 'Hébergement', def: 'Union Européenne' },
  { term: 'Profils couverts', def: 'Direction, enseignants, étudiants, parents, formateurs' },
  { term: 'Modules disponibles', def: '5 (socle + 4 optionnels)' },
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
            Une plateforme pensée pour celles et ceux qui font{' '}
            <span className="marker">tourner l&apos;éducation</span> au quotidien.
          </h1>
          <p className="text-ink-muted mt-6 max-w-2xl text-lg leading-relaxed">
            EcoleDigitale centralise la gestion académique, pédagogique, administrative et
            financière dans une seule plateforme SaaS modulaire. Nous équipons les écoles, instituts
            BTS, établissements post-bac et centres de formation francophones qui veulent gagner du
            temps et piloter sereinement leur activité.
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
            EcoleDigitale est né du constat que la majorité des établissements de formation
            fonctionne encore avec une combinaison de tableurs, de groupes de messagerie et de
            registres papier. Cette dispersion coûte cher en temps, en information perdue et en
            opportunités commerciales.
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
            Permettre aux établissements de formation de consacrer plus de temps à
            l&apos;enseignement et au suivi des apprenants, et moins à la saisie, à la recherche
            d&apos;information et au rapprochement administratif.
          </p>
          <p>
            Nous remplaçons les tableurs, les outils dispersés et les ressaisies par une plateforme
            unique où chaque profil (direction, enseignant, étudiant, parent, formateur) accède à ce
            dont il a besoin, sans surcouche inutile.
          </p>
        </div>
      </section>

      <section className="container-wide border-primary-700/70 border-t-2 py-14">
        <h2 className="font-display text-display-sm text-primary-800 max-w-2xl font-bold">
          À qui s&apos;adresse EcoleDigitale
        </h2>
        <p className="text-ink-muted mt-3 max-w-2xl text-lg">
          Notre plateforme s&apos;adapte à des contextes variés : un seul socle, des modules
          activables selon votre activité.
        </p>
        <ul className="mt-8 grid gap-x-14 md:grid-cols-2">
          {AUDIENCE_TYPES.map((audience) => (
            <li key={audience.title} className={RULED_ITEM}>
              <h3 className="font-display text-primary-800 text-3xl leading-none font-bold">
                {audience.title}
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
            commencez par les fonctions essentielles (utilisateurs, classes, notes, présences,
            paiements) puis vous ajoutez les modules adaptés à votre activité : Parcours BTS,
            Parcours Supérieur, ProFormation, Campus Live.
          </p>
          <p className="text-ink-muted mt-4 max-w-prose text-lg leading-relaxed">
            Pas besoin de remplacer toute votre organisation d&apos;un coup. Pas besoin non plus de
            payer pour des fonctionnalités que vous n&apos;utiliserez pas. Chaque établissement
            construit sa configuration au rythme de ses priorités.
          </p>
        </div>
        <ul className="text-ink space-y-3 self-center text-lg">
          {[
            'Activation modulaire selon votre activité',
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
        description="En 30 minutes, nous comprenons votre contexte et vous montrons EcoleDigitale en conditions réelles."
        ctaLabel="Demander une démonstration"
      />
    </>
  );
}
