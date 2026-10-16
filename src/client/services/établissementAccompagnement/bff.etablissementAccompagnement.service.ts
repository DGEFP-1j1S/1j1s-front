import { stringify } from 'querystring';

import { AccompagnementQueryParams } from '~/client/hooks/useAccompagnementQuery';
import {
	EtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.service';
import { HttpClientService } from '~/client/services/httpClient.service';
import { DemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact';
import { Either } from '~/server/errors/either';
import { EtablissementAccompagnement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export class BffEtablissementAccompagnementService implements EtablissementAccompagnementService{
	constructor(private httpClientService: HttpClientService) {
	}

	async rechercher(queryParams: AccompagnementQueryParams): Promise<Either<EtablissementAccompagnement[]>> {
		return this.httpClientService.get<EtablissementAccompagnement[]>(`etablissements-accompagnement?${stringify(<Record<string, string | undefined>>queryParams)}`);
	}

	async envoyerDemandeContact(demandeDeContactAccompagnement: DemandeDeContactAccompagnement): Promise<Either<void>> {
		return this.httpClientService.post('etablissements-accompagnement/contact', demandeDeContactAccompagnement);
	}
}
