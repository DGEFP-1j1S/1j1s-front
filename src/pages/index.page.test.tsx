import '~/test-utils';

import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { ManualAnalyticsService } from '~/client/services/analytics/analytics.service';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import Accueil, { getStaticProps } from '~/pages/index.page';
import { Actualite } from '~/server/actualites/domain/actualite';
import { anActualiteList, anActualiteLongList } from '~/server/actualites/domain/actualite.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { dependencies } from '~/server/start';

describe('Page d’accueil', () => {
	let analyticsService: ManualAnalyticsService;
	beforeAll(() => {
		mockScrollIntoView();
	});
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({ asPath: '/' });
		analyticsService = aManualAnalyticsService();
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(
			<DependenciesProvider analyticsService={analyticsService}>
				<Accueil actualites={anActualiteList()} />
			</DependenciesProvider>);

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n’a pas de défaut d’accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider analyticsService={analyticsService}>
				<Accueil actualites={anActualiteList()} />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	describe('Bannières', () => {
		describe('Espace jeune', () => {
			it('quand le feature flip est activé, affiche la redirection espace jeune', () => {
				process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '1';
				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<Accueil actualites={anActualiteList()} />
					</DependenciesProvider>,
				);
				expect(screen.getByRole('link', { name: /Découvrir les actualités et services jeunes/ })).toBeVisible();
			});
			it('quand le feature flip est désactivé, n’affiche pas la redirection espace jeune', () => {
				process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';
				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<Accueil actualites={anActualiteList()} />
					</DependenciesProvider>,
				);
				expect(screen.queryByRole('link', { name: /Découvrir les actualités et services jeunes/ })).not.toBeInTheDocument();
			});
		});
	});

	describe('Sections', () => {
		
		describe('Actualités', () => {
			describe('quand la feature old espace jeune est activée', () => {
				it('n’affiche pas la section', async () => {
					// Given
					process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '1';
					const aucuneActualiteOldAccueil: Array<Actualite> = [];

					// When
					render(
						<DependenciesProvider analyticsService={analyticsService}>
							<Accueil actualites={aucuneActualiteOldAccueil} />
						</DependenciesProvider>,
					);

					// Then
					const headingActualites = screen.queryByRole('heading', { level: 2, name: 'Actualités' });
					expect(headingActualites).not.toBeInTheDocument();
				});
				it('ne redirige pas vers une 404', async () => {
					// Given
					process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '1';

					// When
					const result = await getStaticProps();

					// Then
					expect(result).not.toMatchObject({ notFound: true });
				});
			});
			describe('quand la feature old espace jeune est désactivée', () => {
				it('appelle le serveur pour récupérer les 3 dernières actualités', async () => {
					// Given
					process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';
					vi.spyOn(dependencies.actualitesDependencies.consulterActualitesEchantillonUseCase, 'handle').mockResolvedValue(createSuccess(anActualiteList()));

					// When
					await getStaticProps();

					// Then
					expect(dependencies.actualitesDependencies.consulterActualitesEchantillonUseCase.handle).toHaveBeenCalledTimes(1);
				});
				describe('lorsque la récupération des actualités est un succès', () => {
					it('affiche le titre', async () => {
						// Given
						process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';

						// When
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						// Then
						const headingActualites = screen.getByRole('heading', { level: 2, name: 'Actualités' });
						expect(headingActualites).toBeVisible();
					});
					it('affiche un CTA qui redirige vers la page actualités', async () => {
						// Given
						process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';

						// When
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						// Then
						const ctaActualites = screen.getByRole('link', { name: 'Voir toutes les actualités' });
						expect(ctaActualites).toBeVisible();
						expect(ctaActualites).toHaveAttribute('href', '/actualites');
					});
					it('affiche les cartes d’actualités dans une liste', async () => {
						// Given
						process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';
						const actualiteListServer = anActualiteLongList().slice(0, 3);

						// When
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={actualiteListServer} />
							</DependenciesProvider>,
						);

						// Then
						const actualiteListRendered = screen.getAllByRole('list')[0];
						expect(actualiteListRendered).toBeVisible();

						const actualiteListItemsRendered = within(actualiteListRendered).getAllByRole('listitem');
						expect(actualiteListItemsRendered).toHaveLength(actualiteListServer.length);

						const premiereActualite = actualiteListItemsRendered[0];
						expect(within(premiereActualite).getByRole('heading', { level: 3, name: 'Titre 1' })).toBeVisible();
						expect(within(premiereActualite).getByText('Contenu 1')).toBeVisible();
					});
				});
				describe('lorsque la récupération des actualités est un échec', () => {
					it('redirige vers la page 404', async () => {
						// Given
						vi.spyOn(dependencies.actualitesDependencies.consulterActualitesEchantillonUseCase, 'handle').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

						// When
						const result = await getStaticProps();

						// Then
						expect(result).toEqual({ notFound: true, revalidate: 1 });
					});
				});
			});

		});

		describe('Offres', () => {
			it('contient une carte de redirection vers les stages d’études', () => {
				// WHEN
				render(
					<DependenciesProvider analyticsService={analyticsService}>
						<Accueil actualites={anActualiteList()} />
					</DependenciesProvider>,
				);

				// THEN
				const redirectionVersStagesDEtudes = screen.getByRole('link', { name: 'Stages d’études Voir les offres' });
				expect(redirectionVersStagesDEtudes).toBeVisible();
				expect(redirectionVersStagesDEtudes).toHaveAttribute('href', '/stages');
			});

			describe('Jobs d’été', () => {
				describe('quand le feature flip de jobs d’été n’est pas actif', () => {
					it('je ne vois pas la carte de redirection vers les jobs d’été', () => {
						process.env.NEXT_PUBLIC_JOB_ETE_FEATURE = '0';
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);
						expect(screen.queryByText('Jobs d’été')).not.toBeInTheDocument();
					});
				});
				describe('quand le feature flip de jobs d’été est actif', () => {
					it('je vois la carte de redirection vers les jobs d’été', async () => {
						process.env.NEXT_PUBLIC_JOB_ETE_FEATURE = '1';
						const user = userEvent.setup();

						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						const voirPlusButton = screen.getByRole('button', { name: 'Voir plus de résultats sur les offres d‘emplois' });
						expect(voirPlusButton).toBeVisible();
						await user.click(voirPlusButton);

						expect(screen.queryByText('Des milliers d‘offres de jobs d‘été sélectionnées pour vous (durée maximale de 2 mois)')).toBeVisible();
					});
				});
			});

			describe('Stages de 3e et 2de', () => {
				describe('quand la feature stages de 3e et 2de est activée', () => {
					it('contient une carte de redirection vers les stages de 3e et 2de', () => {
						// GIVEN
						process.env.NEXT_PUBLIC_STAGES_3EME_FEATURE = '1';

						// WHEN
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						// THEN
						const redirectionVersStages3eEt2de = screen.getByRole('link', { name: 'Stages de 3e et 2de Voir les offres' });
						expect(redirectionVersStages3eEt2de).toBeVisible();
						expect(redirectionVersStages3eEt2de).toHaveAttribute('href', '/stages-3e-et-2de');
					});
				});

				describe('quand la feature stages de 3e et 2de est désactivée', () => {
					it('ne contient pas de carte de redirection vers les stages de 3e et 2de', () => {
						// GIVEN
						process.env.NEXT_PUBLIC_STAGES_3EME_FEATURE = '0';

						// WHEN
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						// THEN
						const redirectionStage3eEt2de = screen.queryByRole('link', { name: 'Stages de 3e et 2de Voir les offres Des milliers d’entreprises prêtes à vous accueillir pour votre stage de 3e et 2de' });
						expect(redirectionStage3eEt2de).not.toBeInTheDocument();
					});
				});
			});
		});

		describe('Formations et orientation', () => {
			describe('formations initiales', () => {
				describe('quand le feature flip des formations initales n’est pas actif', () => {
					it('je ne vois pas la carte de redirection vers les formations initiales', () => {
						process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE = '0';
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);
						expect(screen.queryByText('Formations initiales')).not.toBeInTheDocument();
					});
				});
				describe('quand le feature flip des formations initales est actif', () => {
					it('je vois la carte de redirection vers les formations initiales', () => {
						process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE = '1';

						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						const link = screen.getByRole('link', { name: 'Formations initiales En savoir plus' });
						expect(link).toBeVisible();
						expect(link).toHaveAttribute('href', '/formations-initiales');
					});
				});
			});
		});

		describe('Aides et outils', () => {
			describe('1jeune1permis', () => {
				describe('quand le feature flip 1jeune1permis n’est pas actif', () => {
					it('je ne vois pas la carte de redirection vers les aides au permis de conduire', () => {
						process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE = '0';
						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);
						expect(screen.queryByText('Aides au permis de conduire')).not.toBeInTheDocument();
					});
				});
				describe('quand le feature flip 1jeune1permis est actif', () => {
					it('je vois la carte de redirection vers les aides au permis de conduire', () => {
						process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE = '1';

						render(
							<DependenciesProvider analyticsService={analyticsService}>
								<Accueil actualites={anActualiteList()} />
							</DependenciesProvider>,
						);

						// FIXME (GAFI 07-10-2024): On test le lien "Aides au logement" quand les aides au permis de conduire activé ?
						const link = screen.getByRole('link', { name: 'Aides financières au logement Voir les aides' });
						expect(link).toBeVisible();
						expect(link).toHaveAttribute('href', '/logements/aides-logement');
					});
				});
			});
		});
	});
});
