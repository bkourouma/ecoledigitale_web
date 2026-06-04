# Quickstart — Hub éditorial /ressources

**Audience** : développeur reprenant l'implémentation de la feature 002.
**Pré-requis** : node 20+, pnpm 9+, accès au repo EcoleDigitale, Sprint 1 SEO technique mergé.

---

## 1. Installation

```bash
cd D:\Ecoledigitale_web
pnpm install
```

`reading-time` est déjà présent dans `package.json`. Ne relancer `pnpm add
reading-time` que si vous repartez d'un scaffold antérieur à la feature 002.

---

## 2. Vue d'ensemble des étapes (ordre logique)

L'implémentation suit l'ordre dépendances → consommateurs :

1. **Schémas Zod** (`lib/content/resource.schema.ts`, `lib/content/author.schema.ts`)
2. **Loaders** (`lib/content/resources.ts`, `lib/content/authors.ts`, `lib/content/reading-time.ts`)
3. **Tests unitaires loaders + schémas** (TDD recommandé)
4. **Builder JSON-LD Person** (ajout à `lib/seo/jsonld.ts`)
5. **Composants UI** (`components/ressources/*`, `components/auteurs/*`)
6. **Routes app** (`app/(marketing)/ressources/...`, `app/(marketing)/auteurs/...`)
7. **OG images dynamiques** (`opengraph-image.tsx` par route)
8. **Extension `app/sitemap.ts`**
9. **Tests E2E** (`tests/e2e/ressources-hub.spec.ts`, extension `seo.spec.ts`)
10. **Contenu MVP** (2 guides, 1 étude template, 5 glossaire, 1 auteur)
11. **Brief éditorial** (`content/ressources/_TEMPLATE-BRIEF.md`)

L'ordre est détaillé dans `/speckit-tasks` (à générer après ce plan).

---

## 3. Créer une première ressource en local

```bash
# 1. Créer un auteur de référence
@'
---
slug: dev-test
name: "Dev Test"
role: "Compte d'essai pour développement local"
bio: "Cet auteur sert uniquement à valider le rendu en local. À supprimer avant merge sur main."
expertise:
  - Tests
  - Développement local
---

## Bio longue de test

Pour vérifier le rendu MDX dans la page auteur.
'@ | Set-Content -Encoding UTF8 content/auteurs/dev-test.mdx

# 2. Créer un guide de test
@'
---
slug: hello-world
title: "Guide de test pour valider le rendu du hub"
description: "Ce guide est créé pour vérifier que la pipeline MDX, le frontmatter Zod et le rendu fonctionnent. À supprimer avant merge."
type: guides
status: published
publishedAt: "2026-05-19"
author: dev-test
personas:
  - tous
category: Test
faq:
  - question: "Ce guide est-il en production ?"
    answer: "Non, il s'agit d'un guide de test à supprimer avant tout merge sur main."
---

## Hello world

Si vous voyez ce texte, le rendu MDX fonctionne.
'@ | Set-Content -Encoding UTF8 content/ressources/guides/hello-world.mdx

# 3. Lancer le dev server
pnpm dev

# 4. Ouvrir dans le navigateur
# - http://localhost:4000/ressources           → le guide est listé
# - http://localhost:4000/ressources/guides/hello-world → le détail s'affiche
# - http://localhost:4000/auteurs/dev-test     → la page auteur
```

---

## 4. Tests à lancer

```bash
# Type-check (échoue si frontmatter invalide)
pnpm typecheck

# Tests unitaires (loaders, schémas, reading-time)
pnpm test:unit -- resources
pnpm test:unit -- authors

# Tests E2E SEO (incluant les nouvelles routes après implémentation)
pnpm test:e2e -- seo

# Lighthouse (gate ≥ 85 mobile)
pnpm dev &        # serveur doit tourner
pnpm test:lighthouse

# Accessibilité (axe-core)
pnpm test:a11y
```

Routes de smoke test SEO actuellement couvertes par la feature 002 :

- `/ressources`
- `/ressources/guides/digitaliser-institut-bts`
- `/ressources/guides/choisir-logiciel-gestion-ecole-privee`
- `/ressources/etudes-de-cas/exemple-institut-bts`
- `/ressources/glossaire/lms`
- `/auteurs/equipe-ecoledigitale`

---

## 5. Vérifier le JSON-LD en local

Une fois la ressource créée et le dev server lancé :

```bash
# Récupérer la page et extraire les blocs JSON-LD
curl -s http://localhost:4000/ressources/guides/hello-world | \
  grep -oP '(?s)(?<=<script type="application/ld\+json">).*?(?=</script>)' | \
  jq .
```

Doit afficher :
- `Organization` (root layout)
- `WebSite` (root layout)
- `BreadcrumbList`
- `Article`
- `FAQPage` (si le frontmatter contient `faq[]`)

**Validation Google** : copier la page (curl HTML complet) ou son URL déployée sur https://search.google.com/test/rich-results. Aucun item ne doit avoir d'erreur.

---

## 6. Cycle dev → deploy → validation prod

1. PR mergée sur `main`
2. Vercel build automatique
3. Vérifier en preview :
   - Lighthouse mobile ≥ 85 (`Vercel > Deployment > Insights`)
   - `https://<preview-url>/sitemap.xml` inclut les nouvelles routes
   - `https://<preview-url>/ressources` liste les ressources `published`
4. Promotion en production
5. **Soumettre le sitemap dans Google Search Console** (`Sitemaps > Add a new sitemap > sitemap.xml`)
6. **Activer IndexNow** (cf. Pilier 2 SEO) pour notifier Bing
7. À J+15 : vérifier dans GSC que les nouvelles URLs apparaissent en "Pages indexées"
8. À J+30 : commencer à mesurer les impressions/clics par cluster persona

---

## 7. Procédure de dépréciation d'une ressource

Quand une ressource n'est plus à jour :

```yaml
# Dans le frontmatter
status: published
deprecated: true
updatedAt: "2026-09-01"  # date de la dépréciation
```

La ressource :
- Reste accessible à son URL (préserve link equity)
- Affiche `<DeprecatedBanner />` en tête
- Sort du listing hub
- Reste dans le sitemap avec priority basse (0.3)
- `dateModified` JSON-LD = `updatedAt`

Si une ressource de remplacement existe, ajouter une redirection 301 dans `next.config.mjs` :

```js
async redirects() {
  return [
    { source: '/ressources/guides/ancien-slug', destination: '/ressources/guides/nouveau-slug', permanent: true },
  ];
}
```

---

## 8. Troubleshooting

| Symptôme | Cause probable | Solution |
|---|---|---|
| `next build` échoue avec "Invalid resource frontmatter in {fichier}" | Frontmatter ne respecte pas le schéma Zod | Lire le message d'erreur, corriger le champ identifié |
| `/ressources/{type}/{slug}` retourne 404 en prod | Statut `draft` ou `deprecated`+listing exclu | Vérifier `status: published` et `publishedAt ≤ now` |
| `/ressources/{type}/{slug}` retourne 404 en dev | Slug ne correspond pas au filename | Renommer le fichier ou ajuster le slug |
| Filtres `?persona=X` ignorés | Valeur hors enum `RESOURCE_PERSONAS` | Vérifier l'orthographe (cf. `data-model.md` §1) |
| Lighthouse Perf < 85 sur `/ressources/guides/{slug}` | Image LCP non optimisée ou hero trop lourd | Vérifier `<Image>` avec dimensions explicites + `priority` sur le hero |
| Test E2E `seo.spec.ts` cassé sur nouvelle ressource | Tests en dur sur des slugs absents en prod | Adapter le test E2E pour lire dynamiquement la première ressource publiée |
