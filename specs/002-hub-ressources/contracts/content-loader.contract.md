# Contract — Content loader API

**Localisation** : `lib/content/resources.ts` et `lib/content/authors.ts`.
**Pattern** : identique à `lib/content/modules.ts` (cache process-level, validation Zod, fail-fast au build).
**Synchronicité** : toutes les fonctions sont **synchrones** (lecture disque au premier appel, cache ensuite).

---

## `lib/content/resources.ts`

### Types exportés

```ts
import type { ResourceFrontmatter, ResourceType } from './resource.schema';

export interface ResourceBundle {
  frontmatter: ResourceFrontmatter;
  body: string;
  readingTime: { minutes: number; words: number; text: string };
}

export interface ResourceFilter {
  persona?: string;          // valeur de Persona ou string libre (ignorée si invalide)
  type?: ResourceType;
  includeDrafts?: boolean;   // default false en prod, true en dev/preview
  includeDeprecated?: boolean; // default false (sauf détail page)
}
```

### Fonctions exportées

```ts
/**
 * Charge le catalogue depuis disque (premier appel) ou retourne le cache.
 * Effets : validation Zod par fichier + validateResourceCatalog().
 * Lève au build si invalide.
 */
export function loadResources(): ResourceBundle[];

/**
 * Toutes les ressources publiées et non deprecated, triées par publishedAt desc.
 * Convient au listing du hub par défaut.
 */
export function getAllResources(): ResourceBundle[];

/**
 * Une ressource précise. Retourne undefined si introuvable.
 * Filtre statut selon l'environnement (en prod, masque draft et future).
 */
export function getResourceBySlug(
  type: ResourceType,
  slug: string
): ResourceBundle | undefined;

/**
 * Ressources signées par un auteur, triées par date desc.
 */
export function getResourcesByAuthor(authorSlug: string): ResourceBundle[];

/**
 * Filtres combinés. Si persona est invalide, ignoré.
 * Si filter vide, équivalent à getAllResources().
 */
export function filterResources(filter: ResourceFilter): ResourceBundle[];

/**
 * Slugs (par type) pour generateStaticParams.
 * Inclut tous les statuts en preview/dev, seulement published en prod.
 */
export function getStaticResourceParams(): Array<{ type: ResourceType; slug: string }>;

/** Utilitaire de tests. */
export function _resetResourcesCacheForTests(): void;
```

### Règles de chargement

1. Lecture récursive `content/ressources/{guides,etudes-de-cas,glossaire}/*.mdx`.
2. Skip fichiers commençant par `_` (template, drafts privés versionnés).
3. Pour chaque fichier :
   - `gray-matter(raw)` → `{ data, content }`
   - `ResourceFrontmatterSchema.parse(data)` (union discriminée)
   - Vérifier `slug === filename` et `type === parentDirName` (sinon erreur)
   - `getReadingTime(content)` → bundle
4. Concaténer en `ResourceBundle[]`
5. `validateResourceCatalog(bundles, authors)` (cf. §7 data-model)
6. Cache process-level

### Politique d'environnement

| Env | `draft` | `published`, publishedAt > now | `deprecated` |
|---|---|---|---|
| `production` | Masqué (loader filtre) | Masqué | Masqué du listing, visible en URL directe avec banner |
| `preview` (Vercel) | Visible | Visible | Visible avec banner |
| `development` (local) | Visible | Visible | Visible avec banner |

Politique reflétée par la lecture de `process.env.VERCEL_ENV` / `process.env.NODE_ENV`.

---

## `lib/content/authors.ts`

### Types exportés

```ts
import type { AuthorFrontmatter } from './author.schema';

export interface AuthorBundle {
  frontmatter: AuthorFrontmatter;
  body: string;  // bio longue MDX, ou string vide
}
```

### Fonctions exportées

```ts
export function loadAuthors(): AuthorBundle[];
export function getAuthor(slug: string): AuthorBundle | undefined;
export function getAllAuthorSlugs(): string[];
export function _resetAuthorsCacheForTests(): void;
```

### Règles de chargement

Identique au loader resources :
- `content/auteurs/*.mdx`
- Skip `_*.mdx`
- `AuthorFrontmatterSchema.parse(data)`
- `slug === filename` enforced
- Cache process-level

---

## `lib/content/reading-time.ts`

```ts
import readingTimeLib from 'reading-time';

export interface ReadingTimeResult {
  minutes: number;       // 4 (entier)
  words: number;         // 850
  text: string;          // "4 min de lecture" (français)
}

/**
 * Calcule le temps de lecture d'un body MDX.
 * Base : 220 mots/min (rythme français moyen).
 * Renvoie le texte localisé en français.
 */
export function getReadingTime(body: string): ReadingTimeResult;
```

Le texte est formaté en français : `"1 min de lecture"`, `"7 min de lecture"`. La lib `reading-time` retourne l'anglais par défaut, on remplace via formatage manuel.

---

## Contrats d'erreur (messages au build)

Tous les messages d'erreur DOIVENT :
- Identifier le **fichier** concerné (chemin relatif)
- Identifier le **champ** ou la **règle** violé(e)
- Être **lisibles** sans connaissance de Zod

**Mauvais exemple** (à éviter) :
```
ZodError: { "code": "too_small", "minimum": 20, "type": "string", "inclusive": true, "exact": false, "message": "String must contain at least 20 character(s)", "path": ["title"] }
```

**Bon exemple** (cible) :
```
Invalid resource frontmatter in content/ressources/guides/digitaliser-bts.mdx:
  - title: 18 caractères (minimum 20). Reformuler pour un titre plus descriptif.
```

Helper de formatage à implémenter dans `lib/content/resource.schema.ts` (équivalent à celui de `module.schema.ts`).
