# Feature Specification: Hub éditorial /ressources

**Feature Branch**: `002-hub-ressources`

**Created**: 2026-05-19

**Status**: Draft

**Input**: User description: "Construire un hub éditorial /ressources pour publier durablement du contenu SEO ciblant le funnel haut/milieu (phase 'je me renseigne', 'je compare') qui précède de 3-6 mois la phase 'je demande une démo'. Trois types de contenu : guides longs, études de cas, entrées glossaire. Quatre personas cibles. Architecture MDX cohérente avec le pattern existant des modules. JSON-LD Article + BreadcrumbList + FAQPage générés automatiquement. Préserver l'architecture RSC-first et le gate Lighthouse ≥ 85."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Capter un visiteur amont via une ressource SEO (Priority: P1)

Un décideur (direction d'école, responsable BTS, responsable formation pro, responsable campus) en phase de recherche d'information ("je veux comprendre comment digitaliser mon établissement BTS") tape une requête dans Google, atterrit sur un guide EcoleDigitale qui répond à sa question, lit l'article en entier, comprend l'expertise de l'éditeur, et — selon son niveau de maturité — soit revient plusieurs semaines plus tard pour demander une démo, soit consulte directement une page module liée puis demande une démo dans la foulée.

**Why this priority** : C'est la raison d'être de tout le hub. Sans ce parcours (Google → guide pertinent → conviction → conversion latente ou directe), aucune des autres user stories n'apporte de valeur business. Le contenu éditorial est le seul levier d'acquisition organique sur les requêtes amont du funnel.

**Independent Test** : Peut être testé bout-en-bout en publiant un seul guide (sans hub, sans filtres, sans études de cas) à `/ressources/guides/{slug}` avec balises SEO complètes, JSON-LD `Article`, breadcrumb, dates de publication/mise à jour, mention d'auteur, et CTA contextuel vers une démo ou un module. Si Google indexe ce guide et qu'un visiteur peut le lire intégralement, comprendre la crédibilité de la source, et accéder en 1 clic à un appel à l'action pertinent, la boucle de valeur est complète.

**Acceptance Scenarios** :

1. **Given** un guide est publié à `/ressources/guides/digitaliser-bts`, **When** un visiteur arrive depuis Google, **Then** il voit un titre H1 unique, un sous-titre, le nom et la fonction de l'auteur, la date de publication et de mise à jour si différente, le temps de lecture estimé, le corps de l'article, et au moins un CTA contextuel en milieu ou fin de page.
2. **Given** un guide est publié, **When** le moteur de recherche le crawl, **Then** la page expose : metadata title/description uniques sous limites SEO, canonical, OG image dédiée, JSON-LD `Article` (avec dates, auteur, éditeur), JSON-LD `BreadcrumbList` (Accueil > Ressources > Guides > Titre), et — si le frontmatter contient une FAQ — JSON-LD `FAQPage`.
3. **Given** un guide contient des références vers d'autres ressources ou modules, **When** le visiteur arrive en fin d'article, **Then** il voit une section "Ressources liées" listant 2 à 4 entrées (ressources et/ou modules) cliquables.
4. **Given** un guide est en statut `draft`, **When** il est généré côté serveur, **Then** il ne figure pas dans le sitemap, n'est pas listé dans le hub `/ressources`, et n'est accessible que par URL directe en environnement non-production (preview/dev).

---

### User Story 2 — Publier une nouvelle ressource sans intervention du dev frontend (Priority: P2)

Un éditeur technique (dev junior, growth/SEO avec compétences markdown) ajoute un nouveau fichier MDX dans le répertoire `content/ressources/{type}/`, renseigne le frontmatter selon le schéma documenté, écrit le corps en MDX, lance le build local, voit la ressource apparaître automatiquement dans le hub, dans le sitemap, et avec toutes ses balises SEO + JSON-LD générées. Aucun fichier TypeScript de routing ou de composant ne nécessite d'être modifié pour ajouter une ressource.

**Why this priority** : Le rythme de publication (cible : 2 articles/semaine) ne peut pas dépendre du temps d'un développeur frontend pour chaque nouvelle ressource. L'autonomie éditoriale est la condition pour tenir la cible long terme de 20+ articles à 6 mois.

**Independent Test** : Peut être testé en clonant un fichier MDX existant, en modifiant le slug et le frontmatter, et en vérifiant en local que la nouvelle ressource est listée dans `/ressources`, accessible à son URL, présente dans `/sitemap.xml`, et que le build passe sans erreur. Si le frontmatter est invalide, le build doit échouer avec un message d'erreur lisible identifiant le champ et la règle violés.

**Acceptance Scenarios** :

1. **Given** un nouveau fichier `.mdx` est ajouté dans `content/ressources/guides/`, **When** le build est lancé, **Then** une page est générée à `/ressources/guides/{slug}`, listée dans le hub, et incluse dans le sitemap si `status: published`.
2. **Given** un fichier MDX a un frontmatter invalide (champ manquant, mauvais type, longueur hors limites), **When** le build est lancé, **Then** il échoue avec un message identifiant le fichier, le champ, la règle violée — sans message Zod brut illisible.
3. **Given** un fichier MDX référence une persona inexistante, un auteur inconnu, ou une `relatedRessources` pointant vers un slug inexistant, **When** le build est lancé, **Then** il échoue avec un message explicite.
4. **Given** un template de "brief éditorial" est disponible dans le repo, **When** un nouvel éditeur l'ouvre, **Then** il comprend en moins de 10 minutes la structure attendue (frontmatter complet documenté, exemples, contraintes de longueur).

---

### User Story 3 — Naviguer le hub avec filtres persona et type (Priority: P3)

Un visiteur qui n'est pas arrivé par une requête longue tail mais qui a découvert le site (via démo, bouche-à-oreille, ou lien direct) souhaite explorer les ressources publiées. Il accède à `/ressources`, voit l'ensemble des contenus, et peut filtrer rapidement par persona ("je dirige un institut BTS, montrez-moi ce qui me concerne") et par type ("je cherche un exemple concret → études de cas").

**Why this priority** : Améliore l'engagement des visiteurs déjà présents sur le site (taux de pages vues par session, temps passé) et favorise le retour. Sans ce hub, les ressources existent mais ne sont découvrables qu'individuellement via Google. Avec filtres serveur, on préserve la performance RSC.

**Independent Test** : Peut être testé en publiant 5+ ressources couvrant au moins 2 personas et 2 types, puis en vérifiant que `/ressources` les liste toutes, que les filtres `?persona=...&type=...` retournent des sous-ensembles cohérents, et que la page reste statique (pas de JS pour les filtres, navigation via paramètres d'URL).

**Acceptance Scenarios** :

1. **Given** au moins 5 ressources publiées (mix personas/types), **When** un visiteur charge `/ressources`, **Then** il voit la liste complète triée par date de publication décroissante, avec pour chaque entrée : titre, type (badge), persona(s) ciblée(s), temps de lecture, date.
2. **Given** un visiteur sélectionne le filtre "Persona : Direction BTS", **When** la navigation s'effectue, **Then** l'URL devient `/ressources?persona=lycee-bts` et seules les ressources ciblant cette persona (ou `tous`) sont affichées.
3. **Given** un visiteur combine "Persona : Formation pro" + "Type : Études de cas", **When** la navigation s'effectue, **Then** l'URL reflète les deux filtres et la liste est cohérente.
4. **Given** un filtre ne retourne aucun résultat, **When** la page est affichée, **Then** un message explicite invite à effacer le filtre ou à consulter une persona/type voisin, sans page vide.

---

### User Story 4 — Établir la crédibilité éditoriale via les pages auteurs (Priority: P3)

Un visiteur ou un moteur de recherche évaluant l'expertise et la fiabilité des contenus (signaux E-E-A-T de Google) accède à la page d'un auteur depuis n'importe quel article signé, y trouve une bio, ses domaines d'expertise, et la liste des ressources qu'il a publiées. La page expose un JSON-LD `Person` correctement structuré.

**Why this priority** : Augmente la crédibilité perçue (côté visiteur) et le classement Google sur les thématiques YMYL-adjacentes (l'éducation l'est partiellement). Sans pages auteur, les contenus apparaissent anonymes, ce qui plafonne l'autorité thématique.

**Independent Test** : Peut être testé en publiant 1 page auteur et au moins 1 ressource signée. Vérifier que le nom de l'auteur sur l'article est cliquable vers `/auteurs/{slug}`, que cette page expose bio + expertise + liste des ressources de cet auteur, et que le JSON-LD `Person` est présent et valide.

**Acceptance Scenarios** :

1. **Given** une ressource référence un auteur via `frontmatter.author: marie-dupont`, **When** la page est rendue, **Then** le nom de l'auteur est cliquable vers `/auteurs/marie-dupont`.
2. **Given** la page `/auteurs/marie-dupont` est chargée, **When** elle est affichée, **Then** elle expose : nom, fonction, bio courte, photo optionnelle, domaines d'expertise, liste de toutes les ressources signées par cet auteur (triées par date desc).
3. **Given** la page auteur est chargée, **When** un crawler l'analyse, **Then** elle expose un JSON-LD `Person` avec nom, fonction, URL, et image optionnelle.

---

### User Story 5 — Capitaliser sur la preuve sociale via une étude de cas (Priority: P3)

Une direction d'établissement en phase de décision (déjà sensibilisée par un guide ou une démo) souhaite voir un cas concret d'utilisation pour confirmer la pertinence de la plateforme. Elle accède à une étude de cas qui présente : le contexte de l'établissement, le défi rencontré, la solution déployée, les résultats mesurés. Le pattern doit pouvoir être appliqué à de futurs clients réels une fois disponibles.

**Why this priority** : La preuve sociale est un levier de conversion fort en B2B éducation (cycle d'achat institutionnel). Mais nécessite des clients déployés acceptant d'être cités → on livre le template au MVP, les vraies études de cas suivront.

**Independent Test** : Peut être testé en publiant 1 étude de cas template (avec données fictives clairement identifiées comme telles) et en vérifiant que la structure (contexte → défi → solution → résultats → témoignage) est cohérente, que le JSON-LD `Article` est généré, et qu'un CTA contextuel "Discuter de votre établissement" est présent.

**Acceptance Scenarios** :

1. **Given** une étude de cas est publiée, **When** elle est affichée, **Then** elle suit la structure : contexte établissement → défi initial → solution déployée (modules activés) → résultats mesurés → témoignage signé.
2. **Given** une étude de cas template avec données fictives, **When** elle est consultée, **Then** un bandeau "Exemple illustratif — données fictives" est clairement affiché en haut de page pour ne pas induire en erreur.
3. **Given** une étude de cas est publiée, **When** un crawler l'analyse, **Then** elle expose JSON-LD `Article` + `BreadcrumbList` + un CTA visible vers `/demander-demo`.

---

### Edge Cases

- **Ressource avec slug en collision** entre deux types (ex. `/ressources/guides/lms` et `/ressources/glossaire/lms` existent) : autorisé, les types isolent le namespace d'URL.
- **Ressource marquée `deprecated: true`** : reste accessible (pas de 404 → préserve le link equity), mais affiche un bandeau "Cette ressource n'est plus à jour" en haut, sort du listing hub, reste dans le sitemap avec `priority` bas.
- **Ressource future (`publishedAt` dans le futur)** : génère un build OK mais n'apparaît pas dans le hub ni le sitemap tant que `publishedAt > now`. Permet de planifier des publications.
- **Auteur référencé par une ressource mais sans fichier `content/auteurs/{slug}.mdx`** : le build échoue avec un message explicite.
- **`relatedRessources` pointant vers une ressource `draft` ou `deprecated`** : warning au build mais pas d'échec — la ressource est silencieusement omise du rendu.
- **Plus de 50 ressources publiées** : le hub doit rester performant (pas de pagination au MVP, mais structure prête à l'ajouter via paramètre `?page=N`).
- **Caractères spéciaux dans le slug** : le schéma Zod impose `[a-z0-9-]+` uniquement, échec de build sinon.
- **OG image manquante pour une ressource** : fallback sur la convention `opengraph-image.tsx` au niveau de la route, qui génère une image dynamique avec le titre + le type.
- **Aucune ressource publiée au lancement du hub** : la page `/ressources` affiche un message "Le hub se construit, les premières ressources arrivent bientôt", reste indexable, expose un CTA démo.

## Requirements *(mandatory)*

### Functional Requirements

**Hub et listing**

- **FR-001** : Une page `/ressources` MUST lister toutes les ressources de statut `published` dont `publishedAt` est dans le passé, triées par date de publication décroissante.
- **FR-002** : Le hub MUST permettre de filtrer par persona via le paramètre d'URL `?persona=<slug>` (valeurs : `ecole-privee`, `lycee-bts`, `superieur`, `formation-pro`, `campus-live`, `tous`).
- **FR-003** : Le hub MUST permettre de filtrer par type via le paramètre d'URL `?type=<slug>` (valeurs : `guides`, `etudes-de-cas`, `glossaire`).
- **FR-004** : Les filtres MUST être combinables et MUST fonctionner sans JavaScript côté client (navigation par paramètres d'URL, rendu serveur).
- **FR-005** : Le hub MUST afficher un message explicite et indexable quand aucune ressource ne correspond aux filtres ou quand aucune ressource n'est encore publiée.

**Pages de détail (3 types)**

- **FR-006** : Chaque ressource publiée MUST être accessible à `/ressources/{type}/{slug}` où `type ∈ {guides, etudes-de-cas, glossaire}`.
- **FR-007** : Une page guide MUST afficher : H1 unique, sous-titre/résumé, nom et fonction d'auteur cliquable, dates de publication et de mise à jour si différente, temps de lecture estimé, corps MDX, section "Ressources liées" si renseignée, CTA contextuel.
- **FR-008** : Une page étude de cas MUST suivre la structure documentée : contexte → défi → solution (avec modules activés) → résultats mesurés → témoignage. Si l'étude est fictive, un bandeau explicite MUST être affiché.
- **FR-009** : Une page glossaire MUST proposer une définition courte (max 500 mots de corps), un encadré "Voir aussi" listant les ressources liées, et un CTA discret.

**Contenu MDX et frontmatter**

- **FR-010** : Le contenu MUST être stocké dans `content/ressources/{type}/{slug}.mdx` avec frontmatter validé par un schéma typé.
- **FR-011** : Le frontmatter MUST contenir au minimum : `slug`, `title`, `description`, `type`, `personas[]`, `category`, `author`, `publishedAt`, `status` (`draft|published`). Champs optionnels : `updatedAt`, `ogImage`, `keywords[]`, `faq[]`, `relatedRessources[]`, `deprecated`.
- **FR-012** : La validation MUST échouer au build avec un message identifiant le fichier, le champ, et la règle violée — pas de message technique brut.
- **FR-013** : Les références croisées (auteur, persona, related) MUST être validées au build : auteur inexistant → erreur ; persona invalide → erreur ; related vers slug inexistant → erreur ; related vers slug `draft` → warning + omission silencieuse.

**Auteurs et EAT**

- **FR-014** : Chaque auteur référencé MUST avoir un fichier `content/auteurs/{slug}.mdx` avec frontmatter : `slug`, `name`, `role`, `bio`, `expertise[]`. Optionnels : `photo`, `linkedinUrl`, `email`.
- **FR-015** : Une page `/auteurs/{slug}` MUST être générée par auteur, listant toutes les ressources qu'il a signées (triées par date desc).
- **FR-016** : Le nom d'auteur sur chaque ressource MUST être un lien vers sa page auteur.

**SEO et données structurées**

- **FR-017** : Chaque ressource MUST exposer les balises SEO standard du site (utiliser le helper `buildMetadata` existant).
- **FR-018** : Chaque page de ressource MUST exposer un JSON-LD `Article` valide (headline, description, dates, auteur, éditeur, image, mainEntityOfPage).
- **FR-019** : Chaque page de ressource ET le hub MUST exposer un JSON-LD `BreadcrumbList` cohérent avec la hiérarchie d'URL.
- **FR-020** : Si une ressource contient une `faq[]` non vide dans le frontmatter, la page MUST exposer un JSON-LD `FAQPage`.
- **FR-021** : Chaque page auteur MUST exposer un JSON-LD `Person`.
- **FR-022** : Chaque ressource MUST avoir une OG image — soit explicite via `frontmatter.ogImage`, soit générée dynamiquement par la convention `opengraph-image.tsx` au niveau de la route.
- **FR-023** : Le sitemap (`app/sitemap.ts`) MUST inclure automatiquement toutes les ressources `published` avec `publishedAt` passé (priority 0.5), ainsi que toutes les pages auteur ayant au moins une ressource publiée (priority 0.4). Les ressources `deprecated` restent incluses avec une priority basse (0.3) pour préserver le link equity des backlinks externes (cf. research.md R-004). Les drafts et les ressources futures (`publishedAt > now`) sont exclus.

**Calculs automatiques**

- **FR-024** : Le temps de lecture MUST être calculé automatiquement à partir du body MDX (base : 220 mots/minute, rythme français moyen — cf. research.md R-001) et affiché sur la page détail et dans le listing.
- **FR-025** : `dateModified` du JSON-LD `Article` MUST utiliser `updatedAt` s'il existe, sinon `publishedAt`.

**Documentation et brief éditorial**

- **FR-026** : Le repo MUST contenir un fichier `content/ressources/_TEMPLATE-BRIEF.md` (ou équivalent) documentant : structure attendue, schéma frontmatter complet avec exemples, contraintes de longueur, processus de publication. Ce fichier est ignoré du sitemap et des listings.

**Performance et tests**

- **FR-027** : Toutes les pages du hub MUST être statiquement générées au build (pas de SSR runtime), à l'exception de la liste filtrée si nécessaire (cache HTTP de l'ordre du jour acceptable).
- **FR-028** : Les nouvelles pages MUST passer le gate Lighthouse mobile ≥ 85 (mêmes seuils que les pages existantes).
- **FR-029** : Les tests E2E (`tests/e2e/seo.spec.ts`, `seo-infra.spec.ts`) MUST être étendus pour couvrir : `/ressources`, au moins une page de chaque type (guide, étude de cas, glossaire), au moins une page auteur, présence des JSON-LD attendus, inclusion dans le sitemap.

### Key Entities

- **Ressource** : Unité éditoriale publiable. Trois types disjoints (`guides`, `etudes-de-cas`, `glossaire`) partageant un cœur de frontmatter commun (identifiants, dates, auteur, personas) et des champs spécifiques au type. Une ressource a un statut (`draft|published`), une persona ou plusieurs, une catégorie, et peut référencer d'autres ressources et un auteur.
- **Auteur** : Personne signant une ou plusieurs ressources. Possède une identité (nom, fonction), une bio, des domaines d'expertise. Référencé par slug dans le frontmatter des ressources.
- **Persona** : Énumération fermée des cibles métier : `ecole-privee`, `lycee-bts`, `superieur`, `formation-pro`, `campus-live`, plus la valeur transverse `tous`. Une ressource cible une ou plusieurs personas.
- **Catégorie** : Étiquette thématique secondaire d'une ressource (ex. "réglementation", "outils", "pédagogie") — non filtrable au MVP, utilisée pour le maillage et la navigation future.
- **Entrée FAQ** : Couple question/réponse (texte) attaché optionnellement à une ressource pour le JSON-LD `FAQPage`.
- **Référence croisée** : Lien entre ressources (`relatedRessources`) ou entre ressource et auteur. Validé au build.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001** : À 6 mois de mise en ligne du hub, **au moins 20 ressources** publiées (toutes catégories confondues) sans intervention d'un développeur frontend autre que pour le premier déploiement.
- **SC-002** : Le **délai entre l'écriture d'un fichier MDX valide et sa mise en ligne** est inférieur à 15 minutes (édition + build + déploiement) pour un éditeur technique formé.
- **SC-003** : **100 % des ressources publiées** exposent un JSON-LD `Article` et un `BreadcrumbList` valides selon Google Rich Results Test (zéro erreur, warnings acceptables).
- **SC-004** : Le **gate Lighthouse mobile ≥ 85** est maintenu sur 100 % des nouvelles pages (hub, détail ressource, page auteur).
- **SC-005** : À 3 mois, le **trafic organique mensuel** vers `/ressources/*` représente **au moins 30 %** du trafic organique total du site (mesure : Plausible + Google Search Console).
- **SC-006** : **100 % des leads démo** (`/demander-demo`) issus du hub renseignent une ressource d'origine identifiable (analytics : event "demo CTA click" capture la page source).
- **SC-007** : Le **taux de rebond** sur les pages guide est **inférieur à 65 %** (signal d'engagement et de qualité de contenu).
- **SC-008** : **Aucune ressource publiée** ne casse le build de production sur 6 mois (signal de robustesse du schéma de validation).
- **SC-009** : Un éditeur technique nouvellement onboardé MUST pouvoir **publier sa première ressource en moins de 2 heures** en s'appuyant sur le template de brief et un guide existant comme exemple.

## Assumptions

- **Profil d'éditeur** : la rédaction et la mise en MDX sont assurées par un éditeur technique (dev junior, growth/SEO avec compétences markdown). Pas de CMS visuel au MVP.
- **Fréquence cible** : 2 ressources/semaine en rythme de croisière, mais le système doit supporter aussi bien une publication isolée qu'un batch.
- **Hébergement** : même domaine que le reste du site, pas de sous-domaine éditorial.
- **Pas de paywall** ni de gating sur le contenu — toutes les ressources sont publiques.
- **Pas de système de commentaires** ni de notation utilisateur.
- **Pas de recherche interne** au MVP (Google fait office de moteur de recherche pour les visiteurs, le hub avec filtres pour la navigation interne).
- **Pas de système de tags** au MVP : `persona` + `category` (libellé libre) suffisent à organiser le contenu jusqu'à ~50 ressources.
- **Pas de pagination** au MVP côté hub : structure prête mais désactivée jusqu'à dépassement.
- **Pas de RSS** au MVP (peut être ajouté facilement comme route `/ressources/feed.xml` plus tard).
- **Photos d'auteurs et illustrations d'OG** : optionnelles. Si absentes, fallback sur génération dynamique côté serveur (cohérent avec la convention `opengraph-image.tsx` déjà utilisée par les modules).
- **Newsletter / capture email avancée** : réutiliser le formulaire de demande de démo existant — pas de nouvelle capture de leads spécifique au contenu.
- **Études de cas** : aucun client réel n'est encore référençable au lancement du hub ; le MVP livre un template avec données fictives clairement identifiées, à remplacer ultérieurement.
- **Validation Rich Results Google** : sera effectuée manuellement sur 1 URL par type post-déploiement ; les tests E2E couvrent la présence et la validité JSON brute, pas la conformité Schema.org complète.
- **Internationalisation** : hub français uniquement (cohérent avec le site existant). Si un jour le site devient multilingue, le hub suivra la même stratégie i18n que le reste.

## Dependencies

- **Helpers SEO existants** : `lib/seo/metadata.ts` (`buildMetadata`), `lib/seo/jsonld.ts` (`buildArticle`, `buildBreadcrumbList`, `buildFaqPage`) et `components/seo/JsonLd.tsx` — livrés au Sprint 1.
- **Pattern de loader contenu** : suivre le pattern de `lib/content/modules.ts` (cache process-level, validation Zod, slug ↔ filename).
- **Convention OG images Next.js** : déjà utilisée par `app/(marketing)/modules/[slug]/opengraph-image.tsx`.
- **Sitemap dynamique** : `app/sitemap.ts` existe et doit être étendu (pas remplacé).
- **Capacité éditoriale** : une ressource humaine (interne ou prestataire) capable de produire au moins 2 articles de fond par mois. **Sans cette ressource, le hub technique sera livré mais le contenu restera vide → l'investissement n'aura pas de ROI.**
