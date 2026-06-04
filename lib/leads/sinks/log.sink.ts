import type { Lead } from '@/lib/leads/lead.schema';
import { maskLeadForLog } from '@/lib/leads/lead.schema';
import type { LeadSink } from '@/lib/leads/sinks';

/**
 * Journalise le lead en JSON structuré (capté par Vercel logs / stdout).
 * Masque les PII (email, téléphone, nom).
 * Non critique : ne fait jamais échouer la requête.
 */
export class LogLeadSink implements LeadSink {
  readonly name = 'log';
  readonly critical = false;

  async handle({ lead, correlationId }: { lead: Lead; correlationId: string }): Promise<void> {
    const masked = maskLeadForLog(lead);
    console.info(
      JSON.stringify({
        event: 'lead.received',
        correlationId,
        timestamp: new Date().toISOString(),
        lead: masked,
      }),
    );
  }
}
