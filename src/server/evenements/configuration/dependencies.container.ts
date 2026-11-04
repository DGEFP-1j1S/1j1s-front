import { RechercheEvenementRepository } from '~/server/evenements/domain/rechercheEvenement';
import { RechercherEvenementUseCase } from '~/server/evenements/useCases/rechercherEvenement.useCase';
import { RechercherLieuxEvenementUseCase } from '~/server/evenements/useCases/rechercherLieuxEvenement.useCase';

export interface EvenementDependencies {
	rechercherEvenement: RechercherEvenementUseCase
	rechercherLieuxEvenement: RechercherLieuxEvenementUseCase
}

export function evenementDependenciesContainer(rechercheEvenementRepository: RechercheEvenementRepository): EvenementDependencies {
	return {
		rechercherEvenement: new RechercherEvenementUseCase(rechercheEvenementRepository),
		rechercherLieuxEvenement: new RechercherLieuxEvenementUseCase(rechercheEvenementRepository),
	};
}
