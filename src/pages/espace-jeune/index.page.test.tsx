import '~/test-utils';

import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import EspaceJeunePage, { getStaticProps } from '~/pages/espace-jeune/index.page';
import { anActualite, anActualiteList } from '~/server/actualites/domain/actualite.fixture';
import { aServiceJeune, aServiceJeuneList } from '~/server/services-jeunes/domain/servicesJeunes.fixture';

describe('Page Espace Jeune', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
		mockScrollIntoView();
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('lorsque le feature flip ne permet pas l‘accès à la page, redirige vers la page 404', async () => {
		process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';

		const result = await getStaticProps();

		expect(result).toEqual({ notFound: true, revalidate: 1 });
	});

	describe('lorsque le feature flip rend visible la page', () => {
		beforeEach(() => {
			process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '1';
		});

		it('doit rendre du HTML respectant la specification', () => {
			const carteActualites = [anActualite({ titre: 'Actualité 1' }), anActualite({ titre: 'Actualité 2' }), anActualite({ titre: 'Actualité 3' })];
			const serviceJeuneList = aServiceJeuneList();

			mockUseRouter({});
			mockSmallScreen();

			const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
			</DependenciesProvider>);

			expect(container.outerHTML).toHTMLValidate();
		});

		it('n‘a pas de défaut d‘accessibilité', async () => {
			const carteActualites = [anActualite({ titre: 'Actualité 1' }), anActualite({ titre: 'Actualité 2' }), anActualite({ titre: 'Actualité 3' })];
			const serviceJeuneList = aServiceJeuneList();

			mockUseRouter({});
			mockSmallScreen();

			const { container } = render(
				<DependenciesProvider
					analyticsService={aManualAnalyticsService()}>
					<EspaceJeunePage
						cartesActualites={carteActualites}
						serviceJeuneList={serviceJeuneList} />);
				</DependenciesProvider>);

			await expect(container).toBeAccessible();
		});

		it('envoie les analytics de la page à son affichage', () => {
			const carteActualites = anActualiteList();
			const serviceJeuneList = aServiceJeuneList();
			const analyticsService = aManualAnalyticsService();

			render(
				<DependenciesProvider
					analyticsService={analyticsService}>
					<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
				</DependenciesProvider>,
			);

			expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
				page_template: 'contenu_liste_niv_1',
				pagegroup: 'service_jeune_liste',
				pagelabel: 'contenu_liste_niv_1',
				'segment-site': 'contenu_liste',
			});
		});

		describe('Si des actualités sont récupérées', () => {
			it('n‘affiche pas le bouton voir plus si moins de 4 actualités', () => {
				const carteActualites = [anActualite({ titre: 'Actualité 1' }), anActualite({ titre: 'Actualité 2' }), anActualite({ titre: 'Actualité 3' })];
				const serviceJeuneList = aServiceJeuneList();
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider
						analyticsService={analyticsService}>
						<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
					</DependenciesProvider>,
				);
				const actualitesSection = screen.getByRole('region', { name: 'les actualités' });

				expect(within(actualitesSection).queryByRole('button', { name: 'Voir plus de résultats sur les actualités' })).not.toBeInTheDocument();
			});

			it('affiche le bouton voir plus si plus de 3 actualités', () => {
				const carteActualites = [anActualite({ titre: 'Actualité 1' }),
					anActualite({ titre: 'Actualité 2' }),
					anActualite({ titre: 'Actualité 3' }),
					anActualite({ titre: 'Actualité 4' })];

				const serviceJeuneList = aServiceJeuneList();
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider
						analyticsService={analyticsService}>
						<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
					</DependenciesProvider>,
				);
				const actualitesSection = screen.getByRole('region', { name: 'les actualités' });

				expect(within(actualitesSection).getByRole('button', { name: 'Voir plus de résultats sur les actualités' })).toBeVisible();
			});
		});

		describe('Si des services jeunes sont récupérés', () => {
			it('affiche au maximum 6 services initialement', () => {
				const carteActualites = [anActualite()];
				const serviceJeuneList = [
					aServiceJeune({ titre: 'service 1' }),
					aServiceJeune({ titre: 'service 2' }),
					aServiceJeune({ titre: 'service 3' }),
					aServiceJeune({ titre: 'service 4' }),
					aServiceJeune({ titre: 'service 5' }),
					aServiceJeune({ titre: 'service 6' }),
					aServiceJeune({ titre: 'service 7' }),
				];
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
					</DependenciesProvider>,
				);

				// THEN
				const mesuresJeunesSection = screen.getByRole('region', { name: 'les services jeunes' });
				const servicesJeunesList = within(mesuresJeunesSection).getAllByRole('listitem');
				expect(servicesJeunesList.length).toBe(6);
			});

			it('affiche un bouton voir plus quand il y a plus de 6 services', () => {
				const carteActualites = [anActualite()];
				const serviceJeuneList = [
					aServiceJeune({ titre: 'service 1' }),
					aServiceJeune({ titre: 'service 2' }),
					aServiceJeune({ titre: 'service 3' }),
					aServiceJeune({ titre: 'service 4' }),
					aServiceJeune({ titre: 'service 5' }),
					aServiceJeune({ titre: 'service 6' }),
					aServiceJeune({ titre: 'service 7' }),
				];
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
					</DependenciesProvider>,
				);
				const mesuresJeunesSection = screen.getByRole('region', { name: 'les services jeunes' });

				// THEN
				const voirPlusDeServicesJeunesBouton = within(mesuresJeunesSection).getByRole('button', { name: 'Voir plus de services conçus pour les jeunes' });
				expect(voirPlusDeServicesJeunesBouton).toBeVisible();
			});

			it('affiche un bouton voir moins quand plus de 6 services jeunes sont visibles', async () => {
				const carteActualites = [anActualite()];
				const serviceJeuneList = [
					aServiceJeune({ titre: 'service 1' }),
					aServiceJeune({ titre: 'service 2' }),
					aServiceJeune({ titre: 'service 3' }),
					aServiceJeune({ titre: 'service 4' }),
					aServiceJeune({ titre: 'service 5' }),
					aServiceJeune({ titre: 'service 6' }),
					aServiceJeune({ titre: 'service 7' }),
				];
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<EspaceJeunePage cartesActualites={carteActualites} serviceJeuneList={serviceJeuneList} />
					</DependenciesProvider>,
				);
				const mesuresJeunesSection = screen.getByRole('region', { name: 'les services jeunes' });
				const voirPlusDeServicesJeunesBouton = within(mesuresJeunesSection).getByRole('button', { name: 'Voir plus de services conçus pour les jeunes' });

				// WHEN
				await userEvent.click(voirPlusDeServicesJeunesBouton);

				// THEN
				const voirMoinsDeServicesJeunesBouton = within(mesuresJeunesSection).getByRole('button', { name: 'Voir moins de services conçus pour les jeunes' });
				expect(voirMoinsDeServicesJeunesBouton).toBeVisible();
			});
		});
	});
});
