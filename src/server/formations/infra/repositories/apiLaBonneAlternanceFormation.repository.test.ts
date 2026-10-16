import { createFailure, createSuccess, Failure } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { Formation } from '~/server/formations/domain/formation';
import { aFormation, aResultatRechercheFormation } from '~/server/formations/domain/formation.fixture';
import {
	aFormationQuery,
	aFormationQueryWithNiveauEtudes,
	aLaBonneAlternanceApiRésultatRechercheFormationResponse,
	anApiLaBonneAlternanceFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';
import {
	ApiLaBonneAlternanceFormationRepository,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.repository';
import { aLogInformation, anErrorManagementService } from '~/server/services/error/errorManagement.fixture';
import { anHttpError } from '~/server/services/http/httpError.fixture';
import { anAxiosResponse, aPublicHttpClientService } from '~/server/services/http/publicHttpClient.service.fixture';

const DEMANDE_RENDEZ_VOUS_REFERRER = 'jeune_1_solution';


describe('apiLaBonneAlternanceFormation.repository', () => {
	describe('search', () => {
		it('appelle l’api LaBonneAlternance', () => {
			// Given
			const httpClientService = aPublicHttpClientService();
			const caller = '1jeune1solution-test';
			const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, caller, anErrorManagementService());

			// When
			repository.search(aFormationQuery());

			// Then
			expect(httpClientService.get).toHaveBeenCalledTimes(1);
			expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching('/formations'));
		});

		describe('quand le paramètre de niveau d’étude est présent dans les filtres', () => {
			it('fait l’appel avec les paramètres obligatoires et celui du niveau d’études', () => {
				const httpClientService = aPublicHttpClientService();
				const caller = '1jeune1solution-test';
				const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, caller, anErrorManagementService());

				repository.search(aFormationQueryWithNiveauEtudes());

				// Then
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*caller=1jeune1solution-test/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*romes=F1603,I1308/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*insee=13180/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*longitude=29.10/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*latitude=48.2/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*radius=30/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*diploma=6/));
			});
		});

		describe('quand le paramètre de niveau d’étude n’est pas présent dans les filtres', () => {
			it('fait l’appel avec les paramètres obligatoires', () => {
				const httpClientService = aPublicHttpClientService();
				const caller = '1jeune1solution-test';
				const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, caller, anErrorManagementService());

				repository.search(aFormationQuery());

				// Then
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*caller=1jeune1solution-test/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*romes=F1603,I1308/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*insee=13180/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*longitude=29.10/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*latitude=48.2/));
				expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*radius=30/));
				expect(httpClientService.get).not.toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*diploma=6/));
			});
		});

		describe('quand l’api répond avec une erreur', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				// GIVEN
				const caller = '1jeune1solution-test';
				const httpError = anHttpError(500);
				const httpClientService = aPublicHttpClientService();
				const errorManagementService = anErrorManagementService();
				const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, caller, errorManagementService);
				const errorReturnedByErrorManagementService = ErreurMetier.SERVICE_INDISPONIBLE;
				vi.spyOn(httpClientService, 'get').mockRejectedValue(httpError);
				vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));

				// WHEN
				const { errorType } = await repository.search(aFormationQuery()) as Failure;

				// THEN
				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API LaBonneAlternance',
					contexte: 'search formation la bonne alternance',
					message: 'impossible d’effectuer une recherche de formation',
				});
				expect(errorType).toEqual(errorReturnedByErrorManagementService);
			});
		});
	});

	describe('get', () => {
		it('appelle l’api LaBonneAlternance avec les bons paramètres encodés', () => {
			// Given
			const id = 'formation-id-rco__cle-ministere-educatif#01';
			const httpClientService = aPublicHttpClientService();
			const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());
			vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));

			// When
			repository.get(id);

			// Then
			expect(httpClientService.get).toHaveBeenCalledTimes(1);
			expect(httpClientService.get).toHaveBeenCalledWith('/v1/formations/formation/cle-ministere-educatif%2301');
		});

		describe('quand l‘appel initial pour récupérer le détail d‘une formation renvoie la formation demandée', () => {
			describe('si la cleMinistereEducatif est présente', () => {
				describe('appelle l’api LaBonneAlternance pour créer un lien de demande de rendez-vous', () => {
					it('l’appel se fait avec les bons arguments', async () => {
						// Given
						const httpClientService = aPublicHttpClientService();
						vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiLaBonneAlternanceFormationResponse()));
						vi.spyOn(httpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));
						const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());
						const id = '123__cleMinistereEducatif-123456';

						// When
						await repository.get(id, aFormationQuery());

						// Then
						expect(httpClientService.post).toHaveBeenCalledTimes(1);
						expect(httpClientService.post).toHaveBeenCalledWith('/appointment-request/context/create',
							{
								idCleMinistereEducatif: 'cleMinistereEducatif-123456',
								referrer: DEMANDE_RENDEZ_VOUS_REFERRER,
							});
					});
					it('si l’appel se passe bien, retourne la formation avec le lien de demande de rendez vous', async () => {
						// Given
						const httpClientService = aPublicHttpClientService();
						vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiLaBonneAlternanceFormationResponse()));
						vi.spyOn(httpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));
						const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());

						// When
						const result = await repository.get('123__cleMinistereEducatif-123456', aFormationQuery());

						// Then
						expect(result).toEqual(createSuccess({
							...aFormation(),
							lienDemandeRendezVous: 'url Demande de Rendez vous',
						}));
					});

					describe('si l‘api est en erreur', () => {
						it('log l‘erreur', async () => {
							// Given
							const httpClientService = aPublicHttpClientService();
							const errorManagementService = anErrorManagementService();
							vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(
								anApiLaBonneAlternanceFormationResponse(),
							));
							const errorCreationRdv = anHttpError(500);
							vi.spyOn(httpClientService, 'post').mockRejectedValueOnce(errorCreationRdv);
							const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);

							// When
							await repository.get('123__cleMinistereEducatif-123456', aFormationQuery());

							// Then
							expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(errorCreationRdv, aLogInformation({
								apiSource: 'API LaBonneAlternance',
								contexte: 'get formation la bonne alternance',
								message: 'impossible de créer le lien de demande de rdv pour une formation',
							}));
						});

						it('retourne la formation trouvée sans le lien de demande de rendez vous', async () => {
							// Given
							const httpClientService = aPublicHttpClientService();
							const errorManagementService = anErrorManagementService();
							vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(
								anApiLaBonneAlternanceFormationResponse(),
							));
							const errorCreationRdv = anHttpError(500);
							vi.spyOn(httpClientService, 'post').mockRejectedValueOnce(errorCreationRdv);
							const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);

							// When
							const result = await repository.get('123__cleMinistereEducatif-123456', aFormationQuery());

							// Then
							expect(result).toEqual(createSuccess({
								...aFormation(),
							}));
						});
					});
				});
			});
			describe('si la cleMinistereEducatif n‘est pas présente', () => {
				it('retourne la formation renvoyée par l’API sans lien de demande de rendez vous', async () => {
					// Given
					const httpClientService = aPublicHttpClientService();
					vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiLaBonneAlternanceFormationResponse()));
					const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());

					// When
					const result = await repository.get('formationId__', aFormationQuery());

					// Then
					expect(result).toEqual(createSuccess(aFormation()));
				});
			});
		});

		describe('quand l‘appel initial pour récupérer le détail d‘une formation renvoie une liste vide de résultats', () => {
			describe('si les filtres de recherche sont absents', () => {
				it('retourne une erreur métier CONTENUE INDISPONIBLE', async () => {
					// Given
					const httpClientService = aPublicHttpClientService();
					const errorManagementService = anErrorManagementService();
					vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiLaBonneAlternanceFormationResponse([])));

					const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);

					// When
					const result = await repository.get('formationId__cleMinistereEducatif');

					// Then
					expect(httpClientService.get).toHaveBeenCalledTimes(1);
					expect(result.instance).toBe('failure');
					expect((result as Failure).errorType).toEqual(ErreurMetier.CONTENU_INDISPONIBLE);
				});
			});
			describe('si les filtres de recherche sont présents, on effectue la recherche de toutes les formations correspondantes', () => {
				it('avec les bons arguments', async () => {
					// Given
					const httpClientService = aPublicHttpClientService();
					vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
					vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));

					const formationId = '456';

					const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());

					// When
					await repository.get(formationId, aFormationQuery());

					// Then
					expect(httpClientService.get).toHaveBeenNthCalledWith(2, expect.stringMatching(/\/v1\/formations\?/));
					expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*caller=1jeune1solution-test/));
					expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*romes=F1603,I1308/));
					expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*insee=13180/));
					expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*longitude=29.10/));
					expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*latitude=48.2/));
					expect(httpClientService.get).toHaveBeenCalledWith(expect.stringMatching(/\?(.*&)*radius=30/));
				});
				describe('si la recherche avec les filtres se passe bien', () => {
					describe('si la formation est trouvée dans le résultat de recherche', () => {
						describe('si la cleMinistereEducatif n’est pas trouvée', () => {
							it('ne récupère pas le lien de demande de rendez vous', async () => {
								const httpClientService = aPublicHttpClientService();
								vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
								vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));
								const formationId = '456';

								const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());

								// When
								await repository.get(formationId, aFormationQuery());

								// Then
								expect(httpClientService.post).not.toHaveBeenCalled();
							});
							it('retourne la formation trouvée sans lien de demande de rendez vous', async () => {
								const idFormationWithoutCleMinistereEducatif = aLaBonneAlternanceApiRésultatRechercheFormationResponse().results[1].idRco;
								const httpClientService = aPublicHttpClientService();
								const formationReturnedBySearch = aResultatRechercheFormation({ id: idFormationWithoutCleMinistereEducatif });
								const expectedFormation: Formation = {
									adresse: {
										adresseComplete: formationReturnedBySearch.adresse,
										codePostal: formationReturnedBySearch.codePostal,
										latitude: 1,
										longitude: 2,
									},
									nomEntreprise: formationReturnedBySearch.nomEntreprise,
									tags: [formationReturnedBySearch.tags[0] || ''],
									titre: formationReturnedBySearch.titre,
								};
								const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());
								vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
								vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(anApiLaBonneAlternanceFormationResponse()));
								vi.spyOn(repository, 'search').mockResolvedValueOnce(createSuccess([formationReturnedBySearch]));

								// When
								const result = await repository.get(idFormationWithoutCleMinistereEducatif, aFormationQuery());

								expect(result).toEqual(createSuccess(expectedFormation));
							});
						});

						describe('si la cleMinistereEducatif est trouvée', () => {
							describe('appelle l’api LaBonneAlternance pour créer un lien de demande de rendez-vous', () => {
								it('appelle l‘api avec les bons arguments', async () => {
									const httpClientService = aPublicHttpClientService();
									vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
									vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));
									vi.spyOn(httpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));

									const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());
									const cleMinistereEducatif = 'cleMinistereEducatif-123456';
									const id = `123__${cleMinistereEducatif}`;

									// When
									await repository.get(id, aFormationQuery());

									// Then
									expect(httpClientService.post).toHaveBeenCalledTimes(1);
									expect(httpClientService.post).toHaveBeenCalledWith(
										'/appointment-request/context/create',
										{
											idCleMinistereEducatif: cleMinistereEducatif,
											referrer: DEMANDE_RENDEZ_VOUS_REFERRER,
										},
									);
								});
								it('quand l‘appel se passe bien, retourne la formation avec le lien de demande de rendez vous', async () => {
									const httpClientService = aPublicHttpClientService();
									vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
									vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));
									vi.spyOn(httpClientService, 'post').mockResolvedValueOnce(anAxiosResponse({ form_url: 'url Demande de Rendez vous' }));

									const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', anErrorManagementService());
									const id = '123__cleMinistereEducatif-123456';

									// When
									const result = await repository.get(id, aFormationQuery());

									// Then
									const expectedFormation: Formation = {
										adresse: {
											adresseComplete: '1 rue de la République',
											codePostal: '75001',
										},
										lienDemandeRendezVous: 'url Demande de Rendez vous',
										nomEntreprise: 'La Bonne Alternance',
										tags: ['Paris'],
										titre: 'Développeur web',
									};
									expect(result).toMatchObject(createSuccess(expectedFormation));
								});
								describe('quand l‘appel est en erreur', () => {
									it('log l’erreur', async () => {
										// Given
										const httpClientService = aPublicHttpClientService();
										const errorManagementService = anErrorManagementService();
										vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
										vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));
										const errorCreationRdv = anHttpError(500);
										vi.spyOn(httpClientService, 'post').mockRejectedValueOnce(errorCreationRdv);

										const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);
										const id = '123__cleMinistereEducatif-123456';

										// When
										await repository.get(id, aFormationQuery());

										// Then
										expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(errorCreationRdv, aLogInformation({
											apiSource: 'API LaBonneAlternance',
											contexte: 'get formation la bonne alternance',
											message: 'impossible de créer le lien de demande de rdv pour une formation',
										}));
									});
									it('retourne la formation sans lien de rendez-vous', async () => {
										// Given
										const httpClientService = aPublicHttpClientService();
										const errorManagementService = anErrorManagementService();
										vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
										vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));
										const expectedFormation: Formation = {
											adresse: {
												adresseComplete: '1 rue de la République',
												codePostal: '75001',
												latitude: 1,
												longitude: 2,
											},
											nomEntreprise: 'La Bonne Alternance',
											tags: ['Paris'],
											titre: 'Développeur web',
										};
										const errorCreationRdv = anHttpError(500);

										vi.spyOn(httpClientService, 'post').mockRejectedValueOnce(errorCreationRdv);
										const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);

										const id = '123__cleMinistereEducatif-123456';
										// When

										const result = await repository.get(id, aFormationQuery());
										// Then
										expect(result).toEqual(createSuccess(expectedFormation));
									});
								});
							});
						});
					});

					describe('si la formation n’est pas trouvée dans le résultat de recherche avec les filtres', () => {
						it('log les informations spécifiques de l’erreur et retourne une erreur', async () => {
							// Given
							const httpClientService = aPublicHttpClientService();
							const errorManagementService = anErrorManagementService();
							vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
							vi.spyOn(httpClientService, 'get').mockResolvedValueOnce(anAxiosResponse(aLaBonneAlternanceApiRésultatRechercheFormationResponse()));
							const demandeIncorrecte = ErreurMetier.DEMANDE_INCORRECTE;
							vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValueOnce(createFailure(demandeIncorrecte));

							const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);

							// When
							const result = await repository.get('id pas dans la recherche__', aFormationQuery());

							// Then
							expect(httpClientService.get).toHaveBeenCalledTimes(2);
							expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(demandeIncorrecte, aLogInformation({
								apiSource: 'API LaBonneAlternance',
								contexte: 'get formation la bonne alternance',
								message: 'impossible de récupérer le détail d’une formation en effectuant de nouveau la recherche',
							}));
							expect(result).toEqual(createFailure(demandeIncorrecte));
						});
					});
				});
				describe('si la recherche est en erreur', () => {
					it('retourne l’erreur retournée par la recherche', async () => {
						// Given
						const httpClientService = aPublicHttpClientService();
						const errorManagementService = anErrorManagementService();
						const httpError = anHttpError(500);
						const errorReturnedBySearch = ErreurMetier.SERVICE_INDISPONIBLE;

						vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(anHttpError(500, 'internal_error'));
						vi.spyOn(httpClientService, 'get').mockRejectedValueOnce(httpError);
						vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValueOnce(createFailure(errorReturnedBySearch));

						const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, '1jeune1solution-test', errorManagementService);

						// When
						const { errorType } = await repository.get('id formation__', aFormationQuery()) as Failure;

						// Then
						expect(errorType).toEqual(errorReturnedBySearch);
					});
				});
			});
		});

		describe('quand il y a une erreur', () => {
			describe(`car LaBonneAlternance n'a pas réussi à récupérer le détail d'une formation de leur côté`, () => {
				it.todo(`gère l'erreur de LaBonneAlternance`);
			});
			describe('pour tout autre raison', () => {
				it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
					// GIVEN
					const id = 'formationId__';
					const caller = '1jeune1solution-test';
					const httpError = anHttpError(400);
					const httpClientService = aPublicHttpClientService();
					const errorManagementService = anErrorManagementService();
					const repository = new ApiLaBonneAlternanceFormationRepository(httpClientService, caller, errorManagementService);
					const errorReturnedByErrorManagementService = ErreurMetier.DEMANDE_INCORRECTE;
					vi.spyOn(httpClientService, 'get').mockRejectedValue(httpError);
					vi.spyOn(errorManagementService, 'handleFailureError').mockReturnValue(createFailure(errorReturnedByErrorManagementService));

					// WHEN
					const { errorType } = await repository.get(id) as Failure;

					// THEN
					expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, aLogInformation({
						apiSource: 'API LaBonneAlternance',
						contexte: 'get formation la bonne alternance',
						message: 'impossible de récupérer le détail d’une formation',
					}));
					expect(errorType).toEqual(errorReturnedByErrorManagementService);
				});
			});
		});
	});
});
