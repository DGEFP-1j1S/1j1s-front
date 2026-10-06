# Comptes de services externes et présence au vault

> Objet : pour chaque service que le site 1jeune1solution appelle en production, ce document dit si le service est hébergé par nous ou par un tiers, quel secret nous détenons, et si ce secret est sauvegardé dans le coffre-fort de l'équipe.
> Date du relevé : 2026-07-31. Aucune valeur de secret n'est reproduite ici.

## À lire avant le tableau

Le **coffre-fort** (« vault ») est l'instance Vaultwarden de la Fabrique : `vaultwarden.fabrique.social.gouv.fr`. On y range les mots de passe et clés de l'équipe.

Un secret peut y être rangé de deux façons. Soit dans un **item à son nom** (par exemple l'entrée « France Travail »). Soit à l'intérieur d'une **note ENV**, un item qui regroupe en vrac toutes les variables d'un service. Il en existe deux principales : « ENV PROD FRONT » (les variables du site) et « ENV PROD BACK » (les variables du CMS Strapi). Un secret sans entrée à son nom vit dans une de ces notes.

Colonne **Type** : *Externe* désigne un service géré par un tiers, sur lequel nous avons seulement un compte. *Interne* désigne ce que nous déployons et opérons nous-mêmes sur notre hébergeur Scalingo.

## Tableau

| Service | Type | Secret que nous détenons | Sauvegardé dans le coffre-fort ? |
|---|---|---|---|
| France Travail | Externe | Identifiants OAuth (client id + secret) | Oui : item « France Travail » et note ENV du front |
| API Engagement (bénévolat) | Externe | Clé API | Oui : item « Tableau de bord API Engagement » et note ENV du front |
| Tipimail (emails) | Externe | Clé API + utilisateur | Oui : item « Tipimail » et note ENV du front |
| Meilisearch (moteur de recherche, service cloud `edge.meilisearch.com`) | Externe | Clé API | Oui : item « Meilisearch Recette/Prod » et notes ENV |
| API Alternance | Externe | Jeton | Oui, mais seulement dans la note ENV du front (pas d'entrée à son nom) |
| InserJeunes (statistiques formations, ex Trajectoires Pro) | Externe | Login + mot de passe | Oui, mais seulement dans la note ENV du front |
| Onisep (formations) | Externe | Mot de passe + identifiant d'application | Oui, mais seulement dans la note ENV du front |
| Immersion Facile (stages 3e et 2de) | Externe | Clé API | Oui, mais seulement dans la note ENV du front |
| Stockage des médias (Cegedim, compatible S3) | Externe | Clé d'accès + clé secrète | Oui, mais seulement dans la note ENV du back (CMS) |
| Sentry (suivi des erreurs, instance Fabrique) | Externe | Jeton d'authentification (le DSN, lui, est public par nature) | Oui : notes ENV du front et du back |
| GitHub (rapports Lighthouse en intégration continue) | Externe | Jeton d'application GitHub | **Non, introuvable au coffre-fort** (sans doute côté intégration continue) |
| Eulerian (mesure d'audience) | Externe | Aucun secret serveur (script chargé dans le navigateur) | Oui : item « Eulerian » |
| Matomo (mesure d'audience, instance Fabrique) | Externe | Aucun (identifiant de site public) | Oui : item « Matomo » |
| EURES (emplois en Europe) | Externe | Aucun (API publique) | Oui : item « Eures R7 » |
| Adform (marketing) | Externe | Aucun (identifiant public, désactivé en production) | Non, rien à stocker |
| LinkedIn Insight (marketing) | Externe | Aucun (identifiant partenaire public) | Non, rien à stocker |
| La Bonne Alternance, API Adresse, API Découpage administratif, Annuaire service-public | Externe | Aucun (API publiques sans authentification) | Sans objet, rien à stocker |
| Strapi (le CMS éditorial) | Interne | Login + mot de passe, et clés internes du CMS | Oui : items « Strapi Prod » et « Strapi Recette », et note ENV du back |
| PostgreSQL (base du CMS) | Interne | URL contenant les identifiants | Oui : note ENV du back |
| Redis (cache du site) | Interne | URL contenant les identifiants | Oui : note ENV du front |

En résumé : les onze comptes de services tiers qui détiennent un secret l'ont sauvegardé au coffre-fort, sauf un, le jeton GitHub de Lighthouse.

## Ce qu'il reste à trouver

1. **Le jeton GitHub Lighthouse.** C'est le seul secret externe absent du coffre-fort. Vérifier s'il se trouve dans les secrets GitHub Actions du dépôt ou dans l'application Scalingo `1j1s-front-lighthouse-report`, puis décider s'il doit rejoindre le coffre-fort.
2. **La recette et le staging.** Seules les valeurs de production ont été relevées. La note « ENV STAGING FRONT » n'a pas été ouverte. Les comptes de test sont parfois distincts (Onisep, Immersion Facile), à vérifier.
3. **Le contenu réel des items.** Leur présence est confirmée par leur nom, pas par leur contenu, car les lignes n'ont pas été ouvertes. Reste à confirmer que chacun contient bien le secret courant.
4. **Le reste de la plateforme.** L'ETL (StudApart en FTP, Tous Mobilisés, l'export FilR) et Logstash (Elasticsearch, stockage Terraform) n'ont pas encore été comparés au coffre-fort.

Le coffre-fort contient aussi des items d'exploitation sans lien avec le code du site (Cloudflare, certificats SSL, jeton Scalingo, Browserstack, StatusCake, KeePass, FilR). Ils relèvent de l'infrastructure, pas des credentials applicatifs.

## Rapport avec l'ancienne cartographie

Ce document corrige sur quatre points la cartographie plus ancienne [`matière_première/Carto_service_externes.md`](matière_première/Carto_service_externes.md), déjà reflétés dans le tableau ci-dessus : Meilisearch est un service cloud tiers et non une brique interne ; Trajectoires Pro est devenu InserJeunes avec une authentification par login et mot de passe ; Sentry et Matomo sont des instances hébergées par la Fabrique ; la variable `BUCKET_S3_URL` pointe en production sur le bucket public d'API Engagement.
