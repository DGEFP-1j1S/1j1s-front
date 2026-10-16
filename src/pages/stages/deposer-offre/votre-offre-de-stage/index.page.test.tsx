import '~/test-utils';

import { render } from '@testing-library/react';

import {
	aFormulaireEtapeEntreprise,
} from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import {
	aStageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service.fixture';
import {
	aStageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service.fixture';
import DeposerOffreStageEtape2Page from '~/pages/stages/deposer-offre/votre-offre-de-stage/index.page';

describe('<DeposerOffreStageEtape2Page />', () => {
	beforeEach(() => {
		mockUseRouter({});
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const stageDeposerOffreEtape1PersistenceService = aStageDeposerOffreEtape1PersistenceService({
			getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
		});
		const stageDeposerOffreEtape2PersistenceService = aStageDeposerOffreEtape2PersistenceService();
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				stageDeposerOffreEtape1PersistenceService={stageDeposerOffreEtape1PersistenceService}
				stageDeposerOffreEtape2PersistenceService={stageDeposerOffreEtape2PersistenceService}>
				<DeposerOffreStageEtape2Page />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
