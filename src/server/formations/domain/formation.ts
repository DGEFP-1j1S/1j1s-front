export interface RésultatRechercheFormation {
	adresse?: string
	titre: string
	nomEntreprise?: string
	tags: [ localisation: string | undefined, niveauRequis: NiveauRequisLibelle | 'Autre' ]
	id: string
	codePostal?: string
	longitude?: number
	latitude?: number
	ville?: string
	codeCertification?: string
}

export type Formation = {
	titre?: string
	nomEntreprise?: string
	tags: string[]
	description?: string
	objectif?: string
	dureeIndicative?: string
	adresse: { adresseComplete?: string, codePostal?: string, longitude?: number, latitude?: number }
	lienDemandeRendezVous?: string
}

export enum NiveauRequisLibelle {
	NIVEAU_3 = 'CAP, autres formations niveau 3',
	NIVEAU_4 = 'Bac, autres formations niveau 4',
	NIVEAU_5 = 'BTS, DEUST, autres formations niveau 5 (Bac + 2)',
	NIVEAU_6 = 'Licence, BUT, autres formations niveau 6 (Bac + 3)',
	NIVEAU_7_8 = 'Master, titre ingénieur, autres formations niveau 7 ou 8 (Bac + 5)',
}

export enum NiveauRequisValeur {
	NIVEAU_3 = '3',
	NIVEAU_4 = '4',
	NIVEAU_5 = '5',
	NIVEAU_6 = '6',
	NIVEAU_7_8 = '7',
	NIVEAU_INDIFFERENT = 'indifférent',
}

export interface FormationFiltre {
	codeRomes: Array<string>
	codeCommune: string
	distanceCommune: string
	latitudeCommune: string
	longitudeCommune: string
	niveauEtudes?: string
}

export interface FormationFiltreAvecCodeCertification extends FormationFiltre {
	codeCertification?: string
}

export interface FormationNiveauRequisFiltreRecherche {
	libellé: string
	valeur: NiveauRequisValeur
}

export const FORMATION_NIVEAU_3: FormationNiveauRequisFiltreRecherche = {
	libellé: NiveauRequisLibelle.NIVEAU_3,
	valeur: NiveauRequisValeur.NIVEAU_3,
};

export const FORMATION_NIVEAU_4: FormationNiveauRequisFiltreRecherche = {
	libellé: NiveauRequisLibelle.NIVEAU_4,
	valeur: NiveauRequisValeur.NIVEAU_4,
};

export const FORMATION_NIVEAU_5: FormationNiveauRequisFiltreRecherche = {
	libellé: NiveauRequisLibelle.NIVEAU_5,
	valeur: NiveauRequisValeur.NIVEAU_5,
};

export const FORMATION_NIVEAU_6: FormationNiveauRequisFiltreRecherche = {
	libellé: NiveauRequisLibelle.NIVEAU_6,
	valeur: NiveauRequisValeur.NIVEAU_6,
};

export const FORMATION_NIVEAU_7: FormationNiveauRequisFiltreRecherche = {
	libellé: NiveauRequisLibelle.NIVEAU_7_8,
	valeur: NiveauRequisValeur.NIVEAU_7_8,
};

export const FORMATION_NIVEAU_INDIFFERENT: FormationNiveauRequisFiltreRecherche = {
	libellé: 'Indifférent',
	valeur: NiveauRequisValeur.NIVEAU_INDIFFERENT,
};

export const FORMATION_NIVEAU_ETUDES: FormationNiveauRequisFiltreRecherche[] = [
	FORMATION_NIVEAU_3,
	FORMATION_NIVEAU_4,
	FORMATION_NIVEAU_5,
	FORMATION_NIVEAU_6,
	FORMATION_NIVEAU_7,
	FORMATION_NIVEAU_INDIFFERENT,
];
