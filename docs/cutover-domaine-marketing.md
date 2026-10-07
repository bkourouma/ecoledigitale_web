# Bascule : le site marketing prend `ecoledigitale.allianceconsultants.net`

> Ce document accompagne la branche `feat/deploiement-site-marketing`. **Rien n'est déployé tant qu'elle n'est pas fusionnée dans `main`** : le push sur `main` lance le workflow.

## 1. Pourquoi ce chantier (constaté le 2026-10-06)

Le serveur « alliance » héberge deux projets **différents** qui se disputaient les mêmes noms :

|                  | Site marketing (ce dépôt)                                              | Application EcoleDigitaleV2 (autre dépôt)                                                |
| ---------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Conteneur        | `ecoledigitale-web` ❌ (avant) → **`ecoledigitale-site`** (maintenant) | `ecoledigitale-web`                                                                      |
| Port local       | `3011` ❌ (avant) → **`3021`** (maintenant)                            | `3011` (+ API `8011`)                                                                    |
| Dossier serveur  | `~/apps/ecoledigitale-web` → **`~/apps/ecoledigitale-site`**           | `…/actions-runner-ecoledigitale/_work/EcoleDigitaleV2/…`                                 |
| Exécuteur GitHub | `ecoledigitale-web-runner`                                             | `alliance-ecoledigitale` (+ préproduction sur un autre serveur)                          |
| Adresse visée    | **`ecoledigitale.allianceconsultants.net`**                            | aujourd'hui la même (`NEXTAUTH_URL`, `CORS_ORIGIN`, contrôle `/health` de sa production) |

Avant cette branche, un push sur `main` ici aurait redémarré **le conteneur de l'application** (même nom, même port) : l'ancien workflow ne protégeait rien. Les deux dépôts visent la même adresse : **l'un des deux doit en changer** (voir §3).

## 2. Ce que fait cette branche (côté dépôt marketing)

- **Isolation** : conteneur `ecoledigitale-site`, port `127.0.0.1:3021`, projet compose `ecoledigitale-site`, dossier `~/apps/ecoledigitale-site`, image `ghcr.io/bkourouma/ecoledigitale-site`.
- **Trois garde-fous** avant tout redémarrage (le déploiement s'arrête sinon) : le dossier et son `.env.production` existent ; le port 3021 n'appartient à aucun autre conteneur ; le nom de conteneur n'appartient à aucun autre projet compose.
- **Contrôle d'identité après déploiement** : le conteneur répond en local, **et** `https://<adresse>/robots.txt` est identique à celui du conteneur. Si nginx pointe encore sur l'application, l'étape devient rouge avec un message clair, au lieu de « réussir » en silence.
- **L'adresse du site** (`APP_DOMAIN`, en tête de `.github/workflows/deploy.yml`) est compilée dans l'image (`NEXT_PUBLIC_SITE_URL`) ; Umami ne compte que ce nom d'hôte.
- **Correctif du Dockerfile** : `VERCEL_ENV=production` est maintenant fixé dans l'image. Hors Vercel, cette variable n'existe pas, et le code la lit pour `robots.txt`, pour le masquage des brouillons et des ressources futures, et pour le `noindex` des aperçus. **Vérifié par un build avec et sans** : sans la variable, `robots.txt` sort avec `Disallow: /` (Google ne pourrait pas explorer le site) ; avec elle, `Allow: /` et le bon `Sitemap:`. Les deux brouillons d'exemple du dépôt sont introuvables (404, absents du sitemap) dans les deux cas : aucune fuite constatée, la variable aligne simplement le comportement sur celui de la production Vercel. `robots.txt` et les pages statiques sont figés **à la compilation** : la variable devait exister dans l'image, pas seulement sur le serveur.
- **`.dockerignore`** (nouveau) : sans lui, `COPY . .` écrase les `node_modules` de l'image par ceux de la machine qui construit (build local cassé) et peut embarquer des fichiers locaux (`.env`, `.git`) dans les couches de build. Aucun effet sur le build de GitHub (copie propre).
- **`infra/nginx/ecoledigitale-site.conf`** : le vhost du site (à installer à l'étape 5).

## 3. Décision prise : l'application passe sur `ecoledigitaleapp.allianceconsultants.net`

Décision relayée le 2026-10-06 : l'application EcoleDigitaleV2 vit sur **`ecoledigitaleapp.allianceconsultants.net`** (le DNS existe déjà et pointe sur le serveur `alliance`, vérifié ; **le certificat et le vhost n'existent pas encore** : certbot à lancer sur le serveur, rien à faire chez Hostinger). L'adresse `ecoledigitale.allianceconsultants.net` est libérée pour le site marketing.

À changer côté application (rien n'est appliqué à ce jour) :

- **Son dépôt** (`EcoleDigitaleV2`, `.github/workflows/deploy.yml`) : l'URL de l'environnement de production et `DEPLOY_HEALTH_URL` → `https://ecoledigitaleapp.allianceconsultants.net/health`.
- **Son fichier d'environnement sur le serveur** (`/home/deployer/ecoledigitale.env`) : `NEXTAUTH_URL` et `CORS_ORIGIN` → `https://ecoledigitaleapp.allianceconsultants.net`, puis redéploiement de l'application. À lire d'abord, ne rien deviner : `grep -nE 'NEXTAUTH_URL|CORS_ORIGIN|ecoledigitale' /home/deployer/ecoledigitale.env` et chercher aussi toute autre mention de l'ancienne adresse (clients mobiles, webhooks, fournisseur d'authentification : URLs de rappel OAuth à mettre à jour chez le fournisseur).
- **Son nginx** : `infra/nginx/ecoledigitale-app.conf` (ce dépôt) crée `/etc/nginx/sites-available/ecoledigitaleapp` (nouvel hôte ; l'ancien vhost `ecoledigitale-web` peut rester ou rediriger) avec les routes `/api/v1/` → `127.0.0.1:8011` et `/health` → `127.0.0.1:8011/api/v1/health` reprises de l'ancien vhost `ecoledigitale`. La logique « tenant » des sous-domaines clients n'est pas reprise (ils n'existent pas dans le DNS).
- **Certificat** : à émettre avec certbot (`--webroot -w /var/www/html -d ecoledigitaleapp.allianceconsultants.net`) ; procédure dans l'en-tête de `infra/nginx/ecoledigitale-app.conf` (bloc 80 d'abord, puis 443).

Conséquences à connaître :

- Pendant l'étape 2 puis jusqu'à l'étape 5, l'application répond sur les deux adresses (l'ancienne via l'ancien vhost). Après l'étape 5, l'ancienne adresse sert le marketing : **les utilisateurs de l'application qui ont l'ancienne adresse en favori ou un lien de rappel (courriels, OAuth) tomberont sur le site marketing**. À annoncer avant la bascule.
- Le site Umami « EcoleDigitale » porte aujourd'hui le domaine `ecoledigitale-web.allianceconsultants.net` (autre vhost de la même application) : tant que l'étape 7 n'est pas faite, les visites du site marketing (sur l'apex) seraient filtrées par `data-domains` (domaine compté = celui de `NEXT_PUBLIC_SITE_URL`, soit l'apex). Faire l'étape 7 juste après la bascule.
- Le dashboard n'a aucun autre rapport avec l'application : rien à y changer.

## 4. Ordre des opérations

À faire **dans cet ordre**. Chaque étape a son contrôle.

### Étape 1 — Préparer le serveur (sans effet sur les sites en ligne)

```bash
ssh alliance "mkdir -p ~/apps/ecoledigitale-site && cp ~/apps/ecoledigitale-web/.env.production ~/apps/ecoledigitale-site/.env.production && chmod 640 ~/apps/ecoledigitale-site/.env.production && ls -l ~/apps/ecoledigitale-site"
ssh alliance "ss -ltn | grep -c ':3021 ' || echo 'port 3021 libre'"
```

Contrôle : le fichier existe, et le port 3021 est libre. (L'exécuteur `gha-runner` est dans les groupes `docker` et `deploy`, il peut écrire dans ce dossier.)

### Étape 2 — Déplacer l'application sur `ecoledigitaleapp.allianceconsultants.net`

Voir §3. Ordre : (a) installer `infra/nginx/ecoledigitale-app.conf` et émettre le certificat (voir son en-tête ; `nginx -t` avant chaque rechargement) ; (b) contrôler `curl -s -o /dev/null -w '%{http_code}' https://ecoledigitaleapp.allianceconsultants.net/health` (200) ; (c) sauvegarder `/home/deployer/ecoledigitale.env`, changer `NEXTAUTH_URL` et `CORS_ORIGIN`, redéployer l'application ; (d) fusionner dans le dépôt `EcoleDigitaleV2` le changement d'URL / `DEPLOY_HEALTH_URL`. **Valider sur l'application (connexion, `/health`) avant de continuer.**

### Étape 3 — Fusionner dans `main` → déploiement du conteneur

Le workflow construit l'image, passe les garde-fous, démarre `ecoledigitale-site` sur le port 3021. **L'étape finale « Vérifier que le bon site répond » échoue à ce stade, et c'est normal** : nginx envoie encore l'adresse à l'ancien vhost. Contrôle direct du conteneur :

```bash
ssh alliance "curl -s -o /dev/null -w 'conteneur: HTTP %{http_code}\n' http://127.0.0.1:3021/robots.txt; curl -s http://127.0.0.1:3021/robots.txt | head -4"
```

`robots.txt` doit contenir `Allow: /` et `Sitemap: https://ecoledigitale.allianceconsultants.net/sitemap.xml`. S'il dit `Disallow: /`, l'image a été construite sans `VERCEL_ENV=production` : ne pas basculer.

### Étape 4 — Sauvegarder l'ancien vhost nginx

```bash
ssh alliance "sudo cp /etc/nginx/sites-available/ecoledigitale /etc/nginx/sites-available/ecoledigitale.bak-$(date +%F)"
```

### Étape 5 — Basculer nginx

```bash
scp infra/nginx/ecoledigitale-site.conf alliance:/tmp/ecoledigitale-site.conf
ssh alliance "sudo cp /tmp/ecoledigitale-site.conf /etc/nginx/sites-available/ecoledigitale && sudo nginx -t && sudo systemctl reload nginx"
```

`nginx -t` doit répondre « successful » **avant** le rechargement (la commande s'arrête sinon, rien n'est rechargé).

### Étape 6 — Relancer le workflow (Actions → _Run workflow_)

L'étape « Vérifier que le bon site répond » doit maintenant être **verte**.

### Étape 7 — Umami et Search Console

- Dans Umami, le site « EcoleDigitale » doit avoir pour domaine `ecoledigitale.allianceconsultants.net` (il vaut `ecoledigitale-web.allianceconsultants.net` jusque-là). C'est ce domaine qui permet au dashboard Mission Control de retrouver la propriété Search Console. Depuis le serveur du dashboard (`CGCI`, le mot de passe est lu sur place, jamais affiché) :

  ```bash
  ssh CGCI 'cd ~/mission-control && set -a && . ./.env && set +a
  B=http://127.0.0.1:3300; ID=6b9335ed-d095-41ae-8b8f-ad1fc8deb8f3
  TOKEN=$(curl -s -X POST $B/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"$UMAMI_USERNAME\",\"password\":\"$UMAMI_PASSWORD\"}" | node -pe "JSON.parse(require(\"fs\").readFileSync(0,\"utf8\")).token")
  curl -s -X POST $B/api/websites/$ID -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"EcoleDigitale\",\"domain\":\"ecoledigitale.allianceconsultants.net\"}" -o /dev/null -w "HTTP %{http_code}\n"'
  ```

- Search Console : ajouter la propriété « Préfixe d'URL » `https://ecoledigitale.allianceconsultants.net/` et y ajouter le compte de service du dashboard en « Restreint ».

## 5. Retour arrière

- **nginx** (le plus rapide) : `sudo cp /etc/nginx/sites-available/ecoledigitale.bak-<date> /etc/nginx/sites-available/ecoledigitale && sudo nginx -t && sudo systemctl reload nginx`. L'adresse sert de nouveau l'ancien contenu.
- Le conteneur `ecoledigitale-site` peut rester : il n'écoute que sur `127.0.0.1:3021` et ne gêne rien. Pour l'arrêter : `cd ~/apps/ecoledigitale-site && docker compose -p ecoledigitale-site -f docker-compose.prod.yml down`.
- Si l'application a déjà été déplacée (étape 2), elle peut rester sur `ecoledigitale-web…` : le retour arrière nginx ci-dessus rend l'ancienne adresse à l'ancien vhost, qui proxifie toujours vers le même conteneur (3011/8011) ; seuls `NEXTAUTH_URL`/`CORS_ORIGIN` (désormais sur la nouvelle adresse) ne correspondent plus à l'ancienne. Sauvegardes à garder : `ecoledigitale.bak-<date>`, `ecoledigitale-web.bak-<date>`, `ecoledigitale.env.bak-<date>`.

## 6. Points de contrôle

```bash
# Le bon site répond à l'adresse publique
curl -s https://ecoledigitale.allianceconsultants.net/robots.txt
curl -s https://ecoledigitale.allianceconsultants.net/ | grep -o '<title>[^<]*</title>'
# L'application, elle, répond à sa nouvelle adresse :
curl -s -o /dev/null -w 'app /health: HTTP %{http_code}\n' https://ecoledigitaleapp.allianceconsultants.net/health
# Umami : le script est servi, domaine compté = celui de NEXT_PUBLIC_SITE_URL
curl -s https://ecoledigitale.allianceconsultants.net/ | grep -o 'data-domains[^,]*'
```
