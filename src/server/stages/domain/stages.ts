import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';

import { RemunerationPeriode } from './remunerationPeriode';

export interface EmployeurStageCMS {
	nom: string
	description?: string
	logoUrl?: string
	siteUrl?: string
}

export interface OffreDeStage {
	titre: string
	id: string
	slug: string
	dateDeDebutMin?: string
	dateDeDebutMax?: string
	description: string
	urlDeCandidature?: string
	domaines: Array<DomainesStage>
	dureeEnJour?: number
	dureeEnJourMax?: number
	localisation?: OffreDeStageLocalisation
	employeur?: EmployeurStageCMS
	remunerationMin?: number
	remunerationMax?: number
	remunerationPeriode?: RemunerationPeriode
	source?: SourceDesDonnées
	teletravailPossible?: boolean
}

export interface OffreDeStageLocalisation {
	ville?: string
	departement?: string
	codePostal?: string
	region?: string
	pays?: string
}

export interface OffreStageDepotLocalisation {
	adresse: string
	ville: string
	departement: string | null
	codePostal: string
	region: string | null
	pays: string
}

export interface OffreStageDepotEmployeur {
	nom: string
	description: string
	logoUrl: string | null
	siteUrl: string | null
	email: string
}

export interface OffreDeStageDepot {
	dateDeDebutMin: string
	dateDeDebutMax: string
	description: string
	domaine: DomainesStage
	duree: string
	employeur: OffreStageDepotEmployeur
	localisation: OffreStageDepotLocalisation
	remuneration: number
	teletravailPossible: boolean | null
	titre: string
	urlDeCandidature: string
}
