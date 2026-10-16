import { Mission, MissionEngagementRechercheBenevolat, MissionEngagementRechercheServiceCivique, RésultatsRechercheMission } from '~/server/engagement/domain/engagement';
import {
	anAmbassadeurDuDonDeVêtementMission,
	aRésultatRechercheMission,
} from '~/server/engagement/domain/missionEngagement.fixture';
import { ApiEngagementRepository } from '~/server/engagement/infra/repositories/apiEngagement.repository';
import {
	anAmbassadeurDuDonDeVêtementMissionResponse,
	aSearchMissionEngagementResponse,
} from '~/server/engagement/infra/repositories/apiEngagement.response.fixture';
import { createFailure, Failure, Success } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { aLogInformation, anErrorManagementService } from '~/server/services/error/errorManagement.fixture';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { anHttpError } from '~/server/services/http/httpError.fixture';
import { PublicHttpClientService } from '~/server/services/http/publicHttpClient.service';
import { anAxiosResponse, aPublicHttpClientService } from '~/server/services/http/publicHttpClient.service.fixture';

vi.mock('axios', () => {
	return {
		isAxiosError: vi.fn().mockReturnValue(true),
	};
});

describe('ApiEngagementRepository', () => {
	let httpClientService: PublicHttpClientService;
	let apiEngagementRepository: ApiEngagementRepository;
	let errorManagementService: ErrorManagementService;

	beforeEach(() => {
		httpClientService = aPublicHttpClientService();
		errorManagementService = anErrorManagementService();
		apiEngagementRepository = new ApiEngagementRepository(httpClientService, errorManagementService);
	});

	describe('searchMissionServiceCivique', () => {
		describe('quand l’api engagement répond avec une 200', () => {
			it('recherche les missions de service civique', async () => {
				vi.spyOn(httpClientService, 'get').mockResolvedValue(anAxiosResponse(aSearchMissionEngagementResponse()));
				const rechercheServiceCivique: MissionEngagementRechercheServiceCivique = {
					domaine: 'sante',
					localisation: {
						distance: 10,
						latitude: 2.3522,
						longitude: 48.8566,
					},
					ouvertAuxMineurs: true,
					page: 1,
				};

				const { result } = await apiEngagementRepository.searchMissionServiceCivique(rechercheServiceCivique) as Success<RésultatsRechercheMission>;
				expect(result).toEqual(aRésultatRechercheMission());
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/^mission\/search/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('domain=sante'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('from=0'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('publisher=5f99dbe75eb1ad767733b206'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('size=15'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('openToMinors=yes'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('distance=10km'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('lat=2.3522'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('lon=48.8566'));
			});
		});

		describe('quand l’api engagement répond avec une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const httpError = anHttpError(500);
				const errorReturnedByErrorManagementService = ErreurMetier.SERVICE_INDISPONIBLE;
				vi.spyOn(httpClientService, 'get').mockRejectedValue(httpError);
				vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));
				const rechercheServiceCivique: MissionEngagementRechercheServiceCivique = {
					domaine: 'sante',
					localisation: {
						distance: 10,
						latitude: 2.3522,
						longitude: 48.8566,
					},
					ouvertAuxMineurs: true,
					page: 1,
				};

				const { errorType } = await apiEngagementRepository.searchMissionServiceCivique(rechercheServiceCivique) as Failure;

				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/^mission\/search/));
				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, aLogInformation({
					apiSource: 'API Engagement',
					contexte: 'search mission d’engagement',
					message: 'impossible d’effectuer une recherche de mission d’engagement',
				}));
				expect(errorType).toEqual(errorReturnedByErrorManagementService);
			});
		});
	});

	describe('searchMissionBénévolat', () => {
		describe('quand l’api engagement répond avec une 200', () => {
			it('recherche les missions', async () => {
				vi.spyOn(httpClientService, 'get').mockResolvedValue(anAxiosResponse(aSearchMissionEngagementResponse()));
				const rechercheBénévolat: MissionEngagementRechercheBenevolat = {
					domaine: 'sante',
					localisation: {
						distance: 10,
						latitude: 2.3522,
						longitude: 48.8566,
					},
					ouvertAuxMineurs: true,
					page: 1,
				};

				const { result } = await apiEngagementRepository.searchMissionBénévolat(rechercheBénévolat) as Success<RésultatsRechercheMission>;
				expect(result).toEqual(aRésultatRechercheMission());
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/^mission\/search/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('domain=sante'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('from=0'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('publisher=5f5931496c7ea514150a818f'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('size=15'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('openToMinors=yes'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('distance=10km'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('lat=2.3522'));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringContaining('lon=48.8566'));
			});
		});

		describe('quand l’api engagement répond avec une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const httpError = anHttpError(500);
				const errorReturnedByErrorManagementService = ErreurMetier.SERVICE_INDISPONIBLE;
				vi.spyOn(httpClientService, 'get').mockRejectedValue(httpError);
				vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));
				const rechercheBénévolat: MissionEngagementRechercheBenevolat = {
					domaine: 'sante',
					localisation: {
						distance: 10,
						latitude: 2.3522,
						longitude: 48.8566,
					},
					ouvertAuxMineurs: true,
					page: 1,
				};

				const { errorType } = await apiEngagementRepository.searchMissionBénévolat(rechercheBénévolat) as Failure;

				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/^mission\/search/));
				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, aLogInformation({
					apiSource: 'API Engagement',
					contexte: 'search mission d’engagement',
					message: 'impossible d’effectuer une recherche de mission d’engagement',
				}));
				expect(errorType).toEqual(errorReturnedByErrorManagementService);
			});
		});
	});

	describe('getMissionEngagement', () => {
		const missionEngagementId = '62b14f22c075d0071ada2ce4';
		describe('quand l’api engagement répond avec une 200', () => {
			it('retourne la mission recherchée', async () => {
				vi.spyOn(httpClientService, 'get').mockResolvedValue(anAxiosResponse(anAmbassadeurDuDonDeVêtementMissionResponse()));


				const { result } = await apiEngagementRepository.getMissionEngagement(missionEngagementId) as Success<Mission>;

				expect(result).toEqual(anAmbassadeurDuDonDeVêtementMission());
				expect(httpClientService.get).toHaveBeenCalledWith('mission/62b14f22c075d0071ada2ce4');
			});
		});

		describe('quand l’id n’a pas le format d’un identifiant de mission (ObjectId)', () => {
			it('retourne une erreur de contenu indisponible sans appeler l’api engagement', async () => {
				vi.spyOn(httpClientService, 'get');
				const identifiantAuMauvaisFormat = 'b0d143f4-4b75-49be-bfab-cbf4d5443368';

				const { errorType } = await apiEngagementRepository.getMissionEngagement(identifiantAuMauvaisFormat) as Failure;

				expect(httpClientService.get).not.toHaveBeenCalled();
				expect(errorType).toEqual(ErreurMetier.CONTENU_INDISPONIBLE);
			});
		});

		describe('quand l’api engagement répond avec une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const httpError = anHttpError(500);
				const errorReturnedByErrorManagementService = ErreurMetier.SERVICE_INDISPONIBLE;
				vi.spyOn(httpClientService, 'get').mockRejectedValue(httpError);
				vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));

				const { errorType } = await apiEngagementRepository.getMissionEngagement(missionEngagementId) as Failure;

				expect(httpClientService.get).toHaveBeenCalledWith('mission/62b14f22c075d0071ada2ce4');
				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, aLogInformation({
					apiSource: 'API Engagement',
					contexte: 'get détail mission d’engagement',
					message: 'impossible de récupérer le détail d’une mission',
				}));
				expect(errorType).toEqual(errorReturnedByErrorManagementService);
			});
		});
	});
});
