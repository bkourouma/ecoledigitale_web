import { describe, it, expect, beforeEach } from 'vitest';
import { _resetModulesCacheForTests, loadModules } from '@/lib/content/modules';
import { getAllResources, getResourceBySlug, loadResources } from '@/lib/content/resources';
import {
  buildEditorialTeam,
  buildOrganization,
  buildSoftwareApplication,
  buildWebPage,
} from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  CONTACT_WHATSAPP_NUMBER,
} from '@/lib/site/contact';

/** Longueur du suffixe ` | EcoleDigitale` ajouté par le gabarit de titre. */
const SUFFIX = ' | EcoleDigitale'.length;

describe('Coordonnées publiques', () => {
  it('téléphone et WhatsApp désignent le même numéro', () => {
    expect(CONTACT_PHONE_E164).toBe('+2250101510136');
    expect(CONTACT_WHATSAPP_NUMBER).toBe('2250101510136');
    expect(CONTACT_PHONE_DISPLAY.replace(/\D/g, '')).toBe(CONTACT_WHATSAPP_NUMBER);
  });

  it("l'e-mail public est celui d'Alliance Consultants, pas un Gmail", () => {
    expect(CONTACT_EMAIL).toBe('ecoledigitale@allianceconsultants.net');
    expect(CONTACT_EMAIL).not.toMatch(/gmail/i);
  });
});

describe('Catalogue des packs (SEO)', () => {
  beforeEach(() => {
    _resetModulesCacheForTests();
  });

  it('chaque title tient en 60 caractères avec le suffixe du gabarit, sans marque doublée', () => {
    for (const { frontmatter } of loadModules()) {
      expect(frontmatter.seo.title.length + SUFFIX, frontmatter.slug).toBeLessThanOrEqual(60);
      expect(frontmatter.seo.title, frontmatter.slug).not.toMatch(/EcoleDigitale/);
    }
  });

  it('chaque meta description fait 155 caractères au plus', () => {
    for (const { frontmatter } of loadModules()) {
      expect(frontmatter.seo.description.length, frontmatter.slug).toBeLessThanOrEqual(155);
    }
  });

  it('chaque pack a un H1 distinct de son nom, une FAQ et des liens de maillage', () => {
    for (const { frontmatter } of loadModules()) {
      expect(frontmatter.h1, frontmatter.slug).not.toBe(frontmatter.name);
      expect(frontmatter.faq.length, frontmatter.slug).toBeGreaterThanOrEqual(3);
      expect(frontmatter.related.length, frontmatter.slug).toBeGreaterThanOrEqual(1);
      expect(frontmatter.resources.length, frontmatter.slug).toBeGreaterThanOrEqual(1);
    }
  });

  it('les ressources liées existent', () => {
    for (const { frontmatter } of loadModules()) {
      for (const ref of frontmatter.resources) {
        expect(
          getResourceBySlug(ref.type, ref.slug),
          `${frontmatter.slug} → ${ref.slug}`,
        ).toBeTruthy();
      }
    }
  });

  it('les liens internes du corps pointent vers des pages qui existent', () => {
    const slugs = new Set(loadModules().map((m) => m.frontmatter.slug));
    const resources = new Set(
      loadResources().map((r) => `/ressources/${r.frontmatter.type}/${r.frontmatter.slug}`),
    );
    for (const { frontmatter, body } of loadModules()) {
      for (const match of body.matchAll(/\]\((\/[^)\s]+)\)/g)) {
        const href = match[1]!;
        if (href === '/demander-demo' || href === '/ressources') continue;
        if (href.startsWith('/modules/')) {
          expect(
            slugs.has(href.replace('/modules/', '') as never),
            `${frontmatter.slug} → ${href}`,
          ).toBe(true);
        } else {
          expect(resources.has(href), `${frontmatter.slug} → ${href}`).toBe(true);
        }
      }
    }
  });

  it("n'affirme aucune fonction non confirmée ni aucun prix", () => {
    for (const { frontmatter, body } of loadModules()) {
      const text = JSON.stringify(frontmatter) + body;
      expect(text, frontmatter.slug).not.toMatch(/hors connexion|hors ligne|PWA|installable/i);
      expect(text, frontmatter.slug).not.toMatch(/g[ée]n[ée]ration automatique/i);
      expect(text, frontmatter.slug).not.toMatch(/Wave|Orange Money|MTN|Moov/i);
      expect(text, frontmatter.slug).not.toMatch(/\d\s?(FCFA|XOF|€)/);
      expect(text, frontmatter.slug).not.toMatch(/Union [Ee]urop/);
    }
  });
});

describe('Ressources (SEO)', () => {
  it('le title effectif de chaque ressource tient en 60 caractères avec le suffixe', () => {
    for (const { frontmatter } of getAllResources()) {
      const title = frontmatter.seoTitle ?? frontmatter.title;
      expect(title.length + SUFFIX, frontmatter.slug).toBeLessThanOrEqual(60);
    }
  });

  it('chaque meta description de ressource tient en 155 caractères', () => {
    for (const { frontmatter } of getAllResources()) {
      expect(frontmatter.description.length, frontmatter.slug).toBeLessThanOrEqual(155);
    }
  });

  it("aucune étude de cas n'est publiée (l'étude fictive a été supprimée)", () => {
    const studies = loadResources().filter((r) => r.frontmatter.type === 'etudes-de-cas');
    expect(studies).toHaveLength(0);
  });

  it('le glossaire ne contient plus le cadre français', () => {
    const slugs = loadResources()
      .filter((r) => r.frontmatter.type === 'glossaire')
      .map((r) => r.frontmatter.slug);
    for (const gone of ['qualiopi', 'referentiel-rncp', 'alternance']) {
      expect(slugs).not.toContain(gone);
    }
    for (const kept of ['cepe', 'bepc', 'bac', 'mga', 'conseil-de-classe', 'bts', 'lms']) {
      expect(slugs).toContain(kept);
    }
  });

  it('le guide « Choisir un logiciel… » est accentué', () => {
    const guide = getResourceBySlug('guides', 'choisir-logiciel-gestion-ecole-privee');
    expect(guide).toBeTruthy();
    // Les adresses des liens (ex. /fonctions/frais-de-scolarite) n'ont pas d'accents : on les retire.
    const text = (guide!.frontmatter.title + guide!.body).replace(/\]\([^)]*\)/g, ']');
    expect(text).toContain('école');
    expect(text).not.toMatch(/\becole\b|\bprivee\b|\bdemonstration\b|\bscolarite\b/);
  });
});

describe('JSON-LD', () => {
  it('Organization : logo existant, adresse limitée à la ville et au pays, contact cohérent', () => {
    const org = buildOrganization();
    expect(org.logo).toMatch(/\/apple-icon$/);
    expect(org.logo).not.toMatch(/icon\.svg/);
    expect(org.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    });
    expect(org.contactPoint.areaServed).toBe('CI');
    expect(org.contactPoint.telephone).toBe(CONTACT_PHONE_E164);
    expect(org.contactPoint.email).toBe(CONTACT_EMAIL);
    expect(JSON.stringify(org)).not.toMatch(/gmail|"FR"/i);
  });

  it('SoftwareApplication sans offers, notes ni avis', () => {
    const app = buildSoftwareApplication({
      name: 'EcoleDigitale Primary',
      description: 'Description',
      path: '/modules/ecoledigitale-primary',
    });
    expect(app['@type']).toBe('SoftwareApplication');
    expect(app).not.toHaveProperty('offers');
    expect(app).not.toHaveProperty('aggregateRating');
    expect(app).not.toHaveProperty('review');
  });

  it('WebPage désigne le SoftwareApplication comme sujet principal', () => {
    const page = buildWebPage({
      name: 'Nom',
      description: 'Description',
      path: '/modules/ecoledigitale-primary',
      mainEntityId: 'https://exemple.test/modules/ecoledigitale-primary#software',
    });
    expect(page['@type']).toBe('WebPage');
    expect(page.mainEntity).toEqual({
      '@id': 'https://exemple.test/modules/ecoledigitale-primary#software',
    });
  });

  it('une équipe éditoriale est une Organization, pas une Person', () => {
    const team = buildEditorialTeam({ name: 'Équipe', path: '/auteurs/equipe' });
    expect(team['@type']).toBe('Organization');
  });
});

describe('buildMetadata', () => {
  it("ne pose pas d'image Open Graph tant qu'aucune n'est fournie (la convention de route prend le relais)", () => {
    const meta = buildMetadata({ title: 'Titre', description: 'Description', path: '/x' });
    expect(meta.openGraph).not.toHaveProperty('images');
    expect(meta.twitter).not.toHaveProperty('images');
  });

  it('pose une image quand elle est fournie', () => {
    const meta = buildMetadata({
      title: 'Titre',
      description: 'Description',
      path: '/x',
      ogImage: '/og.png',
    });
    expect(meta.openGraph).toHaveProperty('images');
  });

  it('le titre absolu échappe au gabarit', () => {
    const meta = buildMetadata({
      title: 'Titre complet | EcoleDigitale',
      absoluteTitle: true,
      description: 'Description',
      path: '/',
    });
    expect(meta.title).toEqual({ absolute: 'Titre complet | EcoleDigitale' });
  });
});
