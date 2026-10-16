import { type Mock } from "vitest";
import { createFailure, Failure, Success } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { MetierAlternance } from '~/server/metiers/domain/metierAlternance';
import { aListeDeMetierLaBonneAlternance } from '~/server/metiers/domain/metierAlternance.fixture';
import { aMetierLaBonneAlternanceApiResponse } from '~/server/metiers/infra/apiLaBonneAlternanceMétier.fixture';
import { ApiLaBonneAlternanceMétierRepository } from '~/server/metiers/infra/apiLaBonneAlternanceMétier.repository';
import { anErrorManagementService } from '~/server/services/error/errorManagement.fixture';
import { anHttpError } from '~/server/services/http/httpError.fixture';
import { anAxiosResponse, aPublicHttpClientService } from '~/server/services/http/publicHttpClient.service.fixture';

describe('ApiLaBonneAlternanceMétierRepository', () => {
	describe('getMetierList', () => {
		describe('Quand l‘api renvoie un résultat', () => {
			it('retourne un tableau de métier', async () => {
				const httpClientService = aPublicHttpClientService();
				(httpClientService.get as Mock).mockResolvedValue(anAxiosResponse(aMetierLaBonneAlternanceApiResponse()));
				const expected = aListeDeMetierLaBonneAlternance();

				const repository = new ApiLaBonneAlternanceMétierRepository(httpClientService, anErrorManagementService());

				const response = await repository.getMetierList('tran');

				expect(httpClientService.get).toHaveBeenCalledTimes(1);
				expect(response.instance).toEqual('success');
				expect((response as Success<Array<MetierAlternance>>).result).toEqual(expected);
			});
		});

		describe('Quand l‘api renvoie une erreur', () => {
			it("retourne une instance d'erreur", async () => {
				const httpError = anHttpError(429);
				const httpClientService = aPublicHttpClientService({
					get: vi.fn(async () => {
						throw httpError;
					}),
				});
				const expectedFailure = ErreurMetier.DEMANDE_INCORRECTE;
				const errorManagementService = anErrorManagementService({ handleFailureError: vi.fn(() => createFailure(expectedFailure)) });
				const repository = new ApiLaBonneAlternanceMétierRepository(httpClientService, errorManagementService);

				const response = await repository.getMetierList('tran');

				expect(httpClientService.get).toHaveBeenCalledTimes(1);
				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(httpError, {
					apiSource: 'API LaBonneAlternance',
					contexte: 'get metier la bonne alternance',
					message: 'impossible de récupérer les métiers',
				});
				expect(response.instance).toEqual('failure');
				expect((response as Failure).errorType).toEqual(expectedFailure);
			});
		});
	});
});
