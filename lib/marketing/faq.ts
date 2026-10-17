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

/** Remplace l'expression `link.phrase` de la réponse par un lien `[phrase](href)`. */
export function answerWithInlineLink({ answer, link }: FaqEntry): string {
  if (!link || !answer.includes(link.phrase)) return answer;
  return answer.replace(link.phrase, `[${link.phrase}](${link.href})`);
}

function homeFaq(question: string): FaqEntry {
  const entry = HOME_FAQ.find((item) => item.question === question);
  if (!entry) throw new Error(`Question introuvable dans HOME_FAQ : ${question}`);
  return entry;
}

/** Métadonnées de la page `/faq` (le titre reçoit le suffixe « | EcoleDigitale » du gabarit). */
export const FAQ_PAGE = {
  path: '/faq',
  updatedAt: '2026-10-16',
  seo: {
    title: 'FAQ du logiciel de gestion scolaire',
    description:
      'Cycles et examens, notes et bulletins, frais de scolarité par Mobile Money, parents, données et tarifs : les réponses sur le logiciel EcoleDigitale.',
  },
} as const;

export interface FaqGroup {
  heading: string;
  entries: readonly FaqEntry[];
}

/**
 * FAQ de la page `/faq` : les questions de l'accueil (réutilisées telles quelles), complétées
 * par des questions qui s'appuient uniquement sur des fonctions livrées (voir PRODUCT.md).
 * Aucun prix : les offres sont sur devis.
 */
export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    heading: 'Choisir et démarrer',
    entries: [
      homeFaq('Pour quels établissements EcoleDigitale est-il conçu ?'),
      {
        question: 'EcoleDigitale est-il une école du numérique ?',
        answer:
          "Non. EcoleDigitale est un logiciel de gestion pour les établissements scolaires, édité par Alliance Consultants à Abidjan. Ce n'est pas un établissement de formation.",
      },
      homeFaq('Combien de temps pour démarrer ?'),
      homeFaq('Peut-on migrer depuis un autre outil ou un fichier Excel ?'),
      {
        question: 'Comment demander une démonstration ?',
        answer:
          'Remplissez le formulaire de démonstration, ou écrivez-nous par WhatsApp, par téléphone ou par e-mail. Nous répondons sous 48 h ouvrées, sans engagement.',
        link: { phrase: 'le formulaire de démonstration', href: '/demander-demo' },
      },
    ],
  },
  {
    heading: 'Cycles et examens',
    entries: [
      {
        question: 'Quels cycles EcoleDigitale couvre-t-il ?',
        answer:
          'La maternelle et le primaire (pack Primary), le collège et le lycée (pack Secondary), le supérieur, les instituts BTS et les centres de formation (pack Higher), et la formation à distance (pack Virtual). Tous reposent sur le même socle.',
        link: { phrase: 'pack Primary', href: '/modules/ecoledigitale-primary' },
      },
      {
        question: 'EcoleDigitale suit-il le CEPE, le BEPC et le BAC ?',
        answer:
          "Oui. La plateforme suit l'éligibilité des élèves au CEPE, au BEPC et au BAC à partir des résultats déjà saisis dans l'année, pour que la direction repère les élèves concernés.",
        link: { phrase: 'CEPE', href: '/ressources/glossaire/cepe' },
      },
      homeFaq('Faut-il activer tous les packs ?'),
      {
        question: 'Peut-on gérer plusieurs établissements sur un seul compte ?',
        answer:
          'Oui. Un groupe scolaire gère plusieurs établissements depuis un seul compte et combine les packs selon les cycles de chaque site.',
      },
      {
        question: 'EcoleDigitale convient-il hors de la Côte d’Ivoire ?',
        answer:
          "EcoleDigitale s'adresse à l'Afrique francophone, avec la Côte d'Ivoire pour marché de référence. Les règles et les examens décrits sont ceux de la Côte d'Ivoire : pour un autre pays, échangeons sur vos besoins lors d'une démonstration.",
        link: { phrase: "la Côte d'Ivoire pour marché de référence", href: '/cote-d-ivoire' },
      },
    ],
  },
  {
    heading: 'Notes et bulletins',
    entries: [
      homeFaq('Les notes et les bulletins suivent-ils les règles ivoiriennes ?'),
      {
        question: 'Qu’est-ce que la MGA ?',
        answer:
          "La MGA est la moyenne générale annuelle : elle résume les résultats d'un élève sur toute l'année scolaire et figure dans les bulletins de fin d'année.",
        link: { phrase: 'MGA', href: '/ressources/glossaire/mga' },
      },
      {
        question: 'Le conseil de classe est-il géré dans la plateforme ?',
        answer:
          "Oui. Le conseil de classe s'appuie sur les notes, les moyennes et les absences déjà saisies, ce qui évite de reconstituer les résultats à la main.",
        link: { phrase: 'conseil de classe', href: '/ressources/glossaire/conseil-de-classe' },
      },
    ],
  },
  {
    heading: 'Frais de scolarité et paiements',
    entries: [
      homeFaq('Les parents peuvent-ils payer les frais de scolarité par Mobile Money ?'),
      {
        question: 'Comment l’établissement suit-il les frais et les retards ?',
        answer:
          "Les frais de scolarité sont suivis élève par élève. La direction et l'administration voient ce qui est payé, ce qui reste dû et les retards, et peuvent écrire aux familles par SMS et par WhatsApp.",
        link: { phrase: 'frais de scolarité', href: '/fonctions/frais-de-scolarite' },
      },
    ],
  },
  {
    heading: 'Parents et mobile',
    entries: [
      {
        question: 'Les parents peuvent-ils suivre leur enfant depuis un téléphone ?',
        answer:
          'Oui. Les parents ont un portail pour les résultats, les absences et les frais de scolarité, et reçoivent aussi des messages par SMS et par WhatsApp.',
        link: { phrase: 'un portail', href: '/fonctions/portail-parents' },
      },
      {
        question: 'Peut-on faire l’appel depuis un téléphone ?',
        answer:
          "Oui. L'appel et les absences se saisissent depuis le téléphone de l'enseignant, puis sont consultables par la direction et par les parents.",
        link: { phrase: "L'appel et les absences", href: '/fonctions/emploi-du-temps-et-absences' },
      },
      {
        question: 'EcoleDigitale propose-t-il un assistant IA ?',
        answer:
          "Oui. Un assistant IA est intégré à la plateforme pour accompagner les équipes de l'établissement.",
      },
    ],
  },
  {
    heading: 'Données et sécurité',
    entries: [
      homeFaq('Mes données sont-elles sécurisées ?'),
      {
        question: 'Qui peut voir les données des élèves ?',
        answer:
          "L'accès est géré par rôle (direction, administration, enseignants, parents, élèves) : chaque profil accède à ce qui concerne sa fonction.",
      },
    ],
  },
  {
    heading: 'Tarifs',
    entries: [
      homeFaq('Combien coûte EcoleDigitale ?'),
      {
        question: 'Quelles sont les offres ?',
        answer:
          'Trois offres sont proposées : Starter, Professional et Enterprise. Toutes sont établies sur devis, selon votre établissement et les packs qui vous intéressent. Le détail se trouve sur la page des tarifs.',
        link: { phrase: 'la page des tarifs', href: '/tarifs' },
      },
    ],
  },
];

/** Toutes les questions de `/faq`, dans l'ordre d'affichage (JSON-LD `FAQPage`). */
export const ALL_FAQ: readonly FaqEntry[] = FAQ_GROUPS.flatMap((group) => group.entries);
