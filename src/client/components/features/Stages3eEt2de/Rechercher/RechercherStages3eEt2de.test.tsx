import { render, screen, waitFor, within } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aMetierService } from '~/client/services/metiers/metier.fixture';
import { aStage3eEt2deService } from '~/client/services/stage3eEt2de/stage3eEt2de.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { aResultatRechercheStage3eEt2de, aStage3eEt2de } from '~/server/stage-3e-et-2de/domain/stage3eEt2de.fixture';

import RechercherStages3eEt2de from './RechercherStages3eEt2de';

vi.mock('next/head', async () => ({ default: (await import('~/client/components/head.mock')).HeadMock }));

describe('La recherche des stages de 3e et 2de', () => {
	describe('quand le composant est affiché sans paramètres de recherche dans l’URL', () => {
		it('ne fait pas d‘appel et affiche un formulaire de recherche', async () => {
			// GIVEN
			mockSmallScreen();
			mockUseRouter({});
			const stage3eEt2deServiceMock = aStage3eEt2deService();
			// WHEN
			const metierStage3eEt2deService = aMetierService();
			render(<DependenciesProvider stage3eEt2deService={stage3eEt2deServiceMock}
																	 localisationService={aLocalisationService()}
																	 metierStage3eEt2deService={metierStage3eEt2deService}>
				<RechercherStages3eEt2de />
			</DependenciesProvider>);

			// THEN
			const formulaireRecherche = await screen.findByRole('search', { name: 'Rechercher un stage de 3e et 2de' });
			expect(formulaireRecherche).toBeVisible();
			expect(stage3eEt2deServiceMock.rechercherStage3eEt2de).not.toHaveBeenCalled();
			const titre = await screen.findByRole('heading', {
				level: 1,
				name: 'Des milliers d’entreprises prêtes à vous accueillir pour votre stage de 3e et 2de',
			});
			expect(titre).toBeVisible();
		});
	});

	describe('quand le composant est affiché pour une recherche avec 1 résultat', () => {
		it('affiche le résultat de la recherche', async () => {
			// GIVEN
			mockSmallScreen();
			mockUseRouter({ query: { ...aCommuneQuery() } });
			const stage3eEt2deServiceMock = aStage3eEt2deService();
			const resultatRecherche = aResultatRechercheStage3eEt2de({
				nombreDeResultats: 1,
				resultats: [
					aStage3eEt2de({
						adresse: {
							codeDepartement: '75',
							codePostal: '75000',
							rueEtNumero: '1 rue de la Paix',
							ville: 'Paris',
						},
						domaine: 'Informatique',
						nomEntreprise: 'Entreprise 1',
					}),
				],
			});
			vi.spyOn(stage3eEt2deServiceMock, 'rechercherStage3eEt2de').mockResolvedValue(createSuccess(resultatRecherche));

			// WHEN
			render(<DependenciesProvider stage3eEt2deService={stage3eEt2deServiceMock}
																	 localisationService={aLocalisationService()}
																	 metierStage3eEt2deService={aMetierService()}>
				<RechercherStages3eEt2de />
			</DependenciesProvider>);
			const messageResultatsRecherche = await screen.findByText('1 entreprise accueillante');
			const resultatsUl = await screen.findAllByRole('list', { name: 'Stages de 3e et 2de' });
			// eslint-disable-next-line testing-library/no-node-access
			const resultats = resultatsUl[0].children;

			// THEN
			expect(messageResultatsRecherche).toBeVisible();
			expect(resultats).toHaveLength(resultatRecherche.nombreDeResultats);
			expect(resultats[0]).toHaveTextContent('Entreprise 1');
			expect(resultats[0]).toHaveTextContent('Informatique');
			expect(resultats[0]).toHaveTextContent('1 rue de la Paix');
			expect(resultats[0]).toHaveTextContent('75000 Paris');
		});
	});

	describe('quand le composant est affiché pour une recherche avec plusieurs résultats', () => {
		it('affiche le résultat de la recherche', async () => {
			// GIVEN
			mockSmallScreen();
			mockUseRouter({ query: { ...aCommuneQuery() } });
			const stage3eEt2deServiceMock = aStage3eEt2deService();
			const resultatRecherche = aResultatRechercheStage3eEt2de({
				nombreDeResultats: 2,
				resultats: [
					aStage3eEt2de({
						adresse: {
							codeDepartement: '75',
							codePostal: '75000',
							rueEtNumero: '1 rue de la Paix',
							ville: 'Paris',
						},
						domaine: 'Informatique',
						nomEntreprise: 'Entreprise 1',
					}),
					aStage3eEt2de({
						adresse: {
							codeDepartement: '75',
							codePostal: '75000',
							rueEtNumero: '2 rue de la Paix',
							ville: 'Paris',
						},
						domaine: 'Informatique',
						nomEntreprise: 'Entreprise 2',
					}),
				],
			});
			vi.spyOn(stage3eEt2deServiceMock, 'rechercherStage3eEt2de').mockResolvedValue(createSuccess(resultatRecherche));

			// WHEN
			render(<DependenciesProvider stage3eEt2deService={stage3eEt2deServiceMock}
																	 localisationService={aLocalisationService()}
																	 metierStage3eEt2deService={aMetierService()}>
				<RechercherStages3eEt2de />
			</DependenciesProvider>);
			const messageResultatsRecherche = await screen.findByText('2 entreprises accueillantes');
			const resultatsUl = await screen.findAllByRole('list', { name: 'Stages de 3e et 2de' });
			// eslint-disable-next-line testing-library/no-node-access
			const resultats = resultatsUl[0].children;

			// THEN
			expect(messageResultatsRecherche).toBeVisible();
			expect(resultats).toHaveLength(resultatRecherche.nombreDeResultats);
			expect(resultats[0]).toHaveTextContent('Entreprise 1');
			expect(resultats[0]).toHaveTextContent('Informatique');
			expect(resultats[0]).toHaveTextContent('1 rue de la Paix');
			expect(resultats[0]).toHaveTextContent('75000 Paris');
			expect(resultats[1]).toHaveTextContent('Entreprise 2');
			expect(resultats[1]).toHaveTextContent('Informatique');
			expect(resultats[1]).toHaveTextContent('2 rue de la Paix');
			expect(resultats[1]).toHaveTextContent('75000 Paris');
		});

		describe('quand la recherche est filtrée par métier', () => {
			it('affiche le résultat de la recherche', async () => {
				// GIVEN
				mockSmallScreen();
				mockUseRouter({ query: { libelleMetier: 'Informatique', ...aCommuneQuery() } });
				const stage3eEt2deServiceMock = aStage3eEt2deService();

				const resultatRecherche = aResultatRechercheStage3eEt2de({
					nombreDeResultats: 1,
					resultats: [
						aStage3eEt2de({
							adresse: {
								codeDepartement: '75',
								codePostal: '75000',
								rueEtNumero: '1 rue de la Paix',
								ville: 'Paris',
							},
							domaine: 'Informatique',
							nomEntreprise: 'Entreprise 1',
						}),
					],
				});

				vi.spyOn(stage3eEt2deServiceMock, 'rechercherStage3eEt2de').mockResolvedValue(createSuccess(resultatRecherche));

				// WHEN
				render(<DependenciesProvider stage3eEt2deService={stage3eEt2deServiceMock}
																		 localisationService={aLocalisationService()}
																		 metierStage3eEt2deService={aMetierService()}>
					<RechercherStages3eEt2de />
				</DependenciesProvider>);
				const messageResultatsRecherche = await screen.findByText('1 entreprise accueillante pour Informatique');

				// THEN
				expect(messageResultatsRecherche).toBeVisible();
			});
		});
	});

	describe('étiquettes de recherche', () => {
		it('je vois la localisation', async () => {
			mockSmallScreen();
			mockUseRouter({
				query: {
					...aCommuneQuery(
						{
							codePostal: '75001',
							ville: 'Paris',
						}),
				},
			});
			render(<DependenciesProvider stage3eEt2deService={aStage3eEt2deService()}
																	 localisationService={aLocalisationService()}
																	 metierStage3eEt2deService={aMetierService()}>
				<RechercherStages3eEt2de />
			</DependenciesProvider>);

			await screen.findAllByRole('list', { name: 'Stages de 3e et 2de' });

			const etiquetteList = screen.getByRole('list', { name: 'Filtres de la recherche' });
			expect(etiquetteList).toBeVisible();
			expect(within(etiquetteList).getByRole('listitem')).toHaveTextContent('Paris (75001)');
		});
	});

	describe('titre du document', () => {
		beforeEach(() => {
			mockSmallScreen();
			mockUseRouter({ query: { ...aCommuneQuery({ ville: 'Paris' }), codeMetier: 'D1102', libelleMetier: 'Boulangerie' } });
		});

		function renderRechercherStages3eEt2de(stage3eEt2deService = aStage3eEt2deService()) {
			render(<DependenciesProvider stage3eEt2deService={stage3eEt2deService}
																	 localisationService={aLocalisationService()}
																	 metierStage3eEt2deService={aMetierService()}>
				<RechercherStages3eEt2de />
			</DependenciesProvider>);
		}

		it('reprend le nombre de résultats, le métier et la ville', async () => {
			const stage3eEt2deServiceMock = aStage3eEt2deService();
			vi.spyOn(stage3eEt2deServiceMock, 'rechercherStage3eEt2de').mockResolvedValue(createSuccess(aResultatRechercheStage3eEt2de({ nombreDeResultats: 12 })));

			renderRechercherStages3eEt2de(stage3eEt2deServiceMock);

			await waitFor(() => expect(document.title).toBe('12 entreprises pour un stage de 3e et 2de pour Boulangerie, Paris | 1jeune1solution'));
		});

		it('indique qu’il n’y a aucun résultat', async () => {
			const stage3eEt2deServiceMock = aStage3eEt2deService();
			vi.spyOn(stage3eEt2deServiceMock, 'rechercherStage3eEt2de').mockResolvedValue(createSuccess(aResultatRechercheStage3eEt2de({
				nombreDeResultats: 0,
				resultats: [],
			})));

			renderRechercherStages3eEt2de(stage3eEt2deServiceMock);

			await waitFor(() => expect(document.title).toBe('Aucune entreprise pour un stage de 3e et 2de pour Boulangerie, Paris | 1jeune1solution'));
		});

		it('indique une erreur quand la demande est incorrecte', async () => {
			const stage3eEt2deServiceMock = aStage3eEt2deService();
			vi.spyOn(stage3eEt2deServiceMock, 'rechercherStage3eEt2de').mockResolvedValue(createFailure(ErreurMetier.DEMANDE_INCORRECTE));

			renderRechercherStages3eEt2de(stage3eEt2deServiceMock);

			await waitFor(() => expect(document.title).toBe('Erreur : Rechercher un stage de 3e et 2de | 1jeune1solution'));
		});
	});
});
