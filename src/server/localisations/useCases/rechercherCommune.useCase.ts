import { createFailure, Either } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { ResultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnees';
import {
	LocalisationAvecCoordonneesRepository,
} from '~/server/localisations/domain/localisationAvecCoordonnees.repository';
import { ConfigurationService } from '~/server/services/configuration.service';

export class RechercherCommuneUseCase {
	constructor(private localisationAvecCoordonnéesRepository: LocalisationAvecCoordonneesRepository, private configurationService: ConfigurationService) {
	}

	async handle(recherche: string): Promise<Either<ResultatsRechercheCommune>> {
		const minimumQueryLength = this.configurationService.getConfiguration().NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH;
		if (recherche.length < minimumQueryLength) {
			return createFailure(ErreurMetier.DEMANDE_INCORRECTE);
		}
		return this.localisationAvecCoordonnéesRepository.getCommuneList(recherche);
	}
}
