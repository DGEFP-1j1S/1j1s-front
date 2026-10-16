import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import MentoratPage from '~/pages/mentorat/index.page';

describe('MentoratPage', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<MentoratPage />
		</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}>
				<MentoratPage />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('envoie les analytics de la page à son affichage', () => {
		const analyticsService = aManualAnalyticsService();

		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<MentoratPage />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'mentorat',
			pagegroup: 'mentorat',
			pagelabel: 'mentorat',
			'segment-site': 'contenu_liens',
		});
	});

	it('possède un bouton -Je trouve mon mentor- qui redirige l’utilisateur', () => {
		const analyticsService = aManualAnalyticsService();

		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<MentoratPage />
			</DependenciesProvider>,
		);
		const linkAsButton = screen.getByRole('link', { name: 'Trouver mon mentor - nouvelle fenêtre' });

		expect(linkAsButton).toBeVisible();
		expect(linkAsButton).toHaveAttribute('href', 'https://www.1jeune1mentor.fr/formulaire?1jeune1solution');
	});
});
