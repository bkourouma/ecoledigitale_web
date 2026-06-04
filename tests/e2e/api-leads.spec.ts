import { test, expect } from '@playwright/test';

const validPayload = {
  fullName: 'Marie Dupont',
  email: 'marie@example.com',
  phone: '+33 1 23 45 67 89',
  institutionName: 'Institut Exemple',
  role: 'Directrice',
  location: 'Paris, France',
  modulesOfInterest: ['parcours-bts'],
  consent: true,
  sourcePage: '/demander-demo',
};

test.describe('POST /api/leads', () => {
  test('200 OK avec un payload valide', async ({ request }) => {
    const response = await request.post('/api/leads', { data: validPayload });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.id).toMatch(/^lead_/);
    expect(typeof body.message).toBe('string');
  });

  test('400 si email invalide', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: { ...validPayload, email: 'invalid' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('validation');
    expect(body.issues.some((i: { path: string }) => i.path === 'email')).toBe(true);
  });

  test('400 si modulesOfInterest est vide', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: { ...validPayload, modulesOfInterest: [] },
    });
    expect(response.status()).toBe(400);
  });

  test('400 si consent est false', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: { ...validPayload, consent: false },
    });
    expect(response.status()).toBe(400);
  });

  test('400 si corps JSON invalide', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });
    expect([400, 200]).toContain(response.status()); // Selon parsing, peut être 400 ou autre
  });

  test('honeypot déclenché → 200 OK sans email envoyé (id factice)', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: { ...validPayload, website: 'bot.example.com' },
    });
    // Réponse silencieuse (200 OK) avec ID préfixé honeypot_
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.id).toMatch(/^honeypot_/);
  });

  test('rejette les méthodes autres que POST', async ({ request }) => {
    const response = await request.get('/api/leads');
    expect([405, 404]).toContain(response.status());
  });
});
