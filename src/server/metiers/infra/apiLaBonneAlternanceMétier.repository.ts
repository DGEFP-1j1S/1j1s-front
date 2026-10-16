import { MetierLaBonneAlternanceApiResponse } from '~/server/alternances/infra/repositories/apiLaBonneAlternance';
import { createSuccess, Either } from '~/server/errors/either';
import { MetierAlternance } from '~/server/metiers/domain/metierAlternance';
import { MétierRepository } from '~/server/metiers/domain/metierAlternance.repository';
import { mapMetier } from '~/server/metiers/infra/apiLaBonneAlternanceMétier.mapper';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { PublicHttpClientService } from '~/server/services/http/publicHttpClient.service';

export class ApiLaBonneAlternanceMétierRepository implements MétierRepository {
	constructor(private readonly httpClientService: PublicHttpClientService, private readonly errorManagementService: ErrorManagementService) {}

	async getMetierList(recherche: string): Promise<Either<Array<MetierAlternance>>> {
		try {
			const response = await this.httpClientService.get<MetierLaBonneAlternanceApiResponse>(`/v1/metiers?title=${recherche}`);
			return createSuccess(mapMetier(response.data));
		} catch (error) {
			return this.errorManagementService.handleFailureError(error, {
				apiSource: 'API LaBonneAlternance',
				contexte: 'get metier la bonne alternance',
				message: 'impossible de récupérer les métiers',
			});
		}
	}
}
