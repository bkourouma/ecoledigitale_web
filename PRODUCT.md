# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Décideurs d'établissements de formation en Afrique francophone (Côte d'Ivoire en premier lieu) : fondateurs et directeurs d'écoles privées, responsables d'instituts BTS, de cursus post-bac et de centres de formation professionnelle. Ils évaluent un logiciel de gestion pour digitaliser la scolarité, les paiements et le suivi pédagogique, puis demandent une démonstration. Audiences secondaires : responsables pédagogiques et de formation. Le site est en français.

## Product Purpose

EcoleDigitale est une plateforme SaaS qui centralise la gestion académique, pédagogique et financière d'un établissement, avec des espaces dédiés par profil (direction, enseignants, étudiants, parents, formateurs). Le site marketing a un objectif primaire : générer des demandes de démonstration qualifiées. Il sert aussi à expliquer l'offre, à qualifier les leads via les pages module, et à être trouvé en recherche organique.

## Positioning

Une offre modulaire par parcours : un socle commun, puis des modules spécialisés activés selon l'activité de l'établissement (BTS, supérieur, formation professionnelle, campus live), sans changer d'outil.

## Operating Context

Le visiteur compare plusieurs solutions, souvent depuis un mobile, et se décide en quelques minutes. Canaux de contact alternatifs au formulaire : WhatsApp et email. Une brochure est proposée en téléchargement.

## Capabilities and Constraints

- Application Next.js 15 (App Router), TypeScript, Tailwind CSS 4, MDX ; emails via Resend ; analytics Umami. Le contenu vit dans `content/` (MDX) et doit rester éditable.
- Cinq modules : Socle EcoleDigitale, Parcours BTS, Parcours Supérieur, Proformation, Campus Live.
- Pages : accueil, modules (comparatif + 5 pages), ressources (guides, glossaire, études de cas), blog, auteurs, à-propos, demander-démo (+ merci), confidentialité.
- Le SEO technique (JSON-LD, métadonnées, Open Graph, sitemap) et le suivi d'événements des CTA doivent être conservés.
- Thème clair/sombre existant (le mode sombre est le thème par défaut).

## Brand Commitments

Nom : EcoleDigitale. Voix en français, professionnelle. Aucune identité visuelle ou logo imposé n'a été confirmée : l'identité visuelle actuelle (bleu/vert, Inter) est libre de remplacement.

## Evidence on Hand

Contenu réel dans `content/` (modules, guides, glossaire). Une étude de cas existe mais elle est fictive et signalée comme telle (`FictionalCaseBanner`). Aucun témoignage client réel, chiffre de référence ni logo client n'a été fourni : ne rien inventer.

## Product Principles

- Un décideur doit comprendre en moins de 30 secondes ce que couvre la plateforme et pour quel parcours.
- La modularité est la preuve centrale : montrer le socle et les modules qui s'ajoutent.
- Chaque page mène vers une demande de démonstration sans friction, y compris depuis un mobile.
- Aucune preuve inventée : crédibilité par la clarté du produit et du contenu.

## Accessibility & Inclusion

Cible WCAG AA (tests axe et Lighthouse déjà en place). Usage mobile prioritaire et connexions variables : pages légères, lisibles et rapides.
