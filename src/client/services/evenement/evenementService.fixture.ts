import { EvenementService } from '~/client/services/evenement/evenement.service';
import { createSuccess } from '~/server/errors/either';

export function anEvenementService(override?: Partial<EvenementService>): EvenementService {
	return {
		rechercherLieux: vi.fn().mockResolvedValue(createSuccess([])),
		...override,
	};
}
