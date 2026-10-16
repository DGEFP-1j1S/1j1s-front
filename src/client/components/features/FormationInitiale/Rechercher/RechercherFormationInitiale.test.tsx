import { render, screen, within } from '@testing-library/react';

import {
	RechercherFormationInitiale,
} from '~/client/components/features/FormationInitiale/Rechercher/RechercherFormationInitiale';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	aFormationInitiale,
	aFormationInitialeService,
	aResultatFormationInitiale,
} from '~/client/services/formationInitiale/formationInitiale.service.fixture';
import { createSuccess } from '~/server/errors/either';

describe('RechercherFormationInitiale', () => {
	beforeEach(() => {
		mockSmallScreen();
	});
	it('Au chargement de la page, il n’y a pas de résultats par défaut affiché', () => {
		// GIVEN
		mockUseRouter({});
		const aFormationService = aFormationInitialeService();

		// WHEN
		render(<DependenciesProvider formationInitialeService={aFormationService}>
			<RechercherFormationInitiale />
		</DependenciesProvider>);

		// THEN
		const resultatsRecherche = screen.queryByLabelText('Formations Initiales');
		expect(resultatsRecherche).not.toBeInTheDocument();
	});

	describe('Lorsque je fais une recherche de formation initiale avec une query non vide', () => {
		beforeEach(() => {
			mockUseRouter({
				query: {
					motCle: 'boulanger',
					page: '1',
				},
			});
		});
		it('appelle le service concerné', async () => {
			const aFormationService = aFormationInitialeService();
			const formationsInitiales = [aFormationInitiale({ libelle: 'boulanger' })];
			const resultatFormationInitiales = aResultatFormationInitiale({
				formationsInitiales: formationsInitiales,
			});
			const resultatFormationInitiale = createSuccess(resultatFormationInitiales);
			vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValue(resultatFormationInitiale);

			render(<DependenciesProvider formationInitialeService={aFormationService}>
				<RechercherFormationInitiale />
			</DependenciesProvider>);

			await screen.findByText(/150 formations pour boulanger/);
			expect(aFormationService.rechercherFormationInitiale).toHaveBeenCalledTimes(1);
			expect(aFormationService.rechercherFormationInitiale).toHaveBeenCalledWith({ motCle: 'boulanger', page: '1' });
		});

		describe('lorsqu‘il y a au moins un résultat', () => {
			it('la carte redirige vers la bonne url', async () => {
				const aFormationService = aFormationInitialeService();
				const identifiant = 'FOR.1234';
				const formationsInitiales = [aFormationInitiale({ identifiant: identifiant, libelle: 'boulanger' })];
				const resultatFormationInitiale = aResultatFormationInitiale({
					formationsInitiales: formationsInitiales,
				});
				const resultRechercheFormation = createSuccess(resultatFormationInitiale);
				vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValue(resultRechercheFormation);

				render(<DependenciesProvider formationInitialeService={aFormationService}>
					<RechercherFormationInitiale />
				</DependenciesProvider>,
				);

				const carteList = await screen.findByRole('list', { name: 'Formations Initiales' });
				const cartes = within(carteList).getAllByRole('listitem');
				expect(within(cartes[0]).getByRole('link')).toHaveAttribute('href', `/formations-initiales/${encodeURIComponent(identifiant)}`);
			});

			describe('le nombre de résultat', () => {
				it('lorsqu‘il y a un résultat je vois le nombre de résultats affiché au singulier', async () => {
					const aFormationService = aFormationInitialeService();
					const formationsInitiales = [aFormationInitiale({ libelle: 'boulanger' })];
					const resultFormationInitiale = aResultatFormationInitiale({
						formationsInitiales: formationsInitiales,
						nombreDeResultat: 1,
					});
					const resultatFormationInitiale = createSuccess(resultFormationInitiale);
					vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValue(resultatFormationInitiale);

					render(<DependenciesProvider formationInitialeService={aFormationService}>
						<RechercherFormationInitiale />
					</DependenciesProvider>,
					);

					expect(await screen.findByText(/1 formation/)).toBeVisible();
				});

				it('lorsqu‘il y a plusieurs résultats je vois le nombre de résultats affiché', async () => {
					const aFormationService = aFormationInitialeService();

					const formationsInitiales = [aFormationInitiale({ libelle: 'boulanger' }),
						aFormationInitiale({ libelle: 'patissier' })];
					const resultRechercheFormation = createSuccess(aResultatFormationInitiale({
						formationsInitiales: formationsInitiales,
						nombreDeResultat: 2,
					}));
					vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValue(resultRechercheFormation);

					render(<DependenciesProvider formationInitialeService={aFormationService}>
						<RechercherFormationInitiale />
					</DependenciesProvider>,
					);

					expect(await screen.findByText(/2 formations pour boulanger/)).toBeVisible();
				});
			});

			describe('les cartes', () => {
				it('lorsqu‘il y a des résultats doit affiché le bon nombre de cards', async () => {
					const aFormationService = aFormationInitialeService();
					const formationsInitiales = [aFormationInitiale({ libelle: 'boulanger' }), aFormationInitiale({ libelle: 'patissier' })];
					const resultatFormationInitiale = createSuccess(aResultatFormationInitiale({
						formationsInitiales: formationsInitiales,
					}));
					vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValueOnce(resultatFormationInitiale);
					render(<DependenciesProvider formationInitialeService={aFormationService}> <RechercherFormationInitiale />
					</DependenciesProvider>);
					const listeCards = await screen.findByRole('list', { name: 'Formations Initiales' });
					const cardTitles = within(listeCards).getAllByRole('heading', { level: 3 });
					expect(cardTitles).toHaveLength(2);
					expect(cardTitles[0]).toBeVisible();
					expect(cardTitles[0]).toHaveTextContent('boulanger');
					expect(cardTitles[1]).toBeVisible();
					expect(cardTitles[1]).toHaveTextContent('patissier');
				});

				describe('tags', () => {
					it('je vois les tags', async () => {
						const aFormationService = aFormationInitialeService();
						const formationsInitiales = [aFormationInitiale({
							duree: '1 an',
							isCertifiante: true,
							niveauDeSortie: 'Bac + 2',
						})];
						const resultatFormationInitiale = createSuccess(aResultatFormationInitiale({ formationsInitiales: formationsInitiales }));
						vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValueOnce(resultatFormationInitiale);
						render(<DependenciesProvider formationInitialeService={aFormationService}>
							<RechercherFormationInitiale />
						</DependenciesProvider>);
						const listeTags = await screen.findByRole('list', { name: 'Caractéristiques de l‘offre' });
						const tags = within(listeTags).getAllByRole('listitem');
						expect(tags).toHaveLength(3);
						expect(tags[0]).toHaveTextContent('Certifiante');
						expect(tags[1]).toHaveTextContent('Bac + 2');
						expect(tags[2]).toHaveTextContent('1 an');
					});

					it('lorsque la formation n‘est pas certifiante, je ne vois pas le tag Certifiante', async () => {
						const aFormationService = aFormationInitialeService();
						const resultatFormationInitiale = createSuccess(aResultatFormationInitiale({
							formationsInitiales: [aFormationInitiale({
								duree: '1 an',
								isCertifiante: false,
								niveauDeSortie: 'Bac + 2',
							})],
						}));
						vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValueOnce(resultatFormationInitiale);
						
						render(<DependenciesProvider formationInitialeService={aFormationService}>
							<RechercherFormationInitiale />
						</DependenciesProvider>);

						const listeTags = await screen.findByRole('list', { name: 'Caractéristiques de l‘offre' });
						const tags = within(listeTags).getAllByRole('listitem');
						expect(tags).toHaveLength(2);
						expect(tags[0]).toHaveTextContent('Bac + 2');
						expect(tags[1]).toHaveTextContent('1 an');
					});
				});
			});
		});
	});

	describe('Lorsque je fais une recherche de formation initiale sans domaine précisé', () => {
		beforeEach(() => {
			mockUseRouter({
				query: {
					page: '1',
				},
			});
		});

		it('appelle le service concerné', async () => {
			const aFormationService = aFormationInitialeService();
			const formationsInitiales = [aFormationInitiale({ libelle: 'boulanger' }), aFormationInitiale({ libelle: 'patissier' })];
			const resultatRechercheFormation = createSuccess(aResultatFormationInitiale({ formationsInitiales: formationsInitiales }));
			vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValue(resultatRechercheFormation);

			render(<DependenciesProvider formationInitialeService={aFormationService}>
				<RechercherFormationInitiale />
			</DependenciesProvider>);

			await screen.findByText(/[0-9]+ formations/);
			expect(aFormationService.rechercherFormationInitiale).toHaveBeenCalledTimes(1);
			expect(aFormationService.rechercherFormationInitiale).toHaveBeenCalledWith({ motCle: undefined, page: '1' });
		});

		it('lorsqu‘il y a plusieurs résultats je vois le nombre de résultats affiché sans précision sur le mot clé recherché', async () => {
			const aFormationService = aFormationInitialeService();
			const formationsInitiales = [aFormationInitiale({ libelle: 'boulanger' }), aFormationInitiale({ libelle: 'patissier' })];
			const resultatFormationsInitiales = aResultatFormationInitiale({
				formationsInitiales: formationsInitiales,
				nombreDeResultat: 2,
			});
			const resultatFormationInitiale = createSuccess(resultatFormationsInitiales);
			vi.spyOn(aFormationService, 'rechercherFormationInitiale').mockResolvedValue(resultatFormationInitiale);
			render(<DependenciesProvider formationInitialeService={aFormationService}>
				<RechercherFormationInitiale />
			</DependenciesProvider>);

			expect(await screen.findByText(/[0-9]+ formations$/)).toBeVisible();
		});
	});

	describe('Je vois une section dédiée aux services qui pourraient m’intéresser', () => {
		beforeEach(() => {
			mockUseRouter({});
		});

		it('la section porte le nom "Des services faits pour vous"', () => {
			// GIVEN
			const aFormationService = aFormationInitialeService();

			// WHEN
			render(<DependenciesProvider formationInitialeService={aFormationService}>
				<RechercherFormationInitiale />
			</DependenciesProvider>);

			// THEN
			const titreSection = screen.getByRole('heading', { level: 2, name: /Des services faits pour vous/ });
			expect(titreSection).toBeVisible();
		});

		describe('la section contient une liste de redirections, dont', () => {
			it('une première redirection vers un article sur Carif Oref', () => {
				// GIVEN
				const aFormationService = aFormationInitialeService();

				// WHEN
				render(<DependenciesProvider formationInitialeService={aFormationService}>
					<RechercherFormationInitiale />
				</DependenciesProvider>);

				// THEN
				const servicesList = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
				const servicesItems = within(servicesList).getAllByRole('listitem');
				const metierCard = within(servicesItems[0]).getByRole('link');
				expect(metierCard).toHaveAttribute('href', '/articles/le-reseau-des-carif-oref-vous-accompagne');
			});
			it('une deuxième redirection vers la page des formations en apprentissage', () => {
				// GIVEN
				const aFormationService = aFormationInitialeService();

				// WHEN
				render(<DependenciesProvider formationInitialeService={aFormationService}>
					<RechercherFormationInitiale />
				</DependenciesProvider>);

				// THEN
				const servicesList = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
				const servicesItems = within(servicesList).getAllByRole('listitem');
				const formationsEnApprentissageCard = within(servicesItems[1]).getByRole('link');
				expect(formationsEnApprentissageCard).toHaveAttribute('href', '/formations/apprentissage');
			});
			it('une troisième redirection vers le service Parcoursup', () => {
				// GIVEN
				const aFormationService = aFormationInitialeService();

				// WHEN
				render(<DependenciesProvider formationInitialeService={aFormationService}>
					<RechercherFormationInitiale />
				</DependenciesProvider>);

				// THEN
				const servicesList = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
				const servicesItems = within(servicesList).getAllByRole('listitem');
				const parcoursupCard = within(servicesItems[2]).getByRole('link');
				expect(parcoursupCard).toHaveAttribute('href', 'https://www.parcoursup.fr/');
			});
			it('une quatrième redirection vers le service Mon Compte Formation', () => {
				// GIVEN
				const aFormationService = aFormationInitialeService();

				// WHEN
				render(<DependenciesProvider formationInitialeService={aFormationService}>
					<RechercherFormationInitiale />
				</DependenciesProvider>);

				// THEN
				const servicesList = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
				const servicesItems = within(servicesList).getAllByRole('listitem');
				const monCompteFormationCard = within(servicesItems[3]).getByRole('link');
				expect(monCompteFormationCard).toHaveAttribute('href', 'https://www.moncompteformation.gouv.fr/espace-prive/html/#/');
			});
			it('une cinquième redirection vers le service Pix', () => {
				// GIVEN
				const aFormationService = aFormationInitialeService();

				// WHEN
				render(<DependenciesProvider formationInitialeService={aFormationService}>
					<RechercherFormationInitiale />
				</DependenciesProvider>);

				// THEN
				const servicesList = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
				const servicesItems = within(servicesList).getAllByRole('listitem');
				const monCompteFormationCard = within(servicesItems[4]).getByRole('link');
				expect(monCompteFormationCard).toHaveAttribute('href', 'https://app.pix.fr/campagnes/NRABNT181/presentation');
			});
		});
	});
});
