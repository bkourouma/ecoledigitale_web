import type { Page } from '@playwright/test';

/**
 * Simule la réponse de `POST /api/leads` pour les tests du parcours formulaire.
 *
 * L'envoi réel passe par un fournisseur d'email (Resend) qui n'est pas
 * configuré en CI ni en local : sans ce mock, la soumission échoue en 500 et
 * l'interface ne redirige jamais vers /merci. La requête reste émise (et donc
 * comptabilisable) ; seule la réponse est fournie par le test. L'API elle-même
 * est couverte par `api-leads.spec.ts`.
 */
export async function mockLeadsApi(page: Page): Promise<void> {
  await page.route('**/api/leads', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, id: 'lead_e2e_mock' }),
    }),
  );
}
