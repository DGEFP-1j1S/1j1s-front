import {
	render,
	screen,
	within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Entreprise
	from '~/client/components/features/OffreDeStage/Deposer/Etape1Entreprise/StageDeposerOffreFormulaireEtape1Entreprise';
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

			expect(screen.getByRole("heading", { level: 2, name: "Votre entreprise Étape 1 sur 3" })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: "Nom de l’entreprise ou de l’employeur 255 caractères maximum Exemples : Crédit Agricole, SNCF…" })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Adresse mail de contact Cette adresse de contact sera utilisée dans le cas où il manquerait des informations pour valider votre demande, ou pour vous informer du statut de cette dernière. Cette adresse peut donc être différente de l’adresse sur laquelle il faudra candidater. Exemple : contactRH@example.com' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Courte description de l’entreprise (500 caractères maximum) Informations sur votre entreprise : son histoire, des objectifs, des enjeux...' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Logo de l’entreprise - lien/URL Exemple : https://www.1jeune1solution.gouv.fr/images/logos/r%C3…' })).toBeVisible();
			expect(screen.getByRole('textbox', { name: 'Lien du site de l’entreprise - lien/URL Exemple : https://1jeune1solution.gouv.fr' })).toBeVisible();
			expect(screen.getByRole('button', { name: 'Suivant' })).toBeVisible();
		});

		it("indique la prochaine étape du formulaire", () => {
			// GIVEN
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

			// THEN
			expect(screen.getByText("Étape suivante :")).toBeVisible();
			expect(screen.getByText("Votre offre de stage", { exact: false })).toBeVisible();
		});

		it("regroupe les champs obligatoires et facultatifs dans des groupes légendés", () => {
			// GIVEN
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

			// THEN
			const groupeObligatoire = screen.getByRole("group", { name: "Les champs suivants sont obligatoires" });
			const groupeFacultatif = screen.getByRole("group", { name: "Les champs suivants sont facultatifs mais recommandés" });
			expect(within(groupeObligatoire).getByRole("textbox", { name: /Adresse mail/ })).toBeVisible();
			expect(within(groupeFacultatif).getByRole("textbox", { name: /Logo de l/ })).toBeVisible();
		});

		it('les champs contenant des données pouvant être saisie automatiquement ont un attribut autocomplete approprié', () => {
			render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);

			expect(screen.getByRole('textbox', { name: "Nom de l’entreprise ou de l’employeur 255 caractères maximum Exemples : Crédit Agricole, SNCF…" })).toHaveAttribute('autocomplete', 'organization');
			expect(screen.getByRole('textbox', { name: 'Adresse mail de contact Cette adresse de contact sera utilisée dans le cas où il manquerait des informations pour valider votre demande, ou pour vous informer du statut de cette dernière. Cette adresse peut donc être différente de l’adresse sur laquelle il faudra candidater. Exemple : contactRH@example.com' })).toHaveAttribute('autocomplete', 'email');
		});

		describe('champ adresse mail', () => {
			it('lorsque je remplis le champ email avec des espaces avant et après, ils sont pas pris en compte', async () => {
				const user = userEvent.setup();

				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);
				const mailInput = screen.getByRole('textbox', { name: /Adresse mail/ });

				await user.type(mailInput, '     mail@avecespaces.com    ');
				expect(mailInput).toHaveValue('mail@avecespaces.com');
			});

			it("lorsque je saisis une adresse mail au mauvais format, affiche un message détaillant le format attendu", async () => {
				// GIVEN
				const user = userEvent.setup();
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);
				const mailInput = screen.getByRole("textbox", { name: /Adresse mail/ });

				// WHEN
				await user.type(mailInput, "ds@s");
				await user.tab();

				// THEN
				expect(mailInput).toBeInvalid();
				expect(screen.getByText("Veuillez saisir une adresse e-mail valide, au format camille@email.fr")).toBeVisible();
			});

			it("lorsque je saisis une adresse mail au bon format, n’affiche pas de message d’erreur", async () => {
				// GIVEN
				const user = userEvent.setup();
				render(<DependenciesProvider stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}><Entreprise /></DependenciesProvider>);
				const mailInput = screen.getByRole("textbox", { name: /Adresse mail/ });

				// WHEN
				await user.type(mailInput, "contact@domaine.fr");
				await user.tab();

				// THEN
				expect(mailInput).toBeValid();
				expect(screen.queryByText("Veuillez saisir une adresse e-mail valide, au format camille@email.fr")).not.toBeInTheDocument();
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

			const inputNomSociete = screen.getByRole('textbox', { name: 'Nom de l’entreprise ou de l’employeur 255 caractères maximum Exemples : Crédit Agricole, SNCF…'});
			await userEvent.type(inputNomSociete, 'Crédit Agricole');

			await BoutonSuivant();

			expect(inputNomSociete).toBeValid();
			expect(screen.getByRole('textbox', { name: "Adresse mail de contact Cette adresse de contact sera utilisée dans le cas où il manquerait des informations pour valider votre demande, ou pour vous informer du statut de cette dernière. Cette adresse peut donc être différente de l’adresse sur laquelle il faudra candidater. Exemple : contactRH@example.com" })).toBeInvalid();
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
