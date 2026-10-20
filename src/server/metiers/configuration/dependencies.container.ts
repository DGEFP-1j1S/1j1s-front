import { MétierRepository } from '~/server/metiers/domain/metierAlternance.repository';
import { RécupérerMétiersUseCase } from '~/server/metiers/useCases/recupererMetiersUseCase';

export interface MétierDependencies {
	récupérerMétiers: RécupérerMétiersUseCase
}

export function métiersDependenciesContainer(métierRepository: MétierRepository): MétierDependencies {
	return {
		récupérerMétiers: new RécupérerMétiersUseCase(métierRepository),
	};
}
