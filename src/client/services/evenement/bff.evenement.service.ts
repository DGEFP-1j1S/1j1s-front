import { EvenementService } from '~/client/services/evenement/evenement.service';
import { HttpClientService } from '~/client/services/httpClient.service';
import { Either } from '~/server/errors/either';

export class BffEvenementService implements EvenementService {
	constructor(private httpClientService: HttpClientService) {}

	async rechercherLieux(saisie: string): Promise<Either<Array<string>>> {
		return this.httpClientService.get<Array<string>>(`evenements/lieux?${new URLSearchParams({ recherche: saisie.trim() })}`);
	}
}
