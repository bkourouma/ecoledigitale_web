---

description: "Tasks dépendances-ordonnées pour la feature 002 hub /ressources"
---

# Tasks: Hub éditorial /ressources

**Input** : Design documents from `D:\Ecoledigitale_web\specs\002-hub-ressources\`

**Prerequisites** : plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests** : ✅ inclus — explicitement requis par FR-029 (extension des suites Vitest unitaires et Playwright E2E).

**Organization** : tâches groupées par user story. US1 (P1) = MVP minimum livrable. US2-3-4-5 s'ajoutent indépendamment.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : tâche parallélisable (fichier différent, pas de dépendance sur tâche incomplète).
- **[USx]** : user story de rattachement (US1, US2, US3, US4, US5).
- Chemins absolus quand le dossier est nouveau ; chemins projet-relatifs (`lib/...`, `app/...`) quand le dossier existe déjà.

## Path Conventions

Single-project Next.js — racine `D:\Ecoledigitale_web\`. Tous les chemins ci-dessous sont relatifs à cette racine sauf mention.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose** : préparer le terrain (dépendance + arborescence) avant tout code.

- [X] T001 Installer la dépendance `reading-time` : `pnpm add reading-time` (cf. research.md R-001)
- [X] T002 [P] Créer l'arborescence `content/ressources/{guides,etudes-de-cas,glossaire}/` et `content/auteurs/` (dossiers vides avec un `.gitkeep`)
- [X] T003 [P] Créer l'arborescence `components/ressources/` et `components/auteurs/` (dossiers vides avec un `.gitkeep`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose** : briques partagées par toutes les user stories. AUCUNE story ne peut commencer avant la fin de cette phase.

**⚠️ CRITICAL** : pas de travail US tant que Phase 2 n'est pas verte.

### Schémas Zod (data-model.md §2-5)

- [X] T004 [P] Créer `lib/content/reading-time.ts` exposant `getReadingTime(body: string)` (wrapper sur `reading-time`, formatage français — base 220 wpm, fix F1)
- [X] T005 [P] Créer `lib/content/author.schema.ts` : `AuthorFrontmatterSchema` + `formatAuthorErrors()` helper (cf. contracts/author-frontmatter.contract.md)
- [X] T006 [P] Créer `lib/content/resource.schema.ts` : enums (`RESOURCE_PERSONAS`, `RESOURCE_TYPES`, `ResourceStatusSchema`), schémas (`ResourceFrontmatterBaseSchema`, `GuideFrontmatterSchema`, `CaseStudyFrontmatterSchema`, `GlossaryFrontmatterSchema`), union discriminée `ResourceFrontmatterSchema`, helper `formatResourceErrors()` (cf. data-model.md §1-4 + contracts/resource-frontmatter.contract.md)

### Loaders contenu (contracts/content-loader.contract.md)

- [X] T007 [US? FOUND] Créer `lib/content/authors.ts` : `loadAuthors()`, `getAuthor(slug)`, `getAllAuthorSlugs()`, cache process-level, fail-fast sur frontmatter invalide. Dépend de T005.
- [X] T008 [US? FOUND] Créer `lib/content/resources.ts` : `loadResources()`, `getAllResources()`, `getResourceBySlug(type, slug)`, `getResourcesByAuthor(slug)`, `filterResources(filter)`, `getStaticResourceParams()`, cache process-level, politique d'environnement (draft visible en preview/dev, masqué en prod). Dépend de T006, T004.
- [X] T009 [US? FOUND] Ajouter `validateResourceCatalog(resources, authors)` dans `lib/content/resources.ts` : enforce les règles cross-références de data-model.md §7. Appelée une fois après chargement initial. Dépend de T007, T008.

### Tests unitaires foundation (TDD recommandé — écrire avant l'implémentation T004-T009)

- [X] T010 [P] [US? FOUND] Tests Vitest `tests/unit/reading-time.test.ts` : retourne `{minutes, words, text}` ; texte en français ; mots/min ≈ 220 ; minimum 1 min. Cible T004.
- [X] T011 [P] [US? FOUND] Tests Vitest `tests/unit/author.schema.test.ts` : frontmatter valide accepté ; chaque contrainte rejette avec message lisible ; `formatAuthorErrors()` produit un message identifiant fichier+champ+règle (pas de Zod brut). Cible T005.
- [X] T012 [P] [US? FOUND] Tests Vitest `tests/unit/resource.schema.test.ts` : union discriminée résout correctement ; chaque sous-type valide ses champs propres ; FK auteur regex respectée ; helpers `isValidModuleSlug`/`personasNeedAutoCleaning`/`autoCleanPersonas`. Cible T006.
- [X] T013 [P] [US? FOUND] Tests Vitest `tests/unit/authors-loader.test.ts` : charge via dossiers temporaires (`mkdtempSync`), cache hit, fail-fast sur frontmatter invalide, slug mismatch rejeté. Cible T007.
- [X] T014 [P] [US? FOUND] Tests Vitest `tests/unit/resources-loader.test.ts` : charge via dossiers temporaires, filtre selon env (`process.env.VERCEL_ENV`), tri par `publishedAt` desc, slug+type mismatch rejeté, cross-références (auteur inexistant, related inexistant, module inconnu, updatedAt<publishedAt) erreur lisible, auto-clean personas. Cible T008+T009.

### Builder JSON-LD Person (contracts/jsonld-outputs.contract.md §6)

- [X] T015 [US? FOUND] Étendre `lib/seo/jsonld.ts` avec `buildPerson(input: PersonInput)` exporté. Cf. data-model.md §10 + contracts/jsonld-outputs.contract.md §6.
- [X] T016 [P] [US? FOUND] Tests Vitest `tests/unit/jsonld-person.test.ts` : forme du payload, gestion optionnels (image, sameAs), URL absolutisée. Cible T015.

**Checkpoint** : `pnpm typecheck` + `pnpm test:unit` verts. Foundation prête. Les user stories peuvent démarrer (en parallèle si plusieurs devs).

---

## Phase 3: User Story 1 — Capter un visiteur amont via une ressource SEO (Priority: P1) 🎯 MVP

**Goal** : un visiteur arrivant depuis Google sur une URL `/ressources/{type}/{slug}` voit une page complète (titre, auteur cliquable, dates, reading time, corps, CTA), avec balises SEO + JSON-LD `Article` + `BreadcrumbList` + `FAQPage` (si frontmatter `faq`), et la ressource est référencée dans le sitemap.

**Independent Test** : publier UN seul guide à `/ressources/guides/{slug}`, vérifier que :
- la page rend correctement (Lighthouse mobile ≥ 85)
- `curl /ressources/guides/{slug}` retourne 200 avec balises SEO et JSON-LD complets
- Google Rich Results Test ne lève pas d'erreur
- `/sitemap.xml` inclut l'URL
- un CTA visible pointe vers `/demander-demo` ou un module

### Composants UI partagés ressources

- [X] T017 [P] [US1] Créer `components/ressources/ResourceMeta.tsx` : Server Component affichant auteur (lien cliquable vers `/auteurs/{slug}`), date publication + date mise à jour si différente, reading time. Props : `frontmatter`, `author`, `readingTime`.
- [X] T018 [P] [US1] Créer `components/ressources/RelatedResources.tsx` : Server Component listant les `relatedRessources` résolues (filtre draft/deprecated en silence) contre `getAllResources()`, 2-4 cartes.
- [X] T019 [P] [US1] Créer `components/ressources/DeprecatedBanner.tsx` : Server Component, bandeau ambré "Ressource archivée".

### Route détail ressource (3 types — mécanique commune)

- [X] T020 [US1] Créer `app/(marketing)/ressources/[type]/[slug]/page.tsx` : Server Component avec `generateStaticParams` (depuis `getStaticResourceParams`), `generateMetadata` (via `buildMetadata` + frontmatter), `notFound()` si slug/type invalides. Layout adapté par type. Injecte JSON-LD `[BreadcrumbList, Article, (FAQPage)]` via `<JsonLd />`. Rendu MDX via `resourceMdxComponents`.
- [X] T021 [US1] Créer `app/(marketing)/ressources/[type]/[slug]/opengraph-image.tsx` : `ImageResponse` 1200×630, badge type + titre + auteur. Pattern identique à `modules/[slug]/opengraph-image.tsx`. Override possible via `frontmatter.seo.ogImage`.

### Sitemap dynamique

- [X] T022 [US1] Étendre `app/sitemap.ts` : ajouter les routes `/ressources/{type}/{slug}` pour les ressources `published` (publishedAt ≤ now), `lastModified` = `updatedAt ?? publishedAt`, `priority` 0.5 (0.3 si `deprecated`).

### Premier guide MVP (contenu)

- [X] T023 [US1] Créer `content/auteurs/equipe-ecoledigitale.mdx` — auteur « équipe éditoriale » (honnête pour du contenu collectif), frontmatter valide + bio.
- [X] T024 [US1] Créer `content/ressources/guides/digitaliser-institut-bts.mdx` : guide pilier persona `lycee-bts`, ~1200 mots, FAQ à 3 entrées (exerce le JSON-LD FAQPage), liens internes vers `/modules/parcours-bts` et `/demander-demo`.

### Tests US1

- [X] T025 [P] [US1] Étendre `tests/e2e/seo.spec.ts` (describe "SEO — JSON-LD structured data") : test "une page guide contient Article + BreadcrumbList + FAQPage".
- [X] T026 [P] [US1] Étendre `tests/e2e/seo.spec.ts` : ajouter `/ressources/guides/digitaliser-institut-bts` au tableau `MVP_ROUTES`.
- [X] T027 [P] [US1] Étendre `tests/e2e/seo-infra.spec.ts` : vérifie que `/sitemap.xml` inclut une URL `/ressources/guides/`.
- [X] T028 [P] [US1] Étendre `tests/lighthouse/lighthouserc.json` : ajouter l'URL du guide aux assertions, gate ≥ 85 mobile.
- [X] T028b [US1] Implémenter l'event Plausible `Resource CTA Clicked` (`components/ressources/ResourceCTA.tsx`, client) — propage `resourceType`, `resourceSlug`, `ctaTarget`, `sourcePage`. Event ajouté à `lib/analytics/events.ts`. Cf. research.md R-008 + Constitution V.

**Checkpoint US1** : `pnpm test:unit && pnpm test:e2e -- seo && pnpm test:lighthouse` verts. Le premier guide est en ligne, indexable, et la mécanique de rendering supporte les 3 types (testée en US5 et US-glossaire). 🎯 MVP livré.

---

## Phase 4: User Story 2 — Publier sans intervention du dev frontend (Priority: P2)

**Goal** : un éditeur technique ajoute un fichier `.mdx` valide → ressource publiée. Aucun `.ts`/`.tsx` à toucher. Erreurs de build lisibles.

**Independent Test** : cloner le guide T024, modifier le slug et le frontmatter, lancer `pnpm typecheck && pnpm dev`, vérifier que la nouvelle ressource apparaît dans `/ressources` (US3 requis pour le hub, mais individuel URL accessible). Soumettre intentionnellement un frontmatter invalide (champ manquant) → message d'erreur identifie fichier + champ + règle, pas de Zod brut.

### Brief éditorial et templates

- [X] T029 [US2] Créer `content/ressources/_TEMPLATE-BRIEF.md` (vue d'ensemble, checklist publication, schéma frontmatter complet, structure recommandée par type, bonnes pratiques rédactionnelles, tests locaux, après-merge, dépréciation).
- [X] T030 [US2] Créer `content/ressources/guides/_TEMPLATE-GUIDE.mdx`, `content/ressources/etudes-de-cas/_TEMPLATE-CASE-STUDY.mdx`, `content/ressources/glossaire/_TEMPLATE-GLOSSAIRE.mdx` : squelettes MDX prêts à copier, frontmatter d'exemple valide + commentaires de guidage + sections H2 typiques (ignorés par le loader car préfixés `_` — confirmé au build).

### Messages d'erreur lisibles

- [X] T031 [US2] Améliorer `humanizeZodIssue()` (partagé par `formatResourceErrors`/`formatAuthorErrors`) : ajout du cas `invalid_union_discriminator` (type de ressource inconnu). Couvre `too_small`, `too_big`, `invalid_type`, `invalid_enum_value`, `invalid_string`/regex, `invalid_union_discriminator`, `custom`.
- [X] T032 [P] [US2] Tests Vitest `tests/unit/resource-error-messages.test.ts` (13 cas) : chaque catégorie d'erreur Zod produit un message lisible identifiant fichier+champ+règle, sans payload Zod brut.

### Documentation cycle PR

- [X] T033 [US2] Mettre à jour `README.md` : section "Publier une ressource" pointant vers `content/ressources/_TEMPLATE-BRIEF.md` et `specs/002-hub-ressources/quickstart.md`.

**Checkpoint US2** : le brief éditorial existe, les templates sont en place, les erreurs Zod sont lisibles. Un nouvel éditeur peut publier sa première ressource en ≤ 2h (SC-009).

---

## Phase 5: User Story 3 — Naviguer le hub avec filtres persona et type (Priority: P3)

**Goal** : `/ressources` liste les ressources publiées avec filtres serveur (`?persona=…&type=…`), sans JS client.

**Independent Test** : publier 5+ ressources (mix types/personas via Phase 5/7/8), charger `/ressources`, filtrer, vérifier que la liste se réduit correctement, que l'URL reflète l'état, que l'absence de résultat affiche un message explicite. Lighthouse mobile ≥ 85 sur le hub.

### Composants UI hub

- [X] T034 [P] [US3] Créer `components/ressources/ResourceCard.tsx` : Server Component. Affiche badge type, titre, extrait (description), badges personas, date, reading time. Carte cliquable vers `/ressources/{type}/{slug}`. + `RESOURCE_PERSONA_LABELS`.
- [X] T035 [P] [US3] Créer `components/ressources/ResourceFilters.tsx` : Server Component avec `<form method="GET" action="/ressources">`, `<select name="persona">` et `<select name="type">`, bouton submit + lien "Réinitialiser" si filtre actif. Pas de `"use client"`. Cf. research.md R-002.
- [X] T036 [P] [US3] Créer `components/ressources/EmptyState.tsx` : Server Component. Variant "no-results" (effacer filtre) et "hub-empty" ("Le hub se construit" + CTA démo). FR-005.

### Route hub

- [X] T037 [US3] Créer `app/(marketing)/ressources/page.tsx` : Server Component avec `searchParams` props, `filterResources({persona, type})`, rendu `<ResourceFilters>` + grille `<ResourceCard>` + `<EmptyState>` fallback. `metadata` statique avec canonical sans paramètres. Injecte `<JsonLd>` BreadcrumbList.
- [X] T038 [US3] Créer `app/(marketing)/ressources/opengraph-image.tsx` : OG image statique du hub.

### Sitemap : page hub

- [X] T039 [US3] Étendre `app/sitemap.ts` : ajouter `/ressources` (hub) à la liste statique, `priority` 0.7, `changeFrequency: 'weekly'`. Les filtres ne sont PAS dans le sitemap (un seul canonical).

### Tests US3

- [X] T040 [P] [US3] Créer `tests/e2e/ressources-hub.spec.ts` : 8 cas — listing, présence des filtres, filtre persona, filtre type, combinaison, état vide (no-results), type vide, lien Réinitialiser.
- [X] T041 [P] [US3] Étendre `tests/e2e/seo.spec.ts` : ajouter `/ressources` au tableau MVP_ROUTES.
- [X] T042 [P] [US3] Étendre `tests/e2e/seo-infra.spec.ts` : vérifie que `/sitemap.xml` inclut `/ressources` (la page hub).
- [X] T043 [US3] Étendre `tests/lighthouse/lighthouserc.json` : ajouter `/ressources` aux assertions, gate ≥ 85 mobile.

**Checkpoint US3** : le hub est navigable, les filtres fonctionnent sans JS client, gate Lighthouse OK.

---

## Phase 6: User Story 4 — Crédibilité éditoriale via pages auteurs (Priority: P3)

**Goal** : chaque auteur référencé a une page `/auteurs/{slug}` avec bio, expertise, liste des ressources signées, et JSON-LD `Person` valide.

**Independent Test** : visiter `/auteurs/{slug}` d'un auteur existant (créé en T023). Vérifier nom, fonction, bio, expertise affichés, liste des ressources signées (au moins 1), JSON-LD `Person` présent et valide via curl + jq.

### Composants UI auteurs

- [X] T044 [P] [US4] Créer `components/auteurs/AuthorBio.tsx` : Server Component. Avatar (photo ou initiales), nom (H1), fonction, lien LinkedIn, bio, chips expertise, corps MDX (bio longue) optionnel. + `AuthorAvatar.tsx` partagé.
- [X] T045 [P] [US4] Créer `components/auteurs/AuthorCard.tsx` : Server Component. Encadré « À propos de l'auteur » utilisé en pied des pages ressources (renfort E-E-A-T), lien vers `/auteurs/{slug}`.

### Route page auteur

- [X] T046 [US4] Créer `app/(marketing)/auteurs/[slug]/page.tsx` : Server Component avec `generateStaticParams` (`getAllAuthorSlugs`), `generateMetadata`, `notFound()` si slug inconnu. Ressources signées via `getResourcesByAuthor`. Rend `<AuthorBio>` + section "Ressources signées" (grid `<ResourceCard>`). Injecte `<JsonLd>` `[BreadcrumbList, Person]`.
- [X] T047 [US4] Créer `app/(marketing)/auteurs/[slug]/opengraph-image.tsx` : OG image nom + fonction + marque (photo non embarquée — MVP sans photos, cohérent avec les OG modules).

### Sitemap : pages auteur

- [X] T048 [US4] Étendre `app/sitemap.ts` : ajouter `/auteurs/{slug}` pour les auteurs ayant ≥1 ressource publiée, `priority: 0.4`.

### Tests US4

- [X] T049 [P] [US4] Étendre `tests/e2e/seo.spec.ts` : test "une page auteur contient Person + BreadcrumbList" (`/auteurs/equipe-ecoledigitale`).
- [X] T050 [P] [US4] Étendre `tests/lighthouse/lighthouserc.json` : ajouter `/auteurs/equipe-ecoledigitale` aux assertions, gate ≥ 85 mobile.

**Checkpoint US4** : signal EAT en place, JSON-LD `Person` validé, pages auteur accessibles.

---

## Phase 7: User Story 5 — Étude de cas template (Priority: P3)

**Goal** : un template d'étude de cas (avec données fictives clairement identifiées) est publié, suit la structure attendue (contexte → défi → solution → résultats → témoignage), expose un CTA vers `/demander-demo`.

**Independent Test** : visiter l'URL de l'étude template. Vérifier (1) bandeau "Exemple illustratif — données fictives" visible, (2) sections présentes dans l'ordre, (3) modules activés mentionnés correspondent à `MODULE_SLUGS`, (4) JSON-LD `Article` avec `disambiguatingDescription`, (5) CTA cliquable vers `/demander-demo`.

### Composant spécifique études de cas

- [X] T051 [P] [US5] Créer `components/ressources/FictionalCaseBanner.tsx` : Server Component, bandeau info (icône lucide `Info`) affiché si `isFictional`.
- [X] T052 [P] [US5] Créer `components/ressources/CaseStudyAside.tsx` : Server Component, encadré "En bref" — établissement, profil, modules activés (chips cliquables vers `/modules/{slug}`, libellés = noms de modules réels).

### Adapter la route détail au type études de cas

- [X] T053 [US5] Étendre `app/(marketing)/ressources/[type]/[slug]/page.tsx` : extraction typée `caseStudyFm` ; injection `<FictionalCaseBanner>` (si `isFictional`) + `<CaseStudyAside>`. `buildArticle` étendu avec `disambiguatingDescription` (ajouté à `ArticleInput`), renseigné quand `isFictional`.

### Validation cross-références modules

- [X] T054 [US5] Règle déjà implémentée en Phase 2 (dans `validateResourceCatalog`, T009) : `caseStudy.modulesActivated` validés contre `MODULE_SLUGS`, erreur lisible « module activé inconnu » sinon.
- [X] T055 [P] [US5] Test déjà présent en Phase 2 (`resources-loader.test.ts` : « échoue si une étude de cas active un module inconnu »).

### Contenu MVP : étude de cas template

- [X] T056 [US5] Créer `content/ressources/etudes-de-cas/exemple-institut-bts.mdx` — `isFictional: true`, établissement fictif « Institut Bellevue », modules `socle-ecoledigitale` + `parcours-bts`, structure contexte → défi → solution → résultats → témoignage, lien `relatedRessources` vers le guide.

### Tests US5

- [X] T057 [P] [US5] Étendre `tests/e2e/ressources-hub.spec.ts` : 3 cas — bandeau `FictionalCaseBanner` visible, JSON-LD `Article` avec `disambiguatingDescription`, CTA vers `/demander-demo`.

**Checkpoint US5** : pattern études de cas validé, prêt à être instancié avec un vrai client une fois disponible.

---

## Phase 8: Glossaire (contenu MVP, transverse — couvre FR-009 et SC-001)

**Goal** : 5 entrées glossaire publiées, valide le pattern de type "court" (max 500 mots), accessibles via URL directe et via le hub avec filtre `type=glossaire`.

**Independent Test** : visiter `/ressources/glossaire/{slug}` pour chaque entrée. Vérifier corps < 500 mots, JSON-LD `Article` présent, encadré "Voir aussi" liste les `relatedRessources`.

> **Note** : pas de US dédiée dans la spec (la mécanique de rendu utilise la route partagée T020). Le glossaire est livré ici pour atteindre SC-001 (20+ ressources à 6 mois) et compléter les livrables MVP.

- [X] T058 [GLOSS] Layout glossaire déjà livré par la route partagée (T020) : titre = `term`, sous-titre = `shortDefinition`, corps prose-style, section « Voir aussi » (`RelatedResources`), CTA discret. Warning build > 500 mots déjà couvert par `validateResourceCatalog` (T009). Aucun code supplémentaire nécessaire.
- [X] T059 [GLOSS] Créer 5 entrées `content/ressources/glossaire/{lms,bts,alternance,referentiel-rncp,qualiopi}.mdx`. Frontmatter complet, corps ~150-220 mots, `relatedRessources` croisées entre glossaire, guide et étude de cas (maillage bidirectionnel — le guide a aussi été enrichi de related vers le glossaire).

**Checkpoint Glossaire** : 5 entrées en ligne, maillage interne effectif.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose** : finitions, monitoring, validation manuelle.

- [X] T060 [P] Créer `tests/fixtures/ressources/` et `tests/fixtures/auteurs/` avec au moins 3 fichiers MDX valides et 3 invalides (un par catégorie d'erreur) pour les tests unitaires des loaders.
- [X] T061 [P] Compléter le deuxième guide MVP (selon priorisation métier — cf. spec : "2 guides piliers couvrant les 2 personas les plus stratégiques").
- [ ] T062 Lancer le script de validation manuelle : pour chaque type, prendre 1 URL en production (après déploiement) et la valider sur https://search.google.com/test/rich-results. Zéro erreur attendu, warnings tolérés.
- [X] T063 [P] Lancer `pnpm test:lighthouse` complet sur les nouvelles routes ; documenter les scores réels dans un commentaire de PR ou dans `docs/lighthouse-report-002.md`.
- [X] T064 [P] Vérifier que `pnpm test:a11y` (axe-core) passe sur `/ressources`, `/ressources/guides/{slug}`, `/auteurs/{slug}` — 0 violation critical/serious.
- [X] T065 Mettre à jour `docs/deployment.md` : ajouter section "Variables d'environnement spécifiques au hub /ressources" (aucune nouvelle au MVP, mais documenter pour clarté).
- [~] T066 **DÉPLACÉ vers T028b en Phase 3 US1** (cf. fix C1 du `/speckit-analyze` 2026-05-19 : l'event analytics doit être présent dès le MVP pour satisfaire Constitution Principe V et permettre la mesure de SC-006).
- [X] T067 Parcourir intégralement `specs/002-hub-ressources/quickstart.md` (procédure dev local) sans regarder le code pour valider qu'un nouveau développeur peut s'y retrouver. Corriger les manques.

---

## Dependencies & Execution Order

### Phase Dependencies (haut niveau)

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOQUANT pour toutes les US
    ↓
    ├── Phase 3 (US1 — MVP) ─────────────┐
    ├── Phase 4 (US2)                    │
    ├── Phase 5 (US3) ←──── nécessite ≥ 2 ressources publiées
    ├── Phase 6 (US4)                    │
    ├── Phase 7 (US5)                    │
    └── Phase 8 (Glossaire) ─────────────┘
                                         ↓
                                Phase 9 (Polish)
```

### User Story Dependencies

- **US1 (P1)** : démarre dès Phase 2 done. Aucune dépendance sur autres US.
- **US2 (P2)** : démarre dès Phase 2 done. Recouvrement T029-T033 indépendant du code. Peut se faire en parallèle de US1.
- **US3 (P3)** : démarre dès Phase 2 done **MAIS** test indépendant nécessite que ≥ 1 ressource soit publiée (sortie de US1 T024 ou contenu fixture).
- **US4 (P3)** : démarre dès Phase 2 done. Le test indépendant exige qu'au moins 1 auteur ait ≥ 1 ressource (T023+T024 de US1).
- **US5 (P3)** : démarre dès Phase 2 done. Étend la route partagée de US1 (T020) — soit US1 done, soit travail isolé dans un composant qu'on intègre ensuite.
- **Phase 8 Glossaire** : étend T020 de US1. Idem US5.

### Au sein d'une user story

- Tests unitaires (Phase 2) à écrire AVANT l'implémentation correspondante.
- Composants ([P]) en parallèle quand fichiers différents.
- Routes (`page.tsx`, `opengraph-image.tsx`) après les composants qu'elles consomment.
- Sitemap après les routes qu'il référence.
- Tests E2E après que la route correspondante est implémentée.

### Parallel Opportunities

- **Phase 1** : T002 et T003 en parallèle.
- **Phase 2** : T004, T005, T006 en parallèle (schémas indépendants). Puis T007/T008 séquentiel. Tests T010-T016 [P] tous en parallèle.
- **Phase 3 (US1)** : T017-T019 (composants) en parallèle. T025-T028 (tests) en parallèle.
- **Phase 4 (US2)** : T030 + T032 + T033 en parallèle après T029.
- **Phase 5 (US3)** : T034-T036 en parallèle. T040-T043 en parallèle.
- **Phase 6 (US4)** : T044-T045 en parallèle. T049-T050 en parallèle.
- **Phase 7 (US5)** : T051-T052 + T055 en parallèle.
- **Phase 9 (Polish)** : la majorité en [P].

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Sprint 1 : schémas Zod en parallèle (3 développeurs ou 1 dev en 1 jour)
Task T004: Créer lib/content/reading-time.ts
Task T005: Créer lib/content/author.schema.ts
Task T006: Créer lib/content/resource.schema.ts

# Sprint 2 : tests unitaires en parallèle après les schémas
Task T010: tests/unit/reading-time.test.ts
Task T011: tests/unit/author.schema.test.ts
Task T012: tests/unit/resource.schema.test.ts

# Sprint 3 : loaders (séquentiel)
Task T007: lib/content/authors.ts (dépend T005)
Task T008: lib/content/resources.ts (dépend T006, T004)
Task T009: validateResourceCatalog (dépend T007, T008)

# Sprint 4 : tests loaders + builder Person en parallèle
Task T013: tests/unit/authors-loader.test.ts
Task T014: tests/unit/resources-loader.test.ts
Task T015: lib/seo/jsonld.ts — buildPerson
Task T016: tests/unit/jsonld-person.test.ts (dépend T015)
```

---

## Parallel Example: User Story 1

```bash
# Composants UI ressources (parallèle)
Task T017: components/ressources/ResourceMeta.tsx
Task T018: components/ressources/RelatedResources.tsx
Task T019: components/ressources/DeprecatedBanner.tsx

# Route + OG image (séquentiel, T020 dépend des composants ci-dessus)
Task T020: app/(marketing)/ressources/[type]/[slug]/page.tsx
Task T021: app/(marketing)/ressources/[type]/[slug]/opengraph-image.tsx

# Sitemap (peut être fait en parallèle de T020/T021)
Task T022: app/sitemap.ts (ajout ressources)

# Contenu (parallèle, indépendant du code)
Task T023: content/auteurs/marie-dupont.mdx
Task T024: content/ressources/guides/{premier-slug}.mdx

# Tests (parallèle, après le code)
Task T025: tests/e2e/seo.spec.ts (ext.)
Task T026: tests/e2e/seo.spec.ts (MVP_ROUTES)
Task T027: tests/e2e/seo-infra.spec.ts (ext.)
Task T028: tests/lighthouse/lighthouserc.json (ext.)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (Setup) — 30 min
2. Phase 2 (Foundational) — **1-2 jours** (le gros du travail technique)
3. Phase 3 (US1) — 1 jour avec T023+T024 contenu déjà rédigé (ou +1 jour si le contenu reste à produire)
4. **STOP & VALIDATE** : `pnpm build && pnpm start`, parcourir `/ressources/guides/{slug}`, soumettre à Google Rich Results Test.
5. Déployer en preview Vercel, vérifier Lighthouse mobile ≥ 85.
6. Si OK → déploiement production. Le hub MVP est en ligne avec 1 ressource. Google commence à indexer.

**Effort estimé MVP** : ~3 jours dev + ~2 jours rédaction du premier guide pilier = **1 semaine**.

### Incremental Delivery

| Sprint | Phases | Livrable visible |
|---|---|---|
| 1 | Phase 1 + 2 + 3 (US1) | 1 guide en ligne, indexable |
| 2 | Phase 4 (US2) + 1 guide supplémentaire | Brief éditorial + 2 guides |
| 3 | Phase 5 (US3) + Phase 8 (Glossaire) | Hub navigable + 5 glossaire |
| 4 | Phase 6 (US4) | Pages auteur |
| 5 | Phase 7 (US5) + Phase 9 (Polish) | Étude de cas template + monitoring |

### Parallel Team Strategy

Avec 2 développeurs en parallèle après Phase 2 :

- **Dev A** : US1 (P1) → US5 (P3, étude de cas)
- **Dev B** : US2 (P2) → US3 (P3, hub+filtres) → US4 (P3, auteurs)

Synchronisation : la route partagée `[type]/[slug]/page.tsx` (T020 US1) doit être stabilisée avant que US5 ou Glossaire ne l'étendent. Préférer terminer US1 avant.

---

## Récapitulatif

- **Total tâches actives** : 67 (T066 marqué déplacé → remplacé par T028b en Phase 3 US1)
- **Par phase** : Phase 1 = 3 · Phase 2 = 13 · Phase 3 US1 = **13** (T017-T028b) · Phase 4 US2 = 5 · Phase 5 US3 = 10 · Phase 6 US4 = 7 · Phase 7 US5 = 7 · Phase 8 Glossaire = 2 · Phase 9 Polish = **7** (T066 déplacé)
- **Par US** : US1 = **13** · US2 = 5 · US3 = 10 · US4 = 7 · US5 = 7 (sur tâches étiquetées story uniquement)
- **Parallélisables [P]** : ~35 tâches (~52%)
- **MVP minimum** : Phase 1 + 2 + 3 = **29 tâches** (~1 semaine effort dev)
- **Independent test critères** : un par user story, documentés dans chaque Phase
- **Format validation** : toutes les tâches suivent `- [ ] T### [P?] [Story?] Description avec chemin`

### Amendements post-`/speckit-analyze` (2026-05-19)

| Issue | Action | Tâches affectées |
|---|---|---|
| **F1** (250 vs 220 wpm) | spec.md FR-024 amendé (aligné sur 220 wpm de research R-001) | T004, T010 |
| **F2** (sitemap deprecated) | spec.md FR-023 amendé (deprecated reste avec priority 0.3) | T022 |
| **C1** (event analytics en retard) | T066 déplacé → T028b (Phase 3 US1, bloque checkpoint US1) | T028b (nouveau), T066 (déplacé) |

---

## Notes

- [P] tâches = fichiers différents, pas de dépendance sur une tâche incomplète.
- Phase 2 foundational utilise `[US? FOUND]` pour signaler "blocking prerequisites" (compromis lisibilité — le template impose [USx] ou rien, "FOUND" est une étiquette informelle pour cette phase).
- Tests E2E supposent que le dev server tourne en local ; en CI, `playwright.config.ts` les démarre automatiquement.
- Commit après chaque sous-phase logique (pas chaque tâche) pour garder un historique git lisible.
- Stop aux checkpoints pour valider les US indépendamment avant de poursuivre.
- À éviter : tâches vagues, conflits de fichier entre tâches simultanées, dépendances cross-story qui cassent l'indépendance.
