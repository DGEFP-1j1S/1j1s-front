import { Either } from '~/server/errors/either';
import { FormationFiltre, ResultatRechercheFormation } from '~/server/formations/domain/formation';
import { FormationRepository } from '~/server/formations/domain/formation.repository';

export class RechercherFormationUseCase {
	constructor(private repository: FormationRepository) {}

	async handle(filtre: FormationFiltre): Promise<Either<Array<ResultatRechercheFormation>>> {
		return this.repository.search(filtre);
	}
}
