import { Commune } from '~/server/localisations/domain/localisationAvecCoordonnées';

export interface Localisation {
  nom: string
  code: string
}

export enum TypeLocalisation {
  REGION = 'REGION',
  DEPARTEMENT = 'DEPARTEMENT',
  COMMUNE = 'COMMUNE',
}

export interface RechercheLocalisation {
  communeList: Commune[]
  departementList: Localisation[]
  regionList: Localisation[]
}

type Radius = { libellé: string, valeur: string }
export const radiusList: Radius[] = [
	{ libellé: '10 km', valeur: '10' },
	{ libellé: '30 km', valeur: '30' },
	{ libellé: '60 km', valeur: '60' },
	{ libellé: '100 km', valeur: '100' },
];
