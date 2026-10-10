import type { Metadata, Viewport } from 'next';
import { Andika, Caveat, La_Belle_Aurore } from 'next/font/google';
import { UmamiScript } from '@/components/analytics/UmamiScript';
import { InkTrail } from '@/components/ui/InkTrail';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganization, buildWebSite } from '@/lib/seo/jsonld';
import './globals.css';

const andika = Andika({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-andika',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-caveat',
});

const aurore = La_Belle_Aurore({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-aurore',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fcfbf6',
};

// Les favicon, apple-touch-icon et manifest sont détectés automatiquement par
// la convention Next.js App Router via app/icon.tsx, app/apple-icon.tsx et
// app/manifest.ts. Ne pas dupliquer ici sous metadata.icons.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000'),
  title: {
    default: 'EcoleDigitale — Plateforme de gestion d’établissements de formation',
    template: '%s | EcoleDigitale',
  },
  description:
    'Plateforme SaaS modulaire pour digitaliser la gestion académique, pédagogique et financière de votre établissement.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'EcoleDigitale',
  },
  // Propriété Google Search Console (valeur publique, servie dans le HTML).
  verification: { google: 'WCtsnzYFVt9ud_pN59hcfuJ4L-lZ1eOoUAKbVyPd6u8' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${andika.variable} ${caveat.variable} ${aurore.variable}`}>
      <body>
        <JsonLd data={[buildOrganization(), buildWebSite()]} />
        {children}
        <InkTrail />
        <UmamiScript />
      </body>
    </html>
  );
}
