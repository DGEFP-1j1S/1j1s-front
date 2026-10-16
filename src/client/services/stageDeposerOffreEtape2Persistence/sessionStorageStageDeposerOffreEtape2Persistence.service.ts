import { OffreDeStageDeposeeStage } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { StorageService } from '~/client/services/storage/storage.service';

import { StageDeposerOffreEtape2PersistenceService } from './stageDeposerOffreEtape2Persistence.service';

export class SessionStorageStageDeposerOffreEtape2PersistenceService implements StageDeposerOffreEtape2PersistenceService {
	private static STORAGE_KEY = 'formulaireEtape2';
	constructor(private storage: StorageService) {}

	getInformationsEtape2(): OffreDeStageDeposeeStage | null {
		return this.storage.get(SessionStorageStageDeposerOffreEtape2PersistenceService.STORAGE_KEY);
	}

	setInformationsEtape2(informations: OffreDeStageDeposeeStage): void {
		this.storage.set(SessionStorageStageDeposerOffreEtape2PersistenceService.STORAGE_KEY, informations);
	}

	removeInformationsEtape2(): void {
		this.storage.remove(SessionStorageStageDeposerOffreEtape2PersistenceService.STORAGE_KEY);
	}
}
