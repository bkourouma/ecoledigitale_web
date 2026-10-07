# Audit RGPD — Site marketing EcoleDigitale

**Date** : 2026-05-18

**Statut** : ✅ Conforme MVP

Cet audit vérifie que le site marketing respecte les obligations RGPD applicables à un site B2B francophone collectant des leads commerciaux.

---

## 1. Données personnelles collectées

| Donnée                                               | Source                      | Finalité                            | Base légale            | Stockage                           |
| ---------------------------------------------------- | --------------------------- | ----------------------------------- | ---------------------- | ---------------------------------- |
| Nom complet                                          | Formulaire `/demander-demo` | Identifier le prospect, le rappeler | Consentement explicite | Email Resend + log Vercel (24h-7j) |
| Email professionnel                                  | Formulaire                  | Recontact commercial                | Consentement explicite | Email + log                        |
| Téléphone                                            | Formulaire                  | Recontact commercial                | Consentement explicite | Email + log                        |
| Nom de l'établissement                               | Formulaire                  | Qualification commerciale           | Consentement explicite | Email + log                        |
| Rôle / fonction                                      | Formulaire                  | Qualification commerciale           | Consentement explicite | Email + log                        |
| Ville / pays                                         | Formulaire                  | Qualification commerciale           | Consentement explicite | Email + log                        |
| Modules d'intérêt                                    | Formulaire                  | Préparation de la démo              | Consentement explicite | Email + log                        |
| Taille / type d'établissement / message (optionnels) | Formulaire                  | Qualification commerciale           | Consentement explicite | Email + log                        |

**Aucune autre donnée personnelle n'est collectée.** Pas de tracking individuel par cookie tiers, pas de profilage publicitaire.

---

## 2. Consentement

✅ Le formulaire de démo expose une case à cocher **non pré-cochée** :

> « J'accepte d'être recontacté(e) par l'équipe EcoleDigitale au sujet de ma demande de démonstration. »

✅ Validation Zod : `consent: z.literal(true)` → la soumission est rejetée si la case n'est pas cochée explicitement.

✅ Un lien vers `/confidentialite` est présent à côté de la case.

✅ Vérification automatisée : test E2E `tests/e2e/demo-form.spec.ts` (rejet de la soumission si consent manquant).

---

## 3. Mesure d'audience

| Outil                    | Cookies ?       | Données personnelles ?                                                              | Bandeau requis ?                                      |
| ------------------------ | --------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Umami** (auto-hébergé) | ❌ Aucun cookie | ❌ Aucune adresse IP conservée ; aucun nom, e-mail ni téléphone dans les événements | ❌ Non jugé nécessaire (à revalider, voir ci-dessous) |

Umami est hébergé par Alliance Consultants : aucune donnée de mesure n'est envoyée à un service tiers. Il enregistre les pages consultées, la page d'origine, le pays/la région/la ville approximatifs, le type d'appareil, de navigateur et d'écran, et les événements de `lib/analytics/events.ts`.

L'exemption de consentement dépend des règles applicables (CNIL, ARTCI) : **à faire valider** avant de conclure qu'aucun bandeau n'est nécessaire. Le choix précédent (Plausible, Vercel Web Analytics) a été retiré le 2026-10-06.

---

## 4. Sous-traitants (sous-processeurs)

| Fournisseur  | Rôle                 | Localisation                                  | DPA en place ?                                                                                  |
| ------------ | -------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Vercel       | Hébergement          | UE (Frankfurt)                                | À signer côté Vercel                                                                            |
| Resend       | Email transactionnel | UE (Dublin)                                   | À signer côté Resend                                                                            |
| Umami        | Analytics produit    | Auto-hébergé (serveur d'Alliance Consultants) | N/A (pas de sous-traitant)                                                                      |
| Google Fonts | Police Inter         | CDN Google                                    | Auto-hébergée via `next/font` → **pas de connexion sortante**, aucune donnée transmise à Google |

✅ Tous les sous-processeurs choisis ont leur infrastructure principale en Union Européenne.

✅ `next/font` télécharge et auto-héberge Inter au build → aucune connexion runtime vers `fonts.googleapis.com`.

---

## 5. Page de confidentialité

✅ Accessible via : `/confidentialite`

✅ Liée depuis :

- Footer de toutes les pages
- Sous la case de consentement du formulaire
- Page de confirmation `/demander-demo/merci`

✅ Contenu : description des données collectées, finalité, durée de conservation (3 ans), droits utilisateur (accès, rectification, effacement, opposition), sous-traitants, contact.

✅ Date de mise à jour affichée.

---

## 6. Durée de conservation

| Type de donnée                 | Durée                                                         |
| ------------------------------ | ------------------------------------------------------------- |
| Email de notification (Resend) | Selon rétention Resend (typiquement 30 jours)                 |
| Log Vercel (PII masqué)        | 24h à 7 jours selon plan Vercel                               |
| Lead côté CRM (Phase 2)        | 3 ans à compter du dernier contact (à formaliser dans le CRM) |

✅ Au MVP, **aucune base de données interne** ne stocke les leads. Le lead transite par email puis est géré dans l'outil de l'équipe commerciale.

---

## 7. Droits utilisateur

Les utilisateurs disposent des droits suivants, exercés via les coordonnées du footer ou de la page `/confidentialite` :

- Droit d'accès
- Droit de rectification
- Droit à l'effacement (« droit à l'oubli »)
- Droit d'opposition au traitement
- Droit à la portabilité (sur demande, format machine-readable)

✅ Les demandes sont traitées sous 1 mois maximum (article 12 RGPD).

---

## 8. Sécurité technique

| Mesure                                                              | Statut                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| HTTPS forcé en production                                           | ✅ Vercel auto                                                           |
| Headers de sécurité (HSTS, X-Content-Type-Options, Referrer-Policy) | ✅ Vercel auto + Next.js defaults                                        |
| CSRF                                                                | Non requis (formulaire same-origin sans session)                         |
| Honeypot anti-bot                                                   | ✅ Champ `website` caché, traité silencieusement                         |
| Rate limiting                                                       | ✅ 5 req/IP/h sur `/api/leads` (activable via `RATE_LIMIT_ENABLED=true`) |
| Validation server-side                                              | ✅ Zod sur toutes les entrées                                            |
| Masquage PII en logs                                                | ✅ Email et téléphone masqués via `maskLeadForLog()`                     |
| Pas de stockage navigateur                                          | ✅ Aucun localStorage, sessionStorage ou cookie applicatif               |

---

## 9. Vérifications automatisées

Tests qui couvrent les exigences RGPD :

| Test                               | Fichier                          | Vérifie                                    |
| ---------------------------------- | -------------------------------- | ------------------------------------------ |
| Consentement obligatoire           | `tests/unit/lead.schema.test.ts` | Zod rejette `consent: false` ou absent     |
| Consentement obligatoire (E2E)     | `tests/e2e/demo-form.spec.ts`    | Soumission sans case cochée → erreur       |
| Masquage PII en log                | `tests/unit/lead.schema.test.ts` | `maskLeadForLog()` masque email/phone/nom  |
| Honeypot silencieux                | `tests/e2e/api-leads.spec.ts`    | Bot rempli → 200 OK sans envoi email       |
| Aucun event PII vers Umami         | `tests/e2e/analytics.spec.ts`    | `Demo Form Submitted` n'inclut pas l'email |
| Page `/confidentialite` accessible | `tests/e2e/seo.spec.ts`          | Route 200 + h1 + lien footer               |

---

## 10. Points de vigilance pour la Phase 2

Lors de l'intégration CRM ou de l'ajout d'une base de données :

- [ ] Mise à jour de `/confidentialite` avec le nouveau sous-traitant (CRM)
- [ ] Signature d'un DPA avec le fournisseur CRM
- [ ] Politique de durée de conservation explicite (3 ans recommandé)
- [ ] Bouton « Supprimer mes données » côté CRM ou via un workflow opérationnel
- [ ] Si une bannière de cookies devient nécessaire (ex. ajout de tracking publicitaire), revoir l'audit complet

---

## Conclusion

✅ Le site marketing MVP est **conforme RGPD** au moment de l'audit.

Cet audit doit être révisé :

- À chaque ajout de sous-traitant
- À chaque ajout de cookie ou de tracker
- Au minimum tous les 12 mois
