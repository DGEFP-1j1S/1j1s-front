import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { withMonitoring } from '~/pages/api/middlewares/monitoring/monitoring.middleware';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { handleResponse } from '~/pages/api/utils/response/response.util';
import { MetierAlternance } from '~/server/metiers/domain/metierAlternance';
import { dependencies } from '~/server/start';

const querySchema = Joi.object({
	motCle: Joi.string(),
});

export async function récupérerMétierAlternanceHandler(req: NextApiRequest, res: NextApiResponse<Array<MetierAlternance> | ErrorHttpResponse>) {
	const result = await dependencies.métierDependencies.récupérerMétiers.handle(requestMapper(req));
	return handleResponse(result, res);
}

export default withMonitoring(withValidation({ query: querySchema }, récupérerMétierAlternanceHandler));

function requestMapper(req: NextApiRequest): string {
	const { query } = req;
	return query.motCle ? String(query.motCle) : '';
}
