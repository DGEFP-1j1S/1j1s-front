import { OffreDeStageDeposeeEntreprise } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';

export interface StageDeposerOffreEtape1PersistenceService {
	getInformationsEtape1: () => OffreDeStageDeposeeEntreprise | null;
	setInformationsEtape1: (informations: OffreDeStageDeposeeEntreprise) => void;
}
