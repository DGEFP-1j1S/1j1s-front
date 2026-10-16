import { createSuccess, Either } from '~/server/errors/either';
import { JobEteFiltre } from '~/server/jobs-ete/domain/jobEte';
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
	FranceTravailParametreBuilderService,
} from '~/server/offres/infra/repositories/france-travail/franceTravailParametreBuilder.service';
import { CacheService } from '~/server/services/cache/cache.service';
import {
	ErrorManagementService,
	ErrorManagementWithErrorCheckingService,
} from '~/server/services/error/errorManagement.service';
import { AuthenticatedHttpClientService } from '~/server/services/http/authenticatedHttpClient.service';
import { removeUndefinedValueInQueryParameterList } from '~/server/services/utils/urlParams.util';

export class ApiFranceTravailJobEteRepository implements OffreRepository {

	constructor(
		private readonly httpClientServiceWithAuthentification: AuthenticatedHttpClientService,
		private readonly franceTravailParametreBuilderService: FranceTravailParametreBuilderService,
		private readonly cacheService: CacheService,
		private readonly apiFranceTravailOffreErrorManagementSearch: ErrorManagementService,
		private readonly apiFranceTravailOffreErrorManagementGet: ErrorManagementWithErrorCheckingService,
	) {
	}

	paramètreParDéfaut = 'typeContrat=SAI&dureeContratMax=2';
	private DUREE_VALIDITE_CACHE_HEURE = 24;
	private ECHANTILLON_OFFRE_JOB_ETE_KEY = 'ECHANTILLON_OFFRE_JOB_ETE_KEY';

	async get(id: OffreId): Promise<Either<Offre>> {
		try {
			const response = await this.httpClientServiceWithAuthentification.get<OffreResponse>(`/${id}`);
			if (this.apiFranceTravailOffreErrorManagementGet.isError(response)) {
				return this.apiFranceTravailOffreErrorManagementGet.handleFailureError(response, {
					apiSource: 'API France Travail',
					contexte: 'détail job d‘été', message: 'impossible de récupérer le détail d‘un job d‘été',
				});
			}
			return createSuccess(mapOffre(response.data));
		} catch (error) {
			return this.apiFranceTravailOffreErrorManagementGet.handleFailureError(error, {
				apiSource: 'API France Travail',
				contexte: 'détail job d‘été', message: 'impossible de récupérer le détail d‘un job d‘été',
			});
		}
	}

	async search(jobEteFiltre: JobEteFiltre): Promise<Either<RésultatsRechercheOffre>> {
		if (isOffreÉchantillonFiltre(jobEteFiltre)) return this.getEchantillonOffre();
		return this.getOffreJobEteRecherche(jobEteFiltre);
	}

	async buildJobEteParametresRecherche(jobEteFiltre: JobEteFiltre): Promise<string> {
		const queryList: Record<string, string> = {
			grandDomaine: jobEteFiltre.grandDomaineList?.join(',') || '',
		};

		removeUndefinedValueInQueryParameterList(queryList);

		const params = new URLSearchParams(queryList);

		return params.toString();
	}

	private async getOffreJobEteRecherche(jobEteFiltre: JobEteFiltre): Promise<Either<RésultatsRechercheOffre>> {
		const parametresRecherche = await this.franceTravailParametreBuilderService.buildCommonParamètresRecherche(jobEteFiltre);
		const jobEteParametresRecherche = await this.buildJobEteParametresRecherche(jobEteFiltre);
		try {
			const response = await this.httpClientServiceWithAuthentification.get<RésultatsRechercheOffreResponse>(
				`/search?${parametresRecherche}&${jobEteParametresRecherche}&${this.paramètreParDéfaut}`,
			);
			if (response.status === 204) {
				return createSuccess({ nombreRésultats: 0, résultats: [] });
			}
			return createSuccess(mapRésultatsRechercheOffre(response.data));
		} catch (error) {
			return this.apiFranceTravailOffreErrorManagementSearch.handleFailureError(error, {
				apiSource: 'API France Travail',
				contexte: 'recherche job d‘été', message: 'impossible d’effectuer une recherche de job d‘été',
			});
		}
	}

	private async getEchantillonOffre(): Promise<Either<RésultatsRechercheOffre>> {
		const responseInCache = await this.cacheService.get<RésultatsRechercheOffreResponse>(this.ECHANTILLON_OFFRE_JOB_ETE_KEY);
		const range = buildRangeParamètre({ page: 1 });

		if (responseInCache) {
			return createSuccess(mapRésultatsRechercheOffre(responseInCache));
		} else {
			try {
				const response = await this.httpClientServiceWithAuthentification.get<RésultatsRechercheOffreResponse>(
					`/search?range=${range}&${this.paramètreParDéfaut}`,
				);
				this.cacheService.set(this.ECHANTILLON_OFFRE_JOB_ETE_KEY, response.data, this.DUREE_VALIDITE_CACHE_HEURE);
				return createSuccess(mapRésultatsRechercheOffre(response.data));
			} catch (error) {
				return this.apiFranceTravailOffreErrorManagementSearch.handleFailureError(error, {
					apiSource: 'API France Travail',
					contexte: 'échantillon job d‘été',
					message: 'impossible d’effectuer une recherche de job d‘été',
				});
			}
		}
	}
}
