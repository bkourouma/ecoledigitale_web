# EcoleDigitale — Site marketing

Site marketing public d'EcoleDigitale, logiciel de gestion scolaire pour les établissements de la maternelle au supérieur et la formation à distance, en Côte d'Ivoire et en Afrique francophone (un socle commun et quatre packs : Primary, Secondary, Higher, Virtual). EcoleDigitale est édité par Alliance Consultants (Abidjan, Côte d'Ivoire). Application Next.js 15 standalone.

Positionnement, vocabulaire et fonctions affirmables : voir [PRODUCT.md](PRODUCT.md). Coordonnées publiques (téléphone et WhatsApp : un seul numéro, e-mail) : `lib/site/contact.ts`.

## Stack

- **Framework** : Next.js 15 (App Router, RSC) + React 19 + TypeScript strict
- **Style** : Tailwind CSS 4 (CSS-first via `@theme`)
- **Contenu** : MDX (`@next/mdx`, `next-mdx-remote/rsc`) — modules dans `content/modules/`
- **Email transactionnel** : Resend
- **Analytics** : Umami auto-hébergé (cookieless, sans adresse IP conservée)
- **Tests** : Vitest (unit) + Playwright (E2E) + axe-core (a11y) + Lighthouse CI (perf ≥ 85 mobile)
- **CI/CD** : GitHub Actions + Vercel

## Démarrage rapide

```powershell
pnpm install
Copy-Item .env.example .env.local
# Renseigne LEADS_TO_EMAIL / LEADS_FROM_EMAIL au minimum
pnpm dev
# → http://localhost:4000
```

Documentation complète : [specs/001-site-marketing/quickstart.md](specs/001-site-marketing/quickstart.md).

## Scripts utiles

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `pnpm dev`             | Serveur de développement sur le port 4000    |
| `pnpm build`           | Build production statique                    |
| `pnpm start`           | Sert le build sur le port 4000               |
| `pnpm lint`            | ESLint + règles jsx-a11y                     |
| `pnpm typecheck`       | `tsc --noEmit` strict                        |
| `pnpm test:unit`       | Vitest                                       |
| `pnpm test:e2e`        | Playwright (toutes les specs)                |
| `pnpm test:e2e:ui`     | Playwright avec UI                           |
| `pnpm test:a11y`       | Audit axe-core sur les 8 pages MVP           |
| `pnpm test:lighthouse` | Lighthouse CI (gate Performance ≥ 85 mobile) |
| `pnpm analyze`         | Build avec bundle analyzer                   |

## Architecture du repo

```
app/                       # Routes Next.js (App Router)
  (marketing)/             # Route group : layout marketing (header + footer)
    page.tsx               # /
    modules/page.tsx       # /modules (socle + 4 packs)
    modules/[slug]/        # /modules/<slug> (dynamique × 5 : socle + 4 packs)
    ressources/            # /ressources (guides, glossaire, exemple illustratif)
    demander-demo/         # /demander-demo + /merci
    confidentialite/       # /confidentialite (RGPD)
  api/leads/route.ts       # POST endpoint formulaire
  opengraph-image.tsx      # OG image dynamique (next/og)
  sitemap.ts / robots.ts   # SEO infra (lastmod réels : voir lib/seo/lastmod.ts)
  not-found.tsx            # 404 en français

(`/blog` n'existe plus : redirection 301 vers `/ressources`, voir `next.config.mjs`.)

components/
  ui/                      # Primitives (Button, Input, Checkbox, ...)
  marketing/               # Composants pages (Hero, ModulesGrid, FinalCTA, ...)
  forms/                   # DemoRequestForm, FormField, ModuleMultiSelect
  mdx/                     # Composants module (ModuleHero, ModuleBenefits, ...)
  analytics/               # UmamiScript, ModulePageView

content/
  modules/                 # 5 fichiers MDX (socle + 4 packs) — source unique du catalogue
  home.mdx
  confidentialite.mdx

lib/
  leads/                   # Schémas Zod, sinks (Resend, Log), handler, rate-limit
  content/                 # Loader MDX modules + schema
  analytics/               # Wrapper track() typé + catalogue events
  seo/                     # buildMetadata(), JSON-LD, lastmod du sitemap
  site/contact.ts          # Coordonnées publiques et éditeur
  ui/cn.ts                 # clsx + tailwind-merge

tests/
  unit/                    # Vitest (Zod, sinks, loader, track)
  e2e/                     # Playwright (form, modules, SEO, a11y, analytics)
  lighthouse/              # Lighthouse CI config
```

## Spec Kit

Ce projet est piloté par [GitHub Spec Kit](https://github.com/github/spec-kit). Tout le travail produit suit le workflow Spec → Plan → Tasks → Implement.

| Artefact            | Lien                                                                             |
| ------------------- | -------------------------------------------------------------------------------- |
| Constitution        | [.specify/memory/constitution.md](.specify/memory/constitution.md)               |
| Spec                | [specs/001-site-marketing/spec.md](specs/001-site-marketing/spec.md)             |
| Plan technique      | [specs/001-site-marketing/plan.md](specs/001-site-marketing/plan.md)             |
| Recherche (Phase 0) | [specs/001-site-marketing/research.md](specs/001-site-marketing/research.md)     |
| Modèle de données   | [specs/001-site-marketing/data-model.md](specs/001-site-marketing/data-model.md) |
| Contrats            | [specs/001-site-marketing/contracts/](specs/001-site-marketing/contracts/)       |
| Quickstart dev      | [specs/001-site-marketing/quickstart.md](specs/001-site-marketing/quickstart.md) |
| Tâches              | [specs/001-site-marketing/tasks.md](specs/001-site-marketing/tasks.md)           |

Le PRD de référence est dans [docs/PRD_SITE_MARKETING_ECOLEDIGITALE.md](docs/PRD_SITE_MARKETING_ECOLEDIGITALE.md).

## Documentation opérationnelle

- **Déploiement & variables d'environnement** : [docs/deployment.md](docs/deployment.md)
- **Runbook analytics** : [docs/analytics-runbook.md](docs/analytics-runbook.md)
- **Audit RGPD** : [docs/rgpd-audit.md](docs/rgpd-audit.md)

## Publier une ressource (hub /ressources)

Le hub éditorial `/ressources` (guides, études de cas, glossaire) se met à jour
sans toucher au code : il suffit d'ajouter un fichier MDX.

1. Copier le template du bon type depuis `content/ressources/{type}/_TEMPLATE-*.mdx`.
2. Le renommer `{slug}.mdx` (le nom de fichier doit être le `slug`).
3. Remplir le frontmatter et rédiger le corps en MDX.
4. Vérifier en local : `pnpm typecheck` puis `pnpm dev`.
5. Ouvrir une PR, faire relire, merger.

Guide complet de rédaction et schéma de frontmatter :
[content/ressources/\_TEMPLATE-BRIEF.md](content/ressources/_TEMPLATE-BRIEF.md).
Parcours développeur détaillé :
[specs/002-hub-ressources/quickstart.md](specs/002-hub-ressources/quickstart.md).

## Workflow Spec Kit

Dans Claude Code Desktop, les slash commands ci-dessous pilotent le cycle de vie d'une feature :

- `/speckit-constitution` — faire évoluer les principes projet
- `/speckit-specify` — créer une nouvelle spec
- `/speckit-clarify` — lever les ambiguïtés
- `/speckit-plan` — plan technique
- `/speckit-tasks` — découpage en tâches
- `/speckit-analyze` — cohérence cross-artefacts
- `/speckit-implement` — exécution

## Licence

Propriétaire — EcoleDigitale.
