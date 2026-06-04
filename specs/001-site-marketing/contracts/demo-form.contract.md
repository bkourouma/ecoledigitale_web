# Contract — Demo Request Form API

**Endpoint** : `POST /api/leads`

**Runtime** : Node.js (Vercel Serverless Function ou Edge selon contraintes Resend SDK).

**Auth** : Aucune (endpoint public).

**Anti-abus** : honeypot field + rate limiting (5 req/IP/h).

## Request

### Headers

```
Content-Type: application/json
Accept: application/json
```

### Body

JSON conforme au schéma `Lead` (voir [data-model.md](../data-model.md#2-lead-demande-de-démonstration)).

```jsonc
{
  "fullName": "Marie Dupont",
  "email": "m.dupont@institut-exemple.fr",
  "phone": "+33 1 23 45 67 89",
  "institutionName": "Institut Exemple",
  "role": "Directrice académique",
  "location": "Paris, France",
  "modulesOfInterest": ["parcours-bts", "campus-live"],
  "consent": true,

  // optionnels
  "studentCount": 350,
  "institutionType": "Institut privé post-bac",
  "message": "Nous cherchons à digitaliser le suivi de notre cycle BTS.",
  "preferredChannel": "email",

  // honeypot (DOIT être absent ou vide)
  "website": "",

  // contexte (rempli côté client)
  "sourcePage": "/modules/parcours-bts"
}
```

## Responses

### 200 OK — Lead accepté

```json
{
  "ok": true,
  "id": "lead_2026-05-18T13-42-07_a1b2",
  "message": "Votre demande a été transmise. L'équipe commerciale vous recontacte sous 48h."
}
```

L'`id` est un identifiant de corrélation (timestamp + suffixe aléatoire) **non sensible**, utilisable pour le support utilisateur. Pas un identifiant base de données (pas de DB au MVP).

### 400 Bad Request — Validation échouée

```json
{
  "ok": false,
  "error": "validation",
  "issues": [
    { "path": "email", "code": "invalid_email", "message": "Adresse email invalide." },
    { "path": "modulesOfInterest", "code": "too_small", "message": "Sélectionnez au moins un module." }
  ]
}
```

`issues` est dérivé directement de la sortie Zod, traduit en messages français user-facing.

### 422 Unprocessable — Honeypot déclenché

Renvoyé **silencieusement comme un 200 OK** au client (sécurité par obscurité — un bot ne doit pas savoir qu'il a été détecté). Côté serveur : log warning + abandon de l'envoi.

### 429 Too Many Requests — Rate limit

```json
{
  "ok": false,
  "error": "rate_limit",
  "message": "Trop de tentatives. Réessayez dans quelques minutes ou contactez-nous directement."
}
```

Header `Retry-After: <seconds>`.

### 500 Internal Server Error — Sink en échec

```json
{
  "ok": false,
  "error": "server",
  "message": "Une erreur technique nous empêche de transmettre votre demande. Réessayez dans quelques instants ou contactez-nous par WhatsApp / email."
}
```

Côté serveur : log error avec stack + alerting (Vercel logs → notification équipe).
**Important** : le lead validé n'est **pas perdu** — il est journalisé en log structuré même si Resend échoue (le sink `log` s'exécute toujours en parallèle, voir [lead-sink.contract.md](lead-sink.contract.md)).

## Comportement client attendu

1. Validation client via le **même schéma Zod** (`lib/leads/lead.schema.ts`) → feedback immédiat sur les erreurs.
2. Soumission désactive le bouton (anti double-soumission) et affiche un état de chargement.
3. Sur 200 OK : afficher la page de confirmation `/demander-demo/merci` (route statique) ou un état inline confirmé + analytics `Demo Form Submitted`.
4. Sur 400 : surligner les champs concernés, focus sur le premier en erreur.
5. Sur 429 : message dédié + lien WhatsApp/Email de secours.
6. Sur 500 / erreur réseau : message d'erreur générique + lien WhatsApp/Email de secours + analytics `Demo Form Submission Failed`.

## Tests d'acceptation (Playwright)

| Cas | Attendu |
|---|---|
| Formulaire vide → submit | Les 7 champs requis affichent une erreur, focus sur le premier |
| Email invalide | Erreur ciblée sur le champ email, autres champs préservés |
| Aucun module coché | Erreur ciblée sur le groupe modules |
| Consentement décoché | Bouton submit désactivé OU erreur au submit |
| Soumission valide | Redirection ou message de succès + appel API observable + event `Demo Form Submitted` |
| Honeypot rempli (forcé en test) | Réponse 200 OK côté client, mais aucun email envoyé (assertable via mock Resend) |
| Double-clic submit | Une seule requête envoyée (bouton désactivé) |
| Soumission depuis `/modules/proformation` | `sourcePage` transmis correctement |

## Sécurité

- **CSRF** : non requis (formulaire same-origin, pas de session).
- **CORS** : restreint à l'origine du site (`Access-Control-Allow-Origin` = domaine prod + previews Vercel).
- **Logging** : pas de mot de passe (il n'y en a pas), pas de stockage côté client autre que les valeurs en cours de saisie. Les logs serveur masquent `email` et `phone` partiellement (`m***@institut-exemple.fr`).
- **RGPD** : `consent` doit être `true` explicite. Les logs sont supprimés selon la rétention Vercel (par défaut 24h-7j selon plan).
