import { Either } from '~/server/errors/either';
import { RechercheEvenementRepository } from '~/server/evenements/domain/rechercheEvenement';

export class RechercherLieuxEvenementUseCase {
	constructor(private rechercheEvenementRepository: RechercheEvenementRepository) {}

	async handle(saisie: string): Promise<Either<Array<string>>> {
		return this.rechercheEvenementRepository.rechercherLieux(saisie);
	}
}
