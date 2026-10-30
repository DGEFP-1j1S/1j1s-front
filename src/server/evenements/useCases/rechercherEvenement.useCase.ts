import { Either } from '~/server/errors/either';
import {
	FiltreRechercheEvenement,
	RechercheEvenementRepository,
	ResultatsRechercheEvenement,
} from '~/server/evenements/domain/rechercheEvenement';

export class RechercherEvenementUseCase {
	constructor(private rechercheEvenementRepository: RechercheEvenementRepository) {}

	async handle(filtre: FiltreRechercheEvenement): Promise<Either<ResultatsRechercheEvenement>> {
		return this.rechercheEvenementRepository.rechercher(filtre);
	}
}
