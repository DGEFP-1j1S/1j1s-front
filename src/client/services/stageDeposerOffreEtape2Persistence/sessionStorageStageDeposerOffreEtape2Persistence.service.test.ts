import { OffreDeStageDeposeeStage } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import { DomainesStage } from '~/server/stages/repository/domainesStage';

import { SessionStorageStageDeposerOffreEtape2PersistenceService } from './sessionStorageStageDeposerOffreEtape2Persistence.service';

describe('SessionStorageStageDeposerOffreEtape2PersistenceService', () => {
	describe('setInformationsEtape2', () => {
		it('envoie les informations dans le sessionStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new SessionStorageStageDeposerOffreEtape2PersistenceService(storage);
			const informations: OffreDeStageDeposeeStage = {
				dateDeDebutMax: '2022-01-01',
				dateDeDebutMin: '2022-01-01',
				descriptionOffre: 'description',
				domaineStage: DomainesStage.ACHAT,
				dureeStage: '1',
				isDateDeDebutPrecise: 'true',
				lienCandidature: 'lien',
				nomOffre: 'nom',
				remunerationStage: '1000',
				teletravail: 'true',
			};

			// When
			service.setInformationsEtape2(informations);

			// Then
			expect(storage.set).toHaveBeenCalledWith('formulaireEtape2', informations);
		});
	});

	describe('getInformationsEtape2', () => {
		it('récupère les informations du sessionStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new SessionStorageStageDeposerOffreEtape2PersistenceService(storage);

			// When
			service.getInformationsEtape2();

			// Then
			expect(storage.get).toHaveBeenCalledWith('formulaireEtape2');
		});
	});

	describe('removeInformationsEtape2', () => {
		it('supprime les informations du sessionStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new SessionStorageStageDeposerOffreEtape2PersistenceService(storage);

			// When
			service.removeInformationsEtape2();

			// Then
			expect(storage.remove).toHaveBeenCalledWith('formulaireEtape2');
		});
	});
});
