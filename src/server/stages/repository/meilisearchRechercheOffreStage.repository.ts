import type { Meilisearch } from 'meilisearch';

import { OffreDeStageIndexée } from '~/client/components/features/OffreDeStage/OffreDeStageIndexee';
import { createSuccess, Either } from '~/server/errors/either';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import {
	rechercherAvecFacettesDisjonctives,
	rechercherValeursDeFacette,
} from '~/server/services/meilisearch/rechercheIndexee';
import {
	FiltreRechercheOffreStage,
	NOMBRE_RESULTATS_OFFRE_STAGE_PAR_PAGE,
	RechercheOffreStageRepository,
	ResultatsRechercheOffreStage,
} from '~/server/stages/domain/rechercheOffreStage';

const ATTRIBUT_LOCALISATION = 'localisationFiltree';
const ATTRIBUT_DOMAINES = 'domaines';
const ATTRIBUT_DUREE = 'dureeCategorisee';
const NOMBRE_MAXIMUM_DE_LOCALISATIONS = 20;

export class MeilisearchRechercheOffreStageRepository implements RechercheOffreStageRepository {
	constructor(
		private readonly client: Meilisearch,
		private readonly indexName: string,
		private readonly errorManagementService: ErrorManagementService,
	) {}

	async rechercher(filtre: FiltreRechercheOffreStage): Promise<Either<ResultatsRechercheOffreStage>> {
		try {
			const { facettes, nombreDeResultats, resultats } = await rechercherAvecFacettesDisjonctives<OffreDeStageIndexée>(this.client, this.indexName, {
				facettes: [ATTRIBUT_DOMAINES, ATTRIBUT_DUREE],
				filtres: {
					[ATTRIBUT_DOMAINES]: filtre.domaines,
					[ATTRIBUT_DUREE]: filtre.durees,
					[ATTRIBUT_LOCALISATION]: filtre.localisations,
				},
				motCle: filtre.motCle,
				nombreDeResultatsParPage: NOMBRE_RESULTATS_OFFRE_STAGE_PAR_PAGE,
				page: filtre.page,
			});

			return createSuccess({
				facettes: {
					domaines: facettes[ATTRIBUT_DOMAINES],
					durees: facettes[ATTRIBUT_DUREE],
				},
				nombreDeResultats,
				resultats,
			});
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'Meilisearch',
				contexte: 'rechercher offres de stage',
				message: 'impossible d’effectuer une recherche d’offres de stage',
			});
		}
	}

	async rechercherLocalisations(saisie: string): Promise<Either<Array<string>>> {
		try {
			return createSuccess(await rechercherValeursDeFacette(this.client, this.indexName, ATTRIBUT_LOCALISATION, saisie, NOMBRE_MAXIMUM_DE_LOCALISATIONS));
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'Meilisearch',
				contexte: 'rechercher localisations offres de stage',
				message: 'impossible d’effectuer une recherche de localisations d’offres de stage',
			});
		}
	}
}
