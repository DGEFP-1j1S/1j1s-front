import { createFailure, createSuccess, Failure } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { Formation } from '~/server/formations/domain/formation';
import { aFormation } from '~/server/formations/domain/formation.fixture';
import {
	aFormationQuery,
	aFormationQueryWithNiveauEtudes,
	anApiAlternanceFormationDetailResponse,
	anApiAlternanceResultatRechercheFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';
import {
	ApiAlternanceFormationRepository,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.repository';
import { aLogInformation, anErrorManagementService } from '~/server/services/error/errorManagement.fixture';
import { anHttpError } from '~/server/services/http/httpError.fixture';
import {
	anAuthenticatedHttpClientService,
	anAxiosResponse,
	aPublicHttpClientService,
} from '~/server/services/http/publicHttpClient.service.fixture';

const DEMANDE_RENDEZ_VOUS_REFERRER = 'jeune_1_solution';
const CLE_MINISTERE_EDUCATIF = 'cleMinistereEducatif-123456';

describe('apiLaBonneAlternanceFormation.repository', () => {
	describe('search', () => {
		it('appelle l’api Alternance', () => {
			// Given
			const httpClientService = anAuthenticatedHttpClientService();
			const repository = new ApiAlternanceFormationRepository(httpClientService, aPublicHttpClientService(), anErrorManagementService());

			// When
			repository.search(aFormationQuery());

			// Then
			expect(httpClientService.get).toHaveBeenCalledTimes(1);
			expect(httpClientService.get).toHaveBeenCalledWith('/formation/v1/search?romes=F1603,I1308&longitude=29.10&latitude=48.2&radius=30');
		});

		describe('quand le paramètre de niveau d’étude est présent dans les filtres', () => {
			it('fait l’appel avec les paramètres obligatoires et celui du niveau d’études', () => {
				const httpClientService = anAuthenticatedHttpClientService();
				const repository = new ApiAlternanceFormationRepository(httpClientService, aPublicHttpClientService(), anErrorManagementService());

				repository.search(aFormationQueryWithNiveauEtudes());

				// Then
				expect(httpClientService.get).toHaveBeenCalledWith('/formation/v1/search?romes=F1603,I1308&longitude=29.10&latitude=48.2&radius=30&target_diploma_level=6');
			});
		});

		describe('quand l’api répond avec une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				// GIVEN
				const httpError = anHttpError(500);
				const httpClientService = anAuthenticatedHttpClientService();
				const errorManagementService = anErrorManagementService();
				const repository = new ApiAlternanceFormationRepository(httpClientService, aPublicHttpClientService(), errorManagementService);
				const errorReturnedByErrorManagementService = ErreurMetier.SERVICE_INDISPONIBLE;
				vi.spyOn(httpClientService, 'get').mockRejectedValue(httpError);
				vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));

				// WHEN
				const { errorType } = await repository.search(aFormationQuery()) as Failure;

				// THEN
				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API Alternance',
					contexte: 'search formation api alternance',
					message: 'impossible d’effectuer une recherche de formation',
				});
				expect(errorType).toEqual(errorReturnedByErrorManagementService);
			});
		});
	});

	describe('get', () => {
		it('appelle l’api Alternance avec la clé ministère éducatif encodée', () => {
			// Given
			const id = '085120P01213002197060001130021970600011-46314#L01';
			const httpClientService = anAuthenticatedHttpClientService();
			const repository = new ApiAlternanceFormationRepository(httpClientService, aPublicHttpClientService(), anErrorManagementService());

			// When
			repository.get(id);

			// Then
			expect(httpClientService.get).toHaveBeenCalledTimes(1);
			expect(httpClientService.get).toHaveBeenCalledWith('/formation/v1/085120P01213002197060001130021970600011-46314%23L01');
		});

		describe('quand l‘appel pour récupérer le détail d‘une formation renvoie la formation demandée', () => {
			describe('appelle l’api LaBonneAlternance pour créer un lien de demande de rendez-vous', () => {
				it('l’appel se fait avec les bons arguments', async () => {
					// Given
					const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
					const laBonneAlternanceHttpClientService = aPublicHttpClientService();
					vi.spyOn(apiAlternanceHttpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiAlternanceFormationDetailResponse()));
					vi.spyOn(laBonneAlternanceHttpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));
					const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, laBonneAlternanceHttpClientService, anErrorManagementService());

					// When
					await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery());

					// Then
					expect(laBonneAlternanceHttpClientService.post).toHaveBeenCalledTimes(1);
					expect(laBonneAlternanceHttpClientService.post).toHaveBeenCalledWith('/appointment-request/context/create',
						{
							idCleMinistereEducatif: CLE_MINISTERE_EDUCATIF,
							referrer: DEMANDE_RENDEZ_VOUS_REFERRER,
						});
				});

				it('si l’appel se passe bien, retourne la formation avec le lien de demande de rendez vous', async () => {
					// Given
					const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
					const laBonneAlternanceHttpClientService = aPublicHttpClientService();
					vi.spyOn(apiAlternanceHttpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiAlternanceFormationDetailResponse()));
					vi.spyOn(laBonneAlternanceHttpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));
					const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, laBonneAlternanceHttpClientService, anErrorManagementService());

					// When
					const result = await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery());

					// Then
					expect(result).toEqual(createSuccess(aFormation({
						dureeIndicative: '1 an',
						lienDemandeRendezVous: 'url Demande de Rendez vous',
					})));
				});

				describe('si l‘api est en erreur', () => {
					it('log l‘erreur', async () => {
						// Given
						const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
						const laBonneAlternanceHttpClientService = aPublicHttpClientService();
						const errorManagementService = anErrorManagementService();
						vi.spyOn(apiAlternanceHttpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiAlternanceFormationDetailResponse()));
						const errorCreationRdv = anHttpError(500);
						vi.spyOn(laBonneAlternanceHttpClientService, 'post').mockRejectedValueOnce(errorCreationRdv);
						const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, laBonneAlternanceHttpClientService, errorManagementService);

						// When
						await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery());

						// Then
						expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(errorCreationRdv, aLogInformation({
							apiSource: 'API LaBonneAlternance',
							contexte: 'get formation api alternance',
							message: 'impossible de créer le lien de demande de rdv pour une formation',
						}));
					});

					it('retourne la formation trouvée sans le lien de demande de rendez vous', async () => {
						// Given
						const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
						const laBonneAlternanceHttpClientService = aPublicHttpClientService();
						vi.spyOn(apiAlternanceHttpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiAlternanceFormationDetailResponse()));
						vi.spyOn(laBonneAlternanceHttpClientService, 'post').mockRejectedValueOnce(anHttpError(500));
						const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, laBonneAlternanceHttpClientService, anErrorManagementService());

						// When
						const result = await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery());

						// Then
						expect(result).toEqual(createSuccess(aFormation({ dureeIndicative: '1 an' })));
					});
				});
			});
		});

		describe('quand l‘appel pour récupérer le détail d‘une formation est en erreur', () => {
			describe('si les filtres de recherche sont absents', () => {
				it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
					// GIVEN
					const httpError = anHttpError(404);
					const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
					const errorManagementService = anErrorManagementService();
					const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, aPublicHttpClientService(), errorManagementService);
					const errorReturnedByErrorManagementService = ErreurMetier.CONTENU_INDISPONIBLE;
					vi.spyOn(apiAlternanceHttpClientService, 'get').mockRejectedValue(httpError);
					vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));

					// WHEN
					const { errorType } = await repository.get(CLE_MINISTERE_EDUCATIF) as Failure;

					// THEN
					expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, aLogInformation({
						apiSource: 'API Alternance',
						contexte: 'get formation api alternance',
						message: 'impossible de récupérer le détail d’une formation',
					}));
					expect(errorType).toEqual(errorReturnedByErrorManagementService);
				});
			});

			describe('si les filtres de recherche sont présents, on effectue la recherche de toutes les formations correspondantes', () => {
				it('avec les bons arguments', async () => {
					// Given
					const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
					vi.spyOn(apiAlternanceHttpClientService, 'get')
						.mockRejectedValueOnce(anHttpError(500))
						.mockResolvedValueOnce(anAxiosResponse(anApiAlternanceResultatRechercheFormationResponse()));
					const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, aPublicHttpClientService(), anErrorManagementService());

					// When
					await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery());

					// Then
					expect(apiAlternanceHttpClientService.get).toHaveBeenNthCalledWith(2, '/formation/v1/search?romes=F1603,I1308&longitude=29.10&latitude=48.2&radius=30');
				});

				describe('si la formation est trouvée dans le résultat de recherche', () => {
					it('retourne la formation avec le lien de demande de rendez vous', async () => {
						// Given
						const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
						const laBonneAlternanceHttpClientService = aPublicHttpClientService();
						vi.spyOn(apiAlternanceHttpClientService, 'get')
							.mockRejectedValueOnce(anHttpError(500))
							.mockResolvedValueOnce(anAxiosResponse(anApiAlternanceResultatRechercheFormationResponse()));
						vi.spyOn(laBonneAlternanceHttpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));
						const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, laBonneAlternanceHttpClientService, anErrorManagementService());

						// When
						const result = await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery());

						// Then
						const expectedFormation: Formation = {
							adresse: {
								adresseComplete: '1 rue de la République - 75001 Paris',
								codePostal: '75001',
								latitude: 1,
								longitude: 2,
							},
							lienDemandeRendezVous: 'url Demande de Rendez vous',
							nomEntreprise: 'La Bonne Alternance',
							tags: ['Paris'],
							titre: 'Développeur web',
						};
						expect(result).toEqual(createSuccess(expectedFormation));
					});
				});

				describe('si la formation n’est pas trouvée dans le résultat de recherche avec les filtres', () => {
					it('log les informations spécifiques de l’erreur et retourne une erreur', async () => {
						// Given
						const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
						const errorManagementService = anErrorManagementService();
						vi.spyOn(apiAlternanceHttpClientService, 'get')
							.mockRejectedValueOnce(anHttpError(500))
							.mockResolvedValueOnce(anAxiosResponse(anApiAlternanceResultatRechercheFormationResponse()));
						const demandeIncorrecte = ErreurMetier.DEMANDE_INCORRECTE;
						vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValueOnce(createFailure(demandeIncorrecte));
						const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, aPublicHttpClientService(), errorManagementService);

						// When
						const result = await repository.get('cle pas dans la recherche', aFormationQuery());

						// Then
						expect(apiAlternanceHttpClientService.get).toHaveBeenCalledTimes(2);
						expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(demandeIncorrecte, aLogInformation({
							apiSource: 'API Alternance',
							contexte: 'get formation api alternance',
							message: 'impossible de récupérer le détail d’une formation en effectuant de nouveau la recherche',
						}));
						expect(result).toEqual(createFailure(demandeIncorrecte));
					});
				});

				describe('si la recherche est en erreur', () => {
					it('retourne l’erreur retournée par la recherche', async () => {
						// Given
						const apiAlternanceHttpClientService = anAuthenticatedHttpClientService();
						const errorManagementService = anErrorManagementService();
						const errorReturnedBySearch = ErreurMetier.SERVICE_INDISPONIBLE;
						vi.spyOn(apiAlternanceHttpClientService, 'get')
							.mockRejectedValueOnce(anHttpError(500))
							.mockRejectedValueOnce(anHttpError(500));
						vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValueOnce(createFailure(errorReturnedBySearch));
						const repository = new ApiAlternanceFormationRepository(apiAlternanceHttpClientService, aPublicHttpClientService(), errorManagementService);

						// When
						const { errorType } = await repository.get(CLE_MINISTERE_EDUCATIF, aFormationQuery()) as Failure;

						// Then
						expect(errorType).toEqual(errorReturnedBySearch);
					});
				});
			});
		});
	});
});
