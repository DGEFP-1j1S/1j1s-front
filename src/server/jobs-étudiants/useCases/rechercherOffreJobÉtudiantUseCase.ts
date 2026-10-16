import { Either } from '~/server/errors/either';
import { JobÉtudiantFiltre } from '~/server/jobs-étudiants/domain/jobÉtudiant';
import { RésultatsRechercheOffre } from '~/server/offres/domain/offre';
import { OffreRepository } from '~/server/offres/domain/offre.repository';

export class RechercherOffreJobÉtudiantUseCase {
	constructor(private offreRepository: OffreRepository) {
	}

	async handle(jobÉtudiantFiltre: JobÉtudiantFiltre): Promise<Either<RésultatsRechercheOffre>> {
		return this.offreRepository.search(jobÉtudiantFiltre);
	}
}
