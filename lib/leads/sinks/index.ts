import type { Lead } from '@/lib/leads/lead.schema';

export interface LeadSink {
  /** Identifiant lisible du sink (utilisé en logs). */
  readonly name: string;

  /**
   * Si `true`, un échec de ce sink fait échouer la requête API (réponse 500).
   * Si `false`, l'échec est journalisé mais l'utilisateur reçoit 200 OK.
   */
  readonly critical: boolean;

  /**
   * Traite un lead validé. Doit être idempotent si possible.
   * Lever une erreur en cas d'échec — sera capturée par le dispatcher.
   */
  handle(input: { lead: Lead; correlationId: string }): Promise<void>;
}

export class LeadDispatchError extends Error {
  constructor(
    public readonly failures: Array<{ sink: LeadSink; reason: unknown }>,
    public readonly correlationId: string,
  ) {
    super(
      `Lead dispatch failed (${correlationId}): ${failures
        .map((f) => `${f.sink.name}: ${String(f.reason)}`)
        .join('; ')}`,
    );
    this.name = 'LeadDispatchError';
  }
}
