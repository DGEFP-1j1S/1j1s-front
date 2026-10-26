# Contexte et archives

> **Mise à jour UTM (21 avril 2026)** : suite retour de LBA sur la recette, les UTM injectés côté destination sont désormais `utm_source=1j1s&utm_medium=website&utm_campaign=landinglba1j1s` (candidats) et `utm_source=1j1s&utm_medium=website&utm_campaign=recruteurs_landinglba1j1s` (recruteurs). Les mentions `utm_source=1jeune1solution` ci-dessous correspondent à la spec initiale (échange email et analyse technique du 13 au 14 avril). Source de vérité actuelle : `src/shared/lbaLandingUrls.ts` et `config/redirects.js`.

## Archives : emails et analyse technique initiale

De : GARTOUM, Houssine (DGEFP/SDFIMOD/MISI) \<houssine.gartoum@emploi.gouv.fr\>
Envoyé : jeudi 9 avril 2026 15:29
À : ADEBLE MENARD, Daisy (DNUM/SCN-SIM-ARS) \<daisy.adeble-menard@sg.social.gouv.fr\>
Cc : GARNIER, Gilles (DNUM/DO) \<gilles.garnier@sg.social.gouv.fr\>; DIBOA, Nicolas (DGEFP/CS1/MCOM) \<nicolas.diboa@emploi.gouv.fr\>; VASSORD, Sebastien (DGEFP/SDFIMOD/MISI) \<sebastien.vassord@emploi.gouv.fr\>; CHASSEIGNE, Nadine (DGEFP/SDFIMOD/MISI) \<nadine.chasseigne@emploi.gouv.fr\>; BOUDEAU, Marine (DNUM/SDPSN) \<marine.boudeau@sg.social.gouv.fr\>
Objet : Redirections alternance sur 1J1S – besoin d'action côté Scalingo (urgent)

Bonjour @ADEBLE MENARD, Daisy (DNUM/SCN-SIM-ARS),

J'espère que tu vas bien.

Je me permets de te solliciter directement car Gilles nous a orienté vers toi sur ce sujet. Nous cherchons à améliorer le parcours alternance sur 1jeune1solution en supprimant les ruptures de navigation qui freinent aujourd'hui la conversion des visiteurs, que ce soit côté candidats ou côté recruteurs. Pour cela, nous avons développé côté La bonne alternance deux landing pages dédiées, aux couleurs de 1J1S, qui permettent d'atterrir directement sur la bonne action (candidater ou déposer une offre) sans étape intermédiaire.

Concrètement, nous aurions besoin de deux choses :

1.  La mise en place de redirections sur les URL suivantes du portail 1J1S :

Côté recruteurs :

-   Les pages sources : /apprentissage-entreprises et /apprentissage/époser-offre
-   Vers : labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs

Côté candidats :

-   Les pages sources :  « /choisir-apprentissage » et « /apprentissage  »
-   Vers : labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution

Et (2 ) également la mise à jour des liens dans le menu de navigation en haut du portail 1J1S, pour que les entrées correspondantes pointent directement vers ces nouvelles pages, sur le même principe que ce qui est déjà fait pour « Offres > Stages d'observation » qui renvoie vers un lien externe.

Je sais que le portail 1J1S est hébergé chez Scalingo, donc la mise en place des redirections nécessitera probablement une action de leur côté. N'hésite pas à me dire comment on peut avancer ensemble sur ce point.

Le sujet est assez urgent : la campagne grand public à destination des jeunes pour l'apprentissage est prévue en mai, et nous avons besoin que ces pages soient exposées d'ici là. L'idéal serait une mise en place pour la fin de semaine prochaine, ou au plus tard la semaine du 20 avril.

Je suis disponible pour en discuter de vive voix si c'est plus simple.

Merci beaucoup pour ton aide,

Houssine Gartoum
Intrapreneur

Mission ingénierie et systèmes d’Information

Tél : 06 07 44 84 22


Adresse : Ministère du Travail | DGEFP – 14, avenue Duquesne 75350 Paris 07 SP

travail-emploi.gouv.fr

Bonjour @thibaut.poullain,

Voici les réponses en bleu

1. La page source côté recruteurs est elle bien `/apprentissage/deposer-offre` ? La

   demande écrite mentionnait « /apprentissage/époser-offre » je veux juste être sur de la typo, de l'accent.

Il s'agit bien de /apprentissage/deposer-offre, sans accent. C'était une coquille dans la demande initiale.

2. Les deux URLs cibles ci dessous sont elles stables dans le temps (on va poser des

   redirections permanentes 308 qui seront indexées par les moteurs et difficiles à

   changer ensuite) ?

      candidats   https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution

      recruteurs  https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs

Oui, les deux URLs cibles sont stables dans le temps. Vous pouvez poser des redirections permanentes (308)

3. Que faut il faire des sous routes `/apprentissage/{id}` (détail d'une offre) et

   `/apprentissage/entreprise/{id}` (candidature spontanée vers une entreprise) qui

   existent aujourd'hui sur 1J1S, sont indexées Google et reçoivent du trafic via

   deep links externes : les laisser en place, les rediriger en bloc vers la landing

   candidats, ou les supprimer (404) ?

Nous souhaitons rediriger ces sous-routes vers la landing page candidats. Le parcours cible est que l'utilisateur parte de cette landing pour lancer sa recherche, qu'il s'agisse d'une offre ou d'une candidature spontanée auprès d'une entreprise.

4. La page `/formations/apprentissage` (recherche de FORMATIONS en apprentissage,

   type CFA) entre t elle dans le périmètre, ou la laisse t on hébergée sur 1J1S ?

Cette page est hors périmètre, elle reste hébergée sur 1J1S sans modification.

5. La nouvelle landing recruteurs remplace t elle entièrement le widget iframe LBA

   actuellement embarqué dans `/apprentissage/deposer-offre`, ou ce widget vit il

   encore ailleurs et reste à conserver ?

La nouvelle landing recruteurs remplace intégralement ce widget. Il n'y a pas d'autre instance à conserver.

6. Et pour l'iframe LBA de candidature spontanée actuellement embarquée dans

   `/apprentissage/entreprise/{id}` : la landing candidats la remplace, ou il existe

   un autre flux côté LBA pour ce cas d'usage ?

Même logique : redirection vers la landing candidats. Le parcours cible est que le candidat passe par cette landing pour initier sa recherche d'offre ou d'entreprise, puis poursuive sa navigation depuis LBA.

7. Faut il transmettre les query params reçus sur les anciennes URLs (utm_source,

   utm_campaign, etc.) vers les landing LBA, ou on les drop à la redirection ?

Oui, il faut transmettre l'ensemble des paramètres. Deux options sont envisageables : les lister explicitement et les passer s'ils sont présents, ou opter pour un wildcard qui transmettrait tout à LBA. Je vous laisse nous recommander l'approche la plus propre techniquement.

8. Souhaitez vous qu'on ajoute un identifiant de provenance fixe sur les redirections

   (par exemple `?utm_source=1jeune1solution`) pour vous permettre de mesurer le

   volume basculé depuis 1J1S ?

C'est effectivement souhaitable. Ajouter utm_source=1jeune1solution sur les redirections nous permettra de mesurer précisément le volume basculé depuis 1J1S, indépendamment du referrer, ces UTM remontent dans nos outils de mesure (Plausible et Matomo).

Houssine

Bonjour,

@GARTOUM, Houssine (DGEFP/SDFIMOD/MISI) vous répond dès que possible.

Merci beaucoup.

Cordialement,

Nadine Chasseigne
Adjointe au Chef de mission, Correspondante RGPD

Mission Ingénierie et Systèmes d’Information - MISI

Sous-Direction Financement et Modernisation – FIMOD

Tél : 07 64 47 22 69

Adresse postale : 14, avenue Duquesne 75350 Paris 07 SP

travail-emploi.gouv.fr

De : Thibaut Poullain \<thibaut.poullain@ydrazil.fr\>
Envoyé : vendredi 10 avril 2026 19:07
À : ADEBLE MENARD, Daisy (DNUM/SCN-SIM-ARS) \<daisy.adeble-menard@sg.social.gouv.fr\>; GARNIER, Gilles (DNUM/DO) \<gilles.garnier@sg.social.gouv.fr\>; DIBOA, Nicolas (DGEFP/CS1/MCOM) \<nicolas.diboa@emploi.gouv.fr\>; VASSORD, Sebastien (DGEFP/SDFIMOD/MISI) \<sebastien.vassord@emploi.gouv.fr\>; CHASSEIGNE, Nadine (DGEFP/SDFIMOD/MISI) \<nadine.chasseigne@emploi.gouv.fr\>; BOUDEAU, Marine (DNUM/SDPSN) \<marine.boudeau@sg.social.gouv.fr\>; GARTOUM, Houssine (DGEFP/SDFIMOD/MISI) \<houssine.gartoum@emploi.gouv.fr\>
Objet : Re: TR: Redirections alternance sur 1J1S – besoin d'action côté Scalingo (urgent)

Bonjour, 

En préalable à nos échanges, j'aurais quelques questions : 

1. La page source côté recruteurs est elle bien `/apprentissage/deposer-offre` ? La

   demande écrite mentionnait « /apprentissage/époser-offre » je veux juste être sur de la typo, de l'accent.

2. Les deux URLs cibles ci dessous sont elles stables dans le temps (on va poser des

   redirections permanentes 308 qui seront indexées par les moteurs et difficiles à

   changer ensuite) ?

      candidats   https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution

      recruteurs  https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs

3. Que faut il faire des sous routes `/apprentissage/{id}` (détail d'une offre) et

   `/apprentissage/entreprise/{id}` (candidature spontanée vers une entreprise) qui

   existent aujourd'hui sur 1J1S, sont indexées Google et reçoivent du trafic via

   deep links externes : les laisser en place, les rediriger en bloc vers la landing

   candidats, ou les supprimer (404) ?

4. La page `/formations/apprentissage` (recherche de FORMATIONS en apprentissage,

   type CFA) entre t elle dans le périmètre, ou la laisse t on hébergée sur 1J1S ?

5. La nouvelle landing recruteurs remplace t elle entièrement le widget iframe LBA

   actuellement embarqué dans `/apprentissage/deposer-offre`, ou ce widget vit il

   encore ailleurs et reste à conserver ?

6. Et pour l'iframe LBA de candidature spontanée actuellement embarquée dans

   `/apprentissage/entreprise/{id}` : la landing candidats la remplace, ou il existe

   un autre flux côté LBA pour ce cas d'usage ?

7. Faut il transmettre les query params reçus sur les anciennes URLs (utm_source,

   utm_campaign, etc.) vers les landing LBA, ou on les drop à la redirection ?

8. Souhaitez vous qu'on ajoute un identifiant de provenance fixe sur les redirections

   (par exemple `?utm_source=1jeune1solution`) pour vous permettre de mesurer le

   volume basculé depuis 1J1S ?


Merci à vous !

Le vendredi 10 avril 2026 à 14:46, ADEBLE MENARD, Daisy (DNUM/SCN-SIM-ARS) \<daisy.adeble-menard@sg.social.gouv.fr\> a écrit :

> Bonjour @ADEBLE MENARD, Daisy (DNUM/SCN-SIM-ARS),
>
> J'espère que tu vas bien.
>
> Je me permets de te solliciter directement car Gilles nous a orienté vers toi sur ce sujet. Nous cherchons à améliorer le parcours alternance sur 1jeune1solution en supprimant les ruptures de navigation qui freinent aujourd'hui la conversion des visiteurs, que ce soit côté candidats ou côté recruteurs. Pour cela, nous avons développé côté La bonne alternance deux landing pages dédiées, aux couleurs de 1J1S, qui permettent d'atterrir directement sur la bonne action (candidater ou déposer une offre) sans étape intermédiaire.
>
> Concrètement, nous aurions besoin de deux choses :
>
> 1.  La mise en place de redirections sur les URL suivantes du portail 1J1S :
>
> Côté recruteurs :
>
> -   Les pages sources : /apprentissage-entreprises et /apprentissage/époser-offre
> -   Vers : labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs
>
> Côté candidats :
>
> -   Les pages sources :  « /choisir-apprentissage » et « /apprentissage  »
> -   Vers : labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution
>
> Et (2 ) également la mise à jour des liens dans le menu de navigation en haut du portail 1J1S, pour que les entrées correspondantes pointent directement vers ces nouvelles pages, sur le même principe que ce qui est déjà fait pour « Offres > Stages d'observation » qui renvoie vers un lien externe.
>
> Je sais que le portail 1J1S est hébergé chez Scalingo, donc la mise en place des redirections nécessitera probablement une action de leur côté. N'hésite pas à me dire comment on peut avancer ensemble sur ce point.
>
> Le sujet est assez urgent : la campagne grand public à destination des jeunes pour l'apprentissage est prévue en mai, et nous avons besoin que ces pages soient exposées d'ici là. L'idéal serait une mise en place pour la fin de semaine prochaine, ou au plus tard la semaine du 20 avril.
>
> Je suis disponible pour en discuter de vive voix si c'est plus simple.
>
> Merci beaucoup pour ton aide,
>
> Houssine Gartoum
> Intrapreneur
>
> Mission ingénierie et systèmes d’Information
>
> Tél : 06 07 44 84 22
>
>
> Adresse : Ministère du Travail | DGEFP – 14, avenue Duquesne 75350 Paris 07 SP
>
> travail-emploi.gouv.fr
>
> > De : GARTOUM, Houssine (DGEFP/SDFIMOD/MISI) \<houssine.gartoum@emploi.gouv.fr\>
> > Envoyé : jeudi 9 avril 2026 15:29
> > À : ADEBLE MENARD, Daisy (DNUM/SCN-SIM-ARS) \<daisy.adeble-menard@sg.social.gouv.fr\>
> > Cc : GARNIER, Gilles (DNUM/DO) \<gilles.garnier@sg.social.gouv.fr\>; DIBOA, Nicolas (DGEFP/CS1/MCOM) \<nicolas.diboa@emploi.gouv.fr\>; VASSORD, Sebastien (DGEFP/SDFIMOD/MISI) \<sebastien.vassord@emploi.gouv.fr\>; CHASSEIGNE, Nadine (DGEFP/SDFIMOD/MISI) \<nadine.chasseigne@emploi.gouv.fr\>; BOUDEAU, Marine (DNUM/SDPSN) \<marine.boudeau@sg.social.gouv.fr\>
> > Objet : Redirections alternance sur 1J1S – besoin d'action côté Scalingo (urgent)

Afficher le message d'origine

---

# Analyse technique et plan de mise en œuvre

## Calendrier

Mise en production souhaitée : semaine du 20 avril 2026 au plus tard, pour exposer les landings avant la campagne grand public alternance prévue en mai (cf. mail Houssine Gartoum du 9 avril 2026). Date du jour : 13 avril 2026, soit une semaine de marge. Le sujet est urgent.

## Synthèse des réponses LBA

| # | Question | Réponse LBA |
|---|---|---|
| 1 | Coquille `/apprentissage/époser-offre` ? | C'est bien `/apprentissage/deposer-offre`, sans accent |
| 2 | URLs landings stables, redirections 308 ? | Oui, stables, 308 validé |
| 3 | Sort des sous routes `/apprentissage/{id}` et `/apprentissage/entreprise/{id}` | Rediriger aussi vers la landing candidats |
| 4 | `/formations/apprentissage` dans le périmètre ? | Hors périmètre, reste sur 1J1S sans modification |
| 5 | Widget iframe recruteurs remplacé entièrement ? | Oui, intégralement, pas d'autre instance à conserver |
| 6 | Iframe candidature spontanée remplacée ? | Oui, redirection vers landing candidats |
| 7 | Forward des query params source ? | Oui, transmettre l'ensemble. Approche wildcard ou liste explicite à recommander |
| 8 | Ajouter `utm_source=1jeune1solution` fixe ? | Oui, remonte dans Plausible et Matomo |

## Décisions actées qui en découlent

1. **Périmètre élargi à toute la section `/apprentissage/*`**. Conséquence directe de la réponse 3 : tout le code candidats (page de recherche, détail offre, candidature spontanée) ainsi que le code recruteurs (landing employeurs, dépôt offre, widget iframe) devient inaccessible et peut être supprimé.

2. **`/formations/apprentissage` strictement préservée**. Tous les composants, use cases serveur, repositories et fixtures qui servent cette page restent intacts. Attention aux dépendances partagées (clients HTTP LBA formations, mappers, types, ComboboxMetiers).

3. **Redirections 308 permanentes** dans `config/redirects.js`, avec `utm_source=1jeune1solution` hardcodé en query param dans la destination. Next.js forward automatiquement les query params source sur les redirections, donc l'approche wildcard recommandée à LBA est satisfaite par défaut sans configuration supplémentaire (vérifié dans la doc officielle Next.js, section redirects).

4. **Pattern menu**. Les 3 entrées de `NavigationStructure.tsx` à externaliser bénéficient automatiquement de la détection externe via le hook `useIsInternalLink` (icône « nouvelle fenêtre » + `target="_blank"`), pattern déjà en place pour « Stages d'observation ».

5. **Nettoyage complet du code mort**. Suppression de tout le pan alternance candidats et recruteurs, en préservant strictement ce qui sert encore à `/formations/apprentissage`.

## Mappings de redirection à poser dans `config/redirects.js`

L'ordre d'évaluation est important : Next.js applique la première règle qui matche. Les règles spécifiques doivent précéder les wildcards. La règle `/apprentissage/simulation` existante reste en tête du fichier.

| Source | Destination | Note |
|---|---|---|
| `/apprentissage/deposer-offre` | `https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs?utm_source=1jeune1solution` | Spécifique, doit précéder le wildcard candidats |
| `/apprentissage-entreprises` | idem recruteurs | |
| `/apprentissage` | `https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution?utm_source=1jeune1solution` | Racine exacte |
| `/apprentissage/:path*` | idem candidats | Catch all sous routes `[id]` et `entreprise/[id]` |
| `/choisir-apprentissage` | idem candidats | |

## Fichiers à modifier (composants encore vivants)

1. `config/redirects.js` : ajout des 5 redirections ci dessus dans `ALL_MODE_REDIRECT`, en préservant l'ordre.
2. `src/client/components/layouts/Header/Navigation/NavigationStructure.tsx` : 3 entrées externalisées (lignes 31, 58, 104). Le `link` change uniquement, le label reste, l'entrée ne disparaît pas du menu.
3. `src/server/sitemap/useCases/genererSitemap.useCase.ts` : retirer de `OTHER_STATIC_PATH_LIST` les entrées `/apprentissage/deposer-offre`, `/apprentissage/deposer-offre-lba`, `/apprentissage-entreprises`. Les nouveaux liens externes du menu sont automatiquement filtrés par `isInternalURL` (ligne 70).
4. `src/server/sitemap/domain/sitemap.fixture.ts` : aligner la fixture en retirant les 5 URLs alternance (lignes 177, 198, 228, 234, 240).
5. `src/server/configuration/dependencies.container.ts` : retirer `alternanceDependencies` et `campagneApprentissageDependencies`, conserver `metierDependencies`.
6. `src/server/services/serverConfiguration.service.ts` : retirer `API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE` et `NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE`. Conserver `API_LA_BONNE_ALTERNANCE_URL`, `API_LA_BONNE_ALTERNANCE_CALLER`, `NEXT_PUBLIC_FORMATION_LBA_FEATURE`.
7. `src/server/services/configuration.service.fixture.ts` : aligner la fixture.
8. `.env.scalingo`, `.env.local`, `.env.test` : retirer `NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE`.
9. `src/pages/api/formations-initiales/index.controller.prod.test.ts` : retirer les références au feature flag et au mock alternance.
10. `src/pages/index.page.tsx` : retirer la carte alternance (ligne 79). Conserver la carte `/formations/apprentissage` (ligne 119).
11. `src/client/components/features/JeRecrute/DecouvrirDispositifs/*` : retirer ou retarger le lien vers `/apprentissage/deposer-offre`.
12. `src/client/components/features/JeRecrute/DecouvrirMesuresEmployeursEtApprentissage/*` : retirer ou retarger le lien vers `/apprentissage-entreprises`.
13. `src/pages/plan-du-site/index.page.test.tsx` : retirer 4 assertions (lignes 24, 31, 34, 63).
14. `src/client/components/layouts/Header/Header.test.tsx` : adapter le test ligne 59 à 73 (lien externe avec icône « nouvelle fenêtre »).

## Cartographie du code mort à supprimer

### Volumétrie
99 fichiers répartis comme suit :

* 21 pages alternance (candidats + recruteurs) et fichiers associés : `index.page.tsx`, `index.page.test.tsx`, `index.analytics.ts`, `index.module.scss`
* 2 routes BFF `src/pages/api/alternances/[id].controller.{ts,test.ts}`
* 14 composants `src/client/components/features/Alternance/*` (DetailAlternance, RechercherAlternance, FormulaireRechercheAlternance, ListeSolutionAlternance, ListeSolutionAlternanceEntreprise, BanniereApprentissage)
* 25 composants `src/client/components/features/CampagneApprentissage/*` (Jeunes, Entreprises, RaisonsDeChoisirApprentissage, VideosCampagneApprentissage, VideoFrame, PresentationCard, EnSavoirPlus, PreparationApprentissage, InformationSurEmbaucheApprenti, VerbatimsEmployeursApprentis)
* 1 ServiceCard `src/client/components/features/ServiceCard/DecouvrirApprentissage.tsx` (pointe uniquement vers `/choisir-apprentissage`)
* 20 fichiers `src/server/alternances/*` (domain, infra, configuration, useCases, mappers, repositories, error management)
* 11 fichiers `src/server/campagne-apprentissage/*` (domain vidéos Strapi, infra, useCases, configuration)
* 1 test Cypress `cypress/e2e/apprentissage.cy.ts`

### Détail des dossiers serveur à supprimer
* `src/server/alternances/domain/*`
* `src/server/alternances/infra/repositories/apiAlternance/*`
* `src/server/alternances/infra/repositories/apiLaBonneAlternance*`
* `src/server/alternances/infra/repositories/mockAlternance.repository.ts`
* `src/server/alternances/infra/status.ts`
* `src/server/alternances/configuration/*`
* `src/server/alternances/useCases/*`
* `src/server/campagne-apprentissage/*` (intégralité du dossier)

## Cartographie du code à préserver strictement

50+ fichiers à ne surtout pas casser. Ils servent `/formations/apprentissage` :

* Pages `src/pages/formations/apprentissage/{index,[id]}.page.tsx` et associés
* 12 composants `src/client/components/features/FormationAlternance/*` (Rechercher, Consulter, Statistiques, FormulaireRecherche, EtiquettesFiltre)
* ServiceCard `src/client/components/features/ServiceCard/FormationsEnApprentissageCard.tsx`
* Tout `src/server/formations/*` (notamment `apiLaBonneAlternanceFormation.repository.ts`, `apiTrajectoiresProStatistique.repository.ts`)
* Tout `src/server/metiers/*` (utilisé par FormationAlternance via ComboboxMetiers)
* Route BFF `src/pages/api/metiers/index.controller.ts`
* Composant UI `src/client/components/ui/Form/Combobox/ComboboxMetiers/*`
* Variable env `NEXT_PUBLIC_FORMATION_LBA_FEATURE`
* Variables env partagées `NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL`, `API_LA_BONNE_ALTERNANCE_URL`, `API_LA_BONNE_ALTERNANCE_CALLER`

## Points de vigilance

1. Le composant `MonEspaceEntreprise.tsx` utilise toujours `NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL` (espace pro LBA pour les employeurs). Il N'EST PAS lié aux pages alternance supprimées et doit être préservé. La variable d'env reste donc nécessaire au runtime.
2. Décision à trancher avant la PR : pour les liens dans `DecouvrirDispositifs` et `DecouvrirMesuresEmployeursEtApprentissage`, retarger directement vers les URLs LBA externes (UX optimale, hop direct) ou supprimer purement les CTAs (perte fonctionnelle mineure).
3. Stratégie PR à arbitrer : un seul PR « bascule + nettoyage des 99 fichiers » (gros diff mais cohérent) ou deux PR (bascule fonctionnelle d'abord, ménage à froid ensuite, plus facile à reviewer).

## Vérification end to end

* `npm run lint` : zero warning
* `npm run check-types`
* `npm test` : suite vitest verte
* `npm run dev` puis `curl -I` sur `/apprentissage`, `/choisir-apprentissage`, `/apprentissage-entreprises`, `/apprentissage/deposer-offre`, `/apprentissage/abc-123`, `/apprentissage/entreprise/xyz` pour vérifier le 308 vers la bonne destination avec `utm_source=1jeune1solution` et le forward des query params source
* Vérifier visuellement le header desktop et mobile : les 3 entrées alternance affichent l'icône « nouvelle fenêtre »
* Vérifier que `/sitemap.xml` ne contient plus les URLs redirigées
