import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { LeadSubmissionSchema } from '@/lib/leads/lead.schema';
import { handleLead } from '@/lib/leads/handler';
import { checkRateLimit, getClientIp } from '@/lib/leads/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Rate limit
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: 'rate_limit',
        message:
          'Trop de tentatives. Réessayez dans quelques minutes ou contactez-nous directement.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfterSeconds) },
      },
    );
  }

  // Parsing body
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'validation', message: 'Corps de requête invalide.' },
      { status: 400 },
    );
  }

  // Validation Zod
  let submission;
  try {
    submission = LeadSubmissionSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'validation',
          issues: error.issues.map((i) => ({
            path: i.path.join('.'),
            code: i.code,
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }
    throw error;
  }

  // Honeypot : on accepte silencieusement (renvoie 200 avec ID factice).
  // Un vrai bot ne saura pas qu'il a été détecté.
  if (submission.website && submission.website.length > 0) {
    const fakeId = `honeypot_${Date.now().toString(36)}`;
    console.warn(`[leads] honeypot triggered (ip=${ip}, fakeId=${fakeId})`);
    return NextResponse.json(
      {
        ok: true,
        id: fakeId,
        message: 'Votre demande a été transmise.',
      },
      { status: 200 },
    );
  }

  // Dispatch aux sinks
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { website, ...lead } = submission;
    const { correlationId } = await handleLead(lead);
    return NextResponse.json(
      {
        ok: true,
        id: correlationId,
        message: "Votre demande a été transmise. L'équipe commerciale vous recontacte sous 48h.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[leads] dispatch failure:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'server',
        message:
          "Une erreur technique nous empêche de transmettre votre demande. Réessayez dans quelques instants ou contactez-nous par WhatsApp / email.",
      },
      { status: 500 },
    );
  }
}
