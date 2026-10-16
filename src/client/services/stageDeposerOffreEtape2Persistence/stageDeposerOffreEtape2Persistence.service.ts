import { OffreDeStageDeposeeStage } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';

export interface StageDeposerOffreEtape2PersistenceService {
	getInformationsEtape2: () => OffreDeStageDeposeeStage | null;
	setInformationsEtape2: (informations: OffreDeStageDeposeeStage) => void;
	removeInformationsEtape2: () => void;
}
