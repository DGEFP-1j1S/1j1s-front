import { createFailure, createSuccess, Either } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';

import { Offre, OffreFiltre, ResultatsRechercheOffre } from '../../domain/offre';
import { anOffreEmploi, aRésultatEchantillonOffre, aRésultatsRechercheOffre } from '../../domain/offre.fixture';
import { OffreRepository } from '../../domain/offre.repository';

const NOMBRE_RESULTATS_ECHANTILLON = 150;

export function searchOffreRepositoryMockResults(filtre: OffreFiltre): Either<ResultatsRechercheOffre> {
	if (filtre.page === 67) {
		return createFailure(ErreurMetier.DEMANDE_INCORRECTE);
	}
	if (!filtre.motClé) {
		return createSuccess({ ...aRésultatEchantillonOffre(), nombreRésultats: NOMBRE_RESULTATS_ECHANTILLON });
	}
	if (filtre.page === 1 && filtre.motClé === 'barman') {
		return createSuccess(aRésultatsRechercheOffre({
			nombreRésultats: 1,
			résultats: [anOffreEmploi()],
		}));
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

	async search(filtre: OffreFiltre): Promise<Either<ResultatsRechercheOffre>> {
		return searchOffreRepositoryMockResults(filtre);
	}
}
