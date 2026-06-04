/**
 * Formate une date ISO (`YYYY-MM-DD`) en français long : "15 juin 2026".
 *
 * Construit la date en UTC et formate en UTC pour éviter tout décalage de
 * fuseau horaire (les dates de publication sont des dates calendaires, pas
 * des instants).
 */
export function formatFrenchDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
