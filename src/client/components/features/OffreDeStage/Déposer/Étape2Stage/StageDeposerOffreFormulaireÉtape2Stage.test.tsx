import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Stage
	from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/StageDeposerOffreFormulaireÉtape2Stage';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	aStageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service.fixture';
import {
	aStageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service.fixture';

const LABEL_OU_POSTULER = 'Lien sur lequel les candidats pourront postuler ou une adresse e-mail à laquelle envoyer sa candidature Exemples : https://candidat.francetravail.fr/offres/142Y OU candidature_PE_technicien@exemple.com';
const LABEL_NOM_STAGE = 'Nom de l’offre de stage (200 caractères maximum) Exemple : Assistant de recherche (6mois) chez ABC.ENTREPRISE';
const LABEL_DESCRIPTION_STAGE = 'Description de l’offre de stage (200 caractères minimum) Informations sur le stage : les objectifs, les challenges, les missions…';
const LABEL_REMUNERATION = 'Rémunération par mois Exemple : 560';

describe('<Stage />', () => {
	beforeEach(() => {
		mockUseRouter({});
		mockScrollIntoView();
	});
	
	describe('quand l’utilisateur arrive sur la page Stage', () => {
		it('il peut cliquer sur le bouton Retour pour retourner vers l’étape 1', async () => {
			render(<DependenciesProvider
				stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
				stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

			const retourLink = screen.getByRole('link', { name: 'Retour à l’étape précédente' });

			expect(retourLink).toHaveAttribute('href', '/stages/deposer-offre');
		});

		it('affiche la deuxième étape de formulaire', () => {
			render(<DependenciesProvider
				stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
				stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

			expect(screen.getByText('Étape 2 sur 3 : Votre offre de stage')).toBeVisible();
			expect(screen.getByRole('textbox', { name: LABEL_NOM_STAGE })).toBeVisible();
			expect(screen.getByRole('textbox', { name: LABEL_OU_POSTULER })).toBeVisible();
			expect(screen.getByRole('textbox', { name: LABEL_DESCRIPTION_STAGE })).toBeVisible();
			expect(screen.getByText('Date de début du stage')).toBeVisible();
			expect(screen.getByText('Durée du stage')).toBeVisible();
			expect(screen.getByText('Domaine de l’offre de stage')).toBeVisible();
			expect(screen.getByRole('spinbutton', { name: LABEL_REMUNERATION })).toBeVisible();
			expect(screen.getByText('Télétravail possible')).toBeVisible();
			expect(screen.getByRole('button', { name: 'Suivant' })).toBeVisible();
		});

		describe('champs date', () => {
			it('affiche par défaut le champ date précise de début de stage', () => {
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

				expect(screen.getByLabelText('Date précise du début de stage')).toBeVisible();
			});

			it('le champ date de début de début de stage a par défaut la valeur "Je connais la date précise du début de stage"', async () => {
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

				expect(screen.getByRole('radio', { name: 'Je connais la date précise du début de stage' })).toBeChecked();
			});

			it('l’utilisateur peut sélectionner la date du jour comme date de début de stage', async () => {
				// Given
				const currentDate = new Date().toISOString().split('T')[0];
				const user = userEvent.setup();

				// When
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);
				await user.type(screen.getByLabelText('Date précise du début de stage'), currentDate);

				// Then
				expect(screen.getByLabelText('Date précise du début de stage')).toHaveValue(currentDate);
				expect(screen.getByLabelText('Date précise du début de stage')).toBeValid();
			});

			it('l’utilisateur peut sélectionner une date de début max égale à la date de début min', async () => {
				// Given
				const dateDebutMin = new Date().toISOString().split('T')[0];
				const user = userEvent.setup();

				// When
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);
				const radioDatePrecise = screen.getByRole('radio', { name: 'Je ne connais pas la date précise du début de stage' });
				await user.click(radioDatePrecise);
				await user.type(screen.getByLabelText('Date de début du stage au plus tôt'), dateDebutMin);
				await user.type(screen.getByLabelText('Date de début du stage au plus tard'), dateDebutMin);

				// Then
				expect(screen.getByLabelText('Date de début du stage au plus tôt')).toHaveValue(dateDebutMin);
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toHaveValue(dateDebutMin);
				expect(screen.getByLabelText('Date de début du stage au plus tôt')).toBeValid();
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toBeValid();
			});

			it('l’utilisateur peut sélectionner une date de début max ultérieur à la date de début min', async () => {
				// Given
				const dateDebutMin = new Date().toISOString().split('T')[0];
				const dateDebutMax = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
				const user = userEvent.setup();

				// When
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);
				const radioDatePrecise = screen.getByRole('radio', { name: 'Je ne connais pas la date précise du début de stage' });
				await user.click(radioDatePrecise);
				await user.type(screen.getByLabelText('Date de début du stage au plus tôt'), dateDebutMin);
				await user.type(screen.getByLabelText('Date de début du stage au plus tard'), dateDebutMax);

				// Then
				expect(screen.getByLabelText('Date de début du stage au plus tôt')).toHaveValue(dateDebutMin);
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toHaveValue(dateDebutMax);
				expect(screen.getByLabelText('Date de début du stage au plus tôt')).toBeValid();
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toBeValid();
			});

			it('affiche les champs date minimum et maximum de début de stage lorsque l’option "Je ne connais pas la date précise du début de stage" est sélectionnée', () => {
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

				const radioDatePrecise = screen.getByRole('radio', { name: 'Je ne connais pas la date précise du début de stage' });

				fireEvent.click(radioDatePrecise);

				expect(screen.getByLabelText('Date de début du stage au plus tôt')).toBeVisible();
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toBeVisible();
			});

			it('l’utilisateur ne peut pas sélectionner une date antérieure à la date du jour comme date de début de stage', async () => {
				// Given
				const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
				const user = userEvent.setup();

				// When
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);
				await user.type(screen.getByLabelText('Date précise du début de stage'), yesterday);
				await user.tab();

				// Then
				expect(screen.getByLabelText('Date précise du début de stage')).toHaveValue(yesterday);
				expect(await screen.findByLabelText('Date précise du début de stage', undefined, { timeout: 100000 })).toBeInvalid();
			});

			it('l’utilisateur ne peut pas sélectionner une date debut max antérieur à la date de debut min', async () => {
				// Given
				const dateDebutMin = new Date().toISOString().split('T')[0];
				const dateDebutMax = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
				const user = userEvent.setup();

				// When
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);
				const radioDatePrecise = screen.getByRole('radio', { name: 'Je ne connais pas la date précise du début de stage' });
				await user.click(radioDatePrecise);
				await user.type(screen.getByLabelText('Date de début du stage au plus tôt'), dateDebutMin);
				await user.type(screen.getByLabelText('Date de début du stage au plus tard'), dateDebutMax);
				await user.tab();

				// Then
				expect(screen.getByLabelText('Date de début du stage au plus tôt')).toHaveValue(dateDebutMin);
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toHaveValue(dateDebutMax);
				expect(screen.getByLabelText('Date de début du stage au plus tard')).toBeInvalid();
			});
		});

		describe('champ remuneration', () => {
			it('l‘information sur l‘unité de rémunération est bien liée au champ', () => {
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

				//When
				const inputRemuneration = screen.getByRole('spinbutton', { name: LABEL_REMUNERATION });

				expect(inputRemuneration).toHaveAccessibleDescription('€');
			});
		});
		it('il voit afficher des champs facultatifs', async () => {
			const labelDomaineOffreStage = 'Domaine de l’offre de stage';
			const télétravailPossible = 'Télétravail possible';
			// Given
			render(<DependenciesProvider
				stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
				stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

			//When
			const inputRemuneration = screen.getByRole('spinbutton', { name: LABEL_REMUNERATION });

			await userEvent.type(screen.getByText(labelDomaineOffreStage), 's{backspace}');
			await userEvent.type(inputRemuneration, 's{backspace}');
			await userEvent.type(screen.getByText(télétravailPossible), 's{backspace}');

			// Then
			expect(screen.getByText(labelDomaineOffreStage)).toBeValid();
			expect(inputRemuneration).toBeValid();
			expect(screen.getByText(télétravailPossible)).toBeValid();
		});

		it('vérifie que le radio bouton de télétravail soit bien sélectionné', () => {
			render(<DependenciesProvider
				stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
				stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

			const radioOui = screen.getByRole('radio', { name: 'Oui' });
			const radioNon = screen.getByRole('radio', { name: 'Non' });

			fireEvent.click(radioNon);

			expect(radioOui).not.toBeChecked();
			expect(radioNon).toBeChecked();
		});

		it('affiche le composant avec le bon label et la limite sur le textarea', () => {
			const minLengthValue = '200';

			render(<DependenciesProvider
				stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
				stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

			const textAreaDescription = screen.getByRole('textbox', { name: LABEL_DESCRIPTION_STAGE });
			expect(textAreaDescription).toBeVisible();
			expect(textAreaDescription).toHaveAttribute('minLength', minLengthValue);
		});
	});

	describe('quand l’utilisateur clique sur Suivant mais n’a pas rempli l’étape 2', () => {
		it('il voit des messages d’erreur', async () => {
			render(<DependenciesProvider
				stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
				stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}><Stage /></DependenciesProvider>);

			const inputNomOffreStage = screen.getByRole('textbox', { name: LABEL_NOM_STAGE });
			await userEvent.type(inputNomOffreStage, 'Chef de projet');

			await BoutonSuivant();

			expect(screen.getByRole('textbox', { name: LABEL_NOM_STAGE })).toBeValid();
			expect(screen.getByRole('textbox', { name: LABEL_OU_POSTULER })).toBeInvalid();
			expect(screen.getByRole('textbox', { name: LABEL_DESCRIPTION_STAGE })).toBeInvalid();
		});
	});

	describe("quand je saisis le titre d'une offre de stage", () => {
		describe('et que le texte saisi dépasse les 200 caractères', () => {
			it('retourne seulement les 200 premiers caractères', async () => {
				// Given
				const longTextToType = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

				// When
				render(<DependenciesProvider
					stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}>
					<Stage />
				</DependenciesProvider>);
				const inputTextTitreOffreDeStage = screen.getByRole('textbox', { name: LABEL_NOM_STAGE });
				await userEvent.type(inputTextTitreOffreDeStage, longTextToType);

				// Then
				expect(inputTextTitreOffreDeStage).toHaveDisplayValue(longTextToType.slice(0, 200));
			});
		});

		describe('et que le texte saisi ne dépasse pas les 200 caractères', () => {
			it('retourne tous les caractères saisis', async () => {
				// Given
				const shortTextToType = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
					.slice(0, 200);

				// When
				render(
					<DependenciesProvider
						stageDeposerOffreEtape1PersistenceService={aStageDeposerOffreEtape1PersistenceService()}
						stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}>
						<Stage />
					</DependenciesProvider>);
				const inputTextTitreOffreDeStage = screen.getByRole('textbox', { name: LABEL_NOM_STAGE });
				await userEvent.type(inputTextTitreOffreDeStage, shortTextToType);

				// Then
				expect(inputTextTitreOffreDeStage).toHaveDisplayValue(shortTextToType);
			});
		});
	});
});

async function BoutonSuivant() {
	const button = screen.getByRole('button', { name: 'Suivant' });
	await userEvent.click(button);
}
