import {
	EtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.service';
import { createSuccess } from '~/server/errors/either';
import {
	anEtablissementAccompagnementList,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

export function anEtablissementAccompagnementService(overrides?: Partial<EtablissementAccompagnementService> ): EtablissementAccompagnementService {
	return {
		envoyerDemandeContact: async () => createSuccess(undefined),
		rechercher: async () => createSuccess(anEtablissementAccompagnementList()),
		...overrides,
	};
}
