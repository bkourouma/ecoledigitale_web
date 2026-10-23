import { describe, expect, it } from 'vitest';
import {
  CONSENT_KEY,
  CONSENT_TTL_MS,
  clearGoogleAnalyticsCookies,
  cookieDomains,
  isGoogleAnalyticsCookie,
  readConsent,
  shouldLoadAnalytics,
  writeConsent,
} from '@/lib/consent';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
    removeItem: (k: string) => {
      delete data[k];
    },
    data,
  };
}

describe('consentement : états et durée de validité', () => {
  const t0 = Date.UTC(2026, 9, 23);

  it('vaut « unset » sans choix mémorisé ou sans stockage', () => {
    expect(readConsent(memoryStorage(), t0)).toBe('unset');
    expect(readConsent(null, t0)).toBe('unset');
  });

  it('mémorise « accepted » et « refused »', () => {
    const s = memoryStorage();
    writeConsent(s, 'accepted', t0);
    expect(readConsent(s, t0 + 1000)).toBe('accepted');
    writeConsent(s, 'refused', t0);
    expect(readConsent(s, t0 + 1000)).toBe('refused');
    expect(Object.keys(s.data)).toEqual([CONSENT_KEY]);
  });

  it('expire après 6 mois (retour à « unset »)', () => {
    const s = memoryStorage();
    writeConsent(s, 'accepted', t0);
    expect(readConsent(s, t0 + CONSENT_TTL_MS - 1)).toBe('accepted');
    expect(readConsent(s, t0 + CONSENT_TTL_MS)).toBe('unset');
    expect(CONSENT_TTL_MS).toBeGreaterThanOrEqual(180 * 24 * 3600 * 1000);
    expect(CONSENT_TTL_MS).toBeLessThanOrEqual(184 * 24 * 3600 * 1000);
  });

  it('ignore une valeur corrompue, inconnue ou datée du futur', () => {
    expect(readConsent(memoryStorage({ [CONSENT_KEY]: "n'importe quoi" }), t0)).toBe('unset');
    expect(readConsent(memoryStorage({ [CONSENT_KEY]: 'null' }), t0)).toBe('unset');
    expect(
      readConsent(
        memoryStorage({ [CONSENT_KEY]: JSON.stringify({ choice: 'maybe', at: t0 }) }),
        t0,
      ),
    ).toBe('unset');
    expect(
      readConsent(
        memoryStorage({ [CONSENT_KEY]: JSON.stringify({ choice: 'accepted', at: t0 + 5000 }) }),
        t0,
      ),
    ).toBe('unset');
  });

  it('ne plante pas si le stockage lève une exception', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => undefined,
    };
    expect(readConsent(broken, t0)).toBe('unset');
    expect(() => writeConsent(broken, 'accepted', t0)).not.toThrow();
  });
});

describe('retrait du consentement : cookies Google', () => {
  it('reconnaît les cookies Google Analytics seulement', () => {
    expect(isGoogleAnalyticsCookie('_ga')).toBe(true);
    expect(isGoogleAnalyticsCookie('_ga_3SQDG4YB1W')).toBe(true);
    expect(isGoogleAnalyticsCookie('_gid')).toBe(true);
    expect(isGoogleAnalyticsCookie('session')).toBe(false);
    expect(isGoogleAnalyticsCookie('gax')).toBe(false);
  });

  it("liste l'hôte et ses domaines parents", () => {
    expect(cookieDomains('ecoledigitale.allianceconsultants.net')).toEqual([
      'ecoledigitale.allianceconsultants.net',
      'allianceconsultants.net',
    ]);
    expect(cookieDomains('localhost')).toEqual([]);
  });

  it('expire chaque cookie _ga* et laisse les autres', () => {
    const writes: string[] = [];
    const doc = {
      get cookie() {
        return '_ga=GA1.1.1; _ga_3SQDG4YB1W=GS1; autre=1';
      },
      set cookie(v: string) {
        writes.push(v);
      },
    } as unknown as Document;
    clearGoogleAnalyticsCookies(doc, 'ecoledigitale.allianceconsultants.net');
    expect(writes.length).toBeGreaterThan(0);
    expect(writes.every((w) => w.includes('1970') && !w.startsWith('autre='))).toBe(true);
    expect(
      writes.some((w) => w.startsWith('_ga=') && w.includes('domain=.allianceconsultants.net')),
    ).toBe(true);
    expect(writes.some((w) => w.startsWith('_ga_3SQDG4YB1W='))).toBe(true);
  });
});

describe('chargement de la balise : conditions', () => {
  const ok = {
    nodeEnv: 'production',
    hostname: 'ecoledigitale.allianceconsultants.net',
    consent: 'accepted' as const,
  };

  it('charge seulement en production, sur le vrai domaine, après accord', () => {
    expect(shouldLoadAnalytics(ok)).toBe(true);
  });

  it('ne charge pas sans accord', () => {
    expect(shouldLoadAnalytics({ ...ok, consent: 'unset' })).toBe(false);
    expect(shouldLoadAnalytics({ ...ok, consent: 'refused' })).toBe(false);
    expect(shouldLoadAnalytics({ ...ok, consent: 'loading' })).toBe(false);
  });

  it('ne charge pas en développement ni en test', () => {
    expect(shouldLoadAnalytics({ ...ok, nodeEnv: 'development' })).toBe(false);
    expect(shouldLoadAnalytics({ ...ok, nodeEnv: 'test' })).toBe(false);
    expect(shouldLoadAnalytics({ ...ok, nodeEnv: undefined })).toBe(false);
  });

  it('ne charge pas hors des bons domaines', () => {
    for (const hostname of [
      'localhost',
      'preview.vercel.app',
      'allianceconsultants.net',
      'www.allianceconsultants.net',
      'app.ecoledigitale.allianceconsultants.net',
      'ecoledigitale.allianceconsultants.net.evil.com',
      '',
    ]) {
      expect(shouldLoadAnalytics({ ...ok, hostname })).toBe(false);
    }
  });
});
