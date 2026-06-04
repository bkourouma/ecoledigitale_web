# Contract — LeadSink Interface

**Objectif** : permettre l'ajout futur d'un CRM ou d'une base de données sans toucher au code du formulaire ni de l'API. Matérialise l'exigence FR-009 et le Principe III de la Constitution.

## Interface TypeScript

```ts
// lib/leads/sinks/index.ts

export type Lead = z.infer<typeof LeadSchema>; // voir data-model.md

export interface LeadSink {
  /** Identifiant lisible du sink (utilisé en logs et metrics). */
  readonly name: string;

  /** Indique si l'échec de ce sink doit faire échouer la requête API. */
  readonly critical: boolean;

  /**
   * Traite un lead validé.
   * Doit être idempotent autant que possible (un même `correlationId` peut être rejoué).
   * Doit lever une erreur typée en cas d'échec récupérable ; sinon retourner sans erreur.
   */
  handle(input: { lead: Lead; correlationId: string }): Promise<void>;
}
```

## Sinks au MVP

### `ResendLeadSink` — `critical: true`

- Envoie un email HTML + texte à `LEADS_TO_EMAIL` (ex. `commercial@ecoledigitale.com`).
- Sujet : `[Demo] {institutionName} — {modules joints par "+"}`
- Corps : tous les champs du lead, formaté lisible. Inclut `sourcePage` et `correlationId`.
- Échec → fait remonter une erreur 500 côté API (mais le sink Log s'exécute quand même).

### `LogLeadSink` — `critical: false`

- Émet un log structuré JSON dans la sortie standard (capté par Vercel logs).
- Tous les PII sont **masqués** : email → `m***@domain.com`, phone → `+33 *** *** 89`.
- Le `correlationId` permet de retrouver la trace si besoin.
- N'échoue jamais (best-effort).

## Sinks futurs (Phase 2+)

Exemples documentés mais **non implémentés au MVP** :

### `HubspotLeadSink`
- `critical: false` (pour ne pas faire échouer l'API si Hubspot est down).
- Mappe `Lead` vers un contact Hubspot + crée une `Deal` avec les modules d'intérêt.

### `DatabaseLeadSink`
- `critical: false`.
- Persiste dans Vercel Postgres / Turso, table `leads`.
- Permet un dashboard interne de suivi des leads.

### `WebhookLeadSink`
- Générique. `critical: false`.
- POST JSON vers une URL configurable (`LEADS_WEBHOOK_URL`).
- Couvre Zapier, Make.com, n8n, etc.

## Dispatch

```ts
// lib/leads/handler.ts (simplifié)

const sinks: LeadSink[] = [
  new ResendLeadSink({ apiKey: env.RESEND_API_KEY, to: env.LEADS_TO_EMAIL, from: env.LEADS_FROM_EMAIL }),
  new LogLeadSink(),
];

export async function handleLead(lead: Lead): Promise<{ correlationId: string }> {
  const correlationId = newCorrelationId();

  const results = await Promise.allSettled(
    sinks.map((s) => s.handle({ lead, correlationId }))
  );

  // Échec → 500 uniquement si un sink critique a échoué
  const criticalFailures = results
    .map((r, i) => ({ r, sink: sinks[i] }))
    .filter(({ r, sink }) => r.status === 'rejected' && sink.critical);

  if (criticalFailures.length > 0) {
    throw new LeadDispatchError(criticalFailures, correlationId);
  }

  return { correlationId };
}
```

## Tests d'acceptation

| Cas | Attendu |
|---|---|
| Resend succède, Log succède | API 200 OK, les deux sinks invoqués une fois |
| Resend échoue, Log succède | API 500, mais log structuré contient le lead masqué |
| Resend succède, Log échoue (théorique) | API 200 OK (log non critique) |
| Ajout d'un nouveau sink (test fixture) | Aucune modification du code formulaire ou API requise |
| Lead invalide | `handleLead` n'est jamais appelé (validation amont) |

## Configuration (variables d'environnement)

| Variable | Requise au MVP ? | Description |
|---|---|---|
| `RESEND_API_KEY` | ✅ | Clé Resend |
| `LEADS_TO_EMAIL` | ✅ | Destinataire interne (ex. `commercial@ecoledigitale.com`) |
| `LEADS_FROM_EMAIL` | ✅ | Expéditeur (domaine vérifié Resend) |
| `LEADS_WEBHOOK_URL` | ❌ (futur) | URL webhook générique |
| `HUBSPOT_TOKEN` | ❌ (futur) | Token API Hubspot |
| `DATABASE_URL` | ❌ (futur) | Connexion Postgres |
