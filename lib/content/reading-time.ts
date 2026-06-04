import readingTimeLib from 'reading-time';

export interface ReadingTimeResult {
  /** Minutes arrondies à l'entier supérieur (minimum 1). */
  minutes: number;
  /** Nombre de mots décomptés (markup MDX retiré). */
  words: number;
  /** Texte localisé en français : "1 min de lecture", "7 min de lecture". */
  text: string;
}

/** Mots par minute — rythme français moyen documenté en research.md R-001 (FR-024). */
const WORDS_PER_MINUTE = 220;

/**
 * Calcule le temps de lecture d'un body MDX.
 *
 * La librairie `reading-time` tokenise le texte et ignore les blocs de code
 * triples-backtick. On lui applique 220 mots/minute (rythme français moyen)
 * et on reformate le `text` en français — la lib renvoie de l'anglais par défaut.
 *
 * Garantie : `minutes >= 1` même pour un body très court (évite "0 min de lecture").
 */
export function getReadingTime(body: string): ReadingTimeResult {
  const stats = readingTimeLib(body, { wordsPerMinute: WORDS_PER_MINUTE });
  const minutes = Math.max(1, Math.ceil(stats.minutes));
  return {
    minutes,
    words: stats.words,
    text: `${minutes} min de lecture`,
  };
}
