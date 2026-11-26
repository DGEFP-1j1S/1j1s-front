# Dette technique et feuille de route

_S'adresse à un tech lead qui doit prioriser la modernisation, et à un PO qui arbitre le temps alloué à la dette. Dernière revue : 31 juillet 2026._

Après lecture, le tech lead saura dans quel ordre engager les migrations et sur quelle preuve ; le PO saura quel volume de dette chaque report laisse grossir et à quelle échéance il devient coûteux d'attendre.

---

## 1. Le modèle mental avant les chantiers

Une décision de dette technique arbitre entre deux coûts qui évoluent en sens inverse.

- **Le coût de faire maintenant.** Temps d'ingénieur immobilisé, risque de régression, fenêtre de recette. Il est visible, il fait mal tout de suite, il concurrence la livraison de fonctionnalités.
- **Le coût de reporter.** Il est invisible au jour le jour et grossit tout seul. Chaque version de framework sautée ajoute des changements cassants à rattraper ; chaque dépendance en fin de support cesse de recevoir des correctifs de sécurité ; chaque image de conteneur non figée peut se reconstruire différemment un matin sans qu'on ait rien touché.

Arbitrer, c'est décider quel coût invisible on accepte de laisser grossir, et pour combien de temps. Deux outils rendent cette décision honnête plutôt qu'intuitive :

- **Le déclencheur** : la condition datée ou chiffrée qui fait passer un report de « raisonnable » à « urgent ». Exemple : « quand Next 14 cesse de recevoir des correctifs de sécurité ». Tant que le déclencheur n'est pas atteint, reporter est défendable ; une fois atteint, le report devient une prise de risque active.
- **Le critère d'abandon** : le seuil au delà duquel un chantier de migration coûte plus cher que la dette qu'il résorbe. Certaines dettes se gardent volontairement. La discipline consiste à le décider explicitement, avec un chiffre, plutôt que par lassitude.

Ce document applique à chaque grand chantier le même gabarit : les options réelles, le verdict et sa raison en une phrase, ce que le report concède, le déclencheur nommé à l'avance.

### Glossaire minimal

- **Dette technique** : écart entre l'état courant du code ou de l'infrastructure et un état sain, qui se paie en effort de maintenance tant qu'il n'est pas résorbé.
- **Fin de vie (EOL, _end of life_)** : date après laquelle l'éditeur d'un logiciel cesse de publier des correctifs, y compris de sécurité. Rester sur une version en fin de vie transforme chaque faille découverte en risque non corrigeable sans migrer d'abord.
- **Tag flottant** (Docker) : référence d'image qui pointe vers « la dernière en date » d'une famille (`redis:alpine`) plutôt que vers une version figée (`redis:7.2.5`). Deux reconstructions à des dates différentes peuvent alors récupérer deux images distinctes.
- **IaC** (_infrastructure as code_) : l'infrastructure décrite dans des fichiers versionnés (ici Terraform/OpenTofu) plutôt que cliquée à la main dans une console.
- **État Terraform** : le fichier où l'IaC mémorise l'infrastructure déjà provisionnée. Le perdre ou le corrompre fait diverger l'infrastructure réelle du code qui la décrit, d'où la criticité du _backend_ qui l'héberge (§5.2).
- **StrictMode** : mode de développement de React qui exécute deux fois certaines fonctions (rendu, effets) pour faire remonter les effets de bord mal isolés. Actif en développement uniquement, sans effet en production.

---

## 2. La question, et pourquoi elle se pose maintenant

**Question.** Où investir l'effort de modernisation en premier, et quels dépôts morts peut on décommissionner ?

**Deux sources alimentent ce document et se citent tout du long.** La *note de recommandations* (`recomandations_2027.md`, non datée) fixe les priorités techno : versions cibles, licence, mauvaises pratiques. Le *bilan d'infrastructure* (`bilan_infra.md`, daté du 26 juin 2026) inventorie les dépôts et les déploiements. Un seul nom par source dans tout ce qui suit.

**Pourquoi maintenant.** Trois horloges tournent en parallèle et aucune ne s'arrête si on l'ignore :

1. **Des majeures de framework s'accumulent.** Le front tourne sur Next 14 (`package.json:41`, `"next": "^14.2.35"`) et React 18 (`package.json:46`, `"react": "^18.3.1"`). Au moment où la note de recommandations a été prise, Next 16 et React 19.2.3 étaient disponibles. Chaque majeure sautée épaissit le mur de changements cassants à franchir plus tard.
2. **Une licence a changé.** La note de recommandations signale que MinIO (le stockage objet compatible S3 utilisé par l'écosystème) a durci sa licence. Une licence plus restrictive contraint les usages futurs et peut forcer une migration dans l'urgence si elle bloque une montée de version.
3. **Des dépendances d'infrastructure dérivent en silence.** Le dépôt embarque au moins une image de conteneur en tag flottant (`docker-compose.yml:5`, `image: "redis:alpine"`), reconstructible différemment sans préavis.

Un exemple montre que ces horloges se gèrent : ESLint 8 est en fin de vie depuis octobre 2024 (selon la note de recommandations). Le fork a déjà migré vers ESLint 9 (`package.json:79`, `"eslint": "^9.39.2"`). Cette horloge là est traitée. Les autres attendent la même discipline.

---

## 3. État des lieux vérifié : ce que le fork a déjà absorbé

Point important pour la priorisation : la note de recommandations n'est pas datée, et le fork a avancé depuis sa rédaction. Trois de ses recommandations sont déjà appliquées dans ce dépôt. Les prioriser à nouveau ferait perdre du temps. Le tableau ci après ancre le « depuis quelle version on migre » sur le code réel de ce dépôt (`1j1s-front` v3.361.0, `package.json:7`).

| Techno | Version dans ce dépôt (source code) | Cible de la note (non datée) | État réel et conséquence |
|---|---|---|---|
| **Next.js** | `^14.2.35` (`package.json:41`) | migrer vers 16 | **À faire.** Deux majeures de retard, mur de migration qui s'épaissit. |
| **React** | `^18.3.1` (`package.json:46`, `:48`) | migrer vers 19.2.3 | **À faire.** À coupler avec Next. |
| **Storybook** | `^10.2.10` (`package.json:93`, `:60` à `:63`) | migrer 8 vers 10 | **Déjà fait.** La note est périmée sur ce point ; rien à replanifier. |
| **ESLint** | `^9.39.2` (`package.json:79`) | migrer 8 vers 9 | **Déjà fait.** Fin de vie de la v8 déjà purgée. |
| **StrictMode** | `reactStrictMode: true` (`next.config.js:72`) | « utiliser StrictMode » | **Déjà activé.** Voir §5.6 : le travail restant est de corriger ce que StrictMode fait remonter, l'activation étant acquise. |
| `eslint-config-next` | `^16.1.6` (`package.json:80`) | (non mentionné) | **Incohérence à surveiller.** La config de lint suit Next 16 alors que Next reste en 14. Voir §8. |

Lecture pour le PO : sur les items « priorité moyenne » de la note (Storybook, ESLint), le budget est déjà dépensé. Le budget de modernisation restant se concentre sur deux fronts, le framework applicatif (Next et React) et l'infrastructure partagée (Docker, MinIO, CI), traités ci après par ordre de risque.

---

## 4. La stratégie d'ensemble : par où commencer

Avant le détail chantier par chantier, une décision de méthode conditionne tout le reste.

**Options.**

- **A. Refonte groupée (_big bang_).** Geler les fonctionnalités, mener Next, React et l'infrastructure dans un même sprint de modernisation. Sous son meilleur jour : une seule fenêtre de régression, une seule campagne de recette, une équipe qui apprend la nouvelle pile d'un bloc, une dette soldée d'un coup.
- **B. Résorption continue par ordre de risque.** Traiter les chantiers un par un, chacun livrable indépendamment, intercalés avec la livraison de fonctionnalités, en commençant par ce qui porte une horloge externe (fin de vie, licence, sécurité) puis les majeures de framework, puis le confort de développement.
- **C. Statu quo.** Rester sur les versions actuelles, garder tout le budget pour les fonctionnalités. Sous son meilleur jour : zéro coût court terme, aucune régression introduite, l'équipe reste concentrée sur la valeur produit.

**Verdict : option B**, parce qu'elle solde d'abord les dettes qui grossissent toutes seules (horloges externes) tout en gardant la production livrable à chaque étape.

**Ce que ça concède.** Une résorption continue étale l'effort et coûte, cumulé, un peu plus qu'un _big bang_ parfaitement exécuté, car on repaie plusieurs fois le coût d'entrée d'une campagne de recette. On accepte ce surcoût contre la garantie de ne jamais bloquer la prod plusieurs semaines.

**Pourquoi écarter A et C.** L'option A parie sur un gel de fonctionnalités de plusieurs semaines qu'un service public en production tient rarement, et concentre tout le risque de régression dans une seule fenêtre. L'option C laisse les trois horloges du §2 grossir jusqu'à ce qu'une faille de sécurité non corrigeable ou une licence bloquante force la migration dans l'urgence, au pire moment et au pire coût.

Les trois priorités qui suivent sont l'ordre d'exécution de l'option B.

---

## 5. Les chantiers, par arbitrage

### Priorité très haute : les horloges externes

Ces trois chantiers portent un déclencheur qui échappe à l'équipe (comportement d'un registre d'images, licence d'un tiers, dépréciation d'un runner CI, la machine qui exécute les workflows). Les traiter en premier retire le risque le moins contrôlable.

#### 5.1 Verrouiller les versions des images Docker

**Options.**

- Figer chaque image sur une version précise, voire sur son empreinte (_digest_).
- Garder les tags flottants et se fier au hasard des reconstructions.

**Verdict : figer**, parce qu'un tag flottant rend une reconstruction non reproductible et peut casser sans qu'aucun commit ne l'explique.

**Preuve dans ce dépôt.** `docker-compose.yml:5` référence `image: "redis:alpine"`. Le tag `alpine` suit la dernière image de la famille : deux reconstructions à quelques mois d'écart peuvent récupérer deux Redis différents. La note de recommandations ajoute que les commandes d'une image évoluent d'une version à l'autre et que certaines disparaissent, si bien qu'une image plus récente peut ne plus accepter l'invocation attendue.

**Ce que le report concède.** On laisse une bombe à retardement silencieuse : l'environnement de développement (et tout autre service décrit en tags flottants) peut casser un matin, et le diagnostic partira sur une fausse piste puisque aucun changement de code ne l'expliquera. Le coût de correction se paie alors en interruption, au pire moment.

**Déclencheur (déjà atteint).** La condition est présente dès qu'un `image:` sans version figée existe, ce qui est le cas aujourd'hui avec `redis:alpine` (`docker-compose.yml:5`). À traiter avant la prochaine reconstruction critique de l'environnement.

#### 5.2 Remplacer MinIO par Garage ou Rustfs

**Contexte.** MinIO est un stockage objet compatible avec le protocole S3 d'Amazon. Dans cet écosystème il sert à deux endroits distincts : le stockage de fichiers de l'ETL (la chaîne qui ingère les flux partenaires) et le _backend_ d'état de Terraform pour ce front. Ce dernier point est visible ici : `terraform/versions.tf:5` déclare un `backend "s3"` dont les commentaires (`terraform/versions.tf:6`, `:21`) précisent explicitement « pour la connexion au backend S3 Minio ». L'état de l'infrastructure du front vit donc sur MinIO.

**Options.**

- **Migrer** vers Garage ou Rustfs, deux stockages objets compatibles S3 sous licence plus permissive.
- **Rester** sur MinIO et accepter la licence durcie.

**Verdict : migrer**, parce que la licence plus restrictive signalée par la note de recommandations contraint les usages futurs et risque de bloquer une montée de version au moment où on en aura besoin.

**Ce que le report concède.** Rester sur MinIO fige le composant à sa version actuelle : toute mise à jour future imposera d'accepter la nouvelle licence, dont la note dit qu'elle « peut poser problème pour le futur ». On concède aussi de laisser le _backend_ d'état Terraform, pièce critique s'il en est, sur une brique dont le cadre juridique s'est refermé.

**Déclencheur.** La prochaine montée de version de MinIO qui force l'acceptation de la nouvelle licence, ou tout nouveau besoin de stockage objet dans l'écosystème. À ce moment, migrer devient moins cher que contourner.

**Réserve de portée.** Ce chantier dépasse le seul front : l'usage principal de MinIO est côté ETL. La migration se coordonne à l'échelle de l'écosystème, avec le dépôt `1j1s-etl` en premier concerné. Le remplacement du seul _backend_ Terraform du front est le sous chantier livrable ici.

#### 5.3 Mettre à jour les dépendances GitHub Actions

**Contexte.** Les workflows d'intégration continue épinglent chacun une version des actions réutilisées (`actions/checkout`, `actions/setup-node`, etc.). GitHub déprécie régulièrement les majeures anciennes, souvent parce que le runner sous jacent (la machine virtuelle d'exécution) change de version de Node.

**État dans ce dépôt.** Les actions cœur de la CI sont à jour : `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `actions/download-artifact@v4`, `actions/github-script@v7`, `hashicorp/setup-terraform@v3` (relevé dans `.github/workflows/`). Le front est ici en bonne posture.

**Verdict pour le front : surveiller, pas migrer en urgence.** La dette réelle décrite par la note vise l'écosystème entier ; sur ce dépôt les majeures sont récentes.

**Ce que le report concède.** Laisser dériver des actions tierces épinglées finement (par exemple `Firenza/secrets-to-env@v1.3.0`, `nathanvaughn/actions-cloudflare-purge@v3.1.0`, `scalingo-community/setup-scalingo@v0.1.1`) : si l'une est archivée par son auteur, un workflow casse sans correctif amont disponible.

**Déclencheur.** Le premier avertissement de dépréciation émis par GitHub (typiquement une image de runner en fin de vie), ou l'archivage d'une action tierce utilisée. La priorité « très haute » de la note vaut surtout pour les dépôts frères moins entretenus, à vérifier séparément.

---

### Priorité haute : les majeures de framework

Ces chantiers n'ont pas d'horloge externe imposée par un tiers, mais un coût qui croît de façon non linéaire avec le report : plus le retard de majeures s'accumule, plus le saut est risqué.

#### 5.4 Migrer Next 14 vers 16

**Point d'attention structurel.** Ce front utilise le **Pages Router**, l'ancien système de routage de Next fondé sur `src/pages/`, et non l'App Router introduit récemment. Une migration de majeure doit préserver cette architecture ou budgéter séparément un éventuel passage à l'App Router, qui est un chantier distinct et bien plus lourd. Ce document ne recommande pas ce dernier ; il porte sur la seule montée de version.

**Options.**

- **Migrer par paliers** : 14 vers 15, puis 15 vers 16, en s'appuyant sur les guides de migration officiels et les codemods de chaque palier (des scripts de réécriture automatique du code fournis par l'éditeur).
- **Sauter directement** de 14 à 16.
- **Attendre.**

**Verdict : migrer par paliers**, parce que chaque palier a son guide et ses correctifs automatiques, et parce que franchir une majeure à la fois isole les régressions au lieu de les empiler.

**Ce que le report concède.** Chaque mois de retard épaissit le mur décrit au §2, et allonge d'autant la fenêtre de recette du saut final. La note le formule directement : « plus le temps passe et plus il sera difficile de migrer pour être à jour ». On concède aussi de rester en dehors de la fenêtre de support sécurité au fur et à mesure que Next 14 vieillit.

**Déclencheur.** La sortie du support de sécurité de Next 14 (quand l'éditeur cesse de rétroporter les correctifs sur cette ligne). **NON CONFIRMÉ** : la date exacte de fin de support de Next 14 n'est pas établie dans les sources lues ; à vérifier sur la politique de support de Next avant de planifier. Déclencheur secondaire : le couplage avec React 19 (ci après), Next 16 exigeant une version de React donnée.

#### 5.5 Migrer React 18 vers 19

**Verdict, en une phrase : à mener avec la migration de Next**, parce que les deux versions sont couplées (la majeure de Next fixe la fourchette de React attendue) et qu'une seule campagne de recette couvre les deux.

**Options.** Les deux seules options réelles sont « en même temps que Next » ou « en deux temps ». Le second multiplie les fenêtres de régression sans bénéfice.

**Ce que le report concède.** La note signale que des API de React ont été simplifiées en 19 et « ne seront plus disponibles dans la v20 ». **NON CONFIRMÉ** : quelles API précises, et leur présence dans `src/`, ne sont pas établies ici ; à relever avant de chiffrer l'impact. Rester en 18 laisse s'installer un futur double saut (18 vers 19 puis les corrections d'API supprimées en 20) au lieu d'un seul. Le retard se paie en intérêts composés.

**Déclencheur.** L'annonce de React 20 (qui matérialise la suppression des API déjà dépréciées en 19), ou l'exigence de Next 16 sur la version de React. Le premier des deux atteint enclenche le chantier.

#### 5.6 Résorber les mauvaises pratiques React, sous StrictMode déjà actif

**Reformulation par rapport à la note.** La note demandait « d'utiliser StrictMode » (cf. glossaire §1). Ce dépôt l'a déjà activé (`next.config.js:72`, `reactStrictMode: true`). Le travail restant est donc de **corriger ce que StrictMode révèle**, l'activation étant acquise.

**Les trois anti patterns visés par la note :**

- **`setState` appelé dans un `useEffect`** : reprogramme un rendu juste après le rendu, source de rendus en cascade et de scintillements. La note le qualifie de « gros travail ».
- **Appel de fonctions non déterministes pendant le rendu** (par exemple `Date.now()`, `Math.random()`) : casse la reproductibilité du rendu, que StrictMode expose en double invocation.
- **Lecture de `ref` à des endroits non sûrs** (pendant le rendu plutôt que dans un effet ou un gestionnaire d'événement).

**Portée observée, sans audit exhaustif.** 39 fichiers de `src/` utilisent `useEffect` (relevé par `grep -rl useEffect src`). **NON CONFIRMÉ** : combien parmi eux contiennent réellement l'un des trois anti patterns. Un comptage approximatif n'a pas suffi à trancher, et un audit dédié reste à mener (voir la piste outillée ci après). Ne pas chiffrer ce lot avant cet audit.

**Verdict : outiller la détection avant de corriger à la main.** À la main, l'audit déborderait les 39 fichiers portant un `useEffect` : deux des trois anti patterns (appel non déterministe au rendu, lecture de `ref`) concernent tout composant qui fait un rendu, soit les 687 fichiers `.tsx` de `src/` (relevé par `find src -name '*.tsx'`). Activer les règles de lint dédiées (`eslint-plugin-react-hooks`, et la famille de règles issue de « You Might Not Need an Effect », soit « vous n'avez peut-être pas besoin d'un effet ») transforme ce balayage en une liste finie et priorisable. Corriger ensuite par ordre de gravité (composants les plus rendus d'abord).

**Ce que le report concède.** StrictMode étant déjà actif, ces défauts se manifestent déjà en développement (doubles effets, avertissements console) et fragilisent les migrations de framework : une base qui suppose un seul rendu par cycle réagit mal à une majeure de React qui resserre les règles. Reporter, c'est migrer Next et React sur un socle non assaini, ce qui gonfle le risque de régression des chantiers 5.4 et 5.5.

**Déclencheur.** À traiter avant ou pendant la migration React 18 vers 19, dont ces corrections réduisent le risque. Autrement dit, ce lot est un prérequis de confort du chantier 5.5.

---

### Priorité moyenne : confort de développement et reste des dépendances

#### 5.7 Storybook et ESLint

**Déjà faits dans ce fork** (voir §3) : Storybook est en `^10.2.10` et ESLint en `^9.39.2`. Aucun budget à replanifier. Vérifier seulement au prochain `npm audit` que les plugins associés (`eslint-plugin-*`, `@storybook/*`) restent alignés sur ces majeures.

#### 5.8 Reste des dépendances

**Verdict : entretien continu, par lots thématiques**, plutôt qu'une grande passe annuelle.

**Ce que le report concède.** Laisser dériver les dépendances secondaires les fait vieillir ensemble jusqu'à former un second mur de migration, moins visible que celui de Next mais de même nature. Une mise à jour régulière garde chaque saut petit.

**Déclencheur.** Une alerte de vulnérabilité (`npm audit`, Dependabot) sur une dépendance, ou un blocage de compatibilité rencontré pendant la migration Next/React.

---

## 6. Décommissionnement des dépôts morts

**Source.** L'inventaire vient de l'audit d'écosystème (`../matière_première/bilan_infra.md`, §6.1), établi sur le code et la CI clonés (fiabilité 🟢 dans son barème). Réserve importante portée par l'audit lui même : le statut _live_ réel de ces dépôts (une application Scalingo tourne-t-elle encore ?) demande un accès Scalingo étendu que l'audit n'avait pas (fiabilité 🔴). L'inventaire du code est fiable ; la certitude qu'aucune application fantôme ne tourne encore ne l'est pas.

**Principe : archiver d'abord, supprimer ensuite.** Archiver un dépôt GitHub le passe en lecture seule sans le détruire. C'est la manœuvre qui révèle les usages cachés (un script, une CI d'un autre dépôt, une procédure de prod qui le référence) sans rien casser d'irréversible : si quelque chose dépendait du dépôt, l'archivage le fait apparaître, et l'archive se rouvre en un clic. La suppression, elle, est définitive. On supprime seulement après une période d'archivage sans incident.

Les ~11 dépôts morts se répartissent en deux familles selon le geste sûr.

| Dépôt | Pourquoi mort | Geste sûr | Piège si on supprime trop vite |
|---|---|---|---|
| `1j1s-orchestrateur-stages` | pipeline stages legacy (2022) | suppression directe (déjà archivé) | faible : archivé, remplacé par `1j1s-etl/apps/stages` |
| `1j1s-stage-orchestrateur-extract` | extraction stages legacy | suppression directe (déjà archivé) | faible |
| `1j1s-stage-indexeur` | jamais implémenté (README seul) | suppression directe (déjà archivé) | faible |
| `1j1s-logement-ETL` | dépôt vide (0 commit) | suppression directe (déjà archivé) | nul |
| `1j1s-api` | PoC (preuve de concept) en mémoire « finalement inutile » | suppression directe (déjà archivé) | faible |
| `scalingo-nginx-poc` | PoC reverse proxy abandonné | suppression directe (déjà archivé) | faible |
| `1j1s-cms` | ancien Strapi 4.5 sur Node 16 (2022) | **archiver d'abord** | des données encore utiles pourraient y résider ; une application Scalingo `1j1s-cms` pourrait tourner et être facturée (🔴). Migrer/archiver les données avant. |
| `1j1s-infrastructure` | socle bash pré Terraform (2024) | **archiver d'abord** | une procédure de prod pourrait encore l'appeler. L'archivage révèle la référence sans la casser. |
| `1j1s-stage-content-manager` | CMS stages legacy (2023) | **archiver d'abord** | vérifier qu'aucune application Scalingo de type `…stages-cms` ne tourne encore (🔴). |
| `1j1s-test-charge` | tests de charge k6, dernier run octobre 2022 | **archiver d'abord** | récupérer les scénarios k6 réutilisables avant de perdre l'accès. |
| `1j1s-datasource-request-collection` | collection Postman (2022) | **archiver d'abord** | faible ; remplacé par les tests d'intégration de `1j1s-etl`. |

Cas à part : `1J1S`, un méta dépôt de sous modules au README quasi vide. Le garder comme index de l'écosystème ou le supprimer relève d'une préférence d'équipe, sans enjeu technique.

**Prérequis transverse avant toute suppression.** Étendre d'abord l'accès Scalingo puis rejouer l'introspection décrite par l'audit, pour confirmer qu'aucune application _live_ ni fantôme facturée ne s'appuie sur ces dépôts. Tant que ce contrôle 🔴 n'est pas levé, s'en tenir à l'archivage pour les cinq dépôts marqués « archiver d'abord ».

---

## 7. Critère d'abandon transverse

Certaines dettes se gardent volontairement. La règle : **on abandonne un chantier de migration quand son coût dépasse la dette qu'il résorbe.** Concrètement, un chantier bascule côté « à ne pas faire » quand toutes ces conditions se réunissent :

- la version en place reçoit encore des correctifs de sécurité (aucune horloge de fin de vie active) ;
- aucune dépendance dont on a besoin par ailleurs n'exige la nouvelle version ;
- l'effort estimé de migration dépasse durablement le temps de maintenance annuel qu'elle ferait économiser.

Application concrète : un passage du Pages Router à l'App Router de Next échoue à ce test aujourd'hui. Le Pages Router reste supporté, aucune fonctionnalité produit ne l'exige, et l'effort de réécriture des routes dépasse de loin la dette qu'il solderait. Ce chantier se garde en réserve, réévalué au déclencheur « le Pages Router entre en fin de support ». À l'inverse, figer les images Docker (§5.1) passe le test dans l'autre sens : coût faible, dette qui grossit seule, à faire.

---

## 8. Questions ouvertes pour la nouvelle équipe

- **Incohérence `eslint-config-next@16` avec `next@14`.** Le dépôt tire la configuration de lint de Next 16 (`package.json:80`, `"eslint-config-next": "^16.1.6"`) alors que Next reste en 14 (`package.json:41`). Est ce un artefact de migration partielle, un choix délibéré, ou une source de règles de lint référençant des API absentes ? À trancher avant la migration 5.4, dont ce décalage est peut être un premier pas déjà engagé.
- **Ampleur réelle des anti patterns React.** Marqué NON CONFIRMÉ au §5.6 : le nombre de fichiers contenant `setState` dans `useEffect`, un appel non déterministe dans le rendu ou une lecture de `ref` non sûre. À établir par une passe de lint dédiée avant de chiffrer le lot.
- **Date de fin de support de Next 14.** Marquée NON CONFIRMÉ au §5.4 : le déclencheur du chantier le plus lourd repose sur une date non établie dans les sources lues. À confirmer sur la politique de support officielle de Next.
- **Statut _live_ des dépôts morts.** Réserve 🔴 de l'audit (§6) : la certitude qu'aucune application Scalingo fantôme ne tourne (et n'est facturée) sur ces dépôts demande un accès Scalingo étendu, en cours d'ouverture selon l'audit. Contrôle à mener avant toute suppression.
- **Hébergement de MinIO et Meilisearch hors IaC.** L'audit signale que ces deux briques critiques n'apparaissent pas dans le Terraform cloné (🔴). Ce point conditionne le chantier 5.2 : on ne peut migrer proprement un stockage dont l'hébergement n'est pas décrit en code.

---

_Origine des recommandations brutes reprises et recadrées ici : `../matière_première/recomandations_2027.md` (priorités) et `../matière_première/bilan_infra.md` (inventaire des dépôts, daté du 26 juin 2026). Ces deux fichiers sont des brouillons d'audit ; les faits techniques de ce document sont réancrés sur le code du dépôt (`package.json`, `next.config.js`, `docker-compose.yml`, `terraform/`, `.github/workflows/`) et les versions cibles présentées comme l'instantané de la note, à revérifier avant exécution._
