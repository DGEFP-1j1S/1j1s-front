import { ConsulterOffreJobÉtudiantUseCase } from '~/server/jobs-étudiants/useCases/consulterOffreJobÉtudiantUseCase';
import { RechercherOffreJobÉtudiantUseCase } from '~/server/jobs-étudiants/useCases/rechercherOffreJobÉtudiantUseCase';
import { OffreRepository } from '~/server/offres/domain/offre.repository';

export interface OffresJobÉtudiantDependencies {
	consulterOffreJobÉtudiant: ConsulterOffreJobÉtudiantUseCase
	rechercherOffreJobÉtudiant: RechercherOffreJobÉtudiantUseCase
}

export function jobsÉtudiantsDependenciesContainer(offreRepository: OffreRepository): OffresJobÉtudiantDependencies {
	return {
		consulterOffreJobÉtudiant: new ConsulterOffreJobÉtudiantUseCase(offreRepository),
		rechercherOffreJobÉtudiant: new RechercherOffreJobÉtudiantUseCase(offreRepository),
	};
}
