import { Either } from '~/server/errors/either';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';
import {
	RechercheLocalisationApiResponse,
} from '~/server/localisations/infra/controllers/RechercheLocalisationApiResponse';

export interface LocalisationService {
	isInvalidLocalisationQuery(recherche: string): boolean;
	rechercherLocalisation(recherche: string): Promise<Either<RechercheLocalisationApiResponse> | null>;
	rechercherCommune(recherche: string): Promise<Either<RésultatsRechercheCommune>>;
}
