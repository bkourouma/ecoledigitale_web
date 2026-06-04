import { z } from 'zod';

/** Slug auteur — kebab-case strict. */
export const AuthorSlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, 'slug doit être en kebab-case (a-z, 0-9, tirets uniquement)')
  .min(3)
  .max(40);

export type AuthorSlug = z.infer<typeof AuthorSlugSchema>;

export const AuthorFrontmatterSchema = z.object({
  slug: AuthorSlugSchema,
  name: z.string().trim().min(2).max(60),
  role: z.string().trim().min(2).max(80),
  bio: z.string().trim().min(100).max(500),
  expertise: z.array(z.string().trim().min(2).max(40)).min(1).max(8),

  // Optionnels
  photo: z.string().startsWith('/').optional(),
  linkedinUrl: z.string().url().optional(),
  email: z.string().email().optional(),
});

export type AuthorFrontmatter = z.infer<typeof AuthorFrontmatterSchema>;

/**
 * Formate les erreurs Zod en messages lisibles pour le développeur/éditeur.
 * Pas de payload Zod brut — chaque message identifie le fichier, le champ et la règle.
 *
 * Exemple de sortie :
 *   Invalid author frontmatter in content/auteurs/marie-dupont.mdx:
 *     - bio: 87 caractères (minimum 100). Étoffer la présentation.
 */
export function formatAuthorErrors(
  filePath: string,
  error: z.ZodError,
): string {
  const lines: string[] = [`Invalid author frontmatter in ${filePath}:`];
  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    lines.push(`  - ${path}: ${humanizeZodIssue(issue)}`);
  }
  return lines.join('\n');
}

/**
 * Traduit un ZodIssue en message court compréhensible.
 * Couvre les codes Zod les plus fréquents pour les schémas frontmatter.
 * Exporté pour réutilisation par formatResourceErrors().
 */
export function humanizeZodIssue(issue: z.ZodIssue): string {
  switch (issue.code) {
    case 'too_small': {
      const min = (issue as { minimum?: number | bigint }).minimum;
      if (issue.type === 'string') return `chaîne trop courte (minimum ${min} caractères)`;
      if (issue.type === 'array') return `liste trop courte (minimum ${min} éléments)`;
      if (issue.type === 'number') return `valeur trop petite (minimum ${min})`;
      return `valeur trop petite (minimum ${min})`;
    }
    case 'too_big': {
      const max = (issue as { maximum?: number | bigint }).maximum;
      if (issue.type === 'string') return `chaîne trop longue (maximum ${max} caractères)`;
      if (issue.type === 'array') return `liste trop longue (maximum ${max} éléments)`;
      if (issue.type === 'number') return `valeur trop grande (maximum ${max})`;
      return `valeur trop grande (maximum ${max})`;
    }
    case 'invalid_type': {
      const expected = (issue as { expected?: string }).expected ?? 'valeur';
      const received = (issue as { received?: string }).received ?? 'inconnu';
      return `type invalide (attendu ${expected}, reçu ${received})`;
    }
    case 'invalid_enum_value': {
      const options = (issue as { options?: readonly unknown[] }).options ?? [];
      const received = (issue as { received?: unknown }).received;
      return `valeur "${String(received)}" non autorisée (valeurs possibles : ${options.map(String).join(', ')})`;
    }
    case 'invalid_union_discriminator': {
      const options = (issue as { options?: readonly unknown[] }).options ?? [];
      return `valeur de \`type\` invalide (valeurs possibles : ${options.map(String).join(', ')})`;
    }
    case 'invalid_string': {
      const validation = (issue as { validation?: unknown }).validation;
      if (validation === 'url') return 'URL invalide';
      if (validation === 'email') return 'email invalide';
      if (validation === 'regex') return issue.message;
      return issue.message;
    }
    case 'custom':
      return issue.message;
    default:
      return issue.message;
  }
}
