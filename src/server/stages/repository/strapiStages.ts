import { RemunerationPeriode } from '~/server/stages/domain/remunerationPeriode';
import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';


export interface OffreStageResponseStrapi {
	titre: string
	id: string
	slug: string
	dateDeDebutMin?: string
	dateDeDebutMax?: string
	createdAt: string
	publishedAt: string
	updatedAt: string
	description: string
	urlDeCandidature: string | null
	sourceCreatedAt: string
	sourceUpdatedAt: string
	sourcePublishedAt: string
	identifiantSource: string | null
	domaines?: Array<OffreStageResponseStrapiDomaines>
	dureeEnJour: number | null
	dureeEnJourMax: number | null
	localisation?: OffreStageResponseStrapiLocalisation
	employeur?: OffreStageResponseStrapiEmployeur
	remunerationMin?: number
	remunerationMax?: number
	remunerationPeriode?: RemunerationPeriode
	source: SourceDesDonnées | null
	teletravailPossible: boolean | null
}

export interface OffreStageResponseStrapiLocalisation {
	adresse: string | null;
	ville: string | null;
	departement: string | null;
	codePostal: string | null;
	region: string | null;
	pays: string | null;
}

export interface OffreStageResponseStrapiEmployeur {
	nom: string;
	description: string | null;
	logoUrl: string | null;
	siteUrl: string | null;
	email: string | null;
}

export interface OffreStageResponseStrapiDomaines {
	nom: DomainesStage;
}

export type OffreStageDepotStrapi =
	Pick<OffreStageResponseStrapi, 'dateDeDebutMin' | 'dateDeDebutMax' | 'description' | 'domaines' | 'dureeEnJour' | 'teletravailPossible' | 'titre' | 'remunerationMin' | 'remunerationMax' | 'remunerationPeriode'>
	& {
	identifiantSource: string;
	publishedAt: null;
	urlDeCandidature: string;
	localisation: OffreStageResponseStrapiLocalisation;
	employeur: OffreStageResponseStrapiEmployeur;
	source: SourceDesDonnées.INTERNE;
}
