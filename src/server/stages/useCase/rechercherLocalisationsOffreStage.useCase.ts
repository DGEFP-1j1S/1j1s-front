import { Either } from '~/server/errors/either';
import { RechercheOffreStageRepository } from '~/server/stages/domain/rechercheOffreStage';

export class RechercherLocalisationsOffreStageUseCase {
	constructor(private rechercheOffreStageRepository: RechercheOffreStageRepository) {}

	async handle(saisie: string): Promise<Either<Array<string>>> {
		return this.rechercheOffreStageRepository.rechercherLocalisations(saisie);
	}
}
