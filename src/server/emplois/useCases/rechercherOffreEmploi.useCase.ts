import { Either } from '~/server/errors/either';
import { OffreFiltre, RésultatsRechercheOffre } from '~/server/offres/domain/offre';
import { OffreRepository } from '~/server/offres/domain/offre.repository';

export class RechercherOffreEmploiUseCase {
	constructor(private offreRepository: OffreRepository) {
	}

	async handle(offreEmploiFiltre: OffreFiltre): Promise<Either<RésultatsRechercheOffre>> {
		return this.offreRepository.search(offreEmploiFiltre);
	}
}
