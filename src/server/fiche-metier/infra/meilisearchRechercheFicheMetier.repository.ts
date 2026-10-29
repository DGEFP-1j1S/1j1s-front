import type { Meilisearch } from 'meilisearch';

import { createSuccess, Either } from '~/server/errors/either';
import {
	FicheMetierIndexee,
	FiltreRechercheFicheMetier,
	NOMBRE_RESULTATS_FICHE_METIER_PAR_PAGE,
	RechercheFicheMetierRepository,
	ResultatsRechercheFicheMetier,
} from '~/server/fiche-metier/domain/rechercheFicheMetier';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { rechercherAvecFacettesDisjonctives } from '~/server/services/meilisearch/rechercheIndexee';

const INDEX_FICHE_METIER = 'fiche-metier';
const ATTRIBUT_CENTRES_INTERET = 'centres_interet';

export class MeilisearchRechercheFicheMetierRepository implements RechercheFicheMetierRepository {
	constructor(
		private readonly client: Meilisearch,
		private readonly errorManagementService: ErrorManagementService,
	) {}

	async rechercher(filtre: FiltreRechercheFicheMetier): Promise<Either<ResultatsRechercheFicheMetier>> {
		try {
			const { facettes, nombreDeResultats, resultats } = await rechercherAvecFacettesDisjonctives<FicheMetierIndexee>(this.client, INDEX_FICHE_METIER, {
				facettes: [ATTRIBUT_CENTRES_INTERET],
				filtres: { [ATTRIBUT_CENTRES_INTERET]: filtre.centresInteret },
				motCle: filtre.motCle,
				nombreDeResultatsParPage: NOMBRE_RESULTATS_FICHE_METIER_PAR_PAGE,
				page: filtre.page,
			});

			return createSuccess({
				facettes: { centresInteret: facettes[ATTRIBUT_CENTRES_INTERET] },
				nombreDeResultats,
				resultats,
			});
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'Meilisearch',
				contexte: 'rechercher fiches métier',
				message: 'impossible d’effectuer une recherche de fiches métier',
			});
		}
	}
}
