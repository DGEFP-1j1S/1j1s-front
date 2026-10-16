import { type Mock } from "vitest";


import '~/test-utils';

import { render } from '@testing-library/react';

import {
	aFormulaireEtapeEntreprise,
	aFormulaireEtapeStage,
} from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSessionStorage } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStageService } from '~/client/services/stage/stageService.fixture';
import {
	aStageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service.fixture';
import {
	aStageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service.fixture';
import {
	aStageDeposerOffreEtape3PersistenceService,
} from '~/client/services/stageDeposerOffreEtape3Persistence/stageDeposerOffreEtape3Persistence.service.fixture';
import DeposerOffreStageEtape3Page from '~/pages/stages/deposer-offre/localisation/index.page';

describe('<DeposerOffreStageEtape3Page />', () => {
	let getSessionItem: Mock;
	let removeSessionItem: Mock;

	beforeEach(() => {
		removeSessionItem = vi.fn();
		getSessionItem = vi.fn().mockReturnValue(JSON.stringify(aFormulaireEtapeStage()));
		mockSessionStorage({ getItem: getSessionItem, removeItem: removeSessionItem });
		mockUseRouter({});
	});

	it('doit rendre du HTML respectant la specification', () => {
		const stageDeposerOffreEtape1PersistenceService = aStageDeposerOffreEtape1PersistenceService({
			getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
		});
		const stageDeposerOffreEtape2PersistenceService = aStageDeposerOffreEtape2PersistenceService({
			getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
		});
		const stageDeposerOffreEtape3PersistenceService = aStageDeposerOffreEtape3PersistenceService();
		const { container } = render(
			<DependenciesProvider
				stageService={aStageService()}
				stageDeposerOffreEtape1PersistenceService={stageDeposerOffreEtape1PersistenceService}
				stageDeposerOffreEtape2PersistenceService={stageDeposerOffreEtape2PersistenceService}
				stageDeposerOffreEtape3PersistenceService={stageDeposerOffreEtape3PersistenceService}>
				<DeposerOffreStageEtape3Page />
			</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const stageDeposerOffreEtape1PersistenceService = aStageDeposerOffreEtape1PersistenceService({
			getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
		});
		const stageDeposerOffreEtape2PersistenceService = aStageDeposerOffreEtape2PersistenceService({
			getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
		});
		const stageDeposerOffreEtape3PersistenceService = aStageDeposerOffreEtape3PersistenceService();
		const { container } = render(
			<DependenciesProvider
				stageService={aStageService()}
				stageDeposerOffreEtape1PersistenceService={stageDeposerOffreEtape1PersistenceService}
				stageDeposerOffreEtape2PersistenceService={stageDeposerOffreEtape2PersistenceService}
				stageDeposerOffreEtape3PersistenceService={stageDeposerOffreEtape3PersistenceService}>
				<DeposerOffreStageEtape3Page />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
