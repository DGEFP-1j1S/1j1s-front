import { Either } from '~/server/errors/either';
import { OffreFiltre, ResultatsRechercheOffre } from '~/server/offres/domain/offre';
import { OffreRepository } from '~/server/offres/domain/offre.repository';

export class RechercherOffreEmploiUseCase {
	constructor(private offreRepository: OffreRepository) {
	}

	async handle(offreEmploiFiltre: OffreFiltre): Promise<Either<ResultatsRechercheOffre>> {
		return this.offreRepository.search(offreEmploiFiltre);
	}
}
