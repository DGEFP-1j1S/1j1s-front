import { RechercheFicheMetierRepository } from '~/server/fiche-metier/domain/rechercheFicheMetier';
import { StrapiFicheMetierRepository } from '~/server/fiche-metier/infra/strapiFicheMetier.repository';
import { ConsulterFicheMetierUseCase } from '~/server/fiche-metier/useCases/consulterFicheMetier.useCase';
import { ListerNomsMetiersUseCase } from '~/server/fiche-metier/useCases/listerNomsMetiers.useCase';
import { RechercherFicheMetierUseCase } from '~/server/fiche-metier/useCases/rechercherFicheMetier.useCase';

export interface FicheMetierDependencies {
	consulterFicheMetier: ConsulterFicheMetierUseCase
	listerNomsMetiers: ListerNomsMetiersUseCase
	rechercherFicheMetier: RechercherFicheMetierUseCase
}

export function ficheMetierDependenciesContainer(ficheMetierRepository: StrapiFicheMetierRepository, rechercheFicheMetierRepository: RechercheFicheMetierRepository): FicheMetierDependencies {
	return {
		consulterFicheMetier: new ConsulterFicheMetierUseCase(ficheMetierRepository),
		listerNomsMetiers: new ListerNomsMetiersUseCase(ficheMetierRepository),
		rechercherFicheMetier: new RechercherFicheMetierUseCase(rechercheFicheMetierRepository),
	};
}
