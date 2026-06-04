# Contract — Brief éditorial (livrable in-repo)

**Localisation** : `content/ressources/_TEMPLATE-BRIEF.md` (ignoré par le loader car commence par `_`).

**Rôle** : permettre à un éditeur technique de publier sa première ressource en **moins de 2 heures** (SC-009) sans intervention d'un développeur frontend.

---

## Structure attendue du fichier

```markdown
# Brief éditorial — Hub /ressources EcoleDigitale

> Ce fichier est versionné, mis à jour avec les conventions, et n'est PAS publié.

## 1. Vue d'ensemble

- Où vit le contenu : `content/ressources/{type}/{slug}.mdx`
- Trois types : guides, etudes-de-cas, glossaire
- Workflow : créer un fichier → frontmatter + corps → `pnpm typecheck` → `pnpm dev` pour preview → PR → review → merge
- Aucun fichier .ts/.tsx à modifier

## 2. Checklist avant publication

- [ ] Slug en kebab-case, descriptif, < 60 chars
- [ ] Title 20-80 chars, contient la requête cible
- [ ] Description 80-160 chars, vendeuse + CTA implicite
- [ ] publishedAt = date du jour (ou future si planification)
- [ ] author existe dans content/auteurs/
- [ ] personas : 1-5, jamais "tous" + autre
- [ ] Au moins 1 CTA explicite dans le corps (lien vers /demander-demo ou /modules/...)
- [ ] Au moins 1 lien interne vers une autre ressource ou module (maillage)
- [ ] Sources externes citées (lien vers RNCP, ministère, France Compétences, etc.)
- [ ] FAQ remplie si la ressource y prête (boost rich results)
- [ ] relatedRessources : 2-4 entrées si possible

## 3. Schéma frontmatter complet

[Tableau des champs avec contraintes et exemples — extrait depuis resource-frontmatter.contract.md]

## 4. Structure recommandée par type

### Guides (cible : 2000+ mots)

- H1 (= title)
- Intro 100 mots (pose le problème)
- H2 — Section 1 (avec H3 sous-points)
- H2 — Section 2
- ...
- H2 — Conclusion + CTA
- (optionnel) Encadré "Ressources liées"

### Études de cas

- H1 (= title)
- Encadré "En bref" (établissement, taille, modules activés)
- H2 — Contexte
- H2 — Défi initial
- H2 — Solution déployée (avec modules)
- H2 — Résultats mesurés
- H2 — Témoignage signé
- CTA "Discuter de votre établissement"

### Glossaire (< 500 mots)

- H1 (= terme)
- Définition courte (paragraphe d'ouverture)
- Explication développée (max 3 paragraphes)
- Encadré "Voir aussi" (relatedRessources)
- CTA discret en pied

## 5. Bonnes pratiques rédactionnelles

- Phrases courtes (< 25 mots).
- Voix active.
- Une idée par paragraphe.
- Pas de jargon non défini (sinon → entrée glossaire).
- Sources hyperliées en ligne, pas en notes de bas de page.

## 6. Tests locaux avant PR

```bash
pnpm typecheck                              # erreur si frontmatter invalide
pnpm test:unit -- resources                 # tests des loaders
pnpm dev                                    # ouvrir /ressources/{type}/{slug} en local
```

## 7. Que se passe-t-il après le merge ?

1. Vercel build automatique (3-5 min)
2. Ressource accessible à `https://ecoledigitale.fr/ressources/{type}/{slug}`
3. Apparaît dans /sitemap.xml automatiquement
4. Google indexe sous 4-12 semaines (accélère avec IndexNow → cf. Pilier 2 SEO)
5. Suivre les impressions/clics dans Google Search Console
```

---

## Contrat de mise à jour

Tout changement du schéma `ResourceFrontmatter` DOIT être reflété dans ce brief dans la même PR. Le brief est la **source de vérité utilisateur** ; le schéma Zod est la source de vérité machine. Les deux doivent rester synchrones.

Une checklist de PR à ajouter dans `.github/PULL_REQUEST_TEMPLATE.md` (si le projet l'adopte) :

```markdown
- [ ] Si modification de resource.schema.ts ou author.schema.ts → mise à jour de _TEMPLATE-BRIEF.md
```
