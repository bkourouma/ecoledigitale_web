# Data Model — Site marketing EcoleDigitale

**Phase** : 1 (Design)

**Date** : 2026-05-18

Aucune base de données au MVP. Les entités ci-dessous sont des **structures de données typées** (Zod) qui circulent à la compilation (MDX → contenu) ou à l'exécution (formulaire → API → email).

---

## 1. Module

Représente une unité commerciale de l'offre. **Source unique** : fichiers MDX dans `content/modules/`. **Validation** : `lib/content/module.schema.ts`.

### Champs (frontmatter MDX)

| Champ | Type | Requis | Contraintes | Exemple |
|---|---|---|---|---|
| `slug` | `string` | ✅ | Kebab-case, unique, correspond au nom de fichier | `parcours-bts` |
| `name` | `string` | ✅ | 2-40 caractères | `Parcours BTS` |
| `tagline` | `string` | ✅ | 30-120 caractères | `Piloter un cycle BTS de l'inscription au bulletin.` |
| `type` | `'socle' \| 'optionnel'` | ✅ | Un seul `socle` au total (validé au build) | `optionnel` |
| `order` | `number` | ✅ | Entier ≥ 1, unique | `2` |
| `headline` | `string` | ✅ | 50-200 caractères, promesse principale du module | — |
| `benefits` | `string[]` | ✅ | 3-8 items, chacun 20-160 caractères | `["Suivi notes et bulletins automatisés", ...]` |
| `features` | `string[]` | ✅ | 4-12 items, chacun 10-120 caractères | `["Configuration filières/niveaux/programmes", ...]` |
| `audiences` | `Audience[]` | ✅ | Sous-ensemble de `{director, academic, admin, teacher, student, parent, trainer, owner}` | `["director", "academic", "admin"]` |
| `seo.title` | `string` | ✅ | ≤ 60 caractères, inclut un mot-clé cible | — |
| `seo.description` | `string` | ✅ | 120-160 caractères | — |
| `seo.ogImage` | `string` (path) | ✅ | Chemin `public/images/og/...` | `/images/og/parcours-bts.png` |
| `cta.label` | `string` | ✅ | Libellé du CTA principal de la page | `Demander une démonstration` |
| `cta.target` | `'demo' \| 'modular-offer' \| 'contact'` | ✅ | Détermine la route et l'event analytique | `demo` |

### Contraintes croisées (validées au build)

- Le catalogue contient **exactement 5 modules** au MVP.
- Exactement **1 module de type `socle`** (= `socle-ecoledigitale`).
- Les `order` sont uniques et continus sur `1..5`.
- Les `slug` correspondent à la liste autorisée : `socle-ecoledigitale`, `parcours-bts`, `parcours-superieur`, `proformation`, `campus-live` (Constitution II).

### Cycle de vie

- Édition : pull request modifiant le MDX → preview Vercel → revue → merge → déploiement.
- Suppression d'un module : interdite sans `/speckit-specify` mettant à jour la spec et la Constitution.
- Ajout d'un 6e module : autorisé après revue spec, le composant `ModulesGrid` s'adapte automatiquement.

---

## 2. Lead (demande de démonstration)

Représente une soumission valide du formulaire `/demander-demo`. **Validation** : `lib/leads/lead.schema.ts`.

### Champs

| Champ | Type | Requis | Contraintes | Source PRD |
|---|---|---|---|---|
| `fullName` | `string` | ✅ | 2-120 caractères, trim | §13 |
| `email` | `string` | ✅ | RFC 5322 simple (Zod `.email()`), lowercase | §13, FR-005, FR-007 |
| `phone` | `string` | ✅ | 6-32 caractères, regex `^[+0-9 .()-]+$`, non vide | §13, FR-005, FR-007 |
| `institutionName` | `string` | ✅ | 2-200 caractères | §13 |
| `role` | `string` | ✅ | 2-120 caractères, libre | §13 |
| `location` | `string` | ✅ | 2-160 caractères, format libre "Ville, Pays" | §13 |
| `modulesOfInterest` | `Module['slug'][]` | ✅ | ≥ 1, valeurs ∈ catalogue modules | §13, FR-004, FR-007 |
| `consent` | `true` | ✅ | DOIT être `true` exactement | §13, FR-007, FR-019 |
| `studentCount` | `number \| undefined` | ❌ | Si présent : entier > 0 et < 1 000 000 | §13 |
| `institutionType` | `string \| undefined` | ❌ | ≤ 120 caractères | §13 |
| `message` | `string \| undefined` | ❌ | ≤ 2 000 caractères | §13 |
| `preferredChannel` | `'email' \| 'phone' \| 'whatsapp' \| undefined` | ❌ | — | §13 |
| `sourcePage` | `string` | ✅ (auto) | Path de la page d'origine du formulaire (rempli côté client) | FR-013 |
| `submittedAt` | `ISO string` | ✅ (auto) | Horodatage serveur | — |
| `userAgent` | `string` | ✅ (auto) | Headers HTTP côté API | Audit |

### Règles de validation (Zod)

```ts
// extrait — schéma complet dans lib/leads/lead.schema.ts
const LeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().email().toLowerCase(),
  phone: z.string().regex(/^[+0-9 .()-]{6,32}$/),
  institutionName: z.string().trim().min(2).max(200),
  role: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(160),
  modulesOfInterest: z.array(ModuleSlugSchema).min(1),
  consent: z.literal(true),
  studentCount: z.number().int().positive().max(999_999).optional(),
  institutionType: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  preferredChannel: z.enum(['email', 'phone', 'whatsapp']).optional(),
  sourcePage: z.string().startsWith('/'),
});
```

### Anti-spam / sécurité

- **Honeypot** : champ caché `website` qui doit rester vide ; rempli → rejet silencieux.
- **Rate limiting** : 5 soumissions / IP / heure (via Vercel Edge Middleware ou table `kv` future).
- **Server-side validation obligatoire** (la validation client est UX uniquement).
- **Pas de stockage** au MVP : transmis à `LeadSink`, puis effacé de la mémoire (RGPD minimisation).

### États

Pas d'état métier au MVP (un Lead est soit accepté soit rejeté à la validation). L'équipe commerciale gère le pipeline hors site (CRM Phase 2).

---

## 3. CTA (Call to Action)

Représente un point d'action. **Pas persisté** : utilisé en composant React et tracé en analytics.

### Champs

| Champ | Type | Description |
|---|---|---|
| `id` | `string` | Identifiant stable (ex. `hero-demo`, `module-card-bts`) |
| `label` | `string` | Texte visible |
| `type` | `'demo' \| 'modules' \| 'contact' \| 'brochure' \| 'whatsapp' \| 'email' \| 'phone'` | Catégorie analytics |
| `href` | `string` | URL interne ou externe |
| `placement` | `'header' \| 'hero' \| 'inline' \| 'footer' \| 'card'` | Localisation visuelle |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | Style |

Chaque clic émet un événement analytique typé (voir [contracts/analytics-events.contract.md](contracts/analytics-events.contract.md)).

---

## 4. Page

Représente une page publique. **Pas persistée** : générée statiquement par Next.js.

### Inventaire MVP

| Route | Type rendu | SEO title (cible) | Source contenu |
|---|---|---|---|
| `/` | Static | « EcoleDigitale — Plateforme de gestion d'établissements de formation » | `content/home.mdx` + `content/modules/*.mdx` (aperçu) |
| `/modules` | Static | « Modules — EcoleDigitale » | `content/modules/*.mdx` (catalogue) |
| `/modules/socle-ecoledigitale` | Static (SSG via `generateStaticParams`) | Custom par module (frontmatter) | `content/modules/socle-ecoledigitale.mdx` |
| `/modules/parcours-bts` | Static | idem | idem |
| `/modules/parcours-superieur` | Static | idem | idem |
| `/modules/proformation` | Static | idem | idem |
| `/modules/campus-live` | Static | idem | idem |
| `/demander-demo` | Static (formulaire client) | « Demander une démonstration — EcoleDigitale » | Hardcodé + Zod schema |
| `/confidentialite` | Static | « Confidentialité — EcoleDigitale » | `content/confidentialite.mdx` |

### Métadonnées exposées (Metadata API)

- `title`
- `description`
- `openGraph` (title, description, image, url, type='website', locale='fr_FR')
- `twitter` (card='summary_large_image')
- `alternates.canonical`
- `robots` (index/follow par défaut, noindex sur previews)

---

## 5. AnalyticsEvent

Représente une interaction tracée. **Pas persisté** côté site : envoyé à Plausible. Catalogue fermé.

Détail complet dans [contracts/analytics-events.contract.md](contracts/analytics-events.contract.md).

### Événements MVP (couverture FR-013)

| Event | Propriétés | Émis par |
|---|---|---|
| `Demo CTA Clicked` | `{ placement, sourcePage }` | `<CTAButton type="demo">` |
| `Module Selected In Form` | `{ moduleSlug }` | `<ModuleMultiSelect>` |
| `Demo Form Submitted` | `{ modules: string[], hasMessage: boolean, sourcePage }` | API success response |
| `Demo Form Submission Failed` | `{ reason: 'validation' \| 'network' \| 'server', sourcePage }` | API error / network catch |
| `Contact Channel Clicked` | `{ channel: 'whatsapp' \| 'email' \| 'phone' }` | `<ContactChannels>` |
| `Brochure Requested` | `{ sourcePage }` | (Phase 2 — déjà câblé) |

---

## 6. ContentBundle (interne)

Agrégat retourné par les loaders MDX. **Pas persisté.**

```ts
type ContentBundle<T> = {
  slug: string;
  frontmatter: T;
  body: MDXContent;
  raw: string;
};
```

Loaders concernés :
- `lib/content/modules.ts` → `ContentBundle<Module>[]`
- `lib/content/home.ts` → `ContentBundle<HomeFrontmatter>`
- `lib/content/legal.ts` → `ContentBundle<LegalFrontmatter>`

---

## Synthèse des relations

```text
Module (1..5)         ← frontmatter MDX, validé Zod, statiquement importé
   └─ utilisé par → Page (/, /modules, /modules/[slug])
                  → Lead.modulesOfInterest (sélection utilisateur)
                  → AnalyticsEvent (Module Selected In Form, Demo Form Submitted)

Page (8)              ← générée statiquement par Next.js
   └─ contient     → CTA[] (header, hero, inline, footer)
                  → DemoRequestForm (uniquement /demander-demo)
                  → ContactChannels (footer)

Lead                  ← runtime, validé Zod côté serveur
   └─ envoyé à     → LeadSink[] (Resend email + Log) — voir contracts/

AnalyticsEvent        ← runtime, envoyé à Plausible
```
