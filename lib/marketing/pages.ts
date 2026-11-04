import type { ModuleSlug } from '@/lib/content/module.schema';

/**
 * Contenu des pages « par sujet » du site : page Côte d'Ivoire et pages par fonction.
 * Un seul gabarit (`components/marketing/ContentPage.tsx`) les affiche, ce qui garde la mise
 * en page, le maillage et le JSON-LD identiques d'une page à l'autre.
 *
 * Règles de rédaction :
 * - uniquement des fonctions livrées (voir PRODUCT.md) ; aucun opérateur Mobile Money nommé ;
 * - aucun prix, aucun chiffre de référence, aucune certification ;
 * - `updatedAt` est la date réelle de dernière modification : la mettre à jour à chaque révision
 *   du contenu (elle alimente le `lastmod` du sitemap).
 * - Dans un texte, `[libellé](/chemin)` devient un lien interne (voir `InlineText`).
 */

/** Gabarit de titre du site : ` | EcoleDigitale` (16 caractères). */
export const TITLE_SUFFIX_LENGTH = ' | EcoleDigitale'.length;
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export interface PageSection {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
}

export interface PageFaqEntry {
  question: string;
  /** Texte brut, éventuellement avec des liens `[libellé](/chemin)`. */
  answer: string;
}

export interface ContentPageData {
  /** Chemin public, ex. `/fonctions/bulletins-et-notes`. */
  path: string;
  /** Surtitre au-dessus du H1. */
  kicker: string;
  h1: string;
  lead: string;
  seo: {
    /** Sans la marque : le gabarit ajoute ` | EcoleDigitale`. */
    title: string;
    description: string;
  };
  /** Date de dernière modification du contenu (AAAA-MM-JJ). */
  updatedAt: string;
  sections: readonly PageSection[];
  /** Packs à mettre en avant (« Packs concernés »). */
  packs: readonly ModuleSlug[];
  faq: readonly PageFaqEntry[];
  /** Liens « Voir aussi » (hors packs). */
  seeAlso: readonly { href: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Côte d'Ivoire
// ---------------------------------------------------------------------------

export const COTE_D_IVOIRE_PAGE: ContentPageData = {
  path: '/cote-d-ivoire',
  kicker: "Côte d'Ivoire et Afrique francophone",
  h1: "Un logiciel de gestion scolaire conçu pour les écoles de Côte d'Ivoire",
  lead: "EcoleDigitale est édité par Alliance Consultants à Abidjan. Il suit le rythme d'une école ivoirienne, de la maternelle au BTS : classes, notes et bulletins, conseil de classe, examens nationaux, frais de scolarité par Mobile Money et parents joignables sur leur téléphone.",
  seo: {
    title: "Logiciel de gestion d'école en Côte d'Ivoire",
    description:
      "Logiciel pour les écoles de Côte d'Ivoire : bulletins, CEPE, BEPC, BAC, frais de scolarité par Mobile Money et portail parents. Demandez une démo.",
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'Les cycles ivoiriens couverts',
      paragraphs: [
        "Un établissement ivoirien accueille rarement un seul cycle. EcoleDigitale part d'un socle commun, qui porte les élèves, les classes, les notes, les absences et les frais de scolarité, puis ajoute un pack par cycle. Vous activez uniquement ceux qui correspondent à votre école.",
      ],
      bullets: [
        'Maternelle et primaire, jusqu’au CM2 : pack [Primary](/modules/ecoledigitale-primary).',
        'Collège et lycée, de la 6e à la Terminale : pack [Secondary](/modules/ecoledigitale-secondary).',
        'Supérieur, instituts BTS et centres de formation : pack [Higher](/modules/ecoledigitale-higher).',
        'Formation à distance et classes virtuelles : pack [Virtual](/modules/ecoledigitale-virtual).',
      ],
    },
    {
      heading: 'Notes, moyennes et bulletins aux règles ivoiriennes',
      paragraphs: [
        "Les enseignants saisissent leurs notes dans la plateforme. Les moyennes et les bulletins sont calculés selon les règles ivoiriennes, sans tableur à rapprocher en fin de période. En fin d'année, la [MGA](/ressources/glossaire/mga), la moyenne générale annuelle, résume les résultats de l'élève sur toute l'année scolaire et figure dans son bulletin.",
        'Le détail de cette fonction est présenté sur la page [notes, moyennes et bulletins](/fonctions/bulletins-et-notes).',
      ],
    },
    {
      heading: 'Conseil de classe et examens : CEPE, BEPC, BAC',
      paragraphs: [
        "Le [conseil de classe](/ressources/glossaire/conseil-de-classe) retrouve, pour chaque élève, ses résultats et ses absences déjà saisis. EcoleDigitale suit aussi l'éligibilité des élèves aux examens nationaux : le [CEPE](/ressources/glossaire/cepe) en fin de primaire, le [BEPC](/ressources/glossaire/bepc) en fin de collège et le [BAC](/ressources/glossaire/bac) en fin de lycée.",
        "La direction repère ainsi les élèves concernés à partir des résultats de l'année, sans reconstituer un tableau à la main. Les conditions précises d'inscription et de passage restent celles des textes officiels et des consignes de l'administration.",
      ],
    },
    {
      heading: 'Frais de scolarité et Mobile Money',
      paragraphs: [
        "Pour beaucoup de familles, le téléphone sert déjà à payer au quotidien. Les parents règlent donc les frais de scolarité par Mobile Money, directement depuis la plateforme : le paiement est intégré à EcoleDigitale. L'établissement suit ce qui est payé, ce qui reste dû et les retards, élève par élève, et peut écrire aux familles par SMS et par WhatsApp.",
        'Voir le détail sur la page [frais de scolarité et Mobile Money](/fonctions/frais-de-scolarite).',
      ],
    },
    {
      heading: 'Des parents joignables sur leur téléphone',
      paragraphs: [
        "Chaque famille dispose d'un [portail parents](/fonctions/portail-parents) pour consulter les résultats, les absences et les frais de scolarité. L'école écrit aux parents par SMS et par WhatsApp, deux canaux qu'ils utilisent déjà. L'appel se fait depuis le téléphone de l'enseignant, et les absences sont ensuite visibles de la direction et des parents.",
      ],
    },
    {
      heading: 'Une école seule ou un groupe scolaire',
      paragraphs: [
        "Une école privée peut démarrer avec le socle seul. Un groupe scolaire gère plusieurs établissements depuis un seul compte et combine les packs selon les cycles de chaque site. Vos listes d'élèves et de classes existantes s'importent depuis Excel, pour éviter de tout ressaisir au démarrage.",
      ],
    },
    {
      heading: 'Une mise en route de 1 à 3 semaines',
      paragraphs: [
        "Comptez 1 à 3 semaines entre la signature et la mise en service. Un conseiller échange d'abord avec vous sur vos cycles et vos besoins. Nous paramétrons ensuite votre instance, importons vos données existantes et formons vos équipes clés.",
        'Les offres (Starter, Professional et Enterprise) sont établies sur devis : voir la page [tarifs](/tarifs). Toute demande reçoit une réponse sous 48 h ouvrées.',
      ],
    },
    {
      heading: 'Et dans le reste de l’Afrique francophone ?',
      paragraphs: [
        "EcoleDigitale s'adresse aux établissements d'Afrique francophone, avec la Côte d'Ivoire pour marché de référence : les cycles, les examens et les règles décrits sur cette page sont ceux de la Côte d'Ivoire. Si votre établissement se trouve dans un autre pays francophone, parlons de vos règles de calcul et de vos examens lors d'une démonstration.",
      ],
    },
  ],
  packs: [
    'socle-ecoledigitale',
    'ecoledigitale-primary',
    'ecoledigitale-secondary',
    'ecoledigitale-higher',
    'ecoledigitale-virtual',
  ],
  faq: [
    {
      question: 'EcoleDigitale convient-il à une école privée de Côte d’Ivoire ?',
      answer:
        "Oui. EcoleDigitale est conçu d'abord pour les établissements de Côte d'Ivoire, de la maternelle au supérieur : notes et bulletins selon les règles ivoiriennes, conseil de classe, suivi de l'éligibilité au CEPE, au BEPC et au BAC, et frais de scolarité par Mobile Money.",
    },
    {
      question: 'Qui édite EcoleDigitale ?',
      answer:
        "EcoleDigitale est édité par Alliance Consultants, à Abidjan, en Côte d'Ivoire. Les demandes de démonstration sont traitées en français, par formulaire, par WhatsApp, par téléphone ou par e-mail.",
    },
    {
      question: 'EcoleDigitale suit-il le CEPE, le BEPC et le BAC ?',
      answer:
        "Oui. La plateforme suit l'éligibilité des élèves au CEPE, au BEPC et au BAC à partir des résultats déjà saisis dans l'année, pour que la direction repère les élèves concernés.",
    },
    {
      question: 'Les parents peuvent-ils payer les frais par Mobile Money ?',
      answer:
        "Oui. Le paiement des frais de scolarité par Mobile Money est intégré à EcoleDigitale. L'établissement suit les paiements et les retards, et peut écrire aux parents par SMS et par WhatsApp.",
    },
    {
      question: 'Peut-on utiliser EcoleDigitale dans un autre pays d’Afrique francophone ?',
      answer:
        "EcoleDigitale s'adresse à l'Afrique francophone, avec la Côte d'Ivoire pour marché de référence. Les règles et les examens décrits sont ceux de la Côte d'Ivoire : pour un autre pays, échangeons sur vos besoins lors d'une démonstration.",
    },
  ],
  seeAlso: [
    { href: '/fonctions', label: 'Toutes les fonctions' },
    { href: '/faq', label: 'Questions fréquentes' },
    { href: '/tarifs', label: 'Tarifs : des offres sur devis' },
    {
      href: '/ressources/guides/choisir-logiciel-gestion-ecole-privee',
      label: "Guide : choisir un logiciel d'école en Côte d'Ivoire",
    },
    { href: '/ressources', label: 'Guides et glossaire' },
  ],
};

// ---------------------------------------------------------------------------
// Fonctions
// ---------------------------------------------------------------------------

export const BULLETINS_PAGE: ContentPageData = {
  path: '/fonctions/bulletins-et-notes',
  kicker: 'Fonction : notes et bulletins',
  h1: 'Notes, moyennes et bulletins sans tableur',
  lead: "Les enseignants saisissent leurs notes, EcoleDigitale calcule les moyennes et produit les bulletins selon les règles ivoiriennes. Le conseil de classe et le suivi de l'éligibilité au CEPE, au BEPC et au BAC s'appuient sur les mêmes résultats.",
  seo: {
    title: 'Logiciel de bulletins et de notes pour école',
    description:
      'Notes, moyennes, MGA et bulletins selon les règles ivoiriennes, conseil de classe et suivi du CEPE, du BEPC et du BAC. Demandez une démonstration.',
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'De la saisie des notes au bulletin',
      paragraphs: [
        "Dans beaucoup d'écoles, les notes passent par des cahiers, puis par un tableur, puis par un bulletin recopié à la main. Chaque étape ajoute un risque d'erreur et du temps perdu en fin de période. Avec EcoleDigitale, la chaîne tient dans un seul outil.",
      ],
      bullets: [
        'Les enseignants saisissent leurs notes pour leurs classes et leurs matières.',
        'La plateforme calcule les moyennes selon les règles ivoiriennes.',
        'Les bulletins sont produits à partir des résultats saisis, sans ressaisie.',
        'La direction et le secrétariat suivent les résultats de toutes les classes au même endroit.',
      ],
    },
    {
      heading: 'Des moyennes selon les règles ivoiriennes',
      paragraphs: [
        "Les notes, les moyennes et les bulletins sont calculés selon les règles ivoiriennes, et non selon une règle importée d'un autre pays. Pour l'établissement, cela veut dire moins de calculs à vérifier et des résultats cohérents d'une classe à l'autre.",
        "En fin d'année, la [MGA](/ressources/glossaire/mga) (moyenne générale annuelle) résume les résultats d'un élève sur l'ensemble de l'année scolaire. Elle figure dans les bulletins de fin d'année et éclaire les décisions prises à ce moment-là.",
      ],
    },
    {
      heading: 'Un conseil de classe préparé à partir des résultats',
      paragraphs: [
        "Le [conseil de classe](/ressources/glossaire/conseil-de-classe) retrouve, pour chaque élève, ses notes, ses moyennes et ses absences déjà saisies dans la plateforme. Les enseignants et la direction n'ont plus à reconstituer les résultats avant la réunion, et l'établissement garde une trace claire de ce qui a été décidé pour chaque élève.",
      ],
    },
    {
      heading: 'Suivre l’éligibilité au CEPE, au BEPC et au BAC',
      paragraphs: [
        "En fin de cycle, EcoleDigitale suit l'éligibilité des élèves aux examens nationaux à partir des résultats de l'année : le [CEPE](/ressources/glossaire/cepe) pour le primaire, le [BEPC](/ressources/glossaire/bepc) pour le collège et le [BAC](/ressources/glossaire/bac) pour le lycée.",
        "La direction voit rapidement quels élèves sont concernés. Les conditions précises relèvent des textes officiels et des consignes de l'administration.",
      ],
    },
    {
      heading: 'Pour quels cycles',
      paragraphs: [
        'Les notes et les bulletins font partie du [socle EcoleDigitale](/modules/socle-ecoledigitale). Le pack [Primary](/modules/ecoledigitale-primary) les applique au rythme de la maternelle et du primaire, le pack [Secondary](/modules/ecoledigitale-secondary) à celui du collège et du lycée. Le pack [Higher](/modules/ecoledigitale-higher) produit les bulletins et les relevés de notes des écoles supérieures et des instituts BTS.',
        "Vous changez d'outil ? Vos listes d'élèves et de classes s'importent depuis Excel. Pour préparer la bascule, lisez notre guide [Bulletins et moyennes : sortir d'Excel en 5 étapes](/ressources/guides/bulletins-sans-excel).",
      ],
    },
  ],
  packs: [
    'socle-ecoledigitale',
    'ecoledigitale-primary',
    'ecoledigitale-secondary',
    'ecoledigitale-higher',
  ],
  faq: [
    {
      question: 'Les bulletins suivent-ils les règles ivoiriennes ?',
      answer:
        'Oui. Les notes, les moyennes et les bulletins sont calculés selon les règles ivoiriennes. Le conseil de classe et le suivi des examens (CEPE, BEPC et BAC) s’appuient sur ces résultats.',
    },
    {
      question: 'Qu’est-ce que la MGA ?',
      answer:
        "La MGA est la moyenne générale annuelle : elle résume les résultats d'un élève sur toute l'année scolaire et figure dans les bulletins de fin d'année.",
    },
    {
      question: 'Peut-on reprendre nos listes d’élèves depuis Excel ?',
      answer:
        'Oui. EcoleDigitale importe vos fichiers Excel, ce qui évite de tout ressaisir au démarrage. Comptez 1 à 3 semaines entre la signature et la mise en service.',
    },
    {
      question: 'Le conseil de classe est-il géré dans la plateforme ?',
      answer:
        "Oui. Le conseil de classe s'appuie sur les notes, les moyennes et les absences déjà saisies, ce qui évite de reconstituer les résultats à la main.",
    },
  ],
  seeAlso: [
    { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
    { href: '/fonctions/portail-parents', label: 'Portail parents' },
    { href: '/fonctions/frais-de-scolarite', label: 'Frais de scolarité et Mobile Money' },
    {
      href: '/ressources/guides/bulletins-sans-excel',
      label: 'Guide : sortir d’Excel pour les bulletins',
    },
    { href: '/faq', label: 'Questions fréquentes' },
  ],
};

export const FRAIS_PAGE: ContentPageData = {
  path: '/fonctions/frais-de-scolarite',
  kicker: 'Fonction : frais de scolarité',
  h1: 'Suivre les frais de scolarité, les paiements et les retards',
  lead: "Les frais sont suivis élève par élève, les parents paient par Mobile Money depuis la plateforme et l'établissement voit ce qui est payé, ce qui reste dû et les retards. Il peut écrire aux familles par SMS et par WhatsApp.",
  seo: {
    title: 'Frais de scolarité et paiement Mobile Money',
    description:
      'Suivi des frais de scolarité par élève, paiement par Mobile Money intégré, retards et messages aux parents par SMS et WhatsApp. Demandez une démonstration.',
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'Des frais suivis élève par élève',
      paragraphs: [
        "Les frais de scolarité et leurs échéanciers sont suivis pour chaque élève, dans le même dossier que ses notes et ses absences. L'économat n'a plus à croiser un cahier de caisse, un tableur et des listes de classe pour savoir où en est une famille.",
      ],
    },
    {
      heading: 'Le paiement par Mobile Money, dans la plateforme',
      paragraphs: [
        "Les parents règlent les frais de scolarité par Mobile Money, directement depuis la plateforme. Le paiement est intégré à EcoleDigitale : il est relié au dossier de l'élève, et l'établissement n'a pas à rapprocher des fichiers à la main.",
        "Pour savoir si l'opérateur utilisé par vos familles est pris en charge, posez la question lors de votre démonstration : un conseiller vous répond précisément.",
      ],
    },
    {
      heading: 'Voir ce qui est payé, ce qui reste dû et les retards',
      paragraphs: [
        "La direction et l'administration suivent en un coup d'œil les frais payés, les frais restants et les retards. Le suivi se fait par élève, et des tableaux de bord donnent à la direction une vue d'ensemble de l'établissement.",
      ],
      bullets: [
        'Ce qui est payé par chaque famille.',
        'Ce qui reste dû, élève par élève.',
        'Les retards, pour savoir qui contacter en priorité.',
      ],
    },
    {
      heading: 'Écrire aux familles par SMS et par WhatsApp',
      paragraphs: [
        "Quand un paiement est en retard, l'établissement écrit aux parents par SMS et par WhatsApp, deux canaux que les familles consultent déjà tous les jours.",
      ],
    },
    {
      heading: 'Les parents voient leurs frais',
      paragraphs: [
        "Dans le [portail parents](/fonctions/portail-parents), chaque famille consulte les frais de scolarité de son enfant, en plus des résultats et des absences. L'établissement et la famille consultent la même information.",
      ],
    },
    {
      heading: 'Pour quels établissements',
      paragraphs: [
        'Le suivi des frais fait partie du [socle EcoleDigitale](/modules/socle-ecoledigitale), donc de tous les établissements : [primaire](/modules/ecoledigitale-primary), [collège et lycée](/modules/ecoledigitale-secondary), [supérieur et BTS](/modules/ecoledigitale-higher) (avec une vision financière par programme) et [formation à distance](/modules/ecoledigitale-virtual). Les offres sont établies sur devis : voir les [tarifs](/tarifs).',
        'Pour organiser le suivi des échéances dans votre établissement, lisez le guide [Frais de scolarité : suivre les impayés](/ressources/guides/reduire-impayes-frais-de-scolarite).',
      ],
    },
  ],
  packs: [
    'socle-ecoledigitale',
    'ecoledigitale-primary',
    'ecoledigitale-secondary',
    'ecoledigitale-higher',
    'ecoledigitale-virtual',
  ],
  faq: [
    {
      question: 'Les parents peuvent-ils payer par Mobile Money ?',
      answer:
        "Oui. Le paiement des frais de scolarité par Mobile Money est intégré à EcoleDigitale. L'établissement suit les paiements et les retards.",
    },
    {
      question: 'Comment l’établissement suit-il les retards de paiement ?',
      answer:
        "Les frais sont suivis élève par élève. La direction et l'administration voient ce qui est payé, ce qui reste dû et les retards, et peuvent écrire aux familles par SMS et par WhatsApp.",
    },
    {
      question: 'Les parents voient-ils leurs frais de scolarité ?',
      answer:
        "Oui. Le portail parents affiche les frais de scolarité de l'enfant, avec ses résultats et ses absences.",
    },
    {
      question: 'Quel opérateur Mobile Money est pris en charge ?',
      answer:
        "Le paiement par Mobile Money est intégré à la plateforme. Pour vérifier la prise en charge de l'opérateur de vos familles, posez la question lors de la démonstration.",
    },
  ],
  seeAlso: [
    { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
    { href: '/fonctions/portail-parents', label: 'Portail parents' },
    { href: '/fonctions/bulletins-et-notes', label: 'Notes, moyennes et bulletins' },
    {
      href: '/ressources/guides/reduire-impayes-frais-de-scolarite',
      label: 'Guide : suivre les impayés de frais de scolarité',
    },
    { href: '/faq', label: 'Questions fréquentes' },
  ],
};

export const PORTAIL_PARENTS_PAGE: ContentPageData = {
  path: '/fonctions/portail-parents',
  kicker: 'Fonction : portail parents',
  h1: 'Un espace parents pour suivre résultats, absences et frais',
  lead: "Chaque famille consulte les résultats, les absences et les frais de scolarité de son enfant depuis un portail, et reçoit les messages de l'école par SMS et par WhatsApp. Les frais se règlent par Mobile Money.",
  seo: {
    title: "Portail parents d'élèves : notes et absences",
    description:
      "Résultats, absences et frais de scolarité dans un portail pour les parents, avec messages de l'école par SMS et WhatsApp. Demandez une démonstration.",
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'Ce que les parents consultent',
      paragraphs: [
        "Le portail parents regroupe, pour chaque famille, l'essentiel du suivi scolaire de son enfant. Les parents n'attendent plus le bulletin papier ni un appel de l'école pour savoir où en est leur enfant.",
      ],
      bullets: [
        'Les résultats et les bulletins.',
        'Les absences, saisies par les enseignants.',
        'Les frais de scolarité : ce qui est payé et ce qui reste dû.',
      ],
    },
    {
      heading: 'Sur un téléphone',
      paragraphs: [
        "Beaucoup de parents suivent l'école depuis leur téléphone. Le portail leur permet de consulter le dossier de leur enfant sans se déplacer, et l'école les joint par les canaux qu'ils utilisent déjà.",
      ],
    },
    {
      heading: 'Des messages par SMS et par WhatsApp',
      paragraphs: [
        "L'établissement écrit aux parents par SMS et par WhatsApp : une absence, une information de la direction, un rappel de paiement. Les messages partent de la plateforme, sans passer par un autre outil.",
      ],
    },
    {
      heading: 'Les absences visibles dès leur saisie',
      paragraphs: [
        "L'appel se fait depuis le téléphone de l'enseignant. Les absences saisies sont ensuite consultables par la direction et par les parents. Pour le détail, voir la page [emploi du temps et absences](/fonctions/emploi-du-temps-et-absences).",
      ],
    },
    {
      heading: 'Pour la direction et le secrétariat',
      paragraphs: [
        "Le portail parents n'est pas un outil de plus à alimenter : il affiche ce que l'établissement a déjà saisi dans la plateforme (notes, absences, frais). La direction et le secrétariat gardent une seule source d'information, et les familles voient la même chose qu'eux.",
      ],
    },
    {
      heading: 'Payer les frais de scolarité par Mobile Money',
      paragraphs: [
        'Les parents règlent les frais de scolarité par Mobile Money, directement depuis la plateforme, et retrouvent dans le portail ce qui reste dû. Voir la page [frais de scolarité et Mobile Money](/fonctions/frais-de-scolarite).',
      ],
    },
    {
      heading: 'Pour quels cycles',
      paragraphs: [
        'Le portail parents fait partie du [socle EcoleDigitale](/modules/socle-ecoledigitale). Il est présent dans les packs [Primary](/modules/ecoledigitale-primary) et [Secondary](/modules/ecoledigitale-secondary), où les familles suivent les résultats, les absences et les frais des élèves de la maternelle au lycée.',
      ],
    },
  ],
  packs: ['socle-ecoledigitale', 'ecoledigitale-primary', 'ecoledigitale-secondary'],
  faq: [
    {
      question: 'Les parents peuvent-ils suivre leur enfant depuis un téléphone ?',
      answer:
        'Oui. Les parents ont un portail pour les résultats, les absences et les frais de scolarité, et reçoivent aussi des messages par SMS et par WhatsApp.',
    },
    {
      question: 'Que voient les parents dans le portail ?',
      answer:
        "Les résultats et les bulletins, les absences saisies par les enseignants, et les frais de scolarité de l'enfant.",
    },
    {
      question: 'L’école peut-elle écrire aux parents par WhatsApp ?',
      answer:
        "Oui. L'établissement écrit aux parents par SMS et par WhatsApp depuis la plateforme.",
    },
    {
      question: 'Les parents peuvent-ils payer les frais depuis le portail ?',
      answer:
        'Oui. Le paiement des frais de scolarité par Mobile Money est intégré à EcoleDigitale.',
    },
  ],
  seeAlso: [
    { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
    { href: '/fonctions/frais-de-scolarite', label: 'Frais de scolarité et Mobile Money' },
    { href: '/fonctions/emploi-du-temps-et-absences', label: 'Emploi du temps et absences' },
    { href: '/fonctions/bulletins-et-notes', label: 'Notes, moyennes et bulletins' },
    { href: '/faq', label: 'Questions fréquentes' },
  ],
};

export const EMPLOI_DU_TEMPS_PAGE: ContentPageData = {
  path: '/fonctions/emploi-du-temps-et-absences',
  kicker: 'Fonction : emploi du temps et absences',
  h1: 'Emploi du temps partagé et appel depuis le téléphone',
  lead: "L'emploi du temps des classes et des enseignants est partagé entre la direction, les enseignants et les élèves. L'appel se fait depuis le téléphone de l'enseignant, et les absences sont visibles de la direction et des parents.",
  seo: {
    title: 'Emploi du temps et suivi des absences',
    description:
      'Emploi du temps des classes et des enseignants, appel depuis le téléphone, absences visibles de la direction et des parents. Demandez une démonstration.',
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'Un emploi du temps pour les classes et les enseignants',
      paragraphs: [
        "L'emploi du temps des classes et celui des enseignants vivent dans la même plateforme que les élèves, les matières et les notes. La direction, les enseignants et les élèves consultent la même version, au lieu d'un tableau affiché en salle des professeurs et de copies qui circulent.",
      ],
    },
    {
      heading: "L'appel depuis le téléphone de l'enseignant",
      paragraphs: [
        "L'enseignant fait l'appel depuis son téléphone, sans passer par une feuille de présence papier. Les absences saisies sont enregistrées dans la plateforme et restent attachées à l'élève.",
      ],
    },
    {
      heading: 'Les absences visibles de la direction et des parents',
      paragraphs: [
        "Les absences sont ensuite consultables par la direction et par les parents depuis le [portail parents](/fonctions/portail-parents). L'établissement peut aussi écrire aux familles par SMS et par WhatsApp.",
      ],
    },
    {
      heading: 'Qui fait quoi',
      paragraphs: [
        'Chaque profil retrouve dans la plateforme ce qui le concerne, sans demander une copie à un autre service.',
      ],
      bullets: [
        "La direction consulte l'emploi du temps et suit les absences de l'établissement.",
        "Les enseignants retrouvent leurs classes et font l'appel depuis leur téléphone.",
        "Les élèves consultent l'emploi du temps de leur classe.",
        'Les parents consultent les absences de leur enfant dans leur portail.',
      ],
    },
    {
      heading: 'Des absences utiles au conseil de classe',
      paragraphs: [
        'Au moment du [conseil de classe](/ressources/glossaire/conseil-de-classe), les absences de chaque élève sont déjà dans la plateforme, à côté de ses notes et de ses moyennes. Voir la page [notes, moyennes et bulletins](/fonctions/bulletins-et-notes).',
      ],
    },
    {
      heading: 'Pour quels cycles',
      paragraphs: [
        "L'emploi du temps, l'appel et les absences font partie du [socle EcoleDigitale](/modules/socle-ecoledigitale). Le pack [Secondary](/modules/ecoledigitale-secondary) les met au service des collèges et des lycées, où les enseignants interviennent dans plusieurs classes. Le pack [Primary](/modules/ecoledigitale-primary) les applique à la maternelle et au primaire, et le pack [Higher](/modules/ecoledigitale-higher) aux écoles supérieures.",
      ],
    },
  ],
  packs: [
    'socle-ecoledigitale',
    'ecoledigitale-primary',
    'ecoledigitale-secondary',
    'ecoledigitale-higher',
  ],
  faq: [
    {
      question: 'Qui peut consulter l’emploi du temps ?',
      answer:
        "L'emploi du temps des classes et des enseignants est partagé entre la direction, les enseignants et les élèves.",
    },
    {
      question: 'Peut-on faire l’appel depuis un téléphone ?',
      answer: "Oui. L'appel et les absences se saisissent depuis le téléphone de l'enseignant.",
    },
    {
      question: 'Les parents sont-ils informés des absences ?',
      answer:
        "Oui. Les absences saisies sont consultables par les parents, et l'établissement peut leur écrire par SMS et par WhatsApp.",
    },
  ],
  seeAlso: [
    { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
    { href: '/fonctions/portail-parents', label: 'Portail parents' },
    { href: '/fonctions/bulletins-et-notes', label: 'Notes, moyennes et bulletins' },
    { href: '/faq', label: 'Questions fréquentes' },
  ],
};

/** Pages par fonction, dans l'ordre d'affichage (hub, menu, pied de page). */
export const FEATURE_PAGES: readonly ContentPageData[] = [
  BULLETINS_PAGE,
  FRAIS_PAGE,
  PORTAIL_PARENTS_PAGE,
  EMPLOI_DU_TEMPS_PAGE,
];

/** Libellé court d'une fonction (menu, pied de page, cartes du hub). */
export const FEATURE_LABELS: Record<string, string> = {
  '/fonctions/bulletins-et-notes': 'Notes et bulletins',
  '/fonctions/frais-de-scolarite': 'Frais de scolarité et Mobile Money',
  '/fonctions/portail-parents': 'Portail parents',
  '/fonctions/emploi-du-temps-et-absences': 'Emploi du temps et absences',
};

/** Page d'index `/fonctions` : renvoie vers chaque page par fonction. */
export const FONCTIONS_HUB_PAGE: ContentPageData = {
  path: '/fonctions',
  kicker: 'Fonctions',
  h1: 'Les fonctions d’EcoleDigitale, des notes au paiement des frais',
  lead: "EcoleDigitale réunit dans un seul logiciel ce qu'un établissement scolaire fait chaque jour : notes et bulletins, absences, frais de scolarité, communication avec les parents. Chaque fonction a sa page, avec ce qu'elle couvre et les cycles concernés.",
  seo: {
    title: 'Fonctions du logiciel de gestion scolaire',
    description:
      "Notes et bulletins, frais de scolarité par Mobile Money, portail parents, emploi du temps et absences : les fonctions d'EcoleDigitale, cycle par cycle.",
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'Les fonctions du quotidien',
      paragraphs: [
        "Quatre fonctions reviennent chaque semaine dans une école. Ouvrez celle qui vous intéresse pour voir ce qu'elle couvre.",
      ],
      bullets: [
        '[Notes, moyennes et bulletins](/fonctions/bulletins-et-notes) : saisie des notes, moyennes selon les règles ivoiriennes, MGA, bulletins, conseil de classe et suivi du CEPE, du BEPC et du BAC.',
        '[Frais de scolarité et Mobile Money](/fonctions/frais-de-scolarite) : frais suivis élève par élève, paiement par Mobile Money intégré, retards et messages aux familles.',
        '[Portail parents](/fonctions/portail-parents) : résultats, absences et frais de scolarité dans un espace pour chaque famille.',
        '[Emploi du temps et absences](/fonctions/emploi-du-temps-et-absences) : emploi du temps des classes et des enseignants, appel depuis le téléphone.',
      ],
    },
    {
      heading: 'Et aussi dans la plateforme',
      paragraphs: [
        "D'autres fonctions complètent le socle et les packs, et sont présentées sur les fiches des packs.",
      ],
      bullets: [
        'Import de vos fichiers Excel, pour démarrer sans tout ressaisir.',
        'Certificats et attestations délivrés depuis la plateforme.',
        'Cours en ligne et classes virtuelles, avec le pack [Virtual](/modules/ecoledigitale-virtual).',
        'Tableaux de bord pour la direction, et pilotage de plusieurs établissements depuis un seul compte.',
        "Un assistant IA intégré pour accompagner les équipes de l'établissement.",
      ],
    },
    {
      heading: 'Un socle commun, un pack par cycle',
      paragraphs: [
        "Ces fonctions reposent sur le [socle EcoleDigitale](/modules/socle-ecoledigitale), commun à tous les établissements. Les packs Primary, Secondary, Higher et Virtual les adaptent à la maternelle et au primaire, au collège et au lycée, au supérieur et à la formation à distance. Pour le contexte ivoirien, voir la page [logiciel de gestion scolaire en Côte d'Ivoire](/cote-d-ivoire).",
      ],
    },
  ],
  packs: [
    'socle-ecoledigitale',
    'ecoledigitale-primary',
    'ecoledigitale-secondary',
    'ecoledigitale-higher',
    'ecoledigitale-virtual',
  ],
  faq: [
    {
      question: 'Quelles fonctions EcoleDigitale propose-t-il ?',
      answer:
        "Notes, moyennes et bulletins selon les règles ivoiriennes, conseil de classe, suivi de l'éligibilité au CEPE, au BEPC et au BAC, emploi du temps, appel et absences depuis le téléphone, portail parents, paiement des frais de scolarité par Mobile Money, SMS et WhatsApp aux parents, import Excel, certificats et attestations, LMS et classes virtuelles, et assistant IA.",
    },
    {
      question: 'Toutes les fonctions sont-elles incluses dans chaque pack ?',
      answer:
        "Le socle porte les fonctions communes à tous les établissements. Les packs s'y ajoutent selon vos cycles. Les offres sont établies sur devis : [demandez une démonstration](/demander-demo) pour voir ce qui correspond à votre établissement.",
    },
    {
      question: 'Peut-on voir ces fonctions en démonstration ?',
      answer:
        "Oui. Un conseiller déroule avec vous les fonctions qui vous intéressent, sur vos propres cas d'usage. La demande reçoit une réponse sous 48 h ouvrées, sans engagement.",
    },
  ],
  seeAlso: [
    { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
    { href: '/tarifs', label: 'Tarifs : des offres sur devis' },
    { href: '/faq', label: 'Questions fréquentes' },
  ],
};

// ---------------------------------------------------------------------------
// Tarifs (aucun montant : offres sur devis)
// ---------------------------------------------------------------------------

export const TARIFS_PAGE: ContentPageData = {
  path: '/tarifs',
  kicker: 'Tarifs',
  h1: 'Tarifs : des offres sur devis, adaptées à votre établissement',
  lead: "EcoleDigitale ne publie pas de grille de prix : chaque établissement a ses cycles, ses équipes et ses besoins. Nous établissons un devis personnalisé après un premier échange, avec une démonstration sur vos propres cas d'usage.",
  seo: {
    title: 'Tarifs du logiciel de gestion scolaire',
    description:
      'Offres Starter, Professional et Enterprise établies sur devis, selon vos cycles et vos packs. Démarrage en 1 à 3 semaines, réponse sous 48 h ouvrées.',
  },
  updatedAt: '2026-10-16',
  sections: [
    {
      heading: 'Trois offres, toutes sur devis',
      paragraphs: [
        "EcoleDigitale se décline en trois offres. Aucune n'a de tarif affiché : chacune est chiffrée pour votre établissement, une fois que nous connaissons vos cycles et les packs qui vous intéressent.",
      ],
      bullets: [
        'Starter : offre sur devis.',
        'Professional : offre sur devis.',
        'Enterprise : offre sur devis.',
      ],
    },
    {
      heading: 'Pourquoi aucun prix n’est affiché',
      paragraphs: [
        "Une école maternelle et primaire, un lycée, un institut BTS et un groupe de plusieurs établissements n'ont pas les mêmes besoins. Plutôt que d'afficher un tarif qui ne correspondrait à personne, nous préférons partir de votre situation : les cycles que vous accueillez et les packs qui vous sont utiles.",
        "Le devis vous est remis après l'échange de qualification et la démonstration. Il vous permet de comparer sur des bases claires, sans engagement.",
      ],
    },
    {
      heading: 'Ce que comprend le socle',
      paragraphs: [
        'Le [socle EcoleDigitale](/modules/socle-ecoledigitale) est la base commune à tous les établissements. Il porte :',
      ],
      bullets: [
        'Les comptes et les rôles : direction, administration, enseignants, parents et élèves.',
        'Les classes, les matières, les années scolaires et les inscriptions.',
        'Les notes, les moyennes et les bulletins selon les règles ivoiriennes.',
        "L'emploi du temps, l'appel et les absences depuis le téléphone.",
        'Les frais de scolarité et leurs échéanciers, avec le paiement par Mobile Money intégré.',
        'Le portail parents, ainsi que les messages aux parents par SMS et par WhatsApp.',
        "L'import de vos fichiers Excel, les certificats et attestations, les tableaux de bord et l'assistant IA.",
      ],
    },
    {
      heading: 'Les packs qui s’ajoutent selon vos cycles',
      paragraphs: [
        'Selon les cycles de votre établissement, vous ajoutez [Primary](/modules/ecoledigitale-primary) (maternelle et primaire), [Secondary](/modules/ecoledigitale-secondary) (collège et lycée), [Higher](/modules/ecoledigitale-higher) (supérieur, BTS et centres de formation) ou [Virtual](/modules/ecoledigitale-virtual) (formation à distance). Les packs se combinent sur un même compte. Le devis couvre le socle et les packs que vous retenez.',
      ],
    },
    {
      heading: 'Démarrer en 1 à 3 semaines',
      paragraphs: [
        "Comptez 1 à 3 semaines entre la signature et la mise en service. Un conseiller échange d'abord avec vous, puis nous paramétrons votre instance, importons vos données existantes depuis Excel et formons vos équipes clés.",
      ],
    },
    {
      heading: 'Demander votre devis',
      paragraphs: [
        'Remplissez le [formulaire de démonstration](/demander-demo), ou écrivez-nous par WhatsApp, par téléphone ou par e-mail (coordonnées en bas de page). Nous répondons sous 48 h ouvrées, sans engagement.',
      ],
    },
  ],
  packs: [
    'socle-ecoledigitale',
    'ecoledigitale-primary',
    'ecoledigitale-secondary',
    'ecoledigitale-higher',
    'ecoledigitale-virtual',
  ],
  faq: [
    {
      question: 'Combien coûte EcoleDigitale ?',
      answer:
        "Aucun tarif n'est affiché : les offres (Starter, Professional et Enterprise) sont établies sur devis, après un premier échange sur votre établissement et les packs qui vous intéressent. [Demandez un devis personnalisé](/demander-demo) via le formulaire de démonstration.",
    },
    {
      question: 'Qu’est-ce qui détermine le devis ?',
      answer:
        'Le devis dépend de votre établissement et des packs que vous retenez. Un conseiller vous le présente après la démonstration.',
    },
    {
      question: 'La démonstration engage-t-elle à quelque chose ?',
      answer:
        'Non. La démonstration est sans engagement, et nous répondons à votre demande sous 48 h ouvrées.',
    },
    {
      question: 'En combien de temps peut-on démarrer ?',
      answer:
        'Comptez 1 à 3 semaines entre la signature et la mise en service : import de vos données existantes, paramétrage et formation de vos équipes clés.',
    },
  ],
  seeAlso: [
    { href: '/faq', label: 'Questions fréquentes' },
    { href: '/fonctions', label: 'Toutes les fonctions' },
    { href: '/cote-d-ivoire', label: "Logiciel de gestion scolaire en Côte d'Ivoire" },
  ],
};
