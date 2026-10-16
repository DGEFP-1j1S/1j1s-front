import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	anEtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import {
	JourSemaine,
	TypeÉtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {
	anEtablissementAccompagnement, anEtablissementAccompagnementAdresse,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

import { RésultatRechercherAccompagnement } from './RésultatRechercherAccompagnement';

const formulaireContact = {
	adresseMail: 'mariotintin@mail.com',
	age: '16 ans',
	nom: 'Tintin',
	prenom: 'Mario',
	telephone: '0123456789',
	ville: 'Paris (75006)',
};

describe('<RésultatRechercherAccompagnement/>', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	it('affiche adresse formatée', () => {
		const etablissement = anEtablissementAccompagnement({
			adresse: anEtablissementAccompagnementAdresse({
				codePostal: '75011',
				nomCommune: 'Paris',
				numeroVoie: '29-31 rue des Boulets',
			}),
		});

		render(<DependenciesProvider>
			<RésultatRechercherAccompagnement etablissement={etablissement} />
		</DependenciesProvider>);

		expect(screen.getByText('29-31 rue des Boulets, 75011 Paris')).toBeVisible();
	});
	describe('Quand le type d‘accompagnement est une mission locale', () => {
		it('n‘affiche pas l‘email', () => {
			// GIVEN
			const email = 'email';
			const etablissement = anEtablissementAccompagnement({
				email: email,
				type: TypeÉtablissement.MISSION_LOCALE,
			});

			// WHEN
			render(<DependenciesProvider>
				<RésultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			expect(screen.queryByText(email)).not.toBeInTheDocument();
		});

		it('affiche le bouton "Je souhaite être contacté(e)"', () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				type: TypeÉtablissement.MISSION_LOCALE,
			});

			// WHEN
			render(<DependenciesProvider>
				<RésultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			// NOTE (BRUJ 11/04/2024): Plusieurs boutons car une version desktop et une version mobile
			const button = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
			expect(button).toBeVisible();
		});
	});

	describe('Quand le type d‘accompagnement n‘est pas une mission locale', () => {
		it('affiche l‘email', () => {
			// GIVEN
			const email = 'email';
			const etablissement = anEtablissementAccompagnement({
				email: email,
				type: TypeÉtablissement.INFO_JEUNE,
			});

			// WHEN
			render(<DependenciesProvider>
				<RésultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			const link = screen.getAllByRole('link', { name: 'Contacter l‘agence' })[0];
			expect(link).toBeVisible();
			expect(link).toHaveAttribute('href', `mailto:${email}`);
			expect(link).toHaveAttribute('title', 'Contacter l‘agence - adresse mail');
		});

		it('n‘affiche pas le bouton "Je souhaite être contacté(e)"', () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				type: TypeÉtablissement.INFO_JEUNE,
			});

			// WHEN
			render(<DependenciesProvider>
				<RésultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			// THEN
			expect(screen.queryByRole('button', { name: 'Je souhaite être contacté(e)' })).not.toBeInTheDocument();
		});
	});

	describe('Quand aucune horaire n’est disponible', () => {
		it('n‘affiche pas "Voir les horaires d’ouverture"', () => {
			// GIVEN
			const etablissement = anEtablissementAccompagnement({
				horaires: [],
				type: TypeÉtablissement.INFO_JEUNE,
			});

			// WHEN
			render(<DependenciesProvider>
				<RésultatRechercherAccompagnement etablissement={etablissement} />
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
				type: TypeÉtablissement.INFO_JEUNE,
			});

			// WHEN
			render(<DependenciesProvider>
				<RésultatRechercherAccompagnement etablissement={etablissement} />
			</DependenciesProvider>);

			await userEvent.click(screen.getByText('Voir les horaires d‘ouverture'));

			// THEN
			expect(screen.getByText('Voir les horaires d‘ouverture')).toBeVisible();
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
			const établissement = anEtablissementAccompagnement({
				type: TypeÉtablissement.MISSION_LOCALE,
			});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();

			render(<DependenciesProvider établissementAccompagnementService={établissementAccompagnementService}
																	 localisationService={localisationService}>
				<RésultatRechercherAccompagnement etablissement={établissement} />
			</DependenciesProvider>);

			const buttonDemandeContact = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
			expect(buttonDemandeContact).toBeVisible();
			await user.click(buttonDemandeContact);

			expect(screen.getByRole('dialog', { name: 'Je souhaite être contacté(e) par la Mission Locale' })).toBeVisible();
		});

		it('le bouton de soumission est désactivé et affiche "Envoi en cours" pendant la soumission du formulaire', async () => {
			// GIVEN
			const user = userEvent.setup();
			const établissement = anEtablissementAccompagnement({
				type: TypeÉtablissement.MISSION_LOCALE,
			});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockImplementation(() => new Promise(() => {
			}));
			render(
				<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={aLocalisationService()}>
					<RésultatRechercherAccompagnement etablissement={établissement} />
				</DependenciesProvider>);

			const buttonDemandeContact = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
			await user.click(buttonDemandeContact);


			await remplirFormulaire();

			// WHEN
			await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

			// THEN
			const loadingSubmitButton = screen.getByRole('button', { name: 'Envoi en cours' });
			expect(loadingSubmitButton).toBeVisible();
			expect(loadingSubmitButton).toBeDisabled();
		});

		it('lorsque la demande de contact est un succès, affiche la modale de succès', async () => {
			const user = userEvent.setup();
			const établissement = anEtablissementAccompagnement({
				type: TypeÉtablissement.MISSION_LOCALE,
			});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createSuccess(undefined));

			render(<DependenciesProvider
				établissementAccompagnementService={établissementAccompagnementService}
				localisationService={aLocalisationService()}>
				<RésultatRechercherAccompagnement etablissement={établissement} />
			</DependenciesProvider>);


			const buttonDemandeContact = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
			expect(buttonDemandeContact).toBeVisible();
			await user.click(buttonDemandeContact);

			await remplirFormulaire();

			await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));
			expect(établissementAccompagnementService.envoyerDemandeContact).toHaveBeenCalledTimes(1);
			expect(screen.getByRole('dialog', { name: 'Votre demande a bien été transmise !' })).toBeVisible();
		});

		describe('modale d‘erreur', () => {
			it('lorsque l‘envoi de la demande de contact est en echec, affiche la modale d‘echec et ferme la modale de formulaire', async () => {
				const user = userEvent.setup();
				const établissement = anEtablissementAccompagnement({
					type: TypeÉtablissement.MISSION_LOCALE,
				});
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				render(<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={aLocalisationService()}>
					<RésultatRechercherAccompagnement etablissement={établissement} />
				</DependenciesProvider>);

				const buttonDemandeContact = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
				expect(buttonDemandeContact).toBeVisible();
				await user.click(buttonDemandeContact);

				await remplirFormulaire();

				await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));

				expect(screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' })).toBeVisible();
				expect(screen.queryByRole('dialog', { name: 'Je souhaite être contacté(e) par la Mission Locale' })).not.toBeInTheDocument();
			});

			it('lorsque je ferme la modale d‘erreur avec le bouton Retour au formulaire, ouvre la modale de formulaire', async () => {
				const user = userEvent.setup();
				const établissement = anEtablissementAccompagnement({
					type: TypeÉtablissement.MISSION_LOCALE,
				});
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				const localisationService = aLocalisationService();

				vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				render(<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={localisationService}>
					<RésultatRechercherAccompagnement etablissement={établissement} />
				</DependenciesProvider>);

				const buttonDemandeContact = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
				expect(buttonDemandeContact).toBeVisible();
				await user.click(buttonDemandeContact);

				await remplirFormulaire();

				await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));


				const modaleErreur = screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' });
				await user.click(within(modaleErreur).getByRole('button', { name: 'Retour au formulaire' }));
				expect(modaleErreur).not.toBeInTheDocument();

				expect(screen.getByRole('dialog', { name: 'Je souhaite être contacté(e) par la Mission Locale' })).toBeVisible();
			});

			it('lorsque je ferme la modale d‘erreur avec le bouton Fermer, ferme la modale et ne re ouvre pas le formulaire', async () => {
				const user = userEvent.setup();
				const établissement = anEtablissementAccompagnement({
					type: TypeÉtablissement.MISSION_LOCALE,
				});
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				const localisationService = aLocalisationService();

				vi.spyOn(établissementAccompagnementService, 'envoyerDemandeContact').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

				render(<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={localisationService}>
					<RésultatRechercherAccompagnement etablissement={établissement} />
				</DependenciesProvider>);

				const buttonDemandeContact = screen.getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];
				expect(buttonDemandeContact).toBeVisible();
				await user.click(buttonDemandeContact);

				await remplirFormulaire();

				await user.click(screen.getByRole('button', { name: 'Envoyer mes informations afin d‘être rappelé(e)' }));


				const modaleErreur = screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' });
				await user.click(within(modaleErreur).getByRole('button', { name: 'Fermer' }));
				expect(modaleErreur).not.toBeInTheDocument();

				expect(screen.queryByRole('dialog', { name: 'Je souhaite être contacté(e) par la Mission Locale' })).not.toBeInTheDocument();
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

	await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
	await user.click(screen.getByRole('option', { name: formulaireContact.age }));
}
