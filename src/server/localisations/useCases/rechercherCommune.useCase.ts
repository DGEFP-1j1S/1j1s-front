import { createFailure, Either } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';
import {
	LocalisationAvecCoordonnéesRepository,
} from '~/server/localisations/domain/localisationAvecCoordonnées.repository';
import { ConfigurationService } from '~/server/services/configuration.service';

export class RechercherCommuneUseCase {
	constructor(private localisationAvecCoordonnéesRepository: LocalisationAvecCoordonnéesRepository, private configurationService: ConfigurationService) {
	}

	async handle(recherche: string): Promise<Either<RésultatsRechercheCommune>> {
		const minimumQueryLength = this.configurationService.getConfiguration().NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH;
		if (recherche.length < minimumQueryLength) {
			return createFailure(ErreurMetier.DEMANDE_INCORRECTE);
		}
		return this.localisationAvecCoordonnéesRepository.getCommuneList(recherche);
	}
}
