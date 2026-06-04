# Research — Site marketing EcoleDigitale

**Phase** : 0 (Outline & Research)

**Date** : 2026-05-18

**Objectif** : résoudre toutes les `NEEDS CLARIFICATION` du spec + justifier les choix techniques structurants du plan.

---

## R-001 — Architecture : monorepo intégré vs application séparée

**Question (PRD §18)** : Le site doit-il être intégré au monorepo de la plateforme SaaS EcoleDigitale ou développé comme application séparée ?

**Decision** : **Application Next.js standalone**, hébergée dans son propre repo (`D:\Ecoledigitale_web`, déjà initialisé).

**Rationale** :
- Le repo actuel est dédié au site marketing (pas un monorepo de la plateforme).
- Cycle de release marketing ≠ cycle produit (le marketing itère plus vite, sans contrainte de compatibilité backend).
- Pas de dépendance technique entre le site marketing et la plateforme SaaS (le formulaire envoie un email, il ne consomme pas l'API métier).
- Permet de déployer sur un CDN dédié (Vercel) optimisé pour les sites statiques, indépendamment de l'hébergement de la plateforme.
- Réduit la surface d'attaque : aucune fuite possible vers les données pédagogiques/financières de la plateforme.

**Alternatives considered** :
- *Monorepo Turborepo* : pertinent si on partage un design system avec l'app produit. Pas le cas aujourd'hui. Reportable si besoin.
- *Section dans l'app SaaS* (route `/marketing`) : couplage des releases, pénalité SEO (rendu authentifié), complexité inutile. Rejeté.

---

## R-002 — Framework

**Decision** : **Next.js 15 (App Router)** + React 19 + TypeScript.

**Rationale** :
- Génération statique des 8 pages MVP → Lighthouse mobile ≥ 85 (FR-012, SC-006) atteignable de façon native.
- Metadata API par page → SEO (FR-010) sans boilerplate, OG tags propres.
- Server Components → bundle JS initial réduit (cible < 90 kB gzip), critique pour LCP mobile 3G (Constitution IV).
- API routes pour `/api/leads` → un seul runtime, pas besoin de backend séparé.
- Next/Image → optimisation automatique des captures produit (formats AVIF/WebP, dimensions responsives).
- Écosystème mature, déploiement Vercel zero-config.

**Alternatives considered** :
- *Astro* : excellent en performance, mais écosystème React un peu moins riche et formulaire serveur moins direct. Bon second choix.
- *SvelteKit* : top performance mais équipe et écosystème B2B SaaS moins courant.
- *Hugo / 11ty* : très rapide mais formulaire = backend séparé → friction.
- *Plain HTML + Tailwind* : marche pour 8 pages, mais perd l'optimisation Image, le routing typé et l'i18n future.

---

## R-003 — Style et design system

**Decision** : **Tailwind CSS 4** avec tokens custom (couleurs marque, espacements, typographies).

**Rationale** :
- Contrôle fin de la hiérarchie visuelle (Constitution I : Clarity Before Decoration).
- Contraste accessible par défaut via les utilitaires (`text-slate-900`, `text-slate-700` sur fonds clairs = WCAG AA).
- Pas de framework UI lourd (pas de Material/Ant Design) qui imposerait un style générique.
- Composants primitifs maison dans `components/ui/` → cohérence garantie sans dépendance externe.

**Alternatives considered** :
- *shadcn/ui* : excellents primitifs Radix + Tailwind. Recommandé si on a besoin de composants accessibles complexes (Combobox, Dialog). On l'introduira au besoin par copie locale, pas en dépendance.
- *Chakra / Mantine* : trop de runtime JS pour un site marketing.

---

## R-004 — Gestion du contenu marketing

**Decision** : **MDX** (`@next/mdx`) avec schéma frontmatter Zod, fichiers dans `content/`.

**Rationale** :
- Constitution V : "Marketing content SHOULD be easy to update without deep code changes."
- MDX permet à un rédacteur de modifier titres, paragraphes, listes, sans toucher au TSX.
- Le schéma Zod sur le frontmatter (`module.schema.ts`) garantit l'intégrité (Constitution II : pas de promesse de module inexistant).
- Build-time validation → erreur de build si un MDX est mal formé.
- Pas besoin de CMS headless externe au MVP (latence, coût, complexité évités).

**Alternatives considered** :
- *CMS headless (Sanity, Strapi, Contentful)* : pertinent si l'équipe marketing veut éditer sans Git. Reportable en Phase 2 si le besoin émerge. L'abstraction `lib/content/modules.ts` rend la migration facile (changer la source, pas les consommateurs).
- *JSON brut* : moins lisible pour un rédacteur, moins riche éditorialement.

---

## R-005 — Email transactionnel pour la notification de leads

**Decision** : **Resend** (`resend` SDK Node).

**Rationale** :
- API simple, DX excellente, free tier généreux (3 000 emails/mois) suffisant pour le MVP.
- Deliverability solide, DKIM/SPF gérés.
- Latence < 1 s → respecte SC-004 (notification ≤ 5 minutes) très largement.
- SDK TypeScript first-class.

**Alternatives considered** :
- *SendGrid* : robuste mais setup plus lourd, API plus verbeuse.
- *AWS SES* : moins cher à l'échelle mais setup IAM et warm-up de domaine inutiles pour 50 leads/mois.
- *Postmark* : équivalent qualité, plus cher au démarrage.
- *Nodemailer + SMTP* : nécessite un fournisseur SMTP de toute façon, double couche inutile.

---

## R-006 — Analytics

**Decision** : **Plausible** (auto-hébergé ou cloud) en analytics produit + **Vercel Web Analytics** en complément Web Vitals.

**Rationale** :
- Plausible est **cookieless** → pas de bandeau de consentement bloquant (Constitution V + FR-019 simplifié).
- Privacy-friendly, conforme RGPD sans configuration spéciale.
- Events custom typés (`Demo CTA clicked`, `Form submitted`, etc.) couvrent FR-013 directement.
- Léger (< 1 kB), aucune pénalité Lighthouse.
- Vercel Web Analytics est gratuit sur Vercel et fournit les Web Vitals réels (LCP, INP, CLS) pour piloter SC-006.

**Alternatives considered** :
- *Google Analytics 4* : gratuit, mais bandeau cookie obligatoire en France → pénalité conversion + complexité juridique. Rejeté.
- *PostHog* : excellent mais overkill (session replay, feature flags non utilisés au MVP). Pertinent en Phase 2 si on fait des A/B tests.
- *Matomo* : équivalent fonctionnel Plausible mais plus lourd.

---

## R-007 — Persistance des leads au MVP

**Decision** : **Pas de base de données au MVP.** Les leads sont :
1. Validés serveur via Zod
2. Envoyés par email à l'équipe commerciale via Resend
3. Journalisés en log structuré (Vercel logs) pour traçabilité/audit

Une interface `LeadSink` (voir [contracts/lead-sink.contract.md](contracts/lead-sink.contract.md)) permet d'ajouter ultérieurement un sink CRM (Hubspot, Pipedrive) ou base de données (Vercel Postgres) sans toucher au code du formulaire.

**Rationale** :
- PRD §8 FR-005 : "stockée ou envoyée par email à l'équipe commerciale". Email seul est conforme au MVP.
- Constitution III : "MUST keep future CRM or email integration practical." → l'interface `LeadSink` matérialise cette extensibilité dès le MVP.
- Évite la complexité (provisioning DB, migrations, RGPD storage) tant que le volume est faible (~20-50/mois).
- En cas de perte de l'email, le log Vercel conserve la trace pendant la durée de rétention.

**Alternatives considered** :
- *Vercel Postgres / Turso (SQLite)* dès le MVP : utile mais ajoute 3-5 jours de travail pour un bénéfice mineur. Reportable.
- *Airtable / Notion via webhook* : tentant pour une vue "CRM léger". Reportable en Phase 2 (probablement remplacé par le vrai CRM).
- *Google Sheets via API* : fragile, quotas, mauvaise pratique.

---

## R-008 — FR-018 — Stratégie de marque

**Question** : Le nom commercial reste-t-il « EcoleDigitale » ou faut-il créer une marque produit distincte ?

**Decision** : **Mono-marque « EcoleDigitale »**. Les 5 modules sont des **sous-marques internes** (Socle EcoleDigitale, Parcours BTS, Parcours Supérieur, ProFormation, Campus Live) sans logo dédié au MVP.

**Rationale** :
- Cohérence avec la plateforme SaaS existante (pas de confusion prospect).
- Évite le coût et le délai d'une création d'identité visuelle complète.
- Les noms commerciaux des modules (recommandés par le PRD §3) suffisent à différencier l'offre.
- Phase 2 : si un module (ex. ProFormation) prend une vie commerciale autonome, on pourra introduire un sous-logo sans refonte.

**Alternatives considered** :
- *Marque produit distincte* (ex. « EcoleDigitale Suite ») : ajoute de la complexité, dilue la reconnaissance déjà acquise par la plateforme. Rejeté.

---

## R-009 — FR-017 — Canaux de contact alternatifs

**Question** : Quels canaux de contact doivent être prioritaires : email, téléphone, WhatsApp, calendrier de RDV ?

**Decision** : **Trois canaux visibles**, par ordre de priorité :
1. **Formulaire de démo** (CTA primaire, header sticky + hero + fin de page)
2. **WhatsApp Business** (click-to-chat) — pertinent pour le marché francophone Afrique/France
3. **Email direct** (lien `mailto:`) — pour les décideurs préférant l'écrit asynchrone
4. **Téléphone** (lien `tel:`) — affiché en footer, pas en CTA principal

Pas de calendrier RDV (Calendly / Cal.com) au MVP : ajout simple en Phase 2 si l'équipe commerciale le souhaite (un lien dans le footer suffit).

**Rationale** :
- Couvre les 3 préférences de contact dominantes en B2B éducation francophone.
- WhatsApp est très utilisé dans le marché cible (Afrique francophone, France PME).
- Chaque canal a un événement analytique dédié (FR-013) pour mesurer l'usage et ajuster.
- Footer = persistant = découvrable, sans encombrer le hero (Constitution I : clarté).

**Alternatives considered** :
- *Calendrier de RDV (Cal.com)* en MVP : tentant mais nécessite une coordination équipe commerciale (disponibilités, qualification préalable). Reportable.
- *Chat live / chatbot* : explicitement hors-MVP (PRD §16).

---

## R-010 — Affichage des tarifs

**Question (PRD §18)** : Souhaitez-vous afficher des tarifs publics ou uniquement une demande de devis ?

**Decision** : **Aucun tarif public au MVP.** Toute demande de prix passe par le formulaire de démo ou le contact direct.

**Rationale** :
- PRD §16 : "Comparateur tarifaire dynamique" est explicitement hors-MVP.
- PRD §17 Phase 2 : "Tarifs ou Offres" listé en Phase 2.
- Modèle B2B éducation : prix dépend du nombre d'étudiants, modules choisis, durée d'engagement → devis personnalisé est la norme.
- Réduit la friction décisionnelle : pas de "trop cher / trop pas cher" affiché avant qualification.

**Alternatives considered** :
- *Grille indicative* (ex. "à partir de X €/mois/étudiant") : reportable en Phase 2 après collecte de données de marché via les premières démos.

---

## R-011 — Internationalisation

**Decision** : **Français uniquement au lancement**, structure prête pour l'ajout futur de l'anglais (i18n route prefix `/[locale]/...` non activé mais conçu).

**Rationale** :
- PRD §16 : multilingue complet hors-MVP.
- Cible primaire : francophonie (France, Afrique francophone).
- Structure : utiliser `next-intl` ou la routing locale Next.js plus tard sans réécrire le contenu actuel.

---

## R-012 — Captures produit et visuels

**Decision** : **Dépendance externe**. L'équipe produit fournit les captures avant la mise en ligne. En attendant : **placeholders Tailwind** (cartes mockup avec libellés indicatifs) pour ne pas bloquer le développement.

**Rationale** :
- PRD §10 + Constitution UX : "Use real interface previews when available" → on attend les vraies captures.
- Placeholder design system permet de figer la mise en page sans attendre les assets.
- Risque : si les captures arrivent tard, on peut publier avec des mockups stylisés conformes à la charte produit.

**Action requise hors plan** : briefer l'équipe produit sur les captures à produire (8 captures min : 1 dashboard direction + 1 par module).

---

## R-013 — Stack de tests

**Decision** :
- **Vitest** pour les tests unitaires (schémas Zod, helpers, content loaders)
- **Playwright** pour les tests E2E (navigation, formulaire, SEO meta, deep links)
- **`@axe-core/playwright`** pour l'audit a11y automatisé sur les 8 pages
- **Lighthouse CI** en gate CI (Performance mobile ≥ 85 par page MVP)

**Rationale** :
- Vitest = rapide, intégration native TS, écosystème Vite.
- Playwright = standard de facto, multi-navigateurs, excellent pour les assertions SEO (vérifier le contenu rendu côté HTML).
- axe-core = couvre 30-40 % des règles WCAG automatisées → complément aux revues manuelles.
- Lighthouse CI = matérialise FR-012 / SC-006 dans la CI, bloque les régressions.

**Alternatives considered** :
- *Cypress* : remplacé majoritairement par Playwright en 2024-2026.
- *Jest* : plus lent que Vitest, écosystème legacy.

---

## R-014 — CI / Déploiement

**Decision** : **Vercel** pour le déploiement (preview par PR + prod sur `main`). **GitHub Actions** pour la CI complémentaire (lint, typecheck, unit, e2e headless, Lighthouse CI).

**Rationale** :
- Vercel = zero-config pour Next.js, preview deploy par PR (utile pour revue contenu marketing par les non-tech).
- GitHub Actions = standard, gratuit pour repos privés sous la limite.
- Lighthouse CI peut tourner sur la preview Vercel via URL dynamique.

---

## Récapitulatif des résolutions de NEEDS CLARIFICATION

| Spec marker | Résolu en | Décision |
|---|---|---|
| **FR-017** (canaux contact) | R-009 | Formulaire + WhatsApp + Email + Téléphone (footer) |
| **FR-018** (marque) | R-008 | Mono-marque « EcoleDigitale » |
| Assumption tarifs | R-010 | Aucun tarif public au MVP |
| PRD §18 architecture | R-001 | App Next.js standalone |
| PRD §18 captures | R-012 | Dépendance externe + placeholders |

**Tous les NEEDS CLARIFICATION sont résolus.** ✅
