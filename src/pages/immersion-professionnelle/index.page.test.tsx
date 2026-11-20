import '~/test-utils';

import { render } from '@testing-library/react';

import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import ImmersionProfessionnellePage from '~/pages/immersion-professionnelle/index.page';

describe('<ImmersionProfessionnellePage />', () => {
	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<ImmersionProfessionnellePage />
		</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}>
				<ImmersionProfessionnellePage />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
