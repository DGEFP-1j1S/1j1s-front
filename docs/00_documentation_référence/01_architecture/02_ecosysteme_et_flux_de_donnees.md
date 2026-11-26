# L'écosystème 1j1s et le flux de données

_S'adresse à un PO ou un dev qui doit situer le front parmi les briques voisines, et à un tech lead qui planifie. Dernière revue : 31 juillet 2026._

Après lecture, le lecteur qui découvre saura nommer les cinq composants vivants de la plateforme et dire où circule la donnée entre eux. Le lecteur qui décide saura de quelles briques le front dépend au moment d'un incident ou d'une évolution, et lesquelles vivent dans un dépôt voisin qu'il faudra ouvrir séparément.

---

## 0. Glossaire (à lire d'abord)

Chaque terme est glosé ici une seule fois ; le reste du document y renvoie.

| Terme | Sens dans ce document |
| --- | --- |
| **Front** | L'application `1j1s-front`, le site public rendu par Next.js. C'est le point de vue de ce document. |
| **CMS** | *Content Management System*, système de gestion de contenu. Ici Strapi, qui stocke le contenu éditorial et le sert par une API. |
| **Headless** | Un CMS sans pages à lui : il expose une API de données que d'autres applications (le front) consomment pour fabriquer les pages. |
| **ETL** | *Extract, Transform, Load*, extraire, transformer, charger. Le programme qui va chercher la donnée chez les partenaires, la met en forme, puis la dépose dans le CMS. |
| **CRON** | Planificateur de tâches : une commande s'exécute à heure fixe (par exemple tous les jours à 7h) sans intervention humaine. |
| **BFF** | *Back For Front*, la couche serveur intégrée au front (les routes `src/pages/api/**`) qui appelle les services externes pour le compte du navigateur. |
| **SSG / ISR / SSR** | Trois stratégies de rendu Next.js : page fabriquée au build (*Static Site Generation*), régénérée périodiquement à la demande (*Incremental Static Regeneration*), ou calculée à chaque requête (*Server Side Rendering*). Pour l'ISR, la page statique déjà publiée reste servie tant que son délai de régénération n'est pas écoulé. Détail de rendu hors périmètre ici. |
| **Meilisearch** | Moteur de recherche applicatif interrogé par le navigateur pour la recherche de stages et de logements. |
| **Elasticsearch** | Magasin de logs de la chaîne d'observation (ELK). Sans rapport avec la recherche du site. La distinction est développée en §4. |
| **ELK** | *Elasticsearch, Logstash, Kibana*, la chaîne d'agrégation des logs : Logstash reçoit, Elasticsearch stocke, Kibana visualise. |
| **MinIO** | Stockage d'objets compatible S3 (le protocole de stockage de fichiers d'Amazon). Sert de dépôt de fichiers bruts et transformés pour l'ETL. |
| **Redis** | Base clé/valeur en mémoire utilisée par le front comme cache serveur. |
| **Scalingo** | Plateforme d'hébergement (PaaS) française où tournent les applications, région `osc-fr1`. |
| **log drain** | Mécanisme Scalingo qui recopie automatiquement les logs HTTP d'une app vers un service externe, ici Logstash. |
| **OAuth** | Protocole de délégation d'accès : le front obtient un jeton pour appeler certaines API partenaires. |

---

## 1. Le problème : le front n'est qu'un maillon

Un développeur qui ouvre `1j1s-front` pour la première fois voit un site Next.js autonome. Cette impression est trompeuse et coûte cher au premier incident : quand une liste de stages est vide, la cause peut résider dans quatre briques que le front ne contient pas (l'ETL n'a pas ingéré le flux, le CMS n'a pas été alimenté, l'index Meilisearch est vide, ou l'API partenaire répond mal). Situer le front dans sa chaîne d'amont est le préalable à tout diagnostic et à tout chiffrage d'évolution.

Deux confusions récurrentes aggravent le risque et justifient à elles seules ce document :

1. **Meilisearch et Elasticsearch** portent des noms proches et sont tous deux des moteurs d'indexation, alors qu'ils occupent des rôles étrangers l'un à l'autre (recherche du site pour le premier, stockage des logs pour le second).
2. On croit souvent que **le front lit une base de données**. Le front atteint le contenu par une API HTTP, la recherche par un moteur applicatif, et son cache par Redis ; aucune base de données ne lui est directement accessible.

---

## 2. Le concept : une chaîne d'amont batch, un front temps réel

Le modèle mental tient en une phrase : la donnée arrive au front par **deux chemins de nature différente**, et le front lui-même ne possède aucun stockage de contenu.

**Chemin 1, la donnée lente (batch).** Elle vient de partenaires qui publient des fichiers (stages, logements, événements, formations). Un programme planifié, l'ETL, va les chercher à heure fixe, les nettoie, les range dans un stockage de fichiers (MinIO), puis les charge dans le CMS (Strapi), qui devient la **source de vérité du contenu**. Le CMS synchronise au passage un moteur de recherche (Meilisearch) pour que le site puisse chercher vite. Cette chaîne se compte en heures : un flux ingéré ce matin apparaît sur le site après le prochain passage de l'ETL et l'indexation.

**Chemin 2, la donnée vive (temps réel).** Certaines données changent trop souvent pour un cache de plusieurs heures (offres d'emploi, alternances, adresses). Le front les appelle directement, à chaque requête utilisateur, sur des API gouvernementales et partenaires (France Travail, La Bonne Alternance, API Adresse, etc.). Aucun stockage intermédiaire : la couche serveur du front (le BFF) interroge l'API, éventuellement met le résultat en cache dans Redis, et répond.

**Le front comme assembleur.** Le front réunit ces deux chemins pour fabriquer les pages. Il tire le contenu éditorial et les offres ingérées du CMS, la recherche de Meilisearch, les données vives des API externes, et il mémorise ce qui peut l'être dans Redis. Le contenu, lui, est produit et détenu ailleurs.

Le détail service par service (endpoints, authentification, variables d'environnement) vit dans `./03_integrations_externes.md`. Le présent document se limite à l'articulation et au sens de la circulation.

---

## 3. Les mécanismes

### 3.1 Les cinq composants vivants

| Composant | Dépôt | Rôle vu du front | Nature d'exécution |
| --- | --- | --- | --- |
| **Le site** | `1j1s-front` | L'application elle-même : rend les pages, expose le BFF | Service web Next.js 14 (Pages Router) |
| **Le contenu** | `1j1s-main-cms` | Source de vérité du contenu éditorial et des offres ingérées ; expose une API REST au front | Service web Strapi (CMS headless) |
| **L'ingestion** | `1j1s-etl` | Alimente le CMS et l'index à partir des flux partenaires ; le front n'en dépend qu'indirectement | Tâches planifiées CRON, sans serveur web permanent |
| **Les logs** | `1j1s-logstash` + `1j1s-kibana` | Reçoivent les journaux du front, les stockent, les rendent consultables | Chaîne ELK : Logstash ingère, Elasticsearch stocke (service managé, sans dépôt applicatif), Kibana affiche |

Trois dépendances de service accompagnent le front sans être des dépôts applicatifs : **Meilisearch** (recherche), **Redis** (cache), et les **API externes** (données vives). Elles sont détaillées plus bas et dans `./03_integrations_externes.md`.

Les composants voisins (`1j1s-etl`, `1j1s-main-cms`, `1j1s-logstash`) possèdent chacun leur propre documentation dans leur dépôt. Ce document les cadre du point de vue du front ; leur fonctionnement interne se lit chez eux.

### 3.2 Le flux de données de bout en bout

```
  PARTENAIRES (flux batch, fichiers)          API GOUVERNEMENTALES (temps réel)
  JobTeaser, HelloWork, StageFR,              France Travail, La Bonne Alternance,
  ImmoJeune, StudApart, Onisep,               Onisep, Immersion Facile, EURES,
  Tous Mobilisés                              API Engagement, Adresse, Découpage,
        |                                     Établissements publics, Trajectoires Pro
        | va chercher (extract)                          |
        v                                                |
  +------------------+                                   |
  |   1j1s-etl       |  planifié par CRON                |
  |   NestJS         |                                   |
  +--------+---------+                                   |
        | écrit brut puis transformé                     |
        v                                                |
  +------------------+                                   |
  |     MinIO        |  stockage d'objets (compatible S3)|
  +--------+---------+                                   |
        | charge (load)                                  |
        v                                                |
  +------------------+   indexe le contenu   +-----------------+
  |  1j1s-main-cms   |---------------------->|   Meilisearch   |
  |  Strapi + PG     |  (plugin Strapi)      | moteur recherche|
  +--------+---------+                       +--------+--------+
        | API REST (contenu, offres)                  | recherche
        |                                             | (depuis le navigateur)
        v                                             v            v (temps réel)
  +-----------------------------------------------------------------------+
  |                        1j1s-front  (Next.js 14)                        |
  |                                                                       |
  |   Navigateur  <---->  couche serveur / BFF  <---->  Redis (cache)     |
  +----------------------------------+------------------------------------+
                                     | envoie ses journaux (log drain HTTP)
                                     v
                         +---------------------+      +-----------------+
                         |    1j1s-logstash    |----->|  Elasticsearch  |
                         |     (Logstash)      |      | (stockage logs) |
                         +---------------------+      +--------+--------+
                                                               |
                                                               v
                                                      +-----------------+
                                                      |   1j1s-kibana   |
                                                      | (consultation)  |
                                                      +-----------------+
```

Lecture du schéma : à gauche, la chaîne batch aboutit au CMS et à l'index ; à droite, le temps réel entre directement dans le front ; en bas, les journaux du front partent vers la chaîne ELK et ce flux sort du site sans revenir dans les pages. Dans le schéma, « PG » désigne PostgreSQL. Les noms de partenaires listés en tête proviennent de l'audit ETL et restent indicatifs, non revérifiés dans ce dépôt (voir `./03_integrations_externes.md` pour les API confirmées).

### 3.3 Détail des maillons, avec le piège de chacun

| Maillon | Ce qui circule | Sens | Piège à connaître |
| --- | --- | --- | --- |
| Partenaires vers ETL | Fichiers XML, JSON, ZIP (stages, logements, événements, formations) | Entrant, planifié | Latence en heures : un flux ingéré n'apparaît qu'au passage CRON suivant. Un partenaire muet donne un site à jour avec des données périmées, sans erreur visible. |
| ETL vers MinIO | Fichiers bruts puis transformés | Écriture | MinIO appartient à l'ETL. Le front n'y touche jamais. Son hébergement reste NON CONFIRMÉ (voir §5). |
| MinIO vers CMS | Contenu chargé (load) | Écriture | Le CMS est la source de vérité du contenu. Modifier un contenu se fait dans Strapi ou via l'ETL, en amont du front. |
| CMS vers Meilisearch | Indexation des contenus | Synchronisation | L'indexation est déclenchée par un plugin côté CMS. Le front ne pilote pas l'indexation ; il lit l'index. |
| CMS vers front | Contenu éditorial et offres, en API REST | Lecture par le front | Un contenu invisible sur le site alors qu'il existe dans Strapi pointe souvent vers le cache CMS du front (Redis) ou vers une page ISR pas encore régénérée (l'ancienne version reste servie jusqu'au prochain cycle de régénération). |
| Meilisearch vers navigateur | Résultats de recherche stages/logements | Lecture directe par le navigateur | La recherche s'exécute **dans le navigateur** avec une clé publique, sans passer par le serveur du front. Le serveur du front n'est pas dans la boucle de recherche. |
| API externes vers front | Offres d'emploi, alternances, adresses, etc. | Lecture temps réel | Pas de cache long : la donnée est appelée à la requête. Une API partenaire lente ralentit la page correspondante. |
| Front vers Redis | Résultats d'API, jetons OAuth | Cache serveur | Cache optionnel : actif si `REDIS_URL` est renseignée, inerte sinon. Un cache froid n'est pas une panne. |
| Front vers Logstash | Journaux HTTP | Sortant | Ces logs partent vers Elasticsearch. Ils n'ont aucun effet sur le contenu rendu. |

### 3.4 Les trois dépendances directes du front

Vérifiées dans le code de ce dépôt :

- **Strapi (contenu).** Le front s'authentifie auprès de l'API Strapi par jeton : le couple `login:password` (variable `STRAPI_AUTH`) part sur la route `/auth/local` de Strapi, qui renvoie un JWT ensuite transmis en en-tête `Authorization: Bearer`. Configuration dans `src/server/cms/configuration/strapi/strapiHttpClient.config.ts:7` et `:10` (lecture de `STRAPI_AUTH` et `STRAPI_URL_API`) ; échange du jeton dans `src/server/cms/configuration/strapi/strapiTokenAgent.ts:15` à `:24` ; en-tête posé dans `src/server/services/http/authenticatedHttpClient.service.ts:106`.
- **Meilisearch (recherche).** Le client de recherche est instancié côté navigateur dans `src/client/dependencies.container.ts:1` (import `instantMeiliSearch`) et `:151`, avec l'URL et la clé lues en `:142` et `:143` depuis `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL` et `..._API_KEY`. Le préfixe `NEXT_PUBLIC_` signifie que ces valeurs sont exposées au navigateur, ce qui confirme que la recherche s'exécute côté client.
- **Redis (cache).** Le cache serveur est câblé conditionnellement dans `src/server/configuration/dependencies.container.ts:268` à `:272` : `RedisCacheService` si `REDIS_URL` est non vide, `NullCacheService` sinon. L'implémentation ouvre une connexion `ioredis` dans `src/server/services/cache/redisCache.service.ts:10`.

---

## 4. Limites et pièges

### 4.1 Piège n°1 : Meilisearch n'est pas le moteur des logs

Les deux moteurs coexistent dans l'écosystème et remplissent des fonctions séparées.

| | Meilisearch | Elasticsearch |
| --- | --- | --- |
| **Rôle** | Moteur de recherche applicatif du site (stages, logements) | Magasin des journaux de la chaîne ELK |
| **Qui l'interroge** | Le navigateur de l'utilisateur, directement | Kibana, pour l'exploitation |
| **Alimenté par** | Le CMS Strapi (plugin d'indexation) | Le front et l'ETL (log drain via Logstash) |
| **Rapport avec le contenu du site** | Direct : c'est la recherche visible | Aucun : purement observation technique |
| **Présence dans le front** | `src/client/dependencies.container.ts` (client de recherche) | Aucune ; le front y envoie des logs sans jamais les lire |

Conséquence : une recherche du site cassée relève de Meilisearch et de l'indexation CMS. Une remontée de logs cassée relève de Logstash et d'Elasticsearch. Confondre les deux fait chercher au mauvais endroit.

### 4.2 Piège n°2 : le front ne parle à aucune base de données

Le contenu paraît « stocké dans le front » parce qu'il s'affiche instantanément. Le câblage réel : contenu par l'API Strapi, recherche par Meilisearch, cache par Redis, données vives par HTTP depuis les API externes. Aucun pilote de base de données relationnelle ou documentaire n'est présent dans ses dépendances (vérifié : `package.json` du front ne déclare ni `pg`, ni `mysql`, ni `mongodb`, ni `prisma`, ni un ORM ; les seuls clients de stockage déclarés sont `ioredis@5`, utilisé pour le cache, et un `redis@4.7.1` résiduel jamais importé dans `src/`).

La base PostgreSQL de la plateforme appartient au CMS Strapi (dépôt `1j1s-main-cms`), qui l'expose au front sous forme d'API. Le front ne connaît PostgreSQL ni par une connexion ni par une configuration.

Conséquence pratique : pour changer un contenu, on agit dans Strapi ou dans l'ETL ; le front se contente de servir ce contenu. Pour accélérer un affichage, on agit sur le cache Redis, la stratégie de rendu, ou l'API en amont, selon le maillon en cause.

### 4.3 Latence et cohérence

La donnée batch a une fraîcheur bornée par la fréquence CRON de l'ETL et par le cache CMS du front. La donnée temps réel est fraîche à la requête, au prix de la latence de l'API partenaire. Un même écran peut donc mélanger du contenu vieux de quelques heures et du contenu de la seconde. Ce mélange est normal et guide le diagnostic : « donnée figée » oriente vers la chaîne batch, « donnée lente ou en erreur intermittente » oriente vers une API temps réel.

---

## 5. Certitude

### 5.1 Confirmé dans le code de ce dépôt (`1j1s-front`)

| Affirmation | Source (chemin:ligne) |
| --- | --- |
| Le front s'authentifie auprès de Strapi par JWT (`login:password` échangés sur `/auth/local`, jeton transmis en `Bearer`) | `strapiHttpClient.config.ts:7,10` ; `strapiTokenAgent.ts:15-24` ; `authenticatedHttpClient.service.ts:106` |
| La recherche Meilisearch s'exécute côté navigateur, clé publique | `src/client/dependencies.container.ts:1,142,143,151` |
| Cache Redis serveur, actif si `REDIS_URL` sinon désactivé | `src/server/configuration/dependencies.container.ts:268-272` ; `src/server/services/cache/redisCache.service.ts:10` |
| Aucun pilote de base de données dans le front ; clients de stockage : `ioredis` (cache) et un `redis@4.7.1` résiduel non importé | `package.json` (dépendances) |
| Front `3.361.0`, Next `14.2.35`, Node `22.22.0`, npm `11.8.0` | `package.json` (`version`, `dependencies.next`, `engines`) |

### 5.2 Porté par l'audit d'infrastructure, non revérifié dans ce dépôt

Ces faits proviennent de l'audit Scalingo et des dépôts voisins (`1j1s-main-cms`, `1j1s-etl`, `1j1s-logstash`). Ils n'ont pas été rejoués ici, faute d'accès aux dépôts frères depuis ce répertoire de travail. Leur source d'origine est le fichier nommé, à ouvrir dans le dépôt concerné pour confirmation.

Légende de la colonne « Niveau audit » : 🟢 code/CI = attesté par un fichier versionné ou par la chaîne d'intégration continue (CI) ; 🟡 inféré = déduit, non vu directement.

| Affirmation | Niveau audit | Source d'origine à ouvrir |
| --- | --- | --- |
| L'ETL tourne en CRON, sans serveur web permanent | 🟢 code/CI | `1j1s-etl/terraform/app.tf`, `1j1s-etl/cron.json` |
| Le CMS Strapi s'appuie sur PostgreSQL | 🟢 code/CI | `1j1s-main-cms/terraform/app.tf` |
| Le CMS synchronise Meilisearch via un plugin | 🟢 code/CI | `1j1s-main-cms/config/meilisearch/index.ts` |
| Elasticsearch sert uniquement au stockage des logs ELK | 🟢 code/CI | `1j1s-logstash/logstash.conf`, `1j1s-logstash/terraform/log-manager.tf` |
| Le front et l'ETL drainent leurs logs vers Logstash | 🟢 code/CI | `1j1s-front/terraform/front.tf` (bloc `log_drains`) |

### 5.3 NON CONFIRMÉ

- **Hébergement de Meilisearch** : absent de l'infrastructure décrite en code (fichiers Terraform `*.tf`) clonée lors de l'audit (aucune ressource `meilisearch` dans ces fichiers des dépôts examinés). Le front le consomme (confirmé), son lieu d'exécution reste NON CONFIRMÉ.
- **Hébergement de MinIO** : même situation, absent de l'infrastructure as code clonée. NON CONFIRMÉ.
- **Statut *live* réel des apps hors `1j1s-front-prod`** : la clé d'API Scalingo de l'audit ne voyait qu'une seule application. L'état d'exécution des autres (CMS, ETL, ELK) est NON CONFIRMÉ tant que l'accès Scalingo n'est pas étendu.

---

## 6. Ce que ça change

**Au premier diagnostic d'un contenu manquant ou périmé**, remonter la chaîne dans l'ordre plutôt que fouiller le front : API partenaire (temps réel) ou passage ETL (batch) ? puis CMS Strapi (le contenu existe-t-il ?), puis index Meilisearch (est-il synchronisé ?), puis cache Redis et stratégie de rendu du front. Le front est le dernier maillon à suspecter pour un problème de donnée.

**Au chiffrage d'une évolution**, identifier d'abord le dépôt cible. Un nouveau champ éditorial touche `1j1s-main-cms` (modèle Strapi) puis le front (affichage). Une nouvelle source de flux touche `1j1s-etl` (extraction, transformation, chargement) puis, en cascade, l'index et le front. Une nouvelle API temps réel touche le front seul (BFF). Une évolution qui « ne concerne que le front » est rare ; la reconnaître évite de sous-estimer la charge.

**Pour le tech lead qui planifie l'exploitation**, deux zones d'ombre appellent une action avant tout incident sérieux : documenter l'hébergement de Meilisearch et de MinIO (critiques et absents de l'infrastructure as code), et étendre l'accès Scalingo pour confirmer l'état réel des applications voisines. Ces deux points sont détaillés en §5.3.

**Pour tout travail sur une brique voisine**, ouvrir la documentation de son dépôt. Ce document cadre l'écosystème vu du front ; il ne se substitue pas aux docs internes de l'ETL, du CMS et de la chaîne ELK.

---

## Questions ouvertes pour la nouvelle équipe

- **Où tournent Meilisearch et MinIO ?** Absents de l'infrastructure as code auditée. Retrouver leur déclaration (addon Scalingo, service managé, autre) et l'ajouter à la doc d'infrastructure.
- **Quelles applications Scalingo tournent réellement, et lesquelles sont facturées à vide ?** À trancher après extension des droits Scalingo. Des environnements de recette ou d'anciens CMS oubliés peuvent subsister.
- **Le client Meilisearch résiduel de l'ETL doit-il être supprimé ou activé ?** L'audit signale une classe cliente Meilisearch dans l'ETL sans variable d'environnement ni injection. L'indexation passe aujourd'hui par le plugin Strapi du CMS. Statut à clarifier côté ETL.

---

## 7. Pour aller plus loin (fichiers qui font foi)

- `./03_integrations_externes.md` : catalogue des services externes consommés par le front (endpoints, authentification, variables d'environnement, modes mock).
- `../00_produit/` : ce que fait le produit et pour qui, si le contexte fonctionnel manque.
- `src/server/configuration/dependencies.container.ts` : câblage serveur du front (cache, clients CMS et API).
- `src/client/dependencies.container.ts` : câblage navigateur du front (client de recherche Meilisearch).
- `package.json` du front : versions et dépendances de stockage effectives.
- Dépôts voisins pour leur fonctionnement interne : `1j1s-etl`, `1j1s-main-cms`, `1j1s-logstash`, `1j1s-kibana`, chacun avec sa propre documentation.
