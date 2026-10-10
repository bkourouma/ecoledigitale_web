import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { ContactChannels } from '@/components/marketing/ContactChannels';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Merci pour votre demande',
  description: "Votre demande de démonstration a bien été transmise à l'équipe EcoleDigitale.",
  path: '/demander-demo/merci',
  noindex: true,
});

export default function MerciPage() {
  return (
    <section className="container-content py-24">
      <div className="mx-auto max-w-xl text-center">
        {/* Success icon */}
        <div className="bg-brand-600 shadow-elevated mx-auto flex h-14 w-14 items-center justify-center rounded-md text-white">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-display text-display-md text-primary-800 mt-7 font-bold">
          Merci pour votre demande
        </h1>
        <p className="text-ink-muted mt-4 text-lg leading-relaxed">
          Votre demande de démonstration a bien été transmise. Un membre de l'équipe commerciale
          vous recontacte <strong className="text-ink font-semibold">sous 48 heures ouvrées</strong>
          .
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="secondary">
            Retour à l'accueil
          </ButtonLink>
          <ButtonLink href="/modules">Explorer les modules</ButtonLink>
        </div>

        <div className="border-line bg-surface-subtle shadow-card mt-12 rounded-md border p-6 text-left">
          <h2 className="font-display text-primary-800 text-3xl leading-none font-bold">
            Besoin d'un échange immédiat ?
          </h2>
          <p className="text-ink-muted mt-2 text-sm">
            Vous pouvez aussi nous joindre directement :
          </p>
          <ContactChannels placement="inline" variant="stacked" className="mt-4" />
        </div>

        <p className="text-ink-soft mt-8 text-xs">
          Une question entre temps ?{' '}
          <Link href="/confidentialite" className="text-brand-700 font-medium hover:underline">
            Confidentialité de vos données
          </Link>
        </p>
      </div>
    </section>
  );
}
