import { OffreDeStageIndexée } from '~/client/components/features/OffreDeStage/OffreDeStageIndexee';
import { Either } from '~/server/errors/either';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

export const NOMBRE_RESULTATS_OFFRE_STAGE_PAR_PAGE = 15;

export interface FiltreRechercheOffreStage {
	motCle?: string
	localisations: Array<string>
	domaines: Array<string>
	durees: Array<string>
	page: number
}

export interface ResultatsRechercheOffreStage {
	nombreDeResultats: number
	resultats: Array<OffreDeStageIndexée>
	facettes: {
		domaines: Array<Facette>
		durees: Array<Facette>
	}
}

export interface RechercheOffreStageRepository {
	rechercher(filtre: FiltreRechercheOffreStage): Promise<Either<ResultatsRechercheOffreStage>>
	rechercherLocalisations(saisie: string): Promise<Either<Array<string>>>
}
