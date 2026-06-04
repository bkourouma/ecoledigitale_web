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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-elevated">
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

        <h1 className="mt-7 text-display-md font-semibold tracking-tight text-ink">
          Merci pour votre demande
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          Votre demande de démonstration a bien été transmise. Un membre de l'équipe commerciale
          vous recontacte <strong className="font-semibold text-ink">sous 48 heures ouvrées</strong>.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="secondary">
            Retour à l'accueil
          </ButtonLink>
          <ButtonLink href="/modules">Explorer les modules</ButtonLink>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-100 bg-surface-subtle p-6 text-left shadow-card">
          <h2 className="text-sm font-semibold text-ink">Besoin d'un échange immédiat ?</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Vous pouvez aussi nous joindre directement :
          </p>
          <ContactChannels placement="inline" variant="stacked" className="mt-4" />
        </div>

        <p className="mt-8 text-xs text-ink-soft">
          Une question entre temps ?{' '}
          <Link href="/confidentialite" className="font-medium text-brand-700 hover:underline">
            Confidentialité de vos données
          </Link>
        </p>
      </div>
    </section>
  );
}
