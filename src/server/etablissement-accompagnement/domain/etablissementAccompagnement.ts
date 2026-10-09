export interface EtablissementAccompagnement {
	nom: string
	adresse?: EtablissementAccompagnementAdresse
	id: string
	telephone?: string
	email?: string
	horaires?: Array<EtablissementAccompagnementHoraire>
	type: TypeEtablissement
}

export type ContactEtablissementAccompagnement = Required<Pick<EtablissementAccompagnement, 'nom' | 'email' | 'type'>>

export interface EtablissementAccompagnementAdresse {
    codePostal: string
    numeroVoie: string
    nomCommune: string
}

export interface EtablissementAccompagnementHoraire {
    jour: JourSemaine
    heures: Array<EtablissementAccompagnementHoraireHeure>
}

export interface EtablissementAccompagnementHoraireHeure {
    début: string
    fin: string
}

export interface ParametresRechercheEtablissementAccompagnement {
	typeAccompagnement: string
	codeCommune: string
}

export function isTypeEtablissement(type: string): type is TypeEtablissement {
	return Object.values(TypeEtablissement).includes(type as TypeEtablissement);
}

export enum TypeEtablissement {
	FRANCE_TRAVAIL = 'france_travail',
	MISSION_LOCALE = 'mission_locale',
	INFO_JEUNE = 'cij',
}

export enum JourSemaine {
	LUNDI = 'Lundi',
	MARDI = 'Mardi',
	MERCREDI = 'Mercredi',
	JEUDI = 'Jeudi',
	VENDREDI = 'Vendredi',
	SAMEDI = 'Samedi',
	DIMANCHE = 'Dimanche'
}
