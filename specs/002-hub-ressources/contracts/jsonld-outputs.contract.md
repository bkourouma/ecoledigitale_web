# Contract — JSON-LD outputs

**Source** : `lib/seo/jsonld.ts` (Sprint 1, builders existants + un ajout `buildPerson`).
**Injection** : via `<JsonLd data={...} />` (Server Component).
**Validation** : tous les outputs DOIVENT passer Google Rich Results Test sans erreur (warnings acceptables).

---

## 1. Page hub `/ressources`

```jsonld
[
  { "@context": "https://schema.org", "@type": "Organization", "@id": "...#organization", ... },     // global, root layout
  { "@context": "https://schema.org", "@type": "WebSite", "@id": "...#website", ... },              // global, root layout
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://ecoledigitale.fr/" },
      { "@type": "ListItem", "position": 2, "name": "Ressources", "item": "https://ecoledigitale.fr/ressources" }
    ]
  }
]
```

---

## 2. Page guide `/ressources/guides/{slug}`

```jsonld
[
  /* Organization + WebSite hérités */,
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "..." },
      { "@type": "ListItem", "position": 2, "name": "Ressources", "item": ".../ressources" },
      { "@type": "ListItem", "position": 3, "name": "Guides", "item": ".../ressources?type=guides" },
      { "@type": "ListItem", "position": 4, "name": "{title}", "item": ".../ressources/guides/{slug}" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{title}",
    "description": "{description}",
    "inLanguage": "fr-FR",
    "mainEntityOfPage": { "@type": "WebPage", "@id": ".../ressources/guides/{slug}" },
    "datePublished": "{publishedAt}",
    "dateModified": "{updatedAt ?? publishedAt}",
    "image": ".../{ogImage ?? auto-generated}",
    "author": { "@type": "Person", "name": "{author.name}", "url": ".../auteurs/{author.slug}" },
    "publisher": { "@type": "Organization", "@id": "...#organization", "name": "EcoleDigitale" }
  },
  /* SI frontmatter.faq non vide → */
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "{q}", "acceptedAnswer": { "@type": "Answer", "text": "{a}" } }
    ]
  }
]
```

---

## 3. Page étude de cas `/ressources/etudes-de-cas/{slug}`

Identique à page guide, sauf :
- `BreadcrumbList[3].name = "Études de cas"`
- `Article` reste le type principal (Schema.org n'a pas de type dédié pour "case study" → `Article` est le standard accepté)
- Si `isFictional: true` : ajouter `"disambiguatingDescription": "Exemple illustratif basé sur des données fictives."` dans l'`Article`

---

## 4. Page glossaire `/ressources/glossaire/{slug}`

Identique à page guide, sauf :
- `BreadcrumbList[3].name = "Glossaire"`
- `Article` reste OK pour une définition courte
- Optionnel future : envisager `DefinedTerm` (Schema.org) si pertinent — hors MVP

---

## 5. Page hub liste filtrée `/ressources?persona=X&type=Y`

Identique au hub principal — la liste filtrée a la même URL canonical (sans paramètres) pour éviter le contenu dupliqué :

```tsx
// app/(marketing)/ressources/page.tsx
export async function generateMetadata(...) {
  return buildMetadata({
    title: persona || type ? `Ressources filtrées — ${labels}` : 'Ressources — guides, études de cas, glossaire',
    description: '...',
    path: '/ressources',  // ← toujours sans params dans le canonical
  });
}
```

---

## 6. Page auteur `/auteurs/{slug}`

```jsonld
[
  /* Organization + WebSite hérités */,
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "..." },
      { "@type": "ListItem", "position": 2, "name": "Auteurs", "item": ".../auteurs" },
      { "@type": "ListItem", "position": 3, "name": "{author.name}", "item": ".../auteurs/{slug}" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "{name}",
    "jobTitle": "{role}",
    "description": "{bio}",
    "url": ".../auteurs/{slug}",
    "image": ".../{photo}",          /* si présent */
    "sameAs": ["{linkedinUrl}"],     /* si présent */
    "worksFor": { "@type": "Organization", "@id": "...#organization", "name": "EcoleDigitale" }
  }
]
```

**Nouveau builder à ajouter dans `lib/seo/jsonld.ts`** :

```ts
export interface PersonInput {
  name: string;
  jobTitle?: string;
  description?: string;
  path: string;          // ex. /auteurs/marie-dupont
  image?: string;
  sameAs?: readonly string[];
}

export function buildPerson(input: PersonInput) {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(input.sameAs && input.sameAs.length ? { sameAs: [...input.sameAs] } : {}),
    worksFor: { '@type': 'Organization', '@id': `${url}/#organization`, name: 'EcoleDigitale' },
  } as const;
}
```

---

## 7. Builder `buildArticle` — vérification

Le builder existe déjà (Sprint 1). Le contrat exige qu'il soit utilisé tel quel — pas de modification. L'input attendu depuis le data model est documenté en `data-model.md` §10.

---

## 8. Tests E2E à étendre

Dans `tests/e2e/seo.spec.ts` (`SEO — JSON-LD structured data` describe block), ajouter :

```ts
test('/ressources/guides/{first-slug} contient Article + BreadcrumbList', async ({ page }) => {
  await page.goto('/ressources/guides/<first-published-slug>');
  const types = flattenTypes(await getJsonLd(page));
  expect(types).toContain('Article');
  expect(types).toContain('BreadcrumbList');
});

test('chaque page auteur contient Person + BreadcrumbList', async ({ page }) => {
  for (const slug of authorSlugs) {
    await page.goto(`/auteurs/${slug}`);
    const types = flattenTypes(await getJsonLd(page));
    expect(types).toContain('Person');
    expect(types).toContain('BreadcrumbList');
  }
});
```
