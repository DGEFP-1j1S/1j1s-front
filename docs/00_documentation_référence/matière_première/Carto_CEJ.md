---

## Vision Produit

### Contexte

Le **Contrat d'Engagement Jeune (CEJ)** est un dispositif gouvernemental français destiné à accompagner les jeunes éloignés de l'emploi vers une insertion professionnelle durable.

### Cible utilisateur

Jeunes de **16 à 25 ans** (jusqu'à 30 ans pour les personnes en situation de handicap) qui :

- Sont sans emploi et sans formation
- N'ont pas de projet professionnel défini
- Font face à des difficultés matérielles et financières
- Sont prêts à s'engager dans un programme intensif

### Proposition de valeur

Le CEJ offre un **parcours personnalisé pouvant durer jusqu'à 12 mois** comprenant :

| Bénéfice | Description |
| --- | --- |
| **Accompagnement dédié** | Un conseiller personnel qui suit le jeune jusqu'à l'emploi durable |
| **Programme intensif** | 15 à 20 heures d'activités par semaine minimum |
| **Allocation financière** | Jusqu'à 561,68€/mois selon les ressources et le respect des engagements |

### Gains à long terme pour le bénéficiaire

- Définir et bâtir un **projet professionnel durable**
- Mettre en valeur ses **talents et compétences**
- **Découvrir le monde professionnel** et ses codes
- **Construire son réseau** pour faciliter l'accès à l'emploi

### Parcours utilisateur sur la page

```
┌─────────────────────────────────────────────────────────────────┐
│  1. DÉCOUVERTE (Hero)                                           │
│     "Le CEJ, la solution pour vous !"                          │
│     → CTA: "Trouver son accompagnement CEJ"                    │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. COMPRÉHENSION                                               │
│     - "Qu'est-ce que c'est ?" (explication du dispositif)      │
│     - "Est-ce fait pour moi ?" (critères d'éligibilité)        │
│     - "Qu'est-ce que j'y gagne ?" (bénéfices long terme)       │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. PROJECTION (Témoignages)                                    │
│     - Kévin, 18 ans : parcours Mission Locale → emploi         │
│     - Latifa, 22 ans : parcours France Travail → apprentissage │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. ALLOCATION                                                  │
│     Conditions pour bénéficier de l'aide financière            │
│     (âge, ressources, statut fiscal, respect engagements)      │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. ORIENTATION (Accompagnement)                                │
│     Questionnaire interactif pour orienter vers :              │
│     - Mission Locale (si déjà accompagné ou <25 ans)           │
│     - France Travail (si déjà accompagné ou autre situation)   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. CONVERSION (Demande de contact)                             │
│     Formulaire pour être recontacté par un conseiller          │
│     → Données envoyées au CMS pour traitement                  │
└─────────────────────────────────────────────────────────────────┘
```

### Objectifs de conversion

1. **Primaire** : Remplir le formulaire de demande de contact
2. **Secondaire** : Orienter vers le bon interlocuteur (Mission Locale ou France Travail)
3. **Tertiaire** : Télécharger l'application mobile CEJ

### Acteurs du dispositif

| Acteur | Rôle | Cible |
| --- | --- | --- |
| **Mission Locale** | Accompagnement des jeunes de 16-25 ans | Jeunes sans diplôme, sans ressources |
| **France Travail** | Accompagnement des demandeurs d'emploi | Jeunes diplômés, demandeurs d'emploi |

### Flux de transmission des données (aval)

Les données collectées via le formulaire CEJ sont transmises aux équipes chargées du rappel téléphonique des jeunes.

### Volumétrie

- ~270 demandes/semaine
- ~13 800 demandes traitées en 2025
- Transmission hebdomadaire (chaque lundi)

### Flux actuel

```
Site 1j1s ──▶ Strapi CMS ──▶ FilR (export hebdo) ──▶ Équipes de rappel
             (contact-cejs)    (disparaît 01/2025)
```

### Migration vers Teams/OneDrive

FilR disparaît à compter du 21 janvier 2025. Options de remplacement :

| Option | Description | Complexité |
| --- | --- | --- |
| **Power Automate** | Workflow Microsoft no-code, idéal si licences M365 | Faible |
| **n8n / Zapier** | Plateforme d'automatisation avec connecteurs Strapi + OneDrive | Moyenne |
| **Script CRON** | Script planifié appelant l'API Strapi et uploadant vers OneDrive | Moyenne |
| **Webhook Strapi** | Envoi temps réel vers Azure Function puis OneDrive | Élevée |
| **Export manuel** | Plugin CSV Export Strapi + upload manuel | Aucune |

### API Strapi disponible

Pour récupérer les demandes CEJ depuis Strapi :

```
GET /api/contact-cejs
Authorization: Bearer <token>
```

Champs disponibles : `age`, `code_postal`, `email`, `nom`, `prenom`, `telephone`, `ville`, `createdAt`

### Webhook Strapi (option temps réel)

Strapi peut déclencher un webhook à chaque nouvelle entrée :

- Événement : `entry.create` sur la collection `contact-cejs`
- Payload : données de la demande (hors champs privés)
- Configuration : `./config/server.js`

---

# Documentation Technique

## Structure des fichiers

| Catégorie | Localisation |
| --- | --- |
| **Page principale** | `src/pages/contrat-engagement-jeune/` |
| **Composants UI** | `src/client/components/features/ContratEngagementJeune/` |
| **Service client** | `src/client/services/demandeDeContact/` |
| **API endpoint** | `src/pages/api/demandes-de-contact/` |
| **UseCase** | `src/server/demande-de-contact/useCases/` |
| **Repository** | `src/server/demande-de-contact/infra/repositories/cej/` |
| **Tests E2E** | `cypress/e2e/formulaire_cej.cy.ts` |

---

## Flux principal de données

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND                                                     │
│                                                               │
│  FormulaireDeContactCEJ                                       │
│  (prénom, nom, email, téléphone, age, commune, codePostal)   │
│                    │                                          │
│                    ▼                                          │
│  DemandeDeContactService.envoyerPourLeCEJ()                  │
└──────────────────────────────────────────────────────────────┘
                     │
                     │ POST /api/demandes-de-contact
                     │ body: { ...fields, type: 'CEJ' }
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  BACKEND (Next.js API)                                       │
│                                                               │
│  Controller → UseCase (validation Joi) → Repository          │
│                                                               │
│  Transformations: prénom→prenom, codePostal→code_postal      │
└──────────────────────────────────────────────────────────────┘
                     │
                     │ POST /api/contact-cejs
                     │ Headers: Authorization: Bearer JWT
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  STRAPI CMS                                                  │
│  Collection: contact-cejs                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Endpoints API

| Endpoint | Méthode | Description |
| --- | --- | --- |
| `/api/demandes-de-contact` | POST | Endpoint frontend principal |
| `/api/contact-cejs` (Strapi) | POST | Sauvegarde dans le CMS |
| `/api/communes` | GET | Recherche autocomplete communes |

### POST /api/demandes-de-contact

**Body Request:**

```json
{
  "type": "CEJ",
  "age": 18,
  "codePostal": "75001",
  "email": "test@test.com",
  "nom": "Dupont",
  "prénom": "Jean",
  "téléphone": "+33678954322",
  "ville": "Paris"
}
```

**Response Success:** `200 OK` (body vide)

**Response Failure:** `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "Une erreur est survenue lors de l'envoi du formulaire"
}
```

### POST /api/contact-cejs (Strapi)

**Headers:**

```
Authorization: Bearer ${jwt_token}
Content-Type: application/json
```

**Body Request:**

```json
{
  "data": {
    "age": 18,
    "code_postal": "75001",
    "email": "test@test.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+33678954322",
    "ville": "Paris"
  }
}
```

---

## Types TypeScript

### DemandeDeContactCEJ

```tsx
interface DemandeDeContactCEJ {
  prénom: string
  nom: string
  téléphone: string
  ville: string
  codePostal: string
  age: 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  email: string
}
```

### FormulaireDemandeDeContactCEJ (client-side)

```tsx
interface FormulaireDemandeDeContactCEJ {
  age: number
  email: string
  nom: string
  prénom: string
  téléphone: string
  ville: string
  codePostal: string
}
```

### Service Interface

```tsx
interface DemandeDeContactService {
  envoyerPourLeCEJ(formulaire: FormulaireDemandeDeContactCEJ): Promise<Either<undefined>>
}
```

---

## Validation (Joi)

| Champ | Validation |
| --- | --- |
| **age** | Entier entre 16 et 30 |
| **email** | Regex email |
| **téléphone** | Lib `phone` (format français, normalisé en +33) |
| **codePostal** | Regex France métropolitaine + DOM-TOM |
| **nom, prénom, ville** | Requis (string) |

### Schéma Joi

```tsx
const DemandeDeContactCEJValidator = Joi.object({
  age: Joi.number().integer().min(16).max(30).required(),
  codePostal: Joi.string()
    .pattern(/^((?:0[1-9]|[1-8]\\d|9[0-5])\\d{3}|(?:97[1-6]\\d{2}))$/)
    .required(),
  email: Joi.string().pattern(new RegExp(emailRegex)).required(),
  nom: Joi.string().required(),
  prénom: Joi.string().required(),
  téléphone: Joi.string().custom(validatePhone).required(),
  ville: Joi.string().required(),
});
```

---

## Architecture hexagonale

```
Présentation (React)
       │
       ▼
Application (Service BFF)
       │
       ▼
Domaine (UseCase + Validation)
       │
       ▼
Infrastructure (Repository)
       │
       ▼
External (Strapi CMS)
```

### Pattern Either

Gestion fonctionnelle des erreurs:

```tsx
Either<T> = Success<T> | Failure<ErreurMetier>

// Erreurs possibles:
// - ErreurMetier.DEMANDE_INCORRECTE (validation failure)
// - ErreurMetier.SERVICE_INDISPONIBLE (API error)
```

---

## Composants principaux

### Page

- `src/pages/contrat-engagement-jeune/index.page.tsx` - Page principale

### Sections

| Composant | Description |
| --- | --- |
| **Banniere** | Hero section avec image et CTA |
| **QuEstCeQueCest** | Section explicative "C'est quoi le CEJ?" |
| **QuEstCeQueJyGagne** | Section gains/bénéfices |
| **Allocations** | Informations sur les aides financières |
| **Témoignages** | Témoignages Kevin et Latifa |
| **Accompagnement** | Flux de formulaires conditionnels |
| **DemandeContactCEJ** | Formulaire de demande de contact |
| **Application** | Section app mobile |

### Flux Accompagnement

```
Démarrage
  ├─ Oui, Mission Locale → ModaleFormulaireMissionLocale
  ├─ Oui, France Travail → ModaleFranceTravail
  └─ Non, pas accompagnement → PasDAccompagnement
      ├─ <18 ans → FormulaireMissionLocale
      ├─ 18-25 ans → BesoinAide
      └─ >25 ans → BesoinAide26ans
          ├─ Oui aide → AutresBesoins / Handicap
          └─ Non aide → ModaleDispositifs / ModaleFranceTravail
```

---

## Tests

### Tests unitaires

| Fichier | Description |
| --- | --- |
| `envoyerDemandeDeContactCEJ.usecase.test.ts` | Validation Joi, normalisation téléphone |
| `demandeDeContactCEJ.repository.test.ts` | Appel CMS, transformation champs |
| `bff.demandeDeContact.service.test.ts` | HTTP call, type='CEJ' |
| `index.controller.test.ts` | Intégration complète, mock Strapi (nock) |

### Tests composants (Jest/RTL)

| Fichier | Description |
| --- | --- |
| `Banniere.test.tsx` | Titre h1, lien CTA |
| `FormulaireContactCEJ.test.tsx` | Form fields, validation, submit |
| `Accompagnement.test.tsx` | Flux complet avec tous les cas |
| `DemandeContactCEJ.test.tsx` | Section demande contact |

### Tests E2E (Cypress)

**Fichier:** `cypress/e2e/formulaire_cej.cy.ts`

Scénarios testés:

1. Clic bouton -> Affiche formulaire modal
2. Remplissage formulaire -> POST /api/demandes-de-contact
3. Success -> Affiche message "Votre demande a bien été transmise"
4. Validation email -> Form invalide si email incorrect

---

## Configuration

### Variables d'environnement

```
# Strapi (pour contacts CEJ)
STRAPI_URL=http://localhost:1337
STRAPI_USER_EMAIL=1j1s@gouv.fr
STRAPI_USER_PASSWORD=...

# Frontend
NEXT_PUBLIC_API_BASE_URL=/api
```

---

## Assets

| Fichier | Usage |
| --- | --- |
| `public/images/cej.webp` | Image bannière principale |
| `public/images/CEJ/logo.svg` | Logo CEJ |
| `public/images/CEJ/what-it-is.png` | Section "C'est quoi?" |
| `public/images/CEJ/benefit-from-it.png` | Section allocations |
| `public/images/CEJ/vignette-kevin.jpg` | Témoignage Kevin |
| `public/images/CEJ/vignette-latifa.jpg` | Témoignage Latifa |
