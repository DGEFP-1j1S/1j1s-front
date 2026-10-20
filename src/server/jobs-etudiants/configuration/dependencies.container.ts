import { OffreRepository } from '~/server/offres/domain/offre.repository';
import { ConsulterOffreJobÉtudiantUseCase } from "~/server/jobs-etudiants/useCases/consulterOffreJobEtudiantUseCase";
import { RechercherOffreJobÉtudiantUseCase } from "~/server/jobs-etudiants/useCases/rechercherOffreJobEtudiantUseCase";

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
