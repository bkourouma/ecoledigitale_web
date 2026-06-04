import Script from 'next/script';

/**
 * Injecte le script Plausible si NEXT_PUBLIC_PLAUSIBLE_DOMAIN est défini.
 * Cookieless → aucun bandeau de consentement requis (Constitution V).
 * En l'absence du domaine, ce composant rend `null` (utile en dev local).
 */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const scriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ?? 'https://plausible.io/js/script.js';

  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src={scriptUrl}
      strategy="afterInteractive"
    />
  );
}
