/**
 * FAQ de la page d'accueil — version plain text pour le JSON-LD (FAQPage).
 *
 * Les réponses ici sont en texte brut (sans markup). Le composant
 * `components/marketing/FAQ.tsx` conserve sa propre version avec liens
 * cliquables enrichis pour l'UI. Garder les deux synchronisés lors d'une
 * mise à jour : même question, même substance de réponse.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export const HOME_FAQ: readonly FaqEntry[] = [
  {
    question: 'Combien coûte EcoleDigitale ?',
    answer:
      "Le prix dépend du nombre d'étudiants, des modules activés et de la durée d'engagement. Nous construisons une offre adaptée après un premier échange — pas de tarif standard affiché publiquement. Demandez un devis personnalisé via le formulaire de démonstration.",
  },
  {
    question: 'Combien de temps pour démarrer ?',
    answer:
      "Comptez 1 à 3 semaines entre la signature et la mise en service réelle. Nous importons vos données existantes (étudiants, classes, programmes) et formons vos équipes clés sur cette période.",
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer:
      "Vos données sont hébergées en Union Européenne avec sauvegardes régulières, contrôle d'accès par rôle et chiffrement en transit. Voir la politique de confidentialité pour le détail.",
  },
  {
    question: 'Faut-il activer tous les modules ?',
    answer:
      "Non. Le Socle EcoleDigitale est suffisant pour la plupart des établissements. Vous activez les autres modules (Parcours BTS, Parcours Supérieur, ProFormation, Campus Live) uniquement si votre activité le justifie, et au moment où vous en avez besoin.",
  },
  {
    question: 'Peut-on migrer depuis un autre outil ou un fichier Excel ?',
    answer:
      "Oui. Nous importons les données existantes sous forme de fichiers structurés (Excel, CSV) ou via les exports de votre outil actuel. L'équipe d'onboarding accompagne cette étape.",
  },
] as const;
