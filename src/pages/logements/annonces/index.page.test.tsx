import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { aRechercheClientService } from '~/client/components/layouts/InstantSearch/InstantSearchLayout.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import AnnoncesPage from '~/pages/logements/annonces/index.page';

describe('<AnnoncesPage />', () => {
	it('n‘a pas de défaut d‘accessibilité', async () => {
		mockUseRouter({});
		mockSmallScreen();

		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				rechercheClientService={aRechercheClientService()}>
				<AnnoncesPage />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
	it('doit rendre du HTML respectant la specification', async () => {
		mockUseRouter({});
		mockSmallScreen();

		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				rechercheClientService={aRechercheClientService()}>
				<AnnoncesPage />
			</DependenciesProvider>,
		);

		await screen.findByText('Plus de 3 000 offres de logements étudiants et de locations jeune actif');

		expect(container.outerHTML).toHTMLValidate();
	});
});
