import { ConfigurationService } from '~/server/services/configuration.service';

export interface CmsDependencies {
	dureeDeValiditeEnSecondes: () => number
}

export function cmsDependenciesContainer(configurationService: ConfigurationService): CmsDependencies {
	const { DUREE_VALIDITE_CACHE_CMS_EN_SECONDES } = configurationService.getConfiguration();
	const duréeDeValiditéEnSecondes = DUREE_VALIDITE_CACHE_CMS_EN_SECONDES;

	return {
		dureeDeValiditeEnSecondes: () => duréeDeValiditéEnSecondes,
	};
}
