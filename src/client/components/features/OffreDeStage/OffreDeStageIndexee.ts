import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';

export type LocalisationStageIndexée = {
	ville?: string
	departement?: string
	codePostal?: string
	region?: string // enum de region ? (interessant pour savoir si pays en full + majuscule …)
	pays: string // enum de pays ? (interessant pour savoir si pays en full + majuscule …) (https://www.npmjs.com/package/i18n-iso-countries ?)
}
export type OffreDeStageIndexée = {
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
	localisation?: LocalisationStageIndexée
	nomEmployeur?: string
	logoUrlEmployeur?: string
	source?: SourceDesDonnées
	teletravailPossible?: boolean
};
