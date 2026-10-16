import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleLead } from '@/lib/leads/handler';
import { LeadDispatchError, type LeadSink } from '@/lib/leads/sinks';
import type { Lead } from '@/lib/leads/lead.schema';

const baseLead: Lead = {
  fullName: 'Marie Dupont',
  email: 'm.dupont@example.com',
  phone: '+33 1 23 45 67 89',
  institutionName: 'Institut Exemple',
  role: 'Directrice',
  location: 'Paris, France',
  modulesOfInterest: ['ecoledigitale-higher'],
  consent: true,
  sourcePage: '/demander-demo',
};

function makeSink(name: string, critical: boolean, behavior: 'ok' | 'fail'): LeadSink {
  return {
    name,
    critical,
    handle: vi.fn(async () => {
      if (behavior === 'fail') throw new Error(`${name} failed`);
    }),
  };
}

describe('handleLead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('appelle tous les sinks et retourne un correlationId', async () => {
    const critical = makeSink('critical', true, 'ok');
    const logger = makeSink('logger', false, 'ok');

    const result = await handleLead(baseLead, [critical, logger]);

    expect(result.correlationId).toMatch(/^lead_/);
    expect(critical.handle).toHaveBeenCalledTimes(1);
    expect(logger.handle).toHaveBeenCalledTimes(1);
    expect(critical.handle).toHaveBeenCalledWith(
      expect.objectContaining({ lead: baseLead, correlationId: result.correlationId }),
    );
  });

  it('lève LeadDispatchError si un sink critique échoue', async () => {
    const critical = makeSink('critical', true, 'fail');
    const logger = makeSink('logger', false, 'ok');

    await expect(handleLead(baseLead, [critical, logger])).rejects.toBeInstanceOf(
      LeadDispatchError,
    );
  });

  it("n'échoue pas si seul un sink non critique échoue", async () => {
    const critical = makeSink('critical', true, 'ok');
    const logger = makeSink('logger', false, 'fail');

    await expect(handleLead(baseLead, [critical, logger])).resolves.toHaveProperty('correlationId');
  });

  it('invoque les sinks en parallèle (allSettled, pas séquentiel)', async () => {
    const order: string[] = [];
    const slow: LeadSink = {
      name: 'slow',
      critical: true,
      handle: vi.fn(async () => {
        await new Promise((r) => setTimeout(r, 30));
        order.push('slow');
      }),
    };
    const fast: LeadSink = {
      name: 'fast',
      critical: false,
      handle: vi.fn(async () => {
        order.push('fast');
      }),
    };

    await handleLead(baseLead, [slow, fast]);
    expect(order).toEqual(['fast', 'slow']);
  });

  it('génère un correlationId unique à chaque appel', async () => {
    const sink = makeSink('s', true, 'ok');
    const r1 = await handleLead(baseLead, [sink]);
    const r2 = await handleLead(baseLead, [sink]);
    expect(r1.correlationId).not.toBe(r2.correlationId);
  });
});
