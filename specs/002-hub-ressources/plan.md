# Implementation Plan: Hub éditorial /ressources

**Branch** : `002-hub-ressources` (working on `main`) | **Date** : 2026-05-19 | **Spec** : [spec.md](spec.md)

**Input** : Feature specification from [specs/002-hub-ressources/spec.md](spec.md)

## Summary

Ajout d'un **hub éditorial** au site marketing EcoleDigitale, hébergé sous `/ressources` et composé de trois types de contenu publiable en MDX (`guides`, `etudes-de-cas`, `glossaire`) plus des pages auteurs pour l'E-E-A-T. Architecture cohérente avec le pattern `content/modules/` existant : chargement disque + cache process-level + validation Zod + génération statique. Génération automatique des balises SEO (`buildMetadata`) et des données structurées (`Article`, `BreadcrumbList`, `FAQPage`, `Person`) via les builders du Sprint 1. Filtres côté serveur par `searchParams` (pas de JS client), pour préserver l'architecture RSC-first et le gate Lighthouse mobile ≥ 85. Un brief éditorial documenté garantit qu'un éditeur technique peut publier sans intervention d'un développeur frontend.

## Technical Context

**Language/Version** : TypeScript 5.x sur Node.js 20 LTS — cohérent avec la feature 001.

**Primary Dependencies** : Next.js 15 (App Router, RSC), React 19, MDX (`@next/mdx` + `next-mdx-remote/rsc`), `gray-matter` (parsing frontmatter), `zod` (validation), `lucide-react` (icônes). **Nouvelles dépendances** : `reading-time` (calcul du temps de lecture, ~3 kB) — alternative envisagée puis rejetée : implémentation maison (cf. research.md).

**Storage** : Aucune base de données. Le contenu vit dans `content/ressources/{guides,etudes-de-cas,glossaire}/*.mdx` et `content/auteurs/*.mdx`. Cache process-level dans le loader (pattern identique à `lib/content/modules.ts`).

**Testing** : Vitest (loader contenu, schémas Zod, calcul reading time, builders JSON-LD `Article`/`Person`), Playwright (E2E : hub avec filtres, page guide/étude/glossaire/auteur, JSON-LD valide, sitemap inclut les nouvelles routes), Lighthouse CI (gate ≥ 85 mobile maintenu sur les nouvelles routes), `axe-core/playwright` (a11y).

**Target Platform** : Web (navigateurs evergreen), responsive mobile-first. Déploiement Vercel.

**Project Type** : Web application — extension de l'application Next.js existante. Aucune API route nouvelle (lecture statique uniquement).

**Performance Goals** :
- Lighthouse mobile Performance ≥ 85 sur `/ressources`, `/ressources/{type}/{slug}` (chaque type), `/auteurs/{slug}`
- LCP < 2.5 s sur 3G simulé
- Pas de JS client supplémentaire pour les filtres (navigation par `searchParams`)
- Cache de build : 100% des pages générées statiquement (SSG), ISR uniquement si la liste filtrée devient trop dynamique (non requis au MVP)

**Constraints** :
- Pas de JS pour les filtres du hub (préserver le score Performance)
- Validation cross-références (auteur, persona, related) au build → fail-fast
- Le sitemap doit s'auto-mettre-à-jour à chaque publication sans intervention manuelle
- L'ajout d'une ressource ne nécessite aucune modification de fichier `.ts`/`.tsx` (US-2)

**Scale/Scope** :
- **MVP** : 2 guides, 1 étude de cas template, 5 entrées glossaire, 1 page auteur, 1 page hub = ~9 routes nouvelles + 1 page hub.
- **Cible 6 mois** : 20+ ressources publiées, 3-5 auteurs, ~30 routes nouvelles.
- **Limite raisonnable du modèle actuel** (sans pagination ni recherche interne) : ~50 ressources avant d'envisager l'extension.

## Constitution Check

*GATE — doit passer avant Phase 0 et être re-vérifié après Phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| **I. Clarity Before Decoration** | Le hub améliore la compréhension de l'offre en couvrant les questions amont des décideurs (avant l'étape démo). Pas de design surchargé : listing avec carte sobre (titre + persona + type + reading time), pages détail avec hiérarchie typographique claire (réutilise `prose-style` existant). | ✅ Pass |
| **II. Modular Offer Integrity** | Les ressources peuvent référencer un module existant (lien sortant vers `/modules/{slug}`), mais ne créent jamais de nouveau module ni de promesse hors PRD. La validation cross-références garantit qu'aucun lien ne pointe vers un slug inexistant. Les études de cas mentionnent exclusivement des modules réels du catalogue. | ✅ Pass |
| **III. Conversion and Lead Quality** | Chaque page ressource expose au minimum un CTA contextuel (réutilise `TrackedDemoCTA` ou un équivalent par type). Les études de cas pointent explicitement vers `/demander-demo`. Le hub réutilise `FinalCTA` en pied. Aucun nouveau parcours de capture de lead — réutilisation du formulaire démo existant (cf. Assumptions de la spec). | ✅ Pass |
| **IV. SEO, Accessibility, Performance Gates** | SEO : `buildMetadata` + JSON-LD `Article`/`BreadcrumbList`/`FAQPage`/`Person` via les builders Sprint 1. URLs lisibles (`/ressources/guides/{slug-fr}`). A11y : `<article>`, `<nav aria-label="Fil d'Ariane">`, focus rings, contrastes Tailwind. Perf : SSG + RSC + filtres sans JS = gate ≥ 85 préservé (target défini : `pnpm test:lighthouse` couvre les nouvelles routes). | ✅ Pass |
| **V. Maintainable Content and Analytics** | **Cœur de la feature.** Édition MDX + frontmatter Zod = autonomie éditoriale (US-2, SC-002/SC-009). Aucun TSX à modifier pour publier. Analytics : événements Plausible existants suffisent (`page view`), nouvel event optionnel `resource_cta_click` à étudier en Phase 0. | ✅ Pass |

**Gate result** : ✅ Aucune violation. La feature s'inscrit dans une extension explicitement prévue par la Constitution (« blog/resources … require explicit specification before implementation » — la spec 002 EST cette spécification).

Pas de section *Complexity Tracking* à remplir.

## Project Structure

### Documentation (this feature)

```text
specs/002-hub-ressources/
├── plan.md                          # Ce fichier
├── research.md                      # Phase 0 — décisions techniques argumentées
├── data-model.md                    # Phase 1 — entités & schémas Zod
├── quickstart.md                    # Phase 1 — parcours dev local
├── contracts/
│   ├── resource-frontmatter.contract.md   # Schéma frontmatter MDX par type
│   ├── author-frontmatter.contract.md     # Schéma frontmatter auteur
│   ├── content-loader.contract.md         # API du loader (getAllResources, getResourceBySlug, …)
│   ├── jsonld-outputs.contract.md         # Forme attendue des objets JSON-LD générés
│   └── editorial-brief.contract.md        # Template du brief éditorial (livré dans content/)
├── checklists/
│   └── requirements.md              # Déjà créé en /speckit-specify
└── tasks.md                         # À générer par /speckit-tasks
```

### Source Code (repository root)

```text
D:\Ecoledigitale_web\
├── app/
│   ├── (marketing)/
│   │   ├── ressources/                                # NOUVEAU
│   │   │   ├── page.tsx                               # /ressources — hub + filtres
│   │   │   ├── opengraph-image.tsx                    # OG dynamique pour le hub
│   │   │   ├── [type]/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx                       # /ressources/{type}/{slug}
│   │   │   │       └── opengraph-image.tsx            # OG dynamique par ressource
│   │   ├── auteurs/                                   # NOUVEAU
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                           # /auteurs/{slug}
│   │   │       └── opengraph-image.tsx
│   │   └── (existant inchangé)
│   ├── sitemap.ts                                     # ÉTENDU — inclut ressources + auteurs
│   └── (autres existant inchangé)
├── components/
│   ├── ressources/                                    # NOUVEAU
│   │   ├── ResourceCard.tsx                           # Carte de listing
│   │   ├── ResourceFilters.tsx                        # <form> serveur (pas de JS client)
│   │   ├── ResourceMeta.tsx                           # Auteur + dates + reading time
│   │   ├── RelatedResources.tsx                       # Section "Ressources liées"
│   │   ├── DeprecatedBanner.tsx                       # Bandeau ressource obsolète
│   │   ├── FictionalCaseBanner.tsx                    # Bandeau étude de cas fictive
│   │   └── EmptyState.tsx                             # Message si 0 résultat / hub vide
│   ├── auteurs/                                       # NOUVEAU
│   │   ├── AuthorCard.tsx
│   │   └── AuthorBio.tsx
│   └── (existant inchangé)
├── content/
│   ├── ressources/                                    # NOUVEAU
│   │   ├── _TEMPLATE-BRIEF.md                         # Brief éditorial (ignoré par le loader)
│   │   ├── guides/
│   │   │   └── {slug}.mdx                             # ex. digitaliser-bts.mdx
│   │   ├── etudes-de-cas/
│   │   │   └── {slug}.mdx
│   │   └── glossaire/
│   │       └── {slug}.mdx
│   ├── auteurs/                                       # NOUVEAU
│   │   └── {slug}.mdx
│   └── (existant inchangé)
├── lib/
│   ├── content/
│   │   ├── modules.ts                                 # EXISTANT — référence du pattern
│   │   ├── resources.ts                               # NOUVEAU — loader ressources
│   │   ├── resource.schema.ts                         # NOUVEAU — schémas Zod
│   │   ├── authors.ts                                 # NOUVEAU — loader auteurs
│   │   ├── author.schema.ts                           # NOUVEAU
│   │   └── reading-time.ts                            # NOUVEAU — wrapper sur `reading-time`
│   └── seo/
│       ├── jsonld.ts                                  # EXISTANT — réutilise buildArticle, etc.
│       └── (autres existant inchangé)
├── tests/
│   ├── unit/
│   │   ├── resources-loader.test.ts                   # NOUVEAU
│   │   ├── resource.schema.test.ts                    # NOUVEAU
│   │   ├── authors-loader.test.ts                     # NOUVEAU
│   │   └── reading-time.test.ts                       # NOUVEAU
│   └── e2e/
│       ├── seo.spec.ts                                # ÉTENDU — couvre nouvelles routes
│       ├── seo-infra.spec.ts                          # ÉTENDU — sitemap inclut /ressources
│       └── ressources-hub.spec.ts                     # NOUVEAU — filtres + listing + edge cases
└── (autres existants inchangés)
```

**Structure Decision** : extension verticale de l'app Next.js existante. Aucun nouveau projet, package ou monorepo. Le pattern `content/modules/` est rigoureusement reproduit pour `content/ressources/` et `content/auteurs/` — même approche loader/cache/schéma Zod/validation cross-références.

## Complexity Tracking

> Aucune violation Constitution. Section vide.

---

## Open questions héritées de la spec

- **Choix exact des 2 personas piliers prioritaires pour les premiers guides** : décision métier, hors scope technique. Le hub fonctionne indépendamment des personas couvertes en premier.
- **Liste exacte des `category` autorisées** : Constitution n'impose pas. Décision : champ libre `z.string().min(2).max(40)` au MVP, à transformer en enum si une taxonomie stable émerge à ~30 ressources publiées.
- **Stratégie analytics fine (clic CTA depuis ressource)** : tranché en research.md.
