---
name: EcoleDigitale
description: Un cahier d'écolier ouvert sur le pupitre : page Seyès pour lire, ardoise pour les temps forts, plume qui écrit pendant la navigation.
colors:
  primary-500: "#3f51b0"
  primary-600: "#2c3c96"
  primary-700: "#1f2d7a"
  primary-800: "#172363"
  primary-950: "#0b1235"
  accent-500: "#3a8f5c"
  accent-700: "#235b3a"
  pen-500: "#d13b30"
  pen-700: "#962620"
  marker: "#ffe45c"
  marker-soft: "#fff1a6"
  paper: "#fcfbf6"
  surface-muted: "#f0efe6"
  ink: "#181d45"
  ink-muted: "#3c4266"
  ink-soft: "#565c7e"
  line: "#cfd5ec"
  board: "#23312b"
  board-deep: "#18211d"
  board-line: "#3a4a42"
  chalk: "#f4f2ea"
  chalk-dim: "#c5ccc3"
  chalk-yellow: "#f5dc7a"
  chalk-blue: "#a4c8e8"
  chalk-pink: "#f2aaa3"
  oak-300: "#d4a76b"
  oak-500: "#a9763f"
  oak-700: "#7a5128"
  oak-900: "#52361a"
  neutral-100: "#eeeee7"
typography:
  display:
    fontFamily: "Caveat, 'Segoe Print', 'Comic Sans MS', cursive"
    fontSize: "clamp(3.25rem, 6.8vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "0"
  headline:
    fontFamily: "Caveat, 'Segoe Print', 'Comic Sans MS', cursive"
    fontSize: "clamp(2.25rem, 4.2vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0"
  body:
    fontFamily: "Andika, 'Trebuchet MS', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  annotation:
    fontFamily: "'La Belle Aurore', 'Segoe Script', cursive"
    fontSize: "max(1.375rem, 1em)"
    fontWeight: 400
    lineHeight: 1.3
  button:
    fontFamily: "Caveat, 'Segoe Print', 'Comic Sans MS', cursive"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
rounded:
  stamp: "6px"
  paper: "6px"
  board-frame: "8px"
  board-surface: "3px"
spacing:
  unit: "1.75rem"
  section: "6rem"
  container-content: "72rem"
  container-wide: "84rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-700}"
    textColor: "{colors.paper}"
    rounded: "{rounded.stamp}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-600}"
  button-chalk:
    backgroundColor: "{colors.chalk-yellow}"
    textColor: "{colors.board-deep}"
    rounded: "{rounded.stamp}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary-800}"
    rounded: "{rounded.stamp}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 20px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "24px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "10px 12px"
  board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.board-frame}"
    padding: "16px"
---

# Design System: EcoleDigitale

## Overview

**Creative North Star: "Le cahier ouvert sur le pupitre"**

Le site est un cahier d'écolier posé sur un pupitre. La page Seyès (papier blanc cassé, lignes bleu-violet, marge rouge) sert à lire. L'ardoise, dans son cadre de chêne, porte les temps forts. La plume écrit pendant que l'on navigue : curseur en plume, traînée d'encre, taches au clic. Le monde a été choisi par l'utilisateur (« style écolier : page de cahier avec des traits, section ardoise, souris plume à l'ancienne ») et remplace l'ancien look SaaS bleu et émeraude.

La voix est chaleureuse et lisible : les titres sont manuscrits à l'encre bleu-nuit, les remarques sont de la main du professeur en stylo rouge, le texte courant est en Andika, une police conçue pour l'apprentissage de la lecture. Les boutons sont des tampons encreurs, le pied de page est la couverture bleue du cahier avec son étiquette « Ce cahier appartient à ». Le site refuse le gabarit SaaS : hero dégradé, maquette de tableau de bord, grilles de cartes à icônes. Il ne contient ni témoignage ni chiffre client inventé.

Le mode sombre n'existe pas : la variante `dark` est liée à une classe et ne s'active jamais par les préférences du système.

**Key Characteristics:**

- Fond de page à lignes (pas de 1.75rem), marge rouge fixe à gauche, contenu décalé à droite de la marge.
- Titres manuscrits (Caveat) en encre bleu-nuit, emphase au surligneur jaune.
- Ombres de papier : posées, jamais flottantes. Aucune lueur.
- Légères rotations (-1.2deg à 0.8deg) sur tampons, notes et fiches, qui se redressent au survol.
- Ardoise vert-noir, craie blanche ou jaune, rebord de chêne avec plumier de craie.

## Colors

Une palette d'école : encre bleu-nuit sur papier crème, stylo rouge du professeur, surligneur jaune, ardoise vert-noir et chêne. Les teintes sont chaudes ou froides mais jamais néon.

### Primary

- **Encre bleu-nuit** (primary-700, `{colors.primary-700}`) : fond des tampons, bordures de formulaire actives, soulignement tracé à la plume. Titres en primary-800. Le focus utilise primary-500.

### Secondary

- **Crayon vert** (accent-500, accent-700) : validations et coches uniquement.
- **Stylo rouge du professeur** (pen-500, pen-700) : annotations manuscrites (`red-note`), champs en erreur, marge du cahier (rouge à 55 % d'opacité).

### Tertiary

- **Surligneur** (marker, marker-soft) : emphase d'un groupe de mots, sélection de texte, survol du bouton secondaire, adhésif du scotch.

### Neutral

- **Papier** (paper) : fond de page et surfaces. Fiches en blanc pur.
- **Encre / encre atténuée / encre douce** (ink, ink-muted, ink-soft) : texte courant, secondaire, placeholder.
- **Ligne de cahier** (line) : bordures des fiches.
- **Ardoise** (board, board-deep, board-line), **craie** (chalk, chalk-dim, chalk-yellow, chalk-blue, chalk-pink), **chêne** (oak-300 à oak-900) : l'ardoise et son cadre.
- **Graphite** (neutral-\*) : rail de défilement et états désactivés.

### Named Rules

**The Ink Swap Rule.** Dans `board` et `cover`, les variables `ink`, `ink-muted`, `ink-soft` et `line` sont réaffectées en craie ou en papier clair : le texte courant se comporte pareil partout. Une fiche posée sur l'ardoise rouvre le papier avec `paper-reset` ou `label-card`.

**The One Highlighter Rule.** Le surligneur jaune marque l'emphase d'un groupe de mots, jamais un fond de bloc entier.

**The Teacher's Red Rule.** Le rouge est réservé à la main du professeur (annotations), à la marge et aux erreurs.

## Typography

**Display Font:** Caveat (avec Segoe Print, Comic Sans MS, cursive)
**Body Font:** Andika (avec Trebuchet MS, system-ui, sans-serif)
**Annotation Font:** La Belle Aurore (avec Segoe Script, cursive)

**Character:** L'écriture manuscrite pour les titres et les boutons, une sans-serif ouverte et très lisible pour lire longtemps, une cursive plus ancienne pour les remarques du professeur.

### Hierarchy

- **Display** (Caveat 700, clamp(3.25rem, 6.8vw, 5.5rem), 0.98) : titre de l'accueil, écrit à la plume (`written`). Variantes `display-md` (3 à 4.5rem) et `display-sm` (2.25 à 3.25rem, 1.05).
- **Headline** (Caveat 700, display-sm) : titres de section.
- **Body** (Andika 400, 1.0625rem, 1.7) : texte courant. Gras en 700. Mesure confortable, `max-w-prose` pour les chapeaux.
- **Annotation** (La Belle Aurore 400, max(1.375rem, 1em), 1.3, rotation -2deg) : remarques en stylo rouge (« Très bien »), courtes.
- **Button label** (Caveat 700, 1.125 à 1.5rem, interligne 1) : libellé des tampons.

### Named Rules

**The Three Hands Rule.** Caveat écrit les titres et boutons, Andika lit, La Belle Aurore annote. Aucune autre famille.

**The Short Scrawl Rule.** La cursive La Belle Aurore ne porte que quelques mots, jamais un paragraphe.

## Layout

Un seul flux de lecture sur la page de cahier. Conteneurs `container-content` (72rem) et `container-wide` (84rem), centrés, avec un remplissage gauche plus large (1.75rem, 2.5rem, 3.5rem selon 640px et 1024px) qui dégage la marge rouge, située à 12px du bord (2.1rem dès 1024px). Le rythme vertical suit le pas de ligne `--unit` (1.75rem), les sections respirent à 6rem. Les fiches et blocs s'inclinent légèrement pour casser la grille sans la rompre. Sur mobile, tout passe en une colonne ; le cadre de chêne passe de 16px à 10px.

## Elevation & Depth

Le système est hybride : des ombres de papier posées (jamais de lueur diffuse) et des couches matérielles (papier sur papier, scotch sur fiche, ardoise dans son cadre). La profondeur vient de la matière : bords nets, contact marqué, ombre basse décalée.

### Shadow Vocabulary

- **Fiche posée** (`0 1px 1px rgba(24,29,69,.07), 0 8px 16px -8px rgba(24,29,69,.22)`) : `shadow-card`, cartes au repos.
- **Fiche soulevée** (`0 2px 3px rgba(24,29,69,.1), 0 16px 26px -10px rgba(24,29,69,.3)`) : `shadow-card-hover`.
- **Bulletin collé** (`0 3px 6px rgba(24,29,69,.12), 0 22px 36px -14px rgba(24,29,69,.34)`) : `shadow-elevated`, sur `sheet`.
- **Tampon** (`0 2px 0 primary-950, 0 10px 18px -8px rgba(24,29,69,.55)`) : tranche d'encre sous le bouton, qui s'écrase à l'appui.
- **Anneau de focus** (`0 0 0 3px rgba(63,81,176,.28)`) : `shadow-brand`.

### Named Rules

**The Resting Paper Rule.** Une ombre est une feuille posée : contact fort, étalement faible. Pas de halo flou.

## Shapes

Des coins presque droits, comme du papier et du carton : 6px pour tampons et fiches, 8px pour le cadre de chêne, 3px pour la surface d'ardoise. Les champs sont des lignes à écrire : pas de radius, juste un trait en bas. Le cadre à la craie (`chalk-box`) a des coins irréguliers (6/3/7/4px) tracés à la main. Le tampon porte un liseré pointillé intérieur (1.5px dashed, inset 4px). Les bordures `double` (3px) décorent l'étiquette du cahier.

## Components

### Buttons

Des tampons encreurs en Caveat gras.

- **Shape:** rayon 6px, incliné de -1.2deg (secondaire +0.8deg). Hauteurs 36, 44, 48px.
- **Primary (`stamp`):** fond primary-700, texte papier, liseré pointillé intérieur, tranche d'ombre pleine.
- **Hover / Active:** se redresse à 0deg et monte de 2px, fond primary-600 ; à l'appui descend de 2px et l'ombre s'écrase. Focus : contour 3px primary-500, décalage 3px (chalk-yellow sur ardoise et couverture).
- **Chalk (`stamp-chalk`):** même tampon en jaune craie, texte board-deep, pour l'ardoise.
- **Secondary:** papier, bordure 2px primary-700, survol marker-soft.
- **Ghost:** texte primary-700 avec soulignement à la plume (`pen-underline`).

### Cards / Containers

Une fiche de papier posée : fond blanc, bordure `line` 1px, rayon 6px, remplissage 24px, `shadow-card`. Interactive : monte de 2px et s'incline de -0.4deg au survol, `shadow-card-hover`.

### Inputs / Fields

Une ligne à écrire : fond blanc à 80 %, pas de radius, seulement une bordure basse de 2px (primary-300). Focus : bordure primary-700, anneau primary-300. Erreur : bordure pen-500. Désactivé : surface-muted, opacité 0.7. Le curseur reste `text` dans les champs.

### Navigation

Texte manuscrit sur le papier ; le CTA d'en-tête est un tampon. Sur mobile, un CTA collant (`StickyHeaderCTA`).

### Ardoise (`Board`)

Cadre de chêne (grain, 10 à 16px), surface vert-noir poudrée, texte en craie (`chalk` : léger halo poudré), rebord de chêne avec trois craies. Réservée aux temps forts : l'offre socle + modules, la démonstration.

### Bulletin (`sheet` + `tape`)

Feuille blanche à lignes, bordure `line`, `shadow-elevated`, scotch jaune translucide incliné de -3deg. Sert au bulletin du hero, avec une annotation `red-note`.

### Couverture et étiquette (`cover`, `label-card`)

Pied de page : couverture bleue (primary-800) à grain, texte clair. L'étiquette « Ce cahier appartient à » est un papier crème à bordure double primary-700.

### Plume et traînée d'encre

Curseur plume en SVG (`quill.svg`, `quill-link.svg` sur les éléments cliquables : plume jaune dans une cible d'encre), point de pose en (3, 37), et (13, 47) pour la version cliquable, actif au pointeur fin seulement. `InkTrail` dessine une traînée qui sèche en 650 ms et une tache de 1.4 s au clic ; l'encre devient craie sur ardoise et couverture. Désactivé au tactile et avec `prefers-reduced-motion`.

### Écriture animée

`written` révèle un titre de gauche à droite par pas (1.5s, steps(28)). `note-in` fait tomber l'annotation en place (0.45s). `chalk-draw` trace un trait de craie. Courbe `ease-ink` (0.22, 1, 0.36, 1). Avec moins d'animation, tout est visible d'emblée.

## Do's and Don'ts

### Do:

- **Do** garder la page de cahier comme surface de lecture et l'ardoise pour quelques temps forts seulement.
- **Do** utiliser les tampons (`stamp`, `stamp-chalk`) pour toute action principale, `stamp-chalk` sur l'ardoise.
- **Do** écrire les titres en Caveat, le texte en Andika, les remarques en La Belle Aurore rouge.
- **Do** surligner en jaune un groupe de mots par titre au plus.
- **Do** rouvrir le papier (`paper-reset`, `label-card`) pour une fiche posée sur l'ardoise.
- **Do** garder le contraste : encre ink sur paper, craie sur board, focus visible sur chaque fond.
- **Do** n'écrire que du contenu réel ; ni témoignage ni chiffre client.

### Don't:

- **Don't** revenir au gabarit SaaS : hero dégradé, maquette de tableau de bord, grille de cartes à icônes.
- **Don't** introduire un mode sombre ou une autre teinte de marque (le bleu et l'émeraude de l'ancien site ont disparu).
- **Don't** utiliser d'ombre flottante ou de halo diffus sur les fiches.
- **Don't** composer un paragraphe entier en La Belle Aurore ou en Caveat.
- **Don't** ajouter un curseur qui ne soit pas la plume ni une traînée qui ignore `prefers-reduced-motion`.
