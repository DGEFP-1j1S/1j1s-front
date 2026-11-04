import type { Meilisearch } from 'meilisearch';

import { createSuccess, Either } from '~/server/errors/either';
import {
	EvenementIndexe,
	FiltreRechercheEvenement,
	NOMBRE_RESULTATS_EVENEMENT_PAR_PAGE,
	RechercheEvenementRepository,
	ResultatsRechercheEvenement,
} from '~/server/evenements/domain/rechercheEvenement';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import {
	rechercherAvecFacettesDisjonctives,
	rechercherValeursDeFacette,
} from '~/server/services/meilisearch/rechercheIndexee';

const INDEX_EVENEMENT = 'evenement';
const ATTRIBUT_LIEU = 'lieu';
const NOMBRE_MAXIMUM_DE_LIEUX = 20;

export class MeilisearchRechercheEvenementRepository implements RechercheEvenementRepository {
	constructor(
		private readonly client: Meilisearch,
		private readonly errorManagementService: ErrorManagementService,
	) {}

	async rechercher(filtre: FiltreRechercheEvenement): Promise<Either<ResultatsRechercheEvenement>> {
		try {
			const { nombreDeResultats, resultats } = await rechercherAvecFacettesDisjonctives<EvenementIndexe>(this.client, INDEX_EVENEMENT, {
				facettes: [],
				filtres: { [ATTRIBUT_LIEU]: filtre.lieux },
				motCle: filtre.motCle,
				nombreDeResultatsParPage: NOMBRE_RESULTATS_EVENEMENT_PAR_PAGE,
				page: filtre.page,
			});
			return createSuccess({ nombreDeResultats, resultats });
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'Meilisearch',
				contexte: 'rechercher évènements',
				message: 'impossible d’effectuer une recherche d’évènements',
			});
		}
	}

	async rechercherLieux(saisie: string): Promise<Either<Array<string>>> {
		try {
			return createSuccess(await rechercherValeursDeFacette(this.client, INDEX_EVENEMENT, ATTRIBUT_LIEU, saisie, NOMBRE_MAXIMUM_DE_LIEUX));
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'Meilisearch',
				contexte: 'rechercher lieux évènements',
				message: 'impossible d’effectuer une recherche de lieux d’évènements',
			});
		}
	}
}
