import type { NextApiRequest, NextApiResponse } from 'next';

import { withMonitoring } from '~/pages/api/middlewares/monitoring/monitoring.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { handleResponse } from '~/pages/api/utils/response/response.util';
import { ResultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnees';
import { dependencies } from '~/server/start';


export async function rechercherCommuneHandler(req: NextApiRequest, res: NextApiResponse<ResultatsRechercheCommune | ErrorHttpResponse>) {
	const résultatRechercheCommunes = await dependencies.localisationDependencies.rechercherCommune.handle(String(req.query.q));
	return handleResponse(résultatRechercheCommunes, res);
}

export default withMonitoring(rechercherCommuneHandler);
