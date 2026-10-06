# Le parcours CEJ, anatomie d'une demande de contact

_S'adresse à un PO qui veut comprendre le dispositif CEJ et le devenir des données, et à un dev qui veut voir de bout en bout un parcours formulaire. Dernière revue : 31 juillet 2026._

Après lecture, le PO saura ce que le CEJ propose, qui il cible, et par quel tuyau une demande de rappel arrive jusqu'aux équipes qui téléphonent aux jeunes. Le dev saura tracer un champ de formulaire depuis la saisie de l'utilisateur jusqu'à l'écriture dans le CMS, et pointer chaque étape en `chemin:ligne`.

**Glossaire minimal** (chaque terme est aussi glosé à sa première apparition dans le texte) :

| Terme | Glose courte |
| --- | --- |
| **CEJ** | Contrat d'Engagement Jeune, dispositif public d'accompagnement vers l'emploi |
| **BFF** | back for front, couche serveur du front qui sert d'intermédiaire vers les API externes |
| **Joi** | bibliothèque de validation de schéma en JavaScript |
| **Either** | type de retour qui porte soit un succès, soit une erreur métier, sans exception |
| **hexagonale** | architecture qui isole le cœur métier des détails techniques (le CMS, le HTTP) |
| **Strapi** | le CMS (gestion de contenu) qui stocke, entre autres, les demandes CEJ |
| **FilR** | ancien outil interne de partage de fichiers, canal historique de l'export vers les équipes de rappel |
| **dépôt** | le code source du front versionné dans git (le « repo ») ; « hors du dépôt » veut dire hors du périmètre que ce code peut garantir |
| **matière première / matière** | le document de travail source `Carto_CEJ.md`, brouillon daté et non vérifié dans le code |

---

## 1. Le problème

Un jeune arrive sur la page du Contrat d'Engagement Jeune, il a des questions, il veut qu'on le rappelle. Ce clic déclenche une chaîne qui traverse le navigateur, la couche serveur du front, puis le CMS, et se termine, hors du dépôt (le code source du front versionné dans git), chez des humains qui décrochent un téléphone. Qui reprend le front doit savoir où la donnée entre, comment elle est validée et transformée, où elle se pose, et par quel canal elle repart. Ce canal de sortie porte une fragilité connue traitée en section 4.

## 2. Le concept

Le **CEJ** (Contrat d'Engagement Jeune) est un dispositif public français qui accompagne les jeunes éloignés de l'emploi vers une insertion durable. La page du front n'exécute pas l'accompagnement : elle informe, oriente vers le bon interlocuteur, et capte une intention de rappel. Le mécanisme central de cette page est donc un **parcours formulaire de génération de contact** (un jeune laisse ses coordonnées, une équipe le rappelle).

Le modèle mental tient en une phrase : **le front est un collecteur, le CMS est une boîte aux lettres, l'export est le facteur.** Le front valide et normalise la demande ; le CMS Strapi la range dans une collection nommée `contact-cejs` ; un export hebdomadaire vide cette boîte vers les équipes de rappel (canal dont la section 4 interroge l'état actuel). Tenir ces trois rôles séparés évite la confusion la plus fréquente : croire que le front « envoie aux équipes », alors qu'il écrit seulement dans une boîte que quelqu'un d'autre relève.

### Vision produit (matière datée, susceptible d'évolution)

Les chiffres et montants de cette sous-section proviennent du document de travail source (`Carto_CEJ.md`), daté. Ils décrivent le dispositif à un instant donné et peuvent avoir changé. Ils ne sont pas vérifiables dans le code du front. Traiter comme cadrage produit, pas comme référence à jour.

**Cible.** Jeunes de 16 à 25 ans (jusqu'à 30 ans en situation de handicap), sans emploi ni formation, sans projet professionnel défini, prêts à s'engager dans un programme intensif. Le front applique une borne plus large que cette cible : la validation d'âge accepte 16 à 30 ans pour tout le monde, sans encoder la condition de handicap qui, côté produit, sépare 25 de 30 (voir section 3, source dans le code). Élargissement à clarifier avec le produit (choix volontaire ou dette).

**Proposition de valeur** (données source datées) : parcours personnalisé pouvant durer jusqu'à 12 mois, un conseiller dédié, 15 à 20 heures d'activités par semaine, une allocation pouvant atteindre 561,68 € par mois selon les ressources et le respect des engagements. Ces valeurs sont de la matière première : les revérifier auprès du produit avant toute réutilisation.

**Les deux orienteurs.** La page aiguille vers l'un de deux acteurs au moyen d'un questionnaire d'orientation :

| Acteur | Accompagne | Public typique (source datée) |
| --- | --- | --- |
| **Mission Locale** | les jeunes de 16 à 25 ans | jeunes sans diplôme, sans ressources |
| **France Travail** | les demandeurs d'emploi | jeunes diplômés, demandeurs d'emploi |

**Le parcours de la page en six temps.** La page enchaîne découverte, compréhension, projection, information sur l'allocation, orientation, puis conversion. Le sixième temps (la demande de contact) est l'objet technique de ce document ; les cinq premiers sont du contenu éditorial. L'ordre réel des composants dans la page suit globalement cet enchaînement (`src/pages/contrat-engagement-jeune/index.page.tsx:27-36`), avec des composants éditoriaux (témoignages, application mobile) intercalés hors des six temps : bannière, « qu'est-ce que c'est », actions, « pourquoi c'est fait pour moi », « qu'est-ce que j'y gagne », allocations, témoignages, accompagnement (l'orientation), demande de contact, application mobile.

**Volumétrie et transmission** (matière datée, hors code) : environ 270 demandes par semaine, environ 13 800 demandes traitées sur l'année 2025, transmission hebdomadaire aux équipes de rappel (chaque lundi selon la source). Ces chiffres pilotent la surveillance décrite en section 6 ; leur exactitude reste à confirmer côté équipe (voir section 5).

## 3. Les mécanismes

PO pressé : cette section trace le chemin technique étape par étape ; pour la vue d'ensemble, sautez au schéma « Le tuyau » plus bas, et pour l'enjeu produit, à la section 4.

Le parcours technique va du clic à l'écriture Strapi en huit étapes. Chacune est vérifiée dans le code. La colonne « piège » signale ce qui mordrait un dev qui modifierait l'étape sans la comprendre.

| # | Étape | Où (chemin:ligne) | Piège |
| --- | --- | --- | --- |
| 1 | La section rend un bouton « Demander à être contacté.e » qui ouvre une modale (fenêtre superposée) | `DemandeContactCEJ.tsx:12-25` | Le formulaire vit dans une modale, absent du DOM initial tant que le bouton n'est pas cliqué |
| 2 | La modale contient le formulaire `FormulaireDeContactCEJ` | `FormulaireContactCEJ.tsx:26` | Le composant s'appelle `FormulaireDeContactCEJ` (avec « De ») alors que le dossier s'appelle `FormulaireContactCEJ` (sans « De ») |
| 3 | À la soumission, `FormData` lit les champs HTML et compose l'objet métier | `FormulaireContactCEJ.tsx:35-43` | Les attributs `name` HTML diffèrent des clés métier : `firstname` donne `prénom`, `lastname` donne `nom`, `mail` donne `email`, `phone` donne `téléphone`. Sélectionner une commune peuple deux `<input type="hidden">` nommés `ville` et `codePostal` (`ComboboxCommune.tsx:148,151`), seuls lus par le `FormData` ; le champ visible `name="commune"` (valeur = code commune) n'est pas relu ici |
| 4 | Appel du service client `envoyerPourLeCEJ(formulaire)` résolu par injection de dépendance | `FormulaireContactCEJ.tsx:28,35` | Le service est résolu via `useDependency('demandeDeContactService')`, sans import direct : le tester exige le conteneur de dépendances |
| 5 | Le service BFF poste sur `demandes-de-contact` en ajoutant `type: 'CEJ'` | `bff.demandeDeContact.service.ts:21` | C'est ici, et seulement ici, que la discriminante (le champ qui indique de quel type de demande il s'agit) `type: 'CEJ'` est ajoutée au corps. Le formulaire ne la porte pas |
| 6 | Le contrôleur lit `type`, le retire du corps, aiguille sur l'usecase CEJ (le cas d'usage métier, la logique de traitement) | `index.controller.ts:13-27` | Le `delete command.type` est nécessaire : le schéma Joi rejette les clés inconnues, `type` ferait échouer la validation. Toute valeur de `type` autre que `CEJ` tombe en `DEMANDE_INCORRECTE` |
| 7 | L'usecase valide et normalise via Joi, sinon renvoie un échec métier | `envoyerDemandeDeContactCEJ.usecase.ts:18-25` | `Joi.attempt` lève une exception en cas d'invalidité ; le `catch` la convertit en `createFailure(ErreurMetier.DEMANDE_INCORRECTE)`. Le téléphone est normalisé au format `+33` par la bibliothèque `phone` (`usecase.ts:38-44`) |
| 8 | Le repository (la couche qui écrit dans le stockage) renomme les clés en snake_case et écrit dans la collection Strapi | `demandeDeContactCEJ.repository.ts:11-19` | Renommage obligatoire pour Strapi : `prénom` donne `prenom`, `codePostal` donne `code_postal`, `téléphone` donne `telephone`. Une clé oubliée passe silencieusement à côté du CMS |

L'écriture finale part du service CMS partagé : `save('contact-cejs', body)` poste sur Strapi en enveloppant la charge dans `{ data: {...} }` via un client HTTP authentifié (`strapi.service.ts:106-120`). En cas d'erreur Strapi, ce même service journalise l'échec en sévérité `FATAL`, ce qui produit un log de niveau `fatal` porté par un `SentryException` et remonté au monitoring (`errorManagement.service.ts:73-74`), puis renvoie un `Either` en échec.

### Le tuyau, vue d'ensemble

```
NAVIGATEUR (React)
  Formulaire  →  service BFF envoyerPourLeCEJ()
  clés métier    ajoute { type: 'CEJ' }
        │
        │  POST /api/demandes-de-contact
        │  corps : { ...champs, type: 'CEJ' }
        ▼
SERVEUR (Next.js, couche BFF)
  Contrôleur  →  retire type  →  Usecase (validation Joi)  →  Repository
  aiguillage      strip           normalise (+33)             renomme en snake_case
        │
        │  save('contact-cejs', { data: {...} })
        │  client HTTP authentifié (Bearer)
        ▼
STRAPI (CMS)
  Collection contact-cejs  ←  la boîte aux lettres
        │
        │  export hebdomadaire (hors dépôt)
        ▼
ÉQUIPES DE RAPPEL (humains qui téléphonent)
```

### Ce que Joi valide

La validation vit dans un seul objet, `DemandeDeContactCEJValidator` (`envoyerDemandeDeContactCEJ.usecase.ts:28-36`) :

- **age** : entier entre 16 et 30 (bornes `ACCOMPAGNEMENT_MIN_AGE` et `ACCOMPAGNEMENT_MAX_AGE`, `demandeDeContact.ts:33-34`).
- **codePostal** : motif couvrant la France métropolitaine et l'outre-mer (`^((?:0[1-9]|[1-8]\d|9[0-5])\d{3}|(?:97[1-6]\d{2}))$`).
- **email** : motif partagé `emailRegex` (`~/shared/emailRegex`).
- **téléphone** : validé et normalisé par la bibliothèque `phone` en `country: 'FR'`, rejeté s'il n'est pas un numéro français valide.
- **nom, prénom, ville** : chaînes requises.

### Le retour : Either, aucune exception qui remonte à l'appelant

Chaque étape serveur renvoie un **Either** (soit un succès, soit une erreur métier de type `ErreurMetier`). Les deux erreurs possibles ici : `DEMANDE_INCORRECTE` (la validation a échoué) et une erreur de service quand Strapi refuse l'écriture. Le contrôleur convertit ce Either en réponse HTTP via `handleResponse` (`index.controller.ts:29`). Côté client, le formulaire teste `isSuccess(response)` pour afficher succès ou échec (`FormulaireContactCEJ.tsx:45-49`).

Cette organisation en couches (présentation React, application BFF, domaine avec usecase et validation, infrastructure avec repository, externe avec Strapi) est une **architecture hexagonale** : le cœur métier ignore qu'il parle à Strapi, il connaît seulement une interface `DemandeDeContactRepository`. Conséquence pratique : pour changer de destination de stockage, on remplace le repository sans toucher à l'usecase ni à la validation.

## 4. Limites et pièges

**Un seul type géré.** Le contrôleur ne connaît que `type: 'CEJ'` ; toute autre valeur tombe en `DEMANDE_INCORRECTE` (`index.controller.ts:18-27`). L'endpoint (le point d'entrée HTTP de l'API BFF) `demandes-de-contact` porte un nom générique, sa réalité est monovaleur.

**Mutation du corps de requête.** Le contrôleur fait `const command = req.body; delete command.type;` : `command` et `req.body` désignent le même objet, la suppression mute la requête entrante. Sans conséquence ici puisque rien ne relit `req.body.type` ensuite, à garder en tête si quelqu'un ajoute un middleware (un traitement intercalé sur la requête) en aval.

**Le renommage des clés est manuel.** Trois traductions de clés se succèdent sans typage qui les relie : champs HTML (`firstname`), clés métier (`prénom`), clés Strapi (`prenom`). Une faute de frappe à n'importe quel maillon passe la compilation et se voit seulement à l'exécution, voire seulement dans le CMS.

**Validation dédoublée client puis serveur.** Le formulaire porte déjà des `pattern` HTML (email, téléphone). La validation Joi serveur refait le travail. Les deux motifs doivent rester cohérents ; ils vivent dans des fichiers séparés (`~/shared/emailRegex`, `~/shared/telRegex` côté client, le validateur Joi côté serveur).

### Fragilité connue : la disparition de FilR

C'est le point d'attention majeur de ce document, et il concerne l'aval hors du dépôt front.

**FilR** est l'outil interne de partage de fichiers par lequel l'export hebdomadaire des demandes CEJ atteignait historiquement les équipes de rappel. La matière première annonce sa disparition à compter du **21 janvier 2025** (date issue du document source `Carto_CEJ.md`). Cette date est antérieure à la présente revue (31 juillet 2026), ce qui ouvre une question factuelle que le code du front ne peut pas trancher : **le canal de sortie fonctionne-t-il encore, et par quel moyen aujourd'hui ?** Le front écrit dans Strapi quoi qu'il arrive ; la boîte aux lettres se remplit. Ce qui reste incertain, c'est le facteur qui la relève.

Le document source liste cinq options de remplacement, sans que le choix soit acté :

| Option | Principe | Complexité (source) |
| --- | --- | --- |
| **Power Automate** | workflow Microsoft sans code, pertinent si licences M365 en place | Faible |
| **n8n / Zapier** | plateforme d'automatisation avec connecteurs Strapi et OneDrive | Moyenne |
| **Script CRON** | script planifié qui appelle l'API Strapi et dépose sur OneDrive | Moyenne |
| **Webhook Strapi** | envoi en temps réel vers une fonction Azure puis OneDrive | Élevée |
| **Export manuel** | plugin d'export CSV de Strapi et dépôt manuel | Aucune |

Adéquation au stack 1j1s (la colonne « complexité » ci-dessus reprend l'estimation du document source, à relire pour cette stack) : la plateforme tourne sur Scalingo, donc l'option « Webhook Strapi vers fonction Azure » sort de cet écosystème ; « Power Automate » suppose des licences Microsoft 365 dont la présence reste à confirmer. Le choix reste ouvert, à pondérer pour cette stack.

**Questions ouvertes pour la nouvelle équipe** (à trancher, aucune réponse à supposer) :

1. FilR a-t-il effectivement disparu, et depuis quand ? Un canal de remplacement est-il déjà en service ?
2. Si oui, lequel des cinq (ou un autre) ? Qui en est propriétaire et le surveille ?
3. L'API de lecture `GET /api/contact-cejs` et l'éventuel webhook `entry.create` (mentionnés dans la matière comme leviers d'export) sont-ils configurés côté CMS ? Leur existence n'est pas vérifiable depuis le dépôt front.

Ce document laisse le choix à l'équipe et se borne à poser la question et son enjeu : sans facteur, la boîte aux lettres se remplit et personne ne rappelle.

## 5. Certitude

**Confirmé dans le code du front** (dépôt `1j1s-front-fork`, revue du 31 juillet 2026) :

- La page existe et assemble les sections dans l'ordre décrit : `src/pages/contrat-engagement-jeune/index.page.tsx:27-36`.
- Les composants existent : `src/client/components/features/ContratEngagementJeune/` (dont `DemandeDeContactCEJ/` et `FormulaireContactCEJ/`).
- L'ajout de la discriminante `type: 'CEJ'` au POST : `bff.demandeDeContact.service.ts:21`, avec le type `DemandeDeContactType = 'CEJ'` (`demandeDeContact.ts:5`).
- L'endpoint BFF et son aiguillage : `src/pages/api/demandes-de-contact/index.controller.ts:12-32`.
- La validation Joi (bornes d'âge, motif code postal, normalisation téléphone) : `src/server/demande-de-contact/useCases/envoyerDemandeDeContactCEJ.usecase.ts:28-44`.
- Le renommage des champs et l'écriture dans la collection `contact-cejs` : `src/server/demande-de-contact/infra/repositories/cej/demandeDeContactCEJ.repository.ts:11-19`.
- L'écriture Strapi enveloppée dans `{ data: {...} }` par un client authentifié : `src/server/cms/infra/repositories/strapi.service.ts:106-111`.

**NON CONFIRMÉ** (hors dépôt front, ou non lu en détail) :

- **Volumétrie** (environ 270 par semaine, environ 13 800 en 2025, transmission chaque lundi) : matière première datée, aucune source dans le code. À confirmer côté exploitation.
- **FilR, sa disparition au 21 janvier 2025, les équipes de rappel** : processus aval hors dépôt. L'échéance étant passée au regard de la revue, l'état actuel du canal reste inconnu (voir section 4).
- **Les cinq options de remplacement** : matière première, aucune décision actée.
- **Données produit** (allocation 561,68 €, 15 à 20 h par semaine, jusqu'à 12 mois, cible 16 à 25 ans, 30 en situation de handicap) : matière datée, susceptible d'avoir changé.
- **API `GET /api/contact-cejs` et webhook `entry.create`** (leviers d'export mentionnés dans la matière) : côté CMS Strapi, non vérifiables dans ce dépôt.
- **Codes HTTP exacts de succès et d'échec** (la matière indique `200` corps vide et `400`) : le mapping vit dans `handleResponse` (`~/pages/api/utils/response/response.util`), non lu en détail pour cette revue. Le flux fonctionnel (succès vide, échec `DEMANDE_INCORRECTE`) est, lui, confirmé.

## 6. Ce que ça change

Reprendre ce parcours impose deux surveillances, l'une produit, l'autre technique.

**Surveiller la volumétrie hebdomadaire.** Le débit attendu tourne autour de quelques centaines de demandes par semaine (chiffre à recaler, voir section 5). Une chute brutale du nombre d'entrées dans la collection `contact-cejs` signale une panne silencieuse en amont (formulaire cassé, validation trop stricte, Strapi injoignable) bien avant qu'un utilisateur ne se plaigne. Poser un seuil d'alerte sur le compte hebdomadaire d'entrées donne un détecteur de panne bon marché.

**Surveiller la santé de l'export.** C'est le maillon le plus fragile et le moins visible depuis le front. Le front peut écrire parfaitement dans Strapi pendant que l'export vers les équipes de rappel est mort : la boîte aux lettres déborde, personne ne rappelle, et aucune erreur ne remonte côté front. Tant que la question du canal de remplacement de FilR (section 4) reste ouverte et non instrumentée, considérer l'export comme non surveillé. Première action concrète recommandée : établir qui possède l'export aujourd'hui et confirmer qu'il tourne, avant toute optimisation du formulaire.

**Toucher au renommage des clés est risqué.** Toute évolution du formulaire (nouveau champ, renommage) traverse trois maillons non typés entre eux (section 4). Couvrir ces maillons par les tests existants avant de modifier : `envoyerDemandeDeContactCEJ.usecase.test.ts`, `demandeDeContactCEJ.repository.test.ts`, `index.controller.test.ts`, et le test E2E (bout en bout, qui rejoue le parcours complet dans un navigateur) `cypress/e2e/formulaire_cej.cy.ts`.

## 7. Pour aller plus loin

Fichiers de code qui font foi (dépôt `1j1s-front-fork`) :

- **Page et sections** : `src/pages/contrat-engagement-jeune/index.page.tsx`, `src/client/components/features/ContratEngagementJeune/`.
- **Formulaire et section de contact** : `.../FormulaireContactCEJ/FormulaireContactCEJ.tsx`, `.../DemandeDeContactCEJ/DemandeContactCEJ.tsx`.
- **Service client BFF** : `src/client/services/demandeDeContact/bff.demandeDeContact.service.ts`.
- **Endpoint et aiguillage** : `src/pages/api/demandes-de-contact/index.controller.ts`.
- **Usecase et validation** : `src/server/demande-de-contact/useCases/envoyerDemandeDeContactCEJ.usecase.ts`.
- **Repository CEJ** : `src/server/demande-de-contact/infra/repositories/cej/demandeDeContactCEJ.repository.ts`.
- **Service CMS partagé** : `src/server/cms/infra/repositories/strapi.service.ts`.
- **Domaine** : `src/server/demande-de-contact/domain/demandeDeContact.ts`.

Documents et acteurs hors dépôt : le CMS Strapi (`1j1s-main-cms`), qui héberge la collection `contact-cejs` et porte la configuration d'export ; les équipes de rappel, destinataires finaux, dont la matière première (`docs/00_documentation_référence/matière_première/Carto_CEJ.md`) reste la seule trace écrite à ce jour, à considérer comme un brouillon daté.
