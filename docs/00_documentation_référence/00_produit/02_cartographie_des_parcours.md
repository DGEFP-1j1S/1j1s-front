# Cartographie des parcours utilisateur

_S'adresse à un PO qui veut la vue exhaustive des parcours, et à un dev qui cherche par quelle page entre un parcours. Dernière revue : 31 juillet 2026._

Après lecture, le PO connaît les 11 familles de parcours du site et sait lesquels sont masqués par un feature flag ; le dev sait, pour n'importe quel parcours, quelle URL en est la porte d'entrée, quel fichier `*.page.tsx` la rend, comment elle est rendue et vers quels partenaires elle sort.

## 1. Le problème

Le front 1j1s expose 69 pages utilisateur réparties sur des dizaines de parcours métier hétérogènes : moteurs de recherche, formulaires multi étapes, landings éditoriales, redirections sortantes. Une partie de ces parcours n'apparaît dans le menu que si une variable d'environnement les active, si bien que le site tel qu'il tourne en production diffère du site tel qu'il est dans le code. Sans carte d'entrée, une nouvelle équipe ne sait ni par où un utilisateur arrive sur une fonctionnalité, ni pourquoi une page qu'elle voit dans `src/pages/` reste invisible en production.

## 2. Le concept

Le modèle mental tient en une phrase : **le site est un ensemble de parcours, chaque parcours a une porte (une URL), et derrière la porte se trouvent quatre choses**.

1. **Une famille métier.** Un parcours appartient à l'une des 11 familles (emploi, alternance, stages, formation, engagement, logement, accompagnement, Europe, employeurs, contenu éditorial, transverse). La famille répond au « à quoi ça sert ».
2. **Un mode de rendu.** La page se fabrique à la construction du site, à la demande, à chaque requête, ou entièrement dans le navigateur. Le mode décide de la fraîcheur des données et du référencement.
3. **Une source de données.** Contenu statique du code, contenu du CMS Strapi, index Meilisearch, ou API partenaire relayée par la couche interne.
4. **Des sorties externes.** Beaucoup de parcours ne font qu'orienter l'utilisateur vers un partenaire (France Travail, La Bonne Alternance, Diagoriente, Onisep).

Sur cette structure se greffe un cinquième trait, transverse : **certaines portes sont conditionnelles**. Un feature flag (variable `NEXT_PUBLIC_*_FEATURE`) décide, à la construction ou côté navigateur, si une entrée de menu apparaît ou si une page bascule d'un mode à l'autre. C'est le mécanisme qui explique l'écart entre code et production.

### Glossaire des termes (définis une fois)

| Terme | Sens dans ce document |
| --- | --- |
| **SSG** | Static Site Generation. Page fabriquée une fois à la construction, via `getStaticProps` sans `revalidate`. HTML figé jusqu'au prochain build. |
| **ISR** | Incremental Static Regeneration. `getStaticProps` avec `revalidate` : page statique régénérée périodiquement en arrière plan. Sur les pages CMS de ce projet, la durée vient du CMS (`dependencies.cmsDependencies.duréeDeValiditéEnSecondes()`), pas d'un chiffre en dur. |
| **SSR** | Server Side Rendering. `getServerSideProps` : HTML recalculé à chaque requête. Données toujours fraîches, coût serveur à chaque visite. |
| **CSR** | Client Side Rendering. Ni `getStaticProps` ni `getServerSideProps` : la page arrive quasi vide et se remplit dans le navigateur. Utilisé pour les moteurs Meilisearch et les landings sans donnée serveur. |
| **BFF** | Back for front. Couche API interne de 1j1s (`src/pages/api/`, `src/server/`) qui relaie les API partenaires. Détaillée hors de ce document, citée ici comme source de données. |
| **CMS** | Système de gestion de contenu : back-office éditorial où l'équipe saisit le contenu servi au front (FAQ, actualités, pages légales, fiches). |
| **Strapi** | Le CMS open source utilisé ici, hébergé dans l'app Scalingo `1j1s-main-cms`. « CMS Strapi » dans les tableaux désigne cette source. |
| **Meilisearch** | Moteur de recherche interrogé directement depuis le navigateur via `react-instantsearch`. Le contenu est poussé dans un index nommé par une variable d'environnement. |
| **InstantSearchLayout** | Layout React mutualisé (`src/client/components/layouts/InstantSearch/InstantSearchLayout.tsx`) qui branche une page sur un index Meilisearch. |
| **feature flag** | Variable `NEXT_PUBLIC_*_FEATURE` qui active ou masque un parcours. Valeur `'1'` active, `'0'` désactive, sauf `OLD_ESPACE_JEUNE_FEATURE` dont la logique est inversée (voir famille G). |
| **LBA** | La Bonne Alternance, service public partenaire de l'alternance. Domaine `labonnealternance.apprentissage.beta.gouv.fr`. |
| **landing** | Page éditoriale de présentation, sans moteur de recherche interne. |
| **hub** | Page d'aiguillage qui liste des sous parcours sous forme de cartes ou de liens. |
| **wizard** | Formulaire découpé en plusieurs pages successives avec un état conservé d'une étape à l'autre. |

## 3. Les mécanismes : les 11 familles

Chaque famille donne son concept, un tableau de ses parcours, et un encart « Questions ouvertes » qui reprend ce que la matière de départ n'a pas tranché. La colonne **Piège** signale la conséquence ou le point d'attention propre à chaque ligne. Les URL dynamiques s'écrivent avec le segment variable entre crochets (`[id]`).

### A. Emploi et jobs

Mise en relation avec des offres d'emploi de France Travail (ex Pôle Emploi), avec pagination et filtres côté serveur. C'est la famille la plus dépendante d'un partenaire unique.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Rechercher un emploi | `/emplois` (menu Offres > Emplois) et `/emplois/[id]` | SSR | BFF France Travail | France Travail | Panne France Travail bascule vers `/maintenance-france-travail` (voir famille T, ligne Pages d'erreur) |
| Rechercher un job étudiant | `/jobs-etudiants` (+ `/[id]`) | SSR | BFF France Travail | France Travail | Structure quasi identique à `/emplois` : mutualisation réelle NON CONFIRMÉE |
| Rechercher un job d'été | `/jobs-ete` (+ `/[id]`) | SSR | BFF France Travail | France Travail | Entrée menu masquée sauf `NEXT_PUBLIC_JOB_ETE_FEATURE='1'` |
| Rechercher un emploi en Europe | `/emplois-europe` (+ `/[id]`) | SSR | BFF (flux Europe) | à confirmer (EURES via France Travail) | Entrée menu masquée sauf `NEXT_PUBLIC_EMPLOIS_EUROPE_FEATURE='1'` ; source réelle NON CONFIRMÉE |
| Déposer une offre d'emploi | `/emplois/deposer-offre` (CTA depuis `/emplois`) | CSR | contenu statique | `pro.francetravail.fr/depotoffrerecruteur/accueil` | Page de transition sortante, confirmée `src/pages/emplois/deposer-offre/index.page.tsx:39` |
| Créer mon CV | `/creer-mon-cv` (menu Aides et outils) | CSR | contenu statique | `diagoriente.fr` | Redirection vers Diagoriente, confirmée `src/pages/creer-mon-cv/index.page.tsx:21` |

**Questions ouvertes pour la nouvelle équipe (A)**
- Quels filtres sont réellement exposés sur `/emplois` et lesquels persistent en query string ? Comment la pagination combine SSR initial et pagination au clic côté client ?
- Quelle est la source réelle d'`/emplois-europe` (BFF dédié, EURES direct, France Travail International) et son schéma de données (pays, devise, langue) ?
- Les sorties `/emplois/deposer-offre` et `/creer-mon-cv` sont elles tracées en analytics comme des sorties ?

### B. Alternance

Point de friction majeur : la navigation principale sort **directement vers La Bonne Alternance** pour « Contrats d'alternance » et « Je recrute un apprenti », sans page intermédiaire 1j1s. Les pages internes `/apprentissage*` restent accessibles par l'accueil, le SEO, les campagnes ou des liens directs ; le menu principal, lui, sort directement vers La Bonne Alternance et contourne ces pages.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Sortie menu « Contrats d'alternance » et « Découvrir sa voie avec l'apprentissage » | Menu Offres et menu Formations | (pas de page interne) | n/a | `LBA_CANDIDAT_URL` | Lien sortant direct, confirmé `NavigationStructure.tsx:33` et `:60` |
| Détail alternance | `/apprentissage/[id]`, `/apprentissage/entreprise/[id]` (liens LBA/partenaires) | SSR | BFF connecté à LBA | LBA | Recherche amont hébergée chez LBA, aucune liste interne `/apprentissage` |
| Landing jeunes | `/apprentissage` (campagne, lien direct) | SSR | CMS Strapi ou statique | | SSR pour une landing : justification NON CONFIRMÉE |
| Landing entreprises | `/apprentissage-entreprises` (campagne recruteurs) | CSR | statique | LBA recruteurs | Chevauche `/je-recrute` et `/je-recrute-afpr-poei` (famille I) |
| Landing pédagogique | `/choisir-apprentissage` (accueil, campagne) | CSR | statique | | Coexiste avec `/apprentissage` : choix éditorial ou dette NON CONFIRMÉ |
| Déposer une offre alternance | `/apprentissage/deposer-offre` (CTA pages alternance) | CSR | iframe widget LBA | LBA (widget dépôt d'offre) | Iframe du widget LBA `espace-pro/widget/1J1S` construit sur `NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL`, confirmé `src/pages/apprentissage/deposer-offre/index.page.tsx:11` et `:38` |

`LBA_CANDIDAT_URL` et `LBA_RECRUTEUR_URL` sont construites dans `src/shared/lbaLandingUrls.ts`. Base candidat `labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution`, base recruteur `.../1jeune1solution-recruteurs`, toutes deux surchargeables par `NEXT_PUBLIC_LBA_LANDING_CANDIDAT_URL` et `NEXT_PUBLIC_LBA_LANDING_RECRUTEUR_URL`, avec paramètres UTM (paramètres de traçage marketing d'un lien) ajoutés (`lbaLandingUrls.ts:1` à `:8`).

**Questions ouvertes pour la nouvelle équipe (B)**
- Le choix de sortir vers LBA depuis le menu, sans page intermédiaire, est il assumé et tracé ? Impact sur le taux de rebond et l'analytics ?
- Trois landings coexistent (`/apprentissage`, `/choisir-apprentissage`, `/apprentissage-entreprises`) : redondance éditoriale à cartographier avant toute refonte.

### C. Stages

Famille centrale de 1j1s. Elle porte le parcours interactif le plus riche : moteur Meilisearch sur le contenu du CMS, wizard de dépôt d'offre en trois étapes, formulaire de candidature, et bandeau de feedback.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Rechercher un stage | `/stages` (menu Offres > Stages d'études, accueil) | CSR | index Meilisearch `NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE` | | Filtres et pagination Meilisearch (`HITS_PER_PAGE`, `NOMBRE_MAX_RESULTATS`) à cartographier |
| Consulter un stage | `/stages/[id]` (clic depuis la liste) | SSR, `noindex` | BFF lisant le CMS | | `noindex` confirmé (`getServerSideProps` + `noindex`, `src/pages/stages/[id].page.tsx`) : offres à durée de vie courte |
| Déposer une offre (wizard) | `/stages/deposer-offre` puis `/votre-offre-de-stage`, `/localisation`, `/confirmation-envoi` | CSR (4 pages) | POST `/api/stages` | | Persistance de l'état entre étapes et comportement au rafraîchissement à tracer |
| Rechercher un stage 3e/2de | `/stages-3e-et-2de` (menu Offres) | SSR | BFF | | Entrée menu masquée sauf `NEXT_PUBLIC_STAGES_3EME_FEATURE='1'` ; même index que `/stages` ou source dédiée NON CONFIRMÉ |
| Candidater à un stage 3e/2de | `/stages-3e-et-2de/candidater` (CTA depuis une offre) | SSR | POST BFF dédié | | Données de mineur (autorisation parentale, RGPD) et canal d'envoi à tracer |
| Feedback « Je donne mon avis » | Bandeau sur les pages stages (`JeDonneMonAvis.tsx`) | composant | | `jedonnemonavis.numerique.gouv.fr` | URL confirmée (Démarche 3639) `JeDonneMonAvis.tsx:10` ; la Démarche 4085 relève d'un autre composant, le bandeau enquête transverse (voir famille T) ; périmètre d'affichage exact à confirmer |
| Sortie « Stages d'observation » | Menu Offres (lien sortant) | (pas de page interne) | n/a | `NEXT_PUBLIC_STAGES_SECONDE_URL` | Visible si `NEXT_PUBLIC_STAGES_SECONDE_RECHERCHE_FEATURE='1'` **et** l'URL est renseignée (`NavigationStructure.tsx:24`) ; destination NON CONFIRMÉE |

**Questions ouvertes pour la nouvelle équipe (C)**
- Wizard de dépôt : où l'état vit il (contexte React, `localStorage`, query string) ? Quelles validations côté client (joi) versus BFF ? Que se passe t il en cas de retour navigateur en milieu de wizard ?
- Flux aval du dépôt et de la candidature : écriture directe en base, mail Tipimail à l'entreprise, ou passage par le CMS ?
- `/stages-3e-et-2de` partage t il l'index Meilisearch de `/stages` ? Pourquoi ce parcours est SSR alors que `/stages` est CSR ?

### D. Formation et orientation

Quatre parcours d'orientation, dont deux moteurs de recherche partenaires (LBA pour l'apprentissage, Onisep pour l'initial) et un moteur Meilisearch pour les fiches métier.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Formation en apprentissage | `/formations/apprentissage` (+ `/[id]`) | SSR | BFF, source LBA | LBA | Entrée menu masquée sauf `NEXT_PUBLIC_FORMATION_LBA_FEATURE='1'` (`NavigationStructure.tsx:54`) ; chemin sous `/formations/` alors que l'initial est à la racine |
| Formation initiale | `/formations-initiales` (+ `/[id]`) | SSR | BFF, source Onisep | Onisep | Entrée menu masquée sauf `NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE='1'` (`NavigationStructure.tsx:50`) |
| Découvrir les métiers | `/decouvrir-les-metiers` (liste) et `/decouvrir-les-metiers/[nomMetier]` (fiche) | liste CSR (Meilisearch) ; fiche **ISR** | index Meilisearch métier ; fiches alimentées par le CMS (import Onisep) | Onisep | **Correction** : la fiche est ISR (`revalidate: 86400`, régénération quotidienne, `src/pages/decouvrir-les-metiers/[nomMetier].page.tsx:76`), pas SSG comme l'indiquait le brouillon |
| Évènements de recrutement | `/evenements` (menu Formations) | CSR, deux modes | index Meilisearch `evenement` ou statique | France Travail, UNML (Union nationale des missions locales) | Bascule pilotée par `NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE` (`src/pages/evenements/index.page.tsx:18`) : `'0'` affiche une landing sortante, `'1'` un moteur Meilisearch |

**Questions ouvertes pour la nouvelle équipe (D)**
- Combien de fiches métier sont générées à la construction, et quel impact sur le temps de build ? Quel est le pipeline complet métier vers ETL vers CMS vers front ?
- Onisep : type d'authentification, clé API, mise en cache (`axios-cache-interceptor`, Redis) ?
- `/evenements` : le mode Meilisearch est il actif en production ? Comment l'index `evenement` est il alimenté ?

### E. Engagement civique

Deux parcours symétriques qui partagent le composant de recherche `RechercherMission` et la même famille d'API.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Service civique | `/service-civique` (+ `/[id]`) (menu Engagement) | SSR | BFF, API Engagement | | Différenciation métier avec le bénévolat (filtres, âges) à tracer |
| Bénévolat | `/benevolat` (+ `/[id]`) (menu Engagement) | SSR | BFF, API Engagement | | Part de code partagée avec le service civique NON CONFIRMÉE |

**Questions ouvertes pour la nouvelle équipe (E)**
- Emplacement exact du composant `RechercherMission` partagé et frontière entre code mutualisé et spécifique.
- Filtres et libellés propres à chaque parcours (âge minimum, type de mission).

### F. Logement

Un moteur Meilisearch pour les annonces, deux landings éditoriales autour des aides et des conseils.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Rechercher un logement | `/logements/annonces` (liste) et `/[id]` (détail) | liste CSR (Meilisearch), détail SSR | index `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT` | | Contenu de recherche masqué sauf `NEXT_PUBLIC_LOGEMENT_FEATURE='1'` (`src/pages/logements/annonces/index.page.tsx:23`), sinon `ErrorUnavailableService` ; détail SSR pour le SEO à confirmer |
| Aides au logement | `/logements/aides-logement` (menu Logement) | CSR | statique ou CMS | à confirmer (Action Logement, CAF, Mes Aides) | Partenaires en dur ou via CMS NON CONFIRMÉ |
| Conseils logement | `/logements/conseils` (menu Logement) | CSR | statique ou CMS | | Origine du contenu (code ou CMS) NON CONFIRMÉE |

**Questions ouvertes pour la nouvelle équipe (F)**
- Source des annonces (ETL depuis bailleurs, saisie CMS) et stratégie au delà du plafond de résultats Meilisearch.
- Partenaires listés sur `/logements/aides-logement` et leur mode de maintenance.

### G. Accompagnement et aides

Famille hétérogène : structures d'accompagnement, dispositifs (CEJ, mentorat), simulateur d'aides, et les deux hubs de services jeunes dont la coexistence est pilotée par flag.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Structure d'accompagnement | `/accompagnement` (menu Accompagnement) | SSR | BFF, API Établissements publics | | Géolocalisation (IP, navigateur, saisie) à tracer |
| Contrat Engagement Jeune | `/contrat-engagement-jeune` (menu Accompagnement) | CSR | statique | | Formulaire `DemandeContactCEJ` POST vers `/api/demandes-de-contact` (type CEJ) ; flux aval à tracer |
| Mentorat | `/mentorat` (menu Accompagnement) | CSR | statique | à confirmer (plateforme mentorat) | Formulaire sur place ou simple redirection NON CONFIRMÉ |
| Mes aides (simulateur) | `/mes-aides` (menu Aides et outils) | CSR | statique | `mes-aides.1jeune1solution.beta.gouv.fr` | Destination confirmée `src/pages/mes-aides/index.page.tsx:21` : sous domaine 1j1s, pas `mes-aides.gouv.fr` |
| Mesures employeurs | `/mesures-employeurs` (menu Je suis employeur) | ISR | CMS Strapi | | Mise à jour éditoriale des mesures à tracer |
| Hub `espace-jeune` (ancien) | `/espace-jeune` | ISR | CMS Strapi | | Visible si `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE='1'` (`src/pages/espace-jeune/index.page.tsx:76`), sinon 404 |
| Hub `services-jeunes` (nouveau) | `/services-jeunes?filtre=...` (liens dans chaque menu) | ISR | CMS Strapi | | Visible si `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE='0'` (`src/pages/services-jeunes/index.page.tsx:97`) : succède à `espace-jeune`, coexistence pilotée par le même flag |

**Point d'attention : le basculement `espace-jeune` vers `services-jeunes`.** Le flag `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE` agit comme un interrupteur à effet inversé, vérifié dans le code :
- valeur `'1'` : l'ancien hub `/espace-jeune` s'affiche (`espace-jeune/index.page.tsx:76`), les actualités et les entrées « services jeunes » du menu disparaissent.
- valeur `'0'` : le nouveau hub `/services-jeunes` s'affiche (`services-jeunes/index.page.tsx:97`), `/actualites` s'active (`actualites/index.page.tsx:58`), et les six liens « Découvrir les services jeunes liés à... » apparaissent dans les menus (`NavigationStructure.tsx:40, 61, 76, 89, 122, 138`).

**Questions ouvertes pour la nouvelle équipe (G)**
- Cheminement d'une demande de contact CEJ après soumission (mail Tipimail, CRM, stockage).
- Mapping exact des filtres `services-jeunes?filtre=...` avec les familles métier, et calendrier de retrait de `/espace-jeune`.

### H. Europe et exploration

Landings éditoriales et redirections vers des dispositifs d'exploration (Europe, entretiens avec des professionnels, entreprendre, permis de conduire).

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Expérience Europe | `/experience-europe` (menu Accompagnement) | CSR | statique | | Deux portes pour le même sujet Europe avec `/emplois-europe` (famille A) |
| MyJobGlasses | `/myjobglasses` (menu Accompagnement) | CSR | statique | MyJobGlasses | Entrée menu masquée sauf `NEXT_PUBLIC_MY_JOB_GLASSES_FEATURE='1'` (`NavigationStructure.tsx:80`) ; landing ou iframe NON CONFIRMÉ |
| Entreprendre | `/entreprendre` (menu Accompagnement) | CSR | statique | à confirmer (BPI, France Num, CCI) | Partenaires liés NON CONFIRMÉS |
| 1jeune1permis | `/1jeune1permis` (menu Aides et outils) | SSG | iframe partenaire | `mes-aides.francetravail.fr/export/1-jeune-1-permis` | `NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE='1'` gate à la fois l'entrée de menu (`NavigationStructure.tsx:133`) et la page, qui renvoie 404 si le flag est absent (`src/pages/1jeune1permis/index.page.tsx:14`) ; iframe France Travail confirmée `:11` |

**Questions ouvertes pour la nouvelle équipe (H)**
- Doublon `/experience-europe` (landing) et `/emplois-europe` (moteur) : deux portes assumées ou à fusionner ?
- Contraintes d'accessibilité et de responsive de l'iframe `/1jeune1permis`.

### I. Employeurs

Le versant employeur de l'app : recrutement, mentorat, immersions, dispositif AFPR/POEI (Action de Formation Préalable au Recrutement et Préparation Opérationnelle à l'Emploi Individuelle), et un « espace » employeur au statut ambigu.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| Hub `je-recrute` | `/je-recrute` (menu employeur) | CSR | statique | | Aiguillage vers les sous parcours ; cartes exposées à cartographier |
| Dispositif AFPR/POEI | `/je-recrute-afpr-poei` (menu employeur) | CSR | statique | | Formulaire d'intérêt ou information seule NON CONFIRMÉ |
| Je deviens mentor | `/je-deviens-mentor` (menu employeur) | CSR | statique | | Même programme que `/mentorat` (famille G) sous l'angle employeur |
| Immersions | `/immersions` (landing) et `/immersions/referencer-mon-entreprise` (formulaire) | CSR | POST BFF (référencement) | | Canal aval du référencement (mail, CMS, Immersion Facilitée) à tracer |
| Les entreprises s'engagent | `/les-entreprises-s-engagent` (menu employeur) | CSR | statique | | Parcours d'engagement concret (formulaire, redirection) NON CONFIRMÉ |
| Mon espace employeur | `/mon-espace` (menu employeur) | CSR | statique | | Authentification réelle NON CONFIRMÉE : landing passerelle ou vrai espace authentifié ? |

**Questions ouvertes pour la nouvelle équipe (I)**
- `/mon-espace` cache t il une authentification (OAuth France Travail, ProConnect) ou n'est ce qu'une passerelle vers un service externe ?
- Chevauchement `/je-recrute`, `/je-recrute-afpr-poei`, `/apprentissage-entreprises` (famille B) à clarifier.

### J. Contenu éditorial et institutionnel

Pages alimentées par le CMS Strapi : FAQ, actualités et articles, mentions légales, plan du site.

| Parcours | Porte d'entrée | Rendu | Source | Sorties externes | Piège |
| --- | --- | --- | --- | --- | --- |
| FAQ | `/faq` (liste) et `/faq/[id]` (détail) (footer) | ISR (liste), SSG (détail) | CMS Strapi | | Le `revalidate` de la liste vient du CMS (`duréeDeValiditéEnSecondes()`, `src/pages/faq/index.page.tsx:67`), pas d'un `revalidate:1` en dur comme l'indiquait le brouillon |
| Actualités et articles | `/actualites` (liste) et `/articles/[id]` (détail) | ISR (liste), SSG (détail) | CMS Strapi (`consulterActualitesUseCase`) | | `/actualites` visible seulement si `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE='0'` (`src/pages/actualites/index.page.tsx:58`) |
| Pages légales | `/mentions-legales`, `/confidentialite`, `/cgu`, `/accessibilite` (footer) | ISR | CMS Strapi | | Accessibilité déclarée « Partiellement conforme » ; workflow de publication à tracer |
| Plan du site | `/plan-du-site` (footer) | CSR | `NavigationStructure` | | Généré depuis la navigation ; les liens services jeunes suivent le même flag (`src/pages/plan-du-site/index.page.tsx:18`) |

**Questions ouvertes pour la nouvelle équipe (J)**
- Distinction actualités (récentes) versus articles (durables) côté CMS.
- Workflow de publication des pages légales : qui modifie, quelle validation, quel délai avant production.

### T. Parcours transverses

La lettre **T** abrège « transverse » : la numérotation saute de J à T, aucune famille K à S n'existe. Cette couche entoure tous les parcours et compte comme onzième famille dans le total de la section 2 : accueil, navigation, footer, pages d'erreur, bandeaux globaux, container Next.js. La navigation est la **source de vérité des portes** : `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx`.

| Élément | Emplacement | Rendu | Rôle | Piège |
| --- | --- | --- | --- | --- |
| Page d'accueil | `/` (`src/pages/index.page.tsx`) | ISR | Hub éditorial, sept sections thématiques, bandeau campagne optionnel | `revalidate` piloté par le CMS ; la variable dérivée `isOldEspaceJeuneActif` (lecture de `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE`, `index.page.tsx:43`) conditionne l'affichage des actualités, en rendu (`:277`) et à la génération des données (`:382`) |
| Navigation header | `NavigationStructure.tsx` + `Header/` | composant | Arborescence des menus, source de vérité des URL | Contient des sorties externes LBA inline (voir famille B) et 14 entrées de menu conditionnées par flag (9 flags distincts, dont `OLD_ESPACE_JEUNE_FEATURE` qui en pilote 6) |
| Footer | `Footer/Footer.tsx` | composant | Liens légaux, liens partenaires institutionnels, FAQ | Traçage analytics des liens sortants à confirmer |
| Pages d'erreur | `/404`, `/_error`, `/maintenance-france-travail` | 404 statique, error boundary, CSR | Erreurs et maintenance dédiée France Travail | Déclencheur de la bascule maintenance (manuel ou fallback BFF) NON CONFIRMÉ |
| Bandeaux globaux | `EnqueteSatisfactionBanner.tsx`, `Campagne/`, Tarteaucitron | composants | Enquête satisfaction, campagne, consentement cookies | Enquête affichée si `NEXT_PUBLIC_ENQUETE_SATISFACTION_FEATURE='1'` (test dans `Header.tsx:13`) ; sortie `jedonnemonavis.numerique.gouv.fr` (Démarche 4085) confirmée dans le code |
| Container Next.js | `_app.page.tsx`, `_document.page.tsx` | n/a | Providers d'injection de dépendances (DI), layout global, Tarteaucitron, analytics, styles | Arborescence des providers et mesure Web Vitals (indicateurs de performance perçue) à tracer |

**Questions ouvertes pour la nouvelle équipe (T)**
- Liste exhaustive des services tiers Tarteaucitron (analytics, pub, fonctionnel, essentiel) et leur état.
- Cohérence desktop/mobile de la navigation : structure identique ou simplifiée sur mobile ?
- Le bandeau « Je donne mon avis » est il global ou restreint aux pages stages ?

### Les parcours conditionnés par un feature flag (réponse directe)

Tableau récapitulatif des flags qui décident de l'apparition d'un parcours ou de son mode. Chaque effet est sourcé dans le code. Les valeurs de production ne sont pas dans le code et restent NON CONFIRMÉES (voir section 5).

| Flag | Parcours affecté | Effet quand actif (`'1'`, sauf mention) | Source |
| --- | --- | --- | --- |
| `JOB_ETE_FEATURE` | `/jobs-ete` | Entrée menu Offres affichée | `NavigationStructure.tsx:34` |
| `EMPLOIS_EUROPE_FEATURE` | `/emplois-europe` | Entrée menu Offres affichée | `NavigationStructure.tsx:36` |
| `STAGES_3EME_FEATURE` | `/stages-3e-et-2de` | Entrée menu Offres affichée | `NavigationStructure.tsx:29` |
| `STAGES_SECONDE_RECHERCHE_FEATURE` (+ `STAGES_SECONDE_URL`) | Sortie « Stages d'observation » | Lien sortant affiché si l'URL est aussi renseignée | `NavigationStructure.tsx:24` |
| `FORMATION_LBA_FEATURE` | `/formations/apprentissage` | Entrée menu Formations affichée | `NavigationStructure.tsx:54` |
| `FORMATIONS_INITIALES_FEATURE` | `/formations-initiales` | Entrée menu Formations affichée | `NavigationStructure.tsx:50` |
| `MY_JOB_GLASSES_FEATURE` | `/myjobglasses` | Entrée menu Accompagnement affichée | `NavigationStructure.tsx:80` |
| `1JEUNE1PERMIS_FEATURE` | `/1jeune1permis` | Entrée menu Aides et outils affichée, et page servie (sinon 404) | `NavigationStructure.tsx:133`, `1jeune1permis/index.page.tsx:14` |
| `LOGEMENT_FEATURE` | `/logements/annonces` | Moteur de recherche affiché, sinon service indisponible | `logements/annonces/index.page.tsx:23` |
| `RECHERCHE_EVENEMENT_FEATURE` | `/evenements` | Mode Meilisearch, sinon landing sortante | `evenements/index.page.tsx:18` |
| `OLD_ESPACE_JEUNE_FEATURE` | `/espace-jeune`, `/services-jeunes`, `/actualites`, 6 liens de menu | **Effet inversé** : `'1'` montre l'ancien hub, `'0'` montre le nouveau hub, les actualités et les liens services jeunes | `espace-jeune:76`, `services-jeunes:97`, `actualites:58`, `NavigationStructure.tsx:40, 61, 76, 89, 122, 138` |
| `ENQUETE_SATISFACTION_FEATURE` | Bandeau enquête (transverse) | Bandeau affiché | `Header.tsx:13` (le test du flag), `EnqueteSatisfactionBanner.tsx:7` (l'URL Démarche 4085) |

## 4. Limites et pièges

Points qui mordent le lecteur, extraits de la vérification du code et non du brouillon.

- **Le menu principal fait fuir vers LBA.** Trois entrées de menu quittent 1j1s sans page intermédiaire : « Contrats d'alternance » (`NavigationStructure.tsx:33`), « Découvrir et trouver sa voie avec l'apprentissage » (`:60`) et « Je recrute un apprenti » (`:106`). Un PO qui analyse le tunnel alternance sur les seules pages `/apprentissage*` mesure un trafic résiduel, l'essentiel partant vers le partenaire.
- **Deux hubs jeunes vivent en parallèle.** `espace-jeune` et `services-jeunes` sont pilotés par le même flag à effet inversé. Toute évolution d'un hub doit se penser sur les deux tant que le retrait de l'ancien n'est pas acté.
- **Trois landings alternance se chevauchent.** `/apprentissage`, `/choisir-apprentissage`, `/apprentissage-entreprises` traitent le même sujet sous trois angles, plus le versant employeur `/je-recrute-afpr-poei`. Risque de dette éditoriale et de dilution SEO.
- **Deux labels de rendu du brouillon étaient faux.** La fiche métier `/decouvrir-les-metiers/[nomMetier]` est ISR quotidienne (`revalidate: 86400`), pas SSG. La FAQ n'a pas de `revalidate:1` en dur, sa durée vient du CMS. Ne pas se fier au brouillon pour un audit de performance ou de fraîcheur.
- **Le mode d'une page peut basculer.** `/evenements` est landing ou moteur selon un flag ; `/logements/annonces` affiche un service indisponible si son flag est à `'0'`. La même URL ne rend pas la même chose selon l'environnement.
- **Le nombre « 67 pages » du brouillon est périmé.** Le décompte réel est 69 pages utilisateur (voir annexe A). Aucune page n'est orpheline, mais la référence chiffrée du brouillon a dérivé.

## 5. Certitude

**Confirmé par le code (échantillon et points structurants vérifiés le 31 juillet 2026)**
- Les 69 fichiers `*.page.tsx` de l'annexe A existent tous sous `src/pages/` : la comparaison entre les chemins de l'annexe et le système de fichiers ne laisse aucun écart dans les deux sens.
- Modes de rendu vérifiés sur échantillon : `/emplois` et `/formations-initiales` en SSR, `/stages` en CSR, `/1jeune1permis` en SSG, `/index`, `/services-jeunes` et `/faq` en ISR piloté par le CMS, `/stages/[id]` en SSR `noindex`, `/decouvrir-les-metiers/[nomMetier]` en ISR (`revalidate: 86400`).
- Sorties externes vérifiées dans le code : Diagoriente, `pro.francetravail.fr`, `mes-aides.1jeune1solution.beta.gouv.fr`, `mes-aides.francetravail.fr`, LBA candidat et recruteur, widget LBA de `/apprentissage/deposer-offre` (`NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL`), `jedonnemonavis.numerique.gouv.fr`.
- Feature flags et leur point d'application : vérifiés aux lignes citées dans le tableau des flags et la famille G.

**NON CONFIRMÉ (à ne pas combler par supposition)**
- **Valeurs de production des flags.** Les flags vivent dans l'environnement Scalingo, sous forme de variables de l'app `1j1s-front-prod`, hors du code versionné. Ce document dit quel parcours un flag conditionne ; son état allumé ou éteint en production se lit dans ces variables. Le site « tel qu'affiché » demande donc de les consulter.
- **Sources réelles** d'`/emplois-europe` (EURES ou autre), des annonces logement, des partenaires d'`/entreprendre` et de `/logements/aides-logement`.
- **Statut d'authentification de `/mon-espace`.**
- **Déclencheur de `/maintenance-france-travail`** (manuel ou fallback BFF).
- **Flags présents dans le code mais non tracés jusqu'à un parcours** : `ALTERNANCE_LBA_FEATURE`, `STAGES_SECONDE_FEATURE`, `STAGES_SECONDE_RECHERCHE_JEUNE_FEATURE`, `WORLD_SKILLS_FEATURE`, `MY_JOB_GLASSES_CAMPAGNE_FEATURE`, `CAMPAGNE_ADFORM_FEATURE`, `CAMPAGNE_APPRENTISSAGE_FEATURE`, `CAMPAGNE_COM_EN_COURS_FEATURE`, et les flags analytics (`ANALYTICS_EULERIAN_FEATURE`, `ANALYTICS_MATOMO_FEATURE`, `ANALYTICS_MATOMO_TAG_MANAGER_FEATURE`). Leur effet exact reste à établir.

La couche BFF (`src/pages/api/`) et la couche serveur (`src/server/`) sont hors du périmètre de ce document ; elles se traitent dans une cartographie technique séparée.

## 6. Ce que ça change

- **Pour le PO.** La vue exhaustive des parcours passe par les 11 familles de la section 3, mais la vue du site « réel » exige de croiser cette carte avec les valeurs de flags en production. Avant toute décision produit sur l'alternance, intégrer que le menu sort vers LBA et que le trafic mesurable sur les pages internes est partiel. Avant toute décision sur les services jeunes, acter le sort de l'ancien hub `espace-jeune` pour cesser de maintenir deux systèmes.
- **Pour le dev.** Pour trouver la porte d'un parcours, partir de `NavigationStructure.tsx` (source de vérité des menus) puis de l'annexe A (URL vers fichier). Pour savoir pourquoi une page est invisible malgré son existence dans `src/pages/`, chercher son flag dans le tableau des flags. Pour connaître la fraîcheur d'une page, lire son `getStaticProps`/`getServerSideProps` plutôt que se fier à un label, deux labels du brouillon s'étant révélés faux.
- **Pour la passation.** Ce document remplace le brouillon `Carto_user.md` comme carte d'entrée. Les questions ouvertes de chaque famille forment la file des conversations d'approfondissement à mener, par ordre de densité : dépôt d'offre de stage (wizard), famille alternance (landings et sortie LBA), coexistence des hubs jeunes, socle Meilisearch mutualisé.

## 7. Pour aller plus loin

Fichiers de code qui font foi :
- `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx` : arborescence des menus, portes conditionnées par flag, sorties LBA.
- `src/shared/lbaLandingUrls.ts` : construction des URL LBA candidat et recruteur.
- `src/client/components/layouts/InstantSearch/InstantSearchLayout.tsx` : socle Meilisearch mutualisé (stages, logements, métiers, évènements).
- `src/pages/index.page.tsx` : accueil et flag `OLD_ESPACE_JEUNE_FEATURE`.
- `src/pages/{espace-jeune,services-jeunes,actualites,plan-du-site}/index.page.tsx` : logique de bascule des hubs jeunes.
- `src/client/components/features/JeDonneMonAvis/JeDonneMonAvis.tsx` et `.../Header/Banner/EnqueteSatisfaction/EnqueteSatisfactionBanner.tsx` : feedback et enquête.

Documents du corpus :
- `docs/00_documentation_référence/matière_première/Carto_user.md` : brouillon de travail d'origine, conservé pour son historique (décompte et deux labels de rendu corrigés ici).

---

## Annexe A : index des 69 pages utilisateur

Cet index prouve qu'aucune page n'est orpheline : la liste des chemins ci dessous a été comparée au contenu réel de `src/pages/` le 31 juillet 2026, sans aucun écart dans les deux sens (aucune page listée absente du disque, aucune page du disque absente de la liste). Trié par chemin. Les pages racines `_app`, `_document`, `_error` sont hors comptage. Le décompte est **69**, pas 67 : le chiffre du brouillon avait dérivé.

La colonne **Delta** signale les corrections apportées à la vérification.

| URL | Fichier | Famille | Rendu | Delta |
| --- | --- | --- | --- | --- |
| `/` | `src/pages/index.page.tsx` | T | ISR | |
| `/1jeune1permis` | `src/pages/1jeune1permis/index.page.tsx` | H | SSG | flag `1JEUNE1PERMIS_FEATURE` |
| `/404` | `src/pages/404.page.tsx` | T | statique | |
| `/accessibilite` | `src/pages/accessibilite/index.page.tsx` | J | ISR | |
| `/accompagnement` | `src/pages/accompagnement/index.page.tsx` | G | SSR | |
| `/actualites` | `src/pages/actualites/index.page.tsx` | J | ISR | visible si `OLD_ESPACE_JEUNE_FEATURE='0'` |
| `/apprentissage` | `src/pages/apprentissage/index.page.tsx` | B | SSR | hors menu principal |
| `/apprentissage/[id]` | `src/pages/apprentissage/[id].page.tsx` | B | SSR | |
| `/apprentissage/deposer-offre` | `src/pages/apprentissage/deposer-offre/index.page.tsx` | B | CSR | iframe widget LBA |
| `/apprentissage/entreprise/[id]` | `src/pages/apprentissage/entreprise/[id].page.tsx` | B | SSR | |
| `/apprentissage-entreprises` | `src/pages/apprentissage-entreprises/index.page.tsx` | B | CSR | |
| `/articles/[id]` | `src/pages/articles/[id].page.tsx` | J | SSG | |
| `/benevolat` | `src/pages/benevolat/index.page.tsx` | E | SSR | |
| `/benevolat/[id]` | `src/pages/benevolat/[id].page.tsx` | E | SSR | |
| `/cgu` | `src/pages/cgu/index.page.tsx` | J | ISR | |
| `/choisir-apprentissage` | `src/pages/choisir-apprentissage/index.page.tsx` | B | CSR | |
| `/confidentialite` | `src/pages/confidentialite/index.page.tsx` | J | ISR | |
| `/contrat-engagement-jeune` | `src/pages/contrat-engagement-jeune/index.page.tsx` | G | CSR | |
| `/creer-mon-cv` | `src/pages/creer-mon-cv/index.page.tsx` | A | CSR | sortie Diagoriente |
| `/decouvrir-les-metiers` | `src/pages/decouvrir-les-metiers/index.page.tsx` | D | CSR | Meilisearch |
| `/decouvrir-les-metiers/[nomMetier]` | `src/pages/decouvrir-les-metiers/[nomMetier].page.tsx` | D | **ISR** | corrigé : SSG dans le brouillon, réellement `revalidate: 86400` |
| `/emplois` | `src/pages/emplois/index.page.tsx` | A | SSR | |
| `/emplois/[id]` | `src/pages/emplois/[id].page.tsx` | A | SSR | |
| `/emplois/deposer-offre` | `src/pages/emplois/deposer-offre/index.page.tsx` | A | CSR | sortie `pro.francetravail.fr` |
| `/emplois-europe` | `src/pages/emplois-europe/index.page.tsx` | A | SSR | flag `EMPLOIS_EUROPE_FEATURE` |
| `/emplois-europe/[id]` | `src/pages/emplois-europe/[id].page.tsx` | A | SSR | |
| `/entreprendre` | `src/pages/entreprendre/index.page.tsx` | H | CSR | |
| `/espace-jeune` | `src/pages/espace-jeune/index.page.tsx` | G | ISR | visible si `OLD_ESPACE_JEUNE_FEATURE='1'` |
| `/evenements` | `src/pages/evenements/index.page.tsx` | D | CSR | mode selon `RECHERCHE_EVENEMENT_FEATURE` |
| `/experience-europe` | `src/pages/experience-europe/index.page.tsx` | H | CSR | |
| `/faq` | `src/pages/faq/index.page.tsx` | J | ISR | corrigé : `revalidate` piloté par le CMS, pas `1` |
| `/faq/[id]` | `src/pages/faq/[id].page.tsx` | J | SSG | |
| `/formations/apprentissage` | `src/pages/formations/apprentissage/index.page.tsx` | D | SSR | flag `FORMATION_LBA_FEATURE` |
| `/formations/apprentissage/[id]` | `src/pages/formations/apprentissage/[id].page.tsx` | D | SSR | |
| `/formations-initiales` | `src/pages/formations-initiales/index.page.tsx` | D | SSR | flag `FORMATIONS_INITIALES_FEATURE` |
| `/formations-initiales/[id]` | `src/pages/formations-initiales/[id].page.tsx` | D | SSR | |
| `/immersions` | `src/pages/immersions/index.page.tsx` | I | CSR | |
| `/immersions/referencer-mon-entreprise` | `src/pages/immersions/referencer-mon-entreprise/index.page.tsx` | I | CSR | formulaire POST BFF |
| `/je-deviens-mentor` | `src/pages/je-deviens-mentor/index.page.tsx` | I | CSR | |
| `/je-recrute` | `src/pages/je-recrute/index.page.tsx` | I | CSR | |
| `/je-recrute-afpr-poei` | `src/pages/je-recrute-afpr-poei/index.page.tsx` | I | CSR | |
| `/jobs-ete` | `src/pages/jobs-ete/index.page.tsx` | A | SSR | flag `JOB_ETE_FEATURE` |
| `/jobs-ete/[id]` | `src/pages/jobs-ete/[id].page.tsx` | A | SSR | |
| `/jobs-etudiants` | `src/pages/jobs-etudiants/index.page.tsx` | A | SSR | |
| `/jobs-etudiants/[id]` | `src/pages/jobs-etudiants/[id].page.tsx` | A | SSR | |
| `/les-entreprises-s-engagent` | `src/pages/les-entreprises-s-engagent/index.page.tsx` | I | CSR | |
| `/logements/aides-logement` | `src/pages/logements/aides-logement/index.page.tsx` | F | CSR | |
| `/logements/annonces` | `src/pages/logements/annonces/index.page.tsx` | F | CSR | contenu selon `LOGEMENT_FEATURE` |
| `/logements/annonces/[id]` | `src/pages/logements/annonces/[id].page.tsx` | F | SSR | |
| `/logements/conseils` | `src/pages/logements/conseils/index.page.tsx` | F | CSR | |
| `/maintenance-france-travail` | `src/pages/maintenance-france-travail/index.page.tsx` | T | CSR | déclencheur NON CONFIRMÉ |
| `/mentions-legales` | `src/pages/mentions-legales/index.page.tsx` | J | ISR | |
| `/mentorat` | `src/pages/mentorat/index.page.tsx` | G | CSR | |
| `/mes-aides` | `src/pages/mes-aides/index.page.tsx` | G | CSR | sortie sous domaine 1j1s |
| `/mesures-employeurs` | `src/pages/mesures-employeurs/index.page.tsx` | G | ISR | |
| `/mon-espace` | `src/pages/mon-espace/index.page.tsx` | I | CSR | authentification NON CONFIRMÉE |
| `/myjobglasses` | `src/pages/myjobglasses/index.page.tsx` | H | CSR | flag `MY_JOB_GLASSES_FEATURE` |
| `/plan-du-site` | `src/pages/plan-du-site/index.page.tsx` | J | CSR | généré depuis la navigation |
| `/service-civique` | `src/pages/service-civique/index.page.tsx` | E | SSR | |
| `/service-civique/[id]` | `src/pages/service-civique/[id].page.tsx` | E | SSR | |
| `/services-jeunes` | `src/pages/services-jeunes/index.page.tsx` | G | ISR | visible si `OLD_ESPACE_JEUNE_FEATURE='0'` |
| `/stages` | `src/pages/stages/index.page.tsx` | C | CSR | Meilisearch |
| `/stages/[id]` | `src/pages/stages/[id].page.tsx` | C | SSR | `noindex` |
| `/stages/deposer-offre` | `src/pages/stages/deposer-offre/index.page.tsx` | C | CSR | wizard étape 1 |
| `/stages/deposer-offre/confirmation-envoi` | `src/pages/stages/deposer-offre/confirmation-envoi/index.page.tsx` | C | CSR | confirmation |
| `/stages/deposer-offre/localisation` | `src/pages/stages/deposer-offre/localisation/index.page.tsx` | C | CSR | wizard étape 3 |
| `/stages/deposer-offre/votre-offre-de-stage` | `src/pages/stages/deposer-offre/votre-offre-de-stage/index.page.tsx` | C | CSR | wizard étape 2 |
| `/stages-3e-et-2de` | `src/pages/stages-3e-et-2de/index.page.tsx` | C | SSR | flag `STAGES_3EME_FEATURE` |
| `/stages-3e-et-2de/candidater` | `src/pages/stages-3e-et-2de/candidater/index.page.tsx` | C | SSR | formulaire candidature |

Pages racines Next.js hors comptage : `_app.page.tsx` (container), `_document.page.tsx` (gabarit HTML), `_error.page.tsx` (error boundary).
