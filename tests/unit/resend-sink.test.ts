import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Lead } from '@/lib/leads/lead.schema';

const sendMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

const baseLead: Lead = {
  fullName: 'Marie Dupont',
  email: 'm.dupont@example.com',
  phone: '+33 1 23 45 67 89',
  institutionName: 'Institut Exemple',
  role: 'Directrice',
  location: 'Paris, France',
  modulesOfInterest: ['ecoledigitale-higher', 'ecoledigitale-virtual'],
  consent: true,
  sourcePage: '/demander-demo',
};

describe('ResendLeadSink', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it("log un warning et résout sans envoyer en l'absence de clé API", async () => {
    const { ResendLeadSink } = await import('@/lib/leads/sinks/resend.sink');
    const sink = new ResendLeadSink({
      apiKey: undefined,
      toEmail: 'a@b.com',
      fromEmail: 'c@d.com',
    });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await expect(sink.handle({ lead: baseLead, correlationId: 'lead_x' })).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('RESEND_API_KEY not set'));
    expect(sendMock).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('envoie un email avec sujet et destinataires corrects', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'msg_1' }, error: null });
    const { ResendLeadSink } = await import('@/lib/leads/sinks/resend.sink');
    const sink = new ResendLeadSink({
      apiKey: 'test-key',
      toEmail: 'commercial@ecoledigitale.com',
      fromEmail: 'noreply@ecoledigitale.com',
    });

    await sink.handle({ lead: baseLead, correlationId: 'lead_abc' });

    expect(sendMock).toHaveBeenCalledOnce();
    const payload = sendMock.mock.calls[0]![0];
    expect(payload.to).toBe('commercial@ecoledigitale.com');
    expect(payload.from).toBe('noreply@ecoledigitale.com');
    expect(payload.replyTo).toBe('m.dupont@example.com');
    expect(payload.subject).toContain('Institut Exemple');
    expect(payload.subject).toContain('EcoleDigitale Higher');
    expect(payload.subject).toContain('EcoleDigitale Virtual');
    expect(payload.html).toContain('Institut Exemple');
    expect(payload.html).toContain('lead_abc');
    expect(payload.text).toContain('m.dupont@example.com');
  });

  it("propage une erreur si l'API Resend renvoie une erreur", async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'API quota exceeded' } });
    const { ResendLeadSink } = await import('@/lib/leads/sinks/resend.sink');
    const sink = new ResendLeadSink({
      apiKey: 'test-key',
      toEmail: 'a@b.com',
      fromEmail: 'c@d.com',
    });

    await expect(sink.handle({ lead: baseLead, correlationId: 'x' })).rejects.toThrow(
      /API quota exceeded/,
    );
  });
});
