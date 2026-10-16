import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import AidesLogement from '~/pages/logements/aides-logement/index.page';

describe('Les aides au logement', () => {
	beforeEach(() => {
		mockUseRouter({});
		mockSmallScreen();
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<AidesLogement />
		</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}>
				<AidesLogement />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('envoie les analytics de la page à son affichage', () => {
		const analyticsService = aManualAnalyticsService();

		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<AidesLogement />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'aides_logement',
			pagegroup: 'aides_logement',
			pagelabel: 'aides_logement',
			'segment-site': 'contenu_liens',
		});
	});

	describe('La carte partenaire de la CAF', () => {
		it('ouvre le simulateur de la CAF dans un nouvel onglet', () => {
			const analyticsService = aManualAnalyticsService();

			render(
				<DependenciesProvider
					analyticsService={analyticsService}>
					<AidesLogement />
				</DependenciesProvider>,
			);

			const link = screen.getByRole('link', { name: /Tester mon éligibilité pour les aides au logement de la CAF/ });

			expect(link).toHaveAttribute('href', 'https://wwwd.caf.fr/wps/portal/caffr/aidesetdemarches/mesdemarches/faireunesimulation/lelogement#/preparation');
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('title', 'Tester mon éligibilité pour les aides au logement de la CAF - nouvelle fenêtre');
		});
	});
});
