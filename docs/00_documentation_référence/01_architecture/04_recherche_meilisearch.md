# La recherche Meilisearch

_S'adresse a un dev qui touche une page de recherche, et un PO qui veut comprendre pourquoi une offre n'apparait pas. Derniere revue : 31 juillet 2026._

Apres lecture, le **dev** sait ou est initialise le client de recherche, quel composant mutualise les quatre pages, comment un index est nomme, ou vivent les constantes de pagination, et pourquoi le front ne peut pas ecrire dans l'index. Le **PO** sait que le front se contente de lire, que l'absence d'une offre se joue en amont (dans le CMS ou l'ETL), et ou regarder en premier pour trancher.

Glossaire minimal, chaque terme est repris une seule fois a son endroit canonique plus bas :

- **Meilisearch** : moteur de recherche instantanee (chaque frappe relance une requete). Service heberge, interroge en HTTP.
- **Index** : la collection de documents interrogeable dans Meilisearch. Un index par type de contenu (`offre-de-stage`, `annonce-de-logement`, `fiche-metier`, `evenement`).
- **CMS Strapi** : le back office de contenu (depot frere `1j1s-main-cms`), source de verite des offres.
- **ETL** : le pipeline `1j1s-etl` qui extrait la donnee des partenaires, la transforme, la charge dans le CMS (extract, transform, load).
- **BFF** : couche serveur du front (`src/pages/api/`) qui relaie certaines API. La recherche Meilisearch ne passe pas par le BFF, le navigateur interroge Meilisearch en direct.
- **react-instantsearch** : la librairie React qui pilote l'interface de recherche (formulaire, resultats, pagination, filtres, synchro URL).
- **Feature flag** : variable d'environnement `NEXT_PUBLIC_*` qui active ou masque une page.
- **Facette** : champ filtrable dont Meilisearch renvoie, pour chaque valeur, le nombre de documents correspondants. Interroger la facette `source` d'un index donne la repartition des documents par partenaire, l'outil de diagnostic de la section 6.

---

## 1. Le probleme

Quatre parcours du site sont des recherches filtrables instantanees : stages, logements, decouvrir les metiers, evenements. Un utilisateur tape, coche un filtre, et les resultats se rafraichissent sans rechargement de page. Ces quatre parcours partagent un seul socle technique.

Deux questions reviennent, une par lecteur :

- Cote **dev** : je dois ajouter un filtre ou une page de recherche, ou est le code partage, comment nommer l'index, quelles constantes sont en dur ?
- Cote **PO** : une annonce existe chez le partenaire mais elle n'apparait pas dans la recherche, est ce un bug du site ?

La reponse a la seconde question conditionne tout le reste : le front ne fabrique jamais le contenu de la recherche, il l'affiche. Une offre manquante se diagnostique en amont. La section 6 en donne l'arbre de decision.

---

## 2. Le concept

Le contenu de la recherche voyage dans un seul sens, des partenaires vers l'ecran, et le front est le dernier maillon, en lecture seule.

```
Partenaires        ETL (1j1s-etl)         CMS Strapi          Meilisearch          Front
externes      →    extract / transform →  (source de     →    (index de        →   react-instantsearch
(Immojeune,        / load                 verite,             recherche,           clef publique
 Studapart,                               PostgreSQL)         heberge)             lecture seule)
 Onisep...)
```

Le point qui distingue Meilisearch du reste de l'application : **deux acteurs distincts touchent l'index, avec des roles opposes**.

```
        ECRIT l'index                                LIT l'index
   ┌──────────────────────┐                    ┌──────────────────────┐
   │  CMS Strapi           │                    │  Front                │
   │  plugin               │──── pousse ───►  Meilisearch  ◄── requete ─│  rechercheClientService
   │  strapi-plugin-       │     les docs                    (clef       │  (react-instantsearch)
   │  meilisearch          │                                  publique)  │
   └──────────────────────┘                    └──────────────────────┘
```

Le CMS pousse les documents dans l'index via un plugin Strapi. Le front interroge cet index avec une clef publique exposee au navigateur (prefixe `NEXT_PUBLIC_`). Cote code du front, aucune fonction d'ecriture d'index (`addDocuments`, `updateDocuments`, `deleteDocument`, creation ou reglage d'index) n'existe : la seule importation de la librairie Meilisearch est le client de recherche `instantMeiliSearch` (verifie section 5). Le front est donc structurellement incapable de modifier ce qu'il affiche. Le perimetre reel de la clef (droit de lecture seule ou non) est un reglage du serveur Meilisearch, hors de ce depot, a confirmer cote Meilisearch Cloud.

Consequence directe pour le PO : quand une offre manque, la cause vit dans le CMS ou dans l'ETL. Le front ne peut pas etre coupable de l'absence d'un document, seulement d'un mauvais nom d'index, d'un flag ferme ou d'un filtre actif dans l'URL (trois causes bornees, traitees section 6).

---

## 3. Les mecanismes

### 3.1 Le client de recherche, initialise une fois

Le client Meilisearch est cree dans le conteneur d'injection de dependances du front, `src/client/dependencies.container.ts:151`, et expose sous le nom `rechercheClientService` (`dependencies.container.ts:159` et `:186`).

```
instantMeiliSearch(baseUrl, apiKey, { keepZeroFacets: true, primaryKey: 'slug' })
```

- **URL et clef** viennent de deux variables d'environnement, lues en `dependencies.container.ts:142` et `:143` : `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL` et `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY`. Le prefixe `STAGE` est un residu historique : ce client unique sert les quatre index, pas seulement les stages.
- **Garde fou** : si l'URL ou la clef manque, l'initialisation leve `DependencyInitException` (`dependencies.container.ts:145` a `:150`). Une page de recherche ne peut pas demarrer sans ces deux valeurs.
- **`primaryKey: 'slug'`** : l'identite d'un document dans l'index est son slug. C'est par ce champ que Meilisearch dedoublonne. Pour le PO, le slug est l'identifiant stable d'une offre a travers toute la chaine.
- **`keepZeroFacets: true`** : une valeur de filtre qui ne ramene aucun resultat reste affichee (utile pour montrer a l'utilisateur les options existantes).

### 3.2 Le composant mutualise `InstantSearchLayout`

Les quatre pages ne redefinissent pas la mecanique de recherche, elles reutilisent `src/client/components/layouts/InstantSearch/InstantSearchLayout.tsx`. Ce composant :

- recupere le client via `useDependency('rechercheClientService')` (`InstantSearchLayout.tsx:56`) ;
- monte le contexte `<InstantSearch searchClient indexName={meilisearchIndex} routing>` (`:71`). L'attribut `routing` synchronise les filtres avec l'URL, chaque changement de filtre relance une requete HTTP vers Meilisearch ;
- fixe le nombre de resultats par page avec `<Configure hitsPerPage={nombreDeResultatParPage} />` (`:79`) ;
- affiche les resultats via `<Hits>` et la pagination via `MeiliSearchPagination` (`:144`, `:147`).

Chaque page injecte ses propres pieces variables en props : le nom d'index, le formulaire de filtres, le composant de resultat, les libelles, le nombre de resultats par page. Le socle (contexte de recherche, requetage, pagination, comptage) reste dans le layout.

### 3.3 Les quatre parcours, index et pagination

Le nom d'index et le nombre de resultats par page sont definis **dans chaque page**, sans constante partagee. La colonne « provenance du nom » porte le piege : deux index sont nommes par variable d'environnement, deux sont ecrits en dur dans le code.

| Parcours | Page (chemin:ligne) | Nom d'index (valeur/source) | Provenance du nom | Resultats/page | Feature flag |
| --- | --- | --- | --- | --- | --- |
| Stages | `src/pages/stages/index.page.tsx:15` | `NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE` | variable d'env | `HITS_PER_PAGE = 15` (`:14`) | aucun |
| Logements | `src/pages/logements/annonces/index.page.tsx:24` | `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT` | variable d'env | `ANNONCE_PAR_PAGE = 9` (`:20`) | `NEXT_PUBLIC_LOGEMENT_FEATURE` (`:23`) |
| Decouvrir les metiers | `src/pages/decouvrir-les-metiers/index.page.tsx:17` | `'fiche-metier'` | litteral en dur | `HITS_PER_PAGE = 15` (`:18`) | aucun |
| Evenements | `src/pages/evenements/index.page.tsx:14` | `'evenement'` | litteral en dur | `HITS_PER_PAGE = 15` (`:13`) | `NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE` (`:18`) |

Lectures de ce tableau qui changent une action :

- **Le nom d'index n'est pas mutualise.** Pour stages et logements, changer d'index se fait par variable d'environnement (sans redeploiement de code). Pour metiers et evenements, la chaine est ecrite dans le fichier, tout changement passe par un commit.
- **La pagination n'est pas mutualisee non plus.** La constante est redefinie dans chaque page, sous deux noms differents (`HITS_PER_PAGE`, `ANNONCE_PAR_PAGE`) et deux valeurs differentes (15 partout sauf logements a 9). Modifier « le » nombre de resultats par page suppose de toucher chaque page concernee.
- **Deux pages sont conditionnees par un flag.** Logements ferme rend `ErrorUnavailableService` si le flag vaut autre chose que `'1'` ou si l'index est vide (`logements/annonces/index.page.tsx:32`). Evenements, flag ferme, affiche une page d'atterrissage avec deux boutons sortants (France Travail et l'UNML, Union nationale des missions locales) au lieu de la recherche (`evenements/index.page.tsx:23`). Stages et metiers n'ont pas de flag.

### 3.4 Cote CMS : qui remplit l'index (NON CONFIRME depuis ce depot)

Le remplissage de l'index vit dans le depot frere `1j1s-main-cms`, hors de ce depot. D'apres la matiere premiere de passation (`matière_première/ancienne_intro.md:172,181`, qui decrit le CMS et l'ETL) :

- le CMS synchronise ses contenus vers Meilisearch via le plugin `strapi-plugin-meilisearch` ;
- la configuration de l'index (attributs recherchables, facettes) est cote CMS, dans `config/meilisearch/`.

Quatre types de contenu sont indexes, un par parcours : offre de stage, annonce de logement, fiche metier, evenement. Cette liste tient aux noms d'index effectivement interroges cote front (`'evenement'` et `'fiche-metier'` en dur, plus les deux variables `NEXT_PUBLIC_INDEX_*`), corrobores par `docs/docs/tuto/recherche-indexe.md:25-28`.

**NON CONFIRME depuis ce depot** : le nom du plugin et l'emplacement de sa config restent a valider dans `1j1s-main-cms`, hors du perimetre de `1j1s-front-fork`.

---

## 4. Limites et pieges

- **Piege du client legacy dans l'ETL.** La matiere premiere (`matière_première/ancienne_intro.md`) signale que l'ETL `1j1s-etl` embarque un ancien client Meilisearch (`MeilisearchIndexingClient`) qui n'indexe plus rien : tout passe par le plugin Strapi. Un dev qui remonterait la chaine cote ETL risque de croire que l'ETL ecrit dans Meilisearch. Il n'ecrit que dans le CMS, le CMS pousse ensuite vers Meilisearch. **NON CONFIRME depuis ce depot** (code dans `1j1s-etl`).
- **Le front ne peut pas reparer une recherche vide.** Aucun bouton, aucune route BFF cote front ne reindexe. Le refresh d'index se declenche cote CMS (voir section 6).

---

## 5. Certitude

Confirme par lecture du code de ce depot :

- Client `instantMeiliSearch` initialise, `dependencies.container.ts:151`, expose comme `rechercheClientService` (`:159`, `:186`).
- Variables du moteur `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL` et `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY`, garde fou `DependencyInitException`, `dependencies.container.ts:142` a `:150`.
- Composant `InstantSearchLayout` present et mutualise, dossier `src/client/components/layouts/InstantSearch/`, consomme par les quatre pages (stages, logements/annonces, decouvrir-les-metiers, evenements).
- Noms d'index par variable : `NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE` (`stages/index.page.tsx:15`), `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT` (`logements/annonces/index.page.tsx:24`). Noms en dur : `'fiche-metier'` (`decouvrir-les-metiers/index.page.tsx:17`), `'evenement'` (`evenements/index.page.tsx:14`).
- **Front en lecture seule** : recherche `addDocuments|updateDocuments|deleteDocument|new MeiliSearch|createIndex|updateSettings|setSettings` sur tout `src` : aucune occurrence. Seule presence Meilisearch cote ecriture d'API : nulle. Le front ne fait qu'importer le client de recherche.
- Pagination `HITS_PER_PAGE = 15` (stages, evenements, metiers), `ANNONCE_PAR_PAGE = 9` (logements).

NON CONFIRME (a valider hors de ce depot ou non trouve) :

- **`NOMBRE_MAX_RESULTATS` : constante fantome.** Une note de passation (`matière_première/Carto_user.md:230`) la citait « en dur » a 2000, aux cotes de `HITS_PER_PAGE=15`. La recherche sur tout `src` ne renvoie aucune constante de ce nom ; seul `HITS_PER_PAGE` existe. La seule constante « NOMBRE_MAX » du front est `NOMBRE_MAX_REQUETES_PARALLELES_CMS = 5` (`src/server/cms/infra/repositories/strapi.service.ts:23`), qui borne les requetes paralleles vers le CMS et reste sans rapport avec la pagination de recherche. Le plafond de resultats total releve d'un reglage serveur Meilisearch (`maxTotalHits`), hors de ce depot.
- Les quatre types de contenu cote CMS, le plugin `strapi-plugin-meilisearch` et sa config : depot `1j1s-main-cms`.
- Le client legacy `MeilisearchIndexingClient` inutilise : depot `1j1s-etl`.

---

## 6. Ce que ca change

Quand une recherche est vide ou qu'une offre manque, ne pas partir du front. Descendre l'arbre suivant, du plus aval (ce que voit l'utilisateur) vers l'amont (le partenaire).

```
Une offre n'apparait pas dans la recherche
│
├─ 1. Meilisearch a-t-il le document ?
│     Verifier par une facette sur le champ « source » de l'index concerne,
│     ou une recherche par slug directement dans l'index Meilisearch.
│
│     ├─ OUI, present dans Meili, mais le front ne l'affiche pas
│     │     → cause cote FRONT, bornee a trois points :
│     │        a) le flag de la page est-il ouvert ?
│     │           (NEXT_PUBLIC_LOGEMENT_FEATURE, NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE)
│     │        b) le nom d'index pointe-t-il sur le bon index ?
│     │           (env NEXT_PUBLIC_INDEX_* pour stages/logements ;
│     │            litteral 'fiche-metier'/'evenement' pour metiers/evenements)
│     │        c) un filtre actif dans l'URL masque-t-il l'offre ?
│     │
│     └─ NON, absent de Meili
│           → 2. Strapi (le CMS) a-t-il le document ?
│              Comptage via l'API Strapi, filtre par source.
│
│              ├─ OUI, present dans Strapi mais pas dans Meili
│              │     → synchro CMS vers Meili en defaut :
│              │        declencher un « refresh » de l'index depuis le plugin
│              │        Meilisearch cote Strapi.
│              │
│              └─ NON, absent de Strapi
│                    → probleme AMONT (ETL ou partenaire) :
│                       le document n'a jamais ete charge, ou a ete supprime
│                       (flux tronque, suppression en cascade).
│                       Voir la chaine complete cote amont.
```

Points d'observation concrets, du plus rapide au plus profond :

- **Facette `source` dans Meilisearch** : donne la repartition par partenaire dans l'index (par exemple `immojeune` contre `studapart` pour le logement). Elle s'obtient depuis l'interface Meilisearch (dashboard Meilisearch Cloud), ou par un appel de recherche avec le parametre `facets` sur le champ `source` ; l'URL du moteur est celle de `NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL`, l'acces d'administration vit cote Meilisearch Cloud, hors de ce depot. Un ecart brutal signale un probleme d'indexation.
- **Comptage cote Strapi** : le nombre de documents par source dans le CMS est la reference. Si Meili est en dessous, la synchro est en cause. Si Strapi est deja en dessous, le probleme est plus amont.
- **Refresh d'index cote Strapi** : c'est l'action qui repousse le contenu du CMS vers Meilisearch. Elle se declenche dans le CMS, pas depuis le front.

Pour la chaine amont complete (partenaire vers ETL vers CMS, avec l'exemple du logement et de ses modes de defaillance), voir `../03_maintenance/02_flux_etl_par_source_exemple_logement.md`.

---

## Questions ouvertes pour la nouvelle equipe

- **Plafond de resultats total.** Le comportement au dela de quelques centaines de resultats depend du reglage `maxTotalHits` de l'index Meilisearch (constante `NOMBRE_MAX_RESULTATS` refutee en section 5). Verifier sa valeur cote Meilisearch Cloud et decider si un plafond explicite doit exister.
- **Nommage des index a harmoniser.** Deux index par variable d'environnement, deux en dur : est ce un choix (les stages et logements changent d'index selon l'environnement) ou une dette a lisser ?
- **Etat des flags en production.** `NEXT_PUBLIC_LOGEMENT_FEATURE` et `NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE` conditionnent l'existence meme de deux recherches. Leur valeur en prod n'est pas dans le code (elle vit dans Scalingo, hors du code versionne), a confirmer sur l'environnement cible.

---

## 7. Pour aller plus loin (fichiers qui font foi)

- `src/client/dependencies.container.ts:142` a `:159` : creation du client de recherche.
- `src/client/components/layouts/InstantSearch/InstantSearchLayout.tsx` : socle mutualise des quatre pages.
- `src/pages/stages/index.page.tsx`, `src/pages/logements/annonces/index.page.tsx`, `src/pages/decouvrir-les-metiers/index.page.tsx`, `src/pages/evenements/index.page.tsx` : les quatre entrees de recherche.
- `src/client/components/ui/Meilisearch/` : briques d'interface (formulaires, pagination, tags de filtres actifs, comptage).
- Depot `1j1s-main-cms`, `config/meilisearch/` : configuration des index (hors de ce depot).
- `../00_produit/04_les_partenaires_de_donnees.md` : qui alimente quel contenu, cote produit.
- `../03_maintenance/02_flux_etl_par_source_exemple_logement.md` : la chaine amont detaillee.
