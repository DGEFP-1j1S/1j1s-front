import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import RechercherAlternance from '~/client/components/features/Alternance/Rechercher/RechercherAlternance';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aMetierService } from '~/client/services/metiers/metier.fixture';
import { MetierService } from '~/client/services/metiers/metier.service';
import { AlternanceSource } from '~/server/alternances/domain/alternance';
import {
	aRechercheAlternance,
	aRechercheEntrepriseAlternance,
	aRechercheMatchaAlternance,
	aRecherchePEJobAlternance,
} from '~/server/alternances/domain/alternance.fixture';

describe('RechercherAlternance', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('affiche un formulaire pour la recherche de formations, sans échantillon de résultat', () => {
		// GIVEN
		const métierServiceMock = aMetierService();
		const localisationServiceMock = aLocalisationService();
		mockUseRouter({});

		// WHEN
		render(
			<DependenciesProvider
				metierLbaService={métierServiceMock}
				localisationService={localisationServiceMock}>
				<RechercherAlternance />
			</DependenciesProvider>,
		);
		const formulaireRechercheAlternance = screen.getByRole('form');

		// THEN
		expect(formulaireRechercheAlternance).toBeInTheDocument();
		expect(screen.queryByText(/^[0-9]+ résulat(s)? $/)).not.toBeInTheDocument();
		expect(screen.queryByText('Paris (75001)')).not.toBeInTheDocument();
	});

	it('affiche la section "nos articles"', () => {
		mockUseRouter({});

		render(
			<DependenciesProvider
				metierLbaService={aMetierService()}
				localisationService={aLocalisationService()}>
				<RechercherAlternance resultats={aRechercheAlternance()} />
			</DependenciesProvider>,
		);

		const section = screen.getByRole('heading', { name: /Consultez nos articles/i });
		const card = screen.getByRole('heading', { name: /Une aide exceptionnelle pour l’apprentissage/i });

		expect(section).toBeVisible();
		expect(card).toBeVisible();
	});

	it('affiche la section "services faits pour vous"', () => {
		mockUseRouter({});

		render(
			<DependenciesProvider
				metierLbaService={aMetierService()}
				localisationService={aLocalisationService()}>
				<RechercherAlternance resultats={aRechercheAlternance()} />
			</DependenciesProvider>,
		);

		const section = screen.getByRole('heading', { name: /Découvrez des services faits pour vous/i });
		const cardCampagneApprentissage = screen.getByRole('heading', { name: /L’apprentissage est-il fait pour vous ?/i });
		const cardPass = screen.getByRole('heading', { name: /Recherche une offre d'alternance dans la fonction publique/i });
		const cardONISEP = screen.getByRole('heading', { name: /Besoin d‘informations sur les métiers ?/i });

		expect(section).toBeVisible();
		expect(cardCampagneApprentissage).toBeVisible();
		expect(cardPass).toBeVisible();
		expect(cardONISEP).toBeVisible();
	});

	describe('quand une recherche est effectuée', () => {
		let métierServiceMock: MetierService;
		let localisationServiceMock: LocalisationService;
		const alternanceFixture = [
			aRechercheMatchaAlternance({
				entreprise: { nom: 'MONSIEUR MICHEL' },
				id: 'an-id-matchas',
				source: AlternanceSource.MATCHA,
				titre: 'Ouvrier boulanger / Ouvrière boulangère',
			}),
			aRecherchePEJobAlternance({
				entreprise: { nom: 'une entreprise' },
				id: 'an-id-pe',
				source: AlternanceSource.FRANCE_TRAVAIL,
				titre: 'un titre',
			}),
		];

		const entrepriseFixture = [
			aRechercheEntrepriseAlternance({
				adresse: 'une adresse',
				candidaturePossible: true,
				id: '0123456789',
				nom: 'UN NOM 1',
				secteurs: ['secteur 1', 'secteur 2'],
			}),
			aRechercheEntrepriseAlternance({
				candidaturePossible: false,
				id: '1234567890',
				nom: 'UN NOM 2',
				secteurs: ['secteur 1', 'secteur 2'],
			}),
		];

		const resultatFixture = aRechercheAlternance({
			entrepriseList: entrepriseFixture,
			offreList: alternanceFixture,
		});

		beforeEach(() => {
			métierServiceMock = aMetierService();
			localisationServiceMock = aLocalisationService();
			mockUseRouter({
				query: {
					codeCommune: '75056',
					codePostal: '75001',
					codeRomes: ['D1102', 'D1104'],
					distanceCommune: '10',
					latitudeCommune: '48.859',
					libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
					longitudeCommune: '2.347',
					ville: 'Paris',
				},
			});
		});

		it('les offres d’alternances sont affichées', async () => {
			// GIVEN

			// WHEN
			render(
				<DependenciesProvider
					metierLbaService={métierServiceMock}
					localisationService={localisationServiceMock}>
					<RechercherAlternance resultats={resultatFixture} />
				</DependenciesProvider>,
			);
			const formulaireRechercheAlternance = screen.getByRole('form');

			// THEN
			expect(formulaireRechercheAlternance).toBeInTheDocument();

			const filtresRecherche = await screen.findAllByText('Paris (75001)');
			expect(filtresRecherche.length >= 1).toBe(true);
			const messageResultats = await screen.findByText(/résultats pour Boulangerie, pâtisserie, chocolaterie/);
			expect(messageResultats).toBeInTheDocument();


			const resultatsUl = await screen.findAllByRole('list', { name: 'Offres d’alternances' });
			// eslint-disable-next-line testing-library/no-node-access
			const resultListOffre = resultatsUl[0].children;
			expect(resultListOffre).toHaveLength(alternanceFixture.length);
			expect(await screen.findByText(alternanceFixture[0].titre)).toBeInTheDocument();
			expect(await screen.findByText(alternanceFixture[1].titre)).toBeInTheDocument();
		});

		describe('nombre de résultats d‘alternances', () => {
			it('et qu‘il y a des résultats, affiche le nombre de contrats d’alternance', async () => {
				const user = userEvent.setup();
				const offresAlternance = [aRechercheMatchaAlternance(), aRecherchePEJobAlternance({ id: 'pejob' })];
				const resultats = aRechercheAlternance({
					entrepriseList: [],
					offreList: offresAlternance,
				});

				render(
					<DependenciesProvider
						metierLbaService={aMetierService()}
						localisationService={aLocalisationService()}>
						<RechercherAlternance resultats={resultats} />
					</DependenciesProvider>,
				);

				const onglet = await screen.findByRole('tab', { name: 'Contrats d‘alternance' });
				await user.click(onglet);

				expect(screen.getByText(/2 résultats pour/)).toBeVisible();
			});

			it('et qu‘il n‘y a pas de résultat, affiche le message sans résultat associé aux contrats d‘alternances', async () => {
				const user = userEvent.setup();
				const resultats = aRechercheAlternance({
					entrepriseList: [],
					offreList: [],
				});

				render(
					<DependenciesProvider
						metierLbaService={aMetierService()}
						localisationService={aLocalisationService()}>
						<RechercherAlternance resultats={resultats} />
					</DependenciesProvider>,
				);

				const onglet = await screen.findByRole('tab', { name: 'Contrats d‘alternance' });
				await user.click(onglet);

				expect(screen.getByText(/0 résultat/)).toBeVisible();
				expect(screen.getByText('Aucun contrat d‘alternance ne correspond à votre recherche.')).toBeVisible();
				expect(screen.getByText('Vous pouvez consulter les entreprises ou modifier votre recherche.')).toBeVisible();
			});
		});

		describe('lorsque je séléctionne les entreprises', () => {
			it('je vois uniquement les entreprises', async () => {
				render(
					<DependenciesProvider
						metierLbaService={métierServiceMock}
						localisationService={localisationServiceMock}>
						<RechercherAlternance resultats={resultatFixture} />
					</DependenciesProvider>,
				);
				const onglet = await screen.findByRole('tab', { name: 'Entreprises' });
				const user = userEvent.setup();

				await user.click(onglet);
				expect(onglet).toHaveAttribute('aria-selected', 'true');

				const resultatsUl = await screen.findAllByRole('list', { name: 'Entreprises' });
				// eslint-disable-next-line testing-library/no-node-access
				const resultListEntreprise = resultatsUl[0].children;
				expect(resultListEntreprise).toHaveLength(entrepriseFixture.length);
				expect(screen.getByText(entrepriseFixture[0].nom)).toBeVisible();
				expect(screen.getByText(entrepriseFixture[1].nom)).toBeVisible();
			});

			describe('nombre de résultat d‘entreprises', () => {
				it('lorsqu‘il y a des résultats, affiche le nombre d’entreprises', async () => {
					const user = userEvent.setup();
					const entrepriseList = [aRechercheEntrepriseAlternance(), aRechercheEntrepriseAlternance({ id: 'id 2' })];
					const resultats = aRechercheAlternance({
						entrepriseList,
						offreList: [],
					});

					render(
						<DependenciesProvider
							metierLbaService={aMetierService()}
							localisationService={aLocalisationService()}>
							<RechercherAlternance resultats={resultats} />
						</DependenciesProvider>,
					);

					const onglet = await screen.findByRole('tab', { name: 'Entreprises' });
					await user.click(onglet);

					expect(screen.getByText(/2 résultats pour/)).toBeVisible();
				});

				it('lorsqu‘il n‘y a pas de résultat, affiche le message sans résultat associé aux entreprises', async () => {
					const user = userEvent.setup();
					const resultats = aRechercheAlternance({
						entrepriseList: [],
						offreList: [],
					});

					render(
						<DependenciesProvider
							metierLbaService={aMetierService()}
							localisationService={aLocalisationService()}>
							<RechercherAlternance resultats={resultats} />
						</DependenciesProvider>,
					);

					const onglet = await screen.findByRole('tab', { name: 'Entreprises' });
					await user.click(onglet);

					expect(screen.getByText(/0 résultat/)).toBeVisible();
					expect(screen.getByText('Aucune entreprise ne correspond à votre recherche.')).toBeVisible();
					expect(screen.getByText('Vous pouvez consulter les contrats d‘alternance ou modifier votre recherche.')).toBeVisible();
				});
			});
		});
	});
});
