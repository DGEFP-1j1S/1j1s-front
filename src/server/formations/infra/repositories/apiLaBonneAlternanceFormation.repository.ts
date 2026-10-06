import Joi from 'joi';

import { createSuccess, Either, isSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { Formation, FormationFiltre, ResultatRechercheFormation } from '~/server/formations/domain/formation';
import { FormationRepository } from '~/server/formations/domain/formation.repository';
import {
	ApiAlternanceFormationRechercheResponse,
	ApiAlternanceFormationResponse,
	apiAlternanceFormationValidationSchemas,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation';
import {
	mapFormation,
	mapResultatRechercheFormation,
	mapResultatRechercheFormationToFormation,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.mapper';
import {
	mapFiltreToQueryParams,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormationFiltre.mapper';
import { validateApiResponse } from '~/server/services/error/apiResponseValidator';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { AuthenticatedHttpClientService } from '~/server/services/http/authenticatedHttpClient.service';
import { PublicHttpClientService } from '~/server/services/http/publicHttpClient.service';

const DEMANDE_RENDEZ_VOUS_REFERRER = 'jeune_1_solution';

// NOTE (JUFE 05-10-2026): La Bonne Alternance a supprimé ses routes /v1/formations, les formations viennent désormais de
// l’API Alternance. Seule la prise de rendez-vous reste chez La Bonne Alternance, d’où les deux clients http.
export class ApiAlternanceFormationRepository implements FormationRepository {
	constructor(
		private readonly apiAlternanceHttpClientService: AuthenticatedHttpClientService,
		private readonly laBonneAlternanceHttpClientService: PublicHttpClientService,
		private readonly errorManagementService: ErrorManagementService,
	) {
	}

	async search(filtre: FormationFiltre): Promise<Either<Array<ResultatRechercheFormation>>> {
		try {
			const response = await this.apiAlternanceHttpClientService.get<ApiAlternanceFormationRechercheResponse>(`/formation/v1/search?${mapFiltreToQueryParams(filtre)}`);
			this.logErreurDeValidation(response.data, apiAlternanceFormationValidationSchemas.search, 'search formation api alternance');
			return createSuccess(mapResultatRechercheFormation(response.data));
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'API Alternance',
				contexte: 'search formation api alternance',
				message: 'impossible d’effectuer une recherche de formation',
			});
		}
	}

	async get(id: string, filtreRecherchePourRetrouverLaFormation?: FormationFiltre): Promise<Either<Formation>> {
		try {
			const response = await this.apiAlternanceHttpClientService.get<ApiAlternanceFormationResponse>(`/formation/v1/${encodeURIComponent(id)}`);
			this.logErreurDeValidation(response.data, apiAlternanceFormationValidationSchemas.get, 'search formation api alternance');
			const formation = mapFormation(response.data);
			formation.lienDemandeRendezVous = await this.getFormationLienRendezVous(id);
			return createSuccess(formation);
		} catch (error) {
			if (filtreRecherchePourRetrouverLaFormation) {
				return await this.getFormationFromResultatsRecherche(filtreRecherchePourRetrouverLaFormation, id);
			}
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'API Alternance',
				contexte: 'get formation api alternance',
				message: 'impossible de récupérer le détail d’une formation',
			});
		}
	}

	private async getFormationFromResultatsRecherche(filtre: FormationFiltre, id: string): Promise<Either<Formation>> {
		const searchResultOrError = await this.search(filtre);
		if (isSuccess(searchResultOrError)) {
			const resultatRechercheFormation = searchResultOrError.result.find((formation) => formation.id === id);
			if (resultatRechercheFormation) {
				const formation = mapResultatRechercheFormationToFormation(resultatRechercheFormation);
				formation.lienDemandeRendezVous = await this.getFormationLienRendezVous(id);
				return createSuccess(formation);
			}
			return this.errorManagementService.handleFailureError(ErreurMetier.DEMANDE_INCORRECTE, {
				apiSource: 'API Alternance',
				contexte: 'get formation api alternance',
				message: 'impossible de récupérer le détail d’une formation en effectuant de nouveau la recherche',
			});
		}
		return searchResultOrError;
	}

	private async getFormationLienRendezVous(cleMinistereEducatif: string): Promise<string | undefined> {
		try {
			const response = await this.laBonneAlternanceHttpClientService.post<{ idCleMinistereEducatif: string, referrer: string }, {
				form_url: string
			}>(
				'/appointment-request/context/create',
				{
					idCleMinistereEducatif: cleMinistereEducatif,
					referrer: DEMANDE_RENDEZ_VOUS_REFERRER,
				},
			);
			return response.data.form_url;
		} catch (error) {
			this.errorManagementService.handleFailureError(error, {
				apiSource: 'API LaBonneAlternance',
				contexte: 'get formation api alternance',
				message: 'impossible de créer le lien de demande de rdv pour une formation',
			});
			return undefined;
		}
	}

	private logErreurDeValidation(response: unknown, schema: Joi.Schema, contexte: string): void {
		const apiValidationError = validateApiResponse(response, schema);
		if (apiValidationError) {
			this.errorManagementService.logValidationError(apiValidationError, {
				apiSource: 'API Alternance',
				contexte,
				message: 'erreur de validation du schéma de l’api',
			});
		}
	}
}
