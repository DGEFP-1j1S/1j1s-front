# Rediriger les parcours alternance 1J1S vers les landing pages LBA dédiées

> **Mise à jour post test recette (21 avril 2026)** : suite retour de LBA, les UTM injectés sur les redirections ont été ajustés. Les valeurs effectives produites par le code sont désormais :
>
> * Candidats : `utm_source=1j1s&utm_medium=website&utm_campaign=landinglba1j1s`
> * Recruteurs : `utm_source=1j1s&utm_medium=website&utm_campaign=recruteurs_landinglba1j1s`
>
> Les mentions `utm_source=1jeune1solution` dans le corps de ce ticket correspondent à la spec initiale, pas à l'état courant.

**Type** : User story (avec volet enabler de nettoyage)
**Priorité** : P1
**Échéance** : semaine du 20 avril 2026 au plus tard (campagne grand public alternance en mai 2026)
**Source** : mail DGEFP, Houssine Gartoum, 9 avril 2026. Verbatim et échanges complets dans `docs/docs/liens_lba/contexte.md`.

## USER STORY

En tant que **jeune candidat à l'alternance** ou **recruteur d'apprenti** arrivant sur 1jeune1solution.gouv.fr,
je veux **atterrir directement sur une page dédiée qui me permet d'agir** (candidater ou déposer une offre),
afin d'**éliminer les ruptures de navigation qui dégradent aujourd'hui la conversion sur le parcours alternance**.

## CONTEXTE

La DGEFP et La Bonne Alternance ont publié deux landing pages aux couleurs 1J1S, l'une côté candidats (`/1jeune1solution`), l'autre côté recruteurs (`/1jeune1solution-recruteurs`). Ces landings centralisent désormais le parcours alternance et remplacent les pages de recherche, de détail d'offre, de candidature spontanée et de dépôt d'offre actuellement hébergées sur 1J1S. La bascule doit être en production avant la campagne grand public alternance prévue en mai 2026, sur demande écrite de Houssine Gartoum (DGEFP/SDFIMOD/MISI). Les réponses LBA sur les 8 questions techniques posées en amont sont documentées dans `contexte.md`.

## RÈGLES DE GESTION & DÉPENDANCES

* Redirections permanentes (HTTP 308), indexables par les moteurs, car les URLs cibles LBA sont stables dans le temps (confirmé par LBA).
* Les query params reçus sur les URLs sources sont intégralement transmis aux landings LBA, pour préserver les campagnes et les UTM en cours.
* Un identifiant de provenance fixe `utm_source=1jeune1solution` est ajouté sur chaque redirection. Il doit remonter dans Plausible et Matomo côté LBA pour mesurer le volume basculé.
* `/formations/apprentissage` (recherche de formations en apprentissage type CFA) est hors périmètre et reste strictement hébergée sur 1J1S, avec toutes ses dépendances (composants `FormationAlternance`, serveur `formations`, serveur `metiers`, `ComboboxMetiers`, variable `NEXT_PUBLIC_FORMATION_LBA_FEATURE`).
* La landing recruteurs remplace intégralement l'ancien widget iframe LBA embarqué dans `/apprentissage/deposer-offre`. Aucune autre instance du widget à conserver.
* La landing candidats remplace l'iframe LBA de candidature spontanée actuellement embarquée dans `/apprentissage/entreprise/{id}`.
* Les 3 entrées du menu principal concernées doivent suivre le pattern d'externalisation déjà en place pour « Stages d'observation » : lien externe, icône « nouvelle fenêtre » automatique, ouverture en nouvel onglet via le hook `useIsInternalLink`.

## CRITÈRES D'ACCEPTATION

### Scénario 1 : redirection côté candidats (URL racine)

```
Étant donné un visiteur arrivant sur /apprentissage ou /choisir-apprentissage
Quand il accède à l'URL (directement, via Google, ou via un partage externe)
Alors il est redirigé en HTTP 308 vers https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution?utm_source=1jeune1solution
Et les query params présents sur l'URL source sont transmis à la destination
```

### Scénario 2 : redirection côté candidats (sous routes indexées)

```
Étant donné un visiteur arrivant sur /apprentissage/{id} (détail d'offre) ou /apprentissage/entreprise/{id} (candidature spontanée)
Quand il accède à l'URL via un deep link externe ou un résultat Google
Alors il est redirigé en HTTP 308 vers la landing candidats LBA avec utm_source=1jeune1solution et les query params source forwardés
```

### Scénario 3 : redirection côté recruteurs

```
Étant donné un visiteur arrivant sur /apprentissage-entreprises ou /apprentissage/deposer-offre
Quand il accède à l'URL
Alors il est redirigé en HTTP 308 vers https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs?utm_source=1jeune1solution
Et les query params présents sur l'URL source sont transmis à la destination
```

### Scénario 4 : menu de navigation

```
Étant donné un visiteur du portail 1J1S, sur desktop ou mobile
Quand il ouvre le menu principal
Alors l'entrée « Contrats d'alternance » (section Offres) pointe directement vers la landing candidats LBA
Et l'entrée « Découvrir et trouver sa voie avec l'apprentissage » (section Formations et orientation) pointe directement vers la landing candidats LBA
Et l'entrée « Je recrute un apprenti » (section Je suis employeur) pointe directement vers la landing recruteurs LBA
Et chaque entrée affiche l'icône « nouvelle fenêtre » et ouvre dans un nouvel onglet
```

### Scénario 5 : préservation du périmètre formations

```
Étant donné que /formations/apprentissage est hors périmètre
Quand un visiteur accède à /formations/apprentissage ou à /formations/apprentissage/{id}
Alors la page répond normalement sans redirection
Et l'entrée « Formations en apprentissage » du menu reste un lien interne vers /formations/apprentissage
```

### Scénario 6 : nettoyage du sitemap

```
Étant donné le sitemap généré par 1J1S
Quand il est servi sur /sitemap.xml
Alors il ne contient plus aucune des URLs alternance redirigées
Et il contient toujours /formations/apprentissage
```

### Scénario 7 : mesure côté LBA

```
Étant donné qu'une redirection a été déclenchée depuis une URL 1J1S alternance
Quand le visiteur arrive sur la landing LBA
Alors Plausible et Matomo côté LBA enregistrent la visite avec utm_source=1jeune1solution
```

## HORS PÉRIMÈTRE

* `/formations/apprentissage` et toutes ses dépendances (à préserver strictement).
* La landing LBA elle-même, qui est déjà en ligne et maintenue par l'équipe LBA.
* La campagne de communication grand public alternance de mai 2026 (suivie par la DGEFP).
* Le suivi analytique côté 1J1S après bascule (les visiteurs ne touchent plus le portail, seul LBA mesure).

## NOTES

### Volet enabler : nettoyage du code mort

Après bascule, tout le pan alternance candidats et recruteurs devient inaccessible et constitue du code mort à supprimer. Option « Nettoyage complet » validée. Cartographie exhaustive dans `contexte.md` :

* **99 fichiers à supprimer** : pages, composants `Alternance/*` et `CampagneApprentissage/*`, ServiceCard `DecouvrirApprentissage`, serveur `alternances/*` et `campagne-apprentissage/*`, test Cypress, routes BFF `/api/alternances`, feature flag `NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE` dans les `.env.*`.
* **50+ fichiers à préserver** : tout le pan `/formations/apprentissage` (pages, composants `FormationAlternance/*`, serveur `formations/*`, serveur `metiers/*`, route BFF `/api/metiers`, `ComboboxMetiers`).
* **14 fichiers à mettre à jour** : navigation, sitemap, configuration serveur, liens résiduels dans les composants `JeRecrute/*`, cartes de la page d'accueil, tests du plan du site et du header.

### Points de vigilance

* Le composant `MonEspaceEntreprise.tsx` utilise encore `NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL` pour l'espace pro LBA. Il n'est pas lié au périmètre alternance supprimé. La variable d'env doit rester au runtime.
* L'ordre des règles dans `config/redirects.js` est structurant : les règles spécifiques (notamment `/apprentissage/deposer-offre` vers recruteurs et `/apprentissage/simulation` existante) doivent précéder le wildcard `/apprentissage/:path*` qui cible les candidats, sinon le wildcard prend le dessus.
* Next.js 14 forward automatiquement les query params source sur les redirections (vérifié doc officielle). Pas besoin d'énumérer explicitement les UTM dans la config.

## QUESTIONS OUVERTES

1. **Stratégie PR** : un seul PR « bascule fonctionnelle plus nettoyage 99 fichiers » (gros diff cohérent) ou deux PR séparées (bascule d'abord pour respecter l'échéance du 20 avril, ménage à froid ensuite) ?
2. **CTAs résiduels `JeRecrute`** : dans `DecouvrirDispositifs` et `DecouvrirMesuresEmployeursEtApprentissage`, on retarge les liens directement vers les URLs LBA externes (UX optimale, hop direct, icône « nouvelle fenêtre ») ou on supprime purement les CTAs (perte fonctionnelle mineure) ?

## VÉRIFICATION DE LIVRAISON

* `npm run lint` sans warning.
* `npm run check-types`.
* `npm test` vert (suite vitest).
* `curl -I` sur chaque URL source (`/apprentissage`, `/apprentissage/abc`, `/apprentissage/entreprise/xyz`, `/choisir-apprentissage`, `/apprentissage-entreprises`, `/apprentissage/deposer-offre`) pour confirmer le 308, la destination exacte et le forward des query params.
* Vérification visuelle du header desktop et mobile : les 3 entrées affichent l'icône « nouvelle fenêtre ».
* Lecture de `/sitemap.xml` : absence des URLs redirigées, présence de `/formations/apprentissage`.
* Validation côté LBA que Plausible et Matomo reçoivent bien `utm_source=1jeune1solution`.

## HYPOTHÈSES PRISES

* Le typo « /apprentissage/époser-offre » dans la demande initiale est bien une coquille pour `/apprentissage/deposer-offre` (confirmé par LBA).
* Les URLs cibles `/1jeune1solution` et `/1jeune1solution-recruteurs` sont stables (confirmé par LBA).
* L'approche wildcard pour les query params est techniquement la plus propre (Next.js le fait nativement, recommandation à faire remonter à LBA à titre informatif).

## TEST INVEST

* **I** (Indépendante) : OK, aucune dépendance amont.
* **N** (Négociable) : CTAs résiduels et stratégie PR restent négociables (cf. questions ouvertes).
* **V** (Valuable) : bénéfice mesurable via `utm_source=1jeune1solution` dans Plausible et Matomo.
* **E** (Estimable) : périmètre technique cerné (99 fichiers suppression, 14 fichiers modification, pas d'inconnu).
* **S** (Small) : dépend de la stratégie PR. Un seul PR = moyen à gros. Deux PR = small + medium.
* **T** (Testable) : 7 scénarios d'acceptation vérifiables.
