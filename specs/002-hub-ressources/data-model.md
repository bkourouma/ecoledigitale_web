# Phase 1 — Data Model: Hub éditorial /ressources

**Date** : 2026-05-19
**Status** : Complete

Modèle de données pour les ressources éditoriales et les auteurs. Cohérent avec le pattern Zod de `lib/content/module.schema.ts`.

---

## Entités

```
┌──────────────────┐         ┌──────────────────┐
│     Resource     │ N ────► │      Author      │
│  (3 sous-types)  │         │                  │
└──────────────────┘         └──────────────────┘
        │  N
        ▼
   ┌──────────┐
   │ Persona  │  (enum fermée)
   └──────────┘
        │  N
        ▼
   ┌──────────────────┐
   │ relatedResources │  (réf croisée vers Resource)
   └──────────────────┘
```

---

## 1. Persona (enum fermée)

Cible métier d'une ressource. Une ressource peut cibler 1+ personas.

```ts
export const RESOURCE_PERSONAS = [
  'ecole-privee',     // Direction d'école privée primaire/secondaire
  'lycee-bts',        // Direction d'institut BTS/post-BTS
  'superieur',        // Direction d'établissement post-bac (hors BTS)
  'formation-pro',    // Responsable d'organisme de formation pro
  'campus-live',      // Responsable d'organisme de cours en ligne
  'tous',             // Transverse (utile pour les guides généralistes)
] as const;

export const PersonaSchema = z.enum(RESOURCE_PERSONAS);
export type Persona = z.infer<typeof PersonaSchema>;
```

**Invariants** :
- Si `personas` contient `'tous'`, il NE DOIT PAS contenir d'autre valeur (warning au build).
- Au moins 1 persona par ressource.

---

## 2. ResourceType (enum fermée)

Type d'une ressource. Détermine l'URL, le composant de rendu, le badge visuel.

```ts
export const RESOURCE_TYPES = ['guides', 'etudes-de-cas', 'glossaire'] as const;
export const ResourceTypeSchema = z.enum(RESOURCE_TYPES);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;
```

**Labels d'affichage** (côté UI, hors schéma) :
| Slug | Label singulier | Label pluriel |
|---|---|---|
| `guides` | Guide | Guides |
| `etudes-de-cas` | Étude de cas | Études de cas |
| `glossaire` | Définition | Glossaire |

---

## 3. ResourceStatus

```ts
export const ResourceStatusSchema = z.enum(['draft', 'published']);
export type ResourceStatus = z.infer<typeof ResourceStatusSchema>;
```

| Status | Listé dans hub | Dans sitemap | URL accessible |
|---|---|---|---|
| `draft` | ❌ | ❌ | ❌ en prod / ✅ en preview&dev |
| `published` ET `publishedAt` ≤ now | ✅ | ✅ | ✅ |
| `published` ET `publishedAt` > now | ❌ | ❌ | ❌ en prod / ✅ en preview&dev |
| `deprecated: true` | ❌ | ✅ (priority basse) | ✅ avec banner |

---

## 4. Resource (schéma frontmatter MDX)

Cœur de la feature. Un fichier `content/ressources/{type}/{slug}.mdx` produit un objet `Resource`.

```ts
export const ResourceFrontmatterBaseSchema = z.object({
  // Identité
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case (a-z, 0-9, -)')
    .min(3)
    .max(60),
  title: z.string().trim().min(20).max(80),
  description: z.string().trim().min(80).max(160),  // sert aussi de meta description

  // Type et statut
  type: ResourceTypeSchema,
  status: ResourceStatusSchema.default('draft'),
  deprecated: z.boolean().default(false),

  // Dates (ISO 8601 — YYYY-MM-DD)
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  // Editorial
  author: z.string().trim().regex(/^[a-z0-9-]+$/),  // FK → Author.slug
  personas: z.array(PersonaSchema).min(1).max(5),
  category: z.string().trim().min(2).max(40),

  // SEO
  seo: z.object({
    keywords: z.array(z.string().trim().min(2).max(30)).max(10).optional(),
    ogImage: z.string().startsWith('/').optional(),
  }).default({}),

  // Optionnels
  faq: z.array(z.object({
    question: z.string().trim().min(10).max(200),
    answer: z.string().trim().min(20).max(800),
  })).max(15).optional(),

  relatedRessources: z.array(z.object({
    type: ResourceTypeSchema,
    slug: z.string().trim().regex(/^[a-z0-9-]+$/),
  })).max(8).optional(),
});
```

**Sous-schémas spécifiques au type** :

### 4.1 Guide (`type: 'guides'`)

```ts
export const GuideFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('guides'),
  // pas de champ supplémentaire au MVP — corps MDX libre, structure recommandée
  // dans le brief éditorial mais non contrainte par le schéma
});
```

### 4.2 Étude de cas (`type: 'etudes-de-cas'`)

```ts
export const CaseStudyFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('etudes-de-cas'),
  isFictional: z.boolean().default(false),  // si true → <FictionalCaseBanner />
  caseStudy: z.object({
    establishment: z.string().trim().min(2).max(80),       // ex. "Institut Saint-Exupéry"
    establishmentType: z.string().trim().min(2).max(40),   // ex. "Lycée BTS, 850 étudiants"
    modulesActivated: z.array(z.string().trim()).min(1),   // slugs des modules EcoleDigitale
    testimonialAuthor: z.string().trim().min(2).max(80),   // nom de la personne témoin
    testimonialRole: z.string().trim().min(2).max(80),     // fonction
  }),
});
```

**Validation cross-references** : chaque `modulesActivated[i]` DOIT exister dans `lib/content/module.schema.ts > MODULE_SLUGS`.

### 4.3 Définition glossaire (`type: 'glossaire'`)

```ts
export const GlossaryFrontmatterSchema = ResourceFrontmatterBaseSchema.extend({
  type: z.literal('glossaire'),
  term: z.string().trim().min(2).max(60),       // le terme défini (ex. "LMS")
  shortDefinition: z.string().trim().min(30).max(200),  // une phrase, sert d'extrait
  // Corps MDX = développement complet
});
```

**Contrainte** : corps MDX max 500 mots (vérifié au build via `getReadingTime(body).words ≤ 500`, warning au-delà).

### 4.4 Union discriminée

```ts
export const ResourceFrontmatterSchema = z.discriminatedUnion('type', [
  GuideFrontmatterSchema,
  CaseStudyFrontmatterSchema,
  GlossaryFrontmatterSchema,
]);

export type ResourceFrontmatter = z.infer<typeof ResourceFrontmatterSchema>;
```

---

## 5. Author (schéma frontmatter MDX)

Un fichier `content/auteurs/{slug}.mdx` produit un objet `Author`.

```ts
export const AuthorFrontmatterSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .min(3)
    .max(40),
  name: z.string().trim().min(2).max(60),         // "Marie Dupont"
  role: z.string().trim().min(2).max(80),         // "Consultante pédagogique"
  bio: z.string().trim().min(100).max(500),       // bio courte (présentation)
  expertise: z.array(z.string().trim().min(2).max(40)).min(1).max(8),

  // Optionnels
  photo: z.string().startsWith('/').optional(),
  linkedinUrl: z.string().url().optional(),
  email: z.string().email().optional(),
});

export type AuthorFrontmatter = z.infer<typeof AuthorFrontmatterSchema>;
```

**Note** : le corps MDX de l'auteur (au-delà du frontmatter) peut contenir une bio longue rendue dans la page auteur. Optionnel — si absent, seul le frontmatter est affiché.

---

## 6. Catalog (vue agrégée)

Pas une entité persistante, mais un type technique pour exposer le catalogue chargé en mémoire.

```ts
export interface ResourceBundle {
  frontmatter: ResourceFrontmatter;
  body: string;              // contenu MDX
  readingTime: { minutes: number; words: number; text: string };  // calculé
}

export interface AuthorBundle {
  frontmatter: AuthorFrontmatter;
  body: string;              // contenu MDX optionnel (bio longue)
}

export interface ResourceCatalog {
  resources: ResourceBundle[];        // toutes les ressources chargées
  authors: Map<string, AuthorBundle>; // index par slug
}
```

---

## 7. Validations cross-références (fonction `validateResourceCatalog`)

Appelée une fois après chargement initial, avant cache. Lève une `Error` au build avec message lisible.

| Règle | Sévérité | Message |
|---|---|---|
| Slug dupliqué dans un même type | **Error** | `Resource catalog: duplicate slug "{slug}" in type "{type}"` |
| `author` référencé inexistant dans `authors/` | **Error** | `Resource "{slug}" references unknown author "{author}"` |
| `personas` contient `'tous'` + autres valeurs | **Warning** + auto-clean (garde `'tous'` seul) | `Resource "{slug}": "tous" cannot be combined; using "tous" only` |
| `relatedRessources[]` pointe vers `{type, slug}` inexistant | **Error** | `Resource "{slug}" has invalid related "{type}/{slug}"` |
| `relatedRessources[]` pointe vers ressource `draft` ou `deprecated` | **Warning** + omission au rendu | `Resource "{slug}" references draft/deprecated "{relType}/{relSlug}", will be hidden` |
| Étude de cas : `modulesActivated[]` contient un slug inexistant dans `MODULE_SLUGS` | **Error** | `Case study "{slug}": unknown module "{moduleSlug}"` |
| `status: 'published'` mais `publishedAt` absent | Impossible par Zod (publishedAt requis) | — |
| `updatedAt < publishedAt` | **Error** | `Resource "{slug}": updatedAt ({u}) < publishedAt ({p})` |
| Glossaire : corps > 500 mots | **Warning** | `Glossary entry "{slug}" body exceeds 500 words ({n})` |

---

## 8. State transitions

Une ressource a un seul état persistant (`status` + `deprecated` + dates) — il n'y a pas de workflow d'approbation au MVP. Transition typique :

```
[fichier MDX créé, status: 'draft']
       │
       ▼
[review humaine, status: 'draft', visible en preview]
       │
       ▼
[merge sur main, status: 'published', publishedAt = today]
       │
       ▼
[mise à jour ultérieure, updatedAt = update_date]
       │
       ▼
[plus à jour, deprecated: true]
```

**Pas de soft-delete** : pour retirer une ressource, on commit la suppression du fichier MDX et on ajoute une redirection 301 dans `next.config.mjs` si l'URL avait du link equity (procédure documentée dans le brief éditorial).

---

## 9. Index de relations (pour requêtes O(1))

Le loader expose ces helpers (signature dans `contracts/content-loader.contract.md`) :

| Helper | Retour | Complexité |
|---|---|---|
| `getAllResources()` | `ResourceBundle[]` | O(1) après cache |
| `getResourceBySlug(type, slug)` | `ResourceBundle \| undefined` | O(n) → optimisable en `Map<typeSlug, ResourceBundle>` |
| `getResourcesByAuthor(authorSlug)` | `ResourceBundle[]` | O(n) (acceptable < 100 ressources) |
| `getResourcesByPersona(persona)` | `ResourceBundle[]` | O(n) |
| `filterResources({ persona?, type? })` | `ResourceBundle[]` | O(n) |
| `getAuthor(slug)` | `AuthorBundle \| undefined` | O(1) (Map) |
| `getAllAuthorSlugs()` | `string[]` | O(1) |

Toutes ces fonctions sont **synchrones** (le contenu est déjà en mémoire après le premier chargement).

---

## 10. Compatibilité avec les builders JSON-LD existants

Tous les types ci-dessus sont conçus pour s'injecter directement dans les builders `lib/seo/jsonld.ts` :

| Builder existant ou à ajouter | Input attendu depuis le data model |
|---|---|
| `buildArticle()` (existant) | `{ headline: frontmatter.title, description: frontmatter.description, path: '/ressources/{type}/{slug}', datePublished: frontmatter.publishedAt, dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt, authorName: author.name, image: frontmatter.seo.ogImage }` |
| `buildBreadcrumbList()` (existant) | Pour ressource : `[Accueil, Ressources, {TypeLabel}, {title}]` |
| `buildFaqPage()` (existant) | `frontmatter.faq` (filtré non vide) |
| `buildPerson()` (**à ajouter**) | `{ name: author.name, jobTitle: author.role, description: author.bio, path: '/auteurs/{slug}', image: author.photo, sameAs: author.linkedinUrl ? [author.linkedinUrl] : undefined }` |

---

## 11. Volumes attendus

| Entité | MVP | 6 mois | 12 mois (limite raisonnable) |
|---|---|---|---|
| Guides | 2 | 12-15 | 30 |
| Études de cas | 1 (template) | 3-5 | 10 |
| Glossaire | 5 | 15-20 | 40 |
| Auteurs | 1 | 3-5 | 8 |
| **Total resources** | **8** | **30-40** | **80** |

À 80 ressources, on évalue : pagination du hub, recherche interne, taxonomie `category` consolidée en enum.
