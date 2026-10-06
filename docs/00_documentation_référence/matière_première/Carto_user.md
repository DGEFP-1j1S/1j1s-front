---

> Table d'entrée de la cartographie fonctionnelle de `1j1s-front-fork`. Chaque parcours listé ici est volontairement décrit au premier niveau, avec juste les repères nécessaires pour ouvrir ensuite une **conversation dédiée** et le creuser en profondeur (ex. «creuser le parcours stages»).
>

**Scope** : code source de `1j1s-front-fork`, branche `fix/enquete-satisfaction-jedonnemonavis`, répertoire `src/pages/` (67 pages utilisateur) et composants associés dans `src/client/components/`. La couche BFF (`src/pages/api/`) et la couche serveur (`src/server/`) sont **hors scope** de ce document, à traiter dans des cartographies séparées.

**Date de génération** : 2026-04-13.

## Comment utiliser ce document

1. Chaque **parcours** est une fiche standardisée (6 champs, format identique partout).
2. Les parcours sont regroupés en **10 familles métier** plus une famille transverse.
3. Pour creuser un parcours : ouvrir une conversation en pointant la fiche correspondante, puis partir des fichiers listés dans les champs **Pages** et **Points d'intégration**.
4. Chaque fiche comporte un champ **À creuser** listant 2 à 4 questions ouvertes qui serviront de point de départ à la conversation dédiée.
5. Un **index brut des 67 pages** est fourni en annexe pour vérifier qu'aucune page n'est orpheline.

### Légende des champs

| Champ | Contenu |
| --- | --- |
| Entrée | URL principale et façon dont l'utilisateur y accède (accueil, menu header, lien partenaire…) |
| Pages | Fichiers `*.page.tsx` impliqués, avec type de rendu (SSG, ISR, SSR, CSR) et rôle (liste, détail, étape N…) |
| Nature | recherche filtrable, détail, wizard N étapes, landing, redirection externe, hub de navigation |
| Source données | Meilisearch index `X`, BFF `/api/...`, iframe partenaire, contenu CMS Strapi, contenu statique |
| Sorties externes | Partenaires vers lesquels le parcours redirige ou qu'il intègre (France Travail, LBA, Onisep, Diagoriente, jedonnemonavis, etc.) |
| À creuser | Questions ouvertes à trancher dans la conversation dédiée |

### Légende des types de rendu

| Code | Sens |
| --- | --- |
| SSG | `getStaticProps` sans `revalidate` (statique build time) |
| ISR | `getStaticProps` avec `revalidate` (statique régénéré) |
| SSR | `getServerSideProps` (rendu à chaque requête) |
| CSR | Ni `getStaticProps` ni `getServerSideProps`, tout se fait côté client |

---

## Vue d'ensemble

| # | Famille métier | Parcours | Pages | Technologies dominantes |
| --- | --- | --- | --- | --- |
| A | Emploi et jobs | 6 | 9 | SSR + BFF France Travail, redirections partenaires |
| B | Alternance | 6 | 6 | Landings éditoriales, redirection La Bonne Alternance |
| C | Stages | 6 | 10 | Meilisearch InstantSearch, wizard multi étapes, formulaire candidature |
| D | Formation et orientation | 4 | 8 | SSR + BFF, Meilisearch pour métiers, Onisep |
| E | Engagement civique | 2 | 4 | SSR + BFF, composant de recherche mutualisé |
| F | Logement | 3 | 4 | Meilisearch InstantSearch, landings |
| G | Accompagnement et aides | 7 | 9 | Landings, demande de contact BFF, redirections simulateurs |
| H | Europe et exploration | 4 | 4 | Landings, iframes partenaires |
| I | Employeurs | 6 | 7 | Landings, hub employeur, formulaire référencement |
| J | Contenu éditorial et institutionnel | n/a | 7 | SSG/ISR CMS Strapi |
| T | Transverse (navigation, légal, erreurs, bandeaux) | n/a | (couvert par J + navigation globale) | Composants layout, `_app.page.tsx`, Tarteaucitron |

**Total pages utilisateur** : 67 (hors `_app`, `_document`, `_error`, `404`, eux mêmes listés dans la section transverse).

**Technologies de recherche identifiées** :

- **Meilisearch InstantSearch** (`react-instantsearch`) via `InstantSearchLayout` : stages, logements, évènements (feature flag), fiches métiers.
- **BFF France Travail** (SSR via `getServerSideProps` + BFF interne) : emplois, jobs étudiants, jobs d'été, emplois Europe, formations en apprentissage.
- **BFF Onisep** : formations initiales (feature flag).
- **BFF API Engagement** : service civique, bénévolat.
- **BFF API Établissements publics** : accompagnement (structures).
- **Iframes partenaires** : apprentissage (LBA), 1jeune1permis (France Travail).

---

## A. Emploi et jobs

Famille concentrée sur la mise en relation avec des offres d'emploi proposées par France Travail (ex Pôle Emploi), avec pagination et filtres côté serveur.

### A1. Rechercher un emploi

- **Entrée** : `/emplois`, via le menu header «Offres → Emplois».
- **Pages** :
    - `src/pages/emplois/index.page.tsx` (SSR, liste filtrable)
    - `src/pages/emplois/[id].page.tsx` (SSR, détail d'offre)
- **Nature** : recherche filtrable côté serveur + page détail.
- **Source données** : BFF 1j1s qui relaie l'API France Travail.
- **Sorties externes** : France Travail (origine des offres), éventuel lien de candidature vers partenaire.
- **À creuser** :
    - Quels filtres sont réellement exposés (mots clés, localisation, contrat, expérience, temps de travail, domaine) et lesquels sont persistés en query string ?
    - Comment la pagination est elle implémentée côté SSR et côté client (CSR au clic) ?
    - Quel est le comportement en cas de panne France Travail (cf. `/maintenance-france-travail`) ?

### A2. Rechercher un job étudiant

- **Entrée** : `/jobs-etudiants`, via header «Offres → Jobs étudiants».
- **Pages** :
    - `src/pages/jobs-etudiants/index.page.tsx` (SSR)
    - `src/pages/jobs-etudiants/[id].page.tsx` (SSR)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s sur France Travail (filtres spécifiques jobs étudiants).
- **Sorties externes** : France Travail.
- **À creuser** :
    - Quelles sont les différences de filtres et d'affichage par rapport à `/emplois` ? Y a t il du code réellement mutualisé ou une duplication ?
    - Comment est définie la notion de «job étudiant» côté API (critère France Travail, mot clé, champ dédié) ?

### A3. Rechercher un job d'été

- **Entrée** : `/jobs-ete`, via header «Offres → Jobs d'été» (feature flag `NEXT_PUBLIC_JOB_ETE_FEATURE`).
- **Pages** :
    - `src/pages/jobs-ete/index.page.tsx` (SSR)
    - `src/pages/jobs-ete/[id].page.tsx` (SSR)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s sur France Travail.
- **Sorties externes** : France Travail.
- **À creuser** :
    - Quelle est la stratégie temporelle (activation saisonnière via le flag ? valeurs par défaut des filtres ?).
    - Mutualisation avec `jobs-etudiants` et `emplois` : où se trouve le code partagé et quelles sont les spécificités irréductibles ?

### A4. Rechercher un emploi en Europe

- **Entrée** : `/emplois-europe`, via header «Offres → Emplois en Europe» (feature flag `NEXT_PUBLIC_EMPLOIS_EUROPE_FEATURE`).
- **Pages** :
    - `src/pages/emplois-europe/index.page.tsx` (SSR)
    - `src/pages/emplois-europe/[id].page.tsx` (SSR)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s branché sur un flux Europe (probablement EURES via France Travail).
- **Sorties externes** : à clarifier (EURES, France Travail International).
- **À creuser** :
    - Quelle est la source réelle (BFF dédié, EURES direct, France Travail Europe) ?
    - Différence de schéma de données par rapport à `/emplois` (pays, devise, langue).

### A5. Déposer une offre d'emploi (redirection)

- **Entrée** : `/emplois/deposer-offre`, via CTA sur la page `/emplois`.
- **Pages** : `src/pages/emplois/deposer-offre/index.page.tsx` (CSR, page de transition).
- **Nature** : redirection externe.
- **Source données** : aucune, contenu statique + lien sortant.
- **Sorties externes** : `pro.francetravail.fr` (espace recruteur France Travail).
- **À creuser** :
    - S'agit il d'une vraie page avec contenu pédagogique (accompagnement du recruteur) ou d'une simple redirection HTTP ?
    - Est elle tracée en analytics comme une sortie ?

### A6. Créer mon CV (redirection Diagoriente)

- **Entrée** : `/creer-mon-cv`, via header «Aides et outils → Créer son CV personnalisé».
- **Pages** : `src/pages/creer-mon-cv/index.page.tsx` (CSR).
- **Nature** : landing + redirection externe.
- **Sorties externes** : Diagoriente.
- **À creuser** :
    - La redirection est elle immédiate ou y a t il un contenu intermédiaire (explication, rassurance sur la protection des données) ?
    - Quel est le suivi analytique (event de sortie) ?

---

## B. Alternance

Attention : la navigation header pointe vers **La Bonne Alternance (LBA) en direct** pour «Contrats d'alternance» et «Je recrute un apprenti» (`labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution`). Les pages internes `/apprentissage*` sont donc **accessibles via d'autres points d'entrée** (accueil, SEO, campagnes, liens directs) plutôt que depuis le menu principal. C'est un point à clarifier dès la première conversation dédiée.

### B1. Rechercher une alternance (détail LBA)

- **Entrée** : `/apprentissage/[id]` depuis des liens LBA ou partenaires.
- **Pages** :
    - `src/pages/apprentissage/[id].page.tsx` (SSR, détail offre alternance)
    - `src/pages/apprentissage/entreprise/[id].page.tsx` (SSR, détail entreprise qui recrute)
- **Nature** : pages détail.
- **Source données** : BFF 1j1s connecté à LBA.
- **Sorties externes** : LBA.
- **À creuser** :
    - Où se fait la recherche en amont ? Est elle interne (liste non trouvée dans `/apprentissage`) ou uniquement côté LBA ?
    - Y a t il un SEO actif sur ces pages détail (indexation, sitemap) ?

### B2. Landing `apprentissage` (jeunes)

- **Entrée** : `/apprentissage`, via campagne ou lien direct.
- **Pages** : `src/pages/apprentissage/index.page.tsx` (SSR).
- **Nature** : landing éditoriale (contenu + vidéos + CTA).
- **Source données** : contenu CMS Strapi et/ou statique.
- **À creuser** :
    - Pourquoi cette page est elle SSR et non SSG (contenu dynamique ? mesure analytics ?) ?
    - Est elle le point d'entrée d'un vrai parcours ou une landing de communication isolée ?

### B3. Landing `apprentissage-entreprises` (entreprises)

- **Entrée** : `/apprentissage-entreprises`, via campagne ciblée recruteurs.
- **Pages** : `src/pages/apprentissage-entreprises/index.page.tsx` (CSR).
- **Nature** : landing dédiée aux entreprises.
- **Sorties externes** : LBA (recruteurs).
- **À creuser** :
    - Chevauchement fonctionnel avec `/je-recrute` et `/je-recrute-afpr-poei` (famille Employeurs) : y a t il redondance ?

### B4. Landing `choisir-apprentissage`

- **Entrée** : `/choisir-apprentissage`, via accueil ou campagne.
- **Pages** : `src/pages/choisir-apprentissage/index.page.tsx` (CSR).
- **Nature** : landing pédagogique.
- **À creuser** :
    - Quelle est la différence éditoriale avec `/apprentissage` ? Les deux coexistent elles par choix ou par dette ?

### B5. Déposer une offre alternance (redirection LBA)

- **Entrée** : `/apprentissage/deposer-offre`, via CTA sur les pages alternance.
- **Pages** : `src/pages/apprentissage/deposer-offre/index.page.tsx` (CSR).
- **Nature** : redirection externe (ou iframe selon implémentation).
- **Sorties externes** : LBA recruteurs.
- **À creuser** :
    - Page statique avec lien ou iframe du widget LBA ? (les agents ont mentionné iframe, à vérifier).

### B6. Découverte via header (sortie directe LBA)

- **Entrée** : header «Offres → Contrats d'alternance» et header «Formations et orientation → Découvrir et trouver sa voie avec l'apprentissage».
- **Pages** : aucune page interne, lien sortant direct.
- **Nature** : sortie externe via navigation principale.
- **Sorties externes** : `labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution`.
- **À creuser** :
    - Le choix de sortir directement vers LBA depuis le menu (sans page intermédiaire) est il assumé et tracé ? Quel est l'impact sur le taux de rebond et sur l'analytics ?

---

## C. Stages

Famille centrale de 1j1s : moteur Meilisearch sur le CMS, wizard de dépôt d'offre multi étapes, et bandeau de feedback «Je donne mon avis». C'est la famille où le parcours interactif est le plus riche.

### C1. Rechercher un stage (Meilisearch)

- **Entrée** : `/stages`, via header «Offres → Stages d'études» et via l'accueil.
- **Pages** : `src/pages/stages/index.page.tsx` (CSR pur, Meilisearch InstantSearch).
- **Nature** : recherche filtrable côté client.
- **Source données** : index Meilisearch dont le nom est donné par `NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE` (ex `offre-de-stage`).
- **Points d'intégration** :
    - `InstantSearchLayout` (`src/client/components/layouts/InstantSearch/InstantSearchLayout.tsx`)
    - `FormulaireRechercheOffreStage` (formulaire de filtres)
    - `OffreDeStage` (composant résultat)
    - `MeilisearchTagsList` (tags de filtres actifs)
- **À creuser** :
    - Quels filtres sont exposés (domaine, localisation, durée, niveau d'études) et comment sont ils configurés dans l'index Meilisearch ?
    - Comment la pagination Meilisearch est elle paramétrée (`HITS_PER_PAGE=15`, `NOMBRE_MAX_RESULTATS=2000` en dur) ?
    - Lien avec le CMS qui alimente l'index (voir `1j1s-main-cms` et `1j1s-etl`).

### C2. Consulter un stage (détail)

- **Entrée** : clic depuis la liste `/stages`, ou lien externe.
- **Pages** : `src/pages/stages/[id].page.tsx` (SSR, `noindex`).
- **Nature** : page détail.
- **Source données** : BFF 1j1s qui lit l'offre depuis le CMS.
- **À creuser** :
    - Pourquoi `noindex` ? (probablement durée de vie courte des offres)
    - Comment le bandeau «Je donne mon avis» est il positionné sur cette page ?

### C3. Déposer une offre de stage (wizard 3 étapes)

- **Entrée** : `/stages/deposer-offre`, CTA depuis `/stages`.
- **Pages** :
    - `src/pages/stages/deposer-offre/index.page.tsx` (CSR, étape 1 : entreprise)
    - `src/pages/stages/deposer-offre/votre-offre-de-stage/index.page.tsx` (CSR, étape 2 : détails offre)
    - `src/pages/stages/deposer-offre/localisation/index.page.tsx` (CSR, étape 3 : localisation)
    - `src/pages/stages/deposer-offre/confirmation-envoi/index.page.tsx` (CSR, confirmation)
- **Nature** : wizard 3 étapes + page de confirmation.
- **Source données** : BFF `/api/stages` (POST).
- **À creuser** :
    - Comment l'état du formulaire est il persisté entre les étapes (contexte React, localStorage, query string) ?
    - Quelles validations côté client (joi) versus côté BFF ? Quels messages d'erreur ?
    - Que se passe t il si l'utilisateur rafraîchit ou recule dans le navigateur au milieu du wizard ?
    - Flux aval : le BFF écrit il directement en base, envoie t il un mail à Tipimail, ou passe t il par le CMS Strapi ?

### C4. Rechercher un stage 3e ou 2de

- **Entrée** : `/stages-3e-et-2de`, via header «Offres → Stages de 3e et 2de» (feature flag `NEXT_PUBLIC_STAGES_3EME_FEATURE`).
- **Pages** : `src/pages/stages-3e-et-2de/index.page.tsx` (SSR).
- **Nature** : recherche filtrable dédiée au public collégien/lycéen.
- **Source données** : BFF 1j1s (à clarifier : même index stages ou index dédié).
- **À creuser** :
    - Partage t il le même index Meilisearch que `/stages` avec un filtre, ou une source différente ?
    - Pourquoi SSR alors que `/stages` est CSR ? Historique ou besoin SEO ?

### C5. Candidater à un stage 3e ou 2de

- **Entrée** : `/stages-3e-et-2de/candidater`, CTA depuis une offre de stage 3e/2de.
- **Pages** : `src/pages/stages-3e-et-2de/candidater/index.page.tsx` (SSR).
- **Nature** : formulaire de candidature.
- **Source données** : BFF (POST sur une route dédiée).
- **À creuser** :
    - Quelles informations sont collectées (mineur, autorisation parentale) et comment sont elles traitées (RGPD) ?
    - Quel est le canal d'envoi final (mail Tipimail à l'entreprise, stockage BDD, intégration tiers) ?

### C6. Feedback «Je donne mon avis» sur les stages

- **Entrée** : bandeau présent sur les pages `/stages*`.
- **Points d'intégration** : `src/client/components/features/JeDonneMonAvis/JeDonneMonAvis.tsx`.
- **Nature** : composant de feedback.
- **Sorties externes** : `jedonnemonavis.numerique.gouv.fr` (migration récente de l'ancien bandeau, voir commits `ca114dc7f` et `92c107af8` sur la branche courante).
- **À creuser** :
    - Sur quelles pages est il vraiment affiché (stages uniquement, ou étendu) ?
    - Quel est le format du lien (URL de retour, identifiant de sondage, attribution) ?

### C7. Sortie externe «Stages d'observation»

- **Entrée** : header «Offres → Stages d'observation» (feature flags `NEXT_PUBLIC_STAGES_SECONDE_RECHERCHE_FEATURE` et `NEXT_PUBLIC_STAGES_SECONDE_URL`).
- **Pages** : aucune, lien sortant direct.
- **Nature** : redirection externe pilotée par variable d'environnement.
- **À creuser** :
    - Vers quel partenaire pointe `NEXT_PUBLIC_STAGES_SECONDE_URL` (probablement un site du ministère Éducation Nationale) ?
    - Pourquoi ce flux est il entièrement externalisé ?

---

## D. Formation et orientation

### D1. Rechercher une formation en apprentissage

- **Entrée** : `/formations/apprentissage`, via header «Formations et orientation → Formations en apprentissage» (feature flag `NEXT_PUBLIC_FORMATION_LBA_FEATURE`).
- **Pages** :
    - `src/pages/formations/apprentissage/index.page.tsx` (SSR, liste)
    - `src/pages/formations/apprentissage/[id].page.tsx` (SSR, détail)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s, source LBA (formations en apprentissage).
- **Sorties externes** : LBA (fiche formation complète).
- **À creuser** :
    - Pourquoi `/formations/apprentissage` est il sous /formations/ alors que `/formations-initiales` est au niveau racine ? Historique ou choix d'architecture ?

### D2. Rechercher une formation initiale (Onisep)

- **Entrée** : `/formations-initiales`, via header «Formations et orientation → Formations initiales» (feature flag `NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE`).
- **Pages** :
    - `src/pages/formations-initiales/index.page.tsx` (SSR, liste)
    - `src/pages/formations-initiales/[id].page.tsx` (SSR, détail)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s, source Onisep.
- **Sorties externes** : Onisep (lien vers fiche complète).
- **À creuser** :
    - Quel type d'authentification ou de clé API Onisep est utilisé ? Cf. `src/server/formations-initiales/`.
    - Les résultats sont ils mis en cache (`axios-cache-interceptor`, Redis) ?

### D3. Découvrir les métiers

- **Entrée** : `/decouvrir-les-metiers`, via header «Formations et orientation → Découvrir les métiers».
- **Pages** :
    - `src/pages/decouvrir-les-metiers/index.page.tsx` (CSR, Meilisearch)
    - `src/pages/decouvrir-les-metiers/[nomMetier].page.tsx` (SSG avec `getStaticPaths`, fiche métier)
- **Nature** : recherche filtrable (Meilisearch) + fiches métier pré générées.
- **Source données** : index Meilisearch `metier` (ou similaire), fiches SSG alimentées par le CMS Strapi (import Onisep).
- **Sorties externes** : Onisep (source des contenus).
- **À creuser** :
    - Combien de fiches métier sont pré générées à chaque build ? Quel impact sur le temps de build ?
    - Quel est le pipeline complet métier → `1j1s-etl` → `1j1s-main-cms` → `1j1s-front-fork` ?

### D4. Rechercher un évènement de recrutement

- **Entrée** : `/evenements`, via header «Formations et orientation → Participer à des évènements».
- **Pages** : `src/pages/evenements/index.page.tsx` (CSR).
- **Nature** : deux modes selon feature flag `NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE` :
    - Flag off : landing avec boutons vers France Travail (`mesevenementsemploi.francetravail.fr`) et UNML (`40-ans.unml.info`).
    - Flag on : recherche Meilisearch via `InstantSearchLayout` sur l'index `evenement`.
- **Source données** : index Meilisearch `evenement` (mode recherche) ou simple contenu statique (mode landing).
- **Sorties externes** : France Travail, UNML.
- **À creuser** :
    - Le flag est il actif en prod aujourd'hui ? Quelle est la bascule prévue ?
    - Comment l'index `evenement` est il alimenté (ETL, saisie manuelle CMS) ?

---

## E. Engagement civique

Les deux parcours partagent le même composant de recherche `RechercherMission` et la même famille d'APIs.

### E1. Rechercher une mission de service civique

- **Entrée** : `/service-civique`, via header «Engagement → Service civique».
- **Pages** :
    - `src/pages/service-civique/index.page.tsx` (SSR)
    - `src/pages/service-civique/[id].page.tsx` (SSR)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s sur API Engagement.
- **À creuser** :
    - Où se trouve exactement le composant `RechercherMission` partagé ? (probablement `src/client/components/features/EngagementCivique/`).
    - Différenciation métier avec bénévolat : filtres spécifiques, libellés, âges minimum ?

### E2. Rechercher une mission de bénévolat

- **Entrée** : `/benevolat`, via header «Engagement → Bénévolat».
- **Pages** :
    - `src/pages/benevolat/index.page.tsx` (SSR)
    - `src/pages/benevolat/[id].page.tsx` (SSR)
- **Nature** : recherche filtrable + détail.
- **Source données** : BFF 1j1s sur API Engagement.
- **À creuser** :
    - Mutualisation réelle avec service civique : quelle est la part de code partagé versus spécifique ?

---

## F. Logement

### F1. Rechercher un logement (Meilisearch)

- **Entrée** : `/logements/annonces`, via header «Logement → Annonces».
- **Pages** :
    - `src/pages/logements/annonces/index.page.tsx` (CSR, Meilisearch, feature flag `NEXT_PUBLIC_LOGEMENT_FEATURE`)
    - `src/pages/logements/annonces/[id].page.tsx` (SSR, détail)
- **Nature** : recherche filtrable + détail.
- **Source données** : index Meilisearch via `NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT`, fallback `ErrorUnavailableService` si flag ou index absent.
- **Points d'intégration** :
    - `InstantSearchLayout`
    - `FormulaireRechercheAnnonceLogement`
    - `AnnonceDeLogement` (composant résultat)
    - `transformerMeilisearchLogementsItems` (transformation des tags de filtres)
- **À creuser** :
    - Pourquoi la page détail est SSR alors que la liste est CSR ? Besoin SEO sur les annonces ?
    - Quelle est la source des annonces (ETL depuis bailleurs, CMS manuel) ?
    - La pagination est elle limitée à 9 par page avec un plafond de 2000 résultats : quelle est la stratégie au delà ?

## F2. Aides au logement (landing)

- **Entrée** : `/logements/aides-logement`, via header «Logement → Aides financières au logement».
- **Pages** : `src/pages/logements/aides-logement/index.page.tsx` (CSR).
- **Nature** : landing éditoriale avec liens services partenaires.
- **Sorties externes** : à clarifier (Action Logement, CAF, Mes Aides).
- **À creuser** :
    - Quels partenaires sont liés et comment sont ils maintenus (en dur dans le code ou via CMS) ?

### F3. Conseils logement

- **Entrée** : `/logements/conseils`, via header «Logement → Découvrir tous nos conseils».
- **Pages** : `src/pages/logements/conseils/index.page.tsx` (CSR).
- **Nature** : contenu éditorial statique.
- **À creuser** :
    - Le contenu est il en dur dans le code ou tiré du CMS Strapi ?

---

## G. Accompagnement et aides

### G1. Trouver une structure d'accompagnement

- **Entrée** : `/accompagnement`, via header «Accompagnement → Trouver une structure d'accompagnement».
- **Pages** : `src/pages/accompagnement/index.page.tsx` (SSR).
- **Nature** : recherche filtrable (liste de structures par localisation).
- **Source données** : BFF 1j1s sur API Établissements publics et/ou API Découpage administratif.
- **À creuser** :
    - Quelles structures sont indexées (missions locales, CIO, PAIO…) ?
    - Comment est faite la géolocalisation (IP, navigateur, saisie manuelle) ?

### G2. Contrat Engagement Jeune (CEJ)

- **Entrée** : `/contrat-engagement-jeune`, via header «Accompagnement → Contrat Engagement Jeune».
- **Pages** : `src/pages/contrat-engagement-jeune/index.page.tsx` (CSR).
- **Nature** : landing pédagogique en 8 sections (hero, qu'est ce que c'est, actions/CTA, allocations, témoignages, accompagnement + demande de contact, application).
- **Points d'intégration** : composant `DemandeContactCEJ` qui POST sur BFF `/api/demandes-de-contact` (type `CEJ`).
- **À creuser** :
    - Quel est le cheminement d'une demande de contact après soumission (mail Tipimail ? CRM ? stockage ?) ?
    - Quelle est la politique de relance si un utilisateur laisse le formulaire incomplet ?

### G3. Mentorat

- **Entrée** : `/mentorat`, via header «Accompagnement → Échanger avec un mentor».
- **Pages** : `src/pages/mentorat/index.page.tsx` (CSR).
- **Nature** : landing (programme 1jeune1mentor).
- **Sorties externes** : à clarifier (probablement redirection vers la plateforme partenaire mentorat).
- **À creuser** :
    - Y a t il un formulaire d'inscription sur la page ou uniquement une redirection ?

### G4. Mes aides (simulateur externe)

- **Entrée** : `/mes-aides`, via header «Aides et outils → Simulateur d'aides financières».
- **Pages** : `src/pages/mes-aides/index.page.tsx` (CSR).
- **Nature** : landing + redirection externe.
- **Sorties externes** : simulateur `mes-aides.1jeune1solution.gouv.fr` ou `mes-aides.gouv.fr` (à confirmer).
- **À creuser** :
    - Quelle est l'URL exacte de destination ? Le simulateur est il hébergé sur un sous domaine 1j1s ou sur un service externe ?

### G5. Mesures employeurs

- **Entrée** : `/mesures-employeurs`, via header «Je suis employeur → Découvrir les mesures employeurs».
- **Pages** : `src/pages/mesures-employeurs/index.page.tsx` (SSG/ISR).
- **Nature** : landing éditoriale.
- **Source données** : contenu CMS Strapi.
- **À creuser** :
    - Quelles mesures sont documentées (aides à l'embauche, exonérations) ? Comment sont elles tenues à jour ?

### G6. Hub `espace-jeune`

- **Entrée** : `/espace-jeune` (historique, feature flag `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE`).
- **Pages** : `src/pages/espace-jeune/index.page.tsx` (SSG/ISR).
- **Nature** : hub de services jeunes avec actualités.
- **À creuser** :
    - C'est l'ancien hub. Est il en cours de désactivation ? Cf. flag `OLD_ESPACE_JEUNE_FEATURE === '0'` qui active les nouveaux points d'entrée `/services-jeunes?filtre=...`.

### G7. Hub `services-jeunes`

- **Entrée** : `/services-jeunes`, accessible depuis la navigation de chaque famille (ex `/services-jeunes?filtre=vieProfessionnelle`, `filtre=logement`, `filtre=accompagnement`, `filtre=engagement`, `filtre=orienterFormer`, `filtre=aidesFinancieres`).
- **Pages** : `src/pages/services-jeunes/index.page.tsx` (SSG/ISR).
- **Nature** : annuaire de services filtrable par thématique (successeur de `/espace-jeune`).
- **Source données** : contenu CMS Strapi.
- **À creuser** :
    - Quels sont les filtres exacts et leur mapping avec les familles métier ?
    - Stratégie de migration depuis `/espace-jeune` : coexistence ou bascule franche pilotée par flag ?

---

## H. Europe et exploration

### H1. Expérience Europe (landing)

- **Entrée** : `/experience-europe`, via header «Accompagnement → Expérience en Europe».
- **Pages** : `src/pages/experience-europe/index.page.tsx` (CSR).
- **Nature** : landing éditoriale (emploi et volontariat en Europe).
- **À creuser** :
    - Lien avec `/emplois-europe` (famille A) : A t on deux portes d'entrée (landing éditoriale + moteur de recherche) pour le même sujet ?

### H2. MyJobGlasses

- **Entrée** : `/myjobglasses`, via header «Accompagnement → Échanger avec des professionnels» (feature flag `NEXT_PUBLIC_MY_JOB_GLASSES_FEATURE`).
- **Pages** : `src/pages/myjobglasses/index.page.tsx` (CSR).
- **Nature** : landing + redirection.
- **Sorties externes** : MyJobGlasses (plateforme d'entretiens vidéo avec professionnels).
- **À creuser** :
    - Landing éditoriale ou iframe ? Statut du flag en prod ?

### H3. Entreprendre

- **Entrée** : `/entreprendre`, via header «Accompagnement → Entreprendre : financements, aides et accompagnement».
- **Pages** : `src/pages/entreprendre/index.page.tsx` (CSR).
- **Nature** : landing (solutions création d'entreprise).
- **Sorties externes** : à clarifier (BPI, France Num, CCI…).

### H4. 1jeune1permis

- **Entrée** : `/1jeune1permis`, via header «Aides et outils → Aides au permis de conduire» (feature flag `NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE`).
- **Pages** : `src/pages/1jeune1permis/index.page.tsx` (SSG).
- **Nature** : page avec iframe France Travail.
- **Sorties externes** : France Travail.
- **À creuser** :
    - Pourquoi une iframe ? Contraintes techniques ou choix produit ?
    - Accessibilité et responsive d'une iframe externe.

---

## I. Employeurs

Cette famille est celle où le parcours «employeur» de l'app se matérialise : recrutement, mentorat, immersions, offre spéciale AFPR/POEI, et l'espace employeur.

### I1. Hub `je-recrute`

- **Entrée** : `/je-recrute`, via header employeur «Recruter et agir pour les jeunes → Je recrute».
- **Pages** : `src/pages/je-recrute/index.page.tsx` (CSR).
- **Nature** : hub de recrutement pour employeurs (orientation vers les sous parcours).
- **À creuser** :
    - Quelles sont les cartes/CTA exposés et vers où pointent ils ?

### I2. `je-recrute-afpr-poei`

- **Entrée** : `/je-recrute-afpr-poei`, via header employeur «Je forme les jeunes grâce à l'emploi».
- **Pages** : `src/pages/je-recrute-afpr-poei/index.page.tsx` (CSR).
- **Nature** : landing dédiée au dispositif AFPR/POEI (Action de Formation Préalable au Recrutement et Préparation Opérationnelle à l'Emploi Individuelle).
- **À creuser** :
    - Y a t il un formulaire d'intérêt ou uniquement de l'information ?

### I3. Je deviens mentor

- **Entrée** : `/je-deviens-mentor`, via header employeur.
- **Pages** : `src/pages/je-deviens-mentor/index.page.tsx` (CSR).
- **Nature** : landing appel à mentors.
- **À creuser** :
    - Lien avec `/mentorat` côté jeunes : les deux pages décrivent le même programme sous deux angles ?

### I4. Immersions professionnelles

- **Entrée** : `/immersions`, via header employeur «Je propose des immersions».
- **Pages** :
    - `src/pages/immersions/index.page.tsx` (CSR, landing)
    - `src/pages/immersions/referencer-mon-entreprise/index.page.tsx` (CSR, formulaire de référencement)
- **Nature** : landing + formulaire.
- **Source données** : BFF (POST formulaire de référencement).
- **À creuser** :
    - Quel canal traite la demande en aval (mail, CMS, intégration Immersion Facilitée) ?

### I5. Les entreprises s'engagent

- **Entrée** : `/les-entreprises-s-engagent`, via header employeur «Rejoindre la mobilisation».
- **Pages** : `src/pages/les-entreprises-s-engagent/index.page.tsx` (CSR).
- **Nature** : landing de mobilisation.
- **À creuser** :
    - Parcours d'engagement concret (formulaire ? redirection vers plateforme partenaire ?).

### I6. Mon espace employeur

- **Entrée** : `/mon-espace`, via header employeur «Accéder à mon espace».
- **Pages** : `src/pages/mon-espace/index.page.tsx` (CSR).
- **Points d'intégration** :
    - `MonEspaceEntreprise` (`src/client/components/features/MonEspaceEmployeur/MonEspaceEntreprise.tsx`)
    - `MonEspaceEnSavoirPlus` (`src/client/components/features/MonEspaceEmployeur/EnSavoirPlus/MonEspaceEnSavoirPlus.tsx`)
- **Nature** : page de présentation «espace employeur» (vraisemblablement une landing avec redirection vers un compte externe, pas un vrai espace authentifié côté 1j1s).
- **À creuser** :
    - Y a t il une vraie authentification ? Si oui, où (OAuth France Travail ? ProConnect ?).
    - Sinon, à quoi sert cette page exactement : passerelle vers un service externe, placeholder, futur espace en construction ?

---

## J. Contenu éditorial et institutionnel

### J1. FAQ

- **Entrée** : `/faq`, via footer «Besoin d'aide ? → FAQ».
- **Pages** :
    - `src/pages/faq/index.page.tsx` (SSG avec `revalidate: 1`)
    - `src/pages/faq/[id].page.tsx` (SSG avec `getStaticPaths`)
- **Nature** : liste + détail.
- **Source données** : CMS Strapi.
- **À creuser** :
    - Pourquoi `revalidate: 1` ? (régénération agressive)

### J2. Actualités et articles

- **Entrée** : `/actualites` (feature flag `NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE === '0'`, donc activée seulement si l'ancien espace jeune est désactivé), plus `/articles/[id]` pour les articles de fond.
- **Pages** :
    - `src/pages/actualites/index.page.tsx` (ISR, liste paginée avec composant `SeeMoreItemList`)
    - `src/pages/articles/[id].page.tsx` (SSG avec `getStaticPaths`)
- **Nature** : liste + détail.
- **Source données** : CMS Strapi (`consulterActualitesUseCase`).
- **À creuser** :
    - Gestion de la cohabitation entre actualités (récentes) et articles (durables) : comment sont ils distingués côté CMS ?

### J3. Pages légales

- **Entrée** : footer «Liens utiles».
- **Pages** :
    - `src/pages/mentions-legales/index.page.tsx` (ISR)
    - `src/pages/confidentialite/index.page.tsx` (ISR)
    - `src/pages/cgu/index.page.tsx` (ISR)
    - `src/pages/accessibilite/index.page.tsx` (ISR, «Partiellement conforme»)
- **Source données** : CMS Strapi (`mentionObligatoireDependencies`).
- **À creuser** :
    - Workflow de publication : qui peut modifier, avec quelle validation, quel délai avant apparition en prod ?

### J4. Plan du site

- **Entrée** : `/plan-du-site`, via footer.
- **Pages** : `src/pages/plan-du-site/index.page.tsx` (CSR).
- **Nature** : arborescence navigation (générée à partir de `NavigationStructure`).
- **À creuser** :
    - Est il synchronisé automatiquement avec la navigation header ou dupliqué ?

---

## T. Parcours transverses

### T1. Page d'accueil

- **Entrée** : `/`, racine du site.
- **Pages** : `src/pages/index.page.tsx` (SSG/ISR).
- **Nature** : hub éditorial avec hero «À chacun sa solution», 7 sections thématiques (offres, formations, engagement, logement, accompagnement, aides et outils, actualités), bandeau campagne optionnel.
- **Source données** : CMS Strapi (actualités, campagne).
- **À creuser** :
    - Liste exhaustive des CTA de l'accueil et leur mapping avec les parcours ci dessus (pour identifier les parcours uniquement accessibles depuis l'accueil).

### T2. Navigation header

- **Points d'intégration** :
    - `src/client/components/layouts/Header/Header.tsx`
    - `src/client/components/layouts/Header/HeaderBody.tsx`
    - `src/client/components/layouts/Header/Navigation/NavDesktop.tsx`
    - `src/client/components/layouts/Header/Navigation/NavMobile.tsx`
    - `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx` (source de vérité de l'arborescence)
- **Structure** (telle que définie dans `NavigationStructure.tsx`) :
    1. Accueil → `/`
    2. **Offres** : Emplois, Stages d'observation (flagged, externe), Stages d'études, Stages 3e/2de (flagged), Contrats d'alternance (**externe LBA**), Jobs d'été (flagged), Jobs étudiants, Emplois en Europe (flagged), Services jeunes offres (flagged old espace jeune off)
    3. **Formations et orientation** : Formations initiales (flagged), Formations en apprentissage (flagged), Découvrir les métiers, Évènements, Apprentissage (**externe LBA**), Services jeunes formation (flagged)
    4. **Engagement** : Bénévolat, Service civique, Services jeunes engagement (flagged)
    5. **Accompagnement** : CEJ, Mentorat, Structure d'accompagnement, Entreprendre, Expérience Europe, Services jeunes accompagnement (flagged), MyJobGlasses (flagged)
    6. **Logement** : Annonces, Aides financières, Conseils, Services jeunes logement (flagged)
    7. **Aides et outils** : Simulateur d'aides, Aides au permis (flagged), Créer son CV, Services jeunes aides (flagged)
    8. **Je suis employeur** : Les entreprises s'engagent, sous menu «Recruter et agir pour les jeunes» (Je recrute, Je deviens mentor, Immersions, Je recrute afpr poei, Je recrute un apprenti **externe LBA**), Mesures employeurs, Mon espace
- **À creuser** :
    - Liste complète des feature flags qui affectent la navigation et leur valeur actuelle en prod.
    - Gestion des liens externes dans le menu : signalement visuel (icône sortie ?), analytics de clic.
    - Cohérence desktop/mobile : la structure est elle identique ou simplifiée sur mobile ?

### T3. Footer

- **Points d'intégration** : `src/client/components/layouts/Footer/Footer.tsx`.
- **Contenu** :
    - Logo Ministère du Travail + France Relance + CTA «Besoin d'aide ? → FAQ»
    - Liens externes : legifrance.gouv.fr, gouvernement.fr, service-public.fr, data.gouv.fr, france.fr
    - Liens utiles internes : plan du site, CGU, accessibilité, mentions légales, politique de confidentialité
    - Licence Etalab 2.0
- **À creuser** :
    - Liens externes sont ils tracés (analytics sortie) ?

### T4. Pages d'erreur

- **Pages** :
    - `src/pages/404.page.tsx` (page 404 custom)
    - `src/pages/_error.page.tsx` (error boundary Next.js, 500 et plus)
    - `src/pages/maintenance-france-travail/index.page.tsx` (CSR, page de maintenance dédiée quand France Travail est indisponible)
- **À creuser** :
    - Qui décide de la bascule vers `/maintenance-france-travail` ? Manuelle (redéploiement avec flag) ou automatique (fallback dans le BFF) ?
    - Monitoring : Sentry remonte t il les 404 et les 500 ?

### T5. Bandeaux et modales globaux

- **Bannière enquête satisfaction** (`src/client/components/layouts/Header/Banner/EnqueteSatisfaction/EnqueteSatisfactionBanner.tsx`) :
    - Feature flag `NEXT_PUBLIC_ENQUETE_SATISFACTION_FEATURE`.
    - Branche courante corrige un bug sur ce composant (commits `ca114dc7f`, `92c107af8`, `3b22c5c1d`).
    - Sortie externe : `jedonnemonavis.numerique.gouv.fr` (migration récente depuis l'ancien service).
- **Bannière campagne** : composant dédié dans `Header/Banner/Campagne/`, piloté par CMS ou variable d'environnement.
- **Cookies Tarteaucitron** (`src/client/services/cookies/tarteaucitron/`) :
    - Déclenché dans `_app.page.tsx` à chaque navigation via `triggerServices()`.
    - Gère le consentement et l'activation des services tiers (Eulerian, Sentry, Crisp si présent, etc.).
    - Lien vers politique : `/confidentialite`.
- **Bouée (scroll top)** (`src/client/components/ui/Bouée/Bouée.tsx`) :
    - Bouton sticky global inclus dans le layout.
- **À creuser** :
    - Liste exhaustive des services tiers déclarés dans Tarteaucitron et leur état (analytics, pub, fonctionnel, essentiel).
    - Le bandeau «Je donne mon avis» est il un bandeau global ou spécifique à certaines pages (stages uniquement) ?
    - Migration récente jedonnemonavis : quel était l'ancien service et pourquoi la bascule ?

### T6. Container Next.js (`_app.page.tsx`)

- **Points d'intégration** : `src/pages/_app.page.tsx`, `src/pages/_document.page.tsx`.
- **Rôle** : injection des providers DI, du layout global (header/footer), de Tarteaucitron, de l'analytics, des polices et des styles globaux.
- **À creuser** :
    - Arborescence complète des providers (Context React) : thème, analytics, dépendances métier, router, session ?
    - Mesure des Web Vitals et envoi à Sentry / Eulerian.

---

## Parcours prioritaires à creuser en premier

Sur les 40 et quelques parcours listés ci dessus, voici 5 candidats prioritaires pour lancer les prochaines conversations dédiées (critère : richesse fonctionnelle, densité de code, dette technique ou points de flou identifiés) :

1. **C3. Déposer une offre de stage (wizard 3 étapes)** : c'est le parcours interactif le plus complet, avec persistance d'état, validation côté client et BFF, et envoi final. Typiquement la source la plus épaisse de règles métier.
2. **B. Alternance (famille entière)** : plusieurs landings qui coexistent (`/apprentissage`, `/choisir-apprentissage`, `/apprentissage-entreprises`), un menu qui sort directement vers LBA : potentielle duplication et dette éditoriale à cartographier.
3. **T2. Navigation header + feature flags** : cartographier tous les feature flags `NEXT_PUBLIC_*` qui affectent la navigation pour avoir une vision claire du site «tel qu'affiché en prod» versus «tel qu'il est dans le code».
4. **G6/G7. Coexistence `espace-jeune` et `services-jeunes`** : un hub remplace l'autre via le flag `OLD_ESPACE_JEUNE_FEATURE`, avec des points d'entrée hybrides dans la nav : à clarifier pour éviter de maintenir deux systèmes.
5. **C1 + C2 + D3. Parcours Meilisearch (stages, logements, métiers, évènements)** : même socle technique (`InstantSearchLayout`), indexes différents, configurations dupliquées. Conversation dédiée pour identifier la mutualisation réelle et les constantes en dur (`HITS_PER_PAGE`, `NOMBRE_MAX_RESULTATS`).

---

## Annexe A : index brut des 67 pages utilisateur

Trié par chemin. Colonnes : URL publique, fichier source, famille (A à J + T pour transverse), type de rendu.

| URL | Fichier | Famille | Rendu |
| --- | --- | --- | --- |
| `/` | `src/pages/index.page.tsx` | T | ISR |
| `/1jeune1permis` | `src/pages/1jeune1permis/index.page.tsx` | H | SSG |
| `/404` | `src/pages/404.page.tsx` | T | static |
| `/accessibilite` | `src/pages/accessibilite/index.page.tsx` | J | ISR |
| `/accompagnement` | `src/pages/accompagnement/index.page.tsx` | G | SSR |
| `/actualites` | `src/pages/actualites/index.page.tsx` | J | ISR (flagged) |
| `/apprentissage` | `src/pages/apprentissage/index.page.tsx` | B | SSR |
| `/apprentissage/[id]` | `src/pages/apprentissage/[id].page.tsx` | B | SSR |
| `/apprentissage/deposer-offre` | `src/pages/apprentissage/deposer-offre/index.page.tsx` | B | CSR |
| `/apprentissage/entreprise/[id]` | `src/pages/apprentissage/entreprise/[id].page.tsx` | B | SSR |
| `/apprentissage-entreprises` | `src/pages/apprentissage-entreprises/index.page.tsx` | B | CSR |
| `/articles/[id]` | `src/pages/articles/[id].page.tsx` | J | SSG |
| `/benevolat` | `src/pages/benevolat/index.page.tsx` | E | SSR |
| `/benevolat/[id]` | `src/pages/benevolat/[id].page.tsx` | E | SSR |
| `/cgu` | `src/pages/cgu/index.page.tsx` | J | ISR |
| `/choisir-apprentissage` | `src/pages/choisir-apprentissage/index.page.tsx` | B | CSR |
| `/confidentialite` | `src/pages/confidentialite/index.page.tsx` | J | ISR |
| `/contrat-engagement-jeune` | `src/pages/contrat-engagement-jeune/index.page.tsx` | G | CSR |
| `/creer-mon-cv` | `src/pages/creer-mon-cv/index.page.tsx` | A | CSR |
| `/decouvrir-les-metiers` | `src/pages/decouvrir-les-metiers/index.page.tsx` | D | CSR |
| `/decouvrir-les-metiers/[nomMetier]` | `src/pages/decouvrir-les-metiers/[nomMetier].page.tsx` | D | SSG |
| `/emplois` | `src/pages/emplois/index.page.tsx` | A | SSR |
| `/emplois/[id]` | `src/pages/emplois/[id].page.tsx` | A | SSR |
| `/emplois/deposer-offre` | `src/pages/emplois/deposer-offre/index.page.tsx` | A | CSR |
| `/emplois-europe` | `src/pages/emplois-europe/index.page.tsx` | A | SSR |
| `/emplois-europe/[id]` | `src/pages/emplois-europe/[id].page.tsx` | A | SSR |
| `/entreprendre` | `src/pages/entreprendre/index.page.tsx` | H | CSR |
| `/espace-jeune` | `src/pages/espace-jeune/index.page.tsx` | G | ISR |
| `/evenements` | `src/pages/evenements/index.page.tsx` | D | CSR |
| `/experience-europe` | `src/pages/experience-europe/index.page.tsx` | H | CSR |
| `/faq` | `src/pages/faq/index.page.tsx` | J | SSG (revalidate:1) |
| `/faq/[id]` | `src/pages/faq/[id].page.tsx` | J | SSG |
| `/formations/apprentissage` | `src/pages/formations/apprentissage/index.page.tsx` | D | SSR |
| `/formations/apprentissage/[id]` | `src/pages/formations/apprentissage/[id].page.tsx` | D | SSR |
| `/formations-initiales` | `src/pages/formations-initiales/index.page.tsx` | D | SSR |
| `/formations-initiales/[id]` | `src/pages/formations-initiales/[id].page.tsx` | D | SSR |
| `/immersions` | `src/pages/immersions/index.page.tsx` | I | CSR |
| `/immersions/referencer-mon-entreprise` | `src/pages/immersions/referencer-mon-entreprise/index.page.tsx` | I | CSR |
| `/je-deviens-mentor` | `src/pages/je-deviens-mentor/index.page.tsx` | I | CSR |
| `/je-recrute` | `src/pages/je-recrute/index.page.tsx` | I | CSR |
| `/je-recrute-afpr-poei` | `src/pages/je-recrute-afpr-poei/index.page.tsx` | I | CSR |
| `/jobs-ete` | `src/pages/jobs-ete/index.page.tsx` | A | SSR |
| `/jobs-ete/[id]` | `src/pages/jobs-ete/[id].page.tsx` | A | SSR |
| `/jobs-etudiants` | `src/pages/jobs-etudiants/index.page.tsx` | A | SSR |
| `/jobs-etudiants/[id]` | `src/pages/jobs-etudiants/[id].page.tsx` | A | SSR |
| `/les-entreprises-s-engagent` | `src/pages/les-entreprises-s-engagent/index.page.tsx` | I | CSR |
| `/logements/aides-logement` | `src/pages/logements/aides-logement/index.page.tsx` | F | CSR |
| `/logements/annonces` | `src/pages/logements/annonces/index.page.tsx` | F | CSR (flagged) |
| `/logements/annonces/[id]` | `src/pages/logements/annonces/[id].page.tsx` | F | SSR |
| `/logements/conseils` | `src/pages/logements/conseils/index.page.tsx` | F | CSR |
| `/maintenance-france-travail` | `src/pages/maintenance-france-travail/index.page.tsx` | T | CSR |
| `/mentions-legales` | `src/pages/mentions-legales/index.page.tsx` | J | ISR |
| `/mentorat` | `src/pages/mentorat/index.page.tsx` | G | CSR |
| `/mes-aides` | `src/pages/mes-aides/index.page.tsx` | G | CSR |
| `/mesures-employeurs` | `src/pages/mesures-employeurs/index.page.tsx` | G | ISR |
| `/mon-espace` | `src/pages/mon-espace/index.page.tsx` | I | CSR |
| `/myjobglasses` | `src/pages/myjobglasses/index.page.tsx` | H | CSR |
| `/plan-du-site` | `src/pages/plan-du-site/index.page.tsx` | J | CSR |
| `/service-civique` | `src/pages/service-civique/index.page.tsx` | E | SSR |
| `/service-civique/[id]` | `src/pages/service-civique/[id].page.tsx` | E | SSR |
| `/services-jeunes` | `src/pages/services-jeunes/index.page.tsx` | G | ISR |
| `/stages` | `src/pages/stages/index.page.tsx` | C | CSR |
| `/stages/[id]` | `src/pages/stages/[id].page.tsx` | C | SSR |
| `/stages/deposer-offre` | `src/pages/stages/deposer-offre/index.page.tsx` | C | CSR |
| `/stages/deposer-offre/confirmation-envoi` | `src/pages/stages/deposer-offre/confirmation-envoi/index.page.tsx` | C | CSR |
| `/stages/deposer-offre/localisation` | `src/pages/stages/deposer-offre/localisation/index.page.tsx` | C | CSR |
| `/stages/deposer-offre/votre-offre-de-stage` | `src/pages/stages/deposer-offre/votre-offre-de-stage/index.page.tsx` | C | CSR |
| `/stages-3e-et-2de` | `src/pages/stages-3e-et-2de/index.page.tsx` | C | SSR |
| `/stages-3e-et-2de/candidater` | `src/pages/stages-3e-et-2de/candidater/index.page.tsx` | C | SSR |

**Pages racines Next.js non listées ci dessus** (hors comptage 67) : `_app.page.tsx` (container), `_document.page.tsx` (template HTML), `_error.page.tsx` (error boundary).

**Note sur le 404** : Next.js utilise `src/pages/404.page.tsx` pour les 404, inclus dans le tableau ci dessus et compté comme page utilisateur (famille T). Si on le retire du compte, on obtient 66 pages métier + 1 page 404 = 67.

---
