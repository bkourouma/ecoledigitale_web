/**
 * Coordonnées publiques d'EcoleDigitale : source unique pour le pied de page,
 * le formulaire de démonstration, la page « merci » et le JSON-LD.
 *
 * Valeurs écrites dans le code (et non lues dans des variables d'environnement) pour que le
 * numéro WhatsApp, le téléphone et l'e-mail ne puissent plus diverger d'un environnement à l'autre.
 */

/** Numéro unique : téléphone et WhatsApp. */
export const CONTACT_PHONE_DISPLAY = '+225 01 01 51 01 36';
/** Format E.164 (JSON-LD, lien `tel:`). */
export const CONTACT_PHONE_E164 = '+2250101510136';
/** Format `wa.me` : chiffres seuls, sans « + ». */
export const CONTACT_WHATSAPP_NUMBER = '2250101510136';
export const CONTACT_EMAIL = 'ecoledigitale@allianceconsultants.net';

export const PUBLISHER = {
  name: 'Alliance Consultants',
  url: 'https://allianceconsultants.net',
  city: 'Abidjan',
  country: "Côte d'Ivoire",
  /** Code pays ISO 3166-1 alpha-2 (JSON-LD). */
  countryCode: 'CI',
} as const;

/** Mention d'éditeur affichée dans le pied de page et la page « À propos ». */
export const PUBLISHER_NOTICE = `Édité par ${PUBLISHER.name}, ${PUBLISHER.city}, ${PUBLISHER.country}`;
