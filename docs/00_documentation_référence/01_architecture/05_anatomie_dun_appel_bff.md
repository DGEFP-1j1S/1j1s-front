# Anatomie d'un appel BFF, de la page au partenaire

_S'adresse a un dev qui doit ajouter ou modifier une route BFF, et un relecteur de PR qui verifie qu'elle respecte l'architecture. Derniere revue : 31 juillet 2026._

Apres lecture, le dev sait ou poser chaque fichier d'une nouvelle route (controller, useCase, repository, configuration) et comment les cabler ; le relecteur sait, sur une pull request (PR), quelles portes d'integration continue et quels points de la grille de relecture (section 5) tracent la frontiere entre une route conforme et une route qui court circuite l'architecture.

Le fil rouge est un exemple reel tracé de bout en bout : le formulaire de demande de contact du Contrat d'Engagement Jeune (CEJ), un dispositif public d'accompagnement vers l'emploi. L'internaute remplit ses coordonnees, le front les valide, les transmet au CMS Strapi (Content Management System), et un conseiller le rappelle. Contexte produit du CEJ dans `../matière_première/Carto_CEJ.md`.

---

## 1. Le modele mental avant la mecanique

### Ce qu'est le BFF, et pourquoi il existe

**BFF** signifie « back for front » : une couche serveur ecrite maison, propre a ce front, interposee entre le navigateur et les partenaires externes (France Travail, La Bonne Alternance, le CMS Strapi, etc.). Elle vit dans `src/pages/api/` (les routes exposees) et `src/server/` (la logique). Trois raisons la justifient :

- **Les secrets restent au serveur.** Le jeton d'authentification Strapi ne transite jamais par le navigateur. Le controller CEJ appelle le CMS avec un `Authorization: Bearer <jwt>` (jwt = JSON Web Token, jeton d'authentification) obtenu cote serveur (visible dans le test qui stub l'authentification puis l'appel, `src/pages/api/demandes-de-contact/index.controller.test.ts:17-27`).
- **Le format est unifie.** Le navigateur parle un seul dialecte (le contrat du BFF), quel que soit le partenaire derriere. Ici le front envoie `prénom`, `codePostal` ; le BFF traduit en `prenom`, `code_postal` avant Strapi (`src/server/demande-de-contact/infra/repositories/cej/demandeDeContactCEJ.repository.ts:11-19`).
- **La donnee est nettoyee et validee au serveur**, hors d'atteinte de l'utilisateur. Le telephone `0678954322` devient `+33678954322` (`src/server/demande-de-contact/useCases/envoyerDemandeDeContactCEJ.usecase.ts:38-44`).

### Pourquoi Either remplace les exceptions

Une erreur metier (saisie invalide, partenaire indisponible) est un resultat prevu du parcours, pas un accident. Le code la traite comme une valeur de retour ordinaire au moyen du type **Either**, defini en `src/server/errors/either.ts:3-13` :

```
type Either<T> = Success<T> | Failure
interface Success<T> { instance: 'success'; result: T }
interface Failure    { instance: 'failure'; errorType: Erreur }
```

`Erreur` est l'union `ErreurMetier | ErreurTechnique` (`src/server/errors/erreur.types.ts:4`). Un `Failure` porte donc un code metier stable (par exemple `DEMANDE_INCORRECTE`), et non une pile d'exécution opaque.

Consequence concrete : chaque maillon retourne `Promise<Either<T>>` et le maillon suivant lit `instance` pour brancher, sans `try/catch` en cascade. Les gardes `isSuccess` / `isFailure` (`either.ts:15-21`) affinent le type cote lecteur. La conversion en code HTTP se fait a un seul endroit, `handleResponse` (`src/pages/api/utils/response/response.util.ts:8-28`). Un `Success` rend 200 (contrat respecte) ; un `Failure` rend le code associe a son `errorType` :

| `errorType` du Failure | Code HTTP rendu | Sens pour l'appelant |
| --- | --- | --- |
| `DEMANDE_INCORRECTE` | 400 | l'entree ne passe pas la validation |
| `CONTENU_INDISPONIBLE` | 404 | ressource absente |
| `CONFLIT_D_IDENTIFIANT` | 409 | doublon |
| `SERVICE_INDISPONIBLE` | 503 | partenaire en panne |
| `TOO_MANY_REQUESTS` | 429 | quota partenaire depasse |
| tout autre | 500 | erreur non classee |

Le delta a retenir : ajouter une erreur metier suppose d'ajouter sa valeur dans l'enum `ErreurMetier` (`src/server/errors/erreurMetier.types.ts:1-6`) **et** son cas dans `handleResponse`. Un `errorType` sans cas tombe dans le `default` a 500.

### Pourquoi l'injection de dependances par fonctions

Aucun maillon ne construit lui meme ses collaborateurs. Le useCase recoit son repository par le constructeur (`envoyerDemandeDeContactCEJ.usecase.ts:14-16`) ; le repository recoit le service CMS (`demandeDeContactCEJ.repository.ts:6-8`). L'assemblage est centralise dans des fonctions `configuration/`, a deux niveaux :

```
server/configuration/dependencies.container.ts   ← racine : construit clients HTTP,
   dependenciesContainer()                          services partagés, puis appelle
        │                                            chaque container de module
        ├─ new DemandeDeContactCEJRepository(cmsService)          (ligne 353)
        └─ demandeDeContactDependenciesContainer(accompagnement, cej)  (ligne 355)
                              │
server/demande-de-contact/configuration/dependencies.container.ts  ← module :
   demandeDeContactDependenciesContainer(repoAccompagnement, repoCEJ)
        └─ new EnvoyerDemandeDeContactCEJUseCase(repoCEJ)          (ligne 25)
```

La racine (`server/configuration/dependencies.container.ts:253-446`) instancie une seule fois les briques couteuses (clients HTTP authentifies, cache Redis, logger) et les partage entre modules. Le container de module (`server/demande-de-contact/configuration/dependencies.container.ts:19-27`) ne connait que ses propres useCases. Le tout est memoise en singleton (`src/server/start.ts:10-21`), et le controller y puise via `dependencies.demandeDeContactDependencies.…` (`index.controller.ts:10,20`). Cote client, symetrie : `BffDemandeDeContactService` est cable dans `src/client/dependencies.container.ts:117` et expose sous la cle `demandeDeContactService` (ligne 176), que le composant reclame par `useDependency` (`FormulaireContactCEJ.tsx:28`).

Interet pour les tests : un useCase se teste en lui passant un faux repository (`vi.fn()` dans `envoyerDemandeDeContactCEJ.usecase.test.ts:22-24`), sans reseau ni container.

---

## 2. Quand appliquer cette procedure, quand ne pas

**Appliquer** des que le navigateur doit atteindre une donnee qui exige un secret serveur, une transformation de format, ou une validation qui ne peut vivre dans le navigateur : appel a un partenaire authentifie, ecriture dans le CMS, agregation de plusieurs sources.

**Ne pas appliquer** dans ces cas :

- **Donnee statique connue au build.** Une page SSG ou ISR lit son contenu dans `getStaticProps` cote serveur, sans route BFF ni appel client. Le formulaire CEJ, lui, est une ecriture a chaud declenchee par l'utilisateur : il passe par le BFF.
- **Logique purement presentationnelle** (affichage conditionnel, format d'une date) : elle reste dans le composant client.
- **Proxy sans valeur ajoutee.** Reexposer un partenaire tel quel, sans secret ni transformation ni validation, ajoute un maillon sans contrepartie. La regle de trois (voir CLAUDE.md racine) s'applique avant d'abstraire.

---

## 3. La traversee, sur l'exemple CEJ

Le schema suit une requete du clic « Envoyer la demande » jusqu'a l'ecriture dans Strapi, puis le chemin de retour. Chaque boite porte son fichier et la ligne qui la prouve.

```
NAVIGATEUR
  FormulaireDeContactCEJ (onSubmit)                 FormulaireContactCEJ.tsx:35
     appelle demandeDeContactService.envoyerPourLeCEJ({age, email, nom, prénom,
                                                        téléphone, ville, codePostal})
          │
          ▼
  BffDemandeDeContactService.envoyerPourLeCEJ       bff.demandeDeContact.service.ts:20-22
     httpClientService.post('demandes-de-contact', {...formulaire, type: 'CEJ'})
          │  POST /api/demandes-de-contact   body: {...champs, type:'CEJ'}
══════════╪══════════════════ frontiere reseau ══════════════════════════════
          ▼
SERVEUR (Next.js API, le BFF)
  default = withMonitoring(withMethods(['POST'], handler))   index.controller.ts:32
     withMethods rejette tout verbe != POST en 405           methods.middleware.ts:5-7
          ▼
  enregistrerDemandeDeContactHandler                index.controller.ts:12-30
     lit type, le retire de command, switch(type)
       'CEJ'  → useCase CEJ .handle(req.body)               (ligne 20)
       défaut → createFailure(DEMANDE_INCORRECTE)            (ligne 24)
          ▼
  EnvoyerDemandeDeContactCEJUseCase.handle          envoyerDemandeDeContactCEJ.usecase.ts:18-25
     Joi.attempt(command, DemandeDeContactCEJValidator)      (ligne 20)
        échoue → catch → createFailure(DEMANDE_INCORRECTE)   (lignes 22-24)
        passe  → repository.envoyer(demandeValidée)          (ligne 21)
          ▼
  DemandeDeContactRepository (interface)            domain/demandeDeContact.repository.ts:7-9
  DemandeDeContactCEJRepository.envoyer (impl)      infra/repositories/cej/…repository.ts:10-20
     mappe prénom→prenom, codePostal→code_postal, téléphone→telephone
     cmsService.save('contact-cejs', {…})
          ▼
  StrapiService.save                                cms/infra/repositories/strapi.service.ts:106-120
     authenticatedHttpClientService.post → createSuccess     (lignes 108-111)
     erreur                              → handleFailureError → Failure  (lignes 112-118)
          │  POST /api/contact-cejs   Authorization: Bearer <jwt>
          ▼
PARTENAIRE : CMS Strapi, collection contact-cejs
```

Retour : le `Either` remonte inchangé jusqu'au handler, qui le passe a `handleResponse` (`index.controller.ts:29`). Cote client, `httpClientService` renvoie lui aussi un `Either` (`src/client/services/httpClient.service.ts:5-8`), que le composant lit par `isSuccess` pour brancher `onSuccess` ou `onFailure` (`FormulaireContactCEJ.tsx:45-49`).

Le point de bascule metier est le `Joi.attempt` du useCase : c'est la, au serveur, que se decide 200 contre 400. La validation HTML du formulaire (`pattern`, `required` sur les champs, `FormulaireContactCEJ.tsx:80,89`) ameliore le confort de saisie et n'engage aucune garantie.

---

## 4. Les etapes pour ajouter ou modifier une route

Chaque etape porte son critere de sortie (le fait observable qui prouve qu'elle tient) et son piege.

### Etape 1 : definir le contrat et le type du domaine

Poser le type d'entree dans `src/server/<module>/domain/<module>.ts` (exemple : `DemandeDeContactCEJ`, `demandeDeContact.ts:13-18`) et, s'il y a lieu, le type du formulaire cote client dans le service BFF (`FormulaireDemandeDeContactCEJ`, `bff.demandeDeContact.service.ts:5-13`).

- **Critere de sortie** : `npm run check-types` passe, le type decrit exactement les champs que la route accepte.
- **Piege** : le type cote client et le type du domaine se ressemblent sans etre identiques (le client envoie `age: number`, le domaine attend un `Age` litteral 16..30). Les garder distincts est volontaire : la coercition se fait a la validation, pas au typage.

### Etape 2 : ecrire le useCase avec sa validation Joi

Creer `src/server/<module>/useCases/<verbe><Objet>.usecase.ts`. Le useCase recoit son repository par constructeur, valide l'entree par un `Joi` schema, retourne `Promise<Either<T>>`. Modele : `envoyerDemandeDeContactCEJ.usecase.ts:14-26`. Un `Joi.attempt` leve sur entree invalide ; il faut l'englober d'un `try/catch` qui retourne `createFailure(ErreurMetier.DEMANDE_INCORRECTE)`.

- **Critere de sortie** : le useCase rejette une entree invalide en `createFailure(DEMANDE_INCORRECTE)` et delegue au repository sur entree valide. Prouve par `envoyerDemandeDeContactCEJ.usecase.test.ts:26-90` (repository mocke, cas invalides parametres).
- **Piege** : croire que la validation client dispense de la validation serveur. Le navigateur peut etre contourne (requete forgee, script). La validation Joi du useCase est la seule qui engage une garantie ; elle est donc exhaustive sur chaque champ, y compris la normalisation du telephone (`validatePhone`, lignes 38-44).

### Etape 3 : declarer l'interface repository dans domain/, l'implementer dans infra/

L'interface vit dans `domain/<module>.repository.ts` et ne connait que le langage du domaine (`envoyer(demande): Promise<Either<void>>`, `demandeDeContact.repository.ts:7-9`). L'implementation vit dans `infra/repositories/…` et connait le partenaire : elle mappe les champs et appelle le service externe (`demandeDeContactCEJ.repository.ts:6-20`).

- **Critere de sortie** : l'implementation `implements` l'interface, mappe correctement chaque champ, retourne le `Either` du service externe.
- **Piege** : mettre de la regle metier dans le repository. Le repository traduit et transporte ; toute condition metier remonte au useCase. Le mapping `prénom → prenom` est de la traduction ; un rejet selon l'age serait de la regle, donc hors repository.

### Etape 4 : cabler les dependances (les deux niveaux configuration/)

Ajouter le useCase au container du module (`server/<module>/configuration/dependencies.container.ts`, modele lignes 19-27). Puis, a la racine (`server/configuration/dependencies.container.ts`), instancier le repository concret avec ses collaborateurs partages (client HTTP, service CMS) et le passer au container du module (modele lignes 352-358), enfin exposer le tout dans le type `Dependencies` (ligne 238) et l'objet retourne (ligne 424).

- **Critere de sortie** : `dependencies.<module>Dependencies.<useCase>` est accessible depuis le controller sans erreur de type ; le singleton se construit au demarrage (`start.ts:21`).
- **Piege** : instancier un client HTTP ou un service dans le useCase ou le controller. Ces objets se creent une seule fois a la racine et se partagent ; les recreer par requete casse le cache et la memoisation.

### Etape 5 : exposer le controller

Creer `src/pages/api/<resource>/index.controller.ts`. Point d'entree : lire `req.body`, appeler le useCase via `dependencies`, passer le resultat a `handleResponse`. Export par defaut enveloppe deux middlewares : `withMonitoring(withMethods([...], handler))` (`index.controller.ts:32`). `withMethods` filtre le verbe HTTP et rend 405 sinon (`methods.middleware.ts:3-11`). `withMonitoring` attache au scope Sentry les identifiants de transaction et de session lus dans les en-tetes de la requete, pour correler a la trace les erreurs remontees pendant l'execution du handler (`monitoring.middleware.ts:4-16`). C'est la convention sur toute route BFF metier (16 des 18 controllers l'appliquent ; `sitemap` et `robots` s'en passent). Une route qui l'omet s'execute quand meme ; ses erreurs Sentry perdent seulement ces tags de correlation.

- **Critere de sortie** : la route repond 200 avec le contrat attendu sur entree valide, et le code adequat sinon (400 pour `DEMANDE_INCORRECTE`, etc. selon `handleResponse`).
- **Piege** : le suffixe `.controller.ts` est obligatoire. Next ne route un fichier de `pages/api/` que si son extension figure dans `pageExtensions`, configure a `['page.tsx','controller.ts']` (`next.config.js:70`). Un fichier nomme `index.ts` sous `pages/api/…` n'est pas routé et la route repond 404, sans erreur explicite.

### Etape 6 : ecrire les tests aux deux niveaux

Deux tests distincts, deux perimetres :

- **useCase** (`<useCase>.usecase.test.ts`) : repository mocke par `vi.fn()`, on verifie la validation et le branchement. Aucun reseau. Modele `envoyerDemandeDeContactCEJ.usecase.test.ts`.
- **controller** (`index.controller.test.ts`) : integration de bout en bout du BFF, via `next-test-api-route-handler`, le partenaire etant stub par **nock** (bibliotheque d'interception HTTP). Le test CEJ stub l'authentification Strapi puis l'ecriture, et verifie le corps recu apres mapping (`index.controller.test.ts:15-65`). Entete `// @vitest-environment node` (ligne 1) obligatoire : ces tests s'executent en environnement Node, pas jsdom.

- **Critere de sortie** : les deux fichiers passent, le controller couvre au minimum un cas 200 et un cas d'erreur (le test CEJ couvre 200 et 400, lignes 15-92).
- **Piege** : oublier de stub la totalite des appels partenaires. Le CEJ fait deux appels Strapi (auth `/auth/local` puis `/contact-cejs`) ; ne stub qu'un seul et nock laisse fuir le second vers le reseau reel, le test devient instable.

---

## 5. Les portes : qui ratifie, sur quoi

La PR est ratifiee par l'integration continue (CI) et le relecteur, sur trois portes cumulatives, toutes issues des scripts du depot :

| Porte | Commande (`package.json`) | Critere de passage |
| --- | --- | --- |
| Types | `npm run check-types` (`tsc --noEmit`, ligne 17) | zero erreur de type |
| Lint | `npm run lint` (`eslint ./src --max-warnings=0`, ligne 15) | zero warning, le seuil est strict |
| Tests | `npm test` (`vitest run`, ligne 18) | useCase et controller verts |

Grille du relecteur, au dela des trois portes vertes :

- La validation metier vit **au useCase** en Joi (etape 2). Le client et le repository en portent zero.
- Le controller ne contient que : lecture de `req.body`, aiguillage vers le useCase, `handleResponse` (etape 5). Aucune regle metier, aucun appel partenaire direct.
- Le repository traduit et transporte ; toute condition metier remonte au useCase (etape 3).
- Les clients HTTP et services sont injectes depuis `configuration/` (etape 4), instancies une seule fois a la racine et partages.
- Tout nouvel `errorType` a son cas dans `handleResponse` (section 1), sinon 500 silencieux.
- Le controller porte le suffixe `.controller.ts` et enveloppe `withMethods` avec les verbes autorises (etape 5).

---

## Glossaire

- **BFF** (« back for front ») : couche serveur maison entre navigateur et partenaires, dans `src/pages/api/` et `src/server/`.
- **controller** : fichier de route sous `src/pages/api/`, suffixe `.controller.ts`, point d'entree HTTP ; il lit `req.body`, aiguille vers le useCase et rend la reponse via `handleResponse`.
- **Either** : type de retour `Success<T> | Failure`, ou `Failure` porte un code d'erreur metier au lieu de lever une exception (`src/server/errors/either.ts`).
- **useCase** : classe portant une regle metier et la validation d'entree, dans `src/server/<module>/useCases/`.
- **Repository** : abstraction d'acces a une source externe ; interface dans `domain/`, implementation dans `infra/repositories/`.
- **middleware** : fonction enveloppante `withX(handler)` ajoutant un comportement transverse autour du handler de route. Deux en usage ici : `withMethods` (filtre le verbe HTTP, rend 405) et `withMonitoring` (attache les identifiants de transaction et de session au scope Sentry).
- **container** : fonction sous `configuration/` qui assemble les dependances (racine ou module) et les expose, pour qu'aucun maillon ne construise ses propres collaborateurs.
- **Injection de dependances** : les collaborateurs sont passes par constructeur et assembles dans les fonctions `configuration/`, construits une seule fois a la racine.
- **Joi** : bibliotheque de validation de schema, executee au serveur ; `Joi.attempt` leve sur entree invalide.
- **nock** : bibliotheque d'interception HTTP, utilisee pour stub un partenaire dans les tests de controller.
- **ISR / SSG** : strategies de generation de page Next.js pour donnee froide, hors du chemin BFF (voir `01_architecture_du_front.md` dans ce dossier et la doc d'architecture racine `docs/docs/architecture/architecture.md`).
- **CMS Strapi** : le CMS (Content Management System) partenaire (depot frere `1j1s-main-cms`), destination de la demande CEJ (collection `contact-cejs`).

---

## Questions ouvertes pour la nouvelle equipe

- **Validation cote client et cote serveur, source unique ?** Le regex email est duplique entre le formulaire (`FormulaireContactCEJ.tsx:16`, `~/shared/emailRegex`) et le validateur Joi (`envoyerDemandeDeContactCEJ.usecase.ts:12,31`). Ils partagent le meme module `emailRegex`, mais la coherence des deux validations (age, telephone) repose sur une discipline manuelle. Faut il un contrat de validation partage plus explicite ? NON CONFIRME que ce soit un objectif.
- **`DemandeDeContactType` a une seule valeur.** Le type n'accepte que `'CEJ'` (`demandeDeContact.ts:5`) alors que le `switch` du controller a un `default`. L'extension a d'autres types de demande (l'accompagnement existe deja en repository et useCase, mais n'est pas aiguille par ce controller) reste a clarifier avec le produit.
