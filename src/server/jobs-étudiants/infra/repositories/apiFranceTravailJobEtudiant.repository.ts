import { createSuccess, Either } from '~/server/errors/either';
import { JobÉtudiantFiltre } from '~/server/jobs-étudiants/domain/jobÉtudiant';
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

export class ApiFranceTravailJobEtudiantRepository implements OffreRepository {

	constructor(
    private httpClientServiceWithAuthentification: AuthenticatedHttpClientService,
    private franceTravailParametreBuilderService: FranceTravailParametreBuilderService,
    private cacheService: CacheService,
		private readonly apiFranceTravailOffreErrorManagementSearch: ErrorManagementService,
		private readonly apiFranceTravailOffreErrorManagementGet: ErrorManagementWithErrorCheckingService,
	) {}

	paramètreParDéfaut = 'dureeHebdoMax=1600&tempsPlein=false&typeContrat=CDD,MIS,SAI';

	private ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY = 'ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY';

	async get(id: OffreId): Promise<Either<Offre>> {
		try {
			const response = await this.httpClientServiceWithAuthentification.get<OffreResponse>(`/${id}`);
			if (this.apiFranceTravailOffreErrorManagementGet.isError(response)) {
				return this.apiFranceTravailOffreErrorManagementGet.handleFailureError(response, {
					apiSource: 'API France Travail',
					contexte: 'détail job étudiant', message: 'impossible de récupérer le détail d‘un job étudiant',
				});
			}
			return createSuccess(mapOffre(response.data));
		} catch (error) {
			return this.apiFranceTravailOffreErrorManagementGet.handleFailureError(error, {
				apiSource: 'API France Travail',
				contexte: 'détail job étudiant', message: 'impossible de récupérer le détail d‘un job étudiant',
			});
		}
	}

	async search(jobÉtudiantFiltre: JobÉtudiantFiltre): Promise<Either<RésultatsRechercheOffre>> {
		if (isOffreÉchantillonFiltre(jobÉtudiantFiltre)) return this.getÉchantillonJobÉtudiant(jobÉtudiantFiltre);
		return this.getOffreJobÉtudiantRecherche(jobÉtudiantFiltre);
	}

	async buildJobÉtudiantParamètresRecherche(jobÉtudiantFiltre: JobÉtudiantFiltre): Promise<string | undefined> {
		const queryList: Record<string, string> = {
			grandDomaine: jobÉtudiantFiltre.grandDomaineList?.join(',') || '',
		};

		removeUndefinedValueInQueryParameterList(queryList);

		const params = new URLSearchParams(queryList);

		return params.toString();
	}

	private async getOffreJobÉtudiantRecherche(jobÉtudiantFiltre: JobÉtudiantFiltre) {
		const paramètresRecherche = await this.franceTravailParametreBuilderService.buildCommonParamètresRecherche(jobÉtudiantFiltre);
		const jobÉtudiantParamètresRecherche = await this.buildJobÉtudiantParamètresRecherche(jobÉtudiantFiltre);
		try {
			const response = await this.httpClientServiceWithAuthentification.get<RésultatsRechercheOffreResponse>(
				`/search?${paramètresRecherche}&${jobÉtudiantParamètresRecherche}&${this.paramètreParDéfaut}`,
			);
			if (response.status === 204) {
				return createSuccess({ nombreRésultats: 0, résultats: [] });
			}
			return createSuccess(mapRésultatsRechercheOffre(response.data));
		} catch (error) {
			return this.apiFranceTravailOffreErrorManagementSearch.handleFailureError(error, {
				apiSource: 'API France Travail',
				contexte: 'recherche job étudiant', message: 'impossible d’effectuer une recherche de job étudiant',
			});
		}
	}

	private async getÉchantillonJobÉtudiant(jobÉtudiantFiltre: JobÉtudiantFiltre) {
		const responseInCache = await this.cacheService.get<RésultatsRechercheOffreResponse>(this.ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY);
		const range = buildRangeParamètre(jobÉtudiantFiltre);

		if (responseInCache) {
			return createSuccess(mapRésultatsRechercheOffre(responseInCache));
		} else {
			try {
				const response = await this.httpClientServiceWithAuthentification.get<RésultatsRechercheOffreResponse>(
					`/search?range=${range}&${this.paramètreParDéfaut}`,
				);
				const resultat = createSuccess(mapRésultatsRechercheOffre(response.data));
				this.cacheService.set(this.ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY, response.data, 24);
				return resultat;
			} catch (error) {
				return this.apiFranceTravailOffreErrorManagementSearch.handleFailureError(error, {
					apiSource: 'API France Travail',
					contexte: 'échantillon job étudiant',
					message: 'impossible d’effectuer une recherche de job étudiant',
				});
			}
		}
	}
}
