import {
	render,
	screen,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Entreprise
	from '~/client/components/features/OffreDeStage/Déposer/Étape1Entreprise/StageDeposerOffreFormulaireÉtape1Entreprise';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	aStageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service.fixture';

describe('<Entreprise />', () => {
	beforeEach(() => {
		mockUseRouter({});
	});

	describe('quand l’utilisateur arrive sur la page Entreprise', () => {
		it('affiche la première étape de formulaire', () => {
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

			expect(screen.getByText('Étape 1 sur 3 : Votre entreprise')).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: 'Nom de l’entreprise ou de l’employeur Exemples : Crédit Agricole, SNCF…' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Adresse mail de contact Exemple : contactRH@example.com' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Courte description de l’entreprise (500 caractères maximum) Informations sur votre entreprise : son histoire, des objectifs, des enjeux...' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Logo de l’entreprise - lien/URL Exemple : https://www.1jeune1solution.gouv.fr/images/logos/r%C3…' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Lien du site de l’entreprise - lien/URL Exemple : https://1jeune1solution.gouv.fr' })).toBeVisible();
			expect(screen.getByRole('button', { name: 'Suivant' })).toBeVisible();
		});

		it('les champs contenant des données pouvant être saisie automatiquement ont un attribut autocomplete approprié', () => {
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

			expect(screen.getByRole('textbox', { name: 'Nom de l’entreprise ou de l’employeur Exemples : Crédit Agricole, SNCF…' })).toHaveAttribute('autocomplete', 'organization');
			expect(screen.getByRole('textbox', { name: 'Adresse mail de contact Exemple : contactRH@example.com' })).toHaveAttribute('autocomplete', 'email');
		});

		describe('champ adresse mail', () => {
			it('le champ adresse mail donne une indication sur l’usage de celle-ci', async () => {
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

				const emailInput = screen.getByRole('textbox', { name: 'Adresse mail de contact Exemple : contactRH@example.com' });

				expect(emailInput).toHaveAccessibleDescription(expect.stringContaining('Cette adresse de contact sera utilisée dans le cas où il manquerait des informations pour valider votre demande, ou pour vous informer du statut de cette dernière. Cette adresse peut donc être différente de l’adresse sur laquelle il faudra candidater.'));
			});

			it('lorsque je remplis le champ email avec des espaces avant et après, ils sont pas pris en compte', async () => {
				const user = userEvent.setup();

				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);
				const mailInput = screen.getByRole('textbox', { name: /Adresse mail/ });

				await user.type(mailInput, '     mail@avecespaces.com    ');
				expect(mailInput).toHaveValue('mail@avecespaces.com');
			});
		});


		it('il voit afficher des champs facultatifs', async () => {
			const labelLogo = 'Logo de l’entreprise - lien/URL Exemple : https://www.1jeune1solution.gouv.fr/images/logos/r%C3…';
			const labelSite = 'Lien du site de l’entreprise - lien/URL Exemple : https://1jeune1solution.gouv.fr';
			// Given
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);
			const logoEntrepriseInput = screen.getByRole('textbox', { name: labelLogo });
			const siteEntrepriseInput = screen.getByRole('textbox', { name: labelSite });

			// When
			await userEvent.type(logoEntrepriseInput, 's{backspace}');
			await userEvent.type(siteEntrepriseInput, 's{backspace}');

			// Then
			expect(logoEntrepriseInput).toBeValid();
			expect(siteEntrepriseInput).toBeValid();
		});
	});

	describe('quand l’utilisateur clique sur Suivant mais n’a pas rempli l’étape 1', () => {
		it('il voit une erreur native sur le premier champ obligatoire mais non rempli', async () => {
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

			const inputNomSociété = screen.getByRole('textbox', { name: 'Nom de l’entreprise ou de l’employeur Exemples : Crédit Agricole, SNCF…' });
			await userEvent.type(inputNomSociété, 'Crédit Agricole');

			await BoutonSuivant();

			expect(inputNomSociété).toBeValid();
			expect(screen.getByRole('textbox', { name: 'Adresse mail de contact Exemple : contactRH@example.com' })).toBeInvalid();
		});
	});

	describe('quand je saisis une URL vers le logo de l’entreprise', () => {
		describe('et qu’il ne s’agit pas d’une URL', () => {
			it('je vois un message d’erreur', async () => {
				// Given
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

				// When
				const logoUrlInputText = screen.getByRole('textbox', { name: 'Logo de l’entreprise - lien/URL Exemple : https://www.1jeune1solution.gouv.fr/images/logos/r%C3…' });
				await userEvent.type(logoUrlInputText, 'some random text');
				await userEvent.tab();

				// Then
				expect(logoUrlInputText).toBeInvalid();
			});
		});

		describe('et qu’il s’agit bien d’une URL', () => {
			it('je ne vois rien d’autre que mon url saisie', async () => {
				// Given
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

				// When
				const logoUrlInputText = screen.getByRole('textbox', { name: 'Logo de l’entreprise - lien/URL Exemple : https://www.1jeune1solution.gouv.fr/images/logos/r%C3…' });
				await userEvent.type(logoUrlInputText, 'http://some.random.url.com');

				// Then
				expect(logoUrlInputText).toBeValid();
			});
		});
	});

	describe('quand je saisis une URL vers le site de l’entreprise', () => {
		describe('et qu’il ne s’agit pas d’une URL', () => {
			it('je vois un message d’erreur', async () => {
				// Given
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

				// When
				const websiteUrlInputText = screen.getByRole('textbox', { name: 'Lien du site de l’entreprise - lien/URL Exemple : https://1jeune1solution.gouv.fr' });
				await userEvent.type(websiteUrlInputText, 'some random text');
				await userEvent.tab();

				expect(websiteUrlInputText).toBeInvalid();
			});
		});

		describe('et qu’il s’agit bien d’une URL', () => {
			it('je ne vois rien d’autre que mon url saisie', async () => {
				// Given
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

				// When
				const websiteUrlInputText = screen.getByRole('textbox', { name: 'Lien du site de l’entreprise - lien/URL Exemple : https://1jeune1solution.gouv.fr' });
				await userEvent.type(websiteUrlInputText, 'http://some.random.url.com');
				await userEvent.tab();
				// Then
				expect(websiteUrlInputText).toBeValid();
			});
		});
	});
});

async function BoutonSuivant() {
	const button = screen.getByRole('button', { name: 'Suivant' });
	await userEvent.click(button);
}
