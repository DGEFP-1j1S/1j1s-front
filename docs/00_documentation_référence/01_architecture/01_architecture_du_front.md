# Architecture du front

_S'adresse à un développeur qui arrive sur le code et doit s'y repérer, et à un tech lead qui évalue la structure. Dernière revue : 31 juillet 2026._

Après lecture, le développeur sait où poser un fichier et où chercher un comportement ; le tech lead sait reconnaître le mode de rendu d'une page donnée et pourquoi ce mode s'y applique.

**Glossaire minimal** (chaque sigle est reglosé à sa première apparition dans le corps) :
- **BFF** : back for front, la couche d'API HTTP interne au dépôt front, sous `src/pages/api/`. Le navigateur l'appelle, elle appelle les services externes.
- **SSG, ISR, SSR** : les trois modes exclusifs de fabrication du HTML côté serveur, dont une page retient un seul. **CSR** : la couche client qui se superpose à l'un des trois. Détaillés en section 3.7.
- **CMS** : Content Management System, ici Strapi, source des contenus froids (accueil, articles, faq).
- **SEO** : référencement par les moteurs de recherche.
- **Clean architecture** : organisation qui isole la logique métier des détails techniques (HTTP, format des partenaires) derrière des interfaces.

---

## 1. Le problème

Un dépôt Next.js de cette taille (quelque 70 pages de routes, 18 endpoints BFF, une trentaine de dossiers sous `server/`) se lit mal au hasard. Deux questions reviennent sans cesse et coûtent cher quand on y répond de travers :

1. **Où va ce code ?** Un composant, un appel à France Travail, un type métier, une feuille de style : chacun a un seul bon dossier. Se tromper disperse une responsabilité sur plusieurs couches.
2. **Par quel mécanisme cette page est rendue ?** Le même fichier `.page.tsx` peut être figé au build, régénéré périodiquement, ou recalculé à chaque requête. Le nom du fichier ne le dit pas ; le choix conditionne la fraîcheur des données, la charge serveur et le SEO.

Ce document répond aux deux, sourcé sur le code présent au dépôt, et corrige au passage une erreur factuelle propagée par la documentation d'accueil (voir section 5).

---

## 2. Le concept

### 2.1 Un dépôt, deux métiers

Le front joue deux rôles dans le même processus Next.js :

```
Navigateur ──HTTP──> [ pages/ : rend le site ]
                     [ pages/api/ : le BFF ]  ──HTTP──> Services externes
                                                        (CMS Strapi, France Travail,
                                                         Meilisearch, API Adresse...)
```

Le site rendu et le BFF (back for front, la couche d'API interne qui sert de proxy métier vers les partenaires) vivent côte à côte sous `src/pages/`. Cette dualité explique le découpage qui suit. Le navigateur passe toujours par le BFF pour joindre un partenaire : le BFF garde côté serveur les jetons d'authentification partenaire, contourne les restrictions d'origine (CORS), et remet en forme les réponses avant de les rendre à la page.

### 2.2 Quatre territoires sous `src/`

```
src/
├── client/   ce qui s'exécute dans le navigateur (composants React, styles appliqués)
├── pages/    les routes du site ET les routes du BFF (api/)
├── server/   la logique métier et le dialogue avec les services externes
└── styles/   les styles partagés, agrégés en un point d'entrée SCSS
```

Modèle mental : **`client/` affiche, `server/` sait, `pages/` relie les deux et expose les routes, `styles/` habille.** Une page (`pages/`) importe des composants (`client/`) et, pour ses données, appelle des cas d'usage (`server/`).

Sources : arborescence réelle sous `src/` ; découpage historique décrit dans `docs/docs/architecture/architecture.md` (daté du 20 avril 2023), confronté au code plus bas.

---

## 3. Les mécanismes

### 3.1 `client/` : l'affichage

```
client/
└── components/
    ├── features/   composants portant une logique métier (une recherche, un formulaire)
    ├── ui/         composants génériques du design system (bouton, modale, champ)
    ├── layouts/    gabarits de page mutualisés (entête, pied, ossature commune)
    └── head/       composants qui alimentent la balise <head> (métadonnées, SEO)
```

Outre `components/`, `client/` héberge aussi les services client (dont le client HTTP vers le BFF), les hooks et le conteneur d'injection de dépendances chargé par l'application (`src/pages/_app.page.tsx:13`).

### 3.2 `pages/` : les routes et le BFF

Le routage Next.js repose sur l'arborescence de fichiers. Deux familles de fichiers y cohabitent :

```
pages/
├── _app.page.tsx        enveloppe commune à toutes les pages (layout, contexte, <Head>)
├── _document.page.tsx   squelette HTML du document (<Html>, <Head>, <Main>, <NextScript>)
├── {ma-page}/
│   ├── index.page.tsx        point d'entrée de la route + fonctions de rendu
│   ├── index.page.test.tsx   test de la page (React Testing Library)
│   └── index.analytics.ts    configuration des événements analytics de la page
└── api/                 le BFF : chaque dossier est une ressource exposée
    ├── middlewares/     middlewares partagés (validation, monitoring, méthode HTTP)
    └── {ressource}/
        ├── index.controller.ts       handler de l'endpoint
        └── index.controller.test.ts  test de l'endpoint
```

Sources : `src/pages/_app.page.tsx`, `src/pages/_document.page.tsx:1` (import depuis `next/document`), `src/pages/api/middlewares/` (dossiers `methods/`, `monitoring/`, `validation/`), `src/pages/api/formations/index.controller.ts:26`.

### 3.3 `server/` : la logique métier par module

Chaque module suit une organisation qui tend vers la clean architecture (cf. glossaire). Convention transverse : **noms de dossiers au pluriel, noms de fichiers au singulier.**

```
server/{module}/
├── configuration/   assemble les dépendances du module en une fonction
├── domain/          types métier et interface(s) de repository (le contrat)
├── infra/
│   └── repositories/  implémentations du contrat (dialogue réel avec le partenaire)
└── useCases/        cas d'usage métier (orchestrent domain + repositories)
```

Le même suffixe `.repository.ts` porte deux rôles selon le dossier : le contrat dans `domain/`, l'implémentation dans `infra/repositories/`. Exemple vérifié sur le module `demande-de-contact` :

```
server/demande-de-contact/
├── configuration/
├── domain/
│   └── demandeDeContact.repository.ts                     (interface)
├── infra/repositories/
│   ├── accompagnement/demandeDeContactAccompagnement.repository.ts  (implémentation)
│   └── cej/demandeDeContactCEJ.repository.ts                        (implémentation)
└── useCases/
```

Un même module peut porter plusieurs implémentations du même contrat (ici : accompagnement et CEJ, le Contrat d'Engagement Jeune). Deuxième module vérifié, `formations-initiales`, qui pousse le dossier `configuration/` plus loin :

```
server/formations-initiales/
├── configuration/
│   ├── httpClient/    configuration du client HTTP du partenaire
│   └── tokenAgent/    gestion du jeton d'authentification partenaire
├── domain/
├── infra/
└── useCases/
```

Un dossier `configuration/` existe aussi à la racine de `server/`, pour les dépendances communes à tous les modules.

Sources : `src/server/demande-de-contact/`, `src/server/formations-initiales/` (arborescences relevées au dépôt).

### 3.4 `styles/` : les styles partagés

Les styles propres à un composant vivent à côté de lui en `.module.scss` (CSS Modules, scoping local automatique). Les styles partagés sous `src/styles/` s'organisent en deux points d'entrée indépendants, à ne pas confondre :

- `src/styles/main.scss` porte les règles globales de base (reset, thème, typographie). Il est importé une seule fois au sommet de l'application (`src/pages/_app.page.tsx:1`), donc chargé une fois pour toute l'application.
- `src/styles/_utilities.scss` est un baril `@forward` (mixins, variables, placeholders, fonction `pixel-to-rem`). Chaque `.module.scss` ou partial le `@use` pour obtenir ces utilitaires, ce qui fige l'ordre de cascade SCSS et évite de redéclarer les mêmes mixins dans chaque fichier.

`main.scss` ne tire pas `_utilities.scss` ; les deux servent deux besoins distincts, l'un global côté page, l'autre local côté composant.

Sources : `src/styles/main.scss` (l.2 à 7 : `@use` de `reset`, `theme`, `typography`, `utilities-deprecated`, aucune référence à `_utilities`), `src/styles/_utilities.scss` (baril `@forward` seul), `src/pages/_app.page.tsx:1` (`import '~/styles/main.scss'`).

### 3.5 Nomenclature des suffixes

Le suffixe encode la destination du fichier. Deux d'entre eux sont structurants : le routeur Next les charge, un renommage casse la route. La colonne de droite indique ce qui casse au renommage.

| Suffixe          | Rôle                                                          | Structurant ? Ce qui casse si on renomme                                    |
| ---------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `.page.tsx`      | composant + fonctions de rendu d'une route du site           | **Oui.** Chargé par `pageExtensions` (`next.config.js:70`) : renommer sort le fichier du routage. |
| `.controller.ts` | handler d'un endpoint du BFF                                 | **Oui.** Même `pageExtensions` (`next.config.js:70`).                       |
| `.repository.ts` | contrat (dans `domain/`) et implémentation (dans `infra/`)   | Non. Convention ; le dossier tranche le rôle, le suffixe reste identique.    |
| `.middleware.ts` | middleware du BFF, composé autour d'un handler               | Non. Assemblé explicitement (`formations/index.controller.ts:26`).          |
| `.analytics.ts`  | configuration des événements analytics d'une page            | Non. Convention ; importé par la page.                                      |
| `.module.scss`   | styles CSS Modules scopés à un composant                     | Non, mais le suffixe déclenche le scoping local par le compilateur.         |
| `.fixture.ts`    | données de test                                              | Non. Convention de test.                                                     |
| `.mock.ts`       | stubs de services ou fonctions pour les tests                | Non. Convention de test.                                                     |

Sources : `next.config.js:70` (`pageExtensions: ['page.tsx','controller.ts']`) ; existence vérifiée pour chaque suffixe (`.module.scss` 194 fichiers, `.fixture.ts` 103, `.analytics.ts` 62, `.mock.ts` 4 au dépôt).

### 3.6 Aliases d'import (`tsconfig.json`)

| Alias        | Cible          | Exemple d'usage                                    |
| ------------ | -------------- | -------------------------------------------------- |
| `~/*`        | `src/*`        | `import { Layout } from '~/client/components/...'`  |
| `@styles/*`  | `src/styles/*` | `import '@styles/...'`                              |

Sources : `tsconfig.json:21` (`~/*`), `tsconfig.json:22` (`@styles/*`).

### 3.7 Les modes de rendu

Côté serveur, un fichier `.page.tsx` fabrique son HTML selon trois modes exclusifs (SSG, ISR, SSR), dont une page retient un seul. Le déclencheur est le nom de la fonction de récupération de données exportée, et la présence ou l'absence de `revalidate` (le délai de péremption, en secondes, au bout duquel Next régénère la page).

- **SSG** (Static Site Generation) : HTML figé une fois pour toutes au build.
- **ISR** (Incremental Static Regeneration) : HTML statique régénéré périodiquement ou à la demande.
- **SSR** (Server Side Rendering) : HTML recalculé à chaque requête entrante.

Par-dessus l'un de ces trois modes serveur vient une couche client, le **CSR** (Client Side Rendering) : du contenu recalculé dans le navigateur après l'hydratation (le moment où le JavaScript du navigateur reprend la main sur le HTML déjà rendu par le serveur). Le CSR se cumule avec le mode serveur de la page ; il forme une quatrième dimension, orthogonale aux trois premières. Une page SSG, ISR ou SSR peut donc ensuite recalculer du contenu côté client.

| Mode | Déclencheur dans le code                                          | Généré quand                        | Employé pour                                        | Piège / delta contre la doc 2023                                                                                                   |
| ---- | ----------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| SSG  | `getStaticProps` **sans** `revalidate`                            | au build                            | page 100 % statique, rare ici                       | Au moment de la revue, une seule page relève du SSG pur (`src/pages/1jeune1permis/index.page.tsx:14`). La doc 2023 rangeait l'accueil et la recherche en SSG : faux aujourd'hui. |
| ISR  | `getStaticProps` **avec** `revalidate` (+ `getStaticPaths`, qui déclare les valeurs de `[id]` à pré-générer, pour les routes dynamiques) | au build puis régénéré au fil de l'eau | données froides du CMS (accueil, articles, faq)     | `revalidate` est piloté par le CMS via `duréeDeValiditéEnSecondes()` (`src/pages/index.page.tsx:386`), donc sa valeur varie dans le temps. Sur ressource absente, la page renvoie `notFound: true, revalidate: 1` pour réessayer vite (`src/pages/articles/[id].page.tsx:45`). |
| SSR  | `getServerSideProps`                                              | à chaque requête                    | enveloppe des pages de recherche, pages de détail d'offre à données mouvantes | La doc 2023 affirme « aucune page SSR » : faux, 26 pages `.page.tsx` l'exportent (recherche emplois, stages, formations, bénévolat, jobs d'été). |
| CSR  | code client : `react-instantsearch`, ou client HTTP vers le BFF   | dans le navigateur, après hydratation | filtrage et pagination des recherches               | Deux voies client coexistent : le client HTTP BFF (`src/client/services/bff.httpClient.service.ts:15`, `baseURL: '/api'`) et `react-instantsearch` contre Meilisearch (`src/client/components/ui/Meilisearch/`). Voir NON CONFIRME en section 5. |

Détail important sur l'accueil : `src/pages/index.page.tsx:381` exporte `getStaticProps`, et la ligne 386 fixe `revalidate` depuis la configuration du CMS. L'accueil relève donc de l'ISR, à rebours de la doc 2023 qui le range en SSG.

Un exemple de page de recherche en SSR : `src/pages/emplois/index.page.tsx:69` exporte `getServerSideProps`. L'enveloppe initiale (filtres, premiers résultats) arrive rendue par le serveur ; l'interaction ensuite (nouveaux filtres, page suivante) est servie côté client, en CSR. Cette même page cumule donc SSR et CSR.

Diagramme de décision, pour choisir le mode d'une nouvelle page :

```
Mode serveur (un seul) : quelle est la donnée affichée ?
  Figée au build, valable telle quelle ensuite ... SSG   (getStaticProps, sans revalidate)
  Froide, issue du CMS, tolère un délai .......... ISR   (getStaticProps + revalidate [+ getStaticPaths si route [id]])
  Chaude, dépend de la requête entrante .......... SSR   (getServerSideProps)

Couche client, par-dessus le mode serveur, cumulable :
  Contenu recalculé par l'interaction dans le navigateur ... + CSR   (react-instantsearch / client HTTP BFF)
```

---

## 4. Limites et pièges

- **Le mode de rendu ne se lit pas dans le nom du fichier.** Tout `.page.tsx` se ressemble en surface. Pour connaître le mode, ouvrir la page et repérer `getStaticProps` (avec ou sans `revalidate`) ou `getServerSideProps`.
- **Renommer `.page.tsx` ou `.controller.ts` sort le fichier du routage.** `pageExtensions` (`next.config.js:70`) restreint les extensions que Next considère comme des routes. Un fichier `.tsx` sans le segment `.page` reste un module ordinaire, ignoré par le routeur.
- **`.repository.ts` désigne deux choses.** Interface sous `domain/`, implémentation sous `infra/repositories/`. Le dossier tranche le rôle.
- **Convention pluriel/singulier facile à enfreindre.** Dossiers au pluriel, fichiers au singulier. Un lint ne l'impose pas systématiquement ; l'écart passe en revue.
- **La doc historique `docs/docs/architecture/architecture.md` est datée (avril 2023).** Sa description du découpage `src/` reste juste ; sa cartographie des modes de rendu a divergé du code (voir section 3.7). La traiter comme un repère historique, à revérifier contre le code avant toute citation.

---

## 5. Certitude

### Confirmé (sourcé sur le code)

- **Le projet tourne sur le Pages Router de Next.** L'App Router n'est pas employé. Preuves convergentes :
  - `next.config.js:70` déclare `pageExtensions: ['page.tsx','controller.ts']`, mécanisme propre au Pages Router.
  - `src/pages/_app.page.tsx` et `src/pages/_document.page.tsx:1` existent et importent depuis `next/document` (`Html`, `Head`, `Main`, `NextScript`) : ce sont les fichiers structurants du Pages Router. Aucun dossier `src/app/` au dépôt.
  - Les pages exportent `getStaticProps` (14 fichiers `.page.tsx` hors tests) et `getServerSideProps` (26 fichiers `.page.tsx` hors tests), API de récupération de données du Pages Router. L'App Router utiliserait des composants serveur et des Route Handlers, absents ici.
  - Les endpoints BFF utilisent `NextApiRequest`/`NextApiResponse` (`src/pages/api/formations/index.controller.ts:2,21`), signature du Pages Router.
- **Erreur des sources à corriger.** Le fichier de matière première `docs/00_documentation_référence/matière_première/ancienne_intro.md:83` affirme « Next.js 14 avec App Router ». C'est faux. À remplacer par « Next.js 14, Pages Router » dans toute reprise.
- **Découpage `src/` en quatre parties**, structure `server/{module}` sur deux modules réels, aliases, suffixes : sourcés en sections 3.1 à 3.6.

### NON CONFIRME

- **Cartographie voie par voie du CSR.** Deux mécanismes client de recherche existent (BFF `/api` et `react-instantsearch` sur Meilisearch), tous deux présents au dépôt. Quelle page de recherche emprunte quelle voie n'a pas été relevé page par page. À cartographier si la nouvelle équipe touche à la recherche.
- **Exhaustivité du recensement SSG.** L'affirmation « une seule page en SSG pur » vaut pour les fichiers `*.page.tsx` portant `getStaticProps` sans `revalidate` au moment de la revue. Un balayage ultérieur, après ajout de pages, doit être refait avant de la citer comme acquise.

---

## 6. Ce que ça change

**Poser un nouveau fichier**, décision en trois temps :

```
1. Quelle couche ?   affichage → client/   |   route/endpoint → pages/   |   métier → server/{module}/   |   style partagé → styles/
2. Quel suffixe ?    voir 3.5 ; page = .page.tsx, endpoint = .controller.ts, contrat/impl = .repository.ts, style local = .module.scss
3. Quel dossier dans server/ ?   type/contrat → domain/   |   appel partenaire → infra/repositories/   |   orchestration → useCases/   |   câblage → configuration/
```

**Créer une page**, appliquer le diagramme de décision de la section 3.7 avant d'écrire la fonction de rendu.

**Ne jamais renommer** un `.page.tsx` ou un `.controller.ts` sans mesurer que le fichier disparaît du routage (`pageExtensions`, `next.config.js:70`).

**Corriger la matière première.** Toute reprise de `ancienne_intro.md` doit écrire « Pages Router ». La confusion App Router / Pages Router change les réflexes de toute une équipe (structure des routes, API de données, tests d'API) : la lever tôt évite des heures d'égarement.

---

## 7. Pour aller plus loin (fichiers qui font foi)

- `next.config.js` : `pageExtensions`, réécritures, redirections, entêtes de sécurité, Sentry.
- `tsconfig.json` : aliases `~/*` et `@styles/*`, options du compilateur.
- `src/pages/_app.page.tsx` et `src/pages/_document.page.tsx` : enveloppe applicative et squelette HTML, marqueurs du Pages Router.
- `src/pages/index.page.tsx` : accueil en ISR, `revalidate` piloté par le CMS.
- `src/pages/emplois/index.page.tsx` : page de recherche en SSR puis CSR.
- `src/server/demande-de-contact/` et `src/server/formations-initiales/` : deux modules illustrant `configuration / domain / infra / useCases`.
- `src/client/services/bff.httpClient.service.ts` : le client HTTP du navigateur vers le BFF (`baseURL: '/api'`).
- `docs/docs/architecture/architecture.md` (avril 2023) : ancêtre de ce document, à lire en gardant en tête ses écarts recensés en section 3.7.
