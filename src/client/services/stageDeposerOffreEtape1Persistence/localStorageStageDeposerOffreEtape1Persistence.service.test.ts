import { OffreDeStageDeposeeEntreprise } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';

import { LocalStorageStageDeposerOffreEtape1PersistenceService } from './localStorageStageDeposerOffreEtape1Persistence.service';

describe('LocalStorageStageDeposerOffreEtape1PersistenceService', () => {
	describe('setInformationsEtape1', () => {
		it('envoie les informations dans le localStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new LocalStorageStageDeposerOffreEtape1PersistenceService(storage);
			const informations: OffreDeStageDeposeeEntreprise = {
				descriptionEmployeur: 'descriptionEmployeur',
				emailEmployeur: 'emailEmployeur',
				logoEmployeur: 'logoEmployeur',
				nomEmployeur: 'nomEmployeur',
				siteEmployeur: 'siteEmployeur',
			};

			// When
			service.setInformationsEtape1(informations);

			// Then
			expect(storage.set).toHaveBeenCalledWith('formulaireEtape1', informations);
		});
	});

	describe('getInformationsEtape1', () => {
		it('récupère les informations du localStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new LocalStorageStageDeposerOffreEtape1PersistenceService(storage);

			// When
			service.getInformationsEtape1();

			// Then
			expect(storage.get).toHaveBeenCalledWith('formulaireEtape1');
		});
	});
});
