import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { SourceDesDonnees } from '~/server/stages/repository/sourceDesDonneesStage';

export type LocalisationStageIndexee = {
	ville?: string
	departement?: string
	codePostal?: string
	region?: string // enum de region ? (interessant pour savoir si pays en full + majuscule …)
	pays: string // enum de pays ? (interessant pour savoir si pays en full + majuscule …) (https://www.npmjs.com/package/i18n-iso-countries ?)
}
export type OffreDeStageIndexee = {
	titre: string
	description: string
	dateDeDebutMin?: string
	dateDeDebutMax?: string
	id: string
	slug: string
	domaines?: Array<DomainesStage>
	duree?: string
	dureeCategorisee?: string,
	dureeEnJour?: number
	dureeEnJourMax?: number
	localisation?: LocalisationStageIndexee
	nomEmployeur?: string
	logoUrlEmployeur?: string
	source?: SourceDesDonnees
	teletravailPossible?: boolean
};
