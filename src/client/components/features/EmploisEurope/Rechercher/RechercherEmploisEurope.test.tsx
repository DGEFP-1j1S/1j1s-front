import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import RechercherEmploisEurope from '~/client/components/features/EmploisEurope/Rechercher/RechercherEmploisEurope';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { EURES_POSITION_SCHEDULE_TYPE } from '~/client/domain/codesTempsTravailEures';
import { EmploiEuropeQueryParams } from '~/client/hooks/useEmploiEuropeQuery';
import { anEmploiEuropeService } from '~/client/services/europe/emploiEurope.service.fixture';
import {
	anEmploiEurope,
	aResultatRechercheEmploiEuropeList,
} from '~/server/emplois-europe/domain/emploiEurope.fixture';
import { NiveauDEtudesLibelle,NiveauDEtudeValue } from '~/server/emplois-europe/domain/niveauDEtudes';
import { SecteurActiviteCode } from '~/server/emplois-europe/infra/secteurActiviteEures';
import { EURES_CONTRACT_TYPE } from '~/server/emplois-europe/infra/typesContratEures';
import { createSuccess } from '~/server/errors/either';

describe('RechercherEmploisEurope', () => {
	describe('quand le composant est affiché sans paramètres de recherche dans l’URL', () => {
		it('affiche un formulaire pour la recherche d‘emplois en europe, sans échantillon de résultat', async () => {
			// GIVEN
			mockSmallScreen();
			const emploiEuropeServiceMock = anEmploiEuropeService();
			mockUseRouter({});

			// WHEN
			render(
				<DependenciesProvider
					emploiEuropeService={emploiEuropeServiceMock}>
					<RechercherEmploisEurope />
				</DependenciesProvider>,
			);
			const formulaireRechercheEmploisEurope = screen.getByRole('search');

			// THEN
			expect(formulaireRechercheEmploisEurope).toBeVisible();
			expect(emploiEuropeServiceMock.rechercherEmploiEurope).toHaveBeenCalledTimes(0);
		});
	});

	describe('quand le composant est affiché pour une recherche avec résultats', () => {
		describe('quand l’URL contient un mot clé de recherche', () => {
			it('affiche les résultats de la recherche', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList(
					{
						nombreResultats: 2,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [{ ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
							anEmploiEurope({
								id: '2',
								nomEntreprise: 'Entreprise 2',
								titre: 'Titre 2',
							}),
						],
					});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
				// eslint-disable-next-line testing-library/no-node-access
				const resultats = resultatsUl[0].children;

				// THEN
				expect(resultats).toHaveLength(resultatsService.offreList.length);
				expect(await screen.findByText('Entreprise 1')).toBeVisible();
				expect(await screen.findByText('Titre 1')).toBeVisible();

				const lienOffre1 = screen.getByRole('link', { name: 'Titre 1 En savoir plus' });
				expect(lienOffre1).toBeVisible();
				expect(lienOffre1).toHaveAttribute('href', '/emplois-europe/1');

				expect(await screen.findByText('Entreprise 2')).toBeVisible();
				expect(await screen.findByText('Titre 2')).toBeVisible();

				const lienOffre2 = screen.getByRole('link', { name: 'Titre 2 En savoir plus' });
				expect(lienOffre2).toBeVisible();
				expect(lienOffre2).toHaveAttribute('href', '/emplois-europe/2');
			});

			describe('quand un résultat contient un pays et une ville', () => {
				it('affiche le résultat avec le pays et la ville', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [{ pays: 'France', ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();

					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);

					const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
					// eslint-disable-next-line testing-library/no-node-access
					const resultats = resultatsUl[0].children;

					// THEN
					expect(resultats).toHaveLength(resultatsService.offreList.length);
					expect(await screen.findByText('Entreprise 1')).toBeVisible();
					expect(await screen.findByText('Titre 1')).toBeVisible();
					expect(await screen.findByText('France/Paris')).toBeVisible();
				});
			});

			describe('quand un résultat contient un pays mais pas de ville', () => {
				it('affiche le résultat avec le pays', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [{ pays: 'France' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();

					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);

					const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
					// eslint-disable-next-line testing-library/no-node-access
					const resultats = resultatsUl[0].children;

					// THEN
					expect(resultats).toHaveLength(resultatsService.offreList.length);
					expect(await screen.findByText('Entreprise 1')).toBeVisible();
					expect(await screen.findByText('Titre 1')).toBeVisible();
					expect(await screen.findByText('France')).toBeVisible();
				});
			});

			describe('quand un résultat contient une ville mais pas de pays', () => {
				it('affiche le résultat avec la ville', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [{ ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();

					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);

					const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
					// eslint-disable-next-line testing-library/no-node-access
					const resultats = resultatsUl[0].children;

					// THEN
					expect(resultats).toHaveLength(resultatsService.offreList.length);
					expect(await screen.findByText('Entreprise 1')).toBeVisible();
					expect(await screen.findByText('Titre 1')).toBeVisible();
					expect(await screen.findByText('Paris')).toBeVisible();
				});
			});

			describe('quand un résultat contient plusieurs localisations', () => {
				it('affiche un tag Multi-localisation', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [
									{ pays: 'France', ville: 'Paris' },
									{ pays: 'Belgique', ville: 'Bruxelles' },
								],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();

					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);

					const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
					// eslint-disable-next-line testing-library/no-node-access
					const resultats = resultatsUl[0].children;

					// THEN
					expect(resultats).toHaveLength(resultatsService.offreList.length);
					expect(await screen.findByText('Entreprise 1')).toBeVisible();
					expect(await screen.findByText('Titre 1')).toBeVisible();
					expect(await screen.findByText('Multi-localisation')).toBeVisible();
				});
			});

			describe('quand la recherche contient plusieurs résultats', () => {
				it('affiche le nombre de résultats de la recherche avec des espaces tous les 3 caractères', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 123456789,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [{ ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
							anEmploiEurope({
								id: '2',
								nomEntreprise: 'Entreprise 2',
								titre: 'Titre 2',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();
					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);
					const nombreResultats = await screen.findByRole('heading', {
						level: 2,
						name: '123 456 789 offres d’emplois en Europe pour Développeur',
					});

					// THEN
					expect(nombreResultats).toBeVisible();
				});
			});

			describe('quand la recherche contient un seul résultat', () => {
				it('affiche le nombre de résultats de la recherche', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								id: '1',
								localisations: [{ ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'Titre 1',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();
					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);
					const nombreResultats = await screen.findByRole('heading', {
						level: 2,
						name: '1 offre d’emploi en Europe pour Développeur',
					});

					// THEN
					expect(nombreResultats).toBeVisible();
				});
			});
		});

		describe('quand l’URL contient un code pays de recherche et un libellé de pays', () => {
			it('affiche les résultats de la recherche', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 2,
					offreList: [
						anEmploiEurope({
							id: '1',
							localisations: [{ ville: 'Paris' }],
							nomEntreprise: 'Entreprise 1',
							titre: 'Titre 1',
						}),
						anEmploiEurope({
							id: '2',
							nomEntreprise: 'Entreprise 2',
							titre: 'Titre 2',
						}),
					],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						codePays: 'ES',
						libellePays: 'Espagne',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);

				const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
				// eslint-disable-next-line testing-library/no-node-access
				const resultats = resultatsUl[0].children;

				// THEN
				expect(resultats).toHaveLength(resultatsService.offreList.length);
				expect(await screen.findByText('Entreprise 1')).toBeVisible();
				expect(await screen.findByText('Titre 1')).toBeVisible();
				expect(await screen.findByText('Entreprise 2')).toBeVisible();
				expect(await screen.findByText('Titre 2')).toBeVisible();
			});
		});

		describe('quand l’URL ne contient pas de mot clé de recherche ou de code de pays de recherche ou de libellé de pays', () => {
			it('affiche le nombre de résultats de la recherche', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 2,
					offreList: [
						anEmploiEurope({
							id: '1',
							localisations: [{ ville: 'Paris' }],
							nomEntreprise: 'Entreprise 1',
							titre: 'Titre 1',
						}),
						anEmploiEurope({
							id: '2',
							nomEntreprise: 'Entreprise 2',
							titre: 'Titre 2',
						}),
					],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const nombreResultats = await screen.findByRole('heading', { level: 2, name: '2 offres d’emplois en Europe' });

				// THEN
				expect(nombreResultats).toBeVisible();
			});
		});

		it('permet d’accéder uniquement au nombre page défini par l’api eures', async () => {
			// GIVEN
			const maxPage = Math.floor(10_000 / 15);
			const routerPush = vi.fn();
			const emploiEuropeServiceMock = anEmploiEuropeService();
			const resultatsService = aResultatRechercheEmploiEuropeList(
				{
					nombreResultats: 2_000_000,
					offreList: [
						anEmploiEurope(),
					],
				});
			vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));
			mockSmallScreen();
			mockUseRouter({
				push: routerPush,
				query: {
					page: '1',
				},
			});
			const user = userEvent.setup();

			// WHEN
			render(
				<DependenciesProvider
					emploiEuropeService={emploiEuropeServiceMock}>
					<RechercherEmploisEurope />
				</DependenciesProvider>,
			);

			const pagination = within(await screen.findByRole('navigation', { name: 'pagination' })).getAllByRole('link');
			const dernierePage = pagination[pagination.length - 1];
			await user.click(dernierePage);

			// THEN
			expect(routerPush).toHaveBeenCalledWith({ query: { page: maxPage } });
		});
	});

	describe('étiquettes filtre de recherche', () => {
		it('affiche les étiquettes de filtres de recherche correspondant aux paramètres dans l’URL', async () => {
			// GIVEN
			const emploiEuropeServiceMock = anEmploiEuropeService();
			const resultatsService = aResultatRechercheEmploiEuropeList({
				nombreResultats: 2,
				offreList: [
					anEmploiEurope({
						id: '1',
						localisations: [{ ville: 'Paris' }],
						nomEntreprise: 'Entreprise 1',
						titre: 'Titre 1',
					}),
					anEmploiEurope({
						id: '2',
						nomEntreprise: 'Entreprise 2',
						titre: 'Titre 2',
					}),
				],
			});
			vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

			const query: EmploiEuropeQueryParams = {
				codePays: 'ES',
				libellePays: 'Espagne',
				niveauEtude: NiveauDEtudeValue.MASTER,
				page: '1',
				secteurActivite: SecteurActiviteCode.AGRICULTURE,
				tempsDeTravail: `${EURES_POSITION_SCHEDULE_TYPE.FullTime},${EURES_POSITION_SCHEDULE_TYPE.NonSpecified}`,
				typeContrat: `${EURES_CONTRACT_TYPE.Contract},${EURES_CONTRACT_TYPE.Apprenticeship}`,
			};
			mockSmallScreen();
			mockUseRouter({
				query,
			});

			// WHEN
			render(
				<DependenciesProvider
					emploiEuropeService={emploiEuropeServiceMock}>
					<RechercherEmploisEurope />
				</DependenciesProvider>,
			);

			// THEN
			const etiquettesRecherche = await screen.findByRole('list', { name: 'Filtres de la recherche' });
			expect(etiquettesRecherche).toBeVisible();
			const etiquettes = within(etiquettesRecherche).getAllByRole('listitem');
			expect(etiquettes).toHaveLength(7);
			expect(etiquettes[0]).toHaveTextContent('Espagne');
			expect(etiquettes[1]).toHaveTextContent('Apprentissage');
			expect(etiquettes[2]).toHaveTextContent('Contrat déterminé');
			expect(etiquettes[3]).toHaveTextContent('Temps plein');
			expect(etiquettes[4]).toHaveTextContent('Temps de travail non spécifié');
			expect(etiquettes[5]).toHaveTextContent('Master (Bac+5)');
			expect(etiquettes[6]).toHaveTextContent('Agriculture');
		});
		it('quand il n‘y a pas d‘étiquette, n‘affiche pas la liste d‘étiquette', async () => {
			const emploiEuropeServiceMock = anEmploiEuropeService();
			const resultatsService = aResultatRechercheEmploiEuropeList({
				nombreResultats: 2,
				offreList: [
					anEmploiEurope({
						id: '1',
						localisations: [{ ville: 'Paris' }],
						nomEntreprise: 'Entreprise 1',
						titre: 'Titre 1',
					}),
					anEmploiEurope({
						id: '2',
						nomEntreprise: 'Entreprise 2',
						titre: 'Titre 2',
					}),
				],
			});
			vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

			mockSmallScreen();
			mockUseRouter({
				query: {
					page: '1',
				},
			});

			render(
				<DependenciesProvider
					emploiEuropeService={emploiEuropeServiceMock}>
					<RechercherEmploisEurope />
				</DependenciesProvider>,
			);

			await screen.findAllByRole('list', { name: 'Offres d’emplois en Europe' });
			const etiquettesRecherche = screen.queryByRole('list', { name: 'Filtres de la recherche' });
			expect(etiquettesRecherche).not.toBeInTheDocument();
		});
	});

	describe('La liste des résultats de recherche des emplois en Europe', () => {
		describe('titre', () => {
			it('quand le titre n‘est pas présent, affiche un titre générique sans l‘attribut lang', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 1,
					offreList: [
						anEmploiEurope({
							id: '1',
							localisations: [{ ville: 'Paris' }],
							nomEntreprise: 'Entreprise 1',
							titre: undefined,
						}),
					],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const title = await screen.findByText('Offre d’emploi sans titre');
				expect(title).toBeVisible();
				expect(title).not.toHaveAttribute('lang');
			});
			describe('titre présent', () => {
				it('quand le titre est présent, affiche le titre avec l‘attribut langue associé', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								codeLangueDeLOffre: 'lb',
								id: '1',
								localisations: [{ ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'je suis le titre',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();
					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);

					const title = await screen.findByText('je suis le titre');
					expect(title).toHaveAttribute('lang', 'lb');
				});

				it('si la langue n‘est pas présente, affiche le titre avec l‘attribut langue inconnue', async () => {
					// GIVEN
					const emploiEuropeServiceMock = anEmploiEuropeService();
					const resultatsService = aResultatRechercheEmploiEuropeList({
						nombreResultats: 1,
						offreList: [
							anEmploiEurope({
								codeLangueDeLOffre: undefined,
								id: '1',
								localisations: [{ ville: 'Paris' }],
								nomEntreprise: 'Entreprise 1',
								titre: 'je suis le titre',
							}),
						],
					});
					vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

					mockSmallScreen();
					mockUseRouter({
						query: {
							motCle: 'Développeur',
							page: '1',
						},
					});

					// WHEN
					render(
						<DependenciesProvider
							emploiEuropeService={emploiEuropeServiceMock}>
							<RechercherEmploisEurope />
						</DependenciesProvider>,
					);

					const title = await screen.findByText('je suis le titre');
					expect(title).toHaveAttribute('lang', '');
				});
			});
		});
		describe('chaque résultat affiche des informations sur l’offre', () => {
			it('si le type de contrat est présent, affiche le type de contrat', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 1,
					offreList: [
						anEmploiEurope({
							id: '1',
							localisations: [{ ville: 'Paris' }],
							nomEntreprise: 'Entreprise 1',
							titre: undefined,
							typeContrat: 'Embauche directe',
						}),
					],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const listeDesResultats = await screen.findByRole('list', { name: 'Offres d’emplois en Europe' });
				const premierResultat = (await within(listeDesResultats).findAllByRole('listitem'))[0];

				// THEN
				const tagTypeContrat = within(premierResultat).getByText('Embauche directe');
				expect(tagTypeContrat).toBeVisible();
			});
			it('si le type de contrat n’est pas présent, n’affiche rien sur le type de contrat', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 1,
					offreList: [
						anEmploiEurope({
							id: '1',
							localisations: [{ ville: 'Paris' }],
							nomEntreprise: 'Entreprise 1',
							titre: undefined,
							typeContrat: '',
						}),
					],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const listeDesResultats = await screen.findByRole('list', { name: 'Offres d’emplois en Europe' });
				const premierResultat = (await within(listeDesResultats).findAllByRole('listitem'))[0];

				// THEN
				const tagTypeContrat = within(premierResultat).queryByText('Embauche directe');
				expect(tagTypeContrat).not.toBeInTheDocument();
			});

			it('si le temps de travail est présent, affiche le temps de travail', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 1,
					offreList: [anEmploiEurope({ tempsDeTravail: 'Temps partiel' })],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const listeDesResultats = await screen.findByRole('list', { name: 'Offres d’emplois en Europe' });
				const premierResultat = (await within(listeDesResultats).findAllByRole('listitem'))[0];

				// THEN
				const tagTypeContrat = within(premierResultat).getByText('Temps partiel');
				expect(tagTypeContrat).toBeVisible();
			});
			it('si le niveau d’études est présent, affiche le niveau d’études', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 1,
					offreList: [anEmploiEurope({ niveauEtudes: NiveauDEtudesLibelle.SUPERIEUR_COURT })],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const listeDesResultats = await screen.findByRole('list', { name: 'Offres d’emplois en Europe' });
				const premierResultat = (await within(listeDesResultats).findAllByRole('listitem'))[0];

				// THEN
				const tagTypeContrat = within(premierResultat).getByText('Supérieur court (Bac+2 maximum)');
				expect(tagTypeContrat).toBeVisible();
			});
			it('si le niveau d’études est "Niveau d‘études non spécifié", n’affiche pas le niveau d’études', async () => {
				// GIVEN
				const emploiEuropeServiceMock = anEmploiEuropeService();
				const resultatsService = aResultatRechercheEmploiEuropeList({
					nombreResultats: 1,
					offreList: [anEmploiEurope({ niveauEtudes: NiveauDEtudesLibelle.NON_SPECIFIE })],
				});
				vi.spyOn(emploiEuropeServiceMock, 'rechercherEmploiEurope').mockResolvedValue(createSuccess(resultatsService));

				mockSmallScreen();
				mockUseRouter({
					query: {
						motCle: 'Développeur',
						page: '1',
					},
				});

				// WHEN
				render(
					<DependenciesProvider
						emploiEuropeService={emploiEuropeServiceMock}>
						<RechercherEmploisEurope />
					</DependenciesProvider>,
				);
				const listeDesResultats = await screen.findByRole('list', { name: 'Offres d’emplois en Europe' });
				const premierResultat = (await within(listeDesResultats).findAllByRole('listitem'))[0];

				// THEN
				const tagTypeContrat = within(premierResultat).queryByText('Niveau d‘études non spécifié');
				expect(tagTypeContrat).not.toBeInTheDocument();
			});
		});
	});

	describe('affiche les services utiles', () => {
		it('l‘utilisateur voit les cartes de redirection', () => {
			mockUseRouter({});
			mockSmallScreen();

			render(
				<DependenciesProvider emploiEuropeService={anEmploiEuropeService()}>
					<RechercherEmploisEurope />
				</DependenciesProvider>);

			const listPartenaires = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
			const links = within(listPartenaires).getAllByRole('link');

			expect(listPartenaires).toBeVisible();
			expect(links).toHaveLength(4);
			expect(links[0]).toHaveAttribute('href', 'https://europa.eu/eures/portal/jv-se/home?lang=fr');
			expect(links[1]).toHaveAttribute('href', 'https://info.erasmusplus.fr/');
			expect(links[2]).toHaveAttribute('href', '/mes-aides');
			expect(links[3]).toHaveAttribute('href', '/experience-europe');
		});
	});
});
