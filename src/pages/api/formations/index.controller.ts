import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { withMonitoring } from '~/pages/api/middlewares/monitoring/monitoring.middleware';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { queryToArray } from '~/pages/api/utils/queryToArray.util';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { handleResponse } from '~/pages/api/utils/response/response.util';
import { FormationFiltre, RésultatRechercheFormation } from '~/server/formations/domain/formation';
import { dependencies } from '~/server/start';

export const formationRechercheQuerySchema = Joi.object({
	codeCommune: Joi.string().required(),
	codeRomes: Joi.string().pattern(/^[A-Za-z]\d{4}(,[A-Za-z]\d{4})*$/).required(),
	distanceCommune: Joi.string().required(),
	latitudeCommune: Joi.string().required(),
	longitudeCommune: Joi.string().required(),
	niveauEtudes: Joi.string().optional().valid('3', '4', '5', '6', '7'),
});

export async function rechercherFormationHandler(req: NextApiRequest, res: NextApiResponse<Array<RésultatRechercheFormation> | ErrorHttpResponse>) {
	const résultatsRechercheFormation = await dependencies.formationDependencies.rechercherFormation.handle(formationFiltreMapper(req));
	return handleResponse(résultatsRechercheFormation, res);
}

export default withMonitoring(withValidation({ query: formationRechercheQuerySchema }, rechercherFormationHandler));

export function formationFiltreMapper(request: NextApiRequest): FormationFiltre {
	const { query } = request;
	return {
		codeCommune: query.codeCommune ? String(query.codeCommune) : '',
		codeRomes: query.codeRomes ? queryToArray(query.codeRomes) : [],
		distanceCommune: query.distanceCommune ? String(query.distanceCommune) : '',
		latitudeCommune: query.latitudeCommune ? String(query.latitudeCommune) : '',
		longitudeCommune: query.longitudeCommune ? String(query.longitudeCommune) : '',
		niveauEtudes: query.niveauEtudes ? String(query.niveauEtudes) : undefined,
	};
}
