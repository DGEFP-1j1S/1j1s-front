import { createSuccess, Either } from '~/server/errors/either';
import {
	mapEtablissementPublicAccompagnement,
} from '~/server/etablissement-accompagnement/infra/apiEtablissementPublic.mapper';
import {
	apiEtablissementPublicSearchSchemas,
	ResultatRechercheEtablissementPublicResponseEtablissementsPublicList,
} from '~/server/etablissement-accompagnement/infra/apiEtablissementPublic.response';
import { validateApiResponse } from '~/server/services/error/apiResponseValidator';
import { ErrorManagementService } from '~/server/services/error/errorManagement.service';
import { PublicHttpClientService } from '~/server/services/http/publicHttpClient.service';

import {
	EtablissementAccompagnement,
	ParametresRechercheEtablissementAccompagnement,
	TypeEtablissement,
} from '../domain/etablissementAccompagnement';
import {
	EtablissementAccompagnementRepository,
} from '../domain/etablissementAccompagnement.repository';

const CODE_COMMUNE_MARSEILLE = '13055';
const CODE_COMMUNE_LYON = '69123';
const CODE_COMMUNE_PARIS = '75056';
const NOMBRE_RESULTAT_MAX = '100';

export class ApiEtablissementPublicRepository implements EtablissementAccompagnementRepository {
	constructor(private readonly httpClient: PublicHttpClientService, private readonly errorManagement: ErrorManagementService) {
	}

	async search(params: ParametresRechercheEtablissementAccompagnement): Promise<Either<Array<EtablissementAccompagnement>>> {
		const { typeAccompagnement, codeCommune } = params;
		try {
			const select = 'select=adresse,telephone,adresse_courriel,nom,id,pivot,plage_ouverture';
			const limit = `limit=${NOMBRE_RESULTAT_MAX}`;

			const queryLocalisation = this.getQueryLocalisation(codeCommune, typeAccompagnement);
			const queryTypeEtablissement = `pivot%20LIKE%20%22${typeAccompagnement}%22`;

			const { data } = await this.httpClient.get<ResultatRechercheEtablissementPublicResponseEtablissementsPublicList>(`catalog/datasets/api-lannuaire-administration/records?where=${queryLocalisation}and%20${queryTypeEtablissement}&${limit}&${select}`);
			const errorApiSchemaValidation = validateApiResponse(data.results, apiEtablissementPublicSearchSchemas);

			if (errorApiSchemaValidation) {
				this.errorManagement.logValidationError(errorApiSchemaValidation, {
					apiSource: 'API administration et sevice public',
					contexte: 'search établissement public',
					message: 'erreur de validation du schéma de l‘api',
				});
			}

			return createSuccess(mapEtablissementPublicAccompagnement(data.results));
		} catch (error) {
			return this.errorManagement.handleFailureError(error, {
				apiSource: 'API administration et sevice public',
				contexte: 'search établissement public',
				message: 'impossible d‘effectuer une recherche d‘établissement public',
			});
		}
	}

	private getQueryLocalisation(codeCommune: string, typeAccompagnement: string): string {
		if (codeCommune === CODE_COMMUNE_MARSEILLE) {
			return 'suggest(adresse,%22code_postal%20130*%22)';
		}
		if (codeCommune === CODE_COMMUNE_LYON) {
			return 'suggest(adresse,%22code_postal%206900*%22)';
		}
		if (codeCommune === CODE_COMMUNE_PARIS) {
			return 'suggest(adresse,%22code_postal%20750*%22)';
		}

		const codePostalArrondissement = this.getCodePostalArrondissement(codeCommune);
		if (typeAccompagnement === TypeEtablissement.FRANCE_TRAVAIL && codePostalArrondissement) {
			return `suggest(adresse,%22code_postal%20${codePostalArrondissement}%22)`;
		}

		return `suggest(pivot,%22code_insee_commune%20${codeCommune}%22)`;
	}

	private getCodePostalArrondissement(codeCommune: string): string | undefined {
		if (/^751(0[1-9]|1[0-9]|20)$/.test(codeCommune)) {
			return "750" + codeCommune.slice(3);
		}
		if (/^6938[1-9]$/.test(codeCommune)) {
			return "6900" + codeCommune.slice(4);
		}
		if (/^132(0[1-9]|1[0-6])$/.test(codeCommune)) {
			return "130" + codeCommune.slice(3);
		}
		return undefined;
	}
}
