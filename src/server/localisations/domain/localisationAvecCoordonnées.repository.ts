import { Either } from '~/server/errors/either';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';

export interface LocalisationAvecCoordonnéesRepository {
	getCommuneList(adresseRecherchée: string): Promise<Either<RésultatsRechercheCommune>>;
}
