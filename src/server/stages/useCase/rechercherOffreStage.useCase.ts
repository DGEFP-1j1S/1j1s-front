import { Either } from '~/server/errors/either';
import {
	FiltreRechercheOffreStage,
	RechercheOffreStageRepository,
	ResultatsRechercheOffreStage,
} from '~/server/stages/domain/rechercheOffreStage';

export class RechercherOffreStageUseCase {
	constructor(private rechercheOffreStageRepository: RechercheOffreStageRepository) {}

	async handle(filtre: FiltreRechercheOffreStage): Promise<Either<ResultatsRechercheOffreStage>> {
		return this.rechercheOffreStageRepository.rechercher(filtre);
	}
}
