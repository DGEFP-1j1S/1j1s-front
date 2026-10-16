import { CacheAxiosResponse } from 'axios-cache-interceptor';

import { createFailure, Failure, Success } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';
import { ApiAdresseRepository } from '~/server/localisations/infra/repositories/apiAdresse.repository';
import { aLogInformation, anErrorManagementService } from '~/server/services/error/errorManagement.fixture';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { CachedHttpClientService } from '~/server/services/http/cachedHttpClient.service';
import { anHttpError } from '~/server/services/http/httpError.fixture';
import {
	aCacheAxiosResponse,
	aCachedHttpClientService,
} from '~/server/services/http/publicHttpClient.service.fixture';

const aLogInformationApiAdresse = aLogInformation({
	apiSource: 'API Adresse',
	contexte: 'get commune', message: 'impossible de récupérer les communes associées à une adresse',
});
describe('ApiAdresseRepository', () => {
	let httpClientService: CachedHttpClientService;
	let apiAdresseRepository: ApiAdresseRepository;
	let errorManagementService: ErrorManagementService;

	beforeEach(() => {
		httpClientService = aCachedHttpClientService();
		errorManagementService = anErrorManagementService();
		apiAdresseRepository = new ApiAdresseRepository(httpClientService, errorManagementService);
	});

	describe('getCommuneList', () => {
		describe('quand la liste de communes est trouvée',() => {
			it('retourne la liste des communes', async () => {
				vi
					.spyOn(httpClientService, 'get')
					.mockResolvedValue(aCacheAxiosResponse({
						attribution: 'BAN',
						features: [
							{
								geometry: {
									coordinates: [
										0.657551,
										47.336276,
									],
									type: 'Point',
								},
								properties: {
									city: 'Joué-lès-Tours',
									citycode: '37122',
									context: '37, Indre-et-Loire, Centre-Val de Loire',
									id: '37122',
									importance: 0.47292,
									label: 'Joué-lès-Tours',
									name: 'Joué-lès-Tours',
									population: 38444,
									postcode: '37300',
									score: 0.8611745454545454,
									type: 'municipality',
									x: 523139.52,
									y: 6695506.53,
								},
								type: 'Feature',
							},
							{
								geometry: {
									coordinates: [
										2.037578,
										49.012546,
									],
									type: 'Point',
								},
								properties: {
									city: 'Jouy-le-Moutier',
									citycode: '95323',
									context: '95, Val-d‘Oise, Île-de-France',
									id: '95323',
									importance: 0.43136,
									label: 'Jouy-le-Moutier',
									name: 'Jouy-le-Moutier',
									population: 16741,
									postcode: '95280',
									score: 0.8573963636363635,
									type: 'municipality',
									x: 629596.61,
									y: 6879611,
								},
								type: 'Feature',
							},
						],
						filters: {
							type: 'municipality',
						},
						licence: 'ETALAB-2.0',
						limit: 2,
						query: 'jou',
						type: 'FeatureCollection',
						version: 'draft',
					}) as CacheAxiosResponse);
				const recherche = 'jou';
				const expected = {
					résultats: [
						{
							code: '37122',
							codePostal: '37300',
							coordonnées: {
								latitude: 47.336276,
								longitude: 0.657551,
							},
							ville: 'Joué-lès-Tours',
						},
						{
							code: '95323',
							codePostal: '95280',
							coordonnées: {
								latitude: 49.012546,
								longitude: 2.037578,
							},
							ville: 'Jouy-le-Moutier',
						},
					],
				};

				const { result } = await apiAdresseRepository.getCommuneList(recherche) as Success<RésultatsRechercheCommune>;

				expect(result).toEqual(expected);
			});
		});

		describe('quand l’api renvoie une erreur connue', () => {
			it('log les informations de l’erreur et retourne une erreur métier associée', async () => {
				const recherche = 'jou';
				const errorHttp = anHttpError(400, 'q must contain at least 3 chars and start with a number or a letter');
				vi
					.spyOn(httpClientService, 'get')
					.mockRejectedValue(errorHttp);
				vi
					.spyOn(errorManagementService, 'handleFailureError')
					.mockReturnValue(createFailure(ErreurMetier.DEMANDE_INCORRECTE));

				const result = await apiAdresseRepository.getCommuneList(recherche);

				expect(errorManagementService.handleFailureError).toHaveBeenCalledWith(errorHttp, aLogInformationApiAdresse);
				expect(result.instance).toEqual('failure');
				expect((result as Failure).errorType).toEqual(ErreurMetier.DEMANDE_INCORRECTE);
			});
		});
	});
});
