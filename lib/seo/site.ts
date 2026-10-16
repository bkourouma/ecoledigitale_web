/** Nom d'hôte public du site (sans protocole), pour les images Open Graph. */
export function getSiteHost(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000';
  try {
    return new URL(raw).host;
  } catch {
    return 'ecoledigitale.allianceconsultants.net';
  }
}
