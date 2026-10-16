/**
 * FAQ de la page d'accueil : source unique du texte affiché (`components/marketing/FAQ.tsx`)
 * et du JSON-LD `FAQPage`. Les réponses sont en texte brut ; `link` désigne une expression
 * de la réponse qui devient un lien dans l'interface (le texte reste identique).
 */
export interface FaqEntry {
  question: string;
  answer: string;
  link?: { phrase: string; href: string };
}

export const HOME_FAQ: readonly FaqEntry[] = [
  {
    question: 'Pour quels établissements EcoleDigitale est-il conçu ?',
    answer:
      "Pour les établissements scolaires de la maternelle au supérieur, ainsi que pour la formation à distance. Un socle commun accueille quatre packs : Primary (maternelle et primaire), Secondary (collège et lycée), Higher (supérieur, BTS et centres de formation) et Virtual (cours à distance). EcoleDigitale s'adresse à l'Afrique francophone, avec la Côte d'Ivoire pour marché de référence.",
  },
  {
    question: 'Combien coûte EcoleDigitale ?',
    answer:
      "Aucun tarif n'est affiché : les offres (Starter, Professional et Enterprise) sont établies sur devis, après un premier échange sur votre établissement et les packs qui vous intéressent. Demandez un devis personnalisé via le formulaire de démonstration.",
    link: { phrase: 'Demandez un devis personnalisé', href: '/demander-demo' },
  },
  {
    question: 'Combien de temps pour démarrer ?',
    answer:
      'Comptez 1 à 3 semaines entre la signature et la mise en service réelle. Nous importons vos données existantes (élèves, classes, programmes) et formons vos équipes clés sur cette période.',
  },
  {
    question: 'Les notes et les bulletins suivent-ils les règles ivoiriennes ?',
    answer:
      "Oui. Les notes, les moyennes et les bulletins sont calculés selon les règles ivoiriennes. Le conseil de classe et le suivi de l'éligibilité aux examens (CEPE, BEPC et BAC) s'appuient sur ces résultats.",
  },
  {
    question: 'Les parents peuvent-ils payer les frais de scolarité par Mobile Money ?',
    answer:
      "Oui. Le paiement des frais de scolarité par Mobile Money est intégré à EcoleDigitale. L'établissement suit les paiements et les retards, et peut écrire aux parents par SMS et par WhatsApp.",
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer:
      "Vos données sont protégées par un contrôle d'accès par rôle, des sauvegardes régulières et un chiffrement en transit. Consultez la politique de confidentialité pour le détail.",
    link: { phrase: 'la politique de confidentialité', href: '/confidentialite' },
  },
  {
    question: 'Faut-il activer tous les packs ?',
    answer:
      "Non. Le socle EcoleDigitale couvre l'essentiel (élèves, notes, absences, frais, parents). Vous ajoutez uniquement les packs qui correspondent à vos cycles, et vous pouvez les combiner sur un même compte.",
    link: { phrase: 'Le socle EcoleDigitale', href: '/modules/socle-ecoledigitale' },
  },
  {
    question: 'Peut-on migrer depuis un autre outil ou un fichier Excel ?',
    answer:
      "Oui. EcoleDigitale importe vos fichiers Excel, et l'équipe vous accompagne dans cette étape pour éviter de tout ressaisir.",
  },
] as const;
