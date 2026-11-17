---
sidebar_label: 4 - Lancer le CMS en local
sidebar_position: 4
---

# Lancer le CMS en local avec les données de recette

Les pages de recherche indexée (offres de stage, annonces de logement, fiches métier, évènements) interrogent
Meilisearch directement depuis le navigateur. Pour les tester en local avec de vraies données, on lance le projet
[1j1s-main-cms](https://github.com/DNUM-SocialGouv/1j1s-main-cms) en local : Strapi, sa base PostgreSQL restaurée depuis
la recette, et un Meilisearch indexé par le plugin Strapi.

> Les commandes ci-dessous se lancent depuis le dossier du projet `1j1s-main-cms`, sauf mention contraire.

## Prérequis

- Un moteur Docker démarré. Avec Colima, prévoir au moins 4 Go de mémoire (2 Go par défaut, trop juste pour Strapi,
  PostgreSQL et Meilisearch ensemble) :
  ```bash
  colima start --memory 4
  ```
- `docker-compose` ou le plugin `docker compose` (voir [Problèmes connus](#problèmes-connus)).
- La CLI [Scalingo](https://cli.scalingo.com) et un accès à l'app `1j1s-main-cms`, qui est l'app de **recette**
  (l'app de production est suffixée `_prod`).
- Un token d'API Scalingo (User settings → API tokens), renseigné dans la variable `SCALINGO_API_TOKEN` du fichier
  `.env` du projet CMS.
- Les fichiers `.env` et `.env.docker` du projet CMS (à demander à l'équipe).

## 1. Restaurer la base de recette

Le script `npm run docker:populate` télécharge la dernière sauvegarde PostgreSQL de la recette et la restaure dans
le conteneur `db`.

```bash
npm run docker:populate
```

:::warning
Le script commence par `docker compose down -v` : **toutes les données locales du CMS sont supprimées** (volumes
PostgreSQL, Meilisearch et MinIO).
:::

Pour vérifier que la restauration a fonctionné :

```bash
docker-compose --env-file .env.docker exec -T db \
  psql -U database-user -d cms-principal -tAc "select count(*) from offres_de_stage"
```

## 2. Démarrer Strapi et Meilisearch

```bash
npm run docker:start
```

Strapi est alors disponible sur http://localhost:1337/admin et Meilisearch sur http://localhost:7700 (clé maître :
`masterKey` par défaut, variable `PLUGIN_MEILISEARCH_API_KEY` de `.env.docker`).

Si le démarrage échoue sur l'image MinIO, voir [Problèmes connus](#problèmes-connus).

## 3. Configurer Strapi et indexer les données

Se connecter sur http://localhost:1337/admin avec ses identifiants de **recette** (la base restaurée contient les
comptes de la recette), puis :

1. **Settings → Config Sync → Interface → Import** pour aligner la configuration Strapi sur celle du dépôt.
2. Menu **Plugins → Meilisearch** :
   - onglet **Settings** : vérifier que l'URL (`meilisearch:7700`) et la clé (`masterKey`) sont renseignées ;
   - onglet **Collections** : cocher les collections à indexer (`offre-de-stage`, `annonce-de-logement`,
     `fiche-metier`, `evenement`).

L'indexation des offres de stage prend une à deux minutes. Pour vérifier qu'elle est terminée :

```bash
curl -s http://localhost:7700/indexes/offre-de-stage/stats -H 'Authorization: Bearer masterKey'
```

`numberOfDocuments` doit correspondre au nombre d'offres **publiées** (les brouillons ne sont pas indexés) et
`isIndexing` doit valoir `false`.

## 4. Brancher le front sur le Meilisearch local

Dans le `.env.local` du projet 1j1s-front :

```
MEILISEARCH_BASE_URL=http://localhost:7700
MEILISEARCH_API_KEY=masterKey
```

Puis **relancer `npm run dev`** pour que les variables soient prises en compte.

Meilisearch n'est interrogé que par le serveur Next.js : aucune configuration de la Content-Security-Policy n'est
nécessaire.

## Arrêter et relancer

| Action                                         | Commande                 |
|------------------------------------------------|--------------------------|
| Arrêter le CMS en gardant les données          | `npm run docker:stop`    |
| Relancer le CMS                                | `npm run docker:start`   |
| Supprimer les conteneurs (données conservées)  | `npm run docker:down`    |

Les données restent dans les volumes Docker : il n'est pas nécessaire de refaire la restauration ni l'indexation à
chaque lancement.

## Problèmes connus

### `docker: 'compose' is not a docker command`

Le script `docker:populate` appelle `docker compose` (plugin), alors que les autres scripts appellent
`docker-compose` (binaire séparé). Si seul le binaire est installé (par exemple via Homebrew), **le script échoue sur
toutes les étapes Docker, puis supprime la sauvegarde téléchargée**.

Deux solutions :

- rendre le binaire disponible comme plugin Docker, puis vérifier avec `docker compose version` :
  ```bash
  mkdir -p ~/.docker/cli-plugins
  ln -s "$(which docker-compose)" ~/.docker/cli-plugins/docker-compose
  ```
- ou dérouler les étapes du script à la main avec `docker-compose` :
  ```bash
  scalingo login --api-token "<token>"
  addon_id=$(scalingo --app 1j1s-main-cms addons | grep postgresql | sed 's/│/|/g' | cut -d'|' -f3 | tr -d ' ')
  mkdir -p tmp && cd tmp
  scalingo --app 1j1s-main-cms --addon "$addon_id" backups-download --output ./backup
  tar -xvf ./backup && for f in *.pgsql; do mv "$f" backup.pgsql; done
  cd ..
  docker-compose --env-file .env.docker down -v
  docker-compose --env-file .env.docker up -d db
  docker-compose --env-file .env.docker cp ./tmp/backup.pgsql db:/tmp/backup.pgsql
  docker-compose --env-file .env.docker exec -T db \
    pg_restore --no-privileges --no-owner -U database-user -d cms-principal /tmp/backup.pgsql
  rm tmp/backup tmp/backup.pgsql
  ```

### `pull access denied for minio/minio`

L'image `minio/minio` n'est plus publiée sur Docker Hub. MinIO ne sert qu'au stockage des médias Strapi : on peut
démarrer Strapi et Meilisearch sans lui (la base `db` doit déjà tourner) :

```bash
docker-compose --env-file=.env.docker up --build -d --no-deps strapi meilisearch
```

L'envoi de médias depuis l'admin Strapi ne fonctionne alors pas en local, ce qui n'a pas d'impact sur la recherche.

### « Service indisponible » sur une page de recherche du front

Le serveur du front n'arrive pas à interroger Meilisearch. Vérifier dans l'ordre :

1. que Meilisearch répond : `curl http://localhost:7700/health` ;
2. que l'index existe et contient des documents (voir [étape 3](#3-configurer-strapi-et-indexer-les-données)) ;
3. que `.env.local` pointe bien sur `http://localhost:7700` avec la clé `masterKey`, et que `npm run dev` a été relancé
   depuis ;
4. les logs du serveur `npm run dev`, où l'erreur Meilisearch est détaillée.
