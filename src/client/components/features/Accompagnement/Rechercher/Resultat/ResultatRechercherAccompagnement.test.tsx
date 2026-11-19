import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	anEtablissementAccompagnementService,
} from '~/client/services/etablissementAccompagnement/etablissementAccompagnement.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import {
	JourSemaine,
	TypeEtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {
	anEtablissementAccompagnement, anEtablissementAccompagnementAdresse,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

import { ResultatRechercherAccompagnement } from './ResultatRechercherAccompagnement';

const formulaireContact = {
	adresseMail: 'mariotintin@mail.com',
	age: '16 ans',
	nom: 'Tintin',
	prenom: 'Mario',
	telephone: '0123456789',
	ville: 'Paris',
};

describe('<RésultatRechercherAccompagnement/>', () => {
	beforeAll(async () => {
		mockScrollIntoView();
		mockSmallScreen()
		await import('@gouvfr/dsfr/dist/dsfr.module');
		window.dsfr?.start();
	});
	it('affiche adresse formatée', () => {
		const etablissement = anEtablissementAccompagnement({
			adresse: anEtablissementAccompagnementAdresse({
				codePostal: '75011',
				nomCommune: 'Paris',
				numeroVoie: '29-31 rue des Boulets',
			}),
		});

		const établissementAccompagnementService = anEtablissementAccompagnementService();
		const localisationService = aLocalisationService();
		vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

		render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																 localisationService={localisationService}>
			<ResultatRechercherAccompagnement etablissement={etablissement} />
		</DependenciesProvider>);

		expect(screen.getByText('29-31 rue des Boulets, 75011 Paris')).toBeVisible();
	});
	describe('Quand le type d‘accompagnement est une mission locale', () => {
		it('n‘affiche pas l‘email', () => {
			// GIVEN
			const email = 'email';
			const etablissement = anEtablissementAccompagnement({
				email: email,
				type: TypeEtablissement.MISSION_LOCALE,
			});

			// WHEN
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			expect(screen.queryByText(email)).not.toBeInTheDocument();
		});

		it('affiche le bouton "Être contacté.e"', () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				type: TypeEtablissement.MISSION_LOCALE,
			});

			// WHEN
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			// NOTE (BRUJ 11/04/2024): Plusieurs boutons car une version desktop et une version mobile
			const button = screen.getAllByRole('button', { name: 'Être contacté.e' })[0];
			expect(button).toBeVisible();
		});
	});

	describe('Quand le type d‘accompagnement n‘est pas une mission locale', () => {
		it('affiche l‘email', () => {
			// GIVEN
			const email = 'email';
			const etablissement = anEtablissementAccompagnement({
				email: email,
				type: TypeEtablissement.INFO_JEUNE,
			});

			// WHEN
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			const link = screen.getAllByRole('link', { name: 'Contacter par mail - nouvelle fenêtre' })[0];
			expect(link).toBeVisible();
			expect(link).toHaveAttribute('href', `mailto:${email}`);
			expect(link).toHaveAttribute('title', 'Contacter par mail - adresse mail');
		});

		it('n‘affiche pas le bouton "Être contacté.e"', () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				type: TypeEtablissement.INFO_JEUNE,
			});

			// WHEN
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			expect(screen.queryByRole('button', { name: 'Être contacté.e' })).not.toBeInTheDocument();
		});
	});

	describe('Quand aucune horaire n’est disponible', () => {
		it('n‘affiche pas "Voir les horaires d’ouverture"', () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				horaires: [],
				type: TypeEtablissement.INFO_JEUNE,
			});

			// WHEN
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			expect(screen.queryByText('Voir les horaires d‘ouverture')).not.toBeInTheDocument();
		});
	});

	describe('Quand des horaires sont disponibles', () => {
		it('affiche "Voir les horaires d’ouverture" et les horaires', async () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				horaires: [
					{
						heures: [
							{
								début: '09:00',
								fin: '12:00',
							},
						],
						jour: JourSemaine.LUNDI,
					},
				],
					type: TypeEtablissement.INFO_JEUNE,
			});

			// WHEN
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			expect(screen.getByText('Horaires d\'ouverture :')).toBeVisible();
			expect(screen.getByText('Lundi')).toBeVisible();
			expect(screen.getByText('09h')).toBeVisible();
			expect(screen.getByText('12h')).toBeVisible();
		});
	});

	describe('lorsque je fais une demande de contact', () => {
		beforeEach(() => {
			mockSmallScreen();
		});

		it('je vois la modale de formulaire s‘afficher', async () => {
			const user = userEvent.setup();
			const etablissement = anEtablissementAccompagnement({
				type: TypeEtablissement.MISSION_LOCALE,
			});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			const buttonDemandeContact = screen.getAllByRole('button', { name: 'Être contacté.e' })[0];
			expect(buttonDemandeContact).toBeVisible();
			await user.click(buttonDemandeContact);

			expect(await screen.findByRole('dialog', { name: 'Formulaire de contact' })).toBeVisible();
		});

		it('lorsque la demande de contact est un succès, affiche la modale de succès', async () => {
			const user = userEvent.setup();
			const etablissement = anEtablissementAccompagnement({
				type: TypeEtablissement.MISSION_LOCALE,
			});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createSuccess(undefined));

			render(<DependenciesProvider
				établissementAccompagnementService={établissementAccompagnementService}
				localisationService={aLocalisationService()}>
				<ResultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);


			const buttonDemandeContact = screen.getAllByRole('button', { name: 'Être contacté.e' })[0];
			expect(buttonDemandeContact).toBeVisible();
			await user.click(buttonDemandeContact);

			await remplirFormulaire();

			await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));
			expect(établissementAccompagnementService.envoyerDemandeContact).toHaveBeenCalledTimes(1);
			const modalSucces = await screen.findByRole('dialog');
			expect(within(modalSucces).getByRole('heading', { name: 'Votre demande a bien été transmise !', level: 1})).toBeVisible();
		});

		describe('modale d‘erreur', () => {
			it('lorsque l‘envoi de la demande de contact est en echec, affiche la modale d‘echec et ferme la modale de formulaire', async () => {
				const user = userEvent.setup();
				const etablissement = anEtablissementAccompagnement({
					type: TypeEtablissement.MISSION_LOCALE,
				});
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				render(<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={aLocalisationService()}>
					<ResultatRechercherAccompagnement etablissement={etablissement} />
				</DependenciesProvider>);

				const buttonDemandeContact = screen.getAllByRole('button', { name: 'Être contacté.e' })[0];
				expect(buttonDemandeContact).toBeVisible();
				await user.click(buttonDemandeContact);

				await remplirFormulaire();

				await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

				const modalEchec = await screen.findByRole('dialog');
				expect(within(modalEchec).getByRole('heading', { name: 'Une erreur est survenue lors de l‘envoi du formulaire', level: 1})).toBeVisible();
				expect(screen.queryByRole('dialog', { name: 'Formulaire de contact' })).not.toBeInTheDocument();
			});

			it('lorsque je ferme la modale d‘erreur avec le bouton Retour au formulaire, ouvre la modale de formulaire', async () => {
				const user = userEvent.setup();
				const etablissement = anEtablissementAccompagnement({
					type: TypeEtablissement.MISSION_LOCALE,
				});
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				const localisationService = aLocalisationService();
				vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				render(<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={localisationService}>
					<ResultatRechercherAccompagnement etablissement={etablissement} />
				</DependenciesProvider>);

				const buttonDemandeContact = screen.getAllByRole('button', { name: 'Être contacté.e' })[0];
				expect(buttonDemandeContact).toBeVisible();
				await user.click(buttonDemandeContact);

				await remplirFormulaire();

				await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

				const modalEchec = await screen.findByRole('dialog');
				expect(within(modalEchec).getByRole('heading', { name: 'Une erreur est survenue lors de l‘envoi du formulaire', level: 1})).toBeVisible();
				await user.click(within(modalEchec).getByRole('button', { name: 'Retour au formulaire' }));
				const modales = await screen.findAllByRole('dialog')
				expect(modales).toHaveLength(1);
				expect(within(modales[0]).getByRole('heading', { name: 'Formulaire de contact' })).toBeVisible()
			});

			it('lorsque je ferme la modale d‘erreur avec le bouton Fermer, ferme la modale et ne re ouvre pas le formulaire', async () => {
				const user = userEvent.setup();
				const etablissement = anEtablissementAccompagnement({
					type: TypeEtablissement.MISSION_LOCALE,
				});
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				const localisationService = aLocalisationService();
				vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				render(<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={localisationService}>
					<ResultatRechercherAccompagnement etablissement={etablissement} />
				</DependenciesProvider>);

				const buttonDemandeContact = screen.getAllByRole('button', { name: 'Être contacté.e' })[0];
				expect(buttonDemandeContact).toBeVisible();
				await user.click(buttonDemandeContact);

				await remplirFormulaire();

				await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

				let modalEchec = await screen.findByRole('dialog');
				expect(within(modalEchec).getByRole('heading', { name: 'Une erreur est survenue lors de l‘envoi du formulaire', level: 1})).toBeVisible();
				await user.click(within(modalEchec).getByRole('button', { name: 'Fermer' }));
				modalEchec = screen.queryByRole('dialog');
				expect(modalEchec).not.toBeInTheDocument();

				expect(screen.queryByRole('dialog', { name: 'Formulaire de contact' })).not.toBeInTheDocument();
			});
		});
	});
});

async function remplirFormulaire() {
	const user = userEvent.setup();
	const inputPrenom = screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' });
	await user.type(inputPrenom, formulaireContact.prenom);

	const inputNom = screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' });
	await user.type(inputNom, formulaireContact.nom);

	await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), formulaireContact.telephone);

	await user.type(screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' }), formulaireContact.ville);
	const villeOption = await screen.findByText(formulaireContact.ville);
	await user.click(villeOption);

	await user.selectOptions(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }), formulaireContact.age);
}
