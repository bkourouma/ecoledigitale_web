import Script from 'next/script';

// Mesure d'audience : Umami, hébergé par Alliance Consultants (sans cookie, sans adresse IP conservée).
// L'identifiant du site est public (il figure dans le HTML servi).
const SCRIPT_URL = 'https://analytics.allianceconsultants.net/script.js';
const WEBSITE_ID = '6b9335ed-d095-41ae-8b8f-ad1fc8deb8f3';

/**
 * Injecte le script Umami (pages vues + événements `track()`), uniquement en production.
 * Cookieless → aucun bandeau de consentement requis (Constitution V).
 *
 * `data-domains` est déduit de NEXT_PUBLIC_SITE_URL (fixé au build) : seul le vrai domaine est compté, ni le
 * développement local ni un aperçu. Si le site change d'adresse, il suffit de changer NEXT_PUBLIC_SITE_URL
 * (et le domaine du site dans Umami) ; sinon plus rien n'est compté.
 */
export function UmamiScript() {
  if (process.env.NODE_ENV !== 'production') return null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;

  let domain: string;
  try {
    domain = new URL(siteUrl).hostname;
  } catch {
    return null;
  }

  return (
    <Script
      src={SCRIPT_URL}
      data-website-id={WEBSITE_ID}
      data-domains={domain}
      strategy="afterInteractive"
    />
  );
}
