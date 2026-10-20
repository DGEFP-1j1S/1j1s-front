import { ApiFranceTravailOffreRepository } from '~/server/emplois/infra/repositories/apiFranceTravailOffre.repository';
import { createFailure, Failure, Success } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { Offre, ResultatsRechercheOffre } from '~/server/offres/domain/offre';
import {
	anOffreÉchantillonAvecLocalisationEtMotCléFiltre,
	anOffreÉchantillonFiltre,
	anOffreEmploi,
	anOffreEmploiFiltre,
	aRésultatsRechercheOffre,
} from '~/server/offres/domain/offre.fixture';
import {
	aBarmanOffreEmploiApiResponse,
	aRésultatsRechercheOffreEmploiApiResponse,
} from '~/server/offres/infra/repositories/france-travail/franceTravailOffre.response.fixture';
import {
	FranceTravailParametreBuilderService,
} from '~/server/offres/infra/repositories/france-travail/franceTravailParametreBuilder.service';
import {
	aFranceTravailParametreBuilderService,
} from '~/server/offres/infra/repositories/france-travail/franceTravailParametreBuilder.service.fixture';
import { CacheService } from '~/server/services/cache/cache.service';
import { NullCacheService } from '~/server/services/cache/nullCache.service';
import {
	anErrorManagementService,
	anErrorManagementWithErrorCheckingService,
} from '~/server/services/error/errorManagement.fixture';
import {
	ErrorManagementService,
	ErrorManagementWithErrorCheckingService,
} from '~/server/services/error/errorManagement.service';
import { AuthenticatedHttpClientService } from '~/server/services/http/authenticatedHttpClient.service';
import { anHttpError } from '~/server/services/http/httpError.fixture';
import {
	anAuthenticatedHttpClientService,
	anAxiosResponse,
} from '~/server/services/http/publicHttpClient.service.fixture';

describe('ApiFranceTravailOffreRepository', () => {
	let httpClientServiceWithAuthentification: AuthenticatedHttpClientService;
	let apiFranceTravailOffreRepository: ApiFranceTravailOffreRepository;
	let franceTravailParametreBuilderService: FranceTravailParametreBuilderService;
	let cacheService: CacheService;
	let apiFranceTravailErrorManagementSearch: ErrorManagementService;
	let apiFranceTravailErrorManagementGet: ErrorManagementWithErrorCheckingService;

	beforeEach(() => {
		cacheService = new NullCacheService();
		httpClientServiceWithAuthentification = anAuthenticatedHttpClientService();
		franceTravailParametreBuilderService = aFranceTravailParametreBuilderService();
		apiFranceTravailErrorManagementSearch = anErrorManagementService();
		apiFranceTravailErrorManagementGet = anErrorManagementWithErrorCheckingService();
		apiFranceTravailOffreRepository = new ApiFranceTravailOffreRepository(httpClientServiceWithAuthentification, franceTravailParametreBuilderService, cacheService, apiFranceTravailErrorManagementSearch, apiFranceTravailErrorManagementGet);
	});

	describe('getOffreEmploi', () => {
		describe('quand l’offre d’emploi est trouvé', () => {
			it('récupère l’offre d’emploi selon l’id', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse(aBarmanOffreEmploiApiResponse()));
				const expected = anOffreEmploi();
				const offreEmploiId = expected.id;

				const { result } = await apiFranceTravailOffreRepository.get(offreEmploiId) as Success<Offre>;

				expect(result).toEqual(expected);
				expect(httpClientServiceWithAuthentification.get).toHaveBeenCalledWith(
					'/132LKFB',
				);
			});
		});
		describe('lorsqu‘il y a une erreur', () => {
			it('retourne une erreur', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const httpError = anAxiosResponse(anHttpError(404));
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockRejectedValue(httpError);
				vi.spyOn(apiFranceTravailErrorManagementGet, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));

				const result = await apiFranceTravailOffreRepository.get(anOffreEmploi().id);

				expect(apiFranceTravailErrorManagementGet.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API France Travail',
					contexte: 'détail offre emploi', message: 'impossible de récupérer le détail d’une offre d’emploi',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});
		describe('lorsque l‘api nous renvoie une 204', () => {
			it('retourne une erreur', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const apiResponse = anAxiosResponse(aBarmanOffreEmploiApiResponse(), 204);
				vi.spyOn(httpClientServiceWithAuthentification, 'get').mockResolvedValue(apiResponse);
				vi.spyOn(apiFranceTravailErrorManagementGet, 'isError').mockReturnValue(true);
				vi.spyOn(apiFranceTravailErrorManagementGet, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));

				const result = await apiFranceTravailOffreRepository.get(anOffreEmploi().id);

				expect(apiFranceTravailErrorManagementGet.handleFailureError).toHaveBeenCalledWith(apiResponse, {
					apiSource: 'API France Travail',
					contexte: 'détail offre emploi', message: 'impossible de récupérer le détail d’une offre d’emploi',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});
	});

	describe('search', () => {
		describe('quand la recherche est lancée automatiquement pour les offres d‘emplois', () => {
			describe('quand les informations ne sont pas encore mis en cache', () => {
				it('fait l‘appel à l‘api et set les informations dans le cache', async () => {
					vi
						.spyOn(httpClientServiceWithAuthentification, 'get')
						.mockResolvedValue(anAxiosResponse(aRésultatsRechercheOffreEmploiApiResponse()));

					vi
						.spyOn(franceTravailParametreBuilderService, 'buildCommonParamètresRecherche')
						.mockResolvedValue('range=0-14');

					vi.spyOn(cacheService, 'get').mockResolvedValue(null);
					vi.spyOn(cacheService, 'set');

					const offreFiltre = anOffreÉchantillonFiltre();

					const { result } = await apiFranceTravailOffreRepository.search(offreFiltre) as Success<ResultatsRechercheOffre>;

					expect(cacheService.get).toHaveBeenCalledWith('ECHANTILLON_OFFRE_EMPLOI_KEY');

					expect(result).toEqual(aRésultatsRechercheOffre());
					expect(httpClientServiceWithAuthentification.get).toHaveBeenCalledWith(
						'/search?range=0-14&natureContrat=E1,FA,FJ,FT,FU,I1,NS,FV,FW,FX,FY,PS,CC,CU,EE,ER,CI',
					);

					expect(cacheService.set).toHaveBeenCalledWith('ECHANTILLON_OFFRE_EMPLOI_KEY', aRésultatsRechercheOffreEmploiApiResponse(), 24);
				});
				it('ne set pas les informations dans le cache si une erreur se produit', async () => {
					vi
						.spyOn(httpClientServiceWithAuthentification, 'get')
						.mockResolvedValue(anAxiosResponse('payload invalide'));

					vi
						.spyOn(franceTravailParametreBuilderService, 'buildCommonParamètresRecherche')
						.mockResolvedValue('range=0-14');

					vi.spyOn(cacheService, 'get').mockResolvedValue(null);
					vi.spyOn(cacheService, 'set');

					const offreFiltre = anOffreÉchantillonFiltre();

					await apiFranceTravailOffreRepository.search(offreFiltre);

					expect(cacheService.set).not.toHaveBeenCalled();
				});
			});

			describe('quand les informations sont déjà en cache', () => {
				it('ne fait pas l‘appel à l‘api et get les informations du cache', async () => {
					vi.spyOn(cacheService, 'get').mockResolvedValue(aRésultatsRechercheOffreEmploiApiResponse());
					vi.spyOn(cacheService, 'set');

					const offreFiltre = anOffreÉchantillonFiltre();

					const { result } = await apiFranceTravailOffreRepository.search(offreFiltre) as Success<ResultatsRechercheOffre>;

					expect(cacheService.get).toHaveBeenCalledWith('ECHANTILLON_OFFRE_EMPLOI_KEY');

					expect(result).toEqual(aRésultatsRechercheOffre());
					expect(httpClientServiceWithAuthentification.get).not.toHaveBeenCalled();

					expect(cacheService.set).not.toHaveBeenCalled();
				});

			});
		});

		describe('quand la recherche est lancée par l‘utilisateur', () => {
			it('ne get pas les informations du cache et fait appel à l‘api avec les filtres', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse(aRésultatsRechercheOffreEmploiApiResponse()));

				vi.spyOn(cacheService, 'get').mockResolvedValue(aRésultatsRechercheOffreEmploiApiResponse());
				vi.spyOn(cacheService, 'set');

				const offreFiltre = anOffreEmploiFiltre();

				const { result } = await apiFranceTravailOffreRepository.search(offreFiltre) as Success<ResultatsRechercheOffre>;

				expect(cacheService.get).not.toHaveBeenCalled();

				expect(result).toEqual(aRésultatsRechercheOffre());
				expect(httpClientServiceWithAuthentification.get).toHaveBeenCalled();

				expect(cacheService.set).not.toHaveBeenCalled();
			});
		});

		describe('quand nombre de résultat est présent dans la réponse', () => {
			it('recherche les offres d’emploi de France Travail', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse(aRésultatsRechercheOffreEmploiApiResponse()));
				vi
					.spyOn(franceTravailParametreBuilderService, 'buildCommonParamètresRecherche')
					.mockResolvedValue('region=34&motsCles=boulanger&range=0-14');
				const offreEmploiFiltre = anOffreEmploiFiltre();

				const { result } = await apiFranceTravailOffreRepository.search(offreEmploiFiltre) as Success<ResultatsRechercheOffre>;

				expect(result).toEqual(aRésultatsRechercheOffre());
				expect(httpClientServiceWithAuthentification.get).toHaveBeenCalledWith(
					'/search?typeContrat=CDD%2CCDI&region=34&motsCles=boulanger&range=0-14',
				);
			});
		});

		describe('quand l’api renvoie une 204', () => {
			it('retourne un success avec une liste vide', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse({}, 204));

				const { result } = await apiFranceTravailOffreRepository.search(anOffreÉchantillonAvecLocalisationEtMotCléFiltre()) as Success<ResultatsRechercheOffre>;

				expect(result).toEqual({ nombreRésultats: 0, résultats: [] });
			});
		});

		describe('quand l‘api nous renvoie une erreur', () => {
			it('retourne une erreur', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const httpError = anAxiosResponse(anHttpError(404));
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockRejectedValue(httpError);
				vi.spyOn(apiFranceTravailErrorManagementSearch, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));

				const result = await apiFranceTravailOffreRepository.search(anOffreÉchantillonAvecLocalisationEtMotCléFiltre());

				expect(apiFranceTravailErrorManagementSearch.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API France Travail',
					contexte: 'recherche offre emploi', message: 'impossible d’effectuer une recherche d’offre d’emploi',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});

		describe('quand le cache nous renvoie rien et que l‘api nous renvoie une erreur', () => {
			it('retourne une erreur', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const httpError = anAxiosResponse(anHttpError(404));
				vi.spyOn(apiFranceTravailErrorManagementSearch, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));
				vi.spyOn(cacheService, 'get').mockResolvedValue(null);
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockRejectedValue(httpError);

				const offreFiltre = anOffreÉchantillonFiltre();

				const result = await apiFranceTravailOffreRepository.search(offreFiltre);

				expect(apiFranceTravailErrorManagementSearch.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API France Travail',
					contexte: 'échantillon offre emploi', message: 'impossible d’effectuer une recherche d’offre d’emploi',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});
	});
});
