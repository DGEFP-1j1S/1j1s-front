# Le produit 1jeune1solution

_S'adresse à un product owner ou à un nouvel arrivant qui ne connaît ni le service ni le code. Dernière revue : 31 juillet 2026._

Après lecture, le lecteur qui découvre saura répondre à « c'est quoi 1jeune1solution, pour qui, quelles familles de services ». Le lecteur qui doit décider saura où chaque famille puise ses données, ce que le site héberge vraiment par rapport à ce qu'il délègue à un partenaire, et vers quels documents descendre pour instruire un choix.

_Situe le lecteur_ : front Next.js 14 (dépôt `1j1s-front`), Node 22 ; numéros de version précis en section 5. Le contenu éditorial vient d'un CMS Strapi hébergé dans le dépôt frère `1j1s-main-cms` (sa version, non vérifiable depuis ce dépôt front, figure en section 5).

---

## 1. Le problème : pourquoi cette page existe

Un nouvel arrivant ouvre le code de `1j1s-front` et voit soixante-dix routes, des dizaines de connecteurs vers des API extérieures, des interrupteurs d'activation partout. Sans modèle mental du produit, il lit une mécanique dont il ignore l'intention, et chaque décision (prioriser un parcours, arbitrer une régression, estimer un chiffrage) repose alors sur des suppositions. Cette page pose le « pourquoi » du produit avant toute mécanique, pour que la lecture du reste du corpus ait un cadre.

## 2. Le concept : un service public qui oriente, en agrégeant

**1jeune1solution** est le service public numérique de l'État français pour l'insertion des jeunes, accessible sur [1jeune1solution.gouv.fr](https://www.1jeune1solution.gouv.fr/). Sa promesse s'affiche en haut de la page d'accueil : « À chacun sa solution ». Il s'adresse aux **jeunes de 15 à 30 ans** (formulation portée par le pied de page du site lui même, `src/client/components/layouts/Footer/Footer.tsx:40`), avec des dispositifs partenaires qui appliquent parfois leurs propres bornes d'âge (le Contrat Engagement Jeune vise plutôt les 16 à 25 ans, certains réseaux d'entrepreneuriat les 18 à 30 ans).

Le modèle mental utile tient en deux idées.

**Première idée : un guichet unique par thème de vie.** Un jeune qui cherche un emploi, un logement, une formation, une mission d'engagement ou un accompagnement trouve pour chaque thème une porte d'entrée sur un seul site, au lieu de connaître à l'avance quel opérateur public gère quoi.

**Seconde idée : un agrégateur orienteur.** Le site rassemble des offres produites par des partenaires (France Travail, La Bonne Alternance, Onisep, API Engagement, bailleurs sociaux, etc.), les présente dans une interface unifiée, puis renvoie très souvent l'utilisateur vers le partenaire pour l'action finale (candidater, déposer une offre, simuler une aide). Le site tient donc deux rôles : vitrine de recherche unifiée, et aiguilleur vers l'opérateur compétent. Deux preuves de code directes de ce rôle d'aiguilleur : la page « déposer une offre d'emploi » redirige vers l'espace recruteur de France Travail (`src/pages/emplois/deposer-offre/index.page.tsx`, cible `https://pro.francetravail.fr/depotoffrerecruteur/accueil`), et « créer mon CV » redirige vers Diagoriente (`src/pages/creer-mon-cv/index.page.tsx`, cible `https://diagoriente.fr/`).

Conséquence de ce modèle : le périmètre réellement hébergé par 1j1s (données stockées, formulaires traités côté 1j1s) est plus étroit que ce que l'utilisateur perçoit. Distinguer « hébergé » de « redirigé » est la grille de lecture qui structure la suite.

**Ordre de grandeur.** Le dépôt compte 72 fichiers de page (`find src/pages -name "*.page.tsx"`), dont 3 briques techniques du framework Next.js (`_app`, `_document`, `_error`) qui ne produisent aucune URL publique, soit 69 pages exposées à l'utilisateur. Retenir « environ 70 pages utilisateur » comme repère.

### Glossaire minimal (chaque terme glosé à sa première utilisation)

| Terme | Glose en trois mots | Où en savoir plus |
| --- | --- | --- |
| BFF | couche serveur maison, relaie les partenaires | code sous `src/server/`, cartographie des parcours |
| CMS Strapi | outil de gestion du contenu éditorial | dépôt frère `1j1s-main-cms` |
| Meilisearch | moteur de recherche interne | doc d'architecture du corpus |
| ETL | chaîne d'import des données partenaires | dépôt frère `1j1s-etl` |
| feature flag | interrupteur d'activation par variable d'environnement | document `../01_architecture/06_feature_flags_et_configuration.md` |

_Note pour le lecteur PO : « BFF » (back for front) désigne le code serveur de ce dépôt qui appelle les API des partenaires et met en forme leurs réponses pour l'écran, ce qui garde les clés d'API partenaires hors du navigateur et unifie des formats hétérogènes. La distinction technique entre modes d'affichage (statique, régénéré, dynamique, côté navigateur) relève de la doc d'architecture, pas de cette page._

## 3. Les mécanismes : les grandes familles de services

Neuf familles couvrent l'ensemble des parcours (regroupement propre à cette page, plus large que la taxonomie de la cartographie source). La colonne « Hébergé ou redirigé » applique la grille de la section 2 : elle dit où 1j1s porte une vraie responsabilité produit (recherche interne, formulaire traité), par rapport aux cas de vitrine avant renvoi vers le partenaire.

| Famille | Ce qu'elle apporte au jeune | D'où viennent les données | Hébergé ou redirigé (le point d'attention) |
| --- | --- | --- | --- |
| **Emplois et jobs** | offres d'emploi, jobs étudiants, jobs d'été, emplois en Europe | France Travail (anciennement Pôle Emploi), via le BFF | recherche et détail hébergés ; dépôt d'offre et création de CV redirigés (France Travail, Diagoriente) |
| **Alternance** | contrats d'alternance, entreprises qui recrutent | La Bonne Alternance, via le BFF | détail d'offre hébergé ; le menu principal renvoie souvent directement vers La Bonne Alternance |
| **Stages** | recherche de stages, dépôt d'offre par une entreprise, stages de 3e et 2de | offres stockées dans le CMS Strapi (chargées par l'ETL depuis des partenaires de stages), exposées via l'index Meilisearch | famille la plus hébergée : recherche interne et dépôt d'offre traités côté 1j1s |
| **Formation et orientation** | formations en apprentissage, formations initiales, fiches métiers, évènements de recrutement | La Bonne Alternance (apprentissage), Onisep (formations initiales et métiers), via le BFF | recherche et fiches hébergées ; lien vers la fiche complète du partenaire |
| **Engagement civique** | missions de service civique, missions de bénévolat | API Engagement, via le BFF | recherche et détail hébergés |
| **Logement** | annonces de logement, aides financières, conseils | annonces stockées dans le CMS Strapi (chargées par l'ETL depuis des bailleurs), recherche via Meilisearch | recherche d'annonces hébergée ; aides et conseils sont des pages éditoriales avec liens partenaires |
| **Accompagnement et aides** | structures d'accompagnement, Contrat Engagement Jeune, mentorat, simulateur d'aides, permis, entreprendre, Europe | API Établissements publics (structures), CMS et contenu statique pour le reste | recherche de structures et demande de contact CEJ hébergées ; beaucoup de pages sont des vitrines qui redirigent vers un simulateur ou une plateforme partenaire |
| **Employeurs** | recruter, proposer des immersions, devenir mentor, dispositif AFPR/POEI (aides France Travail à la formation avant embauche), rejoindre la mobilisation, espace employeur | contenu éditorial et formulaires ; connecteurs partenaires selon le parcours | pages d'atterrissage (landings) et formulaires de référencement traités côté 1j1s ; renvois vers La Bonne Alternance et plateformes partenaires |
| **Contenu éditorial et institutionnel** | accueil, actualités et articles, FAQ, pages légales, plan du site, annuaires de services | CMS Strapi | intégralement hébergé et servi par 1j1s |

Sources de code des origines de données, une par famille, pour ancrer la colonne « d'où viennent les données » :

- **Emplois et jobs** : `src/server/offres/configuration/france-travail/franceTravailHttpClient.config.ts`.
- **Alternance** : `src/server/alternances/configuration/la-bonne-alternance/laBonneAlternanceHttpClient.config.ts` ; renvoi menu vers La Bonne Alternance construit dans `src/shared/lbaLandingUrls.ts` (constantes `LBA_CANDIDAT_URL` et `LBA_RECRUTEUR_URL`, importées par `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx:3`).
- **Stages** : dépôt traité par le BFF (module `src/server/stages/`) ; recherche front sur un index Meilisearch nommé par la variable `NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE`.
- **Formation et orientation** : `src/server/formations/configuration/api-la-bonne-alternance/apiLaBonneAlternanceHttpClient.config.ts` (apprentissage) et `src/server/formations-initiales/configuration/httpClient/apiOnisepPublicHttpClient.config.ts` (Onisep).
- **Engagement civique** : `src/server/engagement/configuration/api-engagement/apiEngagementHttpClient.config.ts`.
- **Logement** : `src/server/logements/infra/strapiAnnonceDeLogement.repository.ts` (annonces lues depuis Strapi).
- **Accompagnement et aides** : `src/server/etablissement-accompagnement/configuration/etablissementPublic/etablissementPublicHttpClient.config.ts` (structures) ; demande de contact CEJ traitée par le module `src/server/demande-de-contact/`.
- **Contenu éditorial** : `src/server/cms/configuration/strapi/strapiHttpClient.config.ts` (client Strapi commun).

**Le détail parcours par parcours** (chaque URL, chaque étape de formulaire, chaque redirection externe, chaque point d'intégration de code) est traité dans le document compagnon `02_cartographie_des_parcours.md` du même dossier. La présente page reste au niveau macro.

## 4. Limites et pièges

**Le site codé n'égale pas le site affiché en production.** De nombreuses pages sont derrière un interrupteur d'activation (feature flag, variable `NEXT_PUBLIC_*`) : jobs d'été, emplois en Europe, stages de 3e et 2de, formations initiales, formations en apprentissage, annonces de logement, évènements, MyJobGlasses (plateforme partenaire d'échange avec des professionnels), permis, ancien espace jeune. Une page présente dans le code peut être invisible pour l'utilisateur si son flag est désactivé en production. Ne jamais déduire l'état de production de la seule présence d'une page dans `src/pages/`.

**La disponibilité dépend des partenaires.** Comme le site agrège des offres extérieures, une panne côté partenaire dégrade le parcours correspondant. Le code prévoit d'ailleurs une page de maintenance dédiée quand France Travail est indisponible (`src/pages/maintenance-france-travail/index.page.tsx`). La responsabilité des erreurs internes d'un partenaire reste chez ce partenaire, pas dans le monitoring de 1j1s.

**Des doublons éditoriaux existent.** Plusieurs landings coexistent autour d'un même sujet (par exemple `apprentissage`, `choisir-apprentissage`, `apprentissage-entreprises`), et deux annuaires de services se chevauchent (`espace-jeune` historique et `services-jeunes` successeur, pilotés par flag). Ces coexistences relèvent d'un mélange de choix éditorial et de dette ; leur cartographie fine est renvoyée au document `02_cartographie_des_parcours.md`.

**Cette page ne descend pas dans la technique.** Modes d'affichage, structure du BFF, configuration de Meilisearch, pipeline de l'ETL, gestion du cache : hors périmètre ici, traités dans la documentation d'architecture et d'exploitation du corpus.

## 5. Certitude : ce qui est confirmé et ce qui reste ouvert

**Confirmé sur le code de ce dépôt :**

- Public cible affiché « 15 à 30 ans » : `src/client/components/layouts/Footer/Footer.tsx:40`.
- Versions front, Node, npm : `package.json` (3.361.0 / 22.22.0 / 11.8.0).
- Origines de données par famille : fichiers de configuration listés en section 3.
- Rôle d'aiguilleur (redirections sortantes) : `src/pages/emplois/deposer-offre/index.page.tsx` et `src/pages/creer-mon-cv/index.page.tsx`.
- Comptage des pages : 72 fichiers `*.page.tsx`, 3 briques framework, 69 pages exposées (`find src/pages`).

**NON CONFIRME depuis ce dépôt :**

- Version du CMS Strapi (4.25.23) : donnée par la note d'écosystème `matière_première/ancienne_intro.md`, elle vit dans le dépôt frère `1j1s-main-cms`, hors de ce dépôt front.
- État réel en production de chaque feature flag : la présente page ne l'établit pas ; le document `../01_architecture/06_feature_flags_et_configuration.md` fait foi sur l'état de production.
- Chaîne amont des offres de stages et des annonces de logement : leur stockage dans le CMS Strapi et leur chargement par l'ETL vivent dans les dépôts frères `1j1s-main-cms` et `1j1s-etl`. Depuis ce dépôt front, seule la recherche via l'index Meilisearch est vérifiable.

**Point de divergence à connaître sur la source historique.** Le fichier `docs/docs/architecture/fonctionnalites.md`, daté du 12 juillet 2024, annonce en tête un public « de 13 à 30 ans » et coche une liste de fonctionnalités « en Production ». Deux réserves. D'une part la borne d'âge y diffère de celle affichée aujourd'hui par le site (15 à 30 ans dans le pied de page) : retenir 15 à 30 ans, valeur portée par l'interface elle même. D'autre part les cases « en Production » de ce fichier datent de juillet 2024 et ne reflètent pas l'état actuel des flags (voir `../01_architecture/06_feature_flags_et_configuration.md`). Les seize rubriques listées par ce fichier de 2024 (emplois, stages, alternance, jobs, formations, métiers, apprentissage, évènements, bénévolat, service civique, logement, CEJ, accompagnement, aides, dépôt d'offres, services employeurs) se répartissent sans reste dans les neuf familles de la section 3 : emplois, jobs et dépôt d'offres relèvent d'Emplois et jobs ; métiers, apprentissage et formations de Formation et orientation ; bénévolat et service civique d'Engagement civique.

## 6. Ce que ça change pour le lecteur

**Pour le product owner :** la grille « hébergé ou redirigé » de la section 3 est un outil de priorisation. Une régression sur une famille majoritairement hébergée (stages, contenu éditorial) est une responsabilité pleine de l'équipe 1j1s. Une anomalie sur une famille majoritairement redirigée (alternance depuis le menu, aides via simulateur externe) implique d'abord de qualifier si la cause est chez 1j1s ou chez le partenaire, avant d'ouvrir un chantier. Avant tout arbitrage sur le périmètre affiché, vérifier l'état des flags dans `../01_architecture/06_feature_flags_et_configuration.md` : raisonner sur le code seul conduit à sur-estimer ce que voit l'utilisateur.

**Pour le nouvel arrivant technique :** entrer dans le code par la famille, pas par la page isolée. Chaque famille a un module serveur dédié sous `src/server/` dont le sous dossier `configuration/` révèle le partenaire branché. L'arborescence du menu, source de vérité de ce qui est proposé et de ce qui sort vers l'extérieur, se lit dans `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx`.

## 7. Pour aller plus loin

**Documents compagnons du corpus :**

- `02_cartographie_des_parcours.md` (même dossier) : détail parcours par parcours, chaque URL, chaque redirection, points d'intégration de code.
- `../01_architecture/06_feature_flags_et_configuration.md` : autorité sur l'état de production réel des pages sous interrupteur d'activation.

**Fichiers de code qui font foi :**

- `src/pages/` : l'ensemble des routes utilisateur.
- `src/server/<module>/configuration/` : le connecteur partenaire de chaque famille.
- `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx` : arborescence du menu et sorties externes.
- `src/client/components/layouts/Footer/Footer.tsx` : mission et public cible.
- `package.json` : versions du front et de l'environnement d'exécution.

**Source historique à lire avec la réserve de la section 5 :** `docs/docs/architecture/fonctionnalites.md` (checklist de fonctionnalités datée de juillet 2024).
