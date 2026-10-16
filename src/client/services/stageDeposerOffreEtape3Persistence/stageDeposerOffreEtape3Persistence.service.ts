import { OffreDeStageDeposeeLocalisation } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';

export interface StageDeposerOffreEtape3PersistenceService {
	getInformationsEtape3: () => OffreDeStageDeposeeLocalisation | null;
	setInformationsEtape3: (informations: OffreDeStageDeposeeLocalisation) => void;
}
