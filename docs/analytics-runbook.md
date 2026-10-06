# Analytics Runbook — Site marketing EcoleDigitale

Référence opérationnelle pour l'équipe marketing/commerciale. Permet de vérifier que la mesure du tunnel de conversion fonctionne correctement après chaque déploiement.

**Outil** : Umami auto-hébergé par Alliance Consultants (cookieless, adresse IP non conservée). Le script est `components/analytics/UmamiScript.tsx` ; il ne charge qu'en production et ne compte que le domaine de `NEXT_PUBLIC_SITE_URL`.

**Où regarder** : l'interface d'Umami n'est pas publique. Ouvre un tunnel `ssh -N -L 3300:127.0.0.1:3300 CGCI`, puis http://localhost:3300 → site **EcoleDigitale** → _Temps réel_ (pages et événements des dernières minutes) et _Événements_ (par nom et par propriété). Les chiffres de trafic (visiteurs, pages vues, origines, pays) sont aussi dans le dashboard Mission Control, page _Sites_.

**Catalogue typé** : [specs/001-site-marketing/contracts/analytics-events.contract.md](../specs/001-site-marketing/contracts/analytics-events.contract.md)

**Code wrapper** : [lib/analytics/track.ts](../lib/analytics/track.ts)

---

## Catalogue des événements

| Event                         | Émis quand                                              | Propriétés clés                                                 | Couvre FR-013          |
| ----------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | ---------------------- |
| `Demo CTA Clicked`            | Clic sur un CTA `Demander une démonstration`            | `placement`, `sourcePage`                                       | ✅ Clic démo           |
| `Modules CTA Clicked`         | Clic sur `Voir les modules` / `Voir le module` (cartes) | `placement`, `sourcePage`                                       | —                      |
| `Module Page Viewed`          | Chargement d'une page `/modules/<slug>`                 | `moduleSlug`                                                    | ✅ Modules consultés   |
| `Module Selected In Form`     | Cochage d'un module dans le formulaire de démo          | `moduleSlug`, `sourcePage`                                      | ✅ Sélection module    |
| `Demo Form Submitted`         | Soumission valide du formulaire (200 OK)                | `modulesCount`, `hasMessage`, `hasStudentCount`, `sourcePage`   | ✅ Soumission          |
| `Demo Form Submission Failed` | Erreur lors de la soumission                            | `reason: validation\|rate_limit\|server\|network`, `sourcePage` | —                      |
| `Contact Channel Clicked`     | Clic sur WhatsApp / Email / Téléphone                   | `channel`, `placement`, `sourcePage`                            | ✅ Clic WhatsApp/email |
| `Brochure Requested`          | Clic sur "Recevoir la brochure" (Phase 2)               | `sourcePage`                                                    | ✅ Brochure            |

**Couverture FR-013 : 100 %.**

---

## Golden path : check-list à exécuter après chaque déploiement

Ouvre Umami (voir « Où regarder » ci-dessus), site **EcoleDigitale**, vue _Temps réel_.

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

Mesurées depuis Umami (_Événements_, avec leurs propriétés).

| Indicateur                                  | Calcul                                                                                       | Cible           |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------- |
| Taux de conversion visite → demande de démo | `Demo Form Submitted` / sessions qualifiées (> 10s)                                          | ≥ 3 % (SC-001)  |
| CTR CTA démo depuis l'accueil               | `Demo CTA Clicked (placement=hero, sourcePage=/)` / pageviews `/`                            | ≥ 8 % (SC-003)  |
| Taux de complétion formulaire               | `Demo Form Submitted` / sessions ayant émis `Module Selected In Form`                        | ≥ 60 % (SC-007) |
| Temps moyen pages module                    | Vue de chaque slug (durée de visite Umami)                                                   | ≥ 60 s (SC-002) |
| Ranking des modules                         | `Module Page Viewed` group by `moduleSlug` + `Module Selected In Form` group by `moduleSlug` | —               |
| Canaux contact alternatifs                  | `Contact Channel Clicked` group by `channel`                                                 | —               |

---

## Dépannage

### Umami ne reçoit aucun event en production

1. Ouvrir `https://<domaine>` et inspecter l'onglet _Réseau_ : `script.js` (depuis `analytics.allianceconsultants.net`) doit charger, et des requêtes `api/send` doivent partir à chaque page.
2. Vérifier que `NEXT_PUBLIC_SITE_URL` est défini au build (workflow de déploiement) : sans lui, le composant ne rend rien. Son nom d'hôte doit être exactement le domaine déclaré pour le site dans Umami, sinon rien n'est compté.
3. Vérifier que le site existe dans Umami avec ce domaine et que l'identifiant de `UmamiScript.tsx` est le bon.
4. Un bloqueur de publicités chez le visiteur peut bloquer le script — c'est attendu.

### Events visibles en dev mais pas en prod

1. En dev, le script Umami n'est volontairement pas chargé (les tests e2e utilisent un faux `window.umami`).
2. En prod, vérifier que le nom d'hôte de `NEXT_PUBLIC_SITE_URL` correspond au domaine servi (c'est la valeur de `data-domains`).

### Un nouvel event ajouté n'apparaît pas

1. Vérifier qu'il est dans le catalogue typé [lib/analytics/events.ts](../lib/analytics/events.ts) — sinon il ne compile pas.
2. Vérifier qu'il est invoqué via le wrapper `track()` (pas `window.umami` direct).
3. Côté Umami, rien à déclarer : un nouvel événement apparaît tout seul dans _Événements_ dès sa première émission.

---

## Lien avec la spec

Les events listés ici couvrent **100 %** des exigences FR-013 (PRD §8) et permettent de mesurer les success criteria SC-001, SC-002, SC-003, SC-007.

Toute modification du catalogue **doit** être :

1. Reflétée dans [contracts/analytics-events.contract.md](../specs/001-site-marketing/contracts/analytics-events.contract.md)
2. Typée dans `lib/analytics/events.ts`
3. Couverte par un test dans `tests/e2e/analytics.spec.ts`
4. Documentée ici
