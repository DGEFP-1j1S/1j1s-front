import '~/test-utils';

import { render } from '@testing-library/react';

import StageDeposerOffreFormulaireEnvoye
	from '~/client/components/features/OffreDeStage/Déposer/Confirmation/StageDeposerOffreFormulaireEnvoye';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';

describe('<DeposerOffreStageEnvoyePage />', () => {
	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<StageDeposerOffreFormulaireEnvoye />
			</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		mockUseRouter({});
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}>
				<StageDeposerOffreFormulaireEnvoye />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
