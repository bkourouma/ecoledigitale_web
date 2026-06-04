# Feature Specification: Site marketing EcoleDigitale

**Feature Branch**: `001-site-marketing`

**Created**: 2026-05-18

**Status**: Draft

**Input**: User description: "docs/PRD_SITE_MARKETING_ECOLEDIGITALE.md — Site internet marketing pour la plateforme SaaS EcoleDigitale (gestion d'établissements de formation). Doit présenter l'offre modulaire (5 modules), expliquer la valeur métier, et convertir les visiteurs en demandes de démonstration qualifiées."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capter une demande de démo qualifiée (Priority: P1)

Un décideur (directeur d'établissement, fondateur, responsable pédagogique) arrive sur le site, comprend en moins de 30 secondes ce qu'EcoleDigitale couvre, et soumet une demande de démonstration en précisant son contexte (établissement, taille, modules d'intérêt, coordonnées) afin qu'un commercial puisse le rappeler avec une réponse adaptée.

**Why this priority** : C'est l'unique objectif primaire du site (section 6 du PRD). Sans ce parcours fonctionnel, le site ne génère aucune valeur commerciale, peu importe le reste du contenu.

**Independent Test** : Peut être testé de bout en bout en publiant uniquement la page d'accueil (avec promesse, aperçu des modules et CTA démo) et la page `/demander-demo` avec un formulaire fonctionnel et une notification email vers l'équipe commerciale. Un prospect peut atterrir, comprendre l'offre, soumettre, et l'équipe commerciale reçoit le lead — boucle de valeur complète.

**Acceptance Scenarios** :

1. **Given** un visiteur arrive sur la page d'accueil, **When** il scrolle 30 secondes, **Then** il a identifié la promesse principale, les profils utilisateurs couverts et au moins un CTA « Demander une démonstration » visible.
2. **Given** un visiteur clique sur un CTA démo depuis n'importe quelle page principale, **When** la page formulaire s'ouvre, **Then** il peut renseigner ses coordonnées, son rôle, son établissement et sélectionner au moins un module d'intérêt parmi les 5 proposés.
3. **Given** un visiteur soumet un formulaire valide, **When** la soumission est traitée, **Then** il voit un message de confirmation explicite et l'équipe commerciale reçoit la totalité des informations dans les 5 minutes.
4. **Given** un visiteur soumet un formulaire avec un email invalide, un téléphone vide ou aucun module sélectionné, **When** il tente la soumission, **Then** il reçoit un message d'erreur clair identifiant le ou les champs à corriger, sans perdre les données saisies.

---

### User Story 2 - Explorer chaque module pour valider l'adéquation métier (Priority: P2)

Un responsable spécialisé (responsable BTS, responsable formation professionnelle, directeur académique post-BTS) veut consulter une page dédiée à son module d'intérêt pour vérifier que ses besoins spécifiques sont couverts avant d'engager une discussion commerciale.

**Why this priority** : Augmente significativement la qualité des leads (un prospect qui a lu sa page module se présente à la démo avec un contexte clair). Sans ces pages, P1 capte des leads mais moins qualifiés. Couvre US-002 et US-003 du PRD.

**Independent Test** : Peut être testé en publiant la page `/modules` (vue comparative) et les 5 pages module dédiées. Un responsable BTS peut accéder directement à `/modules/parcours-bts`, identifier que les besoins (cours, classes, évaluations, notes, présences, paiements, reporting) sont couverts, et cliquer sur le CTA démo de cette page.

**Acceptance Scenarios** :

1. **Given** un responsable BTS accède à `/modules/parcours-bts`, **When** la page est chargée, **Then** il identifie : configuration des filières, suivi cours/enseignants/coefficients, évaluations/notes/bulletins, présences/devoirs, paiements/reporting, espaces étudiant/enseignant/parent.
2. **Given** un responsable formation professionnelle accède à `/modules/proformation`, **When** la page est chargée, **Then** il identifie le parcours complet : catalogue → session → inscription → paiement → formateur, avec mention des inscriptions B2B entreprise.
3. **Given** un visiteur sur la page `/modules`, **When** il compare les 5 modules, **Then** il distingue le module socle (cœur opérationnel) des modules optionnels activables en complément.
4. **Given** un visiteur sur n'importe quelle page module, **When** il souhaite poursuivre, **Then** un CTA « Demander une offre modulée » ou « Demander une démonstration » est visible.

---

### User Story 3 - Mesurer le tunnel de conversion (Priority: P3)

L'équipe marketing/commerciale veut mesurer le comportement des visiteurs sur le site (clics CTA, sélections de modules, complétions de formulaire, clics canaux alternatifs) pour optimiser le tunnel et identifier les modules les plus demandés.

**Why this priority** : Permet l'optimisation continue (A/B testing en Phase 2). Sans cela, P1 + P2 fonctionnent mais on pilote à l'aveugle. Couvre FR-009 et SC liés à la mesure de succès.

**Independent Test** : Peut être testé en vérifiant qu'après chaque interaction tracée (clic CTA démo, soumission formulaire, sélection module, clic WhatsApp/email, demande brochure), un événement analytique correspondant est enregistré et consultable dans l'outil de mesure.

**Acceptance Scenarios** :

1. **Given** un visiteur clique sur un CTA « Demander une démonstration », **When** l'événement se produit, **Then** un événement analytique typé est enregistré avec la page source.
2. **Given** un visiteur soumet le formulaire de démo, **When** la soumission réussit, **Then** un événement analytique est enregistré avec les modules sélectionnés et la taille d'établissement (si renseignée).
3. **Given** un visiteur clique sur un lien de contact alternatif (WhatsApp, email direct), **When** le clic se produit, **Then** un événement analytique typé est enregistré.

---

### User Story 4 - Être trouvé via la recherche organique (Priority: P3)

Un décideur cherchant un logiciel de gestion scolaire, BTS ou de formation professionnelle sur un moteur de recherche doit pouvoir tomber sur le site EcoleDigitale via une requête pertinente, et accéder directement à la page la plus adaptée.

**Why this priority** : Source d'acquisition durable et économique. Sans SEO de base, le site dépend uniquement de l'acquisition directe ou payante. Couvre FR-006.

**Independent Test** : Peut être testé en vérifiant que chaque page (accueil, modules, 5 pages module, demande démo) expose un titre SEO unique, une meta description sous 160 caractères, une URL lisible conforme à la liste recommandée du PRD, et une structure de titres sémantique (h1 unique, h2/h3 hiérarchisés).

**Acceptance Scenarios** :

1. **Given** un robot d'indexation explore le site, **When** il accède à chaque page MVP, **Then** chaque page expose un `<title>` unique, une meta description, une URL canonique et un balisage `h1` unique cohérent avec le contenu.
2. **Given** une recherche sur les mots-clés cibles du PRD (« logiciel de gestion scolaire », « plateforme de gestion BTS », « logiciel de gestion centre de formation »), **When** les pages sont indexées, **Then** chaque mot-clé majeur correspond à une page dédiée du site avec une intention alignée.
3. **Given** un utilisateur partage l'URL d'une page module sur une plateforme tierce, **When** la prévisualisation est générée, **Then** elle affiche un titre, une description et une image cohérents (Open Graph minimum).

---

### Edge Cases

- **Soumission formulaire en échec côté serveur** (email down, base injoignable) : le visiteur reçoit un message d'erreur non technique l'invitant à réessayer ou à contacter par un canal alternatif, et l'incident est journalisé pour l'équipe technique.
- **Visiteur sans JavaScript** : le contenu textuel (promesse, modules, coordonnées de contact) reste lisible ; le formulaire de démo dégrade gracieusement (au minimum un mailto: ou un lien de secours) ou affiche un message demandant l'activation JS.
- **Connexion mobile dégradée (3G)** : le contenu critique de chaque page (h1, promesse, CTA principal) est utilisable en moins de 4 secondes ; les visuels lourds se chargent en différé.
- **Lien profond direct vers une page module** (partage commercial) : la page est entièrement autonome et navigable (header, contenu, footer, CTA), sans redirection vers la home.
- **Ajout d'un 6e module** dans le futur : la page `/modules` et la navigation s'adaptent sans refonte (composant carte modulaire réutilisable).
- **Visiteur soumet plusieurs fois le même formulaire** (double-clic, retour navigateur) : le système prévient les doublons côté UI (bouton désactivé après soumission) et l'équipe commerciale n'est notifiée qu'une fois par lead unique sur une fenêtre courte.
- **Sélection de modules vide** dans le formulaire : la validation bloque la soumission et signale qu'au moins un module doit être coché.
- **Visiteur abandonne le formulaire à mi-parcours** : l'analytique capture l'étape d'abandon pour l'optimisation, sans bloquer le visiteur ni stocker de données personnelles sans consentement.
- **Visiteur soumet depuis un pays non ciblé** : la soumission est acceptée et transmise (la qualification commerciale se fait en aval).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** : Le site MUST proposer une navigation principale incluant : Accueil, Modules (vue d'ensemble), chaque page module, et Contact/Demande de démo, accessible depuis toutes les pages.
- **FR-002** : Le site MUST présenter les 5 modules de packaging (Socle EcoleDigitale, Parcours BTS, Parcours Supérieur, ProFormation, Campus Live) avec, pour chacun : nom commercial, promesse, bénéfices clés, principales fonctionnalités, positionnement et un CTA de conversion.
- **FR-003** : Le site MUST exposer un formulaire de demande de démonstration accessible depuis le header (CTA persistant), depuis le hero de l'accueil, depuis chaque page module (CTA section finale) et via une URL dédiée `/demander-demo`.
- **FR-004** : Le formulaire MUST permettre au visiteur de sélectionner un ou plusieurs modules d'intérêt parmi les 5 modules commercialisés, avec validation qu'au moins un module est sélectionné avant soumission.
- **FR-005** : Le formulaire MUST capturer les champs requis suivants : nom complet, email professionnel, téléphone, nom de l'établissement, rôle, ville/pays, modules d'intérêt, et consentement explicite de contact commercial.
- **FR-006** : Le formulaire MUST proposer les champs optionnels suivants : nombre d'étudiants/apprenants, type d'établissement, message libre, canal de contact préféré.
- **FR-007** : Le formulaire MUST valider l'email (format), exiger un téléphone non vide, exiger au moins un module sélectionné, et exiger le consentement avant d'autoriser la soumission.
- **FR-008** : Chaque soumission de formulaire valide MUST déclencher une notification à l'équipe commerciale contenant l'intégralité des champs renseignés, dans un délai de 5 minutes ouvrés maximum.
- **FR-009** : Le système de capture de leads MUST être conçu pour permettre une intégration ultérieure à un CRM (couche d'abstraction ou stockage structuré exportable), sans que cette intégration soit livrée au MVP.
- **FR-010** : Chaque page MUST exposer un titre SEO unique, une meta description sous 160 caractères, une URL lisible conforme à la liste recommandée (`/`, `/modules`, `/modules/socle-ecoledigitale`, `/modules/parcours-bts`, `/modules/parcours-superieur`, `/modules/proformation`, `/modules/campus-live`, `/demander-demo`), et un balisage Open Graph minimum (titre, description, image).
- **FR-011** : Le site MUST être pleinement utilisable et lisible sur mobile, tablette et desktop, sans scroll horizontal involontaire ni zone interactive inaccessible au tactile.
- **FR-012** : Les pages MUST atteindre un score Lighthouse Performance ≥ 85 sur mobile (réseau et CPU simulés par défaut Lighthouse) pour le MVP.
- **FR-013** : Le site MUST tracer les événements suivants via un outil analytique : clic sur CTA « démo », soumission de formulaire (réussie ou en échec), sélection d'un module dans le formulaire, clic sur lien WhatsApp ou email direct, demande/téléchargement de brochure (si présent).
- **FR-014** : Le site MUST respecter les bonnes pratiques d'accessibilité : contraste suffisant (WCAG AA), navigation clavier sur tous les éléments interactifs, textes alternatifs sur les images informatives, structure sémantique de titres et de régions.
- **FR-015** : Le contenu marketing MUST rester cohérent avec les fonctionnalités réellement disponibles dans la plateforme EcoleDigitale (pas de promesse de fonctionnalité inexistante).
- **FR-016** : Le contenu textuel (copies marketing, libellés, descriptions) MUST être maintenable sans redéploiement de l'application complète (stockage en fichiers de contenu structurés ou équivalent).
- **FR-017** : Le site MUST afficher en permanence (header ou footer) au moins un canal de contact direct alternatif au formulaire, parmi : email, téléphone, WhatsApp. [NEEDS CLARIFICATION : quels canaux exactement doivent être prioritaires — WhatsApp, email, téléphone, calendrier de RDV en ligne ?]
- **FR-018** : Le site MUST utiliser une identité visuelle (logo, nom commercial, palette) cohérente avec la marque EcoleDigitale. [NEEDS CLARIFICATION : le nom commercial reste-t-il « EcoleDigitale » ou faut-il introduire une marque produit distincte pour le site marketing ?]
- **FR-019** : Le site MUST informer le visiteur du traitement de ses données personnelles (mention RGPD ou équivalent local) au minimum au niveau du formulaire et d'une page de confidentialité accessible depuis le footer.
- **FR-020** : Les pages module MUST pouvoir évoluer (ajout d'un nouveau module, modification d'un libellé, changement d'ordre) sans refonte technique du site.

*Clarifications en attente* (max 3 markers actifs ci-dessus) :

- **FR-017** — Canaux de contact alternatifs prioritaires
- **FR-018** — Stratégie de marque (mono-marque EcoleDigitale vs marque produit distincte)
- Question complémentaire non bloquante : affichage de tarifs publics indicatifs vs uniquement demande de devis (traité comme hors-MVP par défaut, voir Assumptions).

### Key Entities

- **Module** : unité commerciale de l'offre. Attributs : identifiant, nom commercial, slug d'URL, promesse courte, positionnement, liste de bénéfices, liste de fonctionnalités, type (socle ou optionnel), profils utilisateurs adressés, ordre d'affichage. 5 instances au lancement : Socle EcoleDigitale, Parcours BTS, Parcours Supérieur, ProFormation, Campus Live.
- **Page marketing** : page publique du site. Attributs : route/URL, titre SEO, meta description, image Open Graph, blocs de contenu structurés, CTA(s) associé(s).
- **Lead (demande de démonstration)** : données qualifiantes d'un prospect. Attributs : nom, email, téléphone, établissement, rôle, ville/pays, modules d'intérêt (1..n), consentement, et optionnels : taille (nb étudiants/apprenants), type d'établissement, message libre, canal préféré, horodatage, page source.
- **CTA** : appel à l'action. Attributs : libellé, type (démo / brochure / contact / WhatsApp / email), destination (URL interne ou externe), placement (header / hero / inline / footer), événement analytique associé.
- **Événement analytique** : interaction tracée. Attributs : type d'événement, page source, propriétés contextuelles (modules sélectionnés, libellé CTA, etc.), horodatage, identifiant de session anonyme.
- **Contenu modulaire** : artefact éditorial. Attributs : clé, type (texte court, paragraphe, liste, FAQ, témoignage), langue (FR par défaut), valeur, statut (publié / brouillon).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001** : Au moins 3 % des visiteurs qualifiés (sessions hors bots, > 10 secondes) soumettent une demande de démonstration.
- **SC-002** : Le temps moyen passé sur les pages module est ≥ 60 secondes.
- **SC-003** : Le taux de clic sur le CTA « démo » depuis l'accueil est ≥ 8 % des visites de l'accueil.
- **SC-004** : 100 % des soumissions de formulaire valides parviennent à l'équipe commerciale dans un délai ≤ 5 minutes ouvrées, avec l'intégralité des champs renseignés.
- **SC-005** : Un nouveau visiteur identifie les domaines couverts par EcoleDigitale (académique, pédagogique, administratif, financier, formation pro) en moins de 30 secondes sur la page d'accueil (vérifiable en test utilisateur modéré sur 5 participants minimum).
- **SC-006** : Chaque page MVP atteint un score Lighthouse Performance ≥ 85 sur mobile, mesuré en condition réseau Lighthouse par défaut.
- **SC-007** : Le taux de complétion du formulaire (soumissions / démarrages de saisie) est ≥ 60 %.
- **SC-008** : Le site est navigable au clavier de bout en bout (du header au footer, formulaire compris) sans piège de focus, vérifié sur les 8 pages MVP.
- **SC-009** : Chacune des 5 pages module est référencée organiquement sur au moins un mot-clé cible du PRD dans les 90 jours suivant la mise en ligne (objectif d'acquisition organique).
- **SC-010** : Les 5 modules sont chacun cibles d'au moins une demande de démonstration par mois après 3 mois de mise en ligne (validation de la couverture commerciale).

## Assumptions

- Le site est publié uniquement en **français** au lancement (multilingue traité en hors-périmètre MVP, section 16 du PRD).
- Aucune **authentification utilisateur** n'est requise : le site est entièrement public.
- Aucun **paiement en ligne** n'est intégré au MVP (hors-périmètre PRD section 16).
- **Aucun tarif public** n'est affiché au MVP : toute information de prix passe par une demande de devis ou de démo. Une page `/tarifs` est différée en Phase 2.
- L'**infrastructure email** utilisée pour notifier les leads est déjà disponible côté EcoleDigitale ou peut être provisionnée via un fournisseur transactionnel standard.
- Les **visuels produit** (captures d'interface, mockups) sont soit déjà disponibles, soit générables à partir de la plateforme EcoleDigitale existante avant la mise en ligne.
- L'**outil analytique** utilisé doit être compatible avec les exigences RGPD (anonymisation IP ou consentement) ; le choix précis relève du plan technique.
- La **gestion du consentement cookies** (bannière) sera traitée si l'outil analytique le requiert légalement ; sinon une simple mention suffit.
- Les **brochures téléchargeables** sont en Phase 2 (PRD section 17), mais l'événement analytique correspondant est prévu dès le MVP pour anticiper.
- Le **chatbot commercial** est explicitement hors-périmètre MVP.
- L'**architecture technique** (monorepo intégré à la plateforme vs application séparée) relève du plan d'implémentation et sera tranchée en `/speckit-plan`.
- Le **CRM cible** pour l'intégration future n'est pas connu au moment de la spec ; la capture de leads doit être structurée et exportable pour s'adapter à n'importe quel CRM ultérieurement.
- Les **5 modules de packaging** et leurs noms commerciaux (incluant les noms recommandés « Parcours Supérieur », « ProFormation », « Campus Live ») sont validés par le métier au moment de la rédaction de la spec.
