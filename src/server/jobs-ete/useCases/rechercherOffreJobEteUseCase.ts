import { Either } from '~/server/errors/either';
import { JobEteFiltre } from '~/server/jobs-ete/domain/jobEte';
import { RésultatsRechercheOffre } from '~/server/offres/domain/offre';
import { OffreRepository } from '~/server/offres/domain/offre.repository';

export class RechercherOffreJobEteUseCase {
	constructor(private offreRepository: OffreRepository) {
	}

	async handle(jobEteFiltre: JobEteFiltre): Promise<Either<RésultatsRechercheOffre>> {
		return this.offreRepository.search(jobEteFiltre);
	}
}
