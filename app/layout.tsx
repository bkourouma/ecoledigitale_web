import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { UmamiScript } from '@/components/analytics/UmamiScript';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganization, buildWebSite } from '@/lib/seo/jsonld';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
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
    <html lang="fr" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='theme-default-dark-v1';var migrated=localStorage.getItem(k)==='1';var t=localStorage.getItem('theme');var d=migrated&&t?t==='dark':true;document.documentElement.classList.toggle('dark',d);localStorage.setItem(k,'1')}catch(e){document.documentElement.classList.add('dark')}",
          }}
        />
        <JsonLd data={[buildOrganization(), buildWebSite()]} />
        {children}
        <UmamiScript />
      </body>
    </html>
  );
}
