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
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';
import { buildFaqPage } from '@/lib/seo/jsonld';
import { HOME_FAQ } from '@/lib/marketing/faq';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  // Titre absolu : il porte déjà la marque, le gabarit « | EcoleDigitale » ne s'ajoute pas.
  title: "Logiciel de gestion scolaire Côte d'Ivoire | EcoleDigitale",
  absoluteTitle: true,
  description:
    'Notes, bulletins, absences, frais de scolarité et portail parents pour écoles, collèges, lycées et établissements supérieurs. Demandez une démonstration.',
  path: '/',
  ogImage: DEFAULT_OG_IMAGE,
});

/** Fonctions livrées, présentées comme une liste du quotidien (aucune fonction non confirmée). */
const DAILY_FEATURES: { title: string; description: string; href?: string }[] = [
  {
    title: 'Notes et bulletins',
    href: '/fonctions/bulletins-et-notes',
    description: 'Notes, moyennes et bulletins calculés selon les règles ivoiriennes.',
  },
  {
    title: 'Conseil de classe et examens',
    href: '/fonctions/bulletins-et-notes',
    description: "Conseil de classe et suivi de l'éligibilité au CEPE, au BEPC et au BAC.",
  },
  {
    title: 'Emploi du temps',
    href: '/fonctions/emploi-du-temps-et-absences',
    description: 'Un emploi du temps partagé entre la direction, les enseignants et les élèves.',
  },
  {
    title: 'Appel et absences',
    href: '/fonctions/emploi-du-temps-et-absences',
    description: "L'appel se fait depuis le téléphone ; les parents consultent les absences.",
  },
  {
    title: 'Portail parents',
    href: '/fonctions/portail-parents',
    description: 'Résultats, absences et frais de scolarité dans un espace pour chaque famille.',
  },
  {
    title: 'Frais par Mobile Money',
    href: '/fonctions/frais-de-scolarite',
    description: 'Le paiement des frais de scolarité par Mobile Money, intégré à la plateforme.',
  },
  {
    title: 'SMS et WhatsApp',
    href: '/fonctions/portail-parents',
    description: "L'établissement écrit aux parents par SMS et par WhatsApp.",
  },
  {
    title: 'Import Excel',
    description: 'Vos listes existantes sont importées depuis Excel, sans tout ressaisir.',
  },
  {
    title: 'LMS et classes virtuelles',
    description: 'Cours en ligne, devoirs et classes virtuelles pour la formation à distance.',
  },
  {
    title: 'Certificats et attestations',
    description: 'Certificats et attestations délivrés depuis la plateforme.',
  },
  {
    title: 'Assistant IA',
    description: "Un assistant IA intégré pour accompagner les équipes de l'établissement.",
  },
];

const RESOURCE_LINKS: { href: string; label: string }[] = [
  { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
  { href: '/logiciel-gestion-ecole-abidjan', label: "Logiciel de gestion d'école à Abidjan" },
  { href: '/tarifs', label: 'Tarifs : des offres sur devis' },
  { href: '/faq', label: 'Questions fréquentes' },
  {
    href: '/ressources/guides/choisir-logiciel-gestion-ecole-privee',
    label: "Guide : choisir un logiciel d'école en Côte d'Ivoire",
  },
  {
    href: '/ressources?type=glossaire',
    label: 'Glossaire : CEPE, BEPC, BAC, MGA, conseil de classe',
  },
  { href: '/ressources', label: 'Toutes les ressources' },
  { href: '/a-propos', label: "À propos d'EcoleDigitale et d'Alliance Consultants" },
];

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
              Le logiciel de gestion scolaire{' '}
            </span>
            <span
              className="written block"
              style={{ ['--write-duration' as string]: '1.3s', ['--write-delay' as string]: '1s' }}
            >
              <span className="marker">des établissements</span>{' '}
            </span>
            <span
              className="written block"
              style={{ ['--write-duration' as string]: '1s', ['--write-delay' as string]: '2.3s' }}
            >
              de Côte d&apos;Ivoire.
            </span>
          </h1>

          <p className="text-ink-muted mt-8 max-w-xl text-lg leading-relaxed">
            De la maternelle au supérieur, et à distance : un socle commun et un pack par cycle,
            avec un espace pour la direction, les enseignants, les parents et les élèves. Conçu pour
            les écoles d&apos;Afrique francophone, avec la Côte d&apos;Ivoire pour référence.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-5">
            <TrackedDemoCTA placement="hero" size="lg">
              Demander une démonstration
            </TrackedDemoCTA>
            <TrackedModulesCTA placement="hero" size="lg" variant="ghost">
              Voir les packs
            </TrackedModulesCTA>
          </div>

          <p
            className="red-note note-in mt-7 inline-block text-2xl"
            style={{ ['--note-delay' as string]: '3s' }}
          >
            Réponse sous 48 h ouvrées, sans engagement.
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
              {['Inscriptions', 'Notes & bulletins', 'Frais de scolarité'].map((label) => (
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
                <dt className="font-bold">Packs actifs</dt>
                <dd className="text-ink-muted">Socle, Primary, Secondary</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Cycles</dt>
                <dd className="text-ink-muted">Maternelle au lycée</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Parents</dt>
                <dd className="text-ink-muted">Informés par SMS et WhatsApp</dd>
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
            heading="Un socle commun et quatre packs par cycle"
            lead="Commencez par le socle, ajoutez les packs de vos cycles : maternelle et primaire, collège et lycée, supérieur, formation à distance."
          />
        </Reveal>
        <div className="mt-8 flex justify-end">
          <Link
            href="/modules"
            className="font-display text-primary-700 pen-underline hover:text-primary-900 inline-flex items-center gap-1.5 text-3xl leading-none font-bold"
          >
            Comparer le socle et les packs
            <ArrowRight className="h-6 w-6" strokeWidth={3} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="daily-heading" className="container-wide py-16 md:py-20">
        <Reveal className="max-w-2xl">
          <h2
            id="daily-heading"
            className="font-display text-display-sm text-primary-800 font-bold"
          >
            Ce que fait EcoleDigitale <span className="marker">chaque jour</span>
          </h2>
          <p className="text-ink-muted mt-3 text-lg leading-relaxed">
            De la rentrée au dernier bulletin, les tâches de l&apos;établissement tiennent dans un
            seul outil.{' '}
            <Link
              href="/fonctions"
              className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
            >
              Voir toutes les fonctions
            </Link>
          </p>
        </Reveal>
        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {DAILY_FEATURES.map(({ title, description, href }) => (
            <li key={title} className="border-primary-200 border-b-2 border-dashed py-5">
              <h3 className="font-display text-primary-700 text-3xl leading-none font-bold">
                {href ? (
                  <Link
                    href={href}
                    className="hover:text-primary-900 underline-offset-4 hover:underline"
                  >
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h3>
              <p className="text-ink-muted mt-2 text-base leading-relaxed">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <BenefitsByRole />
      <HowItWorks />
      <FAQ />

      <section aria-labelledby="resources-heading" className="container-wide py-12 md:py-16">
        <h2
          id="resources-heading"
          className="font-display text-display-sm text-primary-800 font-bold"
        >
          Pour préparer votre <span className="marker">choix</span>
        </h2>
        <ul className="mt-6 space-y-3 text-lg">
          {RESOURCE_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-primary-700 hover:bg-marker-soft inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4"
              >
                {label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FinalCTA />
    </>
  );
}
