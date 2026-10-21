---

Ce document recense l'ensemble des services externes consommés par les quatre dépôts de la plateforme 1j1s. Il est destiné à l'onboarding, aux audits de sécurité et à la compréhension des flux de données.

Portée : `1j1s-front`, `1j1s-etl`, `1j1s-main-cms`, `1j1s-logstash`.

Dernière revue : 2026-04-24.

## 1. Vue d'ensemble des flux

```
                  ┌────────────────────────────────────────────────────────┐
                  │                    Partenaires externes                │
                  │  (France Travail, LBA, Onisep, Tous Mobilisés, etc.)   │
                  └────────────────────────────────────────────────────────┘
                              │                               │
                   flux batch │                               │ API temps réel
                              ▼                               │
                      ┌───────────────┐                       │
                      │   1j1s-etl    │                       │
                      │    NestJS     │                       │
                      └───────┬───────┘                       │
                              │                               │
                writeback     │                               │
                              ▼                               │
                    ┌──────────────────┐                      │
                    │      MinIO       │                      │
                    │  (S3-compatible) │                      │
                    └────────┬─────────┘                      │
                             │                                │
                    load     ▼                                │
                   ┌────────────────────┐                     │
                   │   1j1s-main-cms    │                     │
                   │    Strapi + PG     │                     │
                   └─────────┬──────────┘                     │
                             │                                │
                  API CMS    │     indexation                 │
                             │          │                     │
                             ▼          ▼                     ▼
                      ┌───────────────────────────────────────────┐
                      │              1j1s-front              │
                      │             Next.js 14 (Pages)            │
                      └──────────────────┬────────────────────────┘
                                         │
                                         ▼ log drain HTTP
                                ┌────────────────────┐
                                │   1j1s-logstash    │
                                │  → Elasticsearch   │
                                └────────────────────┘
```

## 2. Récapitulatif global

| Service | Catégorie | Front | ETL | CMS | Logstash |
| --- | --- | --- | --- | --- | --- |
| France Travail | API métier | X |  |  |  |
| La Bonne Alternance | API métier | X |  |  |  |
| API Alternance | API métier | X |  |  |  |
| API Trajectoires Pro | API métier | X |  |  |  |
| Onisep | API métier | X | X |  |  |
| Immersion Facile | API métier | X |  |  |  |
| API Engagement | API métier | X |  |  |  |
| API Adresse | API métier | X |  |  |  |
| API Découpage Administratif | API métier | X |  |  |  |
| API Établissements Publics | API métier | X |  |  |  |
| EURES | API métier | X |  |  |  |
| Tous Mobilisés | API métier |  | X |  |  |
| HelloWork | Flux partenaire |  | X |  |  |
| JobTeaser | Flux partenaire |  | X |  |  |
| StageFr | Flux partenaire |  | X |  |  |
| ImmoJeune | Flux partenaire |  | X |  |  |
| StudApart | Flux partenaire (FTP) |  | X |  |  |
| Strapi CMS | Plateforme interne | X | X | / |  |
| MinIO | Object storage |  | X | X | X |
| PostgreSQL | Base de données |  |  | X |  |
| Meilisearch | Moteur de recherche | X |  | X |  |
| Redis | Cache | X |  |  |  |
| Elasticsearch | Stockage logs |  |  |  | X |
| Scalingo | PaaS |  |  |  | X |
| Tipimail | Email transactionnel | X |  |  |  |
| Sendmail | Email local |  |  | X |  |
| FilR (Nextcloud) | WebDAV export |  | X |  |  |
| Sentry | Monitoring | X | X | X |  |
| Eulerian | Analytics | X |  |  |  |
| Matomo | Analytics | X |  |  |  |
| Tarte au Citron | Consentement RGPD | X |  |  |  |
| Adform | Marketing | X |  |  |  |
| LinkedIn Insight | Marketing | X |  |  |  |
| YouTube | CDN média | X |  |  |  |
| Cloudinary | CDN image | X |  |  |  |
| DigitalOcean Spaces | CDN fichier | X |  |  |  |
| Cegedim Cloud Storage | CDN image | X |  |  |  |
| GitHub | CI/CD |  |  |  | X |

## 3. 1j1s-front-fork (Next.js 14)

### 3.1 APIs métier gouvernementales et partenaires

| Service | Usage | Fichier d'intégration | Variables d'env | Endpoint de référence | Auth |
| --- | --- | --- | --- | --- | --- |
| France Travail | Recherche offres emploi, métiers stages 3e/2de | `src/server/offres/configuration/france-travail/franceTravailHttpClient.config.ts` | `API_FRANCE_TRAVAIL_OFFRES_URL`, `API_FRANCE_TRAVAIL_REFERENTIEL_URL`, `FRANCE_TRAVAIL_CONNECT_CLIENT_ID`, `FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET`, `FRANCE_TRAVAIL_CONNECT_SCOPE`, `FRANCE_TRAVAIL_CONNECT_URL`, `API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE` | `https://api.francetravail.io/partenaire/offresdemploi/v2/` | OAuth2 Client Credentials |
| La Bonne Alternance | Recherche alternances, formations, métiers | `src/server/formations/configuration/api-la-bonne-alternance/apiLaBonneAlternanceHttpClient.config.ts` | `API_LA_BONNE_ALTERNANCE_URL`, `API_LA_BONNE_ALTERNANCE_CALLER`, `API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE` | `https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/` | Aucune |
| API Alternance | Données alternances (complémentaires LBA) | `src/server/alternances/infra/repositories/apiAlternance/apiAlternance.config.ts` | `API_ALTERNANCE_URL`, `API_ALTERNANCE_TOKEN` | Variable | Bearer token |
| API Trajectoires Pro | Statistiques formations apprentissage | `src/server/formations/configuration/api-trajectoires-pro/apiTrajectoiresProHttpClient.config.ts` | `API_TRAJECTOIRES_PRO_URL`, `API_TRAJECTOIRES_PRO_CLIENT_ID`, `API_TRAJECTOIRES_PRO_CLIENT_SECRET`, `API_TRAJECTOIRES_PRO_API_KEY` | `https://trajectoires-pro-recette.apprentissage.beta.gouv.fr/api/` | OAuth2 + API Key |
| Onisep | Formations initiales (prod authentifiée, dev publique) | `src/server/formations-initiales/configuration/httpClient/apiOnisepAuthenticatedHttpClient.config.ts`, `apiOnisepPublicHttpClient.config.ts` | `API_ONISEP_BASE_URL`, `API_ONISEP_ACCOUNT_EMAIL`, `API_ONISEP_ACCOUNT_PASSWORD`, `API_ONISEP_APPLICATION_ID` | `https://api.opendata.onisep.fr/api/1.0` | HTTP Basic + header `Application-ID` |
| Immersion Facile | Stages 3e et 2de | `src/server/stage-3e-et-2de/configuration/stage-3e-et-2de/stage3eEt2deHttpClient.config.ts` | `API_IMMERSION_FACILE_STAGE_3EME_URL`, `API_IMMERSION_FACILE_STAGE_3EME_API_KEY` | `https://staging.immersion-facile.beta.gouv.fr/api/v2` | Header `Authorization` |
| API Engagement | Missions de bénévolat | `src/server/engagement/configuration/api-engagement/apiEngagementHttpClient.config.ts` | `API_ENGAGEMENT_BASE_URL`, `API_ENGAGEMENT_API_KEY_TOKEN` | `https://api.api-engagement.beta.gouv.fr/v0/` | Header `apiKey` |
| API Adresse | Autocomplétion d'adresses | `src/server/localisations/configuration/adresse/adresseHttpClient.config.ts` | `API_ADRESSE_BASE_URL`, `NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH` | `https://api-adresse.data.gouv.fr/` | Aucune |
| API Découpage Administratif | Communes, régions | `src/server/localisations/configuration/geo/geoHttpClient.config.ts` | `API_GEO_BASE_URL` | `https://geo.api.gouv.fr/` | Aucune |
| API Établissements Publics | Annuaire services publics | `src/server/etablissement-accompagnement/configuration/etablissementPublic/etablissementPublicHttpClient.config.ts` | `API_ETABLISSEMENTS_PUBLICS` | `https://api-lannuaire.service-public.fr/api/explore/v2.1` | Aucune |
| EURES | Emplois en Europe (XML) | `src/server/emplois-europe/configuration/apiEures/apiEuresPublicHttpClient.config.ts` | `API_EURES_BASE_URL`, `API_EURES_IS_MOCK_ACTIVE` | `https://webgate.acceptance.ec.europa.eu/eures-api/output/api/v1/jv/` | Aucune |

### 3.2 Plateforme interne

| Service | Usage | Fichier d'intégration | Variables d'env | Endpoint | Auth |
| --- | --- | --- | --- | --- | --- |
| Strapi CMS | Contenu éditorial (articles, FAQ, offres CMS) | `src/server/cms/configuration/strapi/strapiHttpClient.config.ts` | `STRAPI_BASE_URL`, `STRAPI_URL_API`, `STRAPI_AUTH`, `STRAPI_MEDIA_URL`, `STRAPI_MEDIA_PROTOCOL`, `DUREE_VALIDITE_CACHE_CMS_EN_SECONDES` | `http(s)://host/api` | HTTP Basic (`login:password` via `STRAPI_AUTH`) |
| Meilisearch | Recherche temps réel stages, logements | `src/client/dependencies.container.ts`, `src/pages/api/stages/index.controller.ts` | `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL`, `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY`, `NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE`, `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT` | Port 7700 par défaut | API Key header |
| Redis | Cache serveur (tokens OAuth, résultats API) | `src/server/services/cache/redisCache.service.ts` | `REDIS_URL` | Variable | Credentials dans URL |
| Tipimail | Emails transactionnels (formulaires de contact) | `src/server/mail/configuration/tipimail/tipimailHttpClient.config.ts` | `TIPIMAIL_API_BASE_URL`, `TIPIMAIL_API_KEY`, `TIPIMAIL_API_USER`, `MAILER_SERVICE_ACTIVE`, `MAILER_SERVICE_REDIRECT_TO` | `https://api.tipimail.com/v1/` | Headers `X-Tipimail-ApiKey`, `X-Tipimail-ApiUser` |

### 3.3 Monitoring

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| Sentry | Erreurs front et back | `next.config.js` (lignes 94 à 111), `src/server/services/pinoLogger.service.ts` | `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, `NEXT_PUBLIC_SENTRY_LOG_LEVEL`, `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_URL` | DSN |
| Pino + pino-sentry | Logger structuré avec remontée Sentry | `src/server/services/pinoLogger.service.ts` | (utilise le DSN Sentry) | DSN |

### 3.4 Analytics et marketing

Tous ces services sont chargés sous conditions via des feature flags côté client (`src/client/services/`).

| Service | Usage | Fichier d'intégration | Variables d'env |
| --- | --- | --- | --- |
| Eulerian | Analytics comportementale | `src/client/services/analytics/eulerian/eulerian.analytics.service.ts` | `NEXT_PUBLIC_ANALYTICS_EULERIAN_FEATURE` |
| Matomo | Analytics comportementale | `src/client/services/analytics/matomo/matomo.analytics.service.ts` | `NEXT_PUBLIC_ANALYTICS_MATOMO_FEATURE`, `NEXT_PUBLIC_ANALYTICS_MATOMO_SITE_ID`, `NEXT_PUBLIC_ANALYTICS_MATOMO_HOST`, `NEXT_PUBLIC_ANALYTICS_MATOMO_CUSTOM_JS_PATH` |
| Matomo Tag Manager | Gestion des tags | `src/client/services/analytics/matomoTagManager/matomoTagManager.analytics.service.ts` | `NEXT_PUBLIC_ANALYTICS_MATOMO_TAG_MANAGER_FEATURE`, `NEXT_PUBLIC_ANALYTICS_MATOMO_TAG_MANAGER_CUSTOM_JS_PATH` |
| Tarte au Citron | Consentement cookies (RGPD) | `src/client/services/cookies/tarteaucitron/tarteAuCitron.cookies.service.ts` | `NEXT_PUBLIC_TARTE_AU_CITRON_FEATURE` |
| Adform | Tracking campagnes | `src/client/services/marketing/adform/adform.marketing.service.ts` | `NEXT_PUBLIC_CAMPAGNE_ADFORM_FEATURE` |
| LinkedIn Insight | Pixel conversion LinkedIn | `src/client/services/marketing/linkedin/linkedin.marketing.service.ts` | (Partner ID en dur) |

### 3.5 Médias externes (domaines whitelistés)

Configuration dans `next.config.js` (`images.remotePatterns`).

| Domaine | Usage |
| --- | --- |
| `img.youtube.com` | Miniatures vidéos campagnes |
| `res.cloudinary.com` | Images logements (variable `LOGEMENT_IMAGE_URL_LIST`) |
| `jeveuxaider.fra1.digitaloceanspaces.com` | Fichiers API Engagement |
| `cos-njord-dgefp-1j1s-integ.storage-eb4.cegedim.cloud` | Images logements |
| `jedonnemonavis.numerique.gouv.fr` | Bouton enquête satisfaction |

## 4. 1j1s-etl (NestJS)

### 4.1 Sources (Extract)

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| Tous Mobilisés | Flux événements (JSON) | `apps/evenements/src/extraction/infrastructure/gateway/client/tous-mobilises-basic-flow-http.client.ts` | `EVENTS_TOUS_MOBILISES_FLUX_URL`, `EVENTS_TOUS_MOBILISES_AUTH_URL`, `EVENTS_TOUS_MOBILISES_CLIENT_ID`, `EVENTS_TOUS_MOBILISES_CLIENT_SECRET`, `EVENTS_TOUS_MOBILISES_SCOPE` | OAuth2 Client Credentials |
| Onisep | Flux formations initiales (XML) | `apps/formations-initiales/src/extraction/infrastructure/gateway/client/onisep-flow-http.client.ts` | `FORMATIONS_INITIALES_ONISEP_FLUX_URL`, `FORMATIONS_INITIALES_ONISEP_NAME`, `FORMATIONS_INITIALES_ONISEP_RAW_FILE_EXTENSION` | Aucune |
| HelloWork | Flux stages (XML) | `apps/stages/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository.ts` | `INTERNSHIPS_HELLOWORK_FLUX_URL`, `INTERNSHIPS_HELLOWORK_NAME`, `INTERNSHIPS_HELLOWORK_RAW_FILE_EXTENSION` | Aucune |
| JobTeaser | Flux stages (XML) | `apps/stages/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository.ts` | `INTERNSHIPS_JOBTEASER_FLUX_URL`, `INTERNSHIPS_JOBTEASER_NAME`, `INTERNSHIPS_JOBTEASER_RAW_FILE_EXTENSION` | Aucune |
| StageFr (compressé et non compressé) | Flux stages (XML, 2 variantes) | `apps/stages/src/extraction/infrastructure/gateway/repository/minio-http-flow.repository.ts` | `INTERNSHIPS_STAGEFR_COMPRESSED_FLUX_URL`, `INTERNSHIPS_STAGEFR_UNCOMPRESSED_FLUX_URL`, `INTERNSHIPS_STAGEFR_COMPRESSED_NAME`, `INTERNSHIPS_STAGEFR_UNCOMPRESSED_NAME` | Aucune |
| ImmoJeune | Flux logements (JSON) | `apps/logements/src/extraction/infrastructure/gateway/client/housing-basic-flow-http.client.ts` | `HOUSING_IMMOJEUNE_URL`, `HOUSING_IMMOJEUNE_NAME`, `HOUSING_IMMOJEUNE_RAW_FILE_EXTENSION` | Aucune |
| StudApart | Flux logements (FTP, archives ZIP) | `apps/logements/src/extraction/infrastructure/gateway/client/studapart/studapart-ftp-flow.client.ts` | `HOUSING_STUDAPART_URL`, `HOUSING_STUDAPART_USERNAME`, `HOUSING_STUDAPART_PASSWORD`, `HOUSING_STUDAPART_NAME` | FTP Basic (user/password) |

### 4.2 Stockage intermédiaire (Transform)

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| MinIO | Buckets par flux : raw, latest, history | `apps/shared/src/index.ts`, `apps/*/src/*/infrastructure/gateway/repository/*-minio*.ts` | `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_URL`, `MINIO_PORT`, `MINIO_USE_SSL` | Access Key + Secret Key |

### 4.3 Destinations (Load)

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| Strapi CMS | Load des 4 ressources (stages, événements, logements, formations initiales) | `apps/shared/src/infrastructure/gateway/client/strapi/strapi-http-client.ts`, `apps/*/src/*/infrastructure/gateway/client/*strapi*.ts` | `STRAPI_BASE_URL`, `STRAPI_AUTHENTICATION_URL`, `STRAPI_USERNAME`, `STRAPI_PASSWORD`, `STRAPI_OFFRE_DE_STAGE_URL`, `STRAPI_EVENEMENT_URL`, `STRAPI_FORMATION_INITIALE_URL`, `STRAPI_CEJ_ENDPOINT` | Basic Auth puis Bearer token (OAuth2) |
| FilR (Nextcloud) | Export CSV des contacts CEJ | `apps/gestion-des-contacts/src/infrastructure/gateway/repository/http-minio-contact-cej.repository.ts` | `CONTACTS_MANAGEMENT_CEJ_FILR_URL`, `CONTACTS_MANAGEMENT_FILR_USERNAME`, `CONTACTS_MANAGEMENT_FILR_PASSWORD`, `CONTACTS_MANAGEMENT_CEJ_MINIO_BUCKET_NAME`, `CONTACTS_MANAGEMENT_CEJ_MINIO_DAYS_AFTER_EXPIRATION` | Basic Auth |

### 4.4 Monitoring

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| Sentry | Erreurs et traces des jobs | `apps/*/src/*/infrastructure/configuration/logger*.ts` (via `pino-sentry`) | `SENTRY_DSN` | DSN |

## 5. 1j1s-main-cms (Strapi)

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| PostgreSQL | Stockage principal du contenu | `config/database.ts` | `DATABASE_URL`, `DATABASE_SSL` | Credentials dans URL |
| MinIO | Provider upload (médias et uploads) | `config/minio/index.ts`, `package.json` (`@strapi/provider-upload-*`) | `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_ENDPOINT`, `MINIO_BUCKET` | Access / Secret keys |
| Meilisearch | Indexation de 4 content types (`annonce-logement`, `evenement`, `fiche-metier`, `offre-stage`) | `config/meilisearch/index.ts` | `PLUGIN_MEILISEARCH_URL`, `PLUGIN_MEILISEARCH_API_KEY` | API Key |
| Sentry | Monitoring Strapi | `config/sentry/index.ts` | `SENTRY_DSN`, `SENTRY_ENVIRONMENT` | DSN |
| Sendmail | Emails Strapi (plugin `@strapi/provider-email-sendmail`) | `package.json`, `config/config-sync/core-stores-config-files-to-exclude.ts` (ligne 62) | Aucune (système local) | Local |

## 6. 1j1s-logstash

| Service | Usage | Fichier d'intégration | Variables d'env | Auth |
| --- | --- | --- | --- | --- |
| Elasticsearch | Stockage logs HTTP (indices journaliers `1j1s-YYYY.MM.dd`, rétention 180 jours) | `logstash.conf` (output), `curator.yml`, `launch_curator.sh` | `SCALINGO_ELASTICSEARCH_URL` (parsé en `ELASTICSEARCH_HOST`, `ELASTICSEARCH_USER`, `ELASTICSEARCH_PASSWORD`) | Basic Auth (URL-encoded) |
| Scalingo | PaaS d'hébergement, log drain des apps 1j1s | `terraform/log-manager.tf` | `SCALINGO_API_TOKEN`, `SCALINGO_REGION`, `SCALINGO_POSTGRESQL_URL`, `SCALINGO_ELASTICSEARCH_URL` | API token |
| MinIO (backend Terraform) | Stockage du state Terraform (S3-compatible) | `terraform/versions.tf` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_ENDPOINT` | Access / Secret keys |
| GitHub | Intégration CI/CD (auto-deploy sur `main`, plan sur PR) | `terraform/log-manager.tf` (bloc `github_integration`) | Token managé côté Scalingo | OAuth (géré par Scalingo) |

## 7. Annexes

### 7.1 Modes mock disponibles (front)

Trois APIs peuvent être mockées pour le développement et les tests :

| Service | Variable |
| --- | --- |
| France Travail | `API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE` |
| La Bonne Alternance | `API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE` |
| EURES | `API_EURES_IS_MOCK_ACTIVE` |

### 7.2 Services déclarés mais non actifs

| Dépôt | Service | Statut |
| --- | --- | --- |
| 1j1s-etl | Meilisearch (`apps/shared/src/infrastructure/gateway/client/meilisearch-indexing.client.ts`) | Classe cliente implémentée, aucune variable d'env associée, aucune injection dans les modules NestJS. Candidate à la suppression ou à l'activation explicite. |
| 1j1s-main-cms | `@strapi/provider-upload-aws-s3` | Présent dans `package.json`, non configuré (MinIO est utilisé comme provider upload). |

### 7.3 Services sous feature flag (front)

Tous les services analytics et marketing sont conditionnés par une variable `NEXT_PUBLIC_*_FEATURE`. Activation ciblée par environnement (recette, production).

### 7.4 Services externes redirigés (hors intégration technique)

Ces cibles sont référencées côté front uniquement via des liens ou variables d'URL, sans appel API :

| Service | Variable | Usage |
| --- | --- | --- |
| Je donne mon avis | `NEXT_PUBLIC_ENQUETE_SATISFACTION_URL`, `NEXT_PUBLIC_ENQUETE_SATISFACTION_FEATURE` | Enquête satisfaction |
| Les Entreprises S'Engagent | `NEXT_PUBLIC_LES_ENTREPRISES_S_ENGAGENT_URL` | Lien partenaire |
| Portail Stages de Seconde | `NEXT_PUBLIC_DEPOT_STAGES_SECONDE_URL`, `NEXT_PUBLIC_STAGES_SECONDE_URL`, `NEXT_PUBLIC_STAGES_SECONDE_HOMEPAGE_URL` | Portail externe dépôt et consultation |

### 7.5 Matrice des modes d'authentification

| Mode | Services concernés |
| --- | --- |
| OAuth2 Client Credentials | France Travail, Trajectoires Pro (partiel), Strapi (ETL), Tous Mobilisés |
| HTTP Basic | Strapi (front), Onisep, StudApart FTP, FilR, Elasticsearch |
| Bearer token | API Alternance |
| API Key (header personnalisé) | Engagement, Trajectoires Pro, Immersion Facile, Tipimail, Meilisearch |
| Access / Secret keys | MinIO, backend S3 Terraform |
| DSN | Sentry |
| Aucune | API Adresse, Découpage Administratif, Établissements Publics, EURES, LBA, HelloWork, JobTeaser, StageFr, ImmoJeune, Onisep (flux ETL) |

## 8. Maintenance de ce document

Sources à grepper lors d'une revue :

- Front : `src/server/**/configuration/**/*HttpClient.config.ts`, `src/client/services/`, `next.config.js`, `.env.sample`.
- ETL : `apps/**/infrastructure/gateway/client/**`, `apps/**/infrastructure/gateway/repository/**`, `.env.example`.
- CMS : `config/*/index.ts`, `package.json` (plugins `@strapi/*`), `.env.scalingo`.
- Logstash : `logstash.conf` (blocs `input`, `output`), `curator.yml`, `terraform/*.tf`.

Mettre à jour la date de revue en en-tête à chaque modification.
