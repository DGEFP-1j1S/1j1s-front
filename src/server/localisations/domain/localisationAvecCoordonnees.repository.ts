import { Either } from '~/server/errors/either';
import { ResultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnees';

export interface LocalisationAvecCoordonneesRepository {
	getCommuneList(adresseRecherchée: string): Promise<Either<ResultatsRechercheCommune>>;
}
