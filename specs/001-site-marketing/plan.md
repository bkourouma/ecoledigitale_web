# Implementation Plan: Site marketing EcoleDigitale

**Branch** : `001-site-marketing` | **Date** : 2026-05-18 | **Spec** : [spec.md](spec.md)

**Input** : Feature specification from [specs/001-site-marketing/spec.md](spec.md)

## Summary

Site marketing public, statique-first, présentant l'offre modulaire EcoleDigitale (5 modules) et convertissant les visiteurs en demandes de démonstration qualifiées via un formulaire connecté à une notification email transactionnelle. Architecture : **application Next.js 15 standalone** (App Router, React Server Components) avec contenu en MDX, déployée sur Vercel. SEO et performance Lighthouse mobile ≥ 85 atteints par génération statique. Lead capture via API route Next.js → Resend, avec interface d'intégration CRM préparée pour Phase 2.

## Technical Context

**Language/Version** : TypeScript 5.x sur Node.js 20 LTS

**Primary Dependencies** : Next.js 15 (App Router), React 19, Tailwind CSS 4, MDX (`@next/mdx` + `next-mdx-remote` pour les fragments), `zod` (validation formulaire), `resend` (SDK email), `@vercel/analytics` (Web Vitals), Plausible (analytics produit), `lucide-react` (icônes), `next-seo` ou Metadata API native Next pour le SEO.

**Storage** : Aucun stockage persistant au MVP. Les leads sont transmis par email (Resend) et journalisés en log structuré (Vercel logs). Une interface `LeadSink` est définie pour ajouter ultérieurement un sink CRM/Postgres sans modifier le code du formulaire (voir [contracts/lead-sink.contract.md](contracts/lead-sink.contract.md)).

**Testing** : Vitest (unitaires : validation Zod, helpers de contenu, builders de leads), Playwright (E2E : navigation, soumission formulaire, accessibilité clavier, vérification SEO meta), Lighthouse CI (gate performance ≥ 85 mobile sur chaque page MVP), `axe-core/playwright` (audit a11y automatisé).

**Target Platform** : Web (navigateurs evergreen : Chrome 110+, Firefox 110+, Safari 16+, Edge 110+). Responsive mobile-first. Déploiement Vercel (Node.js 20 runtime + Edge pour API route formulaire).

**Project Type** : Web application (frontend statique + 1 API route serverless pour la soumission de leads).

**Performance Goals** : Lighthouse mobile Performance ≥ 85 sur les 8 pages MVP. LCP < 2.5 s sur 3G simulé. TTI < 3.5 s. Bundle JS initial < 90 kB gzip (hors contenu MDX statique).

**Constraints** : 
- Site 100 % français au lancement
- Pas de blocking JS pour le contenu critique (hero, promesse, CTAs principaux)
- Form fonctionne même si Plausible est bloqué côté client
- Notification email reçue par l'équipe commerciale en ≤ 5 minutes ouvrées (SC-004)
- Aucune donnée personnelle stockée sans consentement explicite RGPD (FR-019)

**Scale/Scope** : 8 pages MVP, ~20-50 leads/mois à 6 mois (estimation MVP), pic potentiel de 200 visiteurs concurrents lors d'une campagne. Static generation → scalabilité essentiellement gérée par le CDN Vercel.

## Constitution Check

*GATE — doit passer avant Phase 0 et être re-vérifié après Phase 1.*

| Principe | Vérification | Statut |
|---|---|---|
| **I. Clarity Before Decoration** | Design system Tailwind sobre, typographie lisible (Inter/system stack), pas d'animations gratuites, sections scannables (titre court + bullets + visuel). Pas de hero vidéo lourd. | ✅ Pass |
| **II. Modular Offer Integrity** | Source unique pour les 5 modules : `content/modules/*.mdx` + schéma Zod (`module.schema.ts`). Ordre, dépendances (socle vs optionnel) et libellés contraints par le schéma. Page `/modules` générée depuis cette source. | ✅ Pass |
| **III. Conversion and Lead Quality** | CTA démo persistant dans le header (sticky), répété en hero, fin de chaque page module et footer. Formulaire `/demander-demo` respecte les 7 champs requis + consentement. Schéma Zod garantit qu'aucun lead invalide n'est transmis. Interface `LeadSink` documentée pour CRM futur. | ✅ Pass |
| **IV. SEO, Accessibility, Performance Gates** | Metadata API Next.js par page (title, description, OG). URLs conformes à la liste PRD. Static generation pour les 8 pages MVP. Lighthouse CI configuré dans la CI avec gate ≥ 85. Tests `axe-core` sur chaque page. Composants accessibles (labels, focus rings, contrast Tailwind `text-slate-900` sur `bg-white` = AA). | ✅ Pass |
| **V. Maintainable Content and Analytics** | Contenu en MDX → édition sans toucher au code TSX. Plausible events typés via wrapper `track()` côté client. Les 5 événements obligatoires (FR-013) couverts par hooks de composants CTA/Form/ContactLink. | ✅ Pass |

**Gate result** : ✅ Aucune violation. Pas de section *Complexity Tracking* à remplir.

## Project Structure

### Documentation (this feature)

```text
specs/001-site-marketing/
├── plan.md                          # Ce fichier
├── research.md                      # Phase 0 — résolution des NEEDS CLARIFICATION
├── data-model.md                    # Phase 1 — entités & schémas Zod
├── quickstart.md                    # Phase 1 — setup dev local
├── contracts/
│   ├── demo-form.contract.md        # Contrat API POST /api/leads
│   ├── lead-sink.contract.md        # Interface d'intégration CRM future
│   ├── module-content.contract.md   # Schéma MDX d'un module
│   └── analytics-events.contract.md # Catalogue des events Plausible
├── checklists/
│   └── requirements.md              # (déjà créé en /speckit-specify)
└── tasks.md                         # À générer par /speckit-tasks
```

### Source Code (repository root)

```text
D:\Ecoledigitale_web\
├── app/                              # Next.js App Router
│   ├── (marketing)/                  # Route group pour pages publiques
│   │   ├── page.tsx                  # /  — Accueil
│   │   ├── modules/
│   │   │   ├── page.tsx              # /modules
│   │   │   └── [slug]/page.tsx       # /modules/socle-ecoledigitale, etc. (génération statique)
│   │   ├── demander-demo/page.tsx    # /demander-demo
│   │   ├── confidentialite/page.tsx  # /confidentialite (FR-019)
│   │   └── layout.tsx                # Header + Footer + sticky CTA démo
│   ├── api/
│   │   └── leads/route.ts            # POST handler — validation Zod + LeadSink
│   ├── layout.tsx                    # Root layout (fonts, Plausible script, viewport)
│   ├── sitemap.ts                    # Sitemap dynamique
│   ├── robots.ts                     # robots.txt
│   └── globals.css                   # Tailwind directives + tokens
├── components/
│   ├── ui/                           # Primitives : Button, Card, Input, Select, Checkbox
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── ModuleCard.tsx
│   │   ├── ModulesGrid.tsx           # Vue 5 modules + comparatif
│   │   ├── BenefitsByRole.tsx
│   │   ├── TrustBand.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── StickyHeaderCTA.tsx
│   │   └── ContactChannels.tsx       # Email/WhatsApp/Téléphone (FR-017)
│   ├── forms/
│   │   ├── DemoRequestForm.tsx       # Client component, React Hook Form + Zod
│   │   ├── FormField.tsx
│   │   └── ModuleMultiSelect.tsx
│   └── analytics/
│       └── PlausibleScript.tsx       # Server component injectant le script
├── content/
│   ├── modules/
│   │   ├── socle-ecoledigitale.mdx
│   │   ├── parcours-bts.mdx
│   │   ├── parcours-superieur.mdx
│   │   ├── proformation.mdx
│   │   └── campus-live.mdx
│   ├── home.mdx                       # Fragments éditoriaux de l'accueil
│   └── seo.ts                         # Titres/descriptions par route
├── lib/
│   ├── analytics/
│   │   ├── track.ts                   # Wrapper Plausible typé
│   │   └── events.ts                  # Catalogue d'événements (typed enum)
│   ├── content/
│   │   ├── modules.ts                 # Loader MDX → Module[] typé
│   │   └── module.schema.ts           # Zod schema Module
│   ├── leads/
│   │   ├── lead.schema.ts             # Zod schema Lead
│   │   ├── sinks/
│   │   │   ├── index.ts               # registerSinks() + dispatch
│   │   │   ├── resend.sink.ts         # Notification email équipe commerciale
│   │   │   └── log.sink.ts            # Journalisation structurée (audit)
│   │   └── handler.ts                 # Orchestration validation → sinks
│   └── seo/
│       └── metadata.ts                # Helper buildMetadata(route)
├── public/
│   ├── images/
│   │   ├── modules/                   # Captures produit (à fournir)
│   │   └── og/                        # Images Open Graph (8 pages MVP)
│   └── favicon.ico
├── tests/
│   ├── unit/
│   │   ├── lead.schema.test.ts
│   │   ├── module.schema.test.ts
│   │   └── track.test.ts
│   ├── e2e/
│   │   ├── navigation.spec.ts         # Header, footer, navigation clavier
│   │   ├── demo-form.spec.ts          # Validation, soumission, états erreur
│   │   ├── module-pages.spec.ts       # Les 5 pages chargent + CTA présent
│   │   ├── seo.spec.ts                # Title/description/canonical/OG par page
│   │   └── a11y.spec.ts               # axe-core sur les 8 pages
│   └── lighthouse/
│       └── lighthouserc.json          # Gate ≥ 85 mobile Performance
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Lint + typecheck + unit + e2e + lighthouse
│       └── preview.yml                # Vercel preview check
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── playwright.config.ts
└── vitest.config.ts
```

**Structure Decision** : Application Next.js single-package au **root du repo**. Pas de monorepo. Le route group `(marketing)` isole les pages publiques avec un layout dédié (header sticky, footer riche). La séparation `content/` (MDX) vs `lib/content/` (loaders) garantit que les copies marketing sont éditables sans toucher au code (Constitution V). La couche `lib/leads/sinks/` matérialise l'extensibilité CRM (Constitution III) — ajouter Hubspot/Pipedrive = écrire `hubspot.sink.ts` puis l'enregistrer.

## Complexity Tracking

*Aucune violation de la Constitution → table vide.*

---

## Phase 0 — Outline & Research

Voir [research.md](research.md) pour le détail. Synthèse :

| Décision | Choix | Statut clarification |
|---|---|---|
| Architecture (PRD §18) | App Next.js standalone | ✅ Résolu |
| Framework | Next.js 15 App Router | ✅ |
| Hébergement | Vercel | ✅ |
| Email transactionnel | Resend | ✅ |
| Analytics | Plausible (+ Vercel Web Analytics) | ✅ |
| Persistance leads MVP | Email + log structuré, pas de DB | ✅ |
| Branding (FR-018) | Mono-marque « EcoleDigitale » | ✅ Résolu |
| Canaux contact (FR-017) | Email + WhatsApp + Téléphone (footer + page contact) | ✅ Résolu |
| Tarifs publics | Aucun au MVP | ✅ Confirmé |
| i18n | FR uniquement, structure prête pour ajout EN futur | ✅ |
| Cookie banner | Non requis (Plausible cookieless) ; mention RGPD sur le formulaire et page /confidentialite | ✅ |
| Captures produit | Préparées par l'équipe produit avant lancement ; placeholders Tailwind en attendant | ⚠ Dépendance externe |

---

## Phase 1 — Design & Contracts

Artefacts livrés :

- [data-model.md](data-model.md) — entités Module / Lead / CTA / Page / Événement avec schémas Zod
- [contracts/demo-form.contract.md](contracts/demo-form.contract.md) — contrat HTTP de l'API `/api/leads`
- [contracts/lead-sink.contract.md](contracts/lead-sink.contract.md) — interface `LeadSink` pour CRM futur
- [contracts/module-content.contract.md](contracts/module-content.contract.md) — schéma frontmatter MDX d'un module
- [contracts/analytics-events.contract.md](contracts/analytics-events.contract.md) — catalogue typé des événements Plausible
- [quickstart.md](quickstart.md) — setup local en < 5 minutes

### Constitution re-check post-design

| Principe | Re-vérification post-design | Statut |
|---|---|---|
| I | La hiérarchie des composants `marketing/` impose des sections courtes et scannables ; aucun composant décoratif sans utilité business. | ✅ |
| II | Le schéma `module.schema.ts` valide à la compilation l'intégrité du catalogue (5 modules, type socle/optionnel, ordre stable). | ✅ |
| III | Le contrat `demo-form.contract.md` exige les 7 champs requis + consentement. `LeadSink` permet l'ajout CRM sans toucher au formulaire. | ✅ |
| IV | `tests/e2e/seo.spec.ts` + `lighthouse/` + `a11y.spec.ts` matérialisent les gates dans la CI. | ✅ |
| V | Le catalogue `analytics-events.contract.md` est typé ; tout nouvel event passe par une revue. Contenu MDX → mise à jour sans déploiement code. | ✅ |

**Aucune dérive détectée post-design.** Plan prêt pour `/speckit-tasks`.

---

## Notes & dépendances ouvertes

- **Captures produit** : dépend de la livraison équipe produit. Fallback : mockups Tailwind/Figma → captures réelles avant mise en ligne (Constitution UX standards).
- **Domaine de production** : non précisé. À confirmer avant déploiement (ex. `ecoledigitale.com` ou sous-domaine).
- **Compte Resend + clé API** : à provisionner. Variables `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL`.
- **Site Plausible** : à créer (`ecoledigitale.com`). Variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- **Phase 2 anticipée** : `LeadSink` côté code + table `Lead` en base (Vercel Postgres ou Turso) + brochure téléchargeable.
