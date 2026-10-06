# Feature flags et configuration

_S'adresse à un PO qui veut savoir ce qui est réellement actif en prod, et à un dev qui ajoute ou bascule un flag. Dernière revue : 31 juillet 2026._

Après lecture, le PO sait où lire l'état réel d'un parcours en production (les variables de l'app Scalingo `1j1s-front-prod`) et pourquoi le code du dépôt seul ne suffit pas à le savoir. Le dev sait ajouter un flag, le brancher aux bons endroits, et pourquoi un flag préfixé `NEXT_PUBLIC_` impose une recompilation pour changer d'état.

## Glossaire (termes de ce document)

| Terme | Sens |
| --- | --- |
| **Feature flag** (interrupteur de fonctionnalité) | Variable qui active ou éteint un morceau de site, lue à l'exécution ou à la compilation, en dehors du code métier. |
| **Feature flipping** | La pratique de piloter les fonctionnalités par ces interrupteurs plutôt que par le mode d'exécution. |
| **Variable d'environnement** | Valeur fournie à l'application par son hébergeur, en dehors des fichiers versionnés du dépôt. |
| **`NEXT_PUBLIC_`** | Préfixe Next.js : toute variable ainsi nommée est figée dans le JavaScript envoyé au navigateur au moment de la compilation. |
| **`NODE_ENV`** | Variable standard indiquant l'environnement d'exécution (`development`, `test` ou `production`). Le projet a choisi de piloter ses fonctionnalités indépendamment d'elle (voir section 2). |
| **Build** (compilation) | L'étape `npm run build` qui produit l'application de production servie ensuite aux visiteurs. |
| **Meilisearch** | Le moteur de recherche du projet, qui propulse les pages de recherche interactives. Détaillé dans `04_recherche_meilisearch.md` du même dossier. |
| **Scalingo** | La plateforme d'hébergement (PaaS) où tournent les apps. C'est là que vivent les variables d'environnement de production. |
| **`1j1s-front-prod`** | Le nom de l'app Scalingo qui sert le site de production. |
| **ADR** | Fiche de décision d'architecture archivée dans `docs/docs/adr/`, datée et signée. |

## 1. Le problème : le site du code n'est pas le site affiché

Ouvrir `src/pages/` donne la liste des pages écrites, à ce jour 68 pages métier. Cette liste répond à la question « qu'est-ce que le code sait faire ». Elle laisse ouverte la question qui compte pour un PO : « qu'est-ce qu'un visiteur voit réellement aujourd'hui en production ».

L'écart vient des feature flags. Une bonne partie des entrées de menu et des parcours reste conditionnée par un interrupteur porté par une variable d'environnement. Ces variables vivent dans l'environnement Scalingo de l'app `1j1s-front-prod`, en dehors du code versionné. Conséquence directe : lire le dépôt renseigne sur les parcours *possibles*, l'app Scalingo renseigne sur les parcours *actifs*. Les deux lectures sont nécessaires, et elles peuvent diverger.

Exemple concret tiré du code. La page des évènements existe et compile toujours, mais elle affiche deux choses opposées selon un seul flag (`src/pages/evenements/index.page.tsx:18`) : un moteur de recherche Meilisearch quand le flag vaut `1`, une simple page d'atterrissage avec des liens sortants quand il vaut autre chose. Le fichier source ne dit pas laquelle des deux tourne en prod. Seule la variable Scalingo le dit.

## 2. Le concept : un interrupteur hors du code, décidé par l'hébergeur

Le modèle mental tient en trois idées enchaînées.

**Le flag est une condition, pas une donnée métier.** Le code contient les deux branches (fonctionnalité montrée, fonctionnalité cachée). L'interrupteur choisit la branche empruntée. Le choix se lit `process.env.NEXT_PUBLIC_XXX_FEATURE === '1'` : la fonctionnalité s'affiche quand la variable vaut exactement la chaîne `'1'`, elle reste cachée pour toute autre valeur (`'0'`, vide, absente).

**La valeur vit dans l'environnement de déploiement, hors du dépôt versionné.** Le dépôt fournit seulement des valeurs de test (`.env.test`) et un gabarit de déploiement (`.env.scalingo`). La valeur de production est posée à la main sur l'app Scalingo `1j1s-front-prod`. Un développeur qui lit le code voit donc la mécanique du flag ; sa valeur de production reste dans l'environnement Scalingo.

**Ce choix est une décision d'architecture assumée.** Le projet a tranché en faveur du feature flipping plutôt que d'un pilotage par la variable d'environnement d'exécution `NODE_ENV` (voir glossaire), dans l'ADR `docs/docs/adr/2023-10-25.utiliser-feature-flipping-plutot-que-node-env.md`. Motif retenu (fiche ADR, sections « Décision » et « Conséquences ») : garder la capacité d'allumer ou d'éteindre une fonctionnalité indépendamment de l'environnement, y compris pendant les tests automatisés. C'est pourquoi le code teste des variables dédiées `*_FEATURE` et non la valeur de `NODE_ENV`.

Le mécanisme du préfixe `NEXT_PUBLIC_` ajoute une contrainte propre à Next.js, développée en section 4 : sa valeur est gelée au moment de la compilation. Retenir dès maintenant que ces flags se comportent comme une photo prise au build, pas comme un réglage lisible en direct.

## 3. Les mécanismes : quel flag conditionne quel parcours

Les flags qui affectent la navigation et les parcours sont recensés ci-dessous. Chaque ligne cite le code qui fait foi. La colonne « Ce que le flag cache ou montre » donne la différence concrète vue par un visiteur quand la variable vaut `'1'`. La valeur en production reste NON CONFIRME depuis le dépôt (voir section 5).

Convention de lecture : sauf mention contraire, l'affichage se produit quand la variable vaut `'1'`.

| Flag `NEXT_PUBLIC_*` | Parcours conditionné | Ce que le flag cache ou montre | Source (chemin:ligne) |
| --- | --- | --- | --- |
| `JOB_ETE_FEATURE` | Jobs d'été | Entrée de menu « Jobs d'été », carte sur l'accueil, accès à la page `/jobs-ete` (sinon la page renvoie une 404) | `NavigationStructure.tsx:34`, `index.page.tsx:37`, `jobs-ete/index.page.tsx:64` |
| `EMPLOIS_EUROPE_FEATURE` | Emplois en Europe | Entrée de menu « Emplois en Europe » et accès aux pages `/emplois-europe` (liste et détail) | `NavigationStructure.tsx:36`, `emplois-europe/index.page.tsx:14`, `emplois-europe/[id].page.tsx:22` |
| `STAGES_3EME_FEATURE` | Stages de 3e et 2de | Entrée de menu « Stages de 3e et 2de », carte accueil, pages `/stages-3e-et-2de` et sa page de candidature | `NavigationStructure.tsx:29`, `index.page.tsx:39`, `stages-3e-et-2de/index.page.tsx:16`, `stages-3e-et-2de/candidater/index.page.tsx:49` |
| `FORMATIONS_INITIALES_FEATURE` | Formations initiales (source Onisep) | Entrée de menu « Formations initiales », carte accueil, pages `/formations-initiales` (liste et détail) | `NavigationStructure.tsx:50`, `index.page.tsx:38`, `formations-initiales/index.page.tsx:19`, `formations-initiales/[id].page.tsx:33` |
| `FORMATION_LBA_FEATURE` | Formations en apprentissage (source La Bonne Alternance) | Entrée de menu « Formations en apprentissage » et pages `/formations/apprentissage` (liste et détail) | `NavigationStructure.tsx:54`, `formations/apprentissage/index.page.tsx:68`, `formations/apprentissage/[id].page.tsx:38` |
| `LOGEMENT_FEATURE` | Annonces de logement | Bascule la page `/logements/annonces` entre le moteur Meilisearch (flag à `'1'`) et une page d'indisponibilité de service | `logements/annonces/index.page.tsx:23`, `logements/annonces/[id].page.tsx:52` |
| `RECHERCHE_EVENEMENT_FEATURE` | Évènements de recrutement | Bascule `/evenements` entre moteur de recherche Meilisearch (flag à `'1'`) et page d'atterrissage à liens sortants (France Travail, Union nationale des missions locales) | `evenements/index.page.tsx:18` |
| `MY_JOB_GLASSES_FEATURE` | MyJobGlasses (échange avec des professionnels) | Entrée de menu « Échanger avec des professionnels », carte accueil, accès à `/myjobglasses` (sinon la page redirige) | `NavigationStructure.tsx:80`, `index.page.tsx:41`, `myjobglasses/index.page.tsx:49` |
| `1JEUNE1PERMIS_FEATURE` | 1jeune1permis (aide au permis, iframe France Travail) | Entrée de menu « Aides au permis de conduire », carte accueil, accès à `/1jeune1permis` | `NavigationStructure.tsx:133`, `index.page.tsx:40`, `1jeune1permis/index.page.tsx:15` |
| `OLD_ESPACE_JEUNE_FEATURE` | Ancien hub « espace jeune » contre nouveau « services jeunes ». Sémantique inversée, voir section 4 | À `'1'` : l'ancien `/espace-jeune` est actif. À `'0'` : les entrées « services jeunes » de la nav, les actualités sur l'accueil et la section services du plan du site s'activent | `index.page.tsx:43` (`==='1'`), `index.page.tsx:382` (`==='0'`), `plan-du-site/index.page.tsx:18` (`==='0'`), `services-jeunes/index.page.tsx:97` (`==='0'`) |
| `ENQUETE_SATISFACTION_FEATURE` | Bandeau enquête satisfaction | Affiche la bannière « Je donne mon avis » (sortie vers `jedonnemonavis.numerique.gouv.fr`) en tête de site | `Header.tsx:13` |
| `ALTERNANCE_LBA_FEATURE` | Détail d'une offre d'alternance | Conditionne la page `/apprentissage/[id]`. Lu aussi côté serveur avec valeur par défaut `'0'` | `apprentissage/[id].page.tsx:21`, `serverConfiguration.service.ts:42` |
| `ANALYTICS_EULERIAN_FEATURE` | Mesure d'audience Eulerian | Injecte le script Eulerian dans le document et active le service d'analytics correspondant | `_document.page.tsx:43`, `eulerian.analytics.service.ts:99` |
| `ANALYTICS_MATOMO_FEATURE` | Mesure d'audience Matomo | Enregistre le service Matomo dans le conteneur d'injection côté client | `dependencies.container.ts:129` |
| `ANALYTICS_MATOMO_TAG_MANAGER_FEATURE` | Gestionnaire de tags Matomo | Enregistre le service Matomo Tag Manager côté client | `dependencies.container.ts:133` |
| `CAMPAGNE_ADFORM_FEATURE` | Marketing Adform et LinkedIn | Un seul flag active à la fois le service Adform et le pixel LinkedIn ; sinon les deux tombent sur un service neutre (Null Object) | `dependencies.container.ts:122`, `dependencies.container.ts:125` |
| `CAMPAGNE_COM_EN_COURS_FEATURE` | Bandeau campagne de communication | Affiche la bannière de campagne en cours | `CampagneBanner.tsx:15` |
| `CAMPAGNE_APPRENTISSAGE_FEATURE` | Bandeau campagne apprentissage | Affiche la bannière de campagne apprentissage | `BannieresCampagnes/index.tsx:15` |

Chemins abrégés pour la lisibilité. Racines : les composants sous `src/client/components/layouts/Header/` (`NavigationStructure.tsx`, `Header.tsx`, `Banner/Campagne/CampagneBanner.tsx`), les pages sous `src/pages/`, les services sous `src/client/services/` et `src/client/dependencies.container.ts`, la configuration serveur sous `src/server/services/serverConfiguration.service.ts`.

**Flags présents dans le code, hors périmètre navigation.** Le dépôt porte d'autres flags non détaillés ici car ils ne touchent pas la navigation grand public : les parcours « stages de seconde » (`STAGES_SECONDE_FEATURE`, `STAGES_SECONDE_RECHERCHE_FEATURE`, `STAGES_SECONDE_RECHERCHE_JEUNE_FEATURE`), `WORLD_SKILLS_FEATURE`, et les bannières de campagne `MY_JOB_GLASSES_CAMPAGNE_FEATURE` et `FETE_DE_METIERS_CAMPAGNE`. La liste de référence des flags attendus par l'app vit dans le gabarit `.env.scalingo`, une entrée par flag ; la commande de la section 6 lit, elle, leur état posé en production.

## 4. Limites et pièges

**Piège 1 : un flag `NEXT_PUBLIC_` exige une recompilation, pas seulement un redéploiement de la variable.** C'est le piège central. Le préfixe `NEXT_PUBLIC_` a une conséquence documentée par Next.js : la valeur est remplacée en dur dans le JavaScript envoyé au navigateur au moment du `npm run build` ([Next.js, Environment Variables, « Bundling for the Browser »](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)). Le code du dépôt confirme cet usage côté navigateur : `NavigationStructure.tsx` lit `process.env.NEXT_PUBLIC_*_FEATURE` dans un composant rendu chez le client. Conséquence opérationnelle : un paquet JavaScript déjà compilé porte l'ancienne valeur tant qu'un build ne l'a pas régénéré. Si l'action Scalingo appelée « redémarrage » ne rejoue pas `npm run build`, la valeur reste figée ; savoir si un changement de variable déclenche un simple redémarrage ou une recompilation complète est NON CONFIRME depuis ce dépôt (voir `../02_exploitation/03_infrastructure_scalingo_et_observabilite.md`). Règle sûre : après avoir modifié un `NEXT_PUBLIC_*_FEATURE`, déclencher un redéploiement qui rejoue l'étape de build.

Les variables **sans** le préfixe `NEXT_PUBLIC_` échappent à ce piège. Elles restent lisibles uniquement côté serveur, ne partent jamais dans le navigateur, et une valeur de secret partenaire (clés d'API, mots de passe) doit donc rester sans ce préfixe. Elles se relisent à l'exécution serveur, un redémarrage suffit à les prendre en compte.

**Piège 2 : la sémantique inversée de `OLD_ESPACE_JEUNE_FEATURE`.** Ce flag ne suit pas la convention « `'1'` montre la fonctionnalité ». À `'1'`, il garde vivant l'ancien hub `/espace-jeune`. À `'0'`, il fait apparaître le nouveau dispositif : entrées « services jeunes » dans le menu, actualités sur l'accueil, section dédiée du plan du site. Un même interrupteur pilote donc une bascule entre deux systèmes, dans des sens opposés selon les fichiers (`index.page.tsx:43` teste `'1'`, `index.page.tsx:382`, `plan-du-site/index.page.tsx:18` et `services-jeunes/index.page.tsx:97` testent `'0'`). Toute manipulation de ce flag demande de vérifier les deux valeurs.

**Piège 3 : `.env.test` ne dit pas la prod.** Le fichier `.env.test` fixe des valeurs pour l'exécution des tests automatisés. Y lire `NEXT_PUBLIC_JOB_ETE_FEATURE=1` prouve que le parcours jobs d'été est allumé *pour les tests*, sans rien prouver sur la production. À l'inverse, certains flags actifs dans le code (par exemple `CAMPAGNE_ADFORM_FEATURE`, `MY_JOB_GLASSES_FEATURE`) ne figurent même pas dans `.env.test` : leur absence de ce fichier ne signifie aucun état particulier en prod.

**Piège 4 : un flag se branche à plusieurs endroits.** Un parcours entièrement caché demande souvent de couper trois surfaces : l'entrée de menu (`NavigationStructure.tsx`), la carte de l'accueil (`index.page.tsx`), et la page elle-même (garde en tête de `*.page.tsx`). Oublier la garde de page laisse une URL accessible en direct alors que le menu la masque. Le tableau de la section 3 liste, par flag, les surfaces réellement branchées.

## 5. Certitude

**Confirmé, sourcé sur le code.**
- La liste des flags et leur point de consommation : chaque ligne du tableau de la section 3 cite `chemin:ligne` vérifié par recherche dans `src/`.
- La convention de test `=== '1'` : lisible dans chaque fichier cité.
- La sémantique inversée de `OLD_ESPACE_JEUNE_FEATURE` : `src/pages/index.page.tsx:43` et `:382` testent des valeurs opposées.
- Le flag unique `CAMPAGNE_ADFORM_FEATURE` gouverne Adform et LinkedIn ensemble : `src/client/dependencies.container.ts:122` et `:125`.
- L'existence et l'objet de l'ADR feature flipping : `docs/docs/adr/2023-10-25.utiliser-feature-flipping-plutot-que-node-env.md`.

**Confirmé, fait Next.js documenté.**
- Le gel des variables `NEXT_PUBLIC_*` au moment du build ([documentation Next.js, Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)).

**NON CONFIRME depuis le dépôt.**
- L'état allumé ou éteint de chaque flag en production : il vit dans les variables de l'app Scalingo `1j1s-front-prod`, pas dans le code. La commande pour le lire est en section 6.
- Le comportement de Scalingo lors d'un changement de variable `NEXT_PUBLIC_*` (simple redémarrage ou recompilation) : à documenter dans `../02_exploitation/03_infrastructure_scalingo_et_observabilite.md`.

## 6. Ce que ça change

**Pour le PO qui veut l'état réel d'un parcours en prod.** Ne pas déduire l'état depuis le code ni depuis `.env.test`. Lire les variables de l'app de production, avec l'outil en ligne de commande Scalingo :

```bash
scalingo --app 1j1s-front-prod env | grep NEXT_PUBLIC_ | grep FEATURE
```

La valeur `1` face à un flag signifie parcours actif, toute autre valeur signifie parcours coupé. Le second `grep FEATURE` écarte un flag nommé autrement : pour l'état des bannières de campagne, relire aussi `scalingo --app 1j1s-front-prod env | grep NEXT_PUBLIC_FETE`. Pour la correspondance flag vers parcours affiché, se reporter au tableau de la section 3, ou à la cartographie des parcours `../00_produit/02_cartographie_des_parcours.md` qui décrit chaque parcours par son entrée utilisateur.

**Pour le dev qui bascule un flag existant.** Modifier la variable sur Scalingo ne suffit pas pour un `NEXT_PUBLIC_*`. Séquence sûre :

```
1. scalingo --app 1j1s-front-prod env-set NEXT_PUBLIC_X_FEATURE=1
2. déclencher un redéploiement qui rejoue `npm run build`   (procédure : ../02_exploitation/03_infrastructure_scalingo_et_observabilite.md)
3. vérifier sur le site que la surface attendue apparaît (menu, carte accueil, page)
```

L'étape 2 est le maillon que le piège 1 rend obligatoire.

**Pour le dev qui ajoute un flag.** Reproduire le patron existant :

```
1. lire la valeur par `process.env.NEXT_PUBLIC_MON_FEATURE === '1'`
2. brancher les surfaces concernées : entrée menu (NavigationStructure.tsx),
   carte accueil (index.page.tsx), garde en tête de la page (*.page.tsx)
3. déclarer une valeur de test dans .env.test et une entrée dans le gabarit .env.scalingo
4. poser la variable sur Scalingo 1j1s-front-prod, puis build (piège 1)
```

Respecter la convention `=== '1'` pour rester homogène avec le reste du code. Choisir un préfixe `NEXT_PUBLIC_` uniquement si le flag doit être lu côté navigateur ; garder la variable sans ce préfixe si elle porte un secret ou n'est lue que côté serveur.

## 7. Pour aller plus loin (fichiers qui font foi)

- **Source de vérité de la navigation** : `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx` (arborescence du menu et flags qui la conditionnent).
- **Conteneur d'injection côté client** : `src/client/dependencies.container.ts` (branchement des services analytics et marketing sous flag).
- **Lecture serveur des flags** : `src/server/services/serverConfiguration.service.ts` (flags lus côté serveur, avec valeurs par défaut).
- **Valeurs de test** : `.env.test` à la racine (état des flags pour les tests, non représentatif de la prod).
- **Décision d'architecture** : `docs/docs/adr/2023-10-25.utiliser-feature-flipping-plutot-que-node-env.md`.
- **Parcours affectés par les flags** : `../00_produit/02_cartographie_des_parcours.md`.
- **Procédure Scalingo (variables, redéploiement)** : `../02_exploitation/03_infrastructure_scalingo_et_observabilite.md`.
