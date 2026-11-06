import '~/test-utils';

import { render, screen, within } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import ActualitesPage, { getStaticProps } from '~/pages/actualites/index.page';
import { anActualite, anActualiteList } from '~/server/actualites/domain/actualite.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { dependencies } from '~/server/start';


vi.mock('~/server/start', () => ({
	dependencies: {
		actualitesDependencies: {
			consulterActualitesUseCase: {
				handle: vi.fn(),
			},
		},
		cmsDependencies: {
			dureeDeValiditeEnSecondes: vi.fn(),
		},
	},
}));

describe('Page Actualités', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
		mockScrollIntoView();
	});

	it('lorsque le feature flip ne permet pas l‘accès à la page, redirige vers la page 404', async () => {
		process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '1';

		const result = await getStaticProps();

		expect(result).toEqual({ notFound: true });
	});

	describe('lorsque le feature flip rend visible la page', () => {
		beforeEach(() => {
			process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';
		});

		it('appelle le serveur pour récupérer les actualités', async () => {
			vi.spyOn(dependencies.actualitesDependencies.consulterActualitesUseCase, 'handle').mockResolvedValue(createSuccess(anActualiteList()));

			await getStaticProps();

			expect(dependencies.actualitesDependencies.consulterActualitesUseCase.handle).toHaveBeenCalledTimes(1);
		});

		it('lorsque la récupération est en échec, redirige vers la page 404', async () => {
			vi.spyOn(dependencies.actualitesDependencies.consulterActualitesUseCase, 'handle').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			const result = await getStaticProps();

			expect(result).toEqual({ notFound: true, revalidate: 1 });
		});

		describe('lorsque la récupération des actualités est en succès', () => {
			it('transmet les props', async () => {
				vi.spyOn(dependencies.actualitesDependencies.consulterActualitesUseCase, 'handle').mockResolvedValue(createSuccess([anActualite()]));

				const result = await getStaticProps();

				expect(result).toEqual(expect.objectContaining({
					props: {
						cartesActualites: [anActualite()],
					},
				}));
			});

			it('envoie les analytics de la page à son affichage', () => {
				const carteActualites = anActualiteList();
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<ActualitesPage cartesActualites={carteActualites} />
					</DependenciesProvider>,
				);

				expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
					page_template: 'contenu_liste_niv_1',
					pagegroup: 'actualites_liste',
					pagelabel: 'contenu_liste_niv_1',
					'segment-site': 'contenu_liste',
				});
			});

			it('doit rendre du HTML respectant la specification', () => {
				const carteActualites = [anActualite({ titre: 'Actualité 1' }), anActualite({ titre: 'Actualité 2' }), anActualite({ titre: 'Actualité 3' })];

				const { container } = render(<DependenciesProvider analyticsService={aManualAnalyticsService()}>
					<ActualitesPage cartesActualites={carteActualites} />
				</DependenciesProvider>);

				expect(container.outerHTML).toHTMLValidate();
			});

			it('n‘a pas de défaut d‘accessibilité', async () => {
				const carteActualites = [anActualite({ titre: 'Actualité 1' }), anActualite({ titre: 'Actualité 2' }), anActualite({ titre: 'Actualité 3' })];

				const { container } = render(
					<DependenciesProvider analyticsService={aManualAnalyticsService()}>
						<ActualitesPage cartesActualites={carteActualites} />
					</DependenciesProvider>);

				await expect(container).toBeAccessible();
			});

			it('affiche la liste des actualités', () => {
				const carteActualites = [
					anActualite({ contenu: 'Je suis un extrait', titre: 'Actualité 1' }),
					anActualite({ titre: 'Actualité 2' }),
					anActualite({ titre: 'Actualité 3' }),
				];
				render(
					<DependenciesProvider analyticsService={aManualAnalyticsService()}>
						<ActualitesPage cartesActualites={carteActualites} />
					</DependenciesProvider>,
				);

				expect(screen.getByRole('list')).toBeVisible();
				const actualitesList = screen.getAllByRole('listitem');
				expect(actualitesList).toHaveLength(3);

				const premiereActualite = actualitesList[0];
				expect(within(premiereActualite).getByRole('heading', { level: 2, name: 'Actualité 1' })).toBeVisible();
				expect(within(premiereActualite).getByText('Je suis un extrait')).toBeVisible();
			});

			describe('bouton voir plus/voir moins', () => {
				it('n‘affiche pas le bouton voir plus si moins de 4 actualités', () => {
					const carteActualites = [
						anActualite({ titre: 'Actualité 1' }),
						anActualite({ titre: 'Actualité 2' }),
						anActualite({ titre: 'Actualité 3' }),
					];
					render(
						<DependenciesProvider analyticsService={aManualAnalyticsService()}>
							<ActualitesPage cartesActualites={carteActualites} />
						</DependenciesProvider>,
					);
					expect(screen.queryByRole('button', { name: 'Voir plus de résultats sur les actualités' })).not.toBeInTheDocument();
				});

				it('affiche le bouton voir plus si plus de 3 actualités', () => {
					const carteActualites = [
						anActualite({ titre: 'Actualité 1' }),
						anActualite({ titre: 'Actualité 2' }),
						anActualite({ titre: 'Actualité 3' }),
						anActualite({ titre: 'Actualité 4' }),
					];

					render(
						<DependenciesProvider analyticsService={aManualAnalyticsService()}>
							<ActualitesPage cartesActualites={carteActualites} />
						</DependenciesProvider>,
					);

					expect(screen.getByRole('button', { name: 'Voir plus de résultats sur les actualités' })).toBeVisible();
				});
			});
		});
	});
});
