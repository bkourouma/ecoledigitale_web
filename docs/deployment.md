# Déploiement — Site marketing EcoleDigitale

Cible : **Vercel** (preview par PR + production sur `main`).

## Pré-requis

- Compte Vercel avec accès projet
- Compte Resend avec domaine vérifié (DKIM + SPF)
- Site créé dans Umami (instance d'Alliance Consultants) avec, pour domaine, le nom d'hôte de `NEXT_PUBLIC_SITE_URL` ; son identifiant est dans `components/analytics/UmamiScript.tsx`
- Domaine de production configuré (DNS pointant vers Vercel)

## Variables d'environnement Vercel

À provisionner dans **Project Settings → Environment Variables**. Toutes les variables `NEXT_PUBLIC_*` sont exposées au navigateur.

| Variable                      | Environnements             | Description                                     | Exemple                        |
| ----------------------------- | -------------------------- | ----------------------------------------------- | ------------------------------ |
| `RESEND_API_KEY`              | Production + Preview       | Clé API Resend (commence par `re_`)             | `re_aBcD_1234...`              |
| `LEADS_TO_EMAIL`              | Production + Preview + Dev | Destinataire interne des leads                  | `commercial@ecoledigitale.com` |
| `LEADS_FROM_EMAIL`            | Production + Preview + Dev | Expéditeur (domaine vérifié Resend)             | `noreply@ecoledigitale.com`    |
| `NEXT_PUBLIC_CONTACT_EMAIL`   | Production + Preview + Dev | Email affiché en footer                         | `contact@ecoledigitale.com`    |
| `NEXT_PUBLIC_CONTACT_PHONE`   | Production + Preview + Dev | Téléphone affiché en footer                     | `+33 1 23 45 67 89`            |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Production + Preview + Dev | WhatsApp au format international sans `+`       | `33123456789`                  |
| `RATE_LIMIT_ENABLED`          | Production uniquement      | Activer le rate limit `/api/leads`              | `true`                         |
| `NEXT_PUBLIC_SITE_URL`        | Production                 | URL canonique du site (HTTPS, sans slash final) | `https://ecoledigitale.com`    |

> ⚠ Ne renseigner `NEXT_PUBLIC_SITE_URL` qu'en **Production**. En Preview, Vercel injecte automatiquement `VERCEL_URL` ; `buildMetadata` détecte `VERCEL_ENV !== 'production'` et applique `noindex` pour empêcher l'indexation accidentelle des previews.

## Hub /ressources et SEO éditorial

Le hub éditorial n'ajoute aucune variable d'environnement au MVP. Les ressources
publiées sont lues depuis `content/ressources/**` au build et les auteurs depuis
`content/auteurs/**`. Les routes, métadonnées, JSON-LD, images Open Graph et
entrées sitemap sont générées automatiquement à partir du frontmatter MDX.

Contrôles à effectuer après chaque publication de ressource :

- lancer `pnpm build` pour valider le frontmatter, les slugs et les références croisées ;
- vérifier que `/sitemap.xml` contient la nouvelle URL ;
- valider une URL publiée dans Google Rich Results Test après déploiement ;
- surveiller les impressions et clics dans Google Search Console à J+15/J+30.

## Domaines

1. Dans Vercel **Project Settings → Domains**, ajouter le domaine de production (ex. `ecoledigitale.com`) et un éventuel sous-domaine `www`.
2. Mettre à jour les DNS chez votre registrar :
   - Enregistrement `A` ou `ALIAS` vers Vercel
   - Enregistrement `CNAME` `www` vers `cname.vercel-dns.com`
3. Vercel provisionne automatiquement les certificats Let's Encrypt.

## Pipeline CI/CD

| Déclencheur               | Workflow                                        | Effet                                                                  |
| ------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| Push sur `main`           | GitHub Actions `ci.yml` + Vercel auto-deploy    | Lint, typecheck, unit, build, e2e, Lighthouse — déploiement production |
| Pull Request              | GitHub Actions `ci.yml` + Vercel preview deploy | Idem CI + déploiement preview URL                                      |
| Vercel deployment success | GitHub Actions `preview.yml`                    | Lighthouse CI contre la preview URL                                    |

## Première mise en production — check-list

- [ ] Variables d'environnement configurées dans Vercel (10 minimum)
- [ ] Domaine de production configuré + DNS propagés
- [ ] Certificat SSL actif (vérifier dans Vercel)
- [ ] Resend : domaine d'expédition vérifié (DKIM + SPF + DMARC recommandé)
- [ ] Umami : site créé avec le domaine de `NEXT_PUBLIC_SITE_URL`, interface accessible à l'équipe (voir `docs/analytics-runbook.md`)
- [ ] Test fonctionnel : soumettre un formulaire réel → vérifier réception email à `LEADS_TO_EMAIL` en moins de 5 minutes
- [ ] Test SEO : `curl https://ecoledigitale.com/robots.txt` retourne `Allow: /`, `curl https://ecoledigitale.com/sitemap.xml` retourne 9 URLs
- [ ] Test analytics : ouvrir la home, cliquer un CTA démo → vérifier l'event dans Umami (_Temps réel_)
- [ ] Test mobile 3G simulé (Chrome DevTools → Network → Slow 3G + CPU 4×) : LCP < 4 s sur `/`
- [ ] Test Lighthouse mobile : `pnpm test:lighthouse` → Performance ≥ 85 sur les 9 routes
- [ ] Soumettre la sitemap à Google Search Console

## Rollback

En cas de régression :

1. Vercel **Deployments** → cliquer le dernier déploiement stable
2. **Promote to Production** → le déploiement précédent redevient actif en quelques secondes
3. Pas besoin de toucher au code — le rollback est atomique

## Dépannage

| Symptôme                               | Cause probable                                                                     | Action                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Formulaire renvoie 500                 | `RESEND_API_KEY` invalide ou domaine non vérifié                                   | Vérifier la console Resend, regénérer la clé                                |
| Aucun event Umami                      | `NEXT_PUBLIC_SITE_URL` absent au build, ou différent du domaine déclaré dans Umami | Corriger la valeur (ou le domaine du site dans Umami) et redéployer         |
| Pages indexées en preview              | `VERCEL_ENV` mal détecté                                                           | Vérifier `vercel env ls`                                                    |
| Lighthouse < 85                        | Images lourdes ou JS bloquant                                                      | `pnpm analyze` puis optimiser                                               |
| 429 Too Many Requests sur `/api/leads` | Rate limit déclenché                                                               | Augmenter la limite dans `lib/leads/rate-limit.ts` ou migrer vers Vercel KV |
