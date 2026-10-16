import { createSuccess } from '~/server/errors/either';
import {
	aLocalisationList,
	aLocalisationListWithEmptyValue,
} from '~/server/localisations/domain/localisation.fixture';
import { aCommuneList } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

import { LocalisationService } from './localisation.service';

export function aLocalisationServiceWithEmptyResultat(): LocalisationService {
	return aLocalisationService({
		rechercherCommune: vi.fn().mockResolvedValue(createSuccess({ résultats: [] })),
		rechercherLocalisation: vi.fn().mockResolvedValue(createSuccess(aLocalisationListWithEmptyValue())),
	});
}

export function aLocalisationService(override?: Partial<LocalisationService>): LocalisationService {
	return {
		isInvalidLocalisationQuery: () => false,
		rechercherCommune: async () => createSuccess({ résultats: aCommuneList() }),
		rechercherLocalisation: async () => createSuccess(aLocalisationList()),
		...override,
	};
}
