---
sidebar_label: La recherche indexée, comment ça marche ?
sidebar_position: 3
---

# la recherche indexée

_20 Avril 2023 (mis à jour le 30 Octobre 2026)_

:::info Introduction
Les pages permettant de rechercher des résultats indexés présentent un formulaire qui, une fois soumis, met à jour les
paramètres de recherche dans l'url. La page est alors rendue côté serveur : `getServerSideProps` interroge Meilisearch
et la page s'affiche avec les résultats.
:::

## Comment ça marche ?

Les résultats proviennent de Meilisearch, des objets indexés par le CMS (plugin Meilisearch de Strapi) et chargés par
l'[ETL](https://github.com/DNUM-SocialGouv/1j1s-etl) à partir de flux. Le fonctionnement est le même que celui de la
[recherche via API](./recherche-api.md), à ceci près que la recherche est faite côté serveur, au rendu de la page :

```
Navigateur                        Serveur Next.js                                   Meilisearch
──────────                        ───────────────                                   ───────────
formulaire soumis
  └─ router.push(?motCle=…&page=1)
                                  getServerSideProps
                                    ├─ valide les paramètres de l'url (Joi)
                                    └─ use case → repository Meilisearch ──────────▶ multiSearch
                                                                          ◀──────── résultats + facettes
page rendue avec les résultats ◀── props
```

- **Le formulaire** est un `<form>` classique : les champs sont lus avec `getFormAsQuery` et mis dans l'url à la
  soumission (bouton « Rechercher »), en revenant à la première page. Rien n'est recherché pendant la saisie.
- **La page** est affichée avec `RechercherSolutionLayout` (message de résultats, pagination, erreurs), comme les
  recherches via API. La pagination modifie le paramètre `page` de l'url, ce qui relance `getServerSideProps`.
- **Les options des champs à choix multiples** (domaines, centres d'intérêt, types de bien…) sont les facettes
  renvoyées par Meilisearch avec les résultats.
- **Les champs à suggestions** (localisations des stages, lieux des évènements) cherchent pendant la saisie via une
  route d'API, la seule partie appelée depuis le navigateur. Le navigateur n'interroge jamais Meilisearch directement.

### Les briques partagées

| Brique | Rôle |
|---|---|
| `src/server/services/meilisearch/rechercheIndexee.ts` | `rechercherAvecFacettesDisjonctives` (résultats + facettes), `construireFiltre`, `rechercherValeursDeFacette` (suggestions) |
| `MeilisearchErrorManagementService` | journalise les erreurs Meilisearch et renvoie `SERVICE_INDISPONIBLE` |
| `ChampFacette` | select multiple dont les options sont les valeurs d'une facette |
| `ChampSuggestionsMultiples` | champ de saisie qui propose des valeurs à cocher, cherchées pendant la frappe |
| `ChampIntervalle` | saisie d'un minimum et d'un maximum (prix, surface) |

**Filtres** : les valeurs cochées d'un même champ sont combinées par OU, les champs entre eux par ET. Les intervalles
ajoutent des bornes (`prix >= 300`, `prix <= 600`).

**Facettes disjonctives** : si on filtre sur un domaine, la facette des domaines ne renverrait plus que ce domaine et les
autres options disparaîtraient du champ. `rechercherAvecFacettesDisjonctives` fait donc, en une seule requête
`multiSearch`, une recherche pour les résultats et une par facette sans le filtre de cette facette.

### Les pages concernées

| Page | Index | Paramètres de l'url | Route d'API (suggestions) |
|---|---|---|---|
| [stages](https://www.1jeune1solution.gouv.fr/stages) | `MEILISEARCH_INDEX_OFFRE_DE_STAGE` | `motCle`, `localisations`, `domaines`, `durees`, `page` | `/api/stages/localisations` |
| [annonces de logement](https://www.1jeune1solution.gouv.fr/logements/annonces) | `MEILISEARCH_INDEX_ANNONCE_DE_LOGEMENT` | `ville`, `typesOffre`, `typesBien`, `prixMin`, `prixMax`, `surfaceMin`, `surfaceMax`, `page` | — |
| [fiches métier](https://www.1jeune1solution.gouv.fr/decouvrir-les-metiers) | `fiche-metier` | `motCle`, `centresInteret`, `page` | — |
| [évènements](https://www.1jeune1solution.gouv.fr/evenements) | `evenement` | `motCle`, `lieux`, `page` | `/api/evenements/lieux` |

Les valeurs multiples sont séparées par des virgules dans l'url (`domaines=audit,conseil`).

Les pages évènements et annonces de logement sont derrière les feature flags `NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE`
et `NEXT_PUBLIC_LOGEMENT_FEATURE`.

### Configuration

| Variable | Rôle |
|---|---|
| `MEILISEARCH_BASE_URL` | url de Meilisearch |
| `MEILISEARCH_API_KEY` | clé d'API de recherche |
| `MEILISEARCH_INDEX_OFFRE_DE_STAGE` | index des offres de stage |
| `MEILISEARCH_INDEX_ANNONCE_DE_LOGEMENT` | index des annonces de logement |
| `LOGEMENT_IMAGE_URL_LIST` | hôtes des images d'annonces autorisés par `next/image` (voir plus bas) |

Ces variables ne sont lues que par le serveur. Pour une recherche en local, voir
[Lancer le CMS en local](../onboarding/4-cms-local.md).

## Ajouter une recherche indexée

1. **Domaine** (`src/server/<domaine>/domain`) : le filtre, les résultats et l'interface du repository.
2. **Repository** (`src/server/<domaine>/infra`) : appelle `rechercherAvecFacettesDisjonctives` avec les attributs de
   l'index (ils doivent être déclarés `filterableAttributes` dans la configuration Meilisearch du CMS), et
   `MeilisearchErrorManagementService` en cas d'erreur. Il reçoit le client Meilisearch partagé du conteneur de
   dépendances.
3. **Use case** et branchement dans `src/server/configuration/dependencies.container.ts`.
4. **Page** : `getServerSideProps` valide les paramètres de l'url avec Joi, les transforme en filtre et appelle le use
   case ; un hook `use<Domaine>Query` lit ces paramètres côté client.
5. **Formulaire** : un `<form>` dont les noms de champs sont les paramètres de l'url, avec `ChampFacette`,
   `ChampSuggestionsMultiples` ou `ChampIntervalle` selon les besoins.
6. **Suggestions pendant la saisie** (si besoin) : une route d'API qui appelle `rechercherValeursDeFacette`, et un
   service client qui l'interroge.

# Que faire si...

## Une recherche de contenu indexé est indisponible (« Service indisponible »)
Le serveur n'arrive pas à interroger Meilisearch : l'erreur est détaillée dans les logs du serveur.
Votre conteneur Docker comprenant Meilisearch est-il bien lancé ? Les variables `MEILISEARCH_*` pointent-elles vers lui,
et le serveur a-t-il été relancé depuis leur modification ?

## Une recherche de contenu indexé mène vers une page non trouvée
Appelez-vous le même Meilisearch que votre CMS ? Les 2 devraient être reliés à votre conteneur Docker.
Avez-vous saisi du contenu dans Meilisearch ?
Si oui, cliquez sur `refresh` sur l'index sur votre Strapi.

## Un champ à choix multiples ne propose aucune option
Ses options sont les valeurs de la facette dans l'index : l'attribut est-il bien déclaré `filterableAttributes`, et
les documents indexés ont-ils des valeurs pour cet attribut ?

## Le nombre de résultats plafonne
Meilisearch ne compte et ne pagine qu'au plus `pagination.maxTotalHits` résultats (réglage de l'index dans le CMS).

## La page des annonces de logement est en erreur 500
`next/image` refuse les images dont l'hôte n'est pas déclaré dans `next.config.js`, ce qui fait échouer le rendu
serveur. Le repository ne garde que les images des hôtes de `LOGEMENT_IMAGE_URL_LIST` : vérifier que cette variable
contient les hôtes des sources d'annonces (les annonces sans image autorisée affichent une image par défaut).
