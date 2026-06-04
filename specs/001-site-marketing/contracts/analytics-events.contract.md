# Contract — Analytics Events

**Outil principal** : Plausible (events custom via `plausible('Event Name', { props })`).

**Outil complémentaire** : Vercel Web Analytics (Web Vitals automatiques, pas configurable).

**Wrapper code** : `lib/analytics/track.ts` — toute émission DOIT passer par cette fonction typée. Pas d'appel direct à `window.plausible`.

## Pourquoi un catalogue fermé

- Plausible facture (ou rate-limite en self-host) à l'event unique → on évite la prolifération.
- Garantit la cohérence des noms (pas de variations `demo_clicked` vs `Demo Clicked`).
- Permet aux tests E2E d'asserter les events émis.

## Catalogue MVP

### `Demo CTA Clicked`

Émis à chaque clic sur un CTA dont `type === 'demo'`.

```ts
track('Demo CTA Clicked', {
  placement: 'hero' | 'header' | 'inline' | 'footer' | 'card',
  sourcePage: string, // ex. '/' | '/modules/parcours-bts'
});
```

Couvre : **FR-013** (Clic sur demande de demo).

---

### `Modules CTA Clicked`

Émis à chaque clic sur un CTA dont `type === 'modules'` (ex. « Voir les modules »).

```ts
track('Modules CTA Clicked', {
  placement: 'hero' | 'inline' | 'card',
  sourcePage: string,
});
```

Permet de mesurer le tunnel exploratoire.

---

### `Module Page Viewed`

Émis automatiquement par Plausible au chargement de page (pas besoin de code custom). Ajout d'une **propriété custom** via `<PageView />`.

```ts
// Côté code : émis explicitement uniquement pour les pages module
track('Module Page Viewed', {
  moduleSlug: 'socle-ecoledigitale' | 'parcours-bts' | 'parcours-superieur' | 'proformation' | 'campus-live',
});
```

Permet la métrique SC-002 (temps moyen ≥ 60s sur pages module) et le ranking des modules les plus consultés.

---

### `Module Selected In Form`

Émis quand l'utilisateur coche un module dans le formulaire `/demander-demo`.

```ts
track('Module Selected In Form', {
  moduleSlug: string,
  sourcePage: string, // = '/demander-demo' (mais utile si le formulaire est inliné ailleurs en Phase 2)
});
```

Couvre : **FR-013** (Sélection d'un module dans le formulaire).

---

### `Demo Form Submitted`

Émis après une réponse 200 OK de `/api/leads`.

```ts
track('Demo Form Submitted', {
  modulesCount: number,         // nombre de modules cochés
  hasMessage: boolean,          // présence d'un message libre
  hasStudentCount: boolean,     // présence d'une taille d'établissement
  sourcePage: string,
});
```

**Pas de PII transmis à Plausible** (pas d'email, pas de nom, pas de téléphone). Le détail nominatif est dans l'email reçu par l'équipe commerciale.

Couvre : **FR-013** (Soumission formulaire), **SC-001** (taux de conversion), **SC-007** (taux complétion).

---

### `Demo Form Submission Failed`

Émis sur erreur (validation client, 4xx, 5xx, échec réseau).

```ts
track('Demo Form Submission Failed', {
  reason: 'validation' | 'rate_limit' | 'server' | 'network',
  sourcePage: string,
});
```

Permet de détecter des problèmes (taux d'échec anormal, validation trop stricte, panne API).

---

### `Contact Channel Clicked`

Émis sur clic d'un lien de contact alternatif.

```ts
track('Contact Channel Clicked', {
  channel: 'whatsapp' | 'email' | 'phone',
  placement: 'header' | 'footer' | 'inline',
  sourcePage: string,
});
```

Couvre : **FR-013** (Clic WhatsApp/email).

---

### `Brochure Requested`

Émis si l'utilisateur clique sur « Recevoir la brochure » (Phase 2, mais event câblé dès le MVP pour anticiper).

```ts
track('Brochure Requested', {
  sourcePage: string,
});
```

Couvre : **FR-013** (Téléchargement/demande de brochure).

---

## Récap couverture FR-013

| Événement PRD FR-013 | Event analytics |
|---|---|
| Clic sur demande de demo | `Demo CTA Clicked` |
| Soumission formulaire | `Demo Form Submitted` (+ `Demo Form Submission Failed` pour les échecs) |
| Sélection d'un module dans le formulaire | `Module Selected In Form` |
| Clic WhatsApp/email | `Contact Channel Clicked` |
| Téléchargement ou demande de brochure | `Brochure Requested` |

**Couverture : 100 %.**

## Wrapper TypeScript (référence)

```ts
// lib/analytics/track.ts

type EventMap = {
  'Demo CTA Clicked': { placement: CtaPlacement; sourcePage: string };
  'Modules CTA Clicked': { placement: 'hero' | 'inline' | 'card'; sourcePage: string };
  'Module Page Viewed': { moduleSlug: ModuleSlug };
  'Module Selected In Form': { moduleSlug: ModuleSlug; sourcePage: string };
  'Demo Form Submitted': { modulesCount: number; hasMessage: boolean; hasStudentCount: boolean; sourcePage: string };
  'Demo Form Submission Failed': { reason: 'validation' | 'rate_limit' | 'server' | 'network'; sourcePage: string };
  'Contact Channel Clicked': { channel: 'whatsapp' | 'email' | 'phone'; placement: 'header' | 'footer' | 'inline'; sourcePage: string };
  'Brochure Requested': { sourcePage: string };
};

export function track<E extends keyof EventMap>(event: E, props: EventMap[E]): void {
  if (typeof window === 'undefined') return;
  // @ts-expect-error Plausible global injected via script
  window.plausible?.(event, { props });
}
```

## Tests d'acceptation (Playwright)

| Cas | Attendu |
|---|---|
| Clic CTA démo dans le hero | Un event `Demo CTA Clicked` avec `placement: 'hero'` est observé |
| Soumission formulaire valide | Un event `Demo Form Submitted` est émis après la réponse 200 |
| Soumission échouée (validation) | Un event `Demo Form Submission Failed` avec `reason: 'validation'` |
| Clic lien WhatsApp en footer | Un event `Contact Channel Clicked` avec `channel: 'whatsapp', placement: 'footer'` |
| Navigation `/modules/parcours-bts` | Un event `Module Page Viewed` avec `moduleSlug: 'parcours-bts'` |

(Mock du `window.plausible` en environnement de test, assertions sur les appels.)

## Conformité RGPD

- Plausible est **cookieless** → pas de tracking individuel persistant.
- Aucun PII (email, nom, téléphone) n'est transmis dans les events.
- Pas de bandeau de consentement requis (CNIL position 2022+ pour les solutions cookieless équivalentes à Plausible).
- Une mention informative figure dans `/confidentialite`.
