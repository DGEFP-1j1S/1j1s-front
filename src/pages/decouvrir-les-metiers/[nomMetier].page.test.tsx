import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import ConsulterFicheMetierPage from '~/pages/decouvrir-les-metiers/[nomMetier].page';
import { aFicheMetier } from '~/server/fiche-metier/domain/ficheMetier.fixture';

describe('Page consulter fiche métier', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()} sessionStorageService={aStorageService()}>
				<ConsulterFicheMetierPage ficheMetier={aFicheMetier()} />
			</DependenciesProvider>,
		);
		
		expect(container.outerHTML).toHTMLValidate();
	});
		
	it('n‘a pas de défaut d‘accessibilité', async () => {
		const ficheMetier = aFicheMetier();
		const analyticsService = aManualAnalyticsService();
		const { container } = render(
			<DependenciesProvider
				analyticsService={analyticsService}
				sessionStorageService={aStorageService()}>
				<ConsulterFicheMetierPage ficheMetier={ficheMetier} />
			</DependenciesProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('affiche les informations disponibles de la fiche métier', async () => {
		const ficheMetier = aFicheMetier();
		const analyticsService = aManualAnalyticsService();
		render(
			<DependenciesProvider
				sessionStorageService={aStorageService()}
				analyticsService={analyticsService}>
				<ConsulterFicheMetierPage ficheMetier={ficheMetier} />
			</DependenciesProvider>,
		);

		const nomMetier = await screen.findByRole('heading', { level: 1 });
		const sections = await screen.findAllByRole('heading', { level: 2 });

		expect(nomMetier).toBeInTheDocument();
		expect(sections.length).toEqual(7);
	});

	it('envoie les analytics de la page à son affichage', () => {
		const ficheMetier = aFicheMetier();
		const analyticsService = aManualAnalyticsService();
		render(
			<DependenciesProvider
				analyticsService={analyticsService}
				sessionStorageService={aStorageService()}>
				<ConsulterFicheMetierPage ficheMetier={ficheMetier} />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'contenu_detail_niv_2',
			pagegroup: 'decouvrir_les_metiers_detail',
			pagelabel: 'contenu_detail_niv_2',
			'segment-site': 'contenu_detail',
		});
	});
});
