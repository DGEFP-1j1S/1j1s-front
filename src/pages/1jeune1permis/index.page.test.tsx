import '~/test-utils';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { HeadMock } from '~/client/components/head.mock';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';

import UnJeuneUnPermis, { getStaticProps } from './index.page';

vi.mock('next/head', () => ({ default: HeadMock }));

describe('1jeune1permis', () => {
	const DOMAINE_1JEUNE_1PERMIS = 'https://mes-aides.francetravail.fr';

	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	describe('quand la feature est désactivé', () => {
		it('retourne une page 404', async () => {
			// Given
			process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE = '0';

			// When
			const result = await getStaticProps();

			// Then
			expect(result).toMatchObject({ notFound: true });
		});
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

	it('n\'a aucun heading', () => {
		/* NOTE (GMO - 2023-11-06): pour éviter de répéter des informations déjà présentes dans l'iframe
		*  le choix a été fait de ne pas avoir de heading au dessus de l'iframe. Pour éviter une structuration incohérente de la page,
		* nous devons nous assurer qu'aucun heading n'est présent */
		// When
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// Then
		const headings = screen.queryAllByRole('heading');
		expect(headings).toEqual([]);
	});

	it('a le titre de page 1jeune1permis', () => {
		// When
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// Then
		expect(document.title).toContain('1jeune1permis');
	});

	it('affiche l\'iframe 1jeune1permis issue du site mes aides de France Travail', () => {
		// When
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// Then
		const iframe = screen.getByTitle('Informations sur le dispositif 1 jeune 1 permis');
		expect(iframe).toBeVisible();
		expect(iframe).toHaveAttribute('src', 'https://mes-aides.francetravail.fr/export/1-jeune-1-permis');
	});
	
	
	it('redimensionne l\'iframe 1jeune1permis via la taille communiquée par l\'API postMessage avec une marge de 40 pixels', async () => {
		// Given
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// When
		const iframe = screen.getByTitle('Informations sur le dispositif 1 jeune 1 permis');
		const data = JSON.stringify({
			height: 2000,
			type: 'resize-iframe',
		});
		fireEvent(window, new MessageEvent('message',
			{ data,
				origin: DOMAINE_1JEUNE_1PERMIS }),
		);

		// Then
		expect(iframe).toHaveAttribute('style', '--1jeune1permis-iframe-height: 2040px;');
	});

	it('ne redimensionne pas l\'iframe 1jeune1permis via si la donnée transmise n\'est pas un evenement de type resize-iframe', async () => {
		// Given
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// When
		const iframe = screen.getByTitle('Informations sur le dispositif 1 jeune 1 permis');

		const data = JSON.stringify({
			height: 2000,
			type: 'do-not-resize-iframe',
		});
		fireEvent(window, new MessageEvent('message',
			{ data,
				origin: DOMAINE_1JEUNE_1PERMIS }),
		);

		// Then
		expect(iframe).not.toHaveAttribute('style');
	});

	it('ne redimensionne pas l\'iframe 1jeune1permis via si la donnée transmise n\'est pas un objet', async () => {
		// Given
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// When
		const iframe = screen.getByTitle('Informations sur le dispositif 1 jeune 1 permis');

		fireEvent(window, new MessageEvent('message',
			{
				data: 'hello !',
				origin: DOMAINE_1JEUNE_1PERMIS,
			}),
		);

		// Then
		expect(iframe).not.toHaveAttribute('style');
	});

	it('ne redimensionne pas l\'iframe 1jeune1permis via si l\'evenement ne provient pas du domaine sur lequel est située la page 1jeune1permis', async () => {
		// Given
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<UnJeuneUnPermis />
			</DependenciesProvider>);

		// When
		const iframe = screen.getByTitle('Informations sur le dispositif 1 jeune 1 permis');
		const data = JSON.stringify({
			height: 2000,
			type: 'resize-iframe',
		});

		fireEvent(window, new MessageEvent('message',
			{ data, 
				origin: 'http://domaine-tres-malicieux.ninja' }),
		);

		// Then
		expect(iframe).not.toHaveAttribute('style');
	});
});
