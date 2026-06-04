/**
 * Rate limiting in-memory pour l'API /api/leads.
 * 5 requêtes / IP / heure par défaut.
 *
 * Implémentation simple : Map IP → timestamps des requêtes.
 * Ephemeral entre redémarrages de fonction serverless — acceptable pour MVP.
 * Pour un usage à fort volume, migrer vers Vercel KV ou Upstash Redis.
 */

const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 heure
const DEFAULT_MAX_REQUESTS = 5;

const buckets = new Map<string, number[]>();

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Secondes avant que la prochaine requête soit autorisée. 0 si déjà autorisé. */
  retryAfterSeconds: number;
}

/**
 * Vérifie si l'IP a dépassé la limite. Enregistre la requête courante si autorisée.
 * Désactivé si RATE_LIMIT_ENABLED !== 'true' (utile en dev local et tests).
 */
export function checkRateLimit(ip: string, options: RateLimitOptions = {}): RateLimitResult {
  if (process.env.RATE_LIMIT_ENABLED !== 'true') {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;

  const now = Date.now();
  const cutoff = now - windowMs;

  const timestamps = (buckets.get(ip) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0]!;
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }

  timestamps.push(now);
  buckets.set(ip, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Extrait l'IP cliente d'une Request Next.js.
 * Utilise X-Forwarded-For en priorité (Vercel + autres CDN).
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

/** Pour les tests uniquement. */
export function _resetRateLimitForTests(): void {
  buckets.clear();
}
