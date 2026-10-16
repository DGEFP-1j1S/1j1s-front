import { OffreDeStageDeposeeEntreprise } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { StorageService } from '~/client/services/storage/storage.service';

import { StageDeposerOffreEtape1PersistenceService } from './stageDeposerOffreEtape1Persistence.service';

export class LocalStorageStageDeposerOffreEtape1PersistenceService implements StageDeposerOffreEtape1PersistenceService {
	private static STORAGE_KEY = 'formulaireEtape1';
	constructor(private storage: StorageService) {}

	getInformationsEtape1(): OffreDeStageDeposeeEntreprise | null {
		return this.storage.get(LocalStorageStageDeposerOffreEtape1PersistenceService.STORAGE_KEY);
	}

	setInformationsEtape1(informations: OffreDeStageDeposeeEntreprise): void {
		return this.storage.set(
			LocalStorageStageDeposerOffreEtape1PersistenceService.STORAGE_KEY,
			informations);
	}
}
