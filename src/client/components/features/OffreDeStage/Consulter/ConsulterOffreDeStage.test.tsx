import {render, screen, within} from '@testing-library/react';

import {ConsulterOffreDeStage} from '~/client/components/features/OffreDeStage/Consulter/ConsulterOffreDeStage';
import {mockUseRouter} from '~/client/components/useRouter.mock';
import {DependenciesProvider} from '~/client/context/dependenciesContainer.context';
import {aDateService} from '~/client/services/date/date.service.fixture';
import {aStorageService} from '~/client/services/storage/storage.service.fixture';
import {RemunerationPeriode} from '~/server/stages/domain/remunerationPeriode';
import {anOffreDeStage, anOffreDeStageLocalisation} from '~/server/stages/domain/stages.fixture';
import {DomainesStage} from '~/server/stages/repository/domainesStage';

describe('ConsulterOffreDeStage', () => {
	const offreDeStage = anOffreDeStage({
		dateDeDebutMax: '2024-09-01',
		dateDeDebutMin: '2024-09-01',
		description: 'stage en graphisme description',
		domaines: [],
		dureeEnJour: 180,
		dureeEnJourMax: 180,
		employeur: {
			description: 'Je suis une description de l‘employeur',
			logoUrl: '',
			nom: 'Nom de l‘employeur',
			siteUrl: '',
		},
		id: '1111',
		localisation: {
			codePostal: '75001',
			departement: '75',
			pays: 'FR',
			region: 'IDF',
			ville: 'Paris',
		},
		slug: 'stage-en-graphisme',
		teletravailPossible: true,
		titre: 'stage en graphisme',
		urlDeCandidature: 'http://candidature',
	});

	beforeEach(() => {
		mockUseRouter({});
	});

	describe('affiche l’offre de stage avec les bonnes informations', () => {
		it('affiche le nom du stage', () => {
			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterOffreDeStage offreDeStage={anOffreDeStage({titre: 'stage en graphisme'})}/>
			</DependenciesProvider>);

			const intituléOffreDeStage = screen.getByText('stage en graphisme');

			expect(intituléOffreDeStage).toBeVisible();
		});

		it('affiche le nom de l‘employeur', () => {
			render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
				<ConsulterOffreDeStage
					offreDeStage={anOffreDeStage({employeur: {nom: 'Je suis le nom de l‘employeur'}})}/>
			</DependenciesProvider>);

			const nomEntreprise = screen.getByText('Je suis le nom de l‘employeur');

			expect(nomEntreprise).toBeVisible();
		});

		describe('description du poste', () => {
			it('quand elle est fournie, affiche la description du poste', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
						<ConsulterOffreDeStage offreDeStage={anOffreDeStage({
							description: 'Je suis une description du poste',
						})}/>
					</DependenciesProvider>
				);

				expect(
					screen.getByRole('heading', {name: 'Description du poste'}),
				).toBeVisible();

				expect(
					screen.getByText('Je suis une description du poste'),
				).toBeVisible();
			});

			it('quand elle n‘est pas fournie, n‘affiche pas la description du poste', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterOffreDeStage offreDeStage={anOffreDeStage({description: ''})}/>
				</DependenciesProvider>);

				const descriptionPoste = screen.queryByText('Description du poste');

				expect(descriptionPoste).not.toBeInTheDocument();
			});
		});

		describe('description de l‘employeur', () => {
			it('lorsqu‘elle est fournie, affiche la description de l‘employeur', () => {
				const offreDeStage = anOffreDeStage({
					employeur: {
						description: 'Je suis une description de l‘employeur',
						nom: 'nom',
					},
				});
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage offreDeStage={offreDeStage}/></DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Description de l‘employeur'}),
				).toBeVisible();

				expect(
					screen.getByText('Je suis une description de l‘employeur'),
				).toBeVisible();
			});

			it('quand elle n‘est pas fournie, n‘affiche pas la description de l‘employeur', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterOffreDeStage offreDeStage={anOffreDeStage({
						employeur: {
							description: '',
							nom: 'nom',
						},
					})}/>
				</DependenciesProvider>);

				const descriptionPoste = screen.queryByText('Description de l‘employeur');

				expect(descriptionPoste).not.toBeInTheDocument();
			});
		});


		describe('la rémunération du stage', () => {
			it('Lorsque la rémunération n‘est pas renseignée affiche "Non renseignée', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({remunerationMax: undefined, remunerationMin: undefined})}/>
				</DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Rémunération'}),
				).toBeVisible();

				expect(
					screen.getByText('Non renseignée'),
				).toBeVisible();
			});

			it('lorsque la rémunération min et max est à 0, affiche "Aucune"', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({remunerationMax: 0, remunerationMin: 0})}/>
				</DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Rémunération'}),
				).toBeVisible();

				expect(
					screen.getByText('Aucune'),
				).toBeVisible();
			});

			it('lorsque la rémunération min et max sont identiques affiche cette rémunération', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({remunerationMax: 1234, remunerationMin: 1234})}/>
				</DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Rémunération'}),
				).toBeVisible();

				expect(
					screen.getByText('1234 €'),
				).toBeVisible();

				expect(screen.queryByText('entre')).not.toBeInTheDocument();
			});

			it('lorsque la rémunération min et max sont proposées affiche l‘intervalle de rémunération', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({remunerationMax: 2000, remunerationMin: 2})}/>
				</DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Rémunération'}),
				).toBeVisible();

				expect(
					screen.getByText('entre 2 € et 2000 €'),
				).toBeVisible();
			});

		});

		describe('période de rémunération', () => {
			it('quand la rémunération n‘est pas renseignée n‘affiche pas la période de rémunération', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({
							remunerationMax: undefined,
							remunerationMin: undefined,
							remunerationPeriode: RemunerationPeriode.YEARLY,
						})}/>
				</DependenciesProvider>);

				expect(
					screen.queryByRole('heading', {name: 'Période de paiement'}),
				).not.toBeInTheDocument();
			});

			it('quand la rémunération est renseignée mais la période de rémunération n‘est pas renseignée affiche "Par mois"', () => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({
							remunerationMax: 10000000,
							remunerationMin: 10000000,
							remunerationPeriode: undefined,
						})}/>
				</DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Période de paiement'}),
				).toBeVisible();

				expect(
					screen.getByText('Par mois'),
				).toBeVisible();
			});

			it.each([
				[RemunerationPeriode.HOURLY, 'Par heure'],
				[RemunerationPeriode.DAILY, 'Par jour'],
				[RemunerationPeriode.MONTHLY, 'Par mois'],
				[RemunerationPeriode.YEARLY, 'Par an'],
			])('quand la rémunération et la période de rémunération sont renseignées, affiche la période de rémunération', (remunerationPeriode, labelRemunerationAttendu) => {
				render(<DependenciesProvider sessionStorageService={aStorageService()}
				                             dateService={aDateService()}>
					<ConsulterOffreDeStage
						offreDeStage={anOffreDeStage({
							remunerationMax: 10000000,
							remunerationMin: 10000000,
							remunerationPeriode,
						})}/>
				</DependenciesProvider>);

				expect(
					screen.getByRole('heading', {name: 'Période de paiement'}),
				).toBeVisible();

				expect(
					screen.getByText(labelRemunerationAttendu),
				).toBeVisible();
			});
		});

		describe('dans les étiquettes', () => {
			it('concernant les domaines du stage', () => {
				const offreDeStage = anOffreDeStage({domaines: [DomainesStage.ACHAT, DomainesStage.CONSEIL]});

				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
				</DependenciesProvider>);

				const displayedTagsList = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
				const displayedTagsTextContents = within(displayedTagsList).getAllByRole('listitem').map((listItem) => listItem.textContent);
				expect(displayedTagsTextContents).toContain(DomainesStage.ACHAT);
				expect(displayedTagsTextContents).toContain(DomainesStage.CONSEIL);
			});

			it('n‘affiche pas le domaine non renseigné', () => {
				const offreDeStage = anOffreDeStage({domaines: [DomainesStage.ACHAT, DomainesStage.NON_RENSEIGNE]});

				render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
					<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
				</DependenciesProvider>);

				const displayedTagsList = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
				const displayedTagsTextContents = within(displayedTagsList).getAllByRole('listitem').map((listItem) => listItem.textContent);
				expect(displayedTagsTextContents).toContain(DomainesStage.ACHAT);
				expect(displayedTagsTextContents).not.toContain(DomainesStage.NON_RENSEIGNE);
			});

			describe('concernant la localisation du stage', () => {
				it('affiche la ville du stage quand elle est présente', () => {
					const localisation = anOffreDeStageLocalisation({ville: 'Paris'});
					const offreDeStage = anOffreDeStage({localisation: localisation});

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					const displayedTagsList = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const displayedTagsTextContents = within(displayedTagsList).getAllByRole('listitem').map((listItem) => listItem.textContent);
					expect(displayedTagsTextContents).toContain(localisation.ville);
				});

				it('quand la ville du stage n’est pas présente, affiche le département si présent', () => {
					const localisation = anOffreDeStageLocalisation({departement: 'Val de marne'});
					const offreDeStage = anOffreDeStage({localisation: localisation});

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					const displayedTagsList = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const displayedTagsTextContents = within(displayedTagsList).getAllByRole('listitem').map((listItem) => listItem.textContent);
					expect(displayedTagsTextContents).toContain(localisation.departement);
				});

				it('quand la ville et le département du stage ne sont pas présents, affiche la région si présente', () => {
					const localisation = anOffreDeStageLocalisation({region: 'Ile de France'});
					const offreDeStage = anOffreDeStage({localisation: localisation});

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					const displayedTagsList = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const displayedTagsTextContents = within(displayedTagsList).getAllByRole('listitem').map((listItem) => listItem.textContent);
					expect(displayedTagsTextContents).toContain(localisation.region);
				});
			});
			describe('concernant la durée du stage', () => {
				it('affiche une durée catégorisée quand elle est supérieure à 0', () => {
					const offreDeStage = anOffreDeStage({dureeEnJour: 60});

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					const displayedTagsList = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const displayedTagsTextContents = within(displayedTagsList).getAllByRole('listitem').map((listItem) => listItem.textContent);
					expect(displayedTagsTextContents).toContain('2 mois');
				});
			});
			describe('concernant la date de début du stage', () => {
				it('affiche la date de début précise quand il y a une date précise', () => {
					const offreDeStage = anOffreDeStage({dateDeDebutMax: '2024-09-01', dateDeDebutMin: '2024-09-01'});
					const dateService = aDateService();
					vi.spyOn(dateService, 'formatToHumanReadableDate').mockReturnValue('1 septembre 2024');

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={dateService}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					const tags = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const tagDateDebut = within(tags).getAllByRole('listitem')
						.find((listItem) => listItem.textContent === 'Débute le 1 septembre 2024');
					expect(tagDateDebut).toBeVisible();
				});

				it('affiche la période de date de début quand la date de début est une période de date', () => {
					const offreDeStage = anOffreDeStage({dateDeDebutMax: '2024-09-30', dateDeDebutMin: '2024-09-01'});
					const dateService = aDateService();
					vi.spyOn(dateService, 'formatToHumanReadableDate')
						.mockReturnValueOnce('1 septembre 2024')
						.mockReturnValueOnce('30 septembre 2024');

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={dateService}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					expect(screen.getByText('Débute entre le 1 septembre 2024 et le 30 septembre 2024')).toBeVisible();

					const tags = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const tagDateDebut = within(tags).getAllByRole('listitem')
						.find((listItem) => listItem.textContent === 'Débute entre le 1 septembre 2024 et le 30 septembre 2024');
					expect(tagDateDebut).toBeVisible();
				});
				it('n’affiche pas le tag de date de début quand il n‘y a pas de date de début', () => {
					const offreDeStage = anOffreDeStage({dateDeDebutMin: undefined});

					render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
						<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
					</DependenciesProvider>);

					const tags = screen.getByRole('list', {name: 'Caractéristiques de l‘offre de stage'});
					const tagDateDebut = within(tags).getAllByRole('listitem')
						.find((listItem) => listItem.textContent?.includes('Débute le')) ?? null;
					expect(tagDateDebut).not.toBeInTheDocument();
				});
			});
		});
	});

	it('permet de postuler à l‘offre de stage', () => {
		render(<DependenciesProvider sessionStorageService={aStorageService()} dateService={aDateService()}>
			<ConsulterOffreDeStage offreDeStage={offreDeStage}/>
		</DependenciesProvider>);

		const linkPostulerOffreEmploi = screen.getByRole('link', {name: 'Postuler - nouvelle fenêtre'});

		expect(linkPostulerOffreEmploi).toHaveAttribute('href', offreDeStage.urlDeCandidature);
		expect(linkPostulerOffreEmploi).toHaveAttribute('target', '_blank');
	});
});
