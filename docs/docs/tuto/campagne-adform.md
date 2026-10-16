---
sidebar_label: Une campagne de com' Adform, comment on fait ?
sidebar_position: 5
---

# Le marketing avec Adform

_05 septembre 2023 (mis à jour le 24 Juillet 2024)_

:::info Introduction
Quand on fait une campagne de com, on veut tracker où les utilisateurs arrivent, d'où ils viennent, etc.
:::

## Comment ça marche ?

Le [`MarketingService`](https://github.com/DNUM-SocialGouv/1j1s-front/blob/main/src/client/services/marketing/marketing.service.ts)
initialise le service, le configure et l'ajoute au gestionnaire de cookies à l'instanciation dans le conteneur d'injection.
Ce service est commun à toutes les campagnes de com'.

Ce service expose une méthode `trackPage` doit être appelé sur chaque page trackée dans la campagne et prend en paramètre le _page name_ fournit par Adform.

Pour permettre d'activer/désactiver les campagnes indépendament les unes des autres, le choix a été fait de créer un feature flipping par campagne.

E.g. [pour la campagne apprentissage](https://github.com/DNUM-SocialGouv/1j1s-front/blob/b27b2a8249540c4b710d857de9e66c08bcaeee2f/src/pages/choisir-apprentissage/index.page.tsx#L25C2-L25C2) : 
```tsx
// src/pages/choisir-apprentissage/index.page.tsx

const PAGE_NAME = '2023-04-1jeune1solution.gouv.fr-PageArrivee-ChoisirApprentissage';

export default function ApprentissageJeunes(props) {
    const marketingService = useDependency<MarketingService>('marketingService');
    const marketingPageActif = process.env.NEXT_PUBLIC_CAMPAGNE_CHOISIR_APPRENTISSAGE_FEATURE === '1';

    if (marketingPageActif) {
        marketingService.trackPage(PAGE_NAME);
    }
  // ...
}
```
Il est également possible de d'activer/désactiver complètement le tracking en modifiant simplement le feature flip associé : 
```shell
NEXT_PUBLIC_CAMPAGNE_ADFORM_FEATURE=1
```
