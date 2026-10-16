import { TypeLocalisation } from '~/server/localisations/domain/localisation';

export type OffreId = string;

export interface Offre {
	id: OffreId
	intitulé: string
	description?: string
	formationList: OffreFormation[]
	compétenceList: string[]
	qualitéeProfessionnelleList: string[]
	lieuTravail?: string
	salaire?: string
	entreprise: OffreEntreprise
	typeContrat?: OffreTypeDeContrat
	expérience?: OffreExpérience
	duréeTravail?: OffreDuréeTravail
	urlOffreOrigine: string
	étiquetteList: string[]
}

export enum OffreExpérience {
	DEBUTANT_ACCEPTE = 'Débutant accepté',
	EXPERIENCE_SOUHAITEE = 'Expérience souhaitée',
	EXPERIENCE_EXIGEE = 'Expérience exigée',
}

export enum OffreDuréeTravail {
	TEMPS_PLEIN = 'Temps plein',
	TEMPS_PARTIEL = 'Temps partiel',
}

export interface OffreEntreprise {
	nom?: string
	logo?: string
}

export interface OffreFormation {
	libellé?: string
	commentaire?: string
}

type Contrat = 'CDD' | 'CDI' | 'SAI' | 'MIS'

export interface OffreTypeDeContrat {
	libelléCourt: string
	libelléLong: string
	valeur: Contrat
}

export const CONTRAT_CDD: OffreTypeDeContrat = {
	libelléCourt: 'CDD',
	libelléLong: 'Contrat à durée déterminé',
	valeur: 'CDD',
};

export const CONTRAT_CDI: OffreTypeDeContrat = {
	libelléCourt: 'CDI',
	libelléLong: 'Contrat à durée indéterminé',
	valeur: 'CDI',
};

export const CONTRAT_INTÉRIMAIRE: OffreTypeDeContrat = {
	libelléCourt: 'Intérim',
	libelléLong: 'Mission intérimaire',
	valeur: 'MIS',
};

export const CONTRAT_SAISONNIER: OffreTypeDeContrat = {
	libelléCourt: 'Saisonnier',
	libelléLong: 'Contrat travail saisonnier',
	valeur: 'SAI',
};

export const TYPE_DE_CONTRAT_LIST: OffreTypeDeContrat[] = [
	CONTRAT_CDD,
	CONTRAT_CDI,
	CONTRAT_INTÉRIMAIRE,
	CONTRAT_SAISONNIER,
];


type Temps = 'tempsPlein' | 'tempsPartiel' | 'indifférent'

export interface OffreTempsDeTravail {
	libellé: string
	valeur: Temps
}

export const TEMPS_PLEIN: OffreTempsDeTravail = {
	libellé: 'Temps plein',
	valeur: 'tempsPlein',
};

export const TEMPS_PARTIEL: OffreTempsDeTravail = {
	libellé: 'Temps partiel',
	valeur: 'tempsPartiel',
};

export const TEMPS_INDIFFERENT: OffreTempsDeTravail = {
	libellé: 'Indifférent',
	valeur: 'indifférent',
};

export const TEMPS_DE_TRAVAIL_LIST: OffreTempsDeTravail[] = [
	TEMPS_PLEIN,
	TEMPS_PARTIEL,
	TEMPS_INDIFFERENT,
];

type expérience = 'D' | 'S' | 'E'

export interface OffreExpérienceAttendu {
	libellé: string
	valeur: expérience
}

export const EXPÉRIENCE_DEBUTANT: OffreExpérienceAttendu = {
	libellé: 'Moins de 1 an',
	valeur: 'D',
};

export const EXPÉRIENCE_EXIGÉE: OffreExpérienceAttendu = {
	libellé: 'Plus de 3 ans',
	valeur: 'E',
};

export const EXPÉRIENCE_SOUHAITÉ: OffreExpérienceAttendu = {
	libellé: 'De 1 à 3 ans',
	valeur: 'S',
	};

export const EXPÉRIENCE: OffreExpérienceAttendu[] = [
	EXPÉRIENCE_DEBUTANT,
	EXPÉRIENCE_SOUHAITÉ,
	EXPÉRIENCE_EXIGÉE,
];

export interface OffreCheckboxFiltre {
	libellé: string
	valeur: string
}

export interface RésultatsRechercheOffre {
	nombreRésultats: number
	résultats: Offre[]
}

export interface OffreFiltre {
	page: number
	motClé?: string
	localisation?: OffreEmploiFiltreLocalisation
}

export interface OffreEmploiFiltreLocalisation {
	type: TypeLocalisation
	code: string
}

export enum DomaineCode {
	M = 'M',
	B = 'B',
	C = 'C',
	F = 'F',
	D = 'D',
	E = 'E',
	M14 = 'M14',
	M13 = 'M13',
	A = 'A',
	G = 'G',
	C15 = 'C15',
	H = 'H',
	M18 = 'M18',
	I = 'I',
	M17 = 'M17',
	M15 = 'M15',
	J = 'J',
	M16 = 'M16',
	K = 'K',
	L = 'L',
	L14 = 'L14',
	N = 'N'
}

export interface RéférentielDomaine {
	code: DomaineCode
	libelle: string
}

export const NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE = 15;
// France Travail provides us with results whose starting index does not exceed 3000.
const MAX_RESULT_ALLOWED_BY_FRANCE_TRAVAIL = 3000;
export const MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL = Math.ceil(MAX_RESULT_ALLOWED_BY_FRANCE_TRAVAIL / NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE);

export function isOffreÉchantillonFiltre(offreFiltre: OffreFiltre) {
	const { page, ...rest } = offreFiltre;
	const emploiFiltreSanitized = Object.values(rest);
	const isSearchWithoutFilter = emploiFiltreSanitized.every((value) => value === undefined);
	return page === 1 && isSearchWithoutFilter;
}
