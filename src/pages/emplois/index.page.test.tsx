import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import RechercherOffreEmploiPage, { getServerSideProps } from '~/pages/emplois/index.page';
import { aGetServerSidePropsContext } from '~/server/aGetServerSidePropsContext.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { aRésultatsRechercheOffre } from '~/server/offres/domain/offre.fixture';
import { dependencies } from '~/server/start';

vi.mock('~/server/start', () => ({
	dependencies: {
		offreEmploiDependencies: {
			rechercherOffreEmploi: {
				handle: vi.fn(),
			},
		},
	},
}));

describe('Page Emploi', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	describe('<RechercherOffreEmploiPage />', () => {
		it('n‘a pas de défaut d‘accessibilité', async () => {
			mockUseRouter({ query: { page: '1' } });
			mockLargeScreen();

			const { container } = render(
				<DependenciesProvider
					analyticsService={aManualAnalyticsService()}
					localisationService={aLocalisationService()}>
					<RechercherOffreEmploiPage resultats={aRésultatsRechercheOffre()} />);
				</DependenciesProvider>);

			await screen.findByRole('list', { name: /Offres d‘emplois/i });
			await expect(container).toBeAccessible();
		});

		describe('lorsque la page est chargée sans query params', () => {
			it('redirige vers la page 1', async () => {
				// GIVEN
				const routerReplace = vi.fn();
				mockUseRouter({ isReady: true, query: {}, replace: routerReplace });
				mockLargeScreen();
				const offres = aRésultatsRechercheOffre({
					nombreRésultats: 0,
					résultats: [],
				});

				// WHEN
				render(
					<DependenciesProvider
						analyticsService={aManualAnalyticsService()}
						localisationService={aLocalisationService()}>
						<RechercherOffreEmploiPage resultats={offres} />);
					</DependenciesProvider>,
				);

				// THEN
				expect(routerReplace).toHaveBeenCalledWith({ query: 'page=1' }, undefined, { scroll: false });
			});
		});
	});

	describe('getServerSideProps', () => {
		beforeEach(() => {
			vi.resetAllMocks();
		});

		describe('lorsque la recherche est lancée sans query params', () => {
			it('retourne un résultat vide', async () => {
				const result = await getServerSideProps(aGetServerSidePropsContext({ query: {} }));

				expect(result).toEqual({
					props: {},
				});
				expect(dependencies.offreEmploiDependencies.rechercherOffreEmploi.handle).not.toHaveBeenCalled();
			});
		});

		describe('lorsque la recherche est lancée avec des query params', () => {
			it('filtre les offres et retourne le résultat', async () => {
				// GIVEN
				vi.spyOn(dependencies.offreEmploiDependencies.rechercherOffreEmploi, 'handle').mockResolvedValue(createSuccess(aRésultatsRechercheOffre()));

				const context = aGetServerSidePropsContext({ query: { page: '1' } });

				// WHEN
				const result = await getServerSideProps(context);

				// THEN
				expect(result).toEqual({
					props: {
						resultats: aRésultatsRechercheOffre(),
					},
				});
				expect(dependencies.offreEmploiDependencies.rechercherOffreEmploi.handle).toHaveBeenCalledWith({
					page: 1,
				});
			});

			describe('lorsque la recherche retourne une erreur', () => {
				it('relai l‘erreur associée', async () => {
					// GIVEN
					const defaultStatusCode = 200;
					vi.spyOn(dependencies.offreEmploiDependencies.rechercherOffreEmploi, 'handle').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
					const context = aGetServerSidePropsContext({
						query: { page: '1' },
						res: { statusCode: defaultStatusCode },
					});

					// WHEN
					const result = await getServerSideProps(context);

					// THEN
					expect(result).toEqual({ props: { erreurRecherche: ErreurMetier.SERVICE_INDISPONIBLE } });
					expect(context.res.statusCode).toEqual(500);
				});
			});
		});

		describe('lorsque la recherche est lancée avec des query params invalides', () => {
			it('retourne une erreur de demande incorrecte', async () => {
				// GIVEN
				const context = aGetServerSidePropsContext({ query: { page: 'invalid' } });

				// WHEN
				const result = await getServerSideProps(context);

				// THEN
				expect(result).toEqual({
					props: {
						erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE,
					},
				});
				expect(dependencies.offreEmploiDependencies.rechercherOffreEmploi.handle).not.toHaveBeenCalled();
			});
		});
	});
});

