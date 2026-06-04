# Contract — Module MDX Content

**Source** : `content/modules/*.mdx`

**Validation** : `lib/content/module.schema.ts` (Zod), exécutée au **build time**. Un fichier invalide fait échouer le build.

## Frontmatter (YAML)

```yaml
---
slug: parcours-bts                            # kebab-case, == nom du fichier sans .mdx
name: Parcours BTS                            # 2-40 caractères
tagline: Piloter un cycle BTS de l'inscription au bulletin.   # 30-120 caractères
type: optionnel                               # 'socle' | 'optionnel'
order: 2                                      # entier ≥ 1, unique dans le catalogue
headline: >                                   # 50-200 caractères, promesse principale
  Une plateforme dédiée aux établissements proposant un cycle BTS,
  de la configuration des filières aux bulletins consolidés.
benefits:                                     # 3-8 items, chacun 20-160 caractères
  - Configuration complète des filières, niveaux et programmes BTS
  - Suivi automatisé des notes, coefficients et bulletins
  - Visibilité financière par cycle et par étudiant
  - Espaces dédiés étudiant, enseignant et parent
features:                                     # 4-12 items, chacun 10-120 caractères
  - Configuration des filières, niveaux, classes, programmes
  - Cours, enseignants, coefficients, heures
  - Évaluations, notes, moyennes, bulletins
  - Présences, devoirs, progression pédagogique
  - Paiements, frais par cycle, reporting financier
  - Espaces étudiant / enseignant / parent
audiences:                                    # sous-ensemble de l'enum
  - director
  - academic
  - admin
  - teacher
  - student
  - parent
seo:
  title: Logiciel de gestion BTS — Parcours BTS | EcoleDigitale   # ≤ 60 caractères
  description: Plateforme complète pour piloter votre cycle BTS — cours, notes, bulletins, paiements et reporting. Demandez une démonstration.   # 120-160 caractères
  ogImage: /images/og/parcours-bts.png
cta:
  label: Demander une démonstration            # texte CTA principal de la page
  target: demo                                 # 'demo' | 'modular-offer' | 'contact'
---
```

## Body MDX

Le corps du fichier contient des **sections optionnelles** rendues par des composants typés. Sections supportées :

```mdx
<ModuleHero />            <!-- rend headline + tagline + cta -->

<ModuleBenefits />        <!-- rend benefits sous forme de cartes -->

<ModuleFeatures />        <!-- rend features en liste structurée -->

<ModuleAudiences />       <!-- rend audiences avec icônes -->

## Cas d'usage         <!-- titre libre + paragraphes libres -->

Un responsable BTS peut configurer en moins d'une journée...

<CalloutFinalCTA />       <!-- CTA final + lien WhatsApp -->
```

Les composants MDX disponibles sont **whitelistés** dans `app/mdx-components.tsx`. Aucun HTML brut potentiellement dangereux n'est autorisé (pas de `<script>`, pas de `dangerouslySetInnerHTML`).

## Audience enum

```ts
type Audience =
  | 'director'    // Directeur / fondateur
  | 'academic'    // Responsable pédagogique / académique
  | 'admin'       // Responsable administratif / financier
  | 'teacher'     // Enseignant
  | 'student'     // Étudiant
  | 'parent'      // Parent
  | 'trainer'     // Formateur (formation pro)
  | 'owner';      // Propriétaire d'établissement
```

## Règles cross-modules (validées au build)

1. **Exactement 5 modules** au MVP.
2. **Exactement 1 module avec `type: socle`** (= `socle-ecoledigitale`).
3. **`slug` unique et conforme** à la liste : `socle-ecoledigitale`, `parcours-bts`, `parcours-superieur`, `proformation`, `campus-live`.
4. **`order` unique** sur l'ensemble du catalogue.
5. **`seo.ogImage` doit pointer vers un fichier existant** dans `public/`.
6. **Aucune fonctionnalité listée** ne doit promettre quelque chose hors du PRD (revue manuelle au merge — Constitution II).

## Erreurs typiques

| Erreur | Message attendu |
|---|---|
| `slug` ne correspond pas au nom de fichier | `Module file parcours-bts.mdx has slug "bts-parcours" — must match filename.` |
| 2 modules `type: socle` | `Multiple "socle" modules found: socle-ecoledigitale, parcours-bts. Exactly one expected.` |
| `seo.title` > 60 caractères | `seo.title is 67 chars — max 60 for SERP display.` |
| `features` < 4 items | `features must contain 4-12 items, got 3.` |
| `ogImage` introuvable | `ogImage "/images/og/missing.png" does not exist in public/.` |

## Tests d'acceptation

- Le build échoue avec un message clair si un module viole le schéma.
- `lib/content/modules.ts` retourne toujours un tableau de 5 modules triés par `order`.
- `generateStaticParams` pour `/modules/[slug]/page.tsx` retourne les 5 slugs.
- La page `/modules` affiche les 5 cartes dans l'ordre attendu.
