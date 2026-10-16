import '~/test-utils';

import { render } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aMetierService } from '~/client/services/metiers/metier.fixture';
import FormationAlternancePage, { getServerSideProps } from '~/pages/formations/apprentissage/index.page';
import { aGetServerSidePropsContext } from '~/server/aGetServerSidePropsContext.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { aRésultatRechercheFormationList } from '~/server/formations/domain/formation.fixture';
import { dependencies } from '~/server/start';

vi.mock('~/server/start', () => ({
	dependencies: {
		formationDependencies: {
			rechercherFormation: {
				handle: vi.fn(),
			},
		},
	},
}));

function rechercheFormationAlternanceQuery(override?: Record<string, unknown>) {
	return {
		...aCommuneQuery({
			codeCommune: '75056',
			codePostal: '75001',
			latitudeCommune: '48.859',
			longitudeCommune: '2.347',
			ville: 'Paris',
		}),
		codeRomes: 'D1102,D1104',
		distanceCommune: '10',
		libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
		niveauEtudes: '4',
		...override,
	};
}

describe('Page Formations en Apprentissage', () => {
	beforeEach(() => {
		mockSmallScreen();
	});
	describe('quand le feature flip n‘est pas actif', () => {
		beforeEach(() => {
			process.env = {
				...process.env,
				NEXT_PUBLIC_FORMATION_LBA_FEATURE: '0',
			};
		});
		it('retourne une page 404', async () => {
			const value = await getServerSideProps(aGetServerSidePropsContext());

			expect(value).toEqual({ notFound: true });
		});
	});

	describe('quand le feature flip est actif', () => {
		beforeEach(() => {
			process.env = {
				...process.env,
				NEXT_PUBLIC_FORMATION_LBA_FEATURE: '1',
			};
		});

		it('envoie les analytics de la page à son affichage', () => {
			const analyticsService = aManualAnalyticsService();
			mockUseRouter({});

			render(
				<DependenciesProvider
					analyticsService={analyticsService}
					metierLbaService={aMetierService()}
					localisationService={aLocalisationService()}>
					<FormationAlternancePage />
				</DependenciesProvider>,
			);

			expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
				page_template: 'contenu_liste_niv_1',
				pagegroup: 'formation_apprentissage_liste',
				pagelabel: 'contenu_liste_niv_1',
				'segment-site': 'contenu_liste',
			});
		});

		it('n‘a pas de défaut d‘accessibilité', async () => {
			mockUseRouter(
				{
					query: rechercheFormationAlternanceQuery(),
				},
			);
			const resultats = aRésultatRechercheFormationList();

			const { container } = render(
				<DependenciesProvider
					analyticsService={aManualAnalyticsService()}
					metierLbaService={aMetierService()}
					localisationService={aLocalisationService()}>
					<FormationAlternancePage resultats={resultats} />
				</DependenciesProvider>,
			);

			await expect(container).toBeAccessible();
		});

		it('lorsque la page est affichée sans query params, retourne des props vide', async () => {
			const result = await getServerSideProps(aGetServerSidePropsContext());
			expect(result).toEqual({ props: {} });
		});

		describe('lorsque la page est affichée avec des query params', () => {

			describe.each([{ queryInvalide: '75056' },
				rechercheFormationAlternanceQuery({ niveauEtudes: 'pas un niveau correcte' }),
				rechercheFormationAlternanceQuery({ codeRomes: undefined }),
				rechercheFormationAlternanceQuery({ distanceCommune: undefined }),
			])('et qu‘ils sont invalides', () => {
				it('retourne une erreur et ne fait pas de recherche', async () => {
					const context = aGetServerSidePropsContext({ query: { queryInvalide: '75056' } });

					const result = await getServerSideProps(context);

					expect(result).toEqual({ props: { erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE } });
					expect(dependencies.formationDependencies.rechercherFormation.handle).not.toHaveBeenCalled();
				});
			});

			describe('et que le format des codes ROME est invalide', () => {
				it('retourne une erreur, passe la page en 400 et ne fait pas de recherche', async () => {
					vi.mocked(dependencies.formationDependencies.rechercherFormation.handle).mockClear();
					const context = aGetServerSidePropsContext({
						query: rechercheFormationAlternanceQuery({ codeRomes: 'abc' }),
						res: { statusCode: 200 },
					});

					const result = await getServerSideProps(context);

					expect(result).toEqual({ props: { erreurRecherche: ErreurMetier.DEMANDE_INCORRECTE } });
					expect(context.res.statusCode).toEqual(400);
					expect(dependencies.formationDependencies.rechercherFormation.handle).not.toHaveBeenCalled();
				});
			});

			// La casse minuscule est acceptée par La Bonne Alternance : le sondage direct (preuve 4 du diagnostic) montre que
			// romes=m1805 renvoie HTTP 200. Le pattern /^[A-Z]\d{4}$/ suggéré par le message d‘erreur du partenaire régresserait ce cas.
			describe('et que les codes ROME sont en minuscules', () => {
				it('fait la recherche', async () => {
					vi.spyOn(dependencies.formationDependencies.rechercherFormation, 'handle').mockResolvedValue(createSuccess(aRésultatRechercheFormationList()));
					const context = aGetServerSidePropsContext({
						query: rechercheFormationAlternanceQuery({ codeRomes: 'm1805' }),
					});

					await getServerSideProps(context);

					expect(dependencies.formationDependencies.rechercherFormation.handle).toHaveBeenCalledWith(expect.objectContaining({
						codeRomes: ['m1805'],
					}));
				});
			});

			describe('et qu‘ils sont valides', () => {
				it('fait une recherche avec les query params', async () => {
					vi.spyOn(dependencies.formationDependencies.rechercherFormation, 'handle').mockResolvedValue(createSuccess(aRésultatRechercheFormationList()));

					const context = aGetServerSidePropsContext({
						query: {
							codeCommune: '75056',
							codeRomes: 'D1102,D1104',
							distanceCommune: '10',
							latitudeCommune: '48.859',
							libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
							longitudeCommune: '2.347',
							niveauEtudes: '4',
							ville: 'Paris',
						},
					});

					await getServerSideProps(context);

					expect(dependencies.formationDependencies.rechercherFormation.handle).toHaveBeenCalledWith({
						codeCommune: '75056',
						codeRomes: ['D1102', 'D1104'],
						distanceCommune: '10',
						latitudeCommune: '48.859',
						longitudeCommune: '2.347',
						niveauEtudes: '4',
					});
				});

				it('lorsque la recherche est en erreur, retourne l‘erreur et change le status de la page', async () => {
					vi.spyOn(dependencies.formationDependencies.rechercherFormation, 'handle').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
					const defaultStatusCode = 200;

					const context = aGetServerSidePropsContext({
						query: rechercheFormationAlternanceQuery(),
						res: { statusCode: defaultStatusCode },
					});

					const result = await getServerSideProps(context);

					expect(result).toEqual({ props: { erreurRecherche: ErreurMetier.SERVICE_INDISPONIBLE } });
					expect(context.res.statusCode).toEqual(500);
				});

				it('lorsque la recherche retourne un résultat, renvoie les formations en apprentissage', async () => {
					vi.spyOn(dependencies.formationDependencies.rechercherFormation, 'handle').mockResolvedValue(createSuccess(aRésultatRechercheFormationList()));
					const context = aGetServerSidePropsContext({
						query: rechercheFormationAlternanceQuery(),
					});

					const result = await getServerSideProps(context);

					expect(result).toEqual({ props: { resultats: aRésultatRechercheFormationList() } });
				});
			});
		});

	});
});
