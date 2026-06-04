import { z } from 'zod';
import { ModuleSlugSchema } from '@/lib/content/module.schema';

const PHONE_REGEX = /^[+0-9 .()-]{6,32}$/;

export const PreferredChannelSchema = z.enum(['email', 'phone', 'whatsapp']);
export type PreferredChannel = z.infer<typeof PreferredChannelSchema>;

/**
 * Schéma de validation des leads soumis via /api/leads.
 * Voir specs/001-site-marketing/data-model.md § 2 Lead
 */
export const LeadSchema = z.object({
  fullName: z.string().trim().min(2, 'Veuillez saisir votre nom complet.').max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Adresse email invalide.'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, 'Numéro de téléphone invalide.'),
  institutionName: z
    .string()
    .trim()
    .min(2, "Veuillez préciser le nom de votre établissement.")
    .max(200),
  role: z.string().trim().min(2, 'Veuillez préciser votre rôle.').max(120),
  location: z.string().trim().min(2, 'Veuillez préciser votre ville et pays.').max(160),
  modulesOfInterest: z
    .array(ModuleSlugSchema)
    .min(1, 'Sélectionnez au moins un module qui vous intéresse.'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter d’être recontacté(e) pour soumettre la demande.' }),
  }),

  studentCount: z
    .number()
    .int()
    .positive()
    .max(999_999)
    .optional(),
  institutionType: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  preferredChannel: PreferredChannelSchema.optional(),

  sourcePage: z.string().startsWith('/').default('/'),
});

export type Lead = z.infer<typeof LeadSchema>;

/**
 * Schéma étendu côté serveur : ajoute le champ honeypot `website`.
 *
 * La valeur n'est pas validée ici (longueur libre) — la route API la consulte
 * APRÈS validation pour décider d'un 200 OK silencieux (sécurité par obscurité).
 */
export const LeadSubmissionSchema = LeadSchema.extend({
  website: z.string().optional().default(''),
});

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>;

/**
 * Masque les informations personnelles pour les logs.
 * Email : m***@example.com
 * Phone : +33 *** *** 89
 */
export function maskLeadForLog(lead: Lead): Record<string, unknown> {
  return {
    ...lead,
    fullName: maskString(lead.fullName, 1),
    email: maskEmail(lead.email),
    phone: maskPhone(lead.phone),
    message: lead.message ? `[${lead.message.length} chars]` : undefined,
  };
}

function maskString(value: string, visibleChars: number): string {
  if (value.length <= visibleChars) return '***';
  return value.slice(0, visibleChars) + '***';
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***';
  return `${local.slice(0, 1)}***@${domain}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return `*** *** ${digits.slice(-2)}`;
}
