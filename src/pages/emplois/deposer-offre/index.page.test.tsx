import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import DéposerUneOffreDEmploi from '~/pages/emplois/deposer-offre/index.page';

describe('Je recrute / Déposer une offre d‘emploi', () => {
	const analyticsService = aManualAnalyticsService();

	beforeEach(() => {
		mockSmallScreen();
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(<DependenciesProvider analyticsService={analyticsService}>
			<DéposerUneOffreDEmploi />
		</DependenciesProvider> );

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<DéposerUneOffreDEmploi />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('envoie les analytics de la page à son affichage', () => {
		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<DéposerUneOffreDEmploi />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'deposer_offre_emploi_etape_1',
			pagegroup: 'deposer_offre_emploi',
			pagelabel: 'deposer_offre_emploi_etape_1',
			'segment-site': 'funnel_etape_1',
		});
	});

	it("affiche un lien redirigeant vers France Travail pour ajouter une offre d'emploi", () => {
		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<DéposerUneOffreDEmploi />
			</DependenciesProvider>,
		);

		const linkToFranceTravail = screen.getAllByRole('link')[0];

		expect(linkToFranceTravail).toBeInTheDocument();
		expect(linkToFranceTravail).toHaveAttribute('href', 'https://pro.francetravail.fr/depotoffrerecruteur/accueil');
	});

	it('propose des liens vers les conditions générales d‘utilisation et la politique de confidentialité', () => {
		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<DéposerUneOffreDEmploi />
			</DependenciesProvider>,
		);

		const lienConditionsGénéralesUtilisation = screen.getByRole('link', { name: 'Conditions Générales d‘Utilisation' });
		const lienPolitiqueConfidentialité = screen.getByRole('link', { name: 'Politique de Confidentialité' });

		expect(lienConditionsGénéralesUtilisation).toBeInTheDocument();
		expect(lienPolitiqueConfidentialité).toBeInTheDocument();
	});
});
