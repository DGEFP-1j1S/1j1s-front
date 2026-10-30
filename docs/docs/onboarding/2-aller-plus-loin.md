---
sidebar_label:  2 - Pour aller plus loin
sidebar_position: 2
---

# Pour aller plus loin sur le front

## Commandes utiles

| Commande                   | Fonction                                                                 |
|----------------------------|--------------------------------------------------------------------------|
| npm run lint               | Vérifie le formatage du code                                             |
| npm run lint:fix           | Formater le code                                                         |
| npm run test               | Lance les tests                                                          |
| npm run test:watch         | Lance les tests avec un watcher                                          |
| npm run test:coverage      | Lance les tests en indiquant le test coverage                            |
| npm run dev                | Lance le site en mode développeur (avec hot reload)                      |
| npm run start              | Lance la dernière version qui a été built (sans hot reload)              |
| npm run build              | build le site comme en production                                        |
| npm run analyze            | Analyze la taille du site et des packages                                |
| npm run analyze:server     | Analyze la taille du site et des packages côté serveur                   |
| npm run e2e (headless)     | Lance les tests cypress (nécessite que le site tourne)                   |
| npm run e2e:open           | Lance les tests cypress (nécessite que le site tourne)                   |
| npm run storybook          | Lance la documentation interactive des composants / assets Sass en local |
| npm run storybook:build    | Build une version statique de la documentation storybook                 |
| docker-compose up -d redis | Lance redis en local (nécessite de réaffecter la variable `REDIS_URL`)   |

## Configuration locale du CMS et de Meilisearch

Il faut avoir :
1. lancé le projet 1j1s-main-cms et peuplé les données via les scripts `npm run docker:populate` et `npm run docker:start`  (voir documentation sur le repo concerné)
2. synchronisé la configuration sur l'interface d'administration du CMS / Strapi (`Settings -> Config sync -> Interface`-> Cliquer sur "Import")
3. dans Strapi (`Content-Manager -> Collection Types -> User`), récupéré les credentials de l'utilisateur 1j1s avec role formulaire pour renseigner la variable d'environnement `STRAPI_AUTH` du projet 1j1s-front
4. lancé meilisearch et renseigné la master key avec la même valeur que la variable d'env `MEILISEARCH_API_KEY`
   Exemple : pour - `MEILI_MASTER_KEY=${MEILI_MASTER_KEY:-masterKey}` dans `docker-compose.yml` du projet 1j1s-main-cms -> il faut avoir `MEILISEARCH_API_KEY=masterKey` dans `.env` du projet 1j1s-front
5. indexé les collections du CMS via le plugin Meilisearch = cocher les collections à indexer (logements, offre de stages, fiches metiers...) sur interface Strapi
6. Ajouter la ligne suivante au fichier `/etc/hosts` :
```
127.0.0.1       minio
```

## L'écosystème 1j1s

* [Projet CMS](https://github.com/DNUM-SocialGouv/1j1s-main-cms)
* [Projet chargement de données](https://github.com/DNUM-SocialGouv/1j1s-stage-orchestrateur-transform-load)
* [Projet test de performances](https://github.com/DNUM-SocialGouv/1j1s-test-charge)
* [Projet test lighthouse automatisé](https://github.com/DNUM-SocialGouv/1j1s-front-lighthouse-report)
