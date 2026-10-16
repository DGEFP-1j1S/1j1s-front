import { createFailure, Failure, Success } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import {
	ApiFranceTravailJobEtudiantRepository,
} from '~/server/jobs-étudiants/infra/repositories/apiFranceTravailJobEtudiant.repository';
import { Offre, RésultatsRechercheOffre } from '~/server/offres/domain/offre';
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

describe('ApiFranceTravailJobEtudiantRepository', () => {
	let httpClientServiceWithAuthentification: AuthenticatedHttpClientService;
	let apiFranceTravailJobEtudiantRepository: ApiFranceTravailJobEtudiantRepository;
	let franceTravailParametreBuilderService: FranceTravailParametreBuilderService;
	let cacheService: CacheService;
	let apiFranceTravailOffreErrorManagementSearch: ErrorManagementService;
	let apiFranceTravailOffreErrorManagementGet: ErrorManagementWithErrorCheckingService;

	beforeEach(() => {
		cacheService = new NullCacheService();
		httpClientServiceWithAuthentification = anAuthenticatedHttpClientService();
		franceTravailParametreBuilderService = aFranceTravailParametreBuilderService();
		apiFranceTravailOffreErrorManagementSearch = anErrorManagementService();
		apiFranceTravailOffreErrorManagementGet = anErrorManagementWithErrorCheckingService();
		apiFranceTravailJobEtudiantRepository = new ApiFranceTravailJobEtudiantRepository(httpClientServiceWithAuthentification, franceTravailParametreBuilderService, cacheService, apiFranceTravailOffreErrorManagementSearch, apiFranceTravailOffreErrorManagementGet);
	});

	describe('getOffreJobÉtudiant', () => {
		describe('quand l’offre de job étudiant est trouvé', () => {
			it('récupère l’offre de job étudiant selon l’id', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse(aBarmanOffreEmploiApiResponse()));
				const expected = anOffreEmploi();
				const offreEmploiId = expected.id;

				const { result } = await apiFranceTravailJobEtudiantRepository.get(offreEmploiId) as Success<Offre>;

				expect(result).toEqual(expected);
				expect(httpClientServiceWithAuthentification.get).toHaveBeenCalledWith('/132LKFB');
			});
		});
		describe('lorsqu‘il y a une erreur lors de la récupération de l‘offre', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const httpError = anAxiosResponse(anHttpError(404));
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockRejectedValue(httpError);
				vi.spyOn(apiFranceTravailOffreErrorManagementGet, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));

				const result = await apiFranceTravailJobEtudiantRepository.get(anOffreEmploi().id);

				expect(apiFranceTravailOffreErrorManagementGet.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API France Travail',
					contexte: 'détail job étudiant', message: 'impossible de récupérer le détail d‘un job étudiant',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});
		describe('lorsque l‘api nous renvoie une 204', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const apiResponse = anAxiosResponse(aBarmanOffreEmploiApiResponse(), 204);
				vi.spyOn(httpClientServiceWithAuthentification, 'get').mockResolvedValue(apiResponse);
				vi.spyOn(apiFranceTravailOffreErrorManagementGet, 'isError').mockReturnValue(true);
				vi.spyOn(apiFranceTravailOffreErrorManagementGet, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));

				const result = await apiFranceTravailJobEtudiantRepository.get(anOffreEmploi().id);

				expect(apiFranceTravailOffreErrorManagementGet.handleFailureError).toHaveBeenCalledWith(apiResponse, {
					apiSource: 'API France Travail',
					contexte: 'détail job étudiant', message: 'impossible de récupérer le détail d‘un job étudiant',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});

	});

	describe('search', () => {
		describe('quand la recherche est lancée automatiquement pour les job étudiants', () => {
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

					const { result } = await apiFranceTravailJobEtudiantRepository.search(offreFiltre) as Success<RésultatsRechercheOffre>;

					expect(cacheService.get).toHaveBeenCalledWith('ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY');

					expect(result).toEqual(aRésultatsRechercheOffre());
					expect(httpClientServiceWithAuthentification.get).toHaveBeenCalledWith('/search?range=0-14&dureeHebdoMax=1600&tempsPlein=false&typeContrat=CDD,MIS,SAI');

					expect(cacheService.set).toHaveBeenCalledWith('ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY', aRésultatsRechercheOffreEmploiApiResponse(), 24);
				});
			});

			describe('quand les informations sont déjà en cache', () => {
				it('ne fait pas l‘appel à l‘api et get les informations du cache', async () => {
					vi.spyOn(cacheService, 'get').mockResolvedValue(aRésultatsRechercheOffreEmploiApiResponse());
					vi.spyOn(cacheService, 'set');

					const offreFiltre = anOffreÉchantillonFiltre();

					const { result } = await apiFranceTravailJobEtudiantRepository.search(offreFiltre) as Success<RésultatsRechercheOffre>;

					expect(cacheService.get).toHaveBeenCalledWith('ECHANTILLON_OFFRE_JOB_ETUDIANT_KEY');

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

				const { result } = await apiFranceTravailJobEtudiantRepository.search(offreFiltre) as Success<RésultatsRechercheOffre>;

				expect(cacheService.get).not.toHaveBeenCalled();

				expect(result).toEqual(aRésultatsRechercheOffre());
				expect(httpClientServiceWithAuthentification.get).toHaveBeenCalled();

				expect(cacheService.set).not.toHaveBeenCalled();
			});
		});

		describe('quand nombre de résultat est présent dans la réponse', () => {
			it('recherche les jobs étudiants de France Travail', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse(aRésultatsRechercheOffreEmploiApiResponse()));
				vi
					.spyOn(franceTravailParametreBuilderService, 'buildCommonParamètresRecherche')
					.mockResolvedValue('region=34&motsCles=boulanger&range=0-14');
				const offreEmploiFiltre = anOffreEmploiFiltre();

				const { result } = await apiFranceTravailJobEtudiantRepository.search(offreEmploiFiltre) as Success<RésultatsRechercheOffre>;

				expect(result).toEqual(aRésultatsRechercheOffre());
				expect(httpClientServiceWithAuthentification.get).toHaveBeenCalledWith(
					'/search?region=34&motsCles=boulanger&range=0-14&&dureeHebdoMax=1600&tempsPlein=false&typeContrat=CDD,MIS,SAI',
				);
			});
		});

		describe('quand l’api renvoie une 204', () => {
			it('retourne un success avec une liste vide', async () => {
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockResolvedValue(anAxiosResponse({}, 204));

				const { result } = await apiFranceTravailJobEtudiantRepository.search(anOffreÉchantillonAvecLocalisationEtMotCléFiltre()) as Success<RésultatsRechercheOffre>;

				expect(result).toEqual({ nombreRésultats: 0, résultats: [] });
			});
		});

		describe('quand l‘api nous renvoie une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const httpError = anAxiosResponse(anHttpError(404));
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockRejectedValue(httpError);
				vi.spyOn(apiFranceTravailOffreErrorManagementSearch, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));

				const result = await apiFranceTravailJobEtudiantRepository.search(anOffreÉchantillonAvecLocalisationEtMotCléFiltre());

				expect(apiFranceTravailOffreErrorManagementSearch.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API France Travail',
					contexte: 'recherche job étudiant',
					message: 'impossible d’effectuer une recherche de job étudiant',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});

		describe('quand le cache nous renvoie rien et que l‘api nous renvoie une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const expectedFailure = ErreurMetier.CONTENU_INDISPONIBLE;
				const httpError = anAxiosResponse(anHttpError(404));
				vi.spyOn(apiFranceTravailOffreErrorManagementSearch, 'handleFailureError').mockReturnValue(createFailure(expectedFailure));
				vi.spyOn(cacheService, 'get').mockResolvedValue(null);
				vi
					.spyOn(httpClientServiceWithAuthentification, 'get')
					.mockRejectedValue(httpError);

				const offreFiltre = anOffreÉchantillonFiltre();

				const result = await apiFranceTravailJobEtudiantRepository.search(offreFiltre);

				expect(apiFranceTravailOffreErrorManagementSearch.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API France Travail',
					contexte: 'échantillon job étudiant',
					message: 'impossible d’effectuer une recherche de job étudiant',
				});
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(expectedFailure);
			});
		});
	});
});
