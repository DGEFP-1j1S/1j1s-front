import {
	aFormulaireEnvoyePostedValue,
	aFormulaireEtapeEntreprise,
	aFormulaireEtapeLocalisation,
	aFormulaireEtapeStage,
} from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre.fixture';
import { anHttpClientService } from '~/client/services/httpClientService.fixture';
import { BffStageService } from '~/client/services/stage/bff.stage.service';
import { createSuccess } from '~/server/errors/either';

describe('stageService', () => {
	describe('enregistrerOffreStage', () => {
		it('enregistre l’offre de stage', async () => {
			// GIVEN
			const httpClient = anHttpClientService();
			vi.spyOn(httpClient, 'post').mockResolvedValue(createSuccess(undefined));
			const offreToSubmit = aFormulaireEnvoyePostedValue();
			const stageService = new BffStageService(httpClient);

			// WHEN
			const result = await stageService.enregistrerOffreDeStage(aFormulaireEtapeEntreprise(), aFormulaireEtapeStage(), aFormulaireEtapeLocalisation());

			// THEN
			expect(httpClient.post).toHaveBeenCalledWith('stages', offreToSubmit);
			expect(result).toEqual(createSuccess(undefined));
		});
	});
});
