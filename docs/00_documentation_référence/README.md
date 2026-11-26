# Documentation de référence 1j1s-front

_Corpus de passation. Dernière mise à jour de cet index : 31 juillet 2026._

## Pourquoi ce corpus existe

Ce dossier prépare la **reprise du front `1j1s-front` par une nouvelle équipe**. Il rassemble, sous une forme pédagogique et autoportante, tout ce qu'il faut pour comprendre le produit, le faire tourner, le déployer et le maintenir sans avoir à interroger l'équipe sortante.

Chaque document est écrit pour **deux lecteurs à la fois** :

1. **Celui qui découvre le sujet.** Il ne connaît ni le code, ni le métier, ni l'historique. Chaque document lui donne d'abord le modèle mental (le « pourquoi ») avant la mécanique (le « comment »).
2. **Celui qui doit décider.** Product owner qui arbitre une évolution, tech lead qui planifie la dette, personne d'astreinte à 3 h du matin. Chaque document se termine par la conséquence actionnable plutôt que par une simple description.

Un principe traverse tout le corpus : **une information a un seul endroit canonique**. Si un sujet est déjà bien traité ailleurs (documentation Docusaurus existante, code source, `package.json`), le document renvoie à la source plutôt que de la recopier. Recopier ferait diverger les versions et rendrait l'erreur invisible.

## Comment lire, selon qui vous êtes

| Vous êtes | Lisez dans cet ordre | Vous pouvez ignorer |
| --- | --- | --- |
| **Product owner / métier** | `00_produit/01`, `02`, `03`, `04` | tout `01_architecture` sauf le §2 (flux) |
| **Développeur qui arrive** | `02_exploitation/01` (installer), puis `00_produit/01` (le produit), puis `01_architecture/01`, `05`, `04` | `03_maintenance` au premier jour |
| **Personne d'astreinte / exploitation** | `02_exploitation/03` (où regarder quand ça casse), `01_architecture/03` (intégrations), `02_exploitation/02` (déploiement, rollback) | `00_produit` |
| **Tech lead qui planifie** | `03_maintenance/01` (dette, roadmap), `01_architecture/02` (écosystème), `01_architecture/06` (flags) | les procédures pas à pas |

Le point d'entrée universel, quel que soit le rôle, reste `00_produit/01_le_produit_1j1s.md` : c'est le seul document qui suppose zéro connaissance préalable.

## Carte du corpus (les fichiers à créer)

Légende de la colonne **Type** (voir la méthode d'écriture pour le détail) :

- **A · Référence** : explique un mécanisme, un fonctionnement, un outil.
- **B · Décision** : tranche un choix, nomme ce qu'on concède et quand réviser.
- **C · Méthode** : comment faire, étape par étape, avec critères de sortie.

Légende de la colonne **Statut** : `matière` = brouillon de travail déjà présent dans `matière_première/`, à transformer en document pédagogique ; `neuf` = à rédiger à partir du code et des sources.

### `00_produit/` : comprendre le service (sans lire de code)

| Fichier | Question à laquelle il répond | Type | Statut | Sources |
| --- | --- | --- | --- | --- |
| `01_le_produit_1j1s.md` | C'est quoi 1jeune1solution, pour qui, quelles grandes familles de services ? | A | neuf | `matière_première/ancienne_intro.md`, `docs/docs/architecture/fonctionnalites.md`, en-tête de `Carto_user.md` |
| `02_cartographie_des_parcours.md` | Quels sont tous les parcours du site, par quelle porte y accède-t-on, lesquels sont conditionnés par un flag ? | A | matière | `matière_première/Carto_user.md` (67 pages, 11 familles) |
| `03_parcours_cej_demande_de_contact.md` | Comment marche une demande de contact, du clic de l'utilisateur jusqu'aux équipes de rappel (exemple du CEJ) ? | A | matière | `matière_première/Carto_CEJ.md` |
| `04_les_partenaires_de_donnees.md` | Qui fournit les données du site, en quel volume, et à quels signaux faut-il envisager de rompre ou renouveler un partenariat ? | B | matière | `matière_première/Carto_studapart_immojeune.md` (partie PO), `Carto_service_externes.md` |

### `01_architecture/` : comprendre comment c'est bâti

| Fichier | Question à laquelle il répond | Type | Statut | Sources |
| --- | --- | --- | --- | --- |
| `01_architecture_du_front.md` | Comment le code est-il découpé (client, pages, server, styles) et comment une page est-elle rendue (SSG, ISR, SSR, CSR) ? | A | neuf | `docs/docs/architecture/architecture.md` (2023, à réactualiser sur le code actuel), scan `src/` |
| `02_ecosysteme_et_flux_de_donnees.md` | Comment le front, l'ETL, le CMS, Meilisearch et les logs s'articulent, et où circule la donnée entre eux ? | A | matière | `matière_première/bilan_infra.md`, `ancienne_intro.md`, `Carto_service_externes.md` (schéma de flux) |
| `03_integrations_externes.md` | À quels services externes le front parle-t-il, comment s'authentifie-t-il à chacun, lesquels sont mockables ? | A | matière | `matière_première/Carto_service_externes.md`, `comptes_services_externes_vault.md` (pointeur comptes, sans secret) |
| `04_recherche_meilisearch.md` | Comment fonctionne la recherche (stages, logements, métiers), qui alimente les index et pourquoi le front ne fait que lire ? | A | neuf | `Carto_user.md` (parcours Meilisearch), `ancienne_intro.md` (guide Meilisearch), `docs/docs/tuto/recherche-indexe.md` |
| `05_anatomie_dun_appel_bff.md` | Quand on ajoute une route BFF, comment traverse-t-on la stack (page, controller, useCase, repository, service externe) et à quoi sert le pattern `Either` ? | C | neuf | `docs/docs/architecture/architecture.md` (section server), `Carto_CEJ.md` (archi hexagonale), scan `src/server/` et `src/pages/api/` |
| `06_feature_flags_et_configuration.md` | En quoi le site « affiché en prod » diffère du « code », via quels flags `NEXT_PUBLIC_*` et quelles variables d'environnement ? | A | neuf | `Carto_user.md` (flags par parcours), `Carto_service_externes.md` (variables), scan `.env.test` |

### `02_exploitation/` : le faire tourner et le déployer

| Fichier | Question à laquelle il répond | Type | Statut | Sources |
| --- | --- | --- | --- | --- |
| `01_installation_et_dev_local.md` | Comment lance-t-on le front en local, et comment le branche-t-on aux données de recette ou à un CMS local ? | C | neuf | `docs/docs/onboarding/1-installation.md`, `2-aller-plus-loin.md`, `docs/docs/tuto/depannage.md`, `README.md` du repo |
| `02_deploiement_et_environnements.md` | Comment un changement passe de `main` à la recette puis à la production, et comment revient-on en arrière ? | C | matière | `ancienne_intro.md` (section déploiement), `docs/docs/onboarding/3-mep.md`, `bilan_infra.md` |
| `03_infrastructure_scalingo_et_observabilite.md` | Quelles apps tournent sur Scalingo avec quels addons, et où regarde-t-on en premier quand un flux casse ? | A | matière | `bilan_infra.md` (§4 déploiements), `Carto_service_externes.md` (monitoring), `Carto_studapart_immojeune.md` (observabilité) |

### `03_maintenance/` : durer

| Fichier | Question à laquelle il répond | Type | Statut | Sources |
| --- | --- | --- | --- | --- |
| `01_dette_technique_et_roadmap.md` | Qu'est-ce qui doit être modernisé, dans quel ordre, et quels dépôts morts peut-on décommissionner ? | B | matière | `matière_première/recomandations_2027.md`, `bilan_infra.md` (§6 décommissionnement) |
| `02_flux_etl_par_source_exemple_logement.md` | Comment une donnée partenaire arrive concrètement sur le site, de son dépôt jusqu'à l'affichage (exemple des logements Studapart et Immojeune) ? | A | matière | `matière_première/Carto_studapart_immojeune.md` (partie technique) |

**Total : 15 documents** plus ce README, répartis en 4 pistes de lecture.

## Conventions du corpus

- **Numérotation.** Chaque piste est un dossier préfixé (`00_`, `01_`…) ; chaque document y est numéroté dans l'ordre de lecture conseillé. Le numéro fixe l'ordre de lecture conseillé, indépendamment de toute notion de priorité.
- **Daté et versionné.** Tout document affiche en tête sa date de dernière revue et, quand son contenu dépend d'une version (Next 14, Strapi 4.25, Node 22), la valeur au moment de l'écriture. Un fait sur une cible mouvante sans sa date est un piège.
- **Sourcé.** Toute affirmation technique renvoie à un fichier de code en `chemin:ligne` ou à une source externe. Une affirmation non vérifiée est marquée `NON CONFIRMÉ` plutôt que comblée par une supposition.
- **Concept avant mécanique.** Chaque document ouvre sur le modèle mental avant d'entrer dans le détail, pour rester lisible par quelqu'un qui découvre le sujet.

## Rapport avec l'existant

Trois corpus coexistent dans `docs/`. Ne pas les confondre :

| Corpus | Où | Nature | Statut |
| --- | --- | --- | --- |
| **Cette référence de passation** | `docs/00_documentation_référence/` | Pédagogique, autoportant, à jour (2026), orienté reprise | En construction |
| **Documentation Docusaurus** | `docs/docs/` | Technique, granulaire, historique (2023-2024), publiée sur GitHub Pages | Existant, partiellement daté |
| **Matière première** | `docs/00_documentation_référence/matière_première/` | Brouillons de travail (cartographies, audits) qui alimentent la référence | Source, non destiné à la lecture finale |

Ce corpus **ne réécrit pas** ce que Docusaurus documente encore correctement. Il y renvoie pour :

- les **conventions de code** (`docs/docs/convention/git.md`, `langages.md`) ;
- les **décisions d'architecture** historiques (`docs/docs/adr/`, 11 ADR) ;
- les **tutoriels ciblés** (tracking, campagnes Adform, recherche indexée : `docs/docs/tuto/`).

À l'inverse, quand un document Docusaurus est daté au point d'induire en erreur (l'architecture décrite en 2023, par exemple), la référence de passation le remplace et le signale.

## Ce que ce corpus ne couvre pas

Le front `1j1s-front` fait partie d'une plateforme de plusieurs dépôts. Les briques voisines (`1j1s-etl`, `1j1s-main-cms`, `1j1s-logstash`) ont leur propre documentation dans leurs propres dépôts. Ce corpus les décrit **du point de vue du front** : ce que le front en attend et comment il s'y branche. Il ne se substitue pas à leur documentation interne. Le document `01_architecture/02_ecosysteme_et_flux_de_donnees.md` donne la vue d'ensemble et pointe vers chaque dépôt voisin.

## Maintenir ce corpus

Quand une de ces zones change, le document correspondant est à revoir, et sa date de revue à mettre à jour :

- une **intégration externe** ajoutée ou retirée : `01_architecture/03` et le tableau de `01_architecture/02` ;
- un **feature flag** basculé en production : `01_architecture/06` et la cartographie des parcours `00_produit/02` ;
- une **app Scalingo** créée, mise en veille ou supprimée : `02_exploitation/03` ;
- un **partenaire de données** dont le volume ou le contrat évolue : `00_produit/04` et `03_maintenance/02`.
