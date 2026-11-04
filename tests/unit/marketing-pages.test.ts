import { describe, it, expect } from 'vitest';
import { _resetModulesCacheForTests, getAllModuleSlugs, loadModules } from '@/lib/content/modules';
import { loadResources } from '@/lib/content/resources';
import { ALL_FAQ, FAQ_GROUPS, FAQ_PAGE, HOME_FAQ, answerWithInlineLink } from '@/lib/marketing/faq';
import {
  extractInlineHrefs,
  splitInlineLinks,
  stripInlineLinks,
} from '@/lib/marketing/inline-links';
import {
  ABIDJAN_PAGE,
  COTE_D_IVOIRE_PAGE,
  DESCRIPTION_MAX,
  FEATURE_PAGES,
  FONCTIONS_HUB_PAGE,
  TARIFS_PAGE,
  TITLE_MAX,
  TITLE_SUFFIX_LENGTH,
  type ContentPageData,
} from '@/lib/marketing/pages';

const CONTENT_PAGES: readonly ContentPageData[] = [
  COTE_D_IVOIRE_PAGE,
  ABIDJAN_PAGE,
  FONCTIONS_HUB_PAGE,
  ...FEATURE_PAGES,
  TARIFS_PAGE,
];

const STATIC_ROUTES = [
  '/',
  '/modules',
  '/a-propos',
  '/demander-demo',
  '/ressources',
  '/confidentialite',
  '/faq',
  ...CONTENT_PAGES.map((page) => page.path),
];

function knownRoutes(): Set<string> {
  const routes = new Set<string>(STATIC_ROUTES);
  for (const slug of getAllModuleSlugs()) routes.add(`/modules/${slug}`);
  for (const { frontmatter } of loadResources()) {
    routes.add(`/ressources/${frontmatter.type}/${frontmatter.slug}`);
  }
  return routes;
}

/** Tout le texte d'une page, pour les contrôles de vocabulaire. */
function pageText(page: ContentPageData): string {
  return JSON.stringify(page);
}

describe('Pages par sujet : métadonnées', () => {
  it('chaque title tient en 60 caractères avec le suffixe, sans marque doublée', () => {
    for (const page of CONTENT_PAGES) {
      expect(page.seo.title.length + TITLE_SUFFIX_LENGTH, page.path).toBeLessThanOrEqual(TITLE_MAX);
      expect(page.seo.title, page.path).not.toMatch(/EcoleDigitale/i);
    }
    expect(FAQ_PAGE.seo.title.length + TITLE_SUFFIX_LENGTH).toBeLessThanOrEqual(TITLE_MAX);
  });

  it('chaque meta description tient en 155 caractères', () => {
    for (const page of CONTENT_PAGES) {
      expect(page.seo.description.length, page.path).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(page.seo.description.length, page.path).toBeGreaterThanOrEqual(100);
    }
    expect(FAQ_PAGE.seo.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });

  it('les chemins sont uniques, les dates réelles et passées', () => {
    const paths = CONTENT_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    const today = new Date().toISOString().slice(0, 10);
    for (const page of CONTENT_PAGES) {
      expect(page.updatedAt, page.path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(page.updatedAt <= today, page.path).toBe(true);
    }
  });

  it('les pages par fonction vivent sous /fonctions/', () => {
    for (const page of FEATURE_PAGES) expect(page.path).toMatch(/^\/fonctions\/[a-z-]+$/);
  });
});

describe('Pages par sujet : contenu', () => {
  it('chaque page a des sections, au moins 3 questions de FAQ et des packs', () => {
    for (const page of CONTENT_PAGES) {
      expect(page.sections.length, page.path).toBeGreaterThanOrEqual(3);
      expect(page.faq.length, page.path).toBeGreaterThanOrEqual(3);
      expect(page.packs.length, page.path).toBeGreaterThanOrEqual(1);
      const questions = page.faq.map((entry) => entry.question);
      expect(new Set(questions).size, page.path).toBe(questions.length);
    }
  });

  it('les packs cités existent', () => {
    const slugs = new Set<string>(getAllModuleSlugs());
    for (const page of CONTENT_PAGES) {
      for (const pack of page.packs) expect(slugs.has(pack), `${page.path} → ${pack}`).toBe(true);
    }
  });

  it('tous les liens internes pointent vers une page qui existe', () => {
    const routes = knownRoutes();
    for (const page of CONTENT_PAGES) {
      const texts = [
        page.lead,
        ...page.sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
        ...page.faq.map((f) => f.answer),
      ];
      const hrefs = [...texts.flatMap(extractInlineHrefs), ...page.seeAlso.map((l) => l.href)];
      for (const href of hrefs) expect(routes.has(href), `${page.path} → ${href}`).toBe(true);
    }
    for (const entry of ALL_FAQ) {
      for (const href of extractInlineHrefs(answerWithInlineLink(entry))) {
        expect(routes.has(href), `FAQ → ${href}`).toBe(true);
      }
    }
  });

  it('les liens des guides et des packs (MDX) pointent vers une page qui existe', () => {
    _resetModulesCacheForTests();
    const routes = knownRoutes();
    const bodies = [
      ...loadModules().map((m) => ({ id: m.frontmatter.slug, body: m.body })),
      ...loadResources().map((r) => ({ id: r.frontmatter.slug, body: r.body })),
    ];
    for (const { id, body } of bodies) {
      for (const match of body.matchAll(/\]\((\/[^)\s#?]*)\)/g)) {
        expect(routes.has(match[1]!), `${id} → ${match[1]}`).toBe(true);
      }
    }
  });

  it("n'affirme aucune fonction non confirmée, aucun opérateur, aucun prix ni certification", () => {
    const texts = [
      ...CONTENT_PAGES.map(pageText),
      ...ALL_FAQ.map((entry) => entry.question + entry.answer),
    ];
    for (const text of texts) {
      expect(text).not.toMatch(/hors connexion|hors ligne|PWA|installable/i);
      expect(text).not.toMatch(/g[ée]n[ée]ration automatique|g[ée]n[èe]re automatiquement/i);
      expect(text).not.toMatch(/Wave|Orange Money|MTN|Moov/i);
      expect(text).not.toMatch(/\d\s?(FCFA|XOF|CFA|€|EUR|\$)/);
      expect(text).not.toMatch(/Union [Ee]urop|RGPD|GDPR|ARTCI/);
      expect(text).not.toMatch(/Qualiopi|RNCP|alternance/i);
      expect(text).not.toMatch(/certifi[ée]|label qualit/i);
      expect(text).not.toMatch(/[ÉE]l[èe]ves? affect[ée]s? par l.État/i);
    }
  });

  it('les offres sont sur devis : les trois noms sont cités, sans montant', () => {
    const text = pageText(TARIFS_PAGE);
    for (const name of ['Starter', 'Professional', 'Enterprise']) expect(text).toContain(name);
    expect(text).toMatch(/devis/);
    expect(text).toMatch(/1 à 3 semaines/);
    expect(text).toMatch(/48 h ouvrées/);
  });

  it('la page Côte d’Ivoire cite les examens, le Mobile Money et l’Afrique francophone', () => {
    const text = pageText(COTE_D_IVOIRE_PAGE);
    for (const word of ['CEPE', 'BEPC', 'BAC', 'MGA', 'Mobile Money', 'Afrique francophone']) {
      expect(text).toContain(word);
    }
  });
});

describe('FAQ générale', () => {
  it('réutilise les questions de l’accueil', () => {
    const all = new Set(ALL_FAQ.map((entry) => entry.question));
    for (const entry of HOME_FAQ) expect(all.has(entry.question), entry.question).toBe(true);
  });

  it('couvre les groupes attendus, sans question en double', () => {
    expect(FAQ_GROUPS.map((group) => group.heading)).toEqual([
      'Choisir et démarrer',
      'Cycles et examens',
      'Notes et bulletins',
      'Frais de scolarité et paiements',
      'Parents et mobile',
      'Données et sécurité',
      'Tarifs',
    ]);
    const questions = ALL_FAQ.map((entry) => entry.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it('chaque lien de réponse repose sur une expression présente dans la réponse', () => {
    for (const entry of ALL_FAQ) {
      if (!entry.link) continue;
      expect(entry.answer, entry.question).toContain(entry.link.phrase);
      expect(answerWithInlineLink(entry), entry.question).toContain(`](${entry.link.href})`);
    }
  });
});

describe('Liens dans un texte brut', () => {
  it('découpe, nettoie et liste les liens', () => {
    const source = 'Voir le [socle](/modules/socle-ecoledigitale) puis [la démo](/demander-demo).';
    expect(splitInlineLinks(source)).toEqual([
      { text: 'Voir le ' },
      { text: 'socle', href: '/modules/socle-ecoledigitale' },
      { text: ' puis ' },
      { text: 'la démo', href: '/demander-demo' },
      { text: '.' },
    ]);
    expect(stripInlineLinks(source)).toBe('Voir le socle puis la démo.');
    expect(extractInlineHrefs(source)).toEqual(['/modules/socle-ecoledigitale', '/demander-demo']);
  });

  it('laisse intact un texte sans lien', () => {
    expect(splitInlineLinks('Aucun lien ici.')).toEqual([{ text: 'Aucun lien ici.' }]);
  });
});
