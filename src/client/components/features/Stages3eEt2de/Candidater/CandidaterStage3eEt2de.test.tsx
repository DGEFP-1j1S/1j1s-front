import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import CandidaterStage3eEt2de from '~/client/components/features/Stages3eEt2de/Candidater/CandidaterStage3eEt2de';
import {
	aDonneesEntrepriseStage3eEt2de,
} from '~/client/components/features/Stages3eEt2de/Candidater/donneesEntreprise.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSessionStorage } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStage3eEt2deService } from '~/client/services/stage3eEt2de/stage3eEt2de.service.fixture';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { ModeDeContact } from '~/server/stage-3e-et-2de/domain/candidatureStage3eEt2de';
import {
	aCandidatureEmailStage3eEt2de,
	aCandidatureEnPersonneStage3eEt2de,
	aCandidatureTelephoneStage3eEt2de,
} from '~/server/stage-3e-et-2de/domain/candidatureStage3eEt2de.fixture';

describe('Candidater à un stage de 3e et 2de', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	beforeEach(() => {
		mockUseRouter({});
	});
	it('affiche un titre avec le nom de l’entreprise', () => {
		// GIVEN
		const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
			{
				appellations: [
					{
						code: 'code',
						label: 'label',
					},
				],
				modeDeContact: ModeDeContact.IN_PERSON,
				nomEntreprise: 'Carrefour',
				siret: '37000000000000',
			});

		// WHEN
		render(
			<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
				<CandidaterStage3eEt2de
					donneesEntreprise={donneesEntreprise} />
			</DependenciesProvider>,
		);

		// THEN
		const titre = screen.getByRole('heading', { level: 1 });
		expect(titre).toBeVisible();
		expect(titre).toHaveTextContent('Je candidate à l’offre de stage de 3e ou de 2de de l’entreprise Carrefour');
	});

	describe('lorsque le mode de contact est par téléphone', () => {
		it('affiche un texte explicatif du process de candidature', () => {
			// GIVEN
			const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
				{
					appellations: [
						{
							code: 'code',
							label: 'label',
						},
					],
					modeDeContact: ModeDeContact.PHONE,
					nomEntreprise: 'Carrefour',
					siret: '37000000000000',
				});

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>,
			);

			// THEN
			const explicationPart1 = screen.getByText('Cette entreprise souhaite être contactée par téléphone. Merci de nous indiquer vos coordonnées.');
			const explicationPart2 = screen.getByText('Nous allons vous transmettre par e-mail le nom de la personne à contacter, son numéro de téléphone ainsi que des conseils pour présenter votre demande d’immersion. Ces informations sont personnelles et confidentielles. Elles ne peuvent pas être communiquées à d’autres personnes.');
			expect(explicationPart1).toBeVisible();
			expect(explicationPart2).toBeVisible();
		});
	});

	describe('lorsque le mode de contact est en personne', () => {
		it('affiche un texte explicatif du process de candidature', () => {
			// GIVEN
			const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
				{
					appellations: [
						{
							code: 'code',
							label: 'label',
						},
					],
					modeDeContact: ModeDeContact.IN_PERSON,
					nomEntreprise: 'Carrefour',
					siret: '37000000000000',
				});

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>,
			);

			// THEN
			const explicationPart1 = screen.getByText('Cette entreprise souhaite que vous vous présentiez directement pour candidater. Merci de nous indiquer vos coordonnées.');
			const explicationPart2 = screen.getByText('Vous recevrez par e-mail le nom de la personne à contacter ainsi que des conseils pour présenter votre demande d’immersion. Ces informations sont personnelles et confidentielles. Elles ne peuvent pas être communiquées à d’autres personnes.');
			expect(explicationPart1).toBeVisible();
			expect(explicationPart2).toBeVisible();
		});
	});

	describe('lorsque le mode de contact est par email', () => {
		it('affiche un texte explicatif du process de candidature', () => {
			// GIVEN
			const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
				{
					modeDeContact: ModeDeContact.EMAIL,
				});

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>,
			);

			// THEN
			const explicationPart = screen.getByText('Cette entreprise a choisi d’être contactée par e-mail. Veuillez compléter ce formulaire qui sera transmis à l’entreprise.');
			expect(explicationPart).toBeVisible();
		});
	});


	describe('formulaire de candidature', () => {
		describe('lorsque que le mode de contact est par téléphone ou en personne', () => {
			it('affiche un bouton de retour à la recherche', async () => {
				// GIVEN
				const routerBack = vi.fn();
				mockUseRouter({ back: routerBack });
				mockSessionStorage({
					getItem: vi.fn().mockReturnValue('/page-1'),
				});
				const user = userEvent.setup();
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService({ get: vi.fn().mockReturnValue(true) })} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				const boutonRetour = screen.getByRole('link', { name: 'Retour à la recherche' });
				await user.click(boutonRetour);

				// THEN
				expect(boutonRetour).toBeVisible();
				expect(routerBack).toHaveBeenCalled();
			});

			it('affiche un message indiquant que tous les champs sont obligatoires', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				// THEN
				const message = screen.getByText('Tous les champs sont obligatoires (sauf mention contraire)');
				expect(message).toBeVisible();
			});
			it('affiche un formulaire de candidature en une étape', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				// THEN
				const formulaire = screen.getByRole('form', { name: 'Candidater à l’offre de stage de 3e et 2de de l’entreprise Carrefour' });
				expect(formulaire).toBeVisible();
				const inputPrenom = screen.getByRole('textbox', { name: 'Prénom Exemple : Alexis' });
				expect(inputPrenom).toHaveAttribute('autocomplete', 'given-name');
				expect(inputPrenom).toBeVisible();
				const inputNom = screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' });
				expect(inputNom).toHaveAttribute('autocomplete', 'family-name');
				expect(inputNom).toBeVisible();
				const inputEmail = screen.getByRole('textbox', { name: 'E-mail Exemple : alexis.dupont@example.com' });
				expect(inputEmail).toHaveAttribute('autocomplete', 'email');
				expect(inputEmail).toBeVisible();
				const boutonEnvoyer = screen.getByRole('button', { name: 'Envoyer les informations' });
				expect(boutonEnvoyer).toBeVisible();
			});
			it('affiche un message indiquant que les données sont collectées et traitées par la DGEFP', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					},
				);

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);

				// THEN
				const message = screen.getByText('Vous êtes informé que vos données à caractère personnel sont collectées et traitées par la DGEFP pour répondre à votre demande. Pour en savoir plus vous pouvez consulter la politique de confidentialité et les CGU de la DGEFP. En cliquant sur "Envoyer mes informations", vos données seront transmises à la mission locale de la zone géographique dans laquelle vous résidez pour que celle-ci prenne contact avec vous');
				expect(message).toBeVisible();
			});
		});
		describe('lorsque que le mode de contact est par mail', () => {
			it('affiche un bouton de retour à la recherche', async () => {
				// GIVEN
				const routerBack = vi.fn();
				mockUseRouter({ back: routerBack });
				mockSessionStorage({
					getItem: vi.fn().mockReturnValue('/page-1'),
				});
				const user = userEvent.setup();
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						modeDeContact: ModeDeContact.EMAIL,
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService({ get: vi.fn().mockReturnValue(true) })} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				const boutonRetour = screen.getByRole('link', { name: 'Retour à la recherche' });
				await user.click(boutonRetour);

				// THEN
				expect(boutonRetour).toBeVisible();
				expect(routerBack).toHaveBeenCalled();
			});
			it('affiche un message indiquant que tous les champs sont obligatoires', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						modeDeContact: ModeDeContact.EMAIL,
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				// THEN
				const message = screen.getByText('Tous les champs sont obligatoires (sauf mention contraire)');
				expect(message).toBeVisible();
			});


			it('affiche une étape de formulaire concernant les données personnelles qui peuvent être remplis automatiquement', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						modeDeContact: ModeDeContact.EMAIL,
						nomEntreprise: 'Carrefour',
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);

				// THEN
				const formulaire = screen.getByRole('form', { name: 'Candidater à l’offre de stage de 3e et 2de de l’entreprise Carrefour' });
				expect(formulaire).toBeVisible();
				const inputPrenom = screen.getByRole('textbox', { name: 'Prénom Exemple : Alexis' });
				expect(inputPrenom).toHaveAttribute('autocomplete', 'given-name');
				expect(inputPrenom).toBeVisible();
				const inputNom = screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' });
				expect(inputNom).toHaveAttribute('autocomplete', 'family-name');
				expect(inputNom).toBeVisible();
				const inputEmail = screen.getByRole('textbox', { name: 'E-mail Exemple : alexis.dupont@example.com' });
				expect(inputEmail).toHaveAttribute('autocomplete', 'email');
				expect(inputEmail).toBeVisible();
				const inputTelephone = screen.getByRole('textbox', { name: 'Téléphone Exemples : 0601020304 ou +33601020304' });
				expect(inputTelephone).toHaveAttribute('autocomplete', 'tel');
				expect(inputTelephone).toBeVisible();
			});
			it('le champ du message pour l’entreprise est limité à 500 caractères', () => {
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						modeDeContact: ModeDeContact.EMAIL,
						nomEntreprise: 'Carrefour',
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);

				// THEN
				const champMessage = screen.getByRole('textbox', { name: 'Votre message à l’entreprise Partagez vos motivations, vos attentes ou toute information que vous jugeriez utiles (500 charactères maximum)' });
				expect(champMessage).toBeVisible();
				expect(champMessage).toHaveAttribute('maxlength', '500');
			});
			it('le champ du message pour l’entreprise est pré-rempli', () => {
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						modeDeContact: ModeDeContact.EMAIL,
						nomEntreprise: 'Carrefour',
					});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);

				// THEN
				const champMessage = screen.getByRole('textbox', { name: 'Votre message à l’entreprise Partagez vos motivations, vos attentes ou toute information que vous jugeriez utiles (500 charactères maximum)' });
				expect(champMessage).toBeVisible();
				expect(champMessage).toHaveValue(`Bonjour,
 
J’ai trouvé votre entreprise sur le site https://www.1jeune1solution.gouv.fr/
[Rédigez ici votre email de motivation.]

Pourriez-vous me contacter par mail ou par téléphone pour me proposer un rendez-vous ?

En vous remerciant,
`);
			});
			it('affiche un message indiquant que les données sont collectées et traitées par la DGEFP', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					},
				);

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);

				// THEN
				const message = screen.getByText('Vous êtes informé que vos données à caractère personnel sont collectées et traitées par la DGEFP pour répondre à votre demande. Pour en savoir plus vous pouvez consulter la politique de confidentialité et les CGU de la DGEFP. En cliquant sur "Envoyer mes informations", vos données seront transmises à la mission locale de la zone géographique dans laquelle vous résidez pour que celle-ci prenne contact avec vous');
				expect(message).toBeVisible();
			});
		});
	});


	describe('affiche les métiers de l’entreprise dans le formulaire', () => {
		describe('lorsque l’entreprise ne propose qu’un seul métier', () => {
			it('affiche un champ de sélection du métier désactivé avec comme valeur le métier', () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label du métier',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					},
				);

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				// THEN
				const inputAppellation = screen.getByRole('textbox', { name: 'Métier sur lequel porte la demande d’immersion Un ou plusieurs métiers ont été renseignés par l’entreprise' });
				expect(inputAppellation).toBeVisible();
				expect(inputAppellation).toHaveAttribute('readonly');
				expect(inputAppellation).toHaveValue('label du métier');
				expect(inputAppellation).toHaveAttribute('type', 'text');
			});
		});

		describe('lorsque l’entreprise propose plusieurs métiers', () => {
			it('affiche un champ de sélection du métier actif', async () => {
				// GIVEN
				const user = userEvent.setup();
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
							{
								code: 'code2',
								label: 'label2',
							}],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					},
				);

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={aStage3eEt2deService()}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>,
				);
				const selectMetier = screen.getByRole('combobox', { name: 'Métier sur lequel porte la demande d’immersion Un ou plusieurs métiers ont été renseignés par l’entreprise' });

				await user.click(selectMetier);
				const metierOptions = screen.getAllByRole('option');

				// THEN
				expect(selectMetier).toBeVisible();
				expect(selectMetier).not.toBeDisabled();
				expect(metierOptions).toHaveLength(2);
				expect(metierOptions[0]).toHaveTextContent('label');
				expect(metierOptions[1]).toHaveTextContent('label2');
			});
		});
	});

	describe('soumission du formulaire', () => {
		describe('lorsque la candidature est par telephone', () => {
			describe('lorsque plusieurs métiers sont proposés', () => {
				it('envoie les données de la candidature', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: '12345',
									label: 'Chargé / Chargée de relations entreprises',
								},
								{
									code: '67890',
									label: 'Boulanger / Boulangère',
								}],
							modeDeContact: ModeDeContact.PHONE,
							nomEntreprise: 'Carrefour',
							siret: '12345678912345',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						metierLabel: 'Chargé / Chargée de relations entreprises',
						nom: 'Dupont',
						prenom: 'Alexis',
					});

					// WHEN
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const expectedCandidature3eEt2de = aCandidatureTelephoneStage3eEt2de({
						appellationCode: '12345',
						email: 'alexis.dupont@example.com',
						modeDeContact: ModeDeContact.PHONE,
						nom: 'Dupont',
						prenom: 'Alexis',
						siret: '12345678912345',
					});
					expect(stage3eEt2deService.candidaterStage3eEt2de).toHaveBeenCalledWith(expectedCandidature3eEt2de);
				});
			});

			describe('lorsque un seul métier est proposé', () => {
				it('envoie les données de la candidature', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: '12345',
									label: 'Boulanger / Boulangère',
								},
							],
							modeDeContact: ModeDeContact.PHONE,
							nomEntreprise: 'Carrefour',
							siret: '12345678912345',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						nom: 'Dupont',
						prenom: 'Alexis',
					});

					// WHEN
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const expectedCandidature3eEt2de = aCandidatureTelephoneStage3eEt2de({
						appellationCode: '12345',
						email: 'alexis.dupont@example.com',
						modeDeContact: ModeDeContact.PHONE,
						nom: 'Dupont',
						prenom: 'Alexis',
						siret: '12345678912345',
					});
					expect(stage3eEt2deService.candidaterStage3eEt2de).toHaveBeenCalledWith(expectedCandidature3eEt2de);
				});
			});
		});

		describe('lorsque la candidature est en personne', () => {
			describe('lorsque plusieurs métiers sont proposés', () => {
				it('envoie les données de la candidature', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: '12345',
									label: 'Chargé / Chargée de relations entreprises',
								},
								{
									code: '67890',
									label: 'Boulanger / Boulangère',
								}],
							modeDeContact: ModeDeContact.IN_PERSON,
							nomEntreprise: 'Carrefour',
							siret: '12345678912345',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						metierLabel: 'Chargé / Chargée de relations entreprises',
						nom: 'Dupont',
						prenom: 'Alexis',
					});

					// WHEN
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const expectedCandidature3eEt2de = aCandidatureEnPersonneStage3eEt2de({
						appellationCode: '12345',
						email: 'alexis.dupont@example.com',
						modeDeContact: ModeDeContact.IN_PERSON,
						nom: 'Dupont',
						prenom: 'Alexis',
						siret: '12345678912345',
					});
					expect(stage3eEt2deService.candidaterStage3eEt2de).toHaveBeenCalledWith(expectedCandidature3eEt2de);
				});
			});

			describe('lorsque un seul métier est proposé', () => {
				it('envoie les données de la candidature', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: '12345',
									label: 'Boulanger / Boulangère',
								},
							],
							modeDeContact: ModeDeContact.IN_PERSON,
							nomEntreprise: 'Carrefour',
							siret: '12345678912345',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						nom: 'Dupont',
						prenom: 'Alexis',
					});

					// WHEN
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const expectedCandidature3eEt2de = aCandidatureEnPersonneStage3eEt2de({
						appellationCode: '12345',
						email: 'alexis.dupont@example.com',
						modeDeContact: ModeDeContact.IN_PERSON,
						nom: 'Dupont',
						prenom: 'Alexis',
						siret: '12345678912345',
					});
					expect(stage3eEt2deService.candidaterStage3eEt2de).toHaveBeenCalledWith(expectedCandidature3eEt2de);
				});
			});
		});

		describe('lorsque la candidature est par mail', () => {
			describe('lorsque plusieurs métiers sont proposés', () => {
				it('envoie les données de la candidature', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: '12345',
									label: 'Chargé / Chargée de relations entreprises',
								},
								{
									code: '67890',
									label: 'Boulanger / Boulangère',
								}],
							modeDeContact: ModeDeContact.EMAIL,
							nomEntreprise: 'Carrefour',
							siret: '12345678912345',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createSuccess(undefined));
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						message: 'Coucou',
						metierLabel: 'Chargé / Chargée de relations entreprises',
						nom: 'Dupont',
						prenom: 'Alexis',
						telephone: '0600110011',
					});
					// TODO ajouter message

					// WHEN
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const expectedCandidature3eEt2de = aCandidatureEmailStage3eEt2de({
						appellationCode: '12345',
						email: 'alexis.dupont@example.com',
						message: 'Coucou',
						modeDeContact: ModeDeContact.EMAIL,
						nom: 'Dupont',
						prenom: 'Alexis',
						siret: '12345678912345',
						telephone: '0600110011',
					});
					expect(stage3eEt2deService.candidaterStage3eEt2de).toHaveBeenCalledWith(expectedCandidature3eEt2de);
				});
			});

			describe('lorsque un seul métier est proposé', () => {
				it('envoie les données de la candidature', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: '12345',
									label: 'Boulanger / Boulangère',
								},
							],
							modeDeContact: ModeDeContact.EMAIL,
							nomEntreprise: 'Carrefour',
							siret: '12345678912345',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createSuccess(undefined));
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						message: 'Coucou',
						nom: 'Dupont',
						prenom: 'Alexis',
						telephone: '0600110011',
					});
					// TODO ajouter message

					// WHEN
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const expectedCandidature3eEt2de = aCandidatureEmailStage3eEt2de({
						appellationCode: '12345',
						email: 'alexis.dupont@example.com',
						message: 'Coucou',
						modeDeContact: ModeDeContact.EMAIL,
						nom: 'Dupont',
						prenom: 'Alexis',
						siret: '12345678912345',
						telephone: '0600110011',
					});
					expect(stage3eEt2deService.candidaterStage3eEt2de).toHaveBeenCalledWith(expectedCandidature3eEt2de);
				});
			});
		});

		describe('lorsque la candidature est envoyée avec succès', () => {
			describe('lorsque la candidature est par téléphone', () => {
				it('affiche une page de succès', async () => {
					// GIVEN
					mockUseRouter({ query: { modeDeContact: ModeDeContact.PHONE } });
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de({
						appellations: [
							{
								code: '12345',
								label: 'Chargé / Chargée de relations entreprises',
							},
							{
								code: '67890',
								label: 'Boulanger / Boulangère',
							}],
						modeDeContact: ModeDeContact.PHONE,
						nomEntreprise: 'Carrefour',
						siret: '12345678912345',
					});
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createSuccess(undefined));

					// WHEN
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);

					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						metierLabel: 'Chargé / Chargée de relations entreprises',
						nom: 'Dupont',
						prenom: 'Alexis',
					});
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const contenuStatus = screen.getByRole('status');
					const titre = within(contenuStatus).getByRole('heading', { level: 1 });
					expect(titre).toBeVisible();
					expect(titre).toHaveTextContent('Félicitations, vos informations ont bien été envoyées');
					const texte = screen.getByText('L’entreprise a choisi d’être contactée par télephone. Elle recevra donc vos informations et vous recontactera par la suite.');
					expect(texte).toBeVisible();
				});
			});

			describe('lorsque la candidature est en personne', () => {
				it('affiche une page de succès', async () => {
					// GIVEN
					mockUseRouter({ query: { modeDeContact: ModeDeContact.IN_PERSON } });
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de({
						appellations: [
							{
								code: '12345',
								label: 'Chargé / Chargée de relations entreprises',
							},
							{
								code: '67890',
								label: 'Boulanger / Boulangère',
							}],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '12345678912345',
					});
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createSuccess(undefined));

					// WHEN
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						metierLabel: 'Chargé / Chargée de relations entreprises',
						nom: 'Dupont',
						prenom: 'Alexis',
					});
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const contenuStatus = screen.getByRole('status');
					const titre = within(contenuStatus).getByRole('heading', { level: 1 });
					expect(titre).toBeVisible();
					expect(titre).toHaveTextContent('Félicitations, vos informations ont bien été envoyées');
					const texte = screen.getByText('L’entreprise a choisi que vous vous présentiez directement pour candidater. Elle recevra donc vos informations et vous recontactera par la suite.');
					expect(texte).toBeVisible();
				});
			});

			it('affiche un lien de retour à l’accueil', async () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de({
					appellations: [
						{
							code: '12345',
							label: 'Chargé / Chargée de relations entreprises',
						},
						{
							code: '67890',
							label: 'Boulanger / Boulangère',
						}],
					modeDeContact: ModeDeContact.PHONE,
					nomEntreprise: 'Carrefour',
					siret: '12345678912345',
				});
				const user = userEvent.setup();
				const stage3eEt2deService = aStage3eEt2deService();
				vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createSuccess(undefined));

				// WHEN
				render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>);
				await remplirLeFormulaire({
					email: 'alexis.dupont@example.com',
					metierLabel: 'Chargé / Chargée de relations entreprises',
					nom: 'Dupont',
					prenom: 'Alexis',
				});
				const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
				await user.click(envoyerBouton);

				// THEN
				const lienAccueil = screen.getByRole('link', { name: 'Retour à l’accueil' });
				expect(lienAccueil).toBeVisible();
				expect(lienAccueil).toHaveAttribute('href', '/');
			});

			it('affiche un bouton de retour à la recherche', async () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: '12345',
								label: 'Chargé / Chargée de relations entreprises',
							},
							{
								code: '67890',
								label: 'Boulanger / Boulangère',
							},
						],
						modeDeContact: ModeDeContact.PHONE,
						nomEntreprise: 'Carrefour',
						siret: '12345678912345',
					});
				const routerBack = vi.fn();
				mockUseRouter({ back: routerBack });
				mockSessionStorage({
					getItem: vi.fn().mockReturnValue('/page-1'),
				});
				const user = userEvent.setup();
				const stage3eEt2deService = aStage3eEt2deService();
				vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createSuccess(undefined));

				// WHEN
				render(<DependenciesProvider sessionStorageService={aStorageService({ get: vi.fn().mockReturnValue(true) })} stage3eEt2deService={stage3eEt2deService}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>);
				await remplirLeFormulaire({
					email: 'alexis.dupont@example.com',
					metierLabel: 'Chargé / Chargée de relations entreprises',
					nom: 'Dupont',
					prenom: 'Alexis',
				});
				const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
				await user.click(envoyerBouton);
				const boutonRetour = screen.getByRole('link', { name: 'Continuer la recherche' });
				await user.click(boutonRetour);

				// THEN
				expect(boutonRetour).toBeVisible();
				expect(routerBack).toHaveBeenCalled();
			});
		});

		describe('lorsque l’envoi de la candidature échoue', () => {
			describe('lorsque l’erreur est un conflit d’identifiant', () => {
				it('affiche une page d’erreur', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: 'code',
									label: 'label',
								},
							],
							modeDeContact: ModeDeContact.IN_PERSON,
							nomEntreprise: 'Carrefour',
							siret: '37000000000000',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createFailure(ErreurMetier.CONFLIT_D_IDENTIFIANT));

					// WHEN
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						nom: 'Dupont',
						prenom: 'Alexis',
					});
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const contenuAlert = screen.getByRole('alert');
					const title = within(contenuAlert).getByRole('heading', { level: 1, name: 'Une erreur est survenue' });
					expect(title).toBeVisible();
					const text = screen.getByText('Une candidature pour cette offre avec cette adresse email existe déjà.');
					expect(text).toBeVisible();
				});
			});
			describe('lorque l’erreur est un autre type d’erreur', () => {
				it('affiche une page d’erreur', async () => {
					// GIVEN
					const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
						{
							appellations: [
								{
									code: 'code',
									label: 'label',
								},
							],
							modeDeContact: ModeDeContact.IN_PERSON,
							nomEntreprise: 'Carrefour',
							siret: '37000000000000',
						},
					);
					const user = userEvent.setup();
					const stage3eEt2deService = aStage3eEt2deService();
					vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

					// WHEN
					render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
						<CandidaterStage3eEt2de
							donneesEntreprise={donneesEntreprise} />
					</DependenciesProvider>);
					await remplirLeFormulaire({
						email: 'alexis.dupont@example.com',
						nom: 'Dupont',
						prenom: 'Alexis',
					});
					const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
					await user.click(envoyerBouton);

					// THEN
					const contenuAlert = screen.getByRole('alert');
					const title = within(contenuAlert).getByRole('heading', { level: 1, name: 'Une erreur est survenue' });
					expect(title).toBeVisible();
					const text = screen.getByText('Nous n’avons pas pu envoyer vos informations à l’entreprise. Veuillez réessayer plus tard');
					expect(text).toBeVisible();
				});
			});
			it('affiche un bouton de retour au formulaire', async () => {
				// GIVEN
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de(
					{
						appellations: [
							{
								code: 'code',
								label: 'label',
							},
						],
						modeDeContact: ModeDeContact.IN_PERSON,
						nomEntreprise: 'Carrefour',
						siret: '37000000000000',
					},
				);
				const user = userEvent.setup();
				const stage3eEt2deService = aStage3eEt2deService();
				vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				// WHEN
				render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>);
				await remplirLeFormulaire({
					email: 'alexis.dupont@example.com',
					nom: 'Dupont',
					prenom: 'Alexis',
				});
				const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
				await user.click(envoyerBouton);
				const boutonRetour = screen.getByRole('button', { name: 'Retour au formulaire' });
				await user.click(boutonRetour);

				// THEN
				const formulaire = screen.getByRole('form');
				expect(formulaire).toBeVisible();
				const nouveauInputPrenom = screen.getByRole('textbox', { name: 'Prénom Exemple : Alexis' });
				expect(nouveauInputPrenom).toBeVisible();
				const nouveauInputNom = screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' });
				expect(nouveauInputNom).toBeVisible();
				const nouveauInputEmail = screen.getByRole('textbox', { name: 'E-mail Exemple : alexis.dupont@example.com' });
				expect(nouveauInputEmail).toBeVisible();
				const nouveauEnvoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
				expect(nouveauEnvoyerBouton).toBeVisible();
			});

			it('affiche un bouton de retour à la recherche', async () => {
				// GIVEN
				const routerBack = vi.fn();
				mockUseRouter({ back: routerBack });
				mockSessionStorage({
					getItem: vi.fn().mockReturnValue('/page-1'),
				});
				const user = userEvent.setup();
				const stage3eEt2deService = aStage3eEt2deService();
				vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de({
					appellations: [
						{
							code: '12345',
							label: 'Chargé / Chargée de relations entreprises',
						},
					],
					modeDeContact: ModeDeContact.PHONE,
					nomEntreprise: 'Carrefour',
					siret: '12345678912345',
				});

				// WHEN
				render(<DependenciesProvider sessionStorageService={aStorageService({ get: vi.fn().mockReturnValue(true) })} stage3eEt2deService={stage3eEt2deService}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>);
				await remplirLeFormulaire({
					email: 'test@example.com',
					nom: 'Dupont',
					prenom: 'Alexis',
				});
				const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
				await user.click(envoyerBouton);
				const boutonRetour = screen.getByRole('link', { name: 'Retour à la recherche' });
				await user.click(boutonRetour);

				// THEN
				expect(boutonRetour).toBeVisible();
				expect(routerBack).toHaveBeenCalled();
			});
		});

		describe('pendant l’envoi de la candidature', () => {
			it('le bouton de soumission n’est pas disponible', async () => {
				// GIVEN
				const user = userEvent.setup();
				const stage3eEt2deService = aStage3eEt2deService();
				vi.spyOn(stage3eEt2deService, 'candidaterStage3eEt2de').mockImplementation(() => new Promise(() => {
				}));
				const donneesEntreprise = aDonneesEntrepriseStage3eEt2de({
					appellations: [
						{
							code: '12345',
							label: 'Chargé / Chargée de relations entreprises',
						},
						{
							code: '67890',
							label: 'Boulanger / Boulangère',
						},
					],
					modeDeContact: ModeDeContact.PHONE,
					nomEntreprise: 'Carrefour',
					siret: '12345678912345',
				});

				render(<DependenciesProvider sessionStorageService={aStorageService()} stage3eEt2deService={stage3eEt2deService}>
					<CandidaterStage3eEt2de
						donneesEntreprise={donneesEntreprise} />
				</DependenciesProvider>);

				await remplirLeFormulaire({
					email: 'test@example.com',
					metierLabel: 'Chargé / Chargée de relations entreprises',
					nom: 'Dupont',
					prenom: 'Alexis',
				});

				// WHEN
				const envoyerBouton = screen.getByRole('button', { name: 'Envoyer les informations' });
				await user.click(envoyerBouton);

				// THEN
				expect(envoyerBouton).toBeDisabled();
			});
		});
	});
});

type DonneesFormulaires = {
	prenom: string
	nom: string
	email: string
	metierLabel?: string
	telephone?: string
	message?: string
}
async function remplirLeFormulaire(donneesFormulaire: DonneesFormulaires) {
	const user = userEvent.setup();

	const inputPrenom = screen.getByRole('textbox', { name: 'Prénom Exemple : Alexis' });
	await user.type(inputPrenom, donneesFormulaire.prenom);
	const inputNom = screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' });
	await user.type(inputNom, donneesFormulaire.nom);
	const inputEmail = screen.getByRole('textbox', { name: 'E-mail Exemple : alexis.dupont@example.com' });
	await user.type(inputEmail, donneesFormulaire.email);
	if (donneesFormulaire.metierLabel) {
		await selectionnerUnMetier(donneesFormulaire.metierLabel);
	}
	if (donneesFormulaire.telephone) {
		const inputTelephone = screen.getByRole('textbox', { name: 'Téléphone Exemples : 0601020304 ou +33601020304' });
		await user.type(inputTelephone, donneesFormulaire.telephone);
	}
	if (donneesFormulaire.message) {
		const inputMessage = screen.getByRole('textbox', { name: 'Votre message à l’entreprise Partagez vos motivations, vos attentes ou toute information que vous jugeriez utiles (500 charactères maximum)' });
		await user.clear(inputMessage);
		await user.type(inputMessage, donneesFormulaire.message);
	}
}

async function selectionnerUnMetier(metierLabel: string) {
	const user = userEvent.setup();
	const selectMetier = screen.getByRole('combobox', { name: 'Métier sur lequel porte la demande d’immersion Un ou plusieurs métiers ont été renseignés par l’entreprise' });
	await user.click(selectMetier);

	const optionDuMetierLabel = screen.getByRole('option', { name: metierLabel });
	await user.click(optionDuMetierLabel);
}
