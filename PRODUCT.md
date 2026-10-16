# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Décideurs d'établissements scolaires d'Afrique francophone, avec la Côte d'Ivoire comme marché de référence : fondateurs et directeurs d'écoles privées (maternelle, primaire, collège, lycée), d'établissements supérieurs et d'instituts BTS, de centres de formation et d'écoles en ligne. Ils évaluent un logiciel de gestion pour digitaliser la scolarité, les notes et bulletins, les frais de scolarité et la relation avec les parents, puis demandent une démonstration. Audiences secondaires : responsables pédagogiques, économat, secrétariat. Le site est en français.

## Product Purpose

EcoleDigitale est un logiciel de gestion scolaire (SaaS) qui centralise la gestion académique, pédagogique et financière d'un établissement, avec des espaces dédiés par profil (direction, enseignants, élèves et étudiants, parents). Il est édité par Alliance Consultants (Abidjan, Côte d'Ivoire). Le site marketing a un objectif primaire : générer des demandes de démonstration qualifiées. Il sert aussi à expliquer l'offre, à qualifier les leads via les pages module, et à être trouvé en recherche organique.

## Positioning

Une offre modulaire par cycle : un socle commun, puis quatre packs activés selon les cycles de l'établissement (Primary : maternelle et primaire ; Secondary : collège et lycée ; Higher : supérieur, BTS et centres de formation ; Virtual : formation à distance), sans changer d'outil. Les offres (Starter, Professional, Enterprise) sont établies sur devis : aucun prix n'est affiché.

Fonctions que le site peut affirmer (livrées) : notes et bulletins selon les règles ivoiriennes, conseil de classe et suivi de l'éligibilité aux examens (CEPE, BEPC, BAC), emploi du temps, appel et absences depuis le téléphone, portail parents, paiement des frais de scolarité par Mobile Money intégré (sans nommer d'opérateur), SMS et WhatsApp aux parents, import Excel, LMS et classes virtuelles, certificats et attestations, assistant IA. À ne pas affirmer tant que ce n'est pas confirmé : fonctionnement hors connexion ou application installable, génération automatique de l'emploi du temps, élèves affectés par l'État.

## Operating Context

Le visiteur compare plusieurs solutions, souvent depuis un mobile, et se décide en quelques minutes. Canaux de contact alternatifs au formulaire : WhatsApp et téléphone (+225 01 01 51 01 36, un seul numéro) et e-mail (ecoledigitale@allianceconsultants.net). Ces coordonnées vivent dans `lib/site/contact.ts`. Une brochure est proposée en téléchargement.

## Capabilities and Constraints

- Application Next.js 15 (App Router), TypeScript, Tailwind CSS 4, MDX ; emails via Resend ; analytics Umami. Le contenu vit dans `content/` (MDX) et doit rester éditable.
- Un socle et quatre packs : Socle EcoleDigitale, EcoleDigitale Primary, Secondary, Higher, Virtual (slugs `socle-ecoledigitale`, `ecoledigitale-primary|secondary|higher|virtual`). Les anciens slugs (`parcours-bts`, `parcours-superieur`, `proformation`, `campus-live`) redirigent en 301.
- Pages : accueil, packs (comparatif + 5 pages), ressources (guides, glossaire ivoirien, exemple illustratif), auteurs, à-propos, demander-démo (+ merci), confidentialité. `/blog` redirige en 301 vers `/ressources`.
- Vocabulaire : celui de la Côte d'Ivoire et de l'Afrique francophone (CEPE, BEPC, BAC, MGA, conseil de classe, bulletins). Pas de cadre français (Qualiopi, RNCP, alternance) ni de règle chiffrée inventée.
- Le SEO technique (JSON-LD, métadonnées, Open Graph, sitemap) et le suivi d'événements des CTA doivent être conservés.
- Thème clair/sombre existant (le mode sombre est le thème par défaut).

## Brand Commitments

Nom : EcoleDigitale. Voix en français, professionnelle. Aucune identité visuelle ou logo imposé n'a été confirmée : l'identité visuelle actuelle (bleu/vert, Inter) est libre de remplacement.

## Evidence on Hand

Contenu réel dans `content/` (packs, guides, glossaire). Une étude de cas existe mais elle est fictive : signalée « Exemple illustratif » (`FictionalCaseBanner`, titre, fiche du hub), en `noindex` et hors du sitemap. Aucun témoignage client réel, chiffre de référence ni logo client n'a été fourni : ne rien inventer.

## Product Principles

- Un décideur doit comprendre en moins de 30 secondes ce que couvre la plateforme et pour quel parcours.
- La modularité est la preuve centrale : montrer le socle et les modules qui s'ajoutent.
- Chaque page mène vers une demande de démonstration sans friction, y compris depuis un mobile.
- Aucune preuve inventée : crédibilité par la clarté du produit et du contenu.

## Accessibility & Inclusion

Cible WCAG AA (tests axe et Lighthouse déjà en place). Usage mobile prioritaire et connexions variables : pages légères, lisibles et rapides.
