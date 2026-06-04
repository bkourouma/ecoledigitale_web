---

description: "Tâches actionnables pour l'implémentation du site marketing EcoleDigitale"
---

# Tasks: Site marketing EcoleDigitale

**Input** : Design documents from [specs/001-site-marketing/](.)

**Prerequisites** : [plan.md](plan.md) ✅, [spec.md](spec.md) ✅, [research.md](research.md) ✅, [data-model.md](data-model.md) ✅, [contracts/](contracts/) ✅

**Tests** : INCLUS. La Constitution (Principe IV) impose des gates testables (SEO meta, a11y, Lighthouse ≥ 85). Les tests sont donc traités comme exigences fonctionnelles, pas optionnels.

**Organization** : Les tâches sont regroupées par user story pour permettre une livraison incrémentale et un test indépendant de chaque story.

## Format

`[ID] [P?] [Story?] Description avec chemin de fichier`

- **[P]** : exécutable en parallèle (fichiers différents, pas de dépendance bloquante).
- **[Story]** : appartient à une user story (US1..US4) ; absent en Setup, Foundational et Polish.
- Tous les chemins sont relatifs à la racine du repo `D:\Ecoledigitale_web\`.

## Stack & Path conventions

- Application Next.js 15 single-package au root du repo.
- Routes dans `app/`, composants dans `components/`, contenu MDX dans `content/`, librairies dans `lib/`, tests dans `tests/`.
- Voir [plan.md § Project Structure](plan.md#project-structure) pour l'arborescence complète.

---

## Phase 1 : Setup (Infrastructure partagée)

**Purpose** : initialiser le projet Next.js, les outils qualité et l'environnement.

- [x] T001 Initialiser le projet Next.js 15 + TypeScript + Tailwind à la racine via `pnpm create next-app .` avec options App Router + TS + Tailwind + ESLint dans `D:\Ecoledigitale_web\` *(scaffolding manuel pour éviter les prompts interactifs et préserver `specs/`, `docs/`, `.specify/`)*
- [x] T002 [P] Configurer TypeScript en mode strict avec path aliases (`@/*`) dans `tsconfig.json`
- [x] T003 [P] Configurer ESLint + Prettier (config Next.js + règles a11y `eslint-plugin-jsx-a11y`) dans `.eslintrc.json` et `.prettierrc`
- [x] T004 [P] Configurer Tailwind 4 avec tokens custom (couleurs marque, typographie, spacings) dans `tailwind.config.ts`
- [x] T005 [P] Créer `.env.example` documentant `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `RATE_LIMIT_ENABLED`
- [x] T006 Ajouter les dépendances runtime via pnpm : `zod`, `resend`, `@next/mdx`, `next-mdx-remote`, `gray-matter`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, `clsx`, `tailwind-merge`, `@vercel/analytics` dans `package.json`
- [x] T007 [P] Ajouter les dépendances dev : `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `husky`, `lint-staged` dans `package.json` (devDependencies)
- [x] T008 [P] Configurer Vitest dans `vitest.config.ts` avec environnement `jsdom` et alias `@/`
- [x] T009 [P] Configurer Playwright dans `playwright.config.ts` (baseURL `http://localhost:3000`, projets Chromium + WebKit mobile, reporter HTML)
- [x] T010 [P] Configurer Lighthouse CI dans `tests/lighthouse/lighthouserc.json` (gate Performance ≥ 85 mobile sur les 8 routes MVP)
- [x] T011 [P] Activer le support MDX dans `next.config.mjs` (`pageExtensions: ['ts','tsx','md','mdx']`) et créer `mdx-components.tsx` à la racine
- [x] T012 [P] Configurer husky + lint-staged dans `package.json` (hook pre-commit : `pnpm lint` + `pnpm typecheck` sur fichiers stagés)
- [x] T013 Ajouter les scripts npm dans `package.json` : `dev`, `build`, `start`, `lint`, `typecheck`, `test:unit`, `test:e2e`, `test:e2e:ui`, `test:a11y`, `test:lighthouse`

**Checkpoint** : `pnpm dev` démarre le serveur, `pnpm typecheck` passe sans erreur, projet vide mais structuré.

---

## Phase 2 : Foundational (Prérequis bloquants)

**Purpose** : librairies, schémas, layouts et primitives UI partagés par toutes les user stories.

**⚠️ CRITICAL** : aucune user story ne peut commencer avant la complétion de cette phase.

### Schémas et types (Zod)

- [x] T014 Créer le schéma Zod `Lead` dans `lib/leads/lead.schema.ts` selon [data-model.md § 2 Lead](data-model.md#2-lead-demande-de-démonstration) (tous les champs requis + optionnels + règles de validation)
- [x] T015 [P] Créer le schéma Zod `Module` dans `lib/content/module.schema.ts` selon [contracts/module-content.contract.md](contracts/module-content.contract.md) (frontmatter + règles cross-modules)
- [x] T016 [P] Créer le catalogue d'événements typés dans `lib/analytics/events.ts` selon [contracts/analytics-events.contract.md](contracts/analytics-events.contract.md) (type `EventMap`)

### Lead handling (couche serveur)

- [x] T017 Créer l'interface `LeadSink` dans `lib/leads/sinks/index.ts` selon [contracts/lead-sink.contract.md](contracts/lead-sink.contract.md)
- [x] T018 [P] Implémenter `ResendLeadSink` dans `lib/leads/sinks/resend.sink.ts` (SDK `resend`, template HTML + texte, sujet `[Demo] {institutionName} — {modules}`)
- [x] T019 [P] Implémenter `LogLeadSink` dans `lib/leads/sinks/log.sink.ts` (JSON structuré, masquage email/phone)
- [x] T020 Implémenter `handleLead()` orchestrateur dans `lib/leads/handler.ts` (Promise.allSettled, gestion `critical`, `correlationId`, `LeadDispatchError`)

### Content loading

- [x] T021 [P] Implémenter le loader MDX modules dans `lib/content/modules.ts` (lecture `content/modules/*.mdx`, parse frontmatter via `gray-matter`, validation Zod, tri par `order`, validation cross-modules)
- [x] T022 [P] Implémenter le helper SEO `buildMetadata(route)` dans `lib/seo/metadata.ts` (title, description, openGraph, twitter, canonical)
- [x] T023 [P] Implémenter le wrapper Plausible typé dans `lib/analytics/track.ts` selon [contracts/analytics-events.contract.md § Wrapper](contracts/analytics-events.contract.md)

### Layouts et primitives UI

- [x] T024 Créer le root layout dans `app/layout.tsx` (font Inter, viewport, script Plausible conditionnel, `@vercel/analytics` Web Vitals)
- [x] T025 [P] Créer `app/globals.css` avec directives Tailwind et tokens CSS custom
- [x] T026 Créer le layout marketing dans `app/(marketing)/layout.tsx` (header sticky + main + footer + ContactChannels + skip-link)
- [x] T027 [P] Créer `components/ui/Button.tsx` (variantes primary / secondary / ghost, tailles, accessible, focus-visible visible) + `ButtonLink`
- [x] T028 [P] Créer `components/ui/Input.tsx` (état `invalid`, classes focus-visible, support `aria-invalid`) + `Textarea`
- [x] T029 [P] Créer `components/ui/Select.tsx`
- [x] T030 [P] Créer `components/ui/Checkbox.tsx` (accessible label, état error)
- [x] T031 [P] Créer `components/ui/Card.tsx` (composant générique réutilisable, variante interactive)
- [x] T032 [P] Créer `components/marketing/StickyHeaderCTA.tsx` (header sticky avec logo + nav + CTA démo persistant + event `Demo CTA Clicked`)
- [x] T033 [P] Créer `components/marketing/Footer.tsx` (mentions légales, liens, ContactChannels intégré)
- [x] T034 [P] Créer `components/marketing/ContactChannels.tsx` (WhatsApp + Email + Téléphone — FR-017, events `Contact Channel Clicked`)
- [x] T035 [P] Créer `components/analytics/PlausibleScript.tsx` (server component, injection conditionnelle selon env)

### Contenu MDX seed

- [x] T036 [P] Créer `content/modules/socle-ecoledigitale.mdx` (frontmatter complet, body sections, conforme PRD §3.1)
- [x] T037 [P] Créer `content/modules/parcours-bts.mdx` conforme PRD §3.2
- [x] T038 [P] Créer `content/modules/parcours-superieur.mdx` conforme PRD §3.3
- [x] T039 [P] Créer `content/modules/proformation.mdx` conforme PRD §3.4
- [x] T040 [P] Créer `content/modules/campus-live.mdx` conforme PRD §3.5
- [x] T041 [P] Créer `content/home.mdx` (hero, promesse principale, sections selon PRD §7.1.1)
- [x] T042 [P] Créer `content/confidentialite.mdx` (mentions RGPD, FR-019)

### mdx-components

- [x] T043 Définir les composants MDX whitelistés dans `mdx-components.tsx` : `ModuleHero`, `ModuleBenefits`, `ModuleFeatures`, `ModuleAudiences`, `CalloutFinalCTA` (stubs Phase 2 ; implémentation complète en T071 Phase 4)

**Checkpoint** : `pnpm build` passe ; les schémas Zod sont prêts ; les 5 MDX module passent la validation cross-modules ; les primitives UI s'affichent dans Storybook ou page de test.

---

## Phase 3 : User Story 1 — Capter une demande de démo qualifiée (Priority: P1) 🎯 MVP

**Goal** : un visiteur arrive sur l'accueil, comprend l'offre, et soumet une demande de démo qualifiée. Email reçu par l'équipe commerciale.

**Independent Test** : déployer uniquement `/` + `/demander-demo` + `/api/leads`. Soumettre un formulaire valide → vérifier réception email + journalisation. Tester avec données invalides → vérifier messages d'erreur ciblés.

### Tests for User Story 1

- [x] T044 [P] [US1] Test unitaire schéma Lead dans `tests/unit/lead.schema.test.ts` (cas valides, chaque champ requis manquant, email invalide, téléphone vide, aucun module, consent false, honeypot)
- [x] T045 [P] [US1] Test unitaire dispatcher LeadSink dans `tests/unit/lead-handler.test.ts` (Resend OK / Log OK → 200, Resend KO + Log OK → throw critical, mocks)
- [x] T046 [P] [US1] Test unitaire ResendLeadSink dans `tests/unit/resend-sink.test.ts` (sujet correct, corps contient tous les champs, masquage absent dans l'email)
- [x] T047 [P] [US1] Test E2E formulaire démo dans `tests/e2e/demo-form.spec.ts` (soumission vide → erreurs, email invalide → erreur ciblée, aucun module → erreur, soumission valide → redirection /merci, double-clic → 1 seule requête)
- [x] T048 [P] [US1] Test E2E contrat API `/api/leads` dans `tests/e2e/api-leads.spec.ts` (200 valide, 400 validation, honeypot → 200 sans envoi, 429 si rate limit activé)

### Implementation for User Story 1

- [x] T049 [P] [US1] Créer `components/forms/FormField.tsx` (wrapper label + Input/Select/Checkbox + erreur, gestion `aria-describedby`)
- [x] T050 [P] [US1] Créer `components/forms/ModuleMultiSelect.tsx` (5 checkboxes générés depuis `lib/content/modules.ts`, validation ≥ 1, émet `Module Selected In Form`)
- [x] T051 [US1] Créer `components/forms/DemoRequestForm.tsx` (client component, react-hook-form + zodResolver, états loading/success/error, honeypot caché, submit POST `/api/leads`)
- [x] T052 [US1] Créer la route API `app/api/leads/route.ts` : POST handler conforme [contracts/demo-form.contract.md](contracts/demo-form.contract.md), validation Zod, honeypot, appel `handleLead()`, mapping erreurs en réponses 400/422/500
- [x] T053 [P] [US1] Implémenter le rate limiting in-memory dans `lib/leads/rate-limit.ts` (5/IP/h, activable via `RATE_LIMIT_ENABLED`, header `Retry-After`)
- [x] T054 [P] [US1] Créer le template email Resend dans `lib/leads/email/demo-notification.ts` (renderDemoNotification → {subject, html, text}, tous les champs lead, lien correlationId) — extension `.ts` finale au lieu de `.tsx` (pas de JSX nécessaire)
- [x] T055 [US1] Créer la page `app/(marketing)/demander-demo/page.tsx` (titre, intro, formulaire, aside ContactChannels + parcours en 3 étapes)
- [x] T056 [P] [US1] Créer la page de confirmation `app/(marketing)/demander-demo/merci/page.tsx` (message succès, CTAs retour, ContactChannels, noindex)
- [x] T057 [US1] Créer la page d'accueil `app/(marketing)/page.tsx` (hero avec promesse + 2 CTA, aperçu 5 modules en cartes synthétiques, CTA final brand-900)
- [x] T058 [P] [US1] Câbler l'event `Demo CTA Clicked` sur tous les CTA type=`demo` via `TrackedDemoCTA` (hero, header sticky, final) — `TrackedModulesCTA` complémentaire
- [x] T059 [P] [US1] Câbler les events `Demo Form Submitted` (succès) et `Demo Form Submission Failed` (erreur validation/réseau/serveur) dans `DemoRequestForm`
- [ ] T060 [US1] **À VALIDER côté utilisateur** : Lighthouse Performance mobile ≥ 85 sur `/` et `/demander-demo` (`pnpm build && pnpm test:lighthouse`)

**Checkpoint US1** : `/` + `/demander-demo` + `/api/leads` fonctionnels. Email reçu en ≤ 5 min. Events `Demo CTA Clicked` et `Demo Form Submitted` visibles dans Plausible (ou mock E2E). MVP livrable.

---

## Phase 4 : User Story 2 — Explorer chaque module (Priority: P2)

**Goal** : un responsable spécialisé accède directement à la page de son module et identifie en une lecture que ses besoins sont couverts.

**Independent Test** : naviguer vers chacune des 5 pages `/modules/<slug>` + `/modules` (vue comparative). Vérifier que chaque page module liste benefits, features, audiences, et présente un CTA démo cohérent.

### Tests for User Story 2

- [x] T061 [P] [US2] Test unitaire loader modules dans `tests/unit/modules-loader.test.ts` (5 modules retournés, tri par order, validation cross-modules détecte les violations, slug↔filename)
- [x] T062 [P] [US2] Test E2E pages module dans `tests/e2e/module-pages.spec.ts` (les 5 routes `/modules/<slug>` renvoient 200, contiennent h1 du module, benefits/features rendus, CTA démo présent et cliquable)
- [x] T063 [P] [US2] Test E2E page modules dans `tests/e2e/modules-overview.spec.ts` (table comparative avec 5 entrées, type socle distingué, CTA "Demander une offre modulée" présent)

### Implementation for User Story 2

- [x] T064 [P] [US2] Créer `components/marketing/Hero.tsx` (composant réutilisable accueil + pages module, props headline/tagline/cta)
- [x] T065 [P] [US2] Créer `components/marketing/ModuleCard.tsx` (carte synthétique d'un module : type, nom, tagline, lien)
- [x] T066 [P] [US2] Créer `components/marketing/ModulesGrid.tsx` (grille des 5 cartes pour aperçu accueil + page `/modules`)
- [x] T067 [P] [US2] Créer `components/marketing/ModulesCompareTable.tsx` (table comparative socle vs optionnels)
- [x] T068 [P] [US2] Créer `components/marketing/BenefitsByRole.tsx` (5 rôles avec icônes : direction, administration, enseignants, parents/étudiants, formateurs)
- [x] T069 [P] [US2] Créer `components/marketing/TrustBand.tsx` (4 trust signals : sécurité, multi-établissement, données centralisées, plateforme modulaire)
- [x] T070 [P] [US2] Créer `components/marketing/FinalCTA.tsx` (bandeau bas de page, CTA démo tracé)
- [x] T071 [P] [US2] Implémenter les composants MDX module dans `components/mdx/`: `ModuleHero.tsx`, `ModuleBenefits.tsx`, `ModuleFeatures.tsx`, `ModuleAudiences.tsx`, `CalloutFinalCTA.tsx` (consomment le frontmatter via closure dans `createModuleMdxComponents()`)
- [x] T072 [US2] Créer la page `app/(marketing)/modules/page.tsx` (hero + `ModulesGrid` + `ModulesCompareTable` + `FinalCTA` adapté offre modulée)
- [x] T073 [US2] Créer la route dynamique `app/(marketing)/modules/[slug]/page.tsx` avec `generateStaticParams()` retournant les 5 slugs, rendu via `MDXRemote` (next-mdx-remote/rsc) + composants module assemblés (Hero/Benefits/Features/Audiences/Body MDX/CalloutFinalCTA)
- [x] T074 [US2] Enrichir la page d'accueil `app/(marketing)/page.tsx` (ajout `TrustBand` après hero, `ModulesGrid` à la place de l'inline, `BenefitsByRole`, `FinalCTA`)

**Checkpoint US2** : 7 pages publiques livrables (`/`, `/modules`, 5 × `/modules/<slug>`). Chaque page module satisfait son scenario d'acceptation (cours+notes+paiements pour BTS, catalogue→session→inscription→paiement pour ProFormation, etc.).

---

## Phase 5 : User Story 3 — Mesurer le tunnel de conversion (Priority: P3)

**Goal** : tous les comportements clés du visiteur sont tracés dans Plausible avec des events typés couvrant à 100 % FR-013.

**Independent Test** : effectuer les actions clés (clic CTA démo, sélection module, soumission formulaire, clic WhatsApp/email/phone, navigation page module) et vérifier dans Plausible (ou via mocks E2E) l'émission des events attendus avec les bonnes propriétés.

### Tests for User Story 3

- [x] T075 [P] [US3] Test unitaire wrapper `track()` dans `tests/unit/track.test.ts` (no-op côté serveur, appel `window.plausible` côté client avec event+props typés — 6 cas couvrant tous les types d'events)
- [x] T076 [P] [US3] Helper de mock Plausible pour Playwright dans `tests/e2e/helpers/mock-plausible.ts` (`installPlausibleMock`, `getCapturedEvents`, `getEventsByName`, `clearCapturedEvents`)
- [x] T077 [P] [US3] Test E2E émission d'events dans `tests/e2e/analytics.spec.ts` (couvre Demo CTA Clicked × 2, Modules CTA Clicked × 2, Module Page Viewed × 2, Module Selected In Form × 2, Demo Form Submitted, Contact Channel Clicked, whitelist du catalogue)

### Implementation for User Story 3

- [x] T078 [P] [US3] Câbler l'event `Modules CTA Clicked` sur les CTA type=`modules` : hero accueil (déjà via `TrackedModulesCTA` en Phase 3) + cartes via nouveau `TrackedModuleLink` (placement=`card`)
- [x] T079 [P] [US3] Câbler l'event `Module Page Viewed` dans `app/(marketing)/modules/[slug]/page.tsx` via le composant client `<ModulePageView moduleSlug={slug} />` monté en début de page
- [x] T080 [P] [US3] Câbler l'event `Module Selected In Form` dans `components/forms/ModuleMultiSelect.tsx` à chaque toggle ON *(déjà fait en Phase 3 T050)*
- [x] T081 [P] [US3] Câbler l'event `Contact Channel Clicked` dans `components/marketing/ContactChannels.tsx` (whatsapp / email / phone, props `placement`) *(déjà fait en Phase 2 T034)*
- [x] T082 [P] [US3] Câbler l'event `Brochure Requested` dans `components/marketing/BrochureCallout.tsx` — composant stub disponible (pas monté au MVP) émettant l'event au clic, préparation Phase 2
- [x] T083 [P] [US3] Documenter la console Plausible dans `docs/analytics-runbook.md` (catalogue + golden path check-list + métriques + dépannage)

**Checkpoint US3** : les 8 events du catalogue [analytics-events.contract.md](contracts/analytics-events.contract.md) sont émis aux endroits prévus. Couverture FR-013 = 100 %. Dashboard Plausible visible pour pilotage SC-001/SC-003/SC-007.

---

## Phase 6 : User Story 4 — Être trouvé via la recherche organique (Priority: P3)

**Goal** : chaque page MVP expose un title/description/canonical/OG corrects et est indexable. Sitemap et robots.txt prêts. Page confidentialité disponible.

**Independent Test** : pour chacune des 8 routes MVP, inspecter le HTML rendu (View Source) : `<title>` unique, meta description sous 160 caractères, balise canonical, balises Open Graph complètes (title, description, image, url, type, locale). Vérifier `/sitemap.xml` et `/robots.txt`.

### Tests for User Story 4

- [x] T084 [P] [US4] Test E2E SEO dans `tests/e2e/seo.spec.ts` (10 routes : title 10-80 chars, description 50-200 chars, canonical absolue, og:title/description/url/type/locale/image, twitter:card, h1 unique, lang="fr", noindex sur /merci)
- [x] T085 [P] [US4] Test E2E sitemap/robots dans `tests/e2e/seo-infra.spec.ts` (`/sitemap.xml` valide XML, 9 routes listées, `/robots.txt` répond, disallow en non-prod, opengraph-image accessible sur / et 5 pages module)

### Implementation for User Story 4

- [x] T086 [P] [US4] Implémenter `app/sitemap.ts` (export `default` MetadataRoute.Sitemap : 4 routes statiques + 5 routes module dynamiques, priorités calibrées home=1.0, demo=0.95, modules=0.9, /modules/<slug>=0.8, confidentialite=0.2)
- [x] T087 [P] [US4] Implémenter `app/robots.ts` (allow `/` en prod, disallow `/api/` et `/demander-demo/merci`, expose sitemap + host ; disallow total en non-prod via `VERCEL_ENV !== 'production'`)
- [x] T088 [P] [US4] Configurer les `Metadata` exports dans toutes les pages : home, /modules, /modules/[slug] (via generateMetadata), /demander-demo, /demander-demo/merci (noindex), /confidentialite — toutes via `buildMetadata()` *(déjà fait en Phases 3-5, vérifié en Phase 6)*
- [x] T089 [P] [US4] Affiner `lib/seo/metadata.ts` : suppression du fallback `/images/og/default.png` pour laisser la convention `opengraph-image.tsx` opérer quand aucun `ogImage` explicite n'est passé. Les SEO titles/descriptions des modules sont déjà dans le frontmatter MDX (mots-clés PRD §11)
- [x] T090 [P] [US4] OG images dynamiques via `next/og` ImageResponse : `app/opengraph-image.tsx` (image par défaut), `app/(marketing)/modules/[slug]/opengraph-image.tsx` (image personnalisée par module via `generateImageMetadata`). Pas de fichiers PNG statiques nécessaires au MVP — Phase Polish peut les remplacer par des captures réelles si besoin
- [x] T091 [US4] Créer la page `app/(marketing)/confidentialite/page.tsx` rendant `content/confidentialite.mdx` via MDXRemote + Metadata via `buildMetadata`

**Checkpoint US4** : `View Source` montre des balises propres sur les 8 pages. `/sitemap.xml` et `/robots.txt` répondent correctement. Test SEO automatisé vert.

---

## Phase 7 : Polish & Cross-Cutting Concerns

**Purpose** : qualité, CI, accessibilité, performance et finitions transverses avant mise en ligne.

- [x] T092 [P] Test E2E navigation et clavier dans `tests/e2e/navigation.spec.ts` (skip-link en 1er Tab, focus visible sur CTA, traversée header+main+footer, 9 routes 200, logo header → /, 4 liens footer)
- [x] T093 [P] Test E2E accessibilité automatisée dans `tests/e2e/a11y.spec.ts` (axe-core sur 9 pages MVP, scan WCAG 2.0 A/AA + 2.1 A/AA, aucune violation `serious`/`critical`, +1 test formulaire en état d'erreur)
- [x] T094 [P] Workflow CI principal dans `.github/workflows/ci.yml` (5 jobs : lint-typecheck, unit avec coverage, build, e2e avec Playwright browsers, lighthouse — concurrency, artifacts retention)
- [x] T095 [P] Workflow preview deploy check dans `.github/workflows/preview.yml` (déclenché par `deployment_status` Vercel, Lighthouse CI sur 6 URLs preview)
- [x] T096 [P] Script `analyze` (`ANALYZE=true next build`) ajouté en Phase 1 dans `package.json` — cible < 90 kB gzip documentée dans le plan
- [x] T097 [P] Mettre à jour `README.md` : stack, scripts npm, architecture repo, liens vers tous les artefacts Spec Kit, doc opérationnelle
- [x] T098 [P] `.gitignore` complet livré en Phase 1 — incluant `.claude/worktrees/`, coverage, playwright-report, .lighthouseci
- [x] T099 [P] Documenter les variables d'environnement Vercel + déploiement dans `docs/deployment.md` (10 vars + DNS + check-list mise en prod + dépannage)
- [ ] T100 **À valider côté utilisateur** : Remplacer les placeholders visuels par les captures produit réelles dans `public/images/modules/` (dépendance externe équipe produit) — les OG images sont dynamiquement générées via `next/og`, suffisant pour le MVP
- [ ] T101 **À valider côté utilisateur** : `pnpm build && pnpm test:lighthouse` sur les 9 pages MVP, corriger jusqu'à ≥ 85 mobile partout
- [ ] T102 **À valider côté utilisateur** : Dérouler manuellement `quickstart.md` de bout en bout sur un poste propre
- [ ] T103 **À valider côté utilisateur** : Smoke test mobile 3G simulé (Chrome DevTools — LCP < 2.5s, contenu critique lisible)
- [x] T104 Audit RGPD final : check-list complète dans `docs/rgpd-audit.md` (10 sections, conforme MVP, points de vigilance Phase 2 documentés)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup** : démarrage immédiat.
- **Phase 2 Foundational** : démarre après T013. BLOQUE toutes les user stories.
- **Phase 3 US1 (P1) MVP** : démarre après le checkpoint Phase 2.
- **Phase 4 US2 (P2)** : démarre après Phase 2 ; peut s'exécuter en parallèle de US1 si équipe > 1 personne.
- **Phase 5 US3 (P3)** : démarre après Phase 2 ; les events sont câblés sur des composants livrés en US1 et US2, donc en pratique US3 vient après US1+US2.
- **Phase 6 US4 (P3)** : démarre après Phase 2 ; partiellement indépendant (sitemap/robots/metadata peuvent commencer dès qu'au moins US1 est livré).
- **Phase 7 Polish** : démarre après que les user stories souhaitées soient livrées.

### Dépendances inter-stories

- **US1** : aucune dépendance externe aux stories. MVP autonome.
- **US2** : aucune dépendance bloquante avec US1. Peut être démontrée seule (mais perd l'angle conversion).
- **US3** : exploite les composants livrés en US1 (CTA démo, formulaire) et US2 (cartes module, pages module). Implémentable en parallèle mais les events ne valident qu'une fois les composants supports en place.
- **US4** : exploite toutes les pages livrées en US1+US2. La page `/confidentialite` (T091) peut être livrée indépendamment dès Phase 2.

### Dépendances internes notables (au sein des phases)

- T020 (handler) dépend de T017, T018, T019.
- T021 (modules loader) dépend de T015 (schema) et T036-T040 (fichiers MDX).
- T026 (marketing layout) dépend de T032, T033, T034.
- T051 (DemoRequestForm) dépend de T014 (schema), T049, T050.
- T052 (API route) dépend de T014, T020, T053.
- T073 (page module dynamique) dépend de T021, T043, T071.
- T088 (metadata par page) dépend de T022 (helper SEO).

### Parallel opportunities

- **Phase 1** : T002-T012 sont quasi tous [P] (fichiers de config distincts).
- **Phase 2** : T015, T016, T018, T019, T021, T022, T023, T027-T035, T036-T042 marqués [P] (fichiers distincts).
- **Phase 3 US1** : T044-T048 (tests) en parallèle ; T049, T050, T053, T054, T056, T058, T059 marqués [P].
- **Phase 4 US2** : T061-T063 (tests) en parallèle ; T064-T071 (composants) tous [P].
- **Phase 5 US3** : T075-T077 (tests + helper) en parallèle ; T078-T083 (câblages) tous [P].
- **Phase 6 US4** : T084-T085 (tests) en parallèle ; T086-T090 tous [P].
- **Phase 7 Polish** : T092-T099 tous [P].

---

## Parallel Example: User Story 1 (MVP)

```bash
# Lancer les tests US1 en parallèle (TDD-friendly) :
Task: "T044 [P] [US1] Test unitaire schéma Lead dans tests/unit/lead.schema.test.ts"
Task: "T045 [P] [US1] Test unitaire dispatcher LeadSink dans tests/unit/lead-handler.test.ts"
Task: "T046 [P] [US1] Test unitaire ResendLeadSink dans tests/unit/resend-sink.test.ts"
Task: "T047 [P] [US1] Test E2E formulaire dans tests/e2e/demo-form.spec.ts"
Task: "T048 [P] [US1] Test E2E API dans tests/e2e/api-leads.spec.ts"

# Lancer les composants et helpers indépendants en parallèle :
Task: "T049 [P] [US1] components/forms/FormField.tsx"
Task: "T050 [P] [US1] components/forms/ModuleMultiSelect.tsx"
Task: "T053 [P] [US1] lib/leads/rate-limit.ts"
Task: "T054 [P] [US1] lib/leads/email/demo-notification.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Compléter Phase 1 Setup (T001-T013).
2. Compléter Phase 2 Foundational (T014-T043) — bloquant.
3. Compléter Phase 3 US1 (T044-T060).
4. **STOP & VALIDATE** : tester le tunnel `/` → CTA démo → `/demander-demo` → soumission → email reçu + page de confirmation. Vérifier Lighthouse ≥ 85.
5. **Déployer en preview** Vercel pour validation interne par l'équipe commerciale.

À ce point, le site capte des leads. C'est livrable.

### Incremental delivery

1. **Sprint 1** : Phase 1 + Phase 2 + US1 → **MVP en production**.
2. **Sprint 2** : US2 (pages module) → enrichit l'exploration, améliore la qualité des leads.
3. **Sprint 3** : US3 (analytics) + US4 (SEO) en parallèle → permet l'optimisation continue et l'acquisition organique.
4. **Sprint 4** : Phase 7 Polish → CI complète, audits, captures produit réelles, mise en prod finale.

### Parallel team strategy

Si 2-3 développeurs disponibles après le checkpoint Phase 2 :

- **Dev A** : US1 (le plus dense, ~17 tâches, contient l'API et le formulaire)
- **Dev B** : US2 (composants marketing + pages module, peut tourner en parallèle de A)
- **Dev C (frontend léger)** : US4 SEO + Phase 7 a11y/CI une fois US1 livrée

US3 (analytics) attend US1 + US2 et peut être réparti une fois les composants supports prêts.

---

## Notes

- **[P]** = fichiers différents, aucune dépendance bloquante avec une tâche incomplète.
- **[Story]** = traçabilité vers la user story du spec.
- Tous les chemins sont relatifs à `D:\Ecoledigitale_web\`.
- Les tests sont **inclus comme tâches obligatoires** car la Constitution impose des gates testables (FR-012 Lighthouse, FR-014 a11y, FR-010 SEO).
- Vérifier que chaque test échoue avant l'implémentation correspondante (TDD recommandé pour les schémas Zod et l'API route).
- Committer après chaque tâche logique pour faciliter la revue.
- Checkpoint après chaque user story = validation indépendante avant d'enchaîner.
- Hors-MVP explicitement listé (PRD §16) : pas de tâche pour blog, FAQ étendue, page tarifs, cas clients, multilingue, chatbot, paiement en ligne.

---

## Récapitulatif

| Phase | Tâches | Tâches [P] | Story |
|---|---|---|---|
| 1 — Setup | T001 → T013 (13) | 11 | — |
| 2 — Foundational | T014 → T043 (30) | 26 | — |
| 3 — US1 MVP | T044 → T060 (17) | 11 | US1 |
| 4 — US2 | T061 → T074 (14) | 11 | US2 |
| 5 — US3 | T075 → T083 (9) | 9 | US3 |
| 6 — US4 | T084 → T091 (8) | 7 | US4 |
| 7 — Polish | T092 → T104 (13) | 8 | — |
| **Total** | **104** | **83** | |

**Suggested MVP scope** : Phase 1 + Phase 2 + Phase 3 (US1 seul) = **60 tâches** pour la première mise en ligne capable de capter des leads.

**Indépendance des stories** : ✅ US1 livrable seul. US2/US3/US4 livrables indépendamment après Phase 2. Aucun couplage bloquant entre US ≥ 2.
