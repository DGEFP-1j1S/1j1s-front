import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

import { withMonitoring } from '~/pages/api/middlewares/monitoring/monitoring.middleware';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { handleResponse } from '~/pages/api/utils/response/response.util';
import { Age, DemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact';
import {
	ContactEtablissementAccompagnement,
	TypeÉtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import { dependencies } from '~/server/start';
import { emailRegex } from '~/shared/emailRegex';

export const demandeContactAccompagnementBodySchema = Joi.object({
	age: Joi.number().min(16).max(30).required(),
	commentaire: Joi.string().allow(''),
	commune: Joi.string().required(),
	email: Joi.string().pattern(new RegExp(emailRegex)).allow(''),
	nom: Joi.string().required(),
	prénom: Joi.string().required(),
	téléphone: Joi.string().required(),
	établissement: Joi.object({
		email: Joi.string().pattern(new RegExp(emailRegex)).required(),
		nom: Joi.string().required(),
		type: Joi.string().valid(TypeÉtablissement.MISSION_LOCALE).required(), // TODO (SULI 04-03-2024):  enlever la validation sur le type étant donné c'est 100% du mission locale
	}).required(),
});

export async function envoyerDemandeContactAccompagnementHandler(req: NextApiRequest, res: NextApiResponse<void | ErrorHttpResponse>) {
	const demandeDeContactAccompagnement = mapDemandeContactAccompagnement(req.body);

	const responseEnvoyerEmail = await dependencies
		.demandeDeContactDependencies
		.envoyerDemandeDeContactAccompagnementUseCase
		.handle(demandeDeContactAccompagnement);
	return handleResponse(responseEnvoyerEmail, res);
}

export default withMonitoring(withValidation({ body: demandeContactAccompagnementBodySchema }, envoyerDemandeContactAccompagnementHandler));

function mapDemandeContactAccompagnement(body: Record<string, unknown>): DemandeDeContactAccompagnement {
	return {
		age: body.age as Age,
		commentaire: body.commentaire as string || undefined,
		commune: body.commune as string,
		email: body.email as string || undefined,
		nom: body.nom as string,
		prénom: body.prénom as string,
		téléphone: body.téléphone as string,
		établissement: {
			email: (body.établissement as ContactEtablissementAccompagnement).email as string,
			nom: (body.établissement as ContactEtablissementAccompagnement).nom as string,
			type: (body.établissement as ContactEtablissementAccompagnement).type as TypeÉtablissement,
		},
	};
}
