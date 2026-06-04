# Phase 0 — Research: Hub éditorial /ressources

**Date** : 2026-05-19
**Status** : Complete — toutes les zones d'inconnu techniques sont tranchées.

Ce document consolide les décisions techniques argumentées de la feature 002 avant la phase de design (Phase 1).

---

## R-001 — Bibliothèque de calcul du temps de lecture

**Decision** : adopter la bibliothèque `reading-time` (npm) v1.5+.

**Rationale** :
- Pondérée pour textes français (200-250 mots/min par défaut, configurable).
- API minimaliste : `readingTime(text, { wordsPerMinute: 220 })` → `{ minutes, words, time, text }`.
- ~3 kB minifié, 0 dépendance transitive, MIT.
- Maintenue, ~6M téléchargements/semaine, utilisée par dev.to et Gatsby.
- Sait gérer le markdown brut (ignore le markup pour le comptage).

**Alternatives évaluées** :
- **Implémentation maison** (`body.split(/\s+/).length / 220`) — rejetée : il faut tokenizer proprement, ignorer le markup MDX (composants JSX, code blocks), normaliser les chiffres. Le gain est inexistant face à 3 kB.
- **`@miyauci/readtime`** — moins maintenu, pas de tests pour le français.
- **Calcul côté MDX via plugin remark** — overengineering pour le besoin.

**Impact** :
- Ajouter `reading-time` à `package.json` (`pnpm add reading-time`).
- Wrapper `lib/content/reading-time.ts` qui expose `getReadingTime(mdxBody: string): { minutes: number, words: number, text: string }`.
- Le résultat est calculé au build dans le loader (cache process), pas recalculé à chaque render.

---

## R-002 — Implémentation des filtres du hub côté serveur

**Decision** : filtres exprimés via `searchParams` Next.js (RSC reçoit `searchParams` en props), formulaire HTML natif `<form method="GET">` côté `ResourceFilters.tsx`. Aucun JavaScript client supplémentaire.

**Rationale** :
- Préserve le score Lighthouse Performance (pas de bundle JS additionnel).
- Cohérent avec l'architecture RSC-first du projet.
- URL bookmarkable et partageable (`/ressources?persona=lycee-bts&type=guides`).
- Pas de state management à maintenir.
- Compatible avec `generateStaticParams` impossible (les combinaisons de filtres ne sont pas statiques), mais Next.js sert quand même la page comme statique-equivalent grâce au cache de fetch.

**Alternatives évaluées** :
- **Filtres avec `useState` côté client** — rejeté : nécessite "use client", ajoute JS, casse l'argument RSC.
- **Server Actions** — rejeté : overhead inutile, GET est sémantiquement plus juste pour un filtre.
- **Routes statiques par combinaison** (`/ressources/lycee-bts/guides`) — rejeté : explosion combinatoire (5 personas × 3 types = 15 routes statiques juste pour les filtres, sans compter "tous"), gérer "tous" pollue l'URL.

**Mise en œuvre** :
```tsx
// app/(marketing)/ressources/page.tsx
export default async function HubPage({
  searchParams,
}: {
  searchParams: Promise<{ persona?: string; type?: string }>;
}) {
  const { persona, type } = await searchParams;
  const resources = filterResources(loadAllResources(), { persona, type });
  return <Hub resources={resources} currentPersona={persona} currentType={type} />;
}
```

```tsx
// components/ressources/ResourceFilters.tsx (Server Component)
<form method="GET" action="/ressources" className="...">
  <select name="persona" defaultValue={currentPersona ?? ''}>...</select>
  <select name="type" defaultValue={currentType ?? ''}>...</select>
  <button type="submit">Filtrer</button>
  {(currentPersona || currentType) && (
    <a href="/ressources">Réinitialiser</a>
  )}
</form>
```

**Impact** : zéro KB JS client ajouté par cette feature.

---

## R-003 — Structure d'URL pour les types de ressources

**Decision** : `/ressources/{type}/{slug}` avec `type ∈ {guides, etudes-de-cas, glossaire}`.

**Rationale** :
- Isole les namespaces par type : un slug `lms` peut coexister entre `/ressources/guides/lms` et `/ressources/glossaire/lms`.
- Sémantiquement clair pour le visiteur et pour Google (le path traduit la nature du contenu).
- Routes Next.js : un seul `[type]/[slug]/page.tsx` dynamique + `generateStaticParams` pour figer la liste au build.

**Alternatives évaluées** :
- **`/ressources/{slug}` plat avec préfixe dans le slug** (`/ressources/guide-lms`, `/ressources/glossaire-lms`) — rejeté : breadcrumb moins propre, plus difficile à filtrer par type, slug pollué.
- **Sous-domaines (`guides.ecoledigitale.fr`)** — rejeté : dilution de l'autorité de domaine.
- **Routes séparées non groupées** (`/guides/{slug}`, `/etudes-de-cas/{slug}`) — rejeté : pas de hub commun crédible.

**Validation des `type` au runtime** : enum Zod `ResourceTypeSchema = z.enum(['guides', 'etudes-de-cas', 'glossaire'])`. Si un visiteur tape `/ressources/invalide/foo`, → `notFound()`.

---

## R-004 — Gestion des ressources `deprecated`

**Decision** : champ optionnel `deprecated: boolean` (default `false`) dans le frontmatter. Comportements :

| Surface | Si `deprecated: true` |
|---|---|
| URL `/ressources/{type}/{slug}` | Reste accessible (200), avec un `<DeprecatedBanner />` en haut |
| Hub `/ressources` (listing) | **Exclue** du listing |
| Sitemap | **Reste incluse** avec `priority: 0.3` (vs 0.5/0.7 normal) — préserve le link equity sans inviter Google à la favoriser |
| JSON-LD `Article` | Inclut `dateModified` à la date de dépréciation (frontmatter), permettant à Google de comprendre la fraîcheur |
| `relatedRessources` pointant vers une deprecated | Warning au build + omission silencieuse du rendu |

**Rationale** :
- Préserve les backlinks externes éventuels (link equity).
- Évite les 404 sur des URLs partagées.
- Signale honnêtement au visiteur qu'il consulte du contenu daté.
- Permet une stratégie de redirection 301 future si on choisit de remplacer une deprecated par un guide à jour.

**Alternatives évaluées** :
- **Suppression dure** — rejeté : casse les liens externes, perd le link equity.
- **Redirection 301 systématique** — rejeté : nécessite de désigner une cible, pas toujours pertinent.

---

## R-005 — Génération d'OG image dynamique par ressource

**Decision** : convention Next.js `opengraph-image.tsx` au niveau de la route `/ressources/[type]/[slug]/`. Génère un PNG 1200×630 via `ImageResponse` avec le titre de la ressource, le badge type, et un dégradé brand-cohérent.

**Rationale** :
- Réutilise le pattern déjà en place pour `/modules/[slug]/opengraph-image.tsx`.
- Aucun travail manuel d'image par ressource (autonomie éditoriale, US-2).
- Le frontmatter peut overrider via `ogImage: '/images/og/{slug}.png'` si l'éditeur veut une image custom.

**Alternatives évaluées** :
- **Image statique obligatoire dans le frontmatter** — rejeté : friction pour l'éditeur, casse US-2.
- **Service externe (Cloudinary, Vercel OG)** — rejeté : déjà couvert par `ImageResponse` natif Next.js.

**Format visuel** :
- Fond : dégradé brand identique à `app/opengraph-image.tsx`
- Badge "Guide" / "Étude de cas" / "Glossaire" en haut à gauche
- Titre de la ressource (60 px, max 3 lignes)
- Footer : nom auteur + date

---

## R-006 — Stratégie d'invalidation du cache de build

**Decision** : revalidation à la build uniquement (SSG pur). Pas d'ISR au MVP.

**Rationale** :
- Le contenu MDX est versionné en git. Toute modification déclenche un re-build Vercel.
- Le rythme de publication cible (2/semaine) est largement compatible avec un re-build complet à chaque merge sur `main`.
- ISR ajoute une complexité (cache invalidation, debug) inutile à cette échelle.
- Si la fréquence dépasse 5/jour, on activera `export const revalidate = 3600` sur les routes concernées.

**Alternatives évaluées** :
- **ISR avec `revalidate: 60`** — rejeté : overkill pour 2 pubs/semaine.
- **On-demand revalidation via webhook GitHub** — rejeté : nécessite endpoint + secret, friction inutile vs déclencher un build.

---

## R-007 — Validation cross-références au build

**Decision** : implémenter une fonction `validateResourceCatalog(resources, authors)` appelée une seule fois après le chargement initial, qui vérifie :

1. Tous les `slug` sont uniques **par type** (collision inter-types autorisée).
2. Chaque `author` référencé existe dans le catalogue auteurs.
3. Chaque `persona` est dans l'enum.
4. Chaque `relatedRessources[]` pointe vers un slug qui existe (warning si `draft` ou `deprecated`, erreur si inexistant).
5. Aucune ressource `published` n'a `publishedAt` manquant.
6. `updatedAt` (si présent) est ≥ `publishedAt`.

**Rationale** :
- Pattern identique à `validateModuleCatalog` dans `lib/content/module.schema.ts` (cohérence).
- Fail-fast au build : impossible de déployer une ressource cassée en prod.
- Messages d'erreur lisibles (US-2, AC-2).

**Alternatives évaluées** :
- **Validation runtime page-par-page** — rejeté : trop tardif, l'erreur n'apparaît qu'au premier visiteur.
- **Schema Zod cross-document via `superRefine`** — possible mais Zod ne gère pas bien les références entre documents séparés. La validation impérative dans une fonction dédiée est plus claire.

---

## R-008 — Analytics : événement de clic CTA depuis une ressource

**Decision** : ajouter un événement Plausible `resource_cta_click` avec propriétés `resource_type` (guides|etudes-de-cas|glossaire), `resource_slug`, `cta_target` (demo|module|external). Réutilise le wrapper `track()` existant (`components/analytics/`).

**Rationale** :
- Permet de mesurer SC-006 (« 100% des leads démo issus du hub renseignent une ressource d'origine identifiable »).
- Peut être attribué à un cluster persona via le frontmatter de la ressource (jointure post-hoc en BI).
- Coût marginal : 1 event Plausible (gratuit), 0 KB JS additionnel (event déclenché côté handler de clic des CTAs existants).

**Alternatives évaluées** :
- **UTM params sur le CTA** — rejeté : pollue l'URL de destination, casse le partage de lien.
- **Aucun event spécifique** — rejeté : SC-006 ne serait pas mesurable.

---

## R-009 — Pages auteur et JSON-LD Person

**Decision** : créer une route `/auteurs/[slug]/page.tsx`. Chaque page expose :

- Header avec photo (si disponible), nom, fonction, bio courte
- Section "Domaines d'expertise" (liste de chips)
- Section "Ressources signées" (cartes ressources triées par date desc)
- JSON-LD `Person` avec : `name`, `jobTitle`, `description`, `url`, `image?`, `sameAs?` (LinkedIn)

**Rationale** :
- Signal E-E-A-T explicite (US-4).
- Page indexable par Google sur des requêtes type "[nom auteur] EcoleDigitale".
- Pattern réutilisable : ajouter un nouvel auteur = ajouter un fichier MDX.

**Builder JSON-LD `Person`** : à ajouter dans `lib/seo/jsonld.ts` :

```ts
export interface PersonInput {
  name: string;
  jobTitle?: string;
  description?: string;
  /** Path relatif à l'auteur, ex. /auteurs/marie-dupont */
  path: string;
  image?: string;
  sameAs?: readonly string[];
}

export function buildPerson(input: PersonInput) { /* ... */ }
```

---

## R-010 — Brief éditorial

**Decision** : fichier `content/ressources/_TEMPLATE-BRIEF.md` versionné en git, ignoré par le loader (filename commence par `_`). Contient :

1. Vue d'ensemble du workflow de publication
2. Schéma frontmatter complet avec contraintes et exemples
3. Instructions de structuration MDX par type
4. Check-list pré-publication (SEO, longueur, sources, CTA, persona)
5. Commande de validation locale (`pnpm typecheck && pnpm test:unit -- resources`)

**Rationale** :
- Cible SC-009 (« un éditeur technique nouvellement onboardé peut publier sa première ressource en moins de 2h »).
- Vit dans le repo : versionné, à jour, accessible offline.

**Impact loader** : `readdirSync(...).filter(f => f.endsWith('.mdx') && !f.startsWith('_'))` pour ignorer template et autres préfixés `_`.

---

## R-011 — Catégorie : champ libre vs enum

**Decision** : `category: z.string().trim().min(2).max(40)` (champ libre) au MVP.

**Rationale** :
- À 5-10 ressources, imposer un enum freine inutilement.
- À 30+ ressources, une taxonomie naturelle émerge — on convertit alors en enum.
- Champ non filtrable au MVP (filtres = persona + type), donc une valeur "exotique" ne casse rien.

**Alternative** : enum dès le départ avec valeurs `pedagogie | reglementation | outils | management | autres`. Rejeté car prématuré.

---

## R-012 — Pas de pagination, pas de recherche interne au MVP

**Decision** : confirmé dans la spec (Assumptions). À ~50 ressources, on revisitera.

**Rationale** : pagination = JS client ou navigation par params = complexité ajoutée pour 0 valeur tant que < 50 cartes. Pour la recherche interne, le coût est élevé (intégration Algolia/Pagefind/recherche serveur lourde) — Google fait office de moteur de recherche externe efficace.

---

## Récapitulatif des nouvelles dépendances

| Package | Version | Taille | Usage |
|---|---|---|---|
| `reading-time` | ^1.5.0 | ~3 kB | Calcul temps de lecture des ressources |

**Aucune autre dépendance ajoutée.** Tous les autres besoins sont couverts par les packages déjà installés (`zod`, `gray-matter`, `next-mdx-remote`, `next`, `react`).

---

## Risques identifiés non-techniques

Pour mémoire (déjà documentés dans la spec, section Dependencies) :

- **Risque #1 — capacité éditoriale** : sans 2 articles/mois minimum produits humainement, le hub livré reste vide. **Mitigation** : valider la ressource éditoriale avant de lancer `/speckit-tasks` et `/speckit-implement`.
- **Risque #2 — temps d'indexation Google** : un nouveau cluster d'URLs prend 4-12 semaines à se positionner. **Mitigation** : activer IndexNow (proposé en Pilier 2) et soumettre le sitemap dans GSC dès la mise en ligne.
- **Risque #3 — qualité éditoriale** : 2 guides médiocres = 0 ROI. **Mitigation** : brief éditorial (R-010) + review humaine avant merge.
