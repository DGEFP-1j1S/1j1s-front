## Enrichir les README.md

L’utilisation de docusaurus est évidente... si on connaît. Je recommande d'expliquer brièvement où trouver la documentation, au moins.

## Priorité très haute

- Vérouiller les versions des images Docker utilisées, car les commandes évoluent et celles qui sont utilisées ne sont parfois plus existantes dans les nouvelles versions.
- Remplacer MinIO par Garage ou Rustfs. Cause : la licence a changé est plus restrictive, peut poser problème pour le futur.
- Mettre à jour toutes les dépendances github action (setup-node, checkout, upload artefact, etc…).

## Priorité haute

- Mettre à jour Next : la version 14 est utilisée alors que la v16 existe. Plus le temps passe et plus il sera difficile de migrer pour être à jour.
- Mettre à jour React (18.3.1 alors que la v19.2.3 est disponible, devrait être fait en même temps par la migration de Next). Des API ont été simplifiées, et ne seront plus disponible dans la v20.
- Lister et supprimer toutes les mauvaises pratiques :
    - utilisation de setState dans useEffect (gros travail)
    - appel à des fonctions non déterministes dans le rendu
    - lecture de refs dans des endroits non safe
- utiliser StrictMode de React

## Priorité moyenne

- Mettre à jour Storybook : 8 -> 10. Les évolutions de Storybook sont fréquentes et le passage à v9 permet de bien meilleures performances et une bien meilleure DX.
- Mettre à jour ESLint : la fin de vie de la v8 qui est utilisée date d’octobre 2024...
- Mettre à jour les autres dépendances
