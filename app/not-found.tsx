import type { Metadata } from 'next';
import Link from 'next/link';
import { StickyHeaderCTA } from '@/components/marketing/StickyHeaderCTA';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  // Next.js ajoute déjà `noindex` aux pages 404.
  title: 'Page introuvable',
};

const LINKS = [
  { href: '/', label: "Retour à l'accueil" },
  { href: '/modules', label: 'Voir le socle et les packs' },
  { href: '/ressources', label: 'Lire les ressources' },
  { href: '/demander-demo', label: 'Demander une démonstration' },
];

/**
 * Page 404 en français, avec le menu et le pied de page du site : le 404 par défaut de Next.js
 * est en anglais et sans aucun lien.
 */
export default function NotFound() {
  return (
    <>
      <StickyHeaderCTA />
      <main id="main-content" tabIndex={-1} className="container-content py-20 md:py-28">
        <h1 className="font-display text-display-md text-primary-800 font-bold">
          Cette page est introuvable
        </h1>
        <p className="text-ink-muted mt-5 max-w-prose text-lg leading-relaxed">
          L&apos;adresse saisie n&apos;existe pas ou a changé. Reprenez depuis l&apos;un de ces
          liens.
        </p>
        <ul className="mt-8 space-y-3 text-lg">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
