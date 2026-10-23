import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { prerender } from 'react-dom/static';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import ConfidentialitePage from '@/app/(marketing)/confidentialite/page';
import { Footer } from '@/components/marketing/Footer';
import { GA_MEASUREMENT_ID } from '@/lib/ga';

/** La page est un composant serveur asynchrone (MDXRemote) : rendu complet via prerender. */
async function renderPage(): Promise<string> {
  const { prelude } = await prerender(await ConfidentialitePage());
  const reader = prelude.getReader();
  const decoder = new TextDecoder();
  let html = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  return html;
}

describe('politique de confidentialité : Google Analytics et cookies', () => {
  it('annonce GA4 avec consentement, les cookies _ga et le lien « Gérer mes cookies »', async () => {
    const html = await renderPage();
    expect(html).toContain('Umami');
    expect(html).toContain('Google Analytics 4');
    expect(html).toContain('Google Ireland Limited');
    const h2 = html.match(/<h2[^>]*id="cookies-traceurs"[^>]*>/)?.[0] ?? '';
    expect(h2).toContain('font-display');
    expect(h2).toContain('scroll-mt-24');
    expect(h2).toContain('mt-12');
    expect(html).not.toMatch(/<h2(?![^>]*font-display)[^>]*>/);
    expect(html).toContain('13 mois');
    expect(html).toContain('Gérer mes cookies');
    expect(html).toContain('ed_consent');
    expect(html).toContain('2013-450');
    expect(html).toContain('23 octobre 2026');
  });

  it("ne dit plus qu'aucune donnée n'est envoyée à un service tiers, et ne cite pas le RGPD", async () => {
    const html = await renderPage();
    expect(html).not.toContain('sans envoyer de données');
    expect(html).not.toMatch(/RGPD/);
  });
});

describe('pied de page', () => {
  it('propose « Gérer mes cookies » à côté de la politique de confidentialité', () => {
    const html = renderToStaticMarkup(<Footer />);
    expect(html).toContain('data-manage-cookies');
    expect(html).toContain('Gérer mes cookies');
    expect(html).toContain('Politique de confidentialité');
  });
});

describe('identifiant de mesure', () => {
  it('vaut G-3SQDG4YB1W (chiffre un, ni zéro ni lettre O)', () => {
    expect(GA_MEASUREMENT_ID).toBe('G-3SQDG4YB1W');
    expect(GA_MEASUREMENT_ID).toMatch(/^G-3SQDG4YB1W$/);
  });
});
