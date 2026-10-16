import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aDemandeDeContactService } from '~/client/services/demandeDeContact/demandeDeContact.service.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';

import { FormulaireDeContactCEJ } from './FormulaireContactCEJ';

describe('<FormulaireDeContactCEJ />', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	
	function renderComponent() {
		const onSuccess = vi.fn();
		const onFailure = vi.fn();
		const demandeDeContactServiceMock = aDemandeDeContactService();
		const localisationService = aLocalisationService();

		render(
			<DependenciesProvider demandeDeContactService={demandeDeContactServiceMock} localisationService={localisationService}>
				<FormulaireDeContactCEJ onSuccess={onSuccess} onFailure={onFailure} />
			</DependenciesProvider>,
		);
		return { demandeDeContactServiceMock, onSuccess };
	}

	it('affiche un formulaire de rappel', async () => {
		// Given
		renderComponent();
		// When
		// Then
		expect(screen.getByRole('textbox',{ name: 'Prénom Exemple : Jean' })).toBeVisible();
		expect(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' })).toBeVisible();
		expect(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' })).toBeVisible();
		expect(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' })).toBeVisible();
		expect(screen.getByText('Age', { exact: true })).toBeVisible();
		expect(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Envoyer la demande' })).toBeVisible();
	});

	it('les champs contenant des informations personnels ont des autocomplete', async () => {
		// When
		renderComponent();

		// Then
		expect(screen.getByRole('textbox',{ name: 'Prénom Exemple : Jean' })).toHaveAttribute('autocomplete', 'given-name');
		expect(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' })).toHaveAttribute('autocomplete', 'family-name');
		expect(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' })).toHaveAttribute('autocomplete', 'email');
		expect(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' })).toHaveAttribute('autocomplete', 'tel-national');
	});


	it('lorsque je remplis le champ email avec des espaces avant et après, ils sont pas pris en compte', async () => {
		const user = userEvent.setup();

		renderComponent();
		const mailInput = screen.getByRole('textbox', { name : 'Adresse e-mail Exemple : jean.dupont@gmail.com' });

		await user.type(mailInput, '     mail@avecespaces.com    ');
		expect(mailInput).toHaveValue('mail@avecespaces.com');
	});

	it('a un champ Age obligatoire', async () => {
		renderComponent();

		const combobox = screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' });
		expect(combobox).toBeRequired();
	});

	describe('Quand l’utilisateur clique sur Envoyer la demande', () => {
		describe('et que le formulaire est valide', () => {
			it('le bouton de soumission est désactivé et affiche "Envoi en cours" pendant la soumission du formulaire', async () => {
				// Given
				const { demandeDeContactServiceMock } = renderComponent();
				vi.spyOn(demandeDeContactServiceMock, 'envoyerPourLeCEJ').mockImplementationOnce(() => new Promise(() => {
				}));

				// When
				await remplirFormulaireDeContactEtEnvoyer({
					age: '19 ans',
					email: 'toto@msn.fr',
					nom: 'Mc Totface',
					prénom: 'Toto',
					téléphone: '0123456789',
					ville: 'Paris',
				});

				// Then
				const loadingSubmitButton = screen.getByRole('button', { name: 'Envoi en cours' });
				expect(loadingSubmitButton).toBeVisible();
				expect(loadingSubmitButton).toBeDisabled();
			});
			it('appelle l’api avec les paramètres saisis dans le formulaire', async () => {
				// Given
				const { demandeDeContactServiceMock } = renderComponent();

				// When
				await remplirFormulaireDeContactEtEnvoyer({
					age: '19 ans',
					email: 'toto@msn.fr',
					nom: 'Mc Totface',
					prénom: 'Toto',
					téléphone: '0123456789',
					ville: 'Paris',
				});

				// Then
				expect(demandeDeContactServiceMock.envoyerPourLeCEJ).toHaveBeenCalledWith({
					age: 19,
					codePostal: '75015',
					email: 'toto@msn.fr',
					nom: 'Mc Totface',
					prénom: 'Toto',
					téléphone: '0123456789',
					ville: 'Paris 15e Arrondissement',
				});
			});
			it('appelle la propriété onSuccess', async () => {
				// Given
				const { onSuccess } = renderComponent();

				// When
				await remplirFormulaireDeContactEtEnvoyer({
					age: '19 ans',
					email: 'toto@msn.fr',
					nom: 'Mc Totface',
					prénom: 'Toto',
					téléphone: '0123456789',
					ville: 'Pontoise',
				});

				// Then
				expect(onSuccess).toHaveBeenCalledTimes(1);
			});
		});
		describe('quand on clique sur politique de confidentialité', () => {
			it('ça te renvoie vers la page confidentialite', () => {
				// Given
				const politiqueConfidentialité = 'politique de confidentialité';

				renderComponent();

				// Then
				const link = screen.getByRole('link', { name: politiqueConfidentialité });
				expect(link).toBeVisible();
				expect(link).toHaveAttribute('href', expect.stringContaining('/confidentialite'));
			});
		});
		describe('quand on clique sur CGU', () => {
			it('ça te renvoie vers la page cgu', () => {
				// Given
				const cgu = 'CGU';

				renderComponent();

				// Then
				const link = screen.getByRole('link', { name: cgu });
				expect(link).toBeVisible();
				expect(link).toHaveAttribute('href', expect.stringContaining('/cgu'));
			});
		});
	});
});

type ContactInputs = Record<'prénom' | 'nom' | 'téléphone' | 'email' | 'age' | 'ville', string>

async function remplirFormulaireDeContactEtEnvoyer(data: ContactInputs) {
	const user = userEvent.setup();
	await user.type(screen.getByRole('textbox', { name: 'Prénom Exemple : Jean' }), data.prénom);
	await user.type(screen.getByRole('textbox', { name: 'Nom Exemple : Dupont' }), data.nom);
	await user.type(screen.getByRole('textbox', { name: 'Téléphone Exemple : 0606060606' }), data.téléphone);
	await user.type(screen.getByRole('textbox', { name: 'Adresse e-mail Exemple : jean.dupont@gmail.com' }), data.email);

	await user.type(screen.getByRole('combobox', { name: 'Ville Exemples : Paris, Béziers…' }), data.ville);
	const paris15eOption = await screen.findByText('Paris 15e Arrondissement (75015)');
	await user.click(paris15eOption);

	await user.click(screen.getByRole('combobox', { name: 'Age Exemple : 16 ans' }));
	await user.click(screen.getByRole('option', { name: data.age }));

	await user.click(screen.getByRole('button', { name: 'Envoyer la demande' }));
}

