# Contract — Author frontmatter (MDX)

**Format** : YAML frontmatter en tête de chaque fichier `content/auteurs/{slug}.mdx`.
**Validation** : Zod (cf. `data-model.md` §5).
**Failure mode** : `next build` échoue si un auteur référencé par une ressource n'existe pas, ou si le frontmatter est invalide.

---

## Champs

| Champ | Type | Requis | Contraintes | Exemple |
|---|---|:-:|---|---|
| `slug` | string | ✅ | `^[a-z0-9-]+$`, 3-40 chars, == filename | `marie-dupont` |
| `name` | string | ✅ | 2-60 chars | `"Marie Dupont"` |
| `role` | string | ✅ | 2-80 chars | `"Consultante pédagogique, ex-directrice d'institut BTS"` |
| `bio` | string | ✅ | 100-500 chars (présentation courte) | `"15 ans dans l'éducation supérieure, dont 8 à la direction d'un institut BTS..."` |
| `expertise` | string[] | ✅ | 1-8 items, chaque 2-40 chars | `["Conduite du changement", "BTS", "Pédagogie inversée"]` |
| `photo` | string | ⬜ | path commençant par `/` | `/images/auteurs/marie-dupont.jpg` |
| `linkedinUrl` | string URL | ⬜ | URL valide | `"https://www.linkedin.com/in/marie-dupont/"` |
| `email` | string email | ⬜ | email valide | `"marie@example.fr"` |

---

## Corps MDX (optionnel)

Au-delà du frontmatter, le corps MDX peut contenir une **bio longue** (parcours, publications, conférences) rendue dans la page `/auteurs/{slug}`. Si absent, seul le frontmatter est affiché.

Pas de limite stricte de longueur, recommandation : 300-800 mots.

---

## Exemple complet

```mdx
---
slug: marie-dupont
name: "Marie Dupont"
role: "Consultante pédagogique, ex-directrice d'institut BTS"
bio: "15 ans dans l'éducation supérieure, dont 8 à la direction d'un institut BTS de 600 étudiants. Accompagne aujourd'hui les établissements dans leur transformation digitale."
expertise:
  - Conduite du changement
  - BTS et post-bac
  - Pédagogie inversée
  - Conformité RGPD éducation
photo: /images/auteurs/marie-dupont.jpg
linkedinUrl: "https://www.linkedin.com/in/marie-dupont/"
---

## Parcours

Diplômée d'un Master 2 en Sciences de l'éducation...

## Publications

- *Digitaliser un institut BTS*, EcoleDigitale, 2026
- ...
```

---

## Validation cross-références

- Toute ressource avec `author: marie-dupont` exige l'existence de `content/auteurs/marie-dupont.mdx`.
- Le slug du frontmatter DOIT == filename (sans `.mdx`).
- Si `linkedinUrl` est fourni, le builder `buildPerson()` l'inclura dans `sameAs[]`.
