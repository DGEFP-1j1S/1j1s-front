# Les partenaires de données : volumes, dépendances, signaux de décision

_S'adresse à un PO ou un responsable de plateforme qui doit arbitrer le renouvellement ou la rupture d'un partenariat de données. Sert aussi de première lecture à qui découvre d'où vient le contenu du site. Dernière revue : 31 juillet 2026._

Après lecture, vous saurez **distinguer les deux natures de partenaire** (celui dont 1j1s stocke la donnée et porte la disponibilité, celui qu'on appelle en direct et dont la panne reste chez lui), **lire les volumes datés** de la rubrique logement, et **nommer à l'avance les seuils chiffrés** qui doivent rouvrir la décision de renouveler ou rompre. Le cas du logement (Studapart et Immojeune) sert de fil conducteur parce qu'il est le seul dont les volumes ont été mesurés.

## Le modèle mental d'abord : la nature du partenaire décide qui porte la panne

Avant les chiffres, une distinction gouverne toute la suite. Les partenaires de données du site se rangent en deux familles, et cette famille détermine à la fois **qui est responsable quand ça tombe** et **ce que coûte une rupture**.

Glossaire des termes techniques employés ici, à leur première apparition :

- **ETL** (extract, transform, load) : chaîne automatisée qui va chercher un fichier chez un partenaire chaque nuit, le transforme au format interne, puis le charge dans le stock 1j1s. Elle vit dans un dépôt voisin, `1j1s-etl`, pas dans le front.
- **CMS Strapi** : l'administration de contenu où vivent les données une fois chargées. Base de vérité qui alimente ensuite la recherche et les pages de détail. Dépôt voisin `1j1s-main-cms`.
- **MinIO** : stockage de fichiers façon Amazon S3, où l'ETL dépose les versions brute et transformée de chaque flux.
- **Meilisearch** : moteur de recherche que le front interroge en lecture seule pour afficher les résultats. Le front ne fait que lire.
- **batch** : traitement par lots, une fois par nuit, par opposition à un appel déclenché à chaque visite.
- **flux** : un fichier partenaire (XML, JSON ou archive) et le pipeline ETL qui le traite.
- **enum** : liste fermée de valeurs codées en dur dans le source (par exemple les noms de partenaires autorisés pour un champ).
- **la matière** : l'ensemble des sources consultées pour écrire ce document, à savoir le dépôt front `1j1s-front` et les notes de cartographie fournies. À distinguer de la réalité des dépôts voisins `1j1s-etl` et `1j1s-main-cms`, non rejoués ici. « Absent de la matière » veut donc dire « pas trouvé dans ces sources », une information manquante à confirmer, et reste distinct d'une preuve d'inexistence.

### Famille 1 : les flux batch, stockés chez 1j1s

Le partenaire dépose un fichier. L'ETL l'ingère la nuit et écrit le résultat dans le CMS Strapi et dans Meilisearch. À partir de là, **la donnée vit chez 1j1s**. Le front la sert depuis ce stock, sans jamais parler au partenaire.

Conséquence pour la décision : si le partenaire coupe son flux, le site continue d'afficher la dernière copie chargée. La panne ne se voit pas tout de suite. Le risque se déplace vers deux effets propres à 1j1s : la donnée se périme en silence, et le pipeline 1j1s peut lui-même corrompre le catalogue si le flux arrive tronqué (mécanisme établi et détaillé plus bas pour le logement ; supposé analogue pour les autres flux batch, à vérifier flux par flux). **1j1s porte la disponibilité et l'intégrité** de ces données. La décision de renouveler ou rompre est un arbitrage interne à 1j1s, plus lourd qu'une simple coupure d'appel.

Flux batch actuels : stages (HelloWork, JobTeaser, StageFr), logements (ImmoJeune, StudApart), événements (Tous Mobilisés), formations initiales (Onisep). Ces pipelines vivent dans `1j1s-etl` et ne sont pas vérifiables depuis le dépôt front. Corroboration indirecte côté front : aucun client HTTP vers ces partenaires n'existe dans `src/` (le front les connaît seulement comme valeurs d'un champ `source` sur des enregistrements déjà stockés, voir `src/server/stages/repository/sourceDesDonnéesStage.ts` et `src/server/logements/domain/annonceDeLogement.ts:71`).

### Famille 2 : les API temps réel, appelées à la volée

Le front interroge l'API du partenaire à chaque recherche de l'utilisateur, au moment de la requête. **1j1s ne stocke rien de durable** (un cache Redis amortit certains appels, dont les jetons d'authentification, sa portée exacte sort du cadre de ce document).

Conséquence pour la décision : si l'API du partenaire tombe, le parcours concerné se dégrade en direct, sous les yeux de l'utilisateur. La panne est visible immédiatement et **son ressort reste chez le partenaire**. Le couplage côté 1j1s est mince : une configuration de client HTTP. Rompre revient pour l'essentiel à retirer cette configuration.

Ces API sont gouvernementales ou publiques pour la plupart : France Travail, La Bonne Alternance, API Alternance, Trajectoires Pro, Onisep (côté API), Immersion Facile, API Engagement, API Adresse, Découpage Administratif, Établissements Publics, EURES. Chacune a son fichier de configuration présent dans le front, par exemple `src/server/offres/configuration/france-travail/franceTravailHttpClient.config.ts` et `src/server/engagement/configuration/api-engagement/apiEngagementHttpClient.config.ts`.

### Le schéma qui résume

```
FAMILLE 1 : FLUX BATCH (la donnée est stockée chez 1j1s)

  Partenaire ──fichier nuit──> ETL ──> CMS Strapi + Meilisearch ──lecture──> Front ──> Usager
                                          (stock 1j1s = source de vérité)


FAMILLE 2 : API TEMPS RÉEL (rien de durable chez 1j1s)

  Usager ──recherche──> Front ──appel à la requête──> API partenaire
                                                        (réponse live, cache Redis d'appoint)
```

Cette séparation recoupe le tableau récapitulatif de la cartographie des services externes (`matière_première/Carto_service_externes.md`), avec deux nuances de vocabulaire à connaître : **Tous Mobilisés** y est étiqueté « API métier » alors que, en pratique, l'ETL le consomme comme un flux batch ; **Onisep** apparaît des deux côtés, flux batch pour les formations initiales et API temps réel pour une autre partie du parcours formation.

## La question, posée sans détour

Le contrat d'un partenaire de données arrive à échéance, ou l'un d'eux montre des signes de faiblesse. Faut-il renouveler, ou couper ? La question se pose maintenant parce que la passation à une nouvelle équipe impose de savoir, pour chaque source, **ce qu'on perd si elle disparaît** et **à partir de quel seuil chiffré il faut agir**. Sans ces repères, l'équipe entrante subit les décisions au lieu de les prendre.

Le raisonnement se démontre sur le logement, le seul domaine dont les volumes ont été mesurés. Il se transpose ensuite à tout flux batch.

## Qui fournit quoi, et à quel volume (instantané daté)

### Les flux batch

Un seul domaine dispose d'une mesure de volume. Les autres flux n'ont aucun comptage disponible à ce jour ; toute décision les concernant exige d'abord de les instrumenter (voir Questions ouvertes).

| Flux | Ressource | Volume exposé | Instantané | Effet d'un arrêt du flux |
| --- | --- | --- | --- | --- |
| ImmoJeune | Logements | 69 838 (92 % du catalogue logement) | 23 avril 2026 | Le site sert l'ancienne copie ; péremption progressive |
| StudApart | Logements | 5 743 (8 % du catalogue logement) | 23 avril 2026 | Idem, plus un risque de dépublication massive (voir ci-dessous) |
| HelloWork, JobTeaser, StageFr | Stages | non mesuré | absent | Idem famille 1 |
| Tous Mobilisés | Événements | non mesuré | absent | Idem famille 1 |
| Onisep (flux) | Formations initiales | non mesuré | absent | Idem famille 1 |

Les volumes logement viennent d'un comptage direct sur la base Strapi de production, réalisé le 23 avril 2026. Ce comptage n'a pas été rejoué au moment de cette rédaction : traitez ces deux chiffres comme un instantané, à revérifier avant tout arbitrage réel (un comptage par valeur du champ `source` dans Strapi ou une facette Meilisearch le rafraîchit en quelques minutes).

### Les API temps réel

Aucune n'a de volume pertinent à surveiller au sens de la décision : leur santé se lit à la disponibilité de l'endpoint, pas à un stock. Leur regroupement par parcours :

| Parcours servi | API temps réel | Effet d'une panne partenaire |
| --- | --- | --- |
| Emploi, alternance, formation | France Travail, La Bonne Alternance, API Alternance, Trajectoires Pro, Onisep (API) | Dégradation live du parcours concerné, ressort partenaire |
| Stages 3e et 2de | Immersion Facile | Idem |
| Engagement, bénévolat | API Engagement | Idem |
| Saisie d'adresse et géo | API Adresse, Découpage Administratif | Autocomplétion et filtres géographiques dégradés |
| Recherche d'établissements d'accompagnement | Établissements Publics (Annuaire des services publics) | Annuaire d'accompagnement dégradé, parcours distinct de la saisie d'adresse |
| Emplois en Europe | EURES | Rubrique Europe dégradée |

## Le cas logement en détail : deux partenaires très inégaux

Studapart et Immojeune alimentent la même rubrique logement, agrégés dans le même moteur de recherche, sans filtre visible permettant à l'utilisateur de choisir l'une ou l'autre source. Le front les traite de façon quasi interchangeable. Une seule bascule de code du front dépend du champ `source` : le logo du diffuseur affiché sur la carte de candidature, via un `switch (source)` (`src/client/components/features/Logement/Consulter/ConsulterAnnonce.tsx:101`). Le domaine du lien sortant varie lui aussi d'un partenaire à l'autre, cette fois parce que chaque annonce porte sa propre URL de candidature (champ de données `urlDeCandidature`), la bascule de code restant unique. Le chargement des visuels hébergés chez le partenaire passe par une liste blanche de domaines (variable `LOGEMENT_IMAGE_URL_LIST`, `next.config.js:16`, qui inclut `www.studapart.com`) : Next.js n'affiche une image distante que si son domaine y figure. Retirer un partenaire logement oblige donc à retirer aussi son domaine de cette liste, un point de couplage de plus à ajouter aux trois dépôts cités plus bas.

Le détail complet du pipeline relève du document `../03_maintenance/02_flux_etl_par_source_exemple_logement.md` : dépôt FTPS (un dépôt de fichiers sécurisé par TLS), cron, buckets MinIO, répartition créer / mettre à jour / supprimer. Ici, on ne garde que ce qui pèse sur la décision : la fragilité de Studapart.

### La fragilité propre à Studapart : le retraitement complet quotidien

Les deux partenaires n'imposent pas la même charge au pipeline, et cet écart est la clé du risque.

```
IMMOJEUNE                              STUDAPART
~870 annonces retraitées / matin       5 743 annonces retraitées / matin
(~1 % du stock bouge)                  (100 % du stock rejoué chaque jour)
                                       le fournisseur avance la date de
le reste est laissé intact             modification de CHAQUE annonce à
                                       chaque livraison
```

Le pipeline 1j1s décide quoi retraiter en comparant la date de modification de chaque annonce à celle qu'il avait la veille. Studapart avance cette date sur toutes ses annonces à chaque livraison. Le pipeline en conclut donc que tout a changé et rejoue une mise à jour complète du catalogue Studapart tous les matins, même quand le contenu réel est resté identique. (Chiffres observés sur les exécutions ETL, non rejoués ici.)

### Le mode de défaillance dangereux : la dépublication massive

> **À lire avant d'arbitrer.** Tout ce qui suit sur le risque de dépublication suppose l'absence de deux garde-fous côté ETL : un seuil de sécurité (volume minimum livré avant d'enclencher les suppressions) et une alerte de fraîcheur sur le dépôt. Ces deux absences relèvent du dépôt voisin `1j1s-etl` et restent non vérifiées depuis le dépôt front. À confirmer là-bas AVANT tout arbitrage (voir Questions ouvertes 1 et 2). La suite décrit ce qui se produit si ces garde-fous manquent effectivement.

Deux façons pour une livraison Studapart de mal tourner, aux conséquences opposées :

| Ce qui arrive | Comportement du pipeline | Conséquence catalogue |
| --- | --- | --- |
| L'extraction échoue techniquement (FTPS injoignable, ZIP illisible, XML invalide) | Le pipeline ne touche à rien et conserve la dernière livraison valide | Catalogue intact. Le problème amont est masqué. |
| Le fichier est techniquement valide mais vide ou tronqué | Conclut que les annonces manquantes sont obsolètes, les supprime | 8 % du catalogue logement disparaît en J+1 |

Le second cas est le danger réel : faute du garde-fou signalé ci-dessus, une livraison techniquement valide mais tronquée fait disparaître en J+1 les annonces qu'elle ne contient plus.

## Les options réelles

Formulées sur le logement, chacune présentée sous son meilleur jour.

**Option A, renouveler les deux (statu quo).** Le catalogue reste à environ 75 581 annonces. Deux gisements complémentaires réduisent la dépendance à un fournisseur unique. Le coût de fonctionnement est quasi nul : la dernière modification du code ETL touchant Studapart remonte à juin 2024 (donnée de la matière, non vérifiable ici), le run tourne seul.

**Option B, rompre Studapart, garder Immojeune seul.** Supprime d'un coup le mode de défaillance le plus dangereux (dépublication massive Studapart) et le couplage de code associé. Le catalogue perd 8 %, il reste massif à environ 69 838 annonces. Le schéma se simplifie.

**Option C, rompre Immojeune, garder Studapart (écartée).** Présentée honnêtement : Studapart est le flux le plus « vivant », intégralement rejoué chaque jour, donc réputé frais. Mais il ne pèse que 8 % du catalogue et concentre le profil de risque le plus élevé (dépublication massive possible, dépôt FTPS à fournisseur unique). Réduire le catalogue à ce seul flux fragile serait un choix perdant. Écartée.

## Le verdict

**Renouveler les deux partenaires tant qu'aucun des trois déclencheurs Studapart ci-dessous n'est franchi**, parce que le coût de fonctionnement est quasi nul et que 8 % du catalogue représentent plusieurs milliers d'annonces réellement utiles à l'usager.

## Ce que ça concède

Garder un petit partenaire a un coût, même quand son run coûte quasi rien. La facture se paie à deux endroits.

**Le couplage par enum gravé dans le code.** La valeur `studapart` est inscrite en dur dans un enum (liste fermée de valeurs) du front, le type TypeScript `AnnonceDeLogementSource` (`src/server/logements/domain/annonceDeLogement.ts:71` : `AnnonceDeLogementSource = 'immojeune' | 'studapart'`) et, selon la matière, dans le schéma du type `annonce-de-logement` du CMS. Ce second point relève du dépôt `1j1s-main-cms` et **n'est pas vérifiable depuis le dépôt front (NON CONFIRMÉ ici)**. Le jour où l'on retire Studapart, la dette se règle en trois temps : migration du schéma CMS, nettoyage du code front et ETL, purge des annonces résiduelles en base. Le run tourne seul ; le retrait, lui, mobilise du travail sur trois dépôts.

**Le risque porté en continu.** Tant que Studapart alimente le site, 1j1s porte le risque de dépublication massive décrit plus haut, sans seuil de sécurité connu pour l'arrêter. C'est un coût latent, invisible les jours normaux, brutal le jour d'un flux tronqué.

**Le même travers se retrouve ailleurs.** Côté stages, `src/server/stages/repository/sourceDesDonnéesStage.ts` grave un enum de sources qui contient déjà des valeurs mortes (`welcome to the jungle`, `jobijoba`) absentes de la liste des flux ETL courants. L'enum survit au partenariat et accumule du résidu. Preuve concrète que chaque petit partenaire batch laisse une trace durable dans le code, longtemps après sa sortie.

## Les déclencheurs, nommés à l'avance

Trois signaux, chiffrés quand la matière le permet, remettent le verdict en cause pour Studapart. La même grille se transpose à tout flux batch une fois son volume instrumenté.

| Signal | Seuil déclencheur | Repère (instantané 23 avril 2026) | Action |
| --- | --- | --- | --- |
| Baisse durable du volume livré | passage durable sous ~3 000 annonces (environ la moitié du volume instantané) | 5 743 annonces | Interpréter comme un désengagement, contacter le fournisseur, ouvrir l'arbitrage |
| Échecs répétés du flux quotidien | plusieurs jours consécutifs sans livraison valide (un incident isolé est normal) | livraison quotidienne nominale | Contacter le fournisseur |
| Retours utilisateurs négatifs propres à Studapart | doublons, annonces périmées, redirections cassées, récurrents | pas de remontée notable | Audit qualité, arbitrage |

Le seuil de ~3 000 annonces est une règle indicative, à recalibrer : faute d'historique de volume dans les sources consultées, il est posé à environ la moitié du volume instantané du 23 avril 2026 (5 743 annonces), niveau en deçà duquel une baisse durable se lit comme un désengagement du fournisseur.

Le troisième signal est le plus fiable : des retours utilisateurs répétés signalent le besoin d'agir plus sûrement que n'importe quelle métrique. Le premier est le plus mesurable : un comptage par `source` dans Strapi ou une facette Meilisearch le donne à la demande.

## Le critère d'abandon

Le run passif justifie le renouvellement. L'équation bascule quand soutenir Studapart cesse d'être passif et se met à coûter du temps humain récurrent ou de l'investissement de développement.

Deux dépenses feraient pencher vers l'option B (rupture) :

- **Supervision manuelle quotidienne** des livraisons, si les échecs deviennent répétés au point d'exiger un œil humain chaque matin.
- **Développement d'un seuil de sécurité** contre la dépublication massive, si l'on juge le risque intenable en l'état.

Règle d'abandon : rapporter cette dépense aux 8 % du catalogue qu'elle protège. Si Studapart tombe durablement sous ~3 000 annonces **et** qu'un verrou de seuil reste à financer, le rapport coût sur bénéfice bascule et la rupture (option B) devient le choix rationnel. Tant que le run reste passif et le volume supérieur au seuil, renouveler.

## Questions ouvertes pour la nouvelle équipe

Points laissés sans réponse certaine par la matière, à traiter avant de décider sur des cas réels. Aucun n'a été comblé par une supposition.

1. **Seuil de sécurité avant dépublication (ETL).** La matière ne l'a pas trouvé dans le code. À confirmer dans `1j1s-etl/apps/logements`. S'il n'existe pas, c'est le risque numéro un à traiter.
2. **Alerte de fraîcheur sur le dépôt FTPS Studapart.** Non identifiée. À confirmer côté ETL. Sans elle, un flux qui cesse d'être déposé passe inaperçu.
3. **Volumes des autres flux batch.** Stages (HelloWork, JobTeaser, StageFr), événements (Tous Mobilisés), formations (Onisep) n'ont aucun instantané. À instrumenter par comptage `source` dans Strapi et facette Meilisearch pour pouvoir leur appliquer la même grille de décision.
4. **Valeurs mortes dans l'enum stage** (constat détaillé plus haut, section « Le même travers se retrouve ailleurs »). `welcome to the jungle` et `jobijoba` (`sourceDesDonnéesStage.ts:3` et `:4`) : résidu à purger, ou sources encore alimentées ? À confirmer contre le flux ETL réel.
5. **Schéma CMS `annonce-de-logement`.** L'enum `source` côté schéma Strapi n'est pas vérifiable depuis le dépôt front. À contrôler dans `1j1s-main-cms` avant tout retrait de partenaire.
6. **Hébergement Meilisearch et MinIO hors du Terraform.** L'audit d'infrastructure signale que ces deux briques, critiques pour servir et stocker la donnée partenaire, ne sont pas décrites dans le Terraform des dépôts (le code qui provisionne l'infrastructure). Qui les porte contractuellement reste à établir.

## Sources

Faits vérifiés dans le dépôt front (`1j1s-front`) :

- Type TypeScript des sources logement : `src/server/logements/domain/annonceDeLogement.ts:71`.
- Enum des sources stage (pattern identique, avec valeurs mortes) : `src/server/stages/repository/sourceDesDonnéesStage.ts:1` à `:9`.
- Affichage divergent selon `source` (logo diffuseur) : `src/client/components/features/Logement/Consulter/ConsulterAnnonce.tsx:101` à `:118`.
- Liste blanche des domaines d'images logement : `next.config.js:16` (`LOGEMENT_IMAGE_URL_LIST`).
- Lecture de l'index Meilisearch logement par le front : `src/pages/logements/annonces/index.page.tsx:24`.
- Clients HTTP des API temps réel présents dans le front (exemples) : `src/server/offres/configuration/france-travail/franceTravailHttpClient.config.ts`, `src/server/engagement/configuration/api-engagement/apiEngagementHttpClient.config.ts`.
- Absence de client HTTP vers les partenaires batch dans le front (corrobore leur nature amont) : recherche sur `src/`, aucun résultat hors valeurs d'enum `source`.

Faits d'origine externe, non vérifiables depuis ce dépôt (attribués à leur source, marqués comme tels) :

- Volumes logement (69 838 / 5 743) : comptage direct sur la base Strapi de production, 23 avril 2026, non rejoué ici.
- Charge de retraitement (Immojeune ~870/matin, Studapart 100 %) : observations sur les exécutions ETL, non rejouées ici.
- Absence de seuil de sécurité et d'alerte de fraîcheur, dernière modification code ETL Studapart en juin 2024, schéma CMS `annonce-de-logement` : relèvent des dépôts `1j1s-etl` et `1j1s-main-cms`. **NON CONFIRMÉ** depuis le dépôt front.
