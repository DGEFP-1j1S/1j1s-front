import {
	OffreDeStageDeposeeEntreprise,
	OffreDeStageDeposeeLocalisation,
	OffreDeStageDeposeeStage,
} from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { Either } from '~/server/errors/either';

export interface StageService {
	enregistrerOffreDeStage(informationsEntreprise: OffreDeStageDeposeeEntreprise, informationsStage: OffreDeStageDeposeeStage, informationsLocalisation: OffreDeStageDeposeeLocalisation): Promise<Either<void>>
}

