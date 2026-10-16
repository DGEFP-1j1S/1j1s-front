import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import DemandeContactCEJ
	from '~/client/components/features/ContratEngagementJeune/DemandeDeContactCEJ/DemandeContactCEJ';
import { mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aDemandeDeContactService } from '~/client/services/demandeDeContact/demandeDeContact.service.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { aCommune } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

describe('<DemandeContactCEJ />', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	function renderComponent() {
		const demandeDeContactServiceMock = aDemandeDeContactService();
		const localisationService = aLocalisationService();

		render(
			<DependenciesProvider demandeDeContactService={demandeDeContactServiceMock}
				localisationService={localisationService}>
				<DemandeContactCEJ />
			</DependenciesProvider>,
		);
	}

	it('le composant s‘affiche correctement', () => {
		// Given
		// When
		renderComponent();
		// Then
		expect(screen.getByText('Demander à être contacté.e')).toBeVisible();
	});

	describe('Lorsqu‘on clique sur le bouton je souhaite être contacté(e)', () => {
		it('affiche un formulaire de rappel', async () => {
			const user = userEvent.setup();
			renderComponent();

			await user.click(screen.getByText('Demander à être contacté.e'));

			expect(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' })).toBeVisible();
			expect(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' })).toBeVisible();
			expect(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' })).toBeVisible();

			expect(screen.getByRole('button', { name: 'Envoyer la demande' })).toBeVisible();
		});

		it('lorsque l‘envoi du formulaire est en succes, affiche la modale de succès', async () => {
			const user = userEvent.setup();
			const demandeDeContactService = aDemandeDeContactService();
			const localisationService = aLocalisationService();
			vi.spyOn(demandeDeContactService, 'envoyerPourLeCEJ').mockResolvedValue(createSuccess(undefined));
			vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess({
				résultats: [aCommune({
					codePostal: '75006',
					ville: 'Paris',
				})],
			}));

			render(
				<DependenciesProvider
					demandeDeContactService={demandeDeContactService}
					localisationService={localisationService}>
					<DemandeContactCEJ />
				</DependenciesProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'Demander à être contacté.e' }));

			await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'Jean');
			await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Dupont');
			await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' }), 'jean.dupont@mail.com');
			await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0123456789');
			await user.type(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' }), 'Paris');
			await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));
			await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
			await user.click(screen.getByRole('option', { name: '16 ans' }));

			await user.click(screen.getByRole('button', { name: 'Envoyer la demande' }));

			expect(screen.getByRole('dialog', { name: 'Votre demande a bien été transmise !' })).toBeVisible();
		});

		describe('modale d‘erreur', () => {
			it('lorsque l‘envoi du formulaire est en echec, affiche la modale d‘echec et ferme la modale de formulaire', async () => {
				const user = userEvent.setup();
				const demandeDeContactService = aDemandeDeContactService();
				const localisationService = aLocalisationService();
				vi.spyOn(demandeDeContactService, 'envoyerPourLeCEJ').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess({
					résultats: [aCommune({
						codePostal: '75006',
						ville: 'Paris',
					})],
				}));

				render(
					<DependenciesProvider
						demandeDeContactService={demandeDeContactService}
						localisationService={localisationService}>
						<DemandeContactCEJ />
					</DependenciesProvider>,
				);

				await user.click(screen.getByRole('button', { name: 'Demander à être contacté.e' }));

				await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'Jean');
				await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Dupont');
				await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' }), 'jean.dupont@mail.com');
				await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0123456789');
				await user.type(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' }), 'Paris');
				await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));
				await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
				await user.click(screen.getByRole('option', { name: '16 ans' }));

				await user.click(screen.getByRole('button', { name: 'Envoyer la demande' }));

				expect(screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' })).toBeVisible();
				expect(screen.queryByRole('dialog', { name: 'J‘ai des questions sur le Contrat d‘Engagement Jeune et souhaite être rappelé' })).not.toBeInTheDocument();
			});

			it('lorsque je clique sur le bouton Retour au formulaire, ouvre la modale de formulaire', async () => {
				const user = userEvent.setup();
				const demandeDeContactService = aDemandeDeContactService();
				const localisationService = aLocalisationService();
				vi.spyOn(demandeDeContactService, 'envoyerPourLeCEJ').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess({
					résultats: [aCommune({
						codePostal: '75006',
						ville: 'Paris',
					})],
				}));

				render(
					<DependenciesProvider
						demandeDeContactService={demandeDeContactService}
						localisationService={localisationService}>
						<DemandeContactCEJ />
					</DependenciesProvider>,
				);

				await user.click(screen.getByRole('button', { name: 'Demander à être contacté.e' }));

				await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'Jean');
				await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Dupont');
				await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' }), 'jean.dupont@mail.com');
				await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0123456789');
				await user.type(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' }), 'Paris');
				await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));
				await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
				await user.click(screen.getByRole('option', { name: '16 ans' }));

				await user.click(screen.getByRole('button', { name: 'Envoyer la demande' }));

				const modaleErreur = screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' });
				await user.click(within(modaleErreur).getByRole('button', { name: 'Retour au formulaire' }));
				expect(modaleErreur).not.toBeInTheDocument();

				expect(screen.getByRole('dialog', { name: 'J‘ai des questions sur le Contrat d‘Engagement Jeune et souhaite être rappelé' })).toBeVisible();
			});

			it('lorsque je clique sur le bouton Fermer, ferme la modale d‘erreur et n‘ouvre pas la modale de formulaire', async () => {
				const user = userEvent.setup();
				const demandeDeContactService = aDemandeDeContactService();
				const localisationService = aLocalisationService();
				vi.spyOn(demandeDeContactService, 'envoyerPourLeCEJ').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));
				vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess({
					résultats: [aCommune({
						codePostal: '75006',
						ville: 'Paris',
					})],
				}));

				render(
					<DependenciesProvider
						demandeDeContactService={demandeDeContactService}
						localisationService={localisationService}>
						<DemandeContactCEJ />
					</DependenciesProvider>,
				);

				await user.click(screen.getByRole('button', { name: 'Demander à être contacté.e' }));

				await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), 'Jean');
				await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), 'Dupont');
				await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' }), 'jean.dupont@mail.com');
				await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), '0123456789');
				await user.type(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' }), 'Paris');
				await user.click(await screen.findByRole('option', { name: 'Paris (75006)' }));
				await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
				await user.click(screen.getByRole('option', { name: '16 ans' }));

				await user.click(screen.getByRole('button', { name: 'Envoyer la demande' }));


				const modaleErreur = screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' });
				await user.click(within(modaleErreur).getByRole('button', { name: 'Fermer' }));
				expect(modaleErreur).not.toBeInTheDocument();

				expect(screen.queryByRole('dialog', { name: 'J‘ai des questions sur le Contrat d‘Engagement Jeune et souhaite être rappelé' })).not.toBeInTheDocument();
			});
		});
	});
});

