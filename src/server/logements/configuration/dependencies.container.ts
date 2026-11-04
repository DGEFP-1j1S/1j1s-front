import { AnnonceDeLogementRepository } from '../domain/annonceDeLogement.repository';
import { RechercheAnnonceDeLogementRepository } from '../domain/rechercheAnnonceDeLogement';
import { ConsulterAnnonceLogementUseCase } from '../useCases/consulterAnnonceDeLogement.useCase';
import { RechercherAnnonceDeLogementUseCase } from '../useCases/rechercherAnnonceDeLogement.useCase';

export interface AnnonceDeLogementDependencies {
	consulterAnnonceLogementUseCase: ConsulterAnnonceLogementUseCase
	rechercherAnnonceDeLogement: RechercherAnnonceDeLogementUseCase
}

export function annonceDeLogementDependenciesContainer(annonceDeLogementRepository: AnnonceDeLogementRepository, rechercheAnnonceDeLogementRepository: RechercheAnnonceDeLogementRepository): AnnonceDeLogementDependencies {
	return {
		consulterAnnonceLogementUseCase: new ConsulterAnnonceLogementUseCase(annonceDeLogementRepository),
		rechercherAnnonceDeLogement: new RechercherAnnonceDeLogementUseCase(rechercheAnnonceDeLogementRepository),
	};
}
