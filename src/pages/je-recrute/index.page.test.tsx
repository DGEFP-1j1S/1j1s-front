import '~/test-utils';

import { render } from '@testing-library/react';

import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import JeRecrutePage from '~/pages/je-recrute/index.page';

describe('<JeRecrutePage />', () => {
	it('doit rendre du HTML respectant la specification', () => {
		mockSmallScreen();

		const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<JeRecrutePage />
		</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		mockSmallScreen();

		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}>
				<JeRecrutePage />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
