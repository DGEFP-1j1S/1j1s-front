import { OffreDeStageDeposeeLocalisation } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import {
	LocalStorageStageDeposerOffreEtape3PersistenceService,
} from '~/client/services/stageDeposerOffreEtape3Persistence/localStorageStageDeposerOffreEtape3Persistence.service';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';

describe('LocalStorageStageDeposerOffreEtape3PersistenceService', () => {
	describe('setInformationsEtape3', () => {
		it('envoie les informations dans le localStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new LocalStorageStageDeposerOffreEtape3PersistenceService(storage);
			const informations: OffreDeStageDeposeeLocalisation = {
				adresse: 'adresse',
				codePostal: '75000',
				departement: 'Paris',
				pays: 'France',
				region: 'Ile-de-France',
				ville: 'Paris',
			};

			// When
			service.setInformationsEtape3(informations);

			// Then
			expect(storage.set).toHaveBeenCalledWith('formulaireEtape3', informations);
		});
	});

	describe('getInformationsEtape2', () => {
		it('récupère les informations du sessionStorage', () => {
			// Given
			const storage = aStorageService();
			const service = new LocalStorageStageDeposerOffreEtape3PersistenceService(storage);

			// When
			service.getInformationsEtape3();

			// Then
			expect(storage.get).toHaveBeenCalledWith('formulaireEtape3');
		});
	});
});
