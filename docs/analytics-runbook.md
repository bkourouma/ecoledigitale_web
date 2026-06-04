# Analytics Runbook — Site marketing EcoleDigitale

Référence opérationnelle pour l'équipe marketing/commerciale. Permet de vérifier que la mesure du tunnel de conversion fonctionne correctement après chaque déploiement.

**Outil** : Plausible (cookieless, dashboard public ou privé selon configuration).

**Catalogue typé** : [specs/001-site-marketing/contracts/analytics-events.contract.md](../specs/001-site-marketing/contracts/analytics-events.contract.md)

**Code wrapper** : [lib/analytics/track.ts](../lib/analytics/track.ts)

---

## Catalogue des événements

| Event | Émis quand | Propriétés clés | Couvre FR-013 |
|---|---|---|---|
| `Demo CTA Clicked` | Clic sur un CTA `Demander une démonstration` | `placement`, `sourcePage` | ✅ Clic démo |
| `Modules CTA Clicked` | Clic sur `Voir les modules` / `Voir le module` (cartes) | `placement`, `sourcePage` | — |
| `Module Page Viewed` | Chargement d'une page `/modules/<slug>` | `moduleSlug` | ✅ Modules consultés |
| `Module Selected In Form` | Cochage d'un module dans le formulaire de démo | `moduleSlug`, `sourcePage` | ✅ Sélection module |
| `Demo Form Submitted` | Soumission valide du formulaire (200 OK) | `modulesCount`, `hasMessage`, `hasStudentCount`, `sourcePage` | ✅ Soumission |
| `Demo Form Submission Failed` | Erreur lors de la soumission | `reason: validation\|rate_limit\|server\|network`, `sourcePage` | — |
| `Contact Channel Clicked` | Clic sur WhatsApp / Email / Téléphone | `channel`, `placement`, `sourcePage` | ✅ Clic WhatsApp/email |
| `Brochure Requested` | Clic sur "Recevoir la brochure" (Phase 2) | `sourcePage` | ✅ Brochure |

**Couverture FR-013 : 100 %.**

---

## Golden path : check-list à exécuter après chaque déploiement

Connecte-toi au dashboard Plausible (domaine configuré dans `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`). Filtre sur les **15 dernières minutes**.

### 1. Page d'accueil (`/`)

- [ ] Ouvre `/` → un pageview `/` apparaît.
- [ ] Clique sur **Demander une démonstration** (hero) → event `Demo CTA Clicked` avec `placement=hero`, `sourcePage=/`.
- [ ] Clique sur **Voir les modules** (hero) → event `Modules CTA Clicked` avec `placement=hero`.

### 2. Catalogue modules (`/modules`)

- [ ] Pageview `/modules` apparaît.
- [ ] Clique sur **Voir le module →** d'une carte → event `Modules CTA Clicked` avec `placement=card`.

### 3. Pages module (`/modules/<slug>`)

- [ ] Charge `/modules/parcours-bts` → pageview + event `Module Page Viewed` avec `moduleSlug=parcours-bts`.
- [ ] Répète pour les 5 modules — chacun émet un event avec son slug.

### 4. Formulaire de démo (`/demander-demo`)

- [ ] Coche un module → event `Module Selected In Form` avec `moduleSlug` correspondant.
- [ ] Décoche le même module → **aucun event** (seul le toggle ON est tracé).
- [ ] Soumets un formulaire valide → event `Demo Form Submitted` avec :
  - `modulesCount` = nombre de modules cochés
  - `hasMessage` = `true`/`false` selon présence d'un message
  - `hasStudentCount` = `true`/`false` selon présence d'un nombre d'étudiants
- [ ] Soumets avec un email invalide → event `Demo Form Submission Failed` avec `reason=validation`.

### 5. Canaux de contact (footer)

- [ ] Clique sur **WhatsApp** dans le footer → event `Contact Channel Clicked` avec `channel=whatsapp`, `placement=footer`.
- [ ] Clique sur **Email** → `channel=email`, `placement=footer`.
- [ ] Clique sur **Téléphone** → `channel=phone`, `placement=footer`.

---

## Métriques pilotage MVP

Mesurées depuis le dashboard Plausible (Goals + Custom properties).

| Indicateur | Calcul | Cible |
|---|---|---|
| Taux de conversion visite → demande de démo | `Demo Form Submitted` / sessions qualifiées (> 10s) | ≥ 3 % (SC-001) |
| CTR CTA démo depuis l'accueil | `Demo CTA Clicked (placement=hero, sourcePage=/)` / pageviews `/` | ≥ 8 % (SC-003) |
| Taux de complétion formulaire | `Demo Form Submitted` / sessions ayant émis `Module Selected In Form` | ≥ 60 % (SC-007) |
| Temps moyen pages module | Vue de chaque slug (Plausible duration) | ≥ 60 s (SC-002) |
| Ranking des modules | `Module Page Viewed` group by `moduleSlug` + `Module Selected In Form` group by `moduleSlug` | — |
| Canaux contact alternatifs | `Contact Channel Clicked` group by `channel` | — |

---

## Dépannage

### Plausible ne reçoit aucun event en production
1. Ouvrir `https://<domaine>` et inspecter la console : le script `plausible.js` doit charger sans erreur.
2. Vérifier que `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` est configuré dans Vercel (Settings → Environment Variables).
3. Vérifier que le domaine est bien enregistré côté Plausible.
4. Un ad-blocker côté visiteur peut bloquer Plausible — c'est attendu et conforme à la philosophie cookieless.

### Events visibles en dev mais pas en prod
1. En dev, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` peut pointer vers un site Plausible de test.
2. Vérifier que la prod a son propre `data-domain` et que le script charge depuis le bon CDN.

### Un nouvel event ajouté n'apparaît pas
1. Vérifier qu'il est dans le catalogue typé [lib/analytics/events.ts](../lib/analytics/events.ts) — sinon il ne compile pas.
2. Vérifier qu'il est invoqué via le wrapper `track()` (pas `window.plausible` direct).
3. Côté Plausible, ajouter le nouvel event comme **Goal** dans les paramètres du site pour qu'il apparaisse dans les vues agrégées.

---

## Lien avec la spec

Les events listés ici couvrent **100 %** des exigences FR-013 (PRD §8) et permettent de mesurer les success criteria SC-001, SC-002, SC-003, SC-007.

Toute modification du catalogue **doit** être :
1. Reflétée dans [contracts/analytics-events.contract.md](../specs/001-site-marketing/contracts/analytics-events.contract.md)
2. Typée dans `lib/analytics/events.ts`
3. Couverte par un test dans `tests/e2e/analytics.spec.ts`
4. Documentée ici
