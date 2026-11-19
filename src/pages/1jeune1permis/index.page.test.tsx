import '~/test-utils';

import { render, screen, waitFor } from '@testing-library/react';

import { HeadMock } from '~/client/components/head.mock';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';

import UnJeuneUnPermis from './index.page';

vi.mock('next/head', () => ({ default: HeadMock }));

describe('1jeune1permis', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	it('doit rendre du HTML respectant la specification', () => {
		// When
		const { container } = render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// Then
		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		await expect(container).toBeAccessible();
	});

	it('envoie les analytics de la page', async () => {
		const analyticsService = aManualAnalyticsService();
		render(
			<DependenciesProvider analyticsService={analyticsService}>
				<UnJeuneUnPermis />
			</DependenciesProvider>,
		);
		await waitFor(() => {
			expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
				page_template: 'contenu_liste_niv_1',
				pagegroup: 'permis',
				pagelabel: 'permis',
				'segment-site': 'contenu_liste',
			});
		});
	});

	it("affiche le titre Aides au permis de conduire", () => {
		// WHEN
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// THEN
		expect(screen.getByRole("heading", { level: 1, name: "Aides au permis de conduire" })).toBeVisible();
	});

	it("affiche un lien vers les aides au permis de 1 jeune 1 permis", () => {
		// WHEN
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// THEN
		const lien = screen.getByRole("link", { name: /Découvrir les aides au permis/ });
		expect(lien).toHaveAttribute("href", "https://mes-aides.francetravail.fr/export/1-jeune-1-permis");
	});
});
