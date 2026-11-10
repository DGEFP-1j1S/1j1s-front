import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { withMethods } from '~/pages/api/middlewares/methods/methods.middleware';
import { withMonitoring } from '~/pages/api/middlewares/monitoring/monitoring.middleware';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { handleResponse } from '~/pages/api/utils/response/response.util';
import { dependencies } from '~/server/start';

export const querySchema = Joi.object({
	recherche: Joi.string().allow('').max(100),
});

export async function rechercherLocalisationsOffreStageHandler(req: NextApiRequest, res: NextApiResponse<Array<string> | ErrorHttpResponse>) {
	const saisie = req.query.recherche ? String(req.query.recherche) : '';
	const result = await dependencies.stagesDependencies.rechercherLocalisationsOffreStage.handle(saisie);
	return handleResponse(result, res);
}

export default withMonitoring(withMethods(['GET'], withValidation({ query: querySchema }, rechercherLocalisationsOffreStageHandler)));
