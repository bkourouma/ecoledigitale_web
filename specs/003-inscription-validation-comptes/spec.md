# Feature Specification: Inscription des étudiants/parents avec validation administrateur

**Feature Branch**: `003-inscription-validation-comptes`

**Created**: 2026-05-20

**Status**: Draft

**Input**: User description: "Permettre aux étudiants et parents de s'enregistrer eux-mêmes sur le système via un formulaire d'inscription. Une fois un enregistrement soumis, l'administrateur dispose d'une interface de validation des enregistrements en attente : il vérifie les informations saisies puis enregistre définitivement (valide) ou rejette la demande. À la validation, le système crée le compte et envoie par email les informations du compte à l'étudiant ou au parent concerné. Pour les étudiants/parents déjà enregistrés et validés, l'administrateur peut renvoyer les informations de compte par email, soit individuellement (un destinataire), soit collectivement (envoi groupé à plusieurs ou tous les comptes)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-inscription d'un étudiant ou d'un parent (Priority: P1)

Un visiteur (étudiant ou parent) accède à un formulaire d'inscription public, renseigne ses informations et soumet sa demande. Il reçoit immédiatement une confirmation indiquant que sa demande a bien été reçue et qu'elle est en attente de validation par l'administration.

**Why this priority**: C'est le point d'entrée de la fonctionnalité. Sans collecte des demandes, il n'y a rien à valider ni aucun compte à créer. C'est la fondation indispensable.

**Independent Test**: Remplir et soumettre le formulaire d'inscription, puis vérifier qu'une demande au statut « en attente » est bien enregistrée et que le visiteur voit un message de confirmation.

**Acceptance Scenarios**:

1. **Given** un visiteur sur le formulaire d'inscription, **When** il renseigne tous les champs obligatoires et soumet, **Then** une demande d'inscription au statut « en attente » est créée et un message de confirmation s'affiche.
2. **Given** un visiteur sur le formulaire, **When** il soumet avec des champs obligatoires manquants ou un email mal formé, **Then** la soumission est bloquée et les champs à corriger sont clairement indiqués.
3. **Given** un visiteur, **When** il soumet une demande avec un email déjà associé à un compte validé ou à une demande en attente, **Then** il en est informé et aucune demande en double n'est créée.
4. **Given** un visiteur, **When** il choisit le type « étudiant » ou « parent », **Then** le formulaire demande les informations spécifiques à ce type.

---

### User Story 2 - Validation des demandes par l'administrateur (Priority: P1)

L'administrateur ouvre une interface réservée listant les demandes d'inscription en attente. Pour chaque demande, il consulte les informations saisies, les corrige si nécessaire, puis valide (enregistrement définitif et création du compte) ou rejette la demande. À la validation, le système crée le compte et envoie automatiquement par email les informations de compte à l'intéressé.

**Why this priority**: C'est le cœur du contrôle administratif et de la création de compte. Combinée à l'auto-inscription (US1), cette histoire constitue le MVP : collecter une demande, la valider, livrer un compte.

**Independent Test**: Avec des demandes en attente présentes, valider une demande et vérifier qu'un compte est créé et qu'un email contenant les informations de compte est envoyé ; rejeter une autre demande et vérifier qu'elle passe au statut « rejetée ».

**Acceptance Scenarios**:

1. **Given** des demandes en attente, **When** l'administrateur ouvre l'interface de validation, **Then** il voit la liste des demandes avec le détail des informations saisies par chaque demandeur.
2. **Given** une demande en attente, **When** l'administrateur la valide, **Then** un compte est créé, le statut passe à « validée » et un email contenant les informations de compte est envoyé au demandeur.
3. **Given** une demande en attente, **When** l'administrateur la rejette, **Then** le statut passe à « rejetée » et le demandeur est notifié que sa demande n'a pas été approuvée.
4. **Given** une demande dont l'administrateur corrige un champ avant validation, **When** il valide, **Then** ce sont les informations corrigées qui sont enregistrées dans le compte et envoyées par email.
5. **Given** une demande validée, **When** l'envoi de l'email de compte échoue, **Then** l'administrateur voit l'échec et peut relancer l'envoi.
6. **Given** une demande déjà validée, **When** une nouvelle tentative de validation est déclenchée (double clic ou second administrateur), **Then** aucun second compte n'est créé.

---

### User Story 3 - Renvoi individuel des informations de compte (Priority: P2)

Pour un étudiant ou un parent déjà enregistré et validé, l'administrateur peut renvoyer par email les informations de compte à ce seul destinataire (par exemple en cas d'email perdu ou d'adresse corrigée).

**Why this priority**: Important pour le support au quotidien, mais le système reste utilisable sans cette fonction puisque l'email est déjà envoyé automatiquement à la validation. Dépend de US2.

**Independent Test**: Sélectionner un compte validé, déclencher le renvoi, et vérifier qu'un email d'informations de compte est bien envoyé à ce destinataire.

**Acceptance Scenarios**:

1. **Given** un compte validé, **When** l'administrateur déclenche « renvoyer les informations de compte », **Then** l'email d'informations de compte est renvoyé à cette personne.
2. **Given** un compte dont l'adresse email a été corrigée, **When** le renvoi est déclenché, **Then** l'email part vers la nouvelle adresse.
3. **Given** un compte validé, **When** le renvoi est déclenché et que l'envoi échoue, **Then** l'administrateur voit l'échec et peut réessayer.

---

### User Story 4 - Envoi collectif des informations de compte (Priority: P3)

L'administrateur peut envoyer les informations de compte par email à plusieurs comptes validés en une seule action : à une sélection multiple, à un groupe filtré (par exemple tous les parents, ou tous les étudiants d'un niveau) ou à l'ensemble des comptes validés.

**Why this priority**: Apporte un gain de temps lors d'un onboarding en masse (rentrée scolaire), mais le renvoi individuel (US3) couvre déjà les besoins de correction unitaire. Dépend de US2.

**Independent Test**: Sélectionner plusieurs comptes validés, déclencher l'envoi groupé, et vérifier que chaque destinataire reçoit ses propres informations de compte.

**Acceptance Scenarios**:

1. **Given** plusieurs comptes validés sélectionnés, **When** l'administrateur déclenche l'envoi collectif, **Then** chaque compte sélectionné reçoit un email contenant ses propres informations de compte.
2. **Given** un envoi collectif où certains emails échouent, **When** l'envoi se termine, **Then** l'administrateur voit un résultat par destinataire (envoyé / échoué) et peut relancer les échecs.
3. **Given** l'administrateur a filtré les comptes (par exemple par type étudiant/parent), **When** il déclenche « envoyer à tous les comptes affichés », **Then** seuls les comptes correspondant au filtre reçoivent l'email.
4. **Given** un envoi collectif, **When** il est exécuté, **Then** chaque destinataire ne reçoit que ses propres informations de compte (aucune fuite des identifiants d'autres comptes).

---

### Edge Cases

- **Inscription en double** : un même email soumet deux demandes, ou un email correspond déjà à un compte validé — la demande en double doit être bloquée ou signalée.
- **Email invalide / non délivrable** : l'email de compte rebondit après validation — l'administrateur doit voir l'échec d'envoi et pouvoir corriger l'adresse puis relancer.
- **Validation concurrente** : deux administrateurs valident la même demande, ou un double clic — un seul compte doit être créé.
- **Demandeur rejeté qui re-soumet** : une personne dont la demande a été rejetée soumet une nouvelle demande — le système doit l'accepter comme nouvelle demande en attente.
- **Demandes anciennes jamais traitées** : des demandes restent « en attente » très longtemps — elles doivent rester visibles et triables pour l'administrateur.
- **Parent référant un étudiant inconnu** : un parent s'inscrit en mentionnant un étudiant qui n'est pas (encore) dans le système — l'administrateur doit pouvoir traiter le cas lors de la vérification.
- **Envoi collectif volumineux** : envoi à un grand nombre de destinataires avec échecs partiels — le résultat par destinataire doit rester lisible et les échecs rejouables.
- **Champs incohérents** : type « étudiant » mais informations de parent renseignées, ou inversement — la vérification administrateur doit permettre de corriger avant validation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT proposer un formulaire d'inscription accessible publiquement, permettant à un visiteur de s'enregistrer en tant qu'étudiant ou en tant que parent.
- **FR-002**: Le système DOIT collecter au minimum, pour chaque demande, le nom, le prénom, l'adresse email et le type de demandeur (étudiant ou parent), ainsi que les informations spécifiques au type (pour un étudiant : la classe/le niveau concerné ; pour un parent : l'identité de l'étudiant rattaché).
- **FR-003**: Le système DOIT valider la présence des champs obligatoires et le format de l'adresse email avant d'accepter une soumission, et indiquer clairement les corrections à apporter.
- **FR-004**: Le système DOIT enregistrer chaque soumission comme une demande d'inscription, avec le statut « en attente » et une date de soumission.
- **FR-005**: Le système DOIT afficher au demandeur une confirmation indiquant que sa demande a été reçue et qu'elle est en attente de validation.
- **FR-006**: Le système DOIT empêcher ou signaler les demandes d'inscription en double pour une même adresse email.
- **FR-007**: Le système DOIT fournir une interface réservée à l'administrateur, accessible uniquement après authentification de l'administrateur, listant toutes les demandes d'inscription en attente avec le détail des informations saisies.
- **FR-008**: L'administrateur DOIT pouvoir consulter et, si besoin, corriger les informations saisies dans une demande avant de la valider.
- **FR-009**: L'administrateur DOIT pouvoir valider une demande d'inscription, ce qui enregistre définitivement le demandeur et crée un compte utilisateur à partir des informations (éventuellement corrigées).
- **FR-010**: L'administrateur DOIT pouvoir rejeter une demande d'inscription.
- **FR-011**: Le système DOIT, à la validation d'une demande, envoyer automatiquement au demandeur un email contenant les informations de son compte.
- **FR-012**: Le système DOIT, au rejet d'une demande, notifier le demandeur que sa demande n'a pas été approuvée, avec un motif optionnel.
- **FR-013**: Le système DOIT garantir que la validation d'une demande crée exactement un compte, même en cas de tentatives de validation répétées ou concurrentes.
- **FR-014**: Le système DOIT afficher à l'administrateur le statut de chaque demande d'inscription (en attente / validée / rejetée).
- **FR-015**: L'administrateur DOIT pouvoir consulter la liste des comptes validés (étudiants et parents).
- **FR-016**: L'administrateur DOIT pouvoir renvoyer l'email d'informations de compte à un seul compte validé (envoi individuel).
- **FR-017**: L'administrateur DOIT pouvoir envoyer l'email d'informations de compte à plusieurs comptes validés en une seule action (envoi collectif), via une sélection multiple ou un groupe filtré.
- **FR-018**: Le système DOIT indiquer le résultat de chaque envoi d'email (succès / échec) par destinataire et permettre à l'administrateur de relancer les envois en échec.
- **FR-019**: Le système DOIT permettre à l'administrateur de filtrer et rechercher les demandes et les comptes (par statut, par type, par nom/email).
- **FR-020**: Les informations de compte envoyées par email DOIVENT permettre au destinataire d'accéder à son compte de manière sécurisée (identifiants temporaires à changer à la première utilisation, ou lien d'activation), sans exposer les identifiants à une personne autre que le titulaire du compte.
- **FR-021**: Le système DOIT conserver une trace auditable des actions de validation, de rejet et d'envoi d'email (qui, quoi, quand).
- **FR-022**: Le système DOIT protéger le formulaire d'inscription contre les soumissions automatisées ou abusives (mécanisme anti-spam de base / limitation de débit).

### Key Entities *(include if feature involves data)*

- **Demande d'inscription** : candidature soumise par un visiteur. Attributs : type de demandeur (étudiant/parent), nom, prénom, email, informations spécifiques au type (classe/niveau pour un étudiant ; étudiant rattaché pour un parent), statut (en attente / validée / rejetée), date de soumission, date de traitement, administrateur ayant traité la demande, motif de rejet (optionnel).
- **Compte** : créé lors de la validation d'une demande. Attributs : type (étudiant/parent), identité, email, identifiants d'accès, date de création, lien vers la demande d'inscription d'origine. Un compte parent peut être relié à un ou plusieurs comptes étudiants.
- **Administrateur** : utilisateur authentifié qui consulte les demandes, gère les comptes et déclenche les envois d'email.
- **Email de compte** : message transmettant les informations de compte à un destinataire ; suivi avec un statut d'envoi (succès/échec) et un horodatage par destinataire.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur peut remplir et soumettre le formulaire d'inscription en moins de 3 minutes.
- **SC-002**: 95 % des demandes d'inscription soumises sont correctement enregistrées et visibles par l'administrateur dans les secondes qui suivent la soumission.
- **SC-003**: Un administrateur peut consulter puis valider ou rejeter une demande d'inscription en moins d'une minute.
- **SC-004**: 100 % des demandes validées aboutissent à exactement un compte créé et un email d'informations de compte envoyé.
- **SC-005**: Un administrateur peut envoyer les informations de compte à un groupe d'au moins 100 comptes en une seule action collective.
- **SC-006**: Pour chaque envoi d'email (individuel ou collectif), l'administrateur peut consulter un résultat de livraison par destinataire.
- **SC-007**: Moins de 5 % des demandeurs validés ont besoin de contacter le support pour obtenir ou utiliser leurs informations de compte.
- **SC-008**: L'onboarding des familles validées en début d'année est réalisé via un envoi collectif unique plutôt qu'un message par famille.

## Out of Scope

- L'espace authentifié étudiant/parent (les écrans et contenus accessibles après connexion) — livré par d'autres fonctionnalités.
- La réinitialisation de mot de passe en libre-service par les étudiants/parents (seul le renvoi par l'administrateur est couvert ici).
- Le paiement ou les frais de scolarité liés à l'inscription.
- L'import en masse d'étudiants/parents existants depuis un système externe.
- La gestion du cycle de vie des comptes après création (suspension, suppression, modification de profil par le titulaire).

## Assumptions

- Le compte créé à la validation comprend des identifiants de connexion (un identifiant et un mot de passe temporaire, ou un lien d'activation) pour la plateforme EcoleDigitale. L'espace authentifié dans lequel l'étudiant/parent se connecte ensuite est hors périmètre de cette fonctionnalité ; cette fonctionnalité couvre la collecte des demandes, la validation par l'administrateur, la création du compte et la livraison des identifiants par email.
- Un mécanisme d'authentification administrateur protège l'interface de validation et la gestion des comptes ; seuls les administrateurs authentifiés peuvent y accéder. La mise en place de cet accès administrateur fait partie de cette fonctionnalité, l'interface de validation ne pouvant exister sans protection.
- L'envoi des emails s'appuie sur la capacité d'emailing transactionnel déjà prévue dans le projet.
- Les demandes et les comptes sont stockés de manière persistante ; cette fonctionnalité introduit un stockage persistant, le site actuel étant principalement statique.
- Pour une inscription étudiant, la classe/le niveau concerné est collecté ; pour un parent, l'identité de l'étudiant rattaché est collectée afin que l'administrateur puisse vérifier et établir le lien.
- Les demandeurs rejetés sont notifiés par email, avec un motif optionnel ; ils peuvent soumettre une nouvelle demande.
- Les identifiants de compte ne sont envoyés qu'à l'adresse email du titulaire ; un envoi collectif délivre à chaque destinataire uniquement ses propres identifiants.
- L'envoi collectif cible une sélection ou un groupe filtré de comptes validés (par exemple tous les parents, tous les étudiants d'un niveau), pas nécessairement littéralement l'ensemble des comptes.
- L'administrateur utilise principalement la fonctionnalité sur ordinateur ; le formulaire d'inscription est responsive pour les demandeurs sur mobile.
- L'interface et les emails sont en français.
