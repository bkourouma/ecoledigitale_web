# Brief éditorial — Hub /ressources EcoleDigitale

> Ce fichier est versionné et sert de référence aux éditeurs. Il n'est **pas
> publié** (préfixe `_` → ignoré par le chargeur de contenu).

## 1. Vue d'ensemble

Le hub `/ressources` publie trois types de contenu :

| Type | Dossier | URL | Usage SEO |
|------|---------|-----|-----------|
| Guide | `content/ressources/guides/` | `/ressources/guides/{slug}` | Requêtes informationnelles longues |
| Étude de cas | `content/ressources/etudes-de-cas/` | `/ressources/etudes-de-cas/{slug}` | Preuve sociale + conversion |
| Définition | `content/ressources/glossaire/` | `/ressources/glossaire/{slug}` | Requêtes « qu'est-ce que… » |

Les auteurs vivent dans `content/auteurs/{slug}.mdx`.

**Workflow de publication :**

1. Copier le template correspondant (`_TEMPLATE-GUIDE.mdx`, `_TEMPLATE-CASE-STUDY.mdx`
   ou `_TEMPLATE-GLOSSAIRE.mdx`) dans le bon dossier.
2. Renommer le fichier : le nom de fichier (sans `.mdx`) **doit** être le `slug`.
3. Remplir le frontmatter et rédiger le corps en MDX.
4. Lancer les vérifications locales (§6).
5. Ouvrir une pull request, faire relire, merger sur `main`.

**Aucun fichier `.ts` / `.tsx` n'est à modifier pour publier une ressource.**

## 2. Checklist avant publication

- [ ] Slug en kebab-case (`a-z`, `0-9`, tirets), descriptif, 3 à 60 caractères
- [ ] `slug` du frontmatter = nom du fichier
- [ ] `title` : 20 à 80 caractères, contient la requête cible
- [ ] `description` : 80 à 160 caractères, vendeuse (sert de meta description)
- [ ] `publishedAt` : date du jour au format `AAAA-MM-JJ` (ou date future pour planifier)
- [ ] `author` : correspond à un fichier existant dans `content/auteurs/`
- [ ] `personas` : 1 à 5 valeurs ; `tous` ne se combine pas avec d'autres
- [ ] `status: published` (laisser `draft` tant que la ressource n'est pas prête)
- [ ] Au moins un CTA explicite dans le corps (lien vers `/demander-demo` ou un module)
- [ ] Au moins un lien interne (autre ressource ou module) pour le maillage
- [ ] Sources externes citées et hyperliées (RNCP, France Compétences, ministère…)
- [ ] FAQ remplie si la ressource s'y prête (active les rich results Google)
- [ ] `relatedRessources` : 2 à 4 entrées vers des ressources **publiées**

## 3. Schéma frontmatter

### Champs communs à tous les types

| Champ | Requis | Contrainte |
|-------|:------:|-----------|
| `slug` | ✅ | kebab-case, 3-60 car., = nom de fichier |
| `title` | ✅ | 20-80 caractères |
| `description` | ✅ | 80-160 caractères |
| `type` | ✅ | `guides` \| `etudes-de-cas` \| `glossaire` (= dossier parent) |
| `status` | ⬜ | `draft` (défaut) \| `published` |
| `deprecated` | ⬜ | `true` \| `false` (défaut) |
| `publishedAt` | ✅ | `AAAA-MM-JJ` |
| `updatedAt` | ⬜ | `AAAA-MM-JJ`, ≥ `publishedAt` |
| `author` | ✅ | slug d'un auteur existant |
| `personas` | ✅ | 1-5 parmi `ecole-privee`, `lycee-bts`, `superieur`, `formation-pro`, `campus-live`, `tous` |
| `category` | ✅ | texte libre, 2-40 caractères |
| `seo.keywords` | ⬜ | 0-10 mots-clés |
| `seo.ogImage` | ⬜ | chemin commençant par `/` (sinon image générée automatiquement) |
| `faq` | ⬜ | 0-15 entrées `{ question, answer }` |
| `relatedRessources` | ⬜ | 0-8 entrées `{ type, slug }` |

### Champs spécifiques — étude de cas

`isFictional` (⬜, défaut `false`) + objet `caseStudy` :
`establishment`, `establishmentType`, `modulesActivated[]` (slugs de modules réels),
`testimonialAuthor`, `testimonialRole`.

### Champs spécifiques — glossaire

`term` (le terme défini) + `shortDefinition` (30-200 caractères). Corps ≤ 500 mots.

## 4. Structure recommandée du corps

### Guide (cible : 1500+ mots)

H1 = `title` (généré). Introduction (80-120 mots) → plusieurs `##` thématiques
→ `## Conclusion` avec CTA. Optionnel : encadré de ressources liées.

### Étude de cas

Encadré « En bref » → `## Contexte` → `## Défi` → `## Solution déployée` (modules)
→ `## Résultats mesurés` → `## Témoignage` signé. CTA vers `/demander-demo`.

### Définition (glossaire, < 500 mots)

H1 = `term`. Définition d'ouverture → 1-3 paragraphes de développement →
encadré « Voir aussi » (via `relatedRessources`) → CTA discret.

## 5. Bonnes pratiques rédactionnelles

- Phrases courtes (moins de 25 mots), voix active, une idée par paragraphe.
- Pas de jargon non défini — si un terme mérite une explication, créer une entrée
  de glossaire et la lier.
- Sources hyperliées en ligne, pas en notes de bas de page.
- Pas de promesse non étayée par le PRD ou le périmètre produit.

## 6. Vérifications locales avant la pull request

```bash
pnpm typecheck                 # échoue si le frontmatter est invalide
pnpm test:unit -- resources    # tests des chargeurs et schémas
pnpm dev                       # prévisualiser /ressources/{type}/{slug}
```

En cas de frontmatter invalide, le message d'erreur identifie le **fichier**, le
**champ** et la **règle** violée — corriger puis relancer.

## 7. Après le merge

1. Vercel déclenche un build automatique (3 à 5 min).
2. La ressource est accessible et apparaît dans `/ressources` et `/sitemap.xml`.
3. Google l'indexe sous 4 à 12 semaines — soumettre le sitemap dans la
   Search Console accélère le processus.
4. Suivre les impressions et clics par ressource dans la Search Console.

## 8. Déprécier une ressource

Pour retirer une ressource du listing sans casser ses liens entrants :

```yaml
deprecated: true
updatedAt: "AAAA-MM-JJ"   # date de la dépréciation
```

La ressource reste accessible (avec un bandeau « archivée »), sort du hub, et
garde une priorité basse dans le sitemap. Pour une suppression définitive,
supprimer le fichier et ajouter une redirection 301 dans `next.config.mjs`.
