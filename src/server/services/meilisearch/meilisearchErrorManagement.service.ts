import { createFailure, Failure } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { DefaultErrorManagementService } from '~/server/services/error/errorManagement.service';

/**
 * Les erreurs du client Meilisearch ne sont pas des erreurs HTTP axios : sans surcharge, elles finiraient en
 * CONTENU_INDISPONIBLE (404) alors que c‘est le moteur de recherche qui est indisponible.
 */
export class MeilisearchErrorManagementService extends DefaultErrorManagementService {
	protected createFailureForInternalError(): Failure {
		return createFailure(ErreurMetier.SERVICE_INDISPONIBLE);
	}
}
