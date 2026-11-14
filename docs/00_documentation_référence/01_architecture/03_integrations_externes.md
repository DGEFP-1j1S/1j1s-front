# Les integrations externes du front

_S'adresse a un dev qui branche ou debugge une integration, et une personne d'astreinte qui cherche la cause d'une panne. Derniere revue : 31 juillet 2026._

Apres lecture, le dev sait quel fichier de configuration ouvrir pour brancher un service et comment il s'authentifie ; la personne d'astreinte sait a quel tiers imputer une panne et si le service peut etre remplace par une donnee simulee (« mock ») pour isoler le fautif.

Glossaire minimal, gloses reprises a chaque premiere apparition dans le corps :
- **Mock** : donnee de test servie a la place de l'appel reseau reel, pour developper ou reproduire un bug hors ligne.
- **Feature flag** : variable d'environnement qui active ou desactive un comportement sans redeploiement de code, ici du type `NEXT_PUBLIC_*_FEATURE`.
- **BFF** (back for front) : la couche API interne du front (`src/pages/api/**`) que le navigateur appelle, et qui appelle a son tour les services externes cote serveur.
- **DSN** (data source name) : URL d'identification d'un projet Sentry, publique par nature, qui dit ou envoyer les erreurs.

## 1. Le probleme

Le front parle a une vingtaine de services tiers. Trois questions reviennent en boucle et coutent cher quand la reponse manque :
- **En astreinte** : une page emploi renvoie une erreur. La cause est chez France Travail, dans notre cache serveur Redis (voir 3.2), ou dans le CMS Strapi (voir 3.2) ? Sans carte des tiers et de leurs frontieres de responsabilite, le diagnostic part dans toutes les directions.
- **En developpement** : brancher un nouveau partenaire suppose de deviner ou vit sa configuration, quel mode d'authentification il attend, et quelle variable d'environnement le nourrit. Le depot suit une convention stricte ; la connaitre supprime la devinette.
- **Pour tester sans reseau** : trois APIs se remplacent par des donnees simulees via un flag. Savoir lesquelles, et par quelle variable, permet de reproduire un bug hors ligne ou de faire tourner la CI sans quota partenaire.

Ce document repond aux trois. La responsabilite des pannes internes d'un partenaire reste chez le partenaire : voir `../00_produit/` pour le perimetre metier, et le principe de non remontee des erreurs partenaires dans notre monitoring.

## 2. Le concept

### 2.1 Deux classes de client HTTP, une seule difference

Tout appel serveur sortant passe par l'une de deux classes. La difference tient a la presence, ou non, d'un jeton a rafraichir.

```
                      PublicHttpClientService
                      (axios + apiHeaders statiques)
                               ▲
                               │  extends
                               │
                      AuthenticatedHttpClientService
                      (ajoute un TokenAgent → header Authorization,
                       + rejeu sur 401/403/500 qui rafraichit le jeton)
```

- **`PublicHttpClientService`** porte un client axios et des en-tetes statiques optionnels (`apiHeaders`). Il couvre les APIs sans jeton dynamique : soit publiques (aucun en-tete), soit a cle fixe passee en en-tete. Source : `src/server/services/http/publicHttpClient.service.ts`.
- **`AuthenticatedHttpClientService`** etend la precedente et ajoute un **`TokenAgent`**, objet dont l'unique methode `getToken()` produit un jeton attache en en-tete `Authorization`. Un intercepteur rejoue la requete apres rafraichissement du jeton sur reponse 401, 403 ou 500 (Strapi renvoie 403 et 500 sur defaut d'auth, `:77`, `:78`). Source : `src/server/services/http/authenticatedHttpClient.service.ts:18` (classe), `:10` (interface `TokenAgent`), `:27` a `:42` (rejeu), `:76` a `:80` (codes declencheurs).

Consequence directe pour l'astreinte : un service « authentifie » peut tomber pour une raison de jeton (identifiants revoques, endpoint OAuth du partenaire en panne) que jamais un service public ne connaitra. La classe du client oriente le diagnostic.

### 2.2 Le TokenAgent encapsule la facon d'obtenir le jeton

Chaque service authentifie fournit son propre `TokenAgent`. La mecanique d'obtention varie, la surface reste identique (`getToken()`).

| TokenAgent | Comment il obtient le jeton | Source |
|---|---|---|
| `FranceTravailTokenAgent` | OAuth2 client credentials : `client_id` + `client_secret` + `scope` contre `/connexion/oauth2/access_token?realm=partenaire` | `src/server/offres/configuration/france-travail/franceTravailHttpClient.config.ts:10` |
| `ApiTrajectoiresProTokenAgent` | `client_id` + `client_secret` dans le corps `x-www-form-urlencoded`, `api_key` en en-tete `X-omogen-api-key`, POST sur `/auth/token` | `src/server/formations/configuration/api-trajectoires-pro/apiTrajectoiresProHttpClient.config.ts:9`, corps `apiTrajectoiresProTokenAgent.ts:46` a `:58` |
| `ApiAlternanceTokenAgent` | Jeton statique lu en configuration, restitue tel quel comme Bearer | `src/server/alternances/infra/repositories/apiAlternance/apiAlternance.config.ts:12` |
| `OnisepTokenAgent` | POST `email` + `password` sur `/login`, recupere un `token` en reponse | `src/server/formations-initiales/configuration/tokenAgent/onisepTokenAgent.ts:17` |
| `StrapiTokenAgent` | POST `identifier` + `password` sur `/auth/local`, recupere un JWT | `src/server/cms/configuration/strapi/strapiTokenAgent.ts:15` |

### 2.3 La convention de configuration

Chaque integration serveur pose un fichier sous `src/server/<module>/configuration/**` (ou `.../infra/repositories/**` pour l'exception API Alternance) nomme `*HttpClient.config.ts` ou `*.config.ts`. Ce fichier exporte une fonction `getApi<Service>Config(configurationService)` qui lit les variables d'environnement et retourne soit un `PublicHttpClientConfig`, soit un `AuthenticatedHttpClientConfig`. Les fonctions ne lisent jamais `process.env` en direct : elles passent par `configurationService.getConfiguration()`, dont le typage vit dans `src/server/services/serverConfiguration.service.ts`.

Le cablage final (choix de la classe de client, choix du repository reel ou mock) se fait dans un unique conteneur d'injection : `src/server/configuration/dependencies.container.ts` cote serveur, `src/client/dependencies.container.ts` cote navigateur.

### 2.4 Analytics et marketing : services cote navigateur sous flag

Les services de mesure d'audience et de marketing s'instancient cote navigateur dans `src/client/dependencies.container.ts`, hors des classes HTTP serveur, chacun sous condition d'un feature flag `NEXT_PUBLIC_*_FEATURE`. Flag absent ou a `0` laisse le service inerte ; le mecanisme de repli varie selon le service (repli sur un `Null*Service`, simple non instanciation, ou garde interne, voir 3.4).

## 3. Les mecanismes

Note de lecture sur les endpoints : les URL ci-dessous sont celles configurees dans les fichiers d'environnement du depot (`.env.local`, `.env.test`). Pour plusieurs partenaires (La Bonne Alternance, API Alternance, Trajectoires Pro, Immersion Facile, EURES) ces valeurs pointent sur des environnements de recette, de staging ou d'acceptance. Les valeurs de production sont injectees par variables d'environnement sur l'hebergeur Scalingo et n'existent pas dans le depot. Colonne « point d'attention » : le piege propre a chaque service.

### 3.1 APIs metier gouvernementales et partenaires

| Service | Usage | Fichier de configuration | Auth | Endpoint configure (dev/test) | Point d'attention |
|---|---|---|---|---|---|
| **France Travail** | Offres emploi, jobs etudiants, jobs d'ete, referentiels | `src/server/offres/configuration/france-travail/franceTravailHttpClient.config.ts:6` | OAuth2 client credentials | `https://api.francetravail.io/partenaire/offresdemploi/v2/offres` (`.env.local:31`) | Un seul flag mock couvre emploi + jobs etudiants + jobs d'ete (voir 3.6) |
| **La Bonne Alternance** (LBA) | Formations et metiers de l'alternance | `src/server/formations/configuration/api-la-bonne-alternance/apiLaBonneAlternanceHttpClient.config.ts:4` | Aucune | `https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/` (`.env.local:42`) | Endpoint de recette en local. LBA n'est jamais mockee ; le flag « alternance » mock, lui, agit sur API Alternance (voir 3.6) |
| **API Alternance** | Offres d'alternance | `src/server/alternances/infra/repositories/apiAlternance/apiAlternance.config.ts:4` | Bearer (jeton statique) | `https://api-recette.apprentissage.beta.gouv.fr/api/` (`.env.local:46`) | Seul fichier de config hors `**/configuration/**` (il vit sous `infra/repositories`). Jeton sans rotation automatique |
| **Trajectoires Pro** | Statistiques d'insertion des formations | `src/server/formations/configuration/api-trajectoires-pro/apiTrajectoiresProHttpClient.config.ts:7` | OAuth2 client credentials + `api_key` | `https://trajectoires-pro-recette.apprentissage.beta.gouv.fr/api/` (`.env.local:50`) | L'inventaire des comptes externes (`../comptes_services_externes_vault.md`, pointeur vers le coffre-fort Vaultwarden) le dit renomme « InserJeunes » avec login et mot de passe ; le code, lui, utilise encore `client_id`/`client_secret`/`api_key` (voir section 5) |
| **Onisep** | Formations initiales | Prod : `src/server/formations-initiales/configuration/httpClient/apiOnisepAuthenticatedHttpClient.config.ts:5` ; dev : `apiOnisepPublicHttpClient.config.ts:4` | Prod : login (`email`/`password`) + en-tete `Application-ID`. Dev : aucune | `https://api.opendata.onisep.fr/api/1.0` (`.env.local:24`) | Le choix authentifie/public depend de `ENVIRONMENT === 'production'` (`dependencies.container.ts:327`). Un bug d'auth Onisep ne se reproduit donc pas en dev |
| **Immersion Facile** | Stages de 3e et de 2de | `src/server/stage-3e-et-2de/configuration/stage-3e-et-2de/stage3eEt2deHttpClient.config.ts:4` | En-tete `authorization` (cle statique) | `https://staging.immersion-facile.beta.gouv.fr/api/v2` (`.env.local:21`) | Endpoint de staging en local. La cle passe dans l'en-tete `authorization`, sans schema Bearer |
| **API Engagement** | Missions de benevolat | `src/server/engagement/configuration/api-engagement/apiEngagementHttpClient.config.ts:4` | En-tete `apiKey` (cle statique) | `https://api.api-engagement.beta.gouv.fr/v0/` (`.env.local:6`) | Nom d'en-tete non standard (`apiKey`), sensible a la casse cote partenaire |
| **API Adresse** | Autocompletion d'adresses | `src/server/localisations/configuration/adresse/adresseHttpClient.config.ts` | Aucune | `https://api-adresse.data.gouv.fr/` (`.env.local:2`) | Service public data.gouv, sans quota contractuel connu |
| **API Decoupage administratif** | Communes, regions, departements | `src/server/localisations/configuration/geo/geoHttpClient.config.ts` | Aucune | `https://geo.api.gouv.fr/` (`.env.local:10`) | Client mis en cache (`CachedHttpClientService`), utile a savoir en cas d'incoherence apres mise a jour cote geo |
| **API Etablissements publics** | Annuaire des services publics | `src/server/etablissement-accompagnement/configuration/etablissementPublic/etablissementPublicHttpClient.config.ts` | Aucune | `https://api-lannuaire.service-public.fr/api/explore/v2.1` (`.env.local:13`) | Variable d'env sans suffixe `_URL` : `API_ETABLISSEMENTS_PUBLICS` |
| **EURES** | Emplois en Europe (XML) | `src/server/emplois-europe/configuration/apiEures/apiEuresPublicHttpClient.config.ts:4` | Aucune | `https://webgate.acceptance.ec.europa.eu/eures-api/output/api/v1/jv/` (`.env.local:16`) | Endpoint d'acceptance (Commission europeenne) en local. Mockable (voir 3.6) |

### 3.2 Plateforme interne

| Service | Usage | Fichier de configuration | Auth | Point d'attention |
|---|---|---|---|---|
| **Strapi CMS** | Contenu editorial (articles, FAQ, offres CMS) | `src/server/cms/configuration/strapi/strapiHttpClient.config.ts:6` (authentifie), `:19` (lecture publique) | Lectures publiques sans jeton ; ecritures via JWT obtenu sur `/auth/local` a partir de `login:password` empaquete dans `STRAPI_AUTH` | Deux configs coexistent : la lecture publique et la voie authentifiee. `STRAPI_AUTH` se decompose par `.split(':')` (`:7`) : un `:` manquant casse silencieusement l'auth |
| **Meilisearch** | Recherche temps reel des stages et logements | Cablage dans `src/client/dependencies.container.ts:142` | Cle API passee au client `instantMeiliSearch` | La cle vit cote navigateur (`NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY`), donc exposee : elle doit etre une cle de recherche a portee limitee a la lecture, distincte d'une cle d'admin (voir section 6). Absence de cle ou d'URL = exception au boot (`:145`) |
| **Redis** | Cache serveur (jetons OAuth, resultats d'API) | `src/server/services/cache/redisCache.service.ts:9` | Identifiants dans l'URL (`REDIS_URL`), client `ioredis` | Une panne Redis degrade la latence et peut relancer des flots d'appels partenaires (perte de cache), sans casser les pages |
| **Tipimail** | Emails transactionnels (formulaires de contact) | `src/server/mail/configuration/tipimail/tipimailHttpClient.config.ts:4` | En-tetes `X-Tipimail-ApiKey` + `X-Tipimail-ApiUser` | `MAILER_SERVICE_ACTIVE` coupe l'envoi ; `MAILER_SERVICE_REDIRECT_TO` detourne tous les mails vers une adresse unique (a verifier avant de croire un mail « perdu » en recette) |

### 3.3 Monitoring

| Service | Usage | Fichier(s) | Auth | Point d'attention |
|---|---|---|---|---|
| **Sentry** | Erreurs front et back, traces | Init : `sentry.server.config.ts`, `sentry.edge.config.ts`, `sentry.client.config.ts` (racine du depot). Build : `next.config.js` (`withSentryConfig`) | DSN pour l'envoi (`NEXT_PUBLIC_SENTRY_DSN`, public) ; jeton `SENTRY_*` pour l'upload des sourcemaps au build | Le DSN est public par nature. Le secret Sentry sert au build (upload sourcemaps), non a l'envoi d'erreurs |
| **Pino + pino-sentry** | Logger structure qui remonte a Sentry | `src/server/services/pinoLogger.service.ts:39` | Reutilise le DSN Sentry | Le pont vers Sentry est le flux `pino-sentry` (`:29` a `:46`). Une erreur logguee cote serveur remonte par ce canal, non par le SDK navigateur |

### 3.4 Analytics et marketing (sous feature flag, cote navigateur)

Tous instancies dans `src/client/dependencies.container.ts` ou via un `<script>` conditionnel dans `src/pages/_document.page.tsx`. Un flag absent laisse le service inerte.

| Service | Usage | Fichier de service | Flag reel (verifie dans le code) | Point d'attention |
|---|---|---|---|---|
| **Eulerian** | Mesure d'audience | `src/client/services/analytics/eulerian/eulerian.analytics.service.ts` | `NEXT_PUBLIC_ANALYTICS_EULERIAN_FEATURE === '1'` (script : `_document.page.tsx:43` ; garde interne : `eulerian.analytics.service.ts:99`) | Le service s'instancie toujours (`dependencies.container.ts:137`) ; la garde du flag est interne au service |
| **Matomo** | Mesure d'audience | `src/client/services/analytics/matomo/matomo.analytics.service.ts` | `NEXT_PUBLIC_ANALYTICS_MATOMO_FEATURE === '1'` (`dependencies.container.ts:129`) | Instance hebergee par la Fabrique numerique des ministeres sociaux (`fabrique.social.gouv.fr`, voir `../comptes_services_externes_vault.md`). Identifiant de site public |
| **Matomo Tag Manager** | Gestion des tags | `src/client/services/analytics/matomoTagManager/matomoTagManager.analytics.service.ts` | `NEXT_PUBLIC_ANALYTICS_MATOMO_TAG_MANAGER_FEATURE === '1'` (`dependencies.container.ts:133`) | Flag distinct de Matomo « simple » : les deux s'activent independamment |
| **Tarteaucitron** | Consentement cookies (RGPD) | `src/client/services/cookies/tarteaucitron/tarteAuCitron.cookies.service.ts` | Aucun flag `NEXT_PUBLIC_*_FEATURE`. Gate reelle : `NODE_ENV === 'production'` (script `_document.page.tsx:37`, service `dependencies.container.ts:104`) | Le brouillon de cartographie d'origine (`../matière_première/Carto_service_externes.md`) annoncait `NEXT_PUBLIC_TARTE_AU_CITRON_FEATURE` : cette variable n'est consommee nulle part dans `src`, elle reste declaree dans `.env.scalingo:128` (voir section 5). Consentement actif en production seulement |
| **Adform** | Tracking de campagnes | `src/client/services/marketing/adform/adform.marketing.service.ts` | `NEXT_PUBLIC_CAMPAGNE_ADFORM_FEATURE === '1'` (`dependencies.container.ts:122`) | Aucun secret serveur (identifiant public) |
| **LinkedIn Insight** | Pixel de conversion | `src/client/services/marketing/linkedin/linkedin.marketing.service.ts` | Partage le flag d'Adform : `NEXT_PUBLIC_CAMPAGNE_ADFORM_FEATURE === '1'` (`dependencies.container.ts:125`) | Partner ID en dur : `'1489890'` (`linkedin.marketing.service.ts:6`). LinkedIn n'a pas de flag propre ; couper Adform le coupe aussi |

### 3.5 Matrice des modes d'authentification

Colonne « ce qui casse » : le symptome d'astreinte specifique au mode.

| Mode | Services | Ce qui casse quand l'auth tombe |
|---|---|---|
| **OAuth2 client credentials** | France Travail, Trajectoires Pro (+ `api_key`) | L'endpoint OAuth du partenaire renvoie une erreur au rafraichissement : identifiants revoques ou expires, ou realm indisponible. Toutes les requetes suivantes echouent en cascade |
| **Bearer (jeton statique)** | API Alternance | Jeton expire ou revoque cote partenaire, sans rotation automatique cote front |
| **Login vers jeton** | Onisep (prod), Strapi (ecritures) | Le POST de login echoue (mot de passe change, compte desactive) ; en prod uniquement pour Onisep |
| **Cle API en en-tete** | API Engagement (`apiKey`), Immersion Facile (`authorization`), Tipimail (`X-Tipimail-*`), Meilisearch | Cle invalide : 401/403 immediat, sans phase de rafraichissement |
| **Identifiants dans l'URL** | Redis | Connexion refusee : degradation du cache, pas d'erreur de page |
| **DSN** | Sentry (envoi) | Une panne ici prive de monitoring ; l'appli continue de tourner (voir 3.3) |
| **Aucune** | LBA, API Adresse, API Decoupage administratif, API Etablissements publics, EURES, Onisep (dev), Strapi (lectures) | Seule la disponibilite du tiers compte ; pas de cause d'auth possible |

### 3.6 Modes mock disponibles

Trois APIs se remplacent par un repository de donnees simulees, selectionne dans `src/server/configuration/dependencies.container.ts`. Chaque flag vaut `1` (actif) ou `0`/absent (appel reel), parse en booleen dans `src/server/services/serverConfiguration.service.ts:13,14,21`.

| Service mockable | Variable | Effet et portee | Source du branchement |
|---|---|---|---|
| **France Travail** | `API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE` | Substitue `MockOffreRepository` a trois repositories d'un coup : emploi, jobs etudiants, jobs d'ete | `dependencies.container.ts:291,296,301` |
| **La Bonne Alternance / alternance** | `API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE` | Malgre son nom, substitue `MockAlternanceRepository` a **API Alternance**, non a LBA. Les repositories LBA (formations, metiers) restent reels | `dependencies.container.ts:312` (un `// todo` du code releve deja l'ambiguite) |
| **EURES** | `API_EURES_IS_MOCK_ACTIVE` | Substitue `MockEmploiEuropeRepository` au repository EURES | `dependencies.container.ts:404` |

Aucun autre service (Strapi, Onisep, Immersion Facile, Engagement, etc.) n'a de mode mock cable : hors ligne, leurs pages dependent du tiers reel ou du CMS.

## 4. Limites et pieges

Pieges deja signales en colonne « point d'attention », rassembles ici pour l'astreinte :

- **Le flag mock « alternance » vise API Alternance, pas LBA.** Activer `API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE` ne simule pas les formations LBA. Piste de confusion classique. Source : `dependencies.container.ts:312`.
- **Onisep se comporte differemment selon l'environnement.** Authentifie en production, public en dev, sur decision `ENVIRONMENT === 'production'` (`dependencies.container.ts:327`). Un incident d'authentification Onisep ne se reproduit pas en local.
- **La plupart des endpoints partenaires en local pointent sur de la recette.** LBA, API Alternance, Trajectoires Pro, Immersion Facile et EURES visent des environnements de recette, de staging ou d'acceptance dans `.env.local`. Un comportement observe en local peut differer de la prod pour ces cinq services.
- **`STRAPI_AUTH` est un couple `login:password` empaquete.** Le code fait `.split(':')` (`strapiHttpClient.config.ts:7`). Une valeur sans `:` produit un login vide sans erreur explicite.
- **LinkedIn et Adform partagent un flag.** Couper `NEXT_PUBLIC_CAMPAGNE_ADFORM_FEATURE` desactive les deux (`dependencies.container.ts:122,125`).
- **La cle Meilisearch est cote navigateur.** `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY` est visible du client par construction : elle doit rester une cle de recherche.
- **StudApart passe en FTP, mais cote ETL, pas cote front.** Ce partenaire de logements n'est pas une integration du front ; il est extrait par le depot `1j1s-etl` en FTP. Ne pas le chercher dans `src/server` du front.

## 5. Certitude

### Confirme (sur le code, chemin:ligne cite dans le corps)

Existence et role des onze fichiers de configuration cites en 3.1 et 3.2, verifies par lecture directe (France Travail, LBA, API Alternance, Trajectoires Pro, Onisep authentifie et public, Immersion Facile, Engagement, EURES, Strapi, Tipimail). Les services publics sans auth (Adresse, Decoupage administratif, Etablissements publics) sont configures de meme, verifies par lecture directe de leur `*.config.ts`. Les deux classes de client HTTP et le mecanisme `TokenAgent`. Les trois flags mock et leurs points de branchement. Les flags reels des services analytics/marketing. Le Partner ID LinkedIn en dur. La gate Tarteaucitron sur `NODE_ENV`.

### NON CONFIRME

- **Trajectoires Pro contre InserJeunes.** L'inventaire des comptes externes (`../comptes_services_externes_vault.md`) affirme un renommage en « InserJeunes » avec authentification login et mot de passe. Le code du front, lui, configure encore `client_id` + `client_secret` + `api_key` sur `/auth/token` (`apiTrajectoiresProHttpClient.config.ts:9`). Lequel reflete la production reste NON CONFIRME : les valeurs de prod vivent sur Scalingo, hors du depot.
- **Endpoints de production.** Le depot ne contient que des valeurs de dev/test (`.env.local`, `.env.test`), en recette/staging/acceptance pour cinq partenaires. Les URL de prod, injectees sur Scalingo, ne sont pas verifiables depuis le code.
- **`NEXT_PUBLIC_TARTE_AU_CITRON_FEATURE`.** Annonce par le brouillon de cartographie d'origine (`../matière_première/Carto_service_externes.md`) comme flag de Tarteaucitron ; declaree dans `.env.scalingo:128` mais consommee nulle part dans `src` (hors tests). La gate reelle est `NODE_ENV === 'production'`. Son role de flag actif est donc NON CONFIRME (probablement obsolete).
- **Cle Meilisearch : recherche ou admin.** Le code passe `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY` au client navigateur ; que ce soit bien une cle de recherche restreinte n'est pas verifiable depuis le front.

### Questions ouvertes pour la nouvelle equipe

1. Reconcilier le nom (Trajectoires Pro / InserJeunes) et le mode d'auth reel en production.
2. Confirmer que la cle Meilisearch exposee cote navigateur est une cle de recherche a portee de lecture, distincte d'une cle d'administration.
3. Statuer sur le jeton statique d'API Alternance (`API_ALTERNANCE_TOKEN`) : politique de rotation, duree de vie.
4. Decider si le couplage LinkedIn/Adform sur un flag unique est voulu ou a decoupler.
5. Le jeton GitHub des rapports Lighthouse est absent du coffre-fort (voir `../comptes_services_externes_vault.md`) : le retrouver et decider de son rangement. Hors perimetre strict du front, mentionne pour tracabilite.

## 6. Ce que ca change

### Pour la personne d'astreinte : arbre de premiere localisation

```
Page en erreur ?
├─ Emplois / jobs etudiants / jobs d'ete  → France Travail (OAuth2)
│     jeton ? verifier l'endpoint OAuth partenaire et le couple client_id/client_secret (voir 2.2)
├─ Alternance (offres)                    → API Alternance (Bearer statique)
├─ Formations / metiers alternance        → LBA (public, recette en local)
├─ Statistiques d'insertion               → Trajectoires Pro (OAuth2 + api_key)
├─ Formations initiales                   → Onisep (authentifie en prod SEULEMENT)
├─ Stages 3e/2de                          → Immersion Facile (cle en-tete)
├─ Benevolat                              → API Engagement (cle apiKey)
├─ Recherche stages/logements lente       → Meilisearch, puis Redis (cache)
├─ Contenu editorial (articles, FAQ)      → Strapi (CMS, depot frere)
├─ Mail de contact non recu               → Tipimail ; verifier MAILER_SERVICE_ACTIVE
│                                            et MAILER_SERVICE_REDIRECT_TO
└─ Rien ne remonte dans Sentry            → DSN / pino-sentry, pas l'appli elle-meme
```

Reflexe : avant d'imputer une panne a un partenaire, verifier si le mode mock du service est actif (France Travail, alternance, EURES). Un mock actif par erreur en recette masque le vrai comportement.

### Pour le dev qui branche ou debugge

1. **Localiser** la config : `src/server/<module>/configuration/**/*.config.ts` (exception API Alternance sous `infra/repositories/`).
2. **Choisir la classe** : jeton dynamique a rafraichir → `AuthenticatedHttpClientConfig` avec un `TokenAgent` ; cle fixe ou service public → `PublicHttpClientConfig`.
3. **Declarer les variables** dans le typage `serverConfiguration.service.ts`, puis les renseigner dans `.env.local`.
4. **Cabler** le repository (et son eventuel mock) dans `src/server/configuration/dependencies.container.ts`.
5. **Pour les secrets** : leur presence au coffre-fort est cartographiee dans `../comptes_services_externes_vault.md` (voir l'encart securite). Les valeurs de prod vivent sur Scalingo, hors du depot versionne.

### Encart securite

Les comptes de services externes et leur presence au coffre-fort Vaultwarden sont documentes dans `../comptes_services_externes_vault.md`. Ce fichier est un pointeur : il donne le nom des items et des notes ENV, aucune valeur de secret. Regle absolue : ne recopier aucune valeur de secret, ni ici, ni ailleurs. Les noms de variables d'environnement cites dans ce document sont publics ; seules leurs valeurs sont des secrets.

## 7. Pour aller plus loin (fichiers qui font foi)

- **Classes de client HTTP** : `src/server/services/http/publicHttpClient.service.ts`, `src/server/services/http/authenticatedHttpClient.service.ts`.
- **Typage des variables d'environnement serveur** : `src/server/services/serverConfiguration.service.ts`.
- **Cablage serveur (repositories, mocks, choix Onisep prod/dev)** : `src/server/configuration/dependencies.container.ts`.
- **Cablage navigateur (analytics, marketing, cookies, Meilisearch)** : `src/client/dependencies.container.ts`, `src/pages/_document.page.tsx`.
- **Configs par service** : `src/server/**/configuration/**/*.config.ts` (plus `src/server/alternances/infra/repositories/apiAlternance/apiAlternance.config.ts`).
- **Sentry** : `sentry.server.config.ts`, `sentry.edge.config.ts`, `sentry.client.config.ts`, `next.config.js`, `src/server/services/pinoLogger.service.ts`.
- **Valeurs d'environnement locales** : `.env.local`, `.env.test` (dev/test uniquement ; prod sur Scalingo).
- **Comptes et coffre-fort** : `../comptes_services_externes_vault.md`.
- **Brouillon d'origine (cartographie multi depots)** : `../matière_première/Carto_service_externes.md`.
