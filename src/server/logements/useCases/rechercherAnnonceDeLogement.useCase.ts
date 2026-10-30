import { Either } from '~/server/errors/either';
import {
	FiltreRechercheAnnonceDeLogement,
	RechercheAnnonceDeLogementRepository,
	ResultatsRechercheAnnonceDeLogement,
} from '~/server/logements/domain/rechercheAnnonceDeLogement';

export class RechercherAnnonceDeLogementUseCase {
	constructor(private rechercheAnnonceDeLogementRepository: RechercheAnnonceDeLogementRepository) {}

	async handle(filtre: FiltreRechercheAnnonceDeLogement): Promise<Either<ResultatsRechercheAnnonceDeLogement>> {
		return this.rechercheAnnonceDeLogementRepository.rechercher(filtre);
	}
}
