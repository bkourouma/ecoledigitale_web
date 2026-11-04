# Polices locales

Fichiers WOFF2 fournis par Google Fonts, téléchargés le 4 novembre 2026,
sans modification ni conversion. `manifest.json` conserve les URL CSS et
binaires, les tailles et les empreintes SHA-256. Chaque famille est accompagnée
de sa licence SIL OFL 1.1 issue de `google/fonts`, dossier `ofl/<famille>/OFL.txt`.

Les familles, les graisses demandées et les variables CSS du layout sont
conservées. Les fichiers variables identiques ont été dédupliqués ; leur plage
est déclarée dans `next/font/local`. Le sous-ensemble latin couvre notamment
les accents français, Œ/œ, l'apostrophe typographique et l'euro (vérifiés dans
les tables cmap). Les axes variables ont aussi été contrôlés avec fontTools.

Le build n'interroge plus Google Fonts. Cela évite le défaut intermittent
d'URL sans extension dans les chargeurs Google de Next.js :
https://github.com/vercel/next.js/issues/99114
https://github.com/vercel/next.js/pull/100158

Pour une mise à jour : télécharger les mêmes familles et graisses depuis les
URL CSS du manifeste, conserver les licences, vérifier cmap/axes/empreintes,
puis rejouer le build, la recette HTTP et le navigateur. Aucune dépendance
de conversion de polices n'est nécessaire au projet.
