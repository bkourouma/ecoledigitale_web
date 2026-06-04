# Contract — Resource frontmatter (MDX)

**Format** : YAML frontmatter en tête de chaque fichier `content/ressources/{type}/{slug}.mdx`.
**Validation** : Zod (cf. `data-model.md` §4).
**Failure mode** : `next build` échoue avec un message identifiant le fichier, le champ, la règle violée.

---

## Champs communs (tous types)

| Champ | Type | Requis | Contraintes | Exemple |
|---|---|:-:|---|---|
| `slug` | string | ✅ | `^[a-z0-9-]+$`, 3-60 chars | `digitaliser-bts-2026` |
| `title` | string | ✅ | 20-80 chars | `"Digitaliser un institut BTS en 2026 : guide complet"` |
| `description` | string | ✅ | 80-160 chars (= meta description) | `"Méthode, outils, étapes de conduite du changement..."` |
| `type` | enum | ✅ | `guides \| etudes-de-cas \| glossaire` | `guides` |
| `status` | enum | ⬜ (default `draft`) | `draft \| published` | `published` |
| `deprecated` | boolean | ⬜ (default `false`) | — | `false` |
| `publishedAt` | string ISO | ✅ | `YYYY-MM-DD` | `"2026-06-15"` |
| `updatedAt` | string ISO | ⬜ | `YYYY-MM-DD`, ≥ `publishedAt` | `"2026-08-02"` |
| `author` | string | ✅ | FK → `content/auteurs/{slug}.mdx` | `marie-dupont` |
| `personas` | string[] | ✅ | 1-5 valeurs de l'enum, `tous` mutuellement exclusif | `[lycee-bts, superieur]` |
| `category` | string | ✅ | 2-40 chars, libre | `"Pédagogie"` |
| `seo.keywords` | string[] | ⬜ | 0-10, chaque 2-30 chars | `[LMS, BTS, gestion scolaire]` |
| `seo.ogImage` | string | ⬜ | path commençant par `/` | `/images/og/digitaliser-bts.png` |
| `faq` | object[] | ⬜ | 0-15 entrées | (voir ci-dessous) |
| `relatedRessources` | object[] | ⬜ | 0-8 entrées | (voir ci-dessous) |

### `faq` (optionnel)
```yaml
faq:
  - question: "Combien de temps pour digitaliser un institut ?"
    answer: "Comptez 6 à 12 mois en moyenne, selon..."
```

### `relatedRessources` (optionnel)
```yaml
relatedRessources:
  - { type: guides, slug: choisir-un-lms }
  - { type: etudes-de-cas, slug: institut-st-exupery }
  - { type: glossaire, slug: lms }
```

---

## Champs spécifiques par type

### Type `guides`

Aucun champ supplémentaire. Le corps MDX est libre — structure recommandée dans le brief éditorial mais non contrainte.

### Type `etudes-de-cas`

| Champ | Type | Requis | Contraintes |
|---|---|:-:|---|
| `isFictional` | boolean | ⬜ (default `false`) | Si `true`, un `<FictionalCaseBanner />` est affiché en tête de page |
| `caseStudy.establishment` | string | ✅ | 2-80 chars |
| `caseStudy.establishmentType` | string | ✅ | 2-40 chars (ex. "Lycée BTS, 850 étudiants") |
| `caseStudy.modulesActivated` | string[] | ✅ | ≥1, chaque slug DOIT exister dans `MODULE_SLUGS` |
| `caseStudy.testimonialAuthor` | string | ✅ | 2-80 chars |
| `caseStudy.testimonialRole` | string | ✅ | 2-80 chars |

### Type `glossaire`

| Champ | Type | Requis | Contraintes |
|---|---|:-:|---|
| `term` | string | ✅ | 2-60 chars (terme défini, peut différer du slug) |
| `shortDefinition` | string | ✅ | 30-200 chars (extrait, sert au listing et au meta) |

**Contrainte sur le corps** : ≤ 500 mots (warning au-delà, pas d'erreur).

---

## Exemple complet — Guide

```mdx
---
slug: digitaliser-bts-2026
title: "Digitaliser un institut BTS en 2026 : guide complet"
description: "Méthode, outils, étapes clés et écueils à éviter pour réussir la digitalisation d'un institut BTS sur 6 à 12 mois."
type: guides
status: published
publishedAt: "2026-06-15"
author: marie-dupont
personas:
  - lycee-bts
  - superieur
category: Conduite du changement
seo:
  keywords: [BTS, digitalisation, LMS, gestion scolaire, post-bac]
faq:
  - question: "Combien de temps pour digitaliser un institut ?"
    answer: "Comptez 6 à 12 mois en moyenne..."
relatedRessources:
  - { type: glossaire, slug: lms }
  - { type: etudes-de-cas, slug: institut-st-exupery }
---

## Introduction

[Corps MDX ici...]
```

---

## Comportement à la lecture

1. `gray-matter` parse le frontmatter YAML.
2. `ResourceFrontmatterSchema.parse(parsed.data)` → `ResourceFrontmatter` typé.
3. Le slug du frontmatter DOIT == filename (sans `.mdx`), sinon erreur explicite.
4. Le `type` du frontmatter DOIT == nom du sous-dossier (`guides`, `etudes-de-cas`, `glossaire`), sinon erreur.
5. `validateResourceCatalog()` lève les erreurs cross-références.
