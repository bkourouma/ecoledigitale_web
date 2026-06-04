# Quickstart — Site marketing EcoleDigitale

Démarrage local en moins de 5 minutes.

## Prérequis

- **Node.js** ≥ 20 LTS (`node --version`)
- **pnpm** ≥ 9 (recommandé) ou npm ≥ 10
- **Git**
- Un compte **Resend** (pour tester la notification email — optionnel en dev local)

## 1. Cloner et installer

```powershell
git clone <repo-url> Ecoledigitale_web
cd Ecoledigitale_web
pnpm install
```

## 2. Configuration locale

Copier le template d'environnement :

```powershell
Copy-Item .env.example .env.local
```

Renseigner les variables (voir `.env.example` après l'init du projet) :

```dotenv
# Email (Resend)
RESEND_API_KEY=re_dev_xxx          # optionnel en dev — sans clé, le sink Resend log un warning
LEADS_TO_EMAIL=dev@ecoledigitale.local
LEADS_FROM_EMAIL=noreply@ecoledigitale.local

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=localhost   # ou laisser vide pour désactiver en local

# Contacts publics
NEXT_PUBLIC_CONTACT_EMAIL=contact@ecoledigitale.com
NEXT_PUBLIC_CONTACT_PHONE=+33 1 23 45 67 89
NEXT_PUBLIC_WHATSAPP_NUMBER=+33123456789

# Rate limiting (dev → désactivé par défaut)
RATE_LIMIT_ENABLED=false
```

> En dev sans clé Resend, le formulaire fonctionne : le `ResendLeadSink` log un warning au lieu d'envoyer, et le `LogLeadSink` capture le lead complet. La réponse API reste 200 OK.

## 3. Lancer le site

```powershell
pnpm dev
```

Ouvre [http://localhost:4000](http://localhost:4000).

## 4. Parcours de smoke test

1. **Accueil** `/` — vérifier hero, 5 modules en aperçu, CTA démo dans le header.
2. **Modules** `/modules` — vérifier table comparative + 5 cartes.
3. **Page module** `/modules/parcours-bts` — vérifier titre, headline, benefits, features, CTA final.
4. **Demande de démo** `/demander-demo` :
   - Soumettre vide → 7 erreurs de validation
   - Email invalide → erreur ciblée
   - Aucun module → erreur sur le groupe modules
   - Soumission valide → message de succès + check console pour l'event `Demo Form Submitted`
5. **Navigation clavier** : Tab depuis le logo → tous les éléments interactifs accessibles.
6. **Confidentialité** `/confidentialite` accessible depuis le footer.

## 5. Tests automatisés

```powershell
# Unitaires
pnpm test:unit

# E2E (headless)
pnpm test:e2e

# E2E avec UI (debug)
pnpm test:e2e:ui

# Audit accessibilité
pnpm test:a11y

# Lighthouse CI (nécessite que `pnpm build && pnpm start` tourne ou pointe vers une URL)
pnpm test:lighthouse
```

## 6. Build production

```powershell
pnpm build
pnpm start
```

Vérifier :
- Génération statique des 8 pages (`Building` log doit montrer 9 routes statiques + 1 API).
- Aucun warning de validation MDX.
- Bundle JS initial < 90 kB gzip (visible dans le rapport `next build`).

## 7. Édition de contenu

| Pour modifier… | Fichier |
|---|---|
| L'accueil (hero, sections, copies) | `content/home.mdx` |
| Un module (libellés, benefits, features, SEO) | `content/modules/<slug>.mdx` |
| La page confidentialité | `content/confidentialite.mdx` |
| Les libellés CTA globaux | `lib/seo/metadata.ts` ou directement les composants |

Le build échouera (avec un message clair) si :
- Un `slug` ne correspond pas au nom de fichier
- Un champ obligatoire manque
- `seo.title` dépasse 60 caractères
- L'image `ogImage` n'existe pas dans `public/`

## 8. Déploiement

- **Preview** : automatique sur chaque PR via Vercel.
- **Production** : auto-déploiement à chaque push sur `main`.
- Variables d'environnement Vercel à provisionner depuis le dashboard (mêmes clés que `.env.local`, mais avec les valeurs prod).

## 9. Dépannage rapide

| Symptôme | Cause probable | Fix |
|---|---|---|
| Build échoue `Module slug mismatch` | Renommage de fichier MDX sans mettre à jour `slug` dans frontmatter | Aligner `slug` et nom de fichier |
| Formulaire renvoie 500 | `RESEND_API_KEY` invalide ou `LEADS_FROM_EMAIL` non vérifié dans Resend | Vérifier la console Resend ; en dev, peut être ignoré |
| Lighthouse < 85 sur une page module | Image lourde non optimisée | Utiliser `next/image` avec dimensions, format AVIF |
| Plausible ne reçoit aucun event en dev | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` n'est pas configuré pour `localhost` | Désactiver en dev (laisser vide) ou créer un site Plausible dédié dev |
| Form events absents en E2E | Mock `window.plausible` manquant | Vérifier `tests/e2e/helpers/mock-plausible.ts` |

## 10. Aller plus loin

- **Phase 2** : brochure téléchargeable, intégration CRM (ajouter un sink `HubspotLeadSink` dans `lib/leads/sinks/`).
- **i18n** : ajouter une locale en wrappant les routes dans `[locale]/` et en duplicant le contenu MDX. Voir `next-intl` documentation.
- **A/B test** : intégrer PostHog en complément de Plausible pour les feature flags.
