/**
 * Liens dans un texte brut : `[libellé](/chemin)`.
 * `splitInlineLinks` sert à l'affichage (lien HTML) ; `stripInlineLinks` sert au JSON-LD
 * (le texte balisé reste identique au texte visible, sans la syntaxe du lien).
 */
const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export type InlinePart = { text: string; href?: string };

export function splitInlineLinks(source: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const match of source.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: source.slice(last, index) });
    parts.push({ text: match[1]!, href: match[2]! });
    last = index + match[0].length;
  }
  if (last < source.length) parts.push({ text: source.slice(last) });
  return parts;
}

export function stripInlineLinks(source: string): string {
  return source.replace(LINK_PATTERN, '$1');
}

/** Chemins des liens internes d'un texte (contrôle de validité dans les tests). */
export function extractInlineHrefs(source: string): string[] {
  return [...source.matchAll(LINK_PATTERN)].map((match) => match[2]!);
}
