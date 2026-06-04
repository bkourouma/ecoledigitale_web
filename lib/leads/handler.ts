import type { Lead } from '@/lib/leads/lead.schema';
import { LeadDispatchError, type LeadSink } from '@/lib/leads/sinks';
import { LogLeadSink } from '@/lib/leads/sinks/log.sink';
import { ResendLeadSink } from '@/lib/leads/sinks/resend.sink';

let cachedSinks: LeadSink[] | null = null;

function getDefaultSinks(): LeadSink[] {
  if (cachedSinks) return cachedSinks;

  const toEmail = process.env.LEADS_TO_EMAIL;
  const fromEmail = process.env.LEADS_FROM_EMAIL;

  if (!toEmail || !fromEmail) {
    throw new Error(
      'Missing LEADS_TO_EMAIL or LEADS_FROM_EMAIL environment variables. See .env.example.',
    );
  }

  cachedSinks = [
    new ResendLeadSink({
      apiKey: process.env.RESEND_API_KEY,
      toEmail,
      fromEmail,
    }),
    new LogLeadSink(),
  ];

  return cachedSinks;
}

function newCorrelationId(): string {
  const now = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `lead_${now}_${suffix}`;
}

export interface HandleLeadResult {
  correlationId: string;
}

/**
 * Orchestre la transmission d'un lead validé aux sinks enregistrés.
 * - Resend (critique) : un échec → 500.
 * - Log (best-effort) : un échec n'interrompt jamais.
 *
 * Pour les tests, on peut injecter des sinks custom via `sinks`.
 */
export async function handleLead(
  lead: Lead,
  sinks: LeadSink[] = getDefaultSinks(),
): Promise<HandleLeadResult> {
  const correlationId = newCorrelationId();

  const results = await Promise.allSettled(
    sinks.map((sink) => sink.handle({ lead, correlationId })),
  );

  const criticalFailures = results
    .map((result, index) => ({ result, sink: sinks[index]! }))
    .filter(({ result, sink }) => result.status === 'rejected' && sink.critical)
    .map(({ result, sink }) => ({
      sink,
      reason: result.status === 'rejected' ? result.reason : undefined,
    }));

  if (criticalFailures.length > 0) {
    throw new LeadDispatchError(criticalFailures, correlationId);
  }

  return { correlationId };
}

/** Utilitaire pour les tests : réinitialise le cache. */
export function _resetSinksCacheForTests(): void {
  cachedSinks = null;
}
