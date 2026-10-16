import { EmploiFiltre } from '~/server/emplois/domain/emploi';
import { createSuccess, Either } from '~/server/errors/either';
import { isOffreÉchantillonFiltre, Offre, OffreId, RésultatsRechercheOffre } from '~/server/offres/domain/offre';
import { OffreRepository } from '~/server/offres/domain/offre.repository';
import {
	mapOffre,
	mapRésultatsRechercheOffre,
} from '~/server/offres/infra/repositories/france-travail/apiFranceTravail.mapper';
import {
	OffreResponse,
	RésultatsRechercheOffreResponse,
} from '~/server/offres/infra/repositories/france-travail/franceTravailOffre.response';
import {
	buildRangeParamètre,
	buildTempsDeTravailParamètre,
	FranceTravailParametreBuilderService,
} from '~/server/offres/infra/repositories/france-travail/franceTravailParametreBuilder.service';
import { CacheService } from '~/server/services/cache/cache.service';
import {
	ErrorManagementService,
	ErrorManagementWithErrorCheckingService,
} from '~/server/services/error/errorManagement.service';
import { AuthenticatedHttpClientService } from '~/server/services/http/authenticatedHttpClient.service';
import { removeUndefinedValueInQueryParameterList } from '~/server/services/utils/urlParams.util';

export const LONGUEUR_MINIMUM_DU_MOT_CLE_REQUISE_PAR_FRANCE_TRAVAIL = 2;

export class ApiFranceTravailOffreRepository implements OffreRepository {
	constructor(
		private readonly httpClientServiceWithAuthentification: AuthenticatedHttpClientService,
		private readonly franceTravailParametreBuilderService: FranceTravailParametreBuilderService,
		private readonly cacheService: CacheService,
		private readonly apiFranceTravailOffreErrorManagementSearch: ErrorManagementService,
		private readonly apiFranceTravailOffreErrorManagementGet: ErrorManagementWithErrorCheckingService,
	) {
	}

	paramètreParDéfaut = 'natureContrat=E1,FA,FJ,FT,FU,I1,NS,FV,FW,FX,FY,PS,CC,CU,EE,ER,CI';

	private ECHANTILLON_OFFRE_EMPLOI_KEY = 'ECHANTILLON_OFFRE_EMPLOI_KEY';

	async get(id: OffreId): Promise<Either<Offre>> {
		try {
			const response = await this.httpClientServiceWithAuthentification.get<OffreResponse>(`/${id}`);
			if (this.apiFranceTravailOffreErrorManagementGet.isError(response)) {
				return this.apiFranceTravailOffreErrorManagementGet.handleFailureError(response, {
					apiSource: 'API France Travail',
					contexte: 'détail offre emploi', message: 'impossible de récupérer le détail d’une offre d’emploi',
				});
			}
			return createSuccess(mapOffre(response.data));
		} catch (error) {
			return this.apiFranceTravailOffreErrorManagementGet.handleFailureError(error, {
				apiSource: 'API France Travail',
				contexte: 'détail offre emploi', message: 'impossible de récupérer le détail d’une offre d’emploi',
			});
		}
	}

	async search(emploiFiltre: EmploiFiltre): Promise<Either<RésultatsRechercheOffre>> {
		if (isOffreÉchantillonFiltre(emploiFiltre)) return this.getÉchantillonOffreEmploi(emploiFiltre);
		return this.getOffreEmploiRecherche(emploiFiltre);
	}

	async buildEmploiParamètresRecherche(emploiFiltre: EmploiFiltre): Promise<string | undefined> {
		const queryList: Record<string, string> = {
			experienceExigence: emploiFiltre.experienceExigence || '',
			grandDomaine: emploiFiltre.grandDomaineList?.join(',') || '',
			tempsPlein: buildTempsDeTravailParamètre(emploiFiltre),
			typeContrat: emploiFiltre.typeDeContratList?.join(',') || '',
		};

		removeUndefinedValueInQueryParameterList(queryList);

		const params = new URLSearchParams(queryList);

		return params.toString();
	}

	private async getOffreEmploiRecherche(emploiFiltre: EmploiFiltre) {
		const paramètresRecherche = await this.franceTravailParametreBuilderService.buildCommonParamètresRecherche(emploiFiltre);
		const emploiParamètresRecherche = await this.buildEmploiParamètresRecherche(emploiFiltre);
		try {
			const response = await this.httpClientServiceWithAuthentification.get<RésultatsRechercheOffreResponse>(
				`/search?${emploiParamètresRecherche}&${paramètresRecherche}`,
			);
			if (response.status === 204) {
				return createSuccess({ nombreRésultats: 0, résultats: [] });
			}
			return createSuccess(mapRésultatsRechercheOffre(response.data));
		} catch (error) {
			return this.apiFranceTravailOffreErrorManagementSearch.handleFailureError(error, {
				apiSource: 'API France Travail',
				contexte: 'recherche offre emploi', message: 'impossible d’effectuer une recherche d’offre d’emploi',
			});
		}
	}

	private async getÉchantillonOffreEmploi(emploiFiltre: EmploiFiltre) {
		const responseInCache = await this.cacheService.get<RésultatsRechercheOffreResponse>(this.ECHANTILLON_OFFRE_EMPLOI_KEY);
		const range = buildRangeParamètre(emploiFiltre);

		if (responseInCache) {
			return createSuccess(mapRésultatsRechercheOffre(responseInCache));
		} else {
			try {
				const response = await this.httpClientServiceWithAuthentification.get<RésultatsRechercheOffreResponse>(`/search?range=${range}&${this.paramètreParDéfaut}`);
				const offres = createSuccess(mapRésultatsRechercheOffre(response.data));
				this.cacheService.set(this.ECHANTILLON_OFFRE_EMPLOI_KEY, response.data, 24);
				return offres;
			} catch (error) {
				return this.apiFranceTravailOffreErrorManagementSearch.handleFailureError(error, {
					apiSource: 'API France Travail',
					contexte: 'échantillon offre emploi', message: 'impossible d’effectuer une recherche d’offre d’emploi',
				});
			}
		}
	}
}
