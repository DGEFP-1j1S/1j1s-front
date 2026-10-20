import { LocalisationRepository } from '~/server/localisations/domain/localisation.repository';
import { LocalisationAvecCoordonneesRepository } from '~/server/localisations/domain/localisationAvecCoordonnees.repository';
import { RechercherCommuneUseCase } from '~/server/localisations/useCases/rechercherCommune.useCase';
import { RechercherLocalisationUseCase } from '~/server/localisations/useCases/rechercherLocalisation.useCase';
import { ConfigurationService } from '~/server/services/configuration.service';

export interface LocalisationDependencies {
	listeLocalisation: RechercherLocalisationUseCase;
	rechercherCommune: RechercherCommuneUseCase;
}

export function localisationDependenciesContainer(
	localisationRepository: LocalisationRepository,
	localisationAvecCoordonnéesRepository: LocalisationAvecCoordonneesRepository,
	configurationService: ConfigurationService,
): LocalisationDependencies {
	return {
		listeLocalisation: new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonnéesRepository),
		rechercherCommune: new RechercherCommuneUseCase(localisationAvecCoordonnéesRepository, configurationService),
	};
}
