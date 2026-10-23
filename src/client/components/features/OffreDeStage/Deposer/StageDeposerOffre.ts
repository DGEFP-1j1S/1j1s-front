import { DomainesStage } from '~/server/stages/repository/domainesStage';

export interface OffreDeStageDeposeeEntreprise {
	descriptionEmployeur: string
	emailEmployeur: string
	logoEmployeur?: string
	nomEmployeur: string
	siteEmployeur?: string
}

export interface OffreDeStageDeposeeStage {
	dateDeDebutMin: string
	dateDeDebutMax: string
	isDateDeDebutPrecise: 'true' | 'false'
	descriptionOffre: string
	domaineStage?: DomainesStage
	dureeStage: string
	lienCandidature: string
	nomOffre: string
	remunerationStage?: string
	teletravail?: 'true' | 'false'
}

export interface OffreDeStageDeposeeLocalisation {
	pays: string
	ville: string
	adresse: string
	codePostal: string
	region?: string
	departement?: string
}
