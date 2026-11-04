import { Either } from '~/server/errors/either';
import {
	FiltreRechercheFicheMetier,
	RechercheFicheMetierRepository,
	ResultatsRechercheFicheMetier,
} from '~/server/fiche-metier/domain/rechercheFicheMetier';

export class RechercherFicheMetierUseCase {
	constructor(private rechercheFicheMetierRepository: RechercheFicheMetierRepository) {}

	async handle(filtre: FiltreRechercheFicheMetier): Promise<Either<ResultatsRechercheFicheMetier>> {
		return this.rechercheFicheMetierRepository.rechercher(filtre);
	}
}
