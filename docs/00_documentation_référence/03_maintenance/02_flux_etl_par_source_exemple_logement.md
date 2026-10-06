# Le flux ETL par source, exemple du logement

_S'adresse a un dev ou un exploitant qui doit diagnostiquer pourquoi des annonces manquent, et un PO qui suit la sante d'un flux partenaire. Derniere revue : 31 juillet 2026._

Apres lecture, le dev ou l'exploitant sait **ou couper la chaine** pour localiser une disparition d'annonces (dépot partenaire, ETL, CMS, index, front) et quel signal regarder a chaque maillon. Le PO sait **quel evenement metier** fait chuter un volume et lequel justifie de contacter le partenaire.

## Glossaire minimal

Termes employes une fois, definis ici, repris ensuite sans redefinition.

- **ETL** : Extract, Transform, Load. Programme qui va chercher la donnee chez un partenaire (extract), la met au format interne (transform) et l'ecrit dans la base de contenu (load). Il vit dans le depot frere `1j1s-etl`, hors de ce depot front.
- **CMS Strapi** : la base de contenu editable, source de verite des annonces. Depot frere `1j1s-main-cms`.
- **Meilisearch** : moteur de recherche que le front interroge en direct pour la liste de resultats.
- **MinIO** : stockage de fichiers utilise par l'ETL comme zone tampon entre les etapes.
- **FTP / FTPS** : protocole de transfert de fichiers par lequel Studapart depose son catalogue. Le chiffrement TLS du canal reste NON CONFIRME : `Carto_studapart_immojeune.md` le donne en FTPS, `Carto_service_externes.md` en FTP simple (client `studapart-ftp-flow.client.ts`).
- **Cron** : tache planifiee qui s'execute a heure fixe.
- **Facette** : fonction Meilisearch qui renvoie le nombre d'annonces par valeur d'un champ (ici `source`), donc un comptage par partenaire lu directement dans l'index.

## 1. Le probleme

Une annonce de logement affichee sur 1jeune1solution.gouv.fr a voyage a travers cinq systemes avant d'atteindre l'ecran. Le front est le **dernier maillon** et il ne connait aucun des partenaires en tant que service : il lit des annonces deja chargees, portant une simple etiquette `source`. Quand un lot d'annonces disparait, la cause siege presque toujours **en amont du front**, dans un maillon que ce depot ne contient pas.

Consequence : diagnostiquer une disparition en fouillant le code front seul mene a une impasse. Il faut savoir a quel etage regarder. Ce document trace la chaine complete et marque, a chaque etage, ce qui est verifiable depuis ce depot et ce qui releve du depot ETL ou du CMS.

Deux partenaires alimentent la rubrique logements : **Immojeune** et **Studapart**. Ils sont agreges dans le meme moteur de recherche, sans filtre visible cote utilisateur permettant de choisir l'un ou l'autre (source : Carto_studapart_immojeune.md, matiere premiere ; comportement produit).

Ordre de grandeur mesure le 23 avril 2026 sur la base Strapi de production (mesure datee, non re-verifiee depuis) :

| Source    | Annonces exposees | Part du catalogue logements |
| --------- | ----------------- | --------------------------- |
| Immojeune | 69 838            | 92 %                        |
| Studapart | 5 743             | 8 %                         |

Studapart pese peu en volume tout en restant significatif : une livraison quotidienne vide ou tronquee retire 8 % du catalogue en moins de 24 h. Le mecanisme exact de cette disparition est detaille en section 4.

## 2. Le concept

Le modele mental tient en une phrase : **la donnee descend un escalier a cinq marches, et chaque marche a son propre mode de panne**.

```
   Partenaire (Studapart ou Immojeune)
        │  dépose son catalogue chaque nuit
        ▼
 [1]  FTP(S) : un ZIP posé sur un espace fichiers
        │  cron « extract »
        ▼
 [2]  ETL  (extract → transform → load)
        │  zone tampon MinIO : latest + historique
        ▼
 [3]  CMS Strapi : type « annonce-de-logement »
        │  diff avec l'existant → créer / mettre à jour / supprimer
        ▼
 [4]  Meilisearch : index « annonce-de-logement »
        │  poussé par le CMS
        ▼
 [5]  Front Next.js : liste via Meili, détail via Strapi
        │
        ▼
   Écran utilisateur
```

Trois idees portent tout le reste :

- **Le front est aval et aveugle a la source.** Il recoit une annonce deja normalisee, marquee `immojeune` ou `studapart`, et la traite de facon quasi interchangeable. Seule exception, le logo (section 3).
- **Le CMS est la source de verite.** L'index Meilisearch et les pages de detail derivent du CMS. Un ecart de volume se lit d'abord dans le CMS, l'index n'en est qu'une projection.
- **La suppression est une decision de l'ETL, calculee par difference.** A chaque nuit, l'ETL compare le catalogue livre a ce que contient le CMS et en deduit ce qu'il faut supprimer. Cette logique de diff est le point de fragilite central (section 4).

## 3. Les mecanismes

Les cinq etapes, avec pour chacune l'endroit ou elle vit et le piege qu'elle porte. La colonne « Piege / delta » est ce qui rend cette table utile au diagnostic.

| # | Etape | Ou ca vit | Ce qui s'y passe | Piege / delta |
| - | ----- | --------- | ---------------- | ------------- |
| 1 | Depot partenaire | Espace FTP(S) heberge chez le partenaire | Studapart pose chaque nuit un ZIP contenant un XML du catalogue complet. Immojeune expose un flux logements en JSON. | Aucune alerte de fraicheur : un dépot manquant ou perime ne declenche rien de lui-meme. |
| 2 | Extraction ETL | App Scalingo `1j1s-stage-orchestrateur-transform-load` | Trois crons se succedent chaque matin : extract, transform, load. Chaque etape ecrit dans MinIO en double, une version `latest` remplacee a chaque passage et une version horodatee d'historique, qui sert de rapport d'audit pour rejouer ou comparer une nuit precedente (section 6). | Nom d'app trompeur : « stage » dans le nom, alors qu'elle traite aussi le logement. Chercher au mauvais endroit fait perdre du temps. |
| 3 | Chargement CMS | CMS Strapi `1j1s-main-cms-prod`, type `annonce-de-logement` | Le load recupere les annonces deja en base pour la source, compare au flux du jour et repartit en trois lots : creer (dans le flux, absent du CMS), mettre a jour (present des deux cotes, date fournisseur plus recente), supprimer (dans le CMS, absent du flux). Attribut `source` = liste a deux valeurs. | La branche « supprimer » agit sans seuil de garde : un flux tronque mais valide vide le catalogue (section 4). |
| 4 | Indexation | Meilisearch, index `annonce-de-logement` | Le CMS pousse les annonces vers l'index, source comprise, pour la recherche et la liste de resultats. | L'index derive du CMS (section 2) : ecart index seul → indexation ; present des deux cotes → en amont. |
| 5 | Affichage front | Ce depot, `src/…/Logement` et `src/pages/logements` | Le front lit Meilisearch en direct pour la liste et Strapi pour le detail. | Le logo, seule bifurcation sur `source` cote front (sous-section ci-dessous). |

### Ce qui, cote front, depend de la source

Le front branche sur la valeur de `source` a **un seul endroit** : le logo du diffuseur en tete de fiche.

- `src/client/components/features/Logement/Consulter/ConsulterAnnonce.tsx:102` : un `switch (source)` affiche `immojeune.webp` (ligne 106) ou `studapart.webp` (ligne 112). Toute autre valeur retombe sur `default` et n'affiche aucun logo (ligne 118).

Le **lien sortant** vers l'annonce partenaire est pilote par le champ propre a l'annonce `urlDeCandidature`, alimente par `annonceLogementResponse.url` du CMS (`src/server/logements/infra/strapiAnnonceDeLogement.mapper.ts:29`) et rendu tel quel (`ConsulterAnnonce.tsx:130`, bouton « Voir l'annonce »). Il pointe vers le domaine du partenaire parce que l'annonce vient de ce partenaire, le champ `source` n'intervenant pas dans ce lien. Precision qui compte pour le diagnostic : un lien casse se corrige dans la donnee CMS de l'annonce, le front n'appliquant aucun mapping par source.

Les **images** des annonces sont chargees via `next/image`, dont Next.js exige que le domaine hote figure dans une liste blanche. Cette liste est construite a partir de la variable d'environnement `LOGEMENT_IMAGE_URL_LIST`, decoupee sur la virgule (`next.config.js:16`), transformee en motifs `remotePatterns` (`next.config.js:15` a `23`) et injectee dans la config images de Next (`next.config.js:42-43`). Un domaine absent de cette liste fait echouer le rendu de l'image, l'annonce restant par ailleurs affichee. Les valeurs concretes de la liste vivent dans la config d'environnement (Scalingo), hors du code versionne : leur contenu exact est NON CONFIRME depuis ce depot.

L'etiquette `source` cote front est un type TypeScript a deux valeurs :

- `src/server/logements/domain/annonceDeLogement.ts:71` : `export type AnnonceDeLogementSource = 'immojeune' | 'studapart'`.
- Elle est recopiee depuis la reponse CMS sans transformation : `strapiAnnonceDeLogement.mapper.ts:23`, `source: annonceLogementResponse.source`.

L'index Meilisearch consomme cote front est designe par la variable `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT` (`src/pages/logements/annonces/index.page.tsx:24`), interrogee via le client `instantMeiliSearch` (`src/client/dependencies.container.ts:151`). La valeur litterale de l'index (le nom `annonce-de-logement`) vient de la config d'environnement : NON CONFIRME depuis ce depot.

## 4. Limites et pieges

Trois faiblesses structurelles, par ordre de gravite operationnelle.

### 4.1 Depublication massive sur flux tronque mais valide (le piege majeur)

L'etape load calcule les suppressions par difference : toute annonce presente au CMS et absente du flux du jour est jugee obsolete et supprimee. Cette logique n'a **aucun garde-fou de seuil minimum** sur le volume livre avant d'enclencher les suppressions (source : Carto_studapart_immojeune.md, matiere premiere ; NON CONFIRME depuis ce depot, l'ETL vivant dans `1j1s-etl`).

Scenario de panne : le partenaire livre un ZIP techniquement valide (transfert ok, ZIP lisible, XML bien forme) mais dont le catalogue est partiel ou vide. Le pipeline conclut que les annonces manquantes sont obsoletes et les supprime du CMS en J+1. Pour Studapart, dont les 5 743 annonces sont **toutes** retraitees chaque matin (le fournisseur avance la date de modification de chaque annonce a chaque livraison), un catalogue vide efface la totalite de la source en une nuit.

Contraste utile : une panne **technique** de l'extraction (transfert injoignable, ZIP illisible, XML invalide) est benigne. Le pipeline reste sur la derniere livraison valide et ne casse pas le catalogue. La panne dangereuse est le flux **valide mais appauvri**, que rien ne distingue automatiquement d'un vrai retrait d'annonces.

### 4.2 Aucune alerte de fraicheur du depot fournisseur

Si le partenaire cesse de deposer un nouveau ZIP, le pipeline le detecte mal : soit l'extract echoue, soit il retelecharge un fichier identique a la veille. Dans les deux cas le pipeline rejoue sans effet et preserve le catalogue, tout en masquant le probleme amont. Aucune alerte automatisee sur la fraicheur du dépot n'a ete identifiee dans le code ETL (source : Carto_studapart_immojeune.md ; NON CONFIRME depuis ce depot). La surveillance repose donc entierement sur les signaux passifs de la section « Observabilite ».

### 4.3 Couplage de la liste de valeurs `source` sur deux depots

La valeur `studapart` est gravee a deux endroits independants :

- dans le schema Strapi du type `annonce-de-logement`, cote CMS (source : Carto_studapart_immojeune.md ; NON CONFIRME depuis ce depot) ;
- dans le type TypeScript du front, cote ce depot (`annonceDeLogement.ts:71`, confirme).

Retirer un partenaire coute donc cher : migration de schema cote CMS, nettoyage du type et du `switch` de logo cote front, retrait cote ETL, et suppression des annonces residuelles en base. Le front seul ne suffit a rien : modifier l'enum ici sans toucher le CMS produit une incoherence.

## 5. Certitude (confirme source / NON CONFIRME)

Repartition explicite de ce qui est verifie depuis ce depot et de ce qui vient de la matiere premiere (depot ETL / CMS, invérifiable ici).

| Affirmation | Statut | Source |
| ----------- | ------ | ------ |
| Enum `source` a deux valeurs cote front | Confirme | `annonceDeLogement.ts:71` |
| `source` recopie du CMS sans transformation | Confirme | `strapiAnnonceDeLogement.mapper.ts:23` |
| Logo seul branche sur `source` cote front | Confirme | `ConsulterAnnonce.tsx:102-120` |
| Lien sortant = champ `url` de l'annonce, pas un switch source | Confirme | `strapiAnnonceDeLogement.mapper.ts:29`, `ConsulterAnnonce.tsx:130` |
| `LOGEMENT_IMAGE_URL_LIST` = liste blanche des domaines d'images | Confirme (mecanisme) | `next.config.js:16`, `next.config.js:42-43` |
| Valeurs concretes de `LOGEMENT_IMAGE_URL_LIST` | NON CONFIRME | Config Scalingo, hors code versionne |
| Index Meili lu par la variable `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT` | Confirme | `index.page.tsx:24`, `dependencies.container.ts:151` |
| Nom litteral de l'index (`annonce-de-logement`) | NON CONFIRME | Config d'environnement |
| Dépot nocturne d'un ZIP par Studapart, protocole FTP ou FTPS | NON CONFIRME (sources en conflit) | Carto_studapart_immojeune.md (FTPS) vs Carto_service_externes.md (FTP) |
| App ETL `1j1s-stage-orchestrateur-transform-load`, traite aussi le logement | NON CONFIRME | Carto (matiere) |
| Trois crons extract 5h00 / transform 5h15 / load 5h30 UTC | NON CONFIRME | Carto (matiere) |
| Double ecriture MinIO latest + historique | NON CONFIRME | Carto (matiere) |
| Schema CMS `annonce-de-logement`, enum `source` cote Strapi | NON CONFIRME | Carto (matiere) |
| Repartition creer / mettre a jour / supprimer par diff | NON CONFIRME | Carto (matiere) |
| Absence de seuil de garde avant suppression | NON CONFIRME | Carto (matiere) |
| Absence d'alerte de fraicheur du dépot | NON CONFIRME | Carto (matiere) |
| Volumes 69 838 / 5 743 | Mesure datee du 23 avril 2026 | Carto (matiere), non re-verifiee |

Regle de lecture : tout « NON CONFIRME » se leve en ouvrant le depot `1j1s-etl` ou le CMS `1j1s-main-cms`, pas ce depot front. Ne jamais promouvoir un NON CONFIRME en fait sur la seule foi d'un autre document du corpus.

## 6. Ce que ca change (consequence actionnable)

### Diagnostiquer une disparition d'annonces, etage par etage

Remonter l'escalier du bas vers le haut, en isolant l'etage fautif avant de plonger dedans.

| Symptome observe | Etage a interroger | Signal a regarder | Verdict |
| ---------------- | ------------------ | ----------------- | ------- |
| Volume correct au CMS, absent du site | Front / Meili | Facette `source` de l'index Meili vs comptage Strapi | Ecart index seul → indexation ; egalite → remonter |
| Volume effondre au CMS | ETL load | Comptage Strapi par `source`, rapports d'audit MinIO du load | Suppression massive declenchee la nuit |
| CMS a jour mais fige depuis N jours | ETL extract/transform | Dashboard Scalingo cron : dernieres executions | Cron en echec ou en retard |
| Cron vert, CMS fige | Depot partenaire | Comparer le ZIP du jour a la veille | Dépot manquant ou identique, invisible sans alerte |
| Image cassee, annonce presente | Front | Domaine de l'image absent de `LOGEMENT_IMAGE_URL_LIST` | Ajouter le domaine a la variable, redeployer |
| Logo partenaire absent | Front | Valeur de `source` hors `{immojeune, studapart}` | Branche `default` de `ConsulterAnnonce.tsx:118` |

### Les signaux d'observabilite disponibles

- **Dashboard Scalingo cron** de l'app ETL : date de derniere et prochaine execution de chaque tache. Une execution manquee ou en retard s'y voit immediatement.
- **Logs applicatifs ETL** : logs structures par etape, avec un nom de flux explicite. Un grep sur `studapart` reconstitue une journee.
- **Sentry** : capte les erreurs non rattrapees, y compris les stacktraces portant le nom de flux.
- **Comptage Strapi par `source`** : volume expose en temps reel. Un ecart brutal a la baseline (5 743 pour Studapart) est un signal fort.
- **Facette Meili sur `source`** : repartition actuelle de l'index, utile quand le doute porte sur l'indexation.

### Cote PO : quel evenement declenche quoi

- **Baisse durable du volume Studapart sous ~3 000** : signe de desengagement partenaire, declenche une relecture de la convention.
- **Plusieurs jours consecutifs sans livraison valide** : justifie un contact fournisseur (un incident isole est normal).
- **Retours utilisateurs specifiques a une source** (doublons, annonces perimees, redirections cassees) : le signal qualitatif le plus fiable.
- **Rupture de convention avec un partenaire** : implique de mettre a jour le texte des conditions generales, saisi dans le back-office Strapi (source : Carto_studapart_immojeune.md), en parallele du retrait technique.

### Encart : questions ouvertes pour la nouvelle equipe

- Existe-t-il, cote ETL, un seuil minimum de volume avant d'enclencher les suppressions ? La matiere dit non ; a confirmer dans `1j1s-etl`, module `apps/logements`.
- Une alerte de fraicheur du dépot fournisseur peut-elle etre ajoutee sans toucher au partenaire (par exemple, comparaison du hash du ZIP a la veille) ?
- Le nom litteral de l'index Meili et le contenu de `LOGEMENT_IMAGE_URL_LIST` doivent etre releves dans la config Scalingo de production pour figer ce document.

## 7. Pour aller plus loin (fichiers qui font foi)

Cote ce depot (front), verifiables directement :

- `src/server/logements/domain/annonceDeLogement.ts:71` : type `AnnonceDeLogementSource`.
- `src/server/logements/infra/strapiAnnonceDeLogement.mapper.ts` : mapping CMS → domaine front (`source` ligne 23, `url` ligne 29).
- `src/client/components/features/Logement/Consulter/ConsulterAnnonce.tsx:102-134` : bifurcation logo et bouton sortant.
- `src/pages/logements/annonces/index.page.tsx:24` : lecture de l'index Meili.
- `src/client/dependencies.container.ts:151` : client Meilisearch.
- `next.config.js:15-23` et `next.config.js:42-43` : liste blanche d'images.

Cote depots freres (a ouvrir pour lever les NON CONFIRME) :

- `1j1s-etl`, `apps/logements/` : clients d'extraction Studapart (FTP) et Immojeune, logique de load et de diff.
- `1j1s-main-cms` : schema du type `annonce-de-logement`, configuration Meilisearch.

Renvois internes au corpus (sans y sourcer un fait) :

- Cartographie des services externes : `../matière_première/Carto_service_externes.md`.
- Brouillon source Studapart : `../matière_première/Carto_studapart_immojeune.md`.
