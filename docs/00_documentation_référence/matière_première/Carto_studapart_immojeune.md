---

Ce document résume le fonctionnement de la source Studapart dans l'écosystème 1j1s : ce qu'elle apporte aux utilisateurs (partie 1, orientée PO) et comment elle circule entre les systèmes (partie 2, technique sans code).

## Partie 1 : Vue PO

### Ce que Studapart apporte au site

Studapart est l'un des deux partenaires qui alimentent la rubrique **logements** de 1jeune1solution.gouv.fr. Le second partenaire est Immojeune. Les deux sources sont agrégées dans le même moteur de recherche côté utilisateur, sans filtre visible permettant de choisir l'une ou l'autre.

### Volumes actuels

Mesure réalisée le 23 avril 2026 directement sur la base Strapi de production.

| Source | Nombre d'annonces exposées | Part du catalogue logements |
| --- | --- | --- |
| Immojeune | 69 838 | 92 % |
| Studapart | 5 743 | 8 % |

Studapart représente donc un peu plus de 5 700 annonces visibles en permanence. C'est minoritaire en volume, mais significatif : une livraison quotidienne vide ou très tronquée ferait disparaître 8 % du catalogue logements en moins de 24 h (voir "Fraîcheur de la donnée" ci-dessous pour le détail des modes de défaillance).

### Fraîcheur de la donnée

Les deux partenaires ne génèrent pas la même intensité de traitement par l'ETL :

- **Immojeune** : environ 870 annonces nécessitent un traitement chaque matin (création, mise à jour ou suppression), soit de l'ordre de 1 % du stock. Le reste du catalogue est laissé intact parce que sa date de modification n'a pas bougé côté fournisseur.
- **Studapart** : les 5 743 annonces sont **toutes** retraitées chaque matin. Le fournisseur fait avancer la date de modification de chaque annonce à chaque livraison, ce qui oblige le pipeline 1j1s à rejouer une mise à jour complète même quand le contenu n'a pas réellement bougé.

Conséquence pour le PO : la volumétrie Studapart est sensible à la qualité de la livraison quotidienne. Si le partenaire livre un catalogue vide ou tronqué, le pipeline interprète les annonces manquantes comme obsolètes et les supprime du CMS en J+1. En revanche, si l'extraction échoue techniquement (FTPS injoignable, ZIP illisible), le pipeline reste sur la dernière livraison valide et ne casse pas le catalogue.

### Présence juridique et contractuelle

Studapart est mentionné dans les conditions générales d'utilisation du site. Ce contenu éditorial vit dans le back-office Strapi (saisi par l'équipe contenu, pas codé en dur). Toute décision de rupture de la convention implique de mettre à jour ce texte en parallèle.

### Ce qui ne passe pas par Studapart

Studapart n'alimente pas :

- les fiches métier
- les offres d'emploi, d'alternance, de stage, de job d'été ou de service civique
- les fiches de formation
- les événements

Son périmètre est strictement le logement étudiant.

### Quand envisager une résiliation ou un renouvellement

Trois signaux à surveiller pour déclencher une relecture du partenariat :

1. **Baisse durable du nombre d'annonces livrées.** La baseline constatée le 23 avril 2026 est de 5 743 annonces. Une baisse significative et durable sous ce niveau (par exemple sous 3 000) serait à interpréter comme un signe de désengagement du partenaire.
2. **Échecs répétés du flux quotidien.** Un incident ponctuel est normal. Plusieurs jours consécutifs sans livraison valide justifient un contact fournisseur.
3. **Retours utilisateurs négatifs spécifiques à Studapart.** Doublons, annonces périmées, redirections cassées : les remontées qualitatives sont le signe le plus fiable qu'il faut agir.

En l'absence de ces signaux, la recommandation est de **renouveler la convention** : le partenariat est encore productif et le coût de maintenance est très faible, la dernière modification du code ETL touchant Studapart remontant à juin 2024.

## Partie 2 : Vue technique

### Position de Studapart dans la chaîne

Studapart est une source en amont du site. Elle se branche sur l'ETL 1j1s, pas sur le front directement. Le front ne connaît pas Studapart en tant que service : il lit les annonces dans le CMS Strapi et dans Meilisearch, en transparence de la source.

Le chemin complet d'une annonce Studapart, de sa publication par le partenaire jusqu'à son affichage à l'utilisateur, traverse cinq étapes détaillées ci-dessous.

### Étape 1 : Dépôt par le partenaire

Studapart dépose chaque nuit un fichier ZIP nommé `unjeuneunesolution.zip` sur un espace de stockage fichiers accessible en FTPS, hébergé sur une infrastructure Clever Cloud. Le ZIP contient un unique fichier XML listant l'intégralité du catalogue d'annonces disponibles à la date du dépôt.

L'accès à l'espace FTPS se fait par identifiant et mot de passe fournis par Studapart. Les identifiants sont stockés dans les variables d'environnement de l'app ETL sur Scalingo. Ils ne sont **jamais** versionnés dans les dépôts.

### Étape 2 : Extraction par l'ETL 1j1s

L'app Scalingo `1j1s-stage-orchestrateur-transform-load` héberge le pipeline ETL complet. Malgré son nom, elle traite aussi bien les flux stages que logements. Trois tâches cron se succèdent chaque matin, programmées en heure UTC :

- **Extract** à 5 h 00 UTC : ouvre une connexion FTPS vers l'espace Studapart, télécharge le ZIP, l'extrait sur le système de fichiers local du conteneur, lit le XML, puis enregistre ce contenu dans le bucket MinIO dédié aux données brutes. Le contenu est écrit deux fois : une version "latest" remplacée à chaque passage, et une version horodatée conservée dans un dossier d'historique pour audit.
- **Transform** à 5 h 15 UTC : relit le XML "latest" depuis le bucket brut, le convertit en JSON normalisé conforme au modèle interne d'annonce de logement, puis écrit ce JSON dans un second bucket MinIO dédié aux données transformées (même double écriture latest plus historique).
- **Load** à 5 h 30 UTC : relit le JSON "latest", récupère en parallèle la liste des annonces Studapart déjà présentes dans le CMS Strapi, et répartit les annonces en trois catégories :
    - **à créer** : annonces présentes dans le flux mais absentes du CMS ;
    - **à mettre à jour** : annonces présentes des deux côtés dont la date de modification fournisseur est plus récente dans le flux ;
    - **à supprimer** : annonces présentes dans le CMS mais absentes du flux du jour.

    Chaque catégorie est ensuite poussée vers l'API Strapi en HTTP (POST, PUT ou DELETE selon le cas). Un troisième bucket MinIO reçoit des rapports horodatés listant ce qui a été créé, mis à jour, supprimé ou rejeté en erreur, à des fins d'audit et de monitoring.


Les annonces inchangées (identifiant connu des deux côtés, même date de modification fournisseur) ne génèrent aucun appel HTTP vers le CMS.

### Étape 3 : Stockage dans le CMS Strapi

Le CMS `1j1s-main-cms-prod` expose un type de contenu `annonce-de-logement` dont l'attribut `source` est une énumération à deux valeurs : `immojeune` ou `studapart`. Aucune autre valeur n'est acceptée.

À la fin de l'étape Load, toutes les annonces Studapart vivent dans la même table que les annonces Immojeune, distinguables uniquement par cet attribut `source`. Le CMS est la source de vérité qui alimente ensuite l'index de recherche et les pages de détail.

### Étape 4 : Indexation Meilisearch

Le CMS pousse les annonces vers un index Meilisearch hébergé chez le fournisseur Meilisearch Cloud. L'index s'appelle `annonce-de-logement` et contient les attributs des annonces utiles à la recherche et à l'affichage dans la liste de résultats, dont la source (`immojeune` ou `studapart`).

Le front interroge Meilisearch directement via une clé publique en lecture seule pour les résultats de recherche. Les pages de détail d'une annonce, elles, sont rendues côté serveur en consultant Strapi par slug.

### Étape 5 : Affichage côté front

Le front 1jeune1solution.gouv.fr traite les deux sources de façon quasi interchangeable. Seuls deux points divergent à l'affichage :

- Le logo partenaire en tête de fiche d'annonce change selon la valeur de `source` (logo Studapart ou logo Immojeune).
- Le lien sortant vers le site partenaire pointe vers le domaine correspondant à la source de l'annonce.

Les domaines externes autorisés pour charger les images sont configurés côté front par une liste blanche (variable d'environnement `LOGEMENT_IMAGE_URL_LIST`). Cette liste inclut `www.studapart.com`, ce qui autorise le chargement des visuels hébergés chez le partenaire.

### Observabilité et diagnostic

Les signaux à regarder en cas de doute sur la santé du flux :

- **Dashboard Scalingo de l'app ETL**, onglet des tâches planifiées (cron tasks) : affiche la date de dernière exécution et la prochaine pour chacune des trois tâches Studapart. Une exécution manquée ou en retard s'y voit immédiatement.
- **Logs applicatifs de l'app ETL** : le pipeline émet des logs structurés à chaque étape du cycle extract, transform, load, avec un nom de flux explicite. Un grep sur `studapart` suffit pour reconstituer une journée.
- **Sentry** : capte les erreurs non rattrapées. Une stacktrace sur le nom de flux Studapart remonte ici.
- **API Strapi de production** : un comptage des annonces filtrées par source donne en temps réel le volume exposé. Un écart brutal à la baseline de 5 700 est un signal fort.
- **Meilisearch** : une facette sur le champ `source` de l'index `annonce-de-logement` renvoie la répartition actuelle. Utile si le doute porte spécifiquement sur l'indexation.

### Dépendances et points de fragilité

Trois dépendances à garder à l'esprit :

1. **L'espace FTPS fournisseur.** Si Studapart cesse de déposer un nouveau ZIP, le pipeline le détecte mal : l'extract soit échoue (connexion FTPS refusée, ZIP illisible, XML invalide), soit télécharge un fichier au contenu identique à la veille. Dans ces cas le pipeline est idempotent et ne casse pas le catalogue, mais il masque aussi le problème amont. Aucune alerte automatisée sur la fraîcheur du dépôt n'a été identifiée dans le code.
2. **Le risque de dépublication massive en cas de flux tronqué.** Si Studapart livre un ZIP techniquement valide mais contenant un catalogue partiel ou vide, le pipeline conclut que toutes les annonces manquantes sont obsolètes et les supprime du CMS. Il n'existe aucun garde-fou de type seuil minimum sur le volume livré avant d'enclencher les suppressions.
3. **Le couplage enum côté CMS et front.** La valeur `studapart` est gravée dans le schéma Strapi du type `annonce-de-logement` et dans le type TypeScript du front. Retirer Studapart impliquerait une migration de schéma côté CMS, un nettoyage du code côté front et ETL, et une suppression des annonces résiduelles en base.
