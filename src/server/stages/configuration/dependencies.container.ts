import { RechercheOffreStageRepository } from '~/server/stages/domain/rechercheOffreStage';
import { StagesRepository } from '~/server/stages/domain/stages.repository';
import { ConsulterOffreStageUseCase } from '~/server/stages/useCase/consulterOffreStage.useCase';
import { EnregistrerOffreDeStageUseCase } from '~/server/stages/useCase/enregistrerOffreDeStage.useCase';
import { RechercherLocalisationsOffreStageUseCase } from '~/server/stages/useCase/rechercherLocalisationsOffreStage.useCase';
import { RechercherOffreStageUseCase } from '~/server/stages/useCase/rechercherOffreStage.useCase';

export interface StagesDependencies {
	consulterOffreStage: ConsulterOffreStageUseCase
	enregistrerOffreDeStage: EnregistrerOffreDeStageUseCase
	rechercherOffreStage: RechercherOffreStageUseCase
	rechercherLocalisationsOffreStage: RechercherLocalisationsOffreStageUseCase
}

export function stagesDependenciesContainer(stagesRepository: StagesRepository, rechercheOffreStageRepository: RechercheOffreStageRepository): StagesDependencies {
	return {
		consulterOffreStage: new ConsulterOffreStageUseCase(stagesRepository),
		enregistrerOffreDeStage: new EnregistrerOffreDeStageUseCase(stagesRepository),
		rechercherLocalisationsOffreStage: new RechercherLocalisationsOffreStageUseCase(rechercheOffreStageRepository),
		rechercherOffreStage: new RechercherOffreStageUseCase(rechercheOffreStageRepository),
	};
}
