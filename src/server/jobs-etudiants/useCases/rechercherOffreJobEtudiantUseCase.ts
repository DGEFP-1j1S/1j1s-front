import { Either } from '~/server/errors/either';
import { JobEtudiantFiltre } from '~/server/jobs-etudiants/domain/jobEtudiant';
import { ResultatsRechercheOffre } from '~/server/offres/domain/offre';
import { OffreRepository } from '~/server/offres/domain/offre.repository';

export class RechercherOffreJobÉtudiantUseCase {
	constructor(private offreRepository: OffreRepository) {
	}

	async handle(jobÉtudiantFiltre: JobEtudiantFiltre): Promise<Either<ResultatsRechercheOffre>> {
		return this.offreRepository.search(jobÉtudiantFiltre);
	}
}
