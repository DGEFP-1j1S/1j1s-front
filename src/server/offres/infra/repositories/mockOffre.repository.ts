import { createFailure, createSuccess, Either } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';

import { Offre, OffreFiltre, RésultatsRechercheOffre } from '../../domain/offre';
import { anOffreEmploi, aRésultatEchantillonOffre, aRésultatsRechercheOffre } from '../../domain/offre.fixture';
import { OffreRepository } from '../../domain/offre.repository';

export function searchOffreRepositoryMockResults(filtre: OffreFiltre): Either<RésultatsRechercheOffre> {
	if (filtre.page === 1 && !filtre.motClé) {
		return createSuccess(aRésultatEchantillonOffre());
	}
	if (filtre.page === 1 && filtre.motClé === 'barman') {
		return createSuccess(aRésultatsRechercheOffre({
			nombreRésultats: 1,
			résultats: [anOffreEmploi()],
		}));
	}
	if (filtre.page === 67) {
		return createFailure(ErreurMetier.DEMANDE_INCORRECTE);
	}

	return createSuccess(aRésultatsRechercheOffre());
}

export function getOffreRepositoryMockResults(): Either<Offre> {
	return createSuccess(anOffreEmploi());
}

export class MockOffreRepository implements OffreRepository {
	paramètreParDéfaut: string | undefined;

	async get(): Promise<Either<Offre>> {
		return getOffreRepositoryMockResults();
	}

	async search(filtre: OffreFiltre): Promise<Either<RésultatsRechercheOffre>> {
		return searchOffreRepositoryMockResults(filtre);
	}
}
