import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { withMonitoring } from '~/pages/api/middlewares/monitoring/monitoring.middleware';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { handleResponse } from '~/pages/api/utils/response/response.util';
import {
	EtablissementAccompagnement,
	TypeÉtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import { dependencies } from '~/server/start';

export const querySchema = Joi.object({
	codeCommune: Joi.string().alphanum().max(5).required(),
	typeAccompagnement: Joi.string().valid(...Object.values(TypeÉtablissement)).required(),
}).options({ allowUnknown: true });

export async function rechercherÉtablissementAccompagnementHandler(
	req: NextApiRequest,
	res: NextApiResponse<EtablissementAccompagnement[] | ErrorHttpResponse>) {
	const { query } = req;
	const résultatsRechercheÉtablissementAccompagnement = await dependencies
		.établissementAccompagnementDependencies
		.rechercherEtablissementAccompagnementUseCase
		.handle({ codeCommune: String(query.codeCommune), typeAccompagnement: String(query.typeAccompagnement) });
	return handleResponse(résultatsRechercheÉtablissementAccompagnement, res);
}

export default withMonitoring(withValidation({ query: querySchema }, rechercherÉtablissementAccompagnementHandler));
