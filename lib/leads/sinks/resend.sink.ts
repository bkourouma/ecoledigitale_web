import { Resend } from 'resend';
import type { Lead } from '@/lib/leads/lead.schema';
import type { LeadSink } from '@/lib/leads/sinks';
import { renderDemoNotification } from '@/lib/leads/email/demo-notification';

export interface ResendLeadSinkOptions {
  apiKey: string | undefined;
  toEmail: string;
  fromEmail: string;
}

/**
 * Envoie une notification email à l'équipe commerciale via Resend.
 * Critique : un échec d'envoi propage une erreur 500 côté API.
 *
 * En l'absence de RESEND_API_KEY (dev local), log un warning et résout sans envoyer.
 */
export class ResendLeadSink implements LeadSink {
  readonly name = 'resend';
  readonly critical = true;

  private readonly client: Resend | null;

  constructor(private readonly options: ResendLeadSinkOptions) {
    this.client = options.apiKey ? new Resend(options.apiKey) : null;
  }

  async handle({ lead, correlationId }: { lead: Lead; correlationId: string }): Promise<void> {
    if (!this.client) {
      console.warn(
        `[ResendLeadSink] RESEND_API_KEY not set — skipping email (correlationId: ${correlationId})`,
      );
      return;
    }

    const { subject, html, text } = renderDemoNotification(lead, correlationId);

    const { error } = await this.client.emails.send({
      from: this.options.fromEmail,
      to: this.options.toEmail,
      subject,
      replyTo: lead.email,
      html,
      text,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }
  }
}
