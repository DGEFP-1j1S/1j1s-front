import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Localisation
	from '~/client/components/features/OffreDeStage/Déposer/Étape3Localisation/StageDeposerOffreFormulaireÉtape3Localisation';
import {
	aFormulaireEtapeEntreprise, aFormulaireEtapeLocalisation,
	aFormulaireEtapeStage,
} from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStageService } from '~/client/services/stage/stageService.fixture';
import {
	aStageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service.fixture';
import {
	aStageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service.fixture';
import {
	aStageDeposerOffreEtape3PersistenceService,
} from '~/client/services/stageDeposerOffreEtape3Persistence/stageDeposerOffreEtape3Persistence.service.fixture';
import { createFailure } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';

describe('<Localisation />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseRouter({});
	});


	describe('quand l’étape 1 n’est pas remplie', () => {
		it('redirige vers l’étape 1 du formulaire', async () => {
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });
			const stageService = aStageService();
			const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
				getInformationsEtape1: vi.fn().mockReturnValue(null),
			});

			render(
				<DependenciesProvider
					stageService={stageService}
					stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
					stageDeposerOffreEtape2PersistenceService={aStageDeposerOffreEtape2PersistenceService()}
					stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
					<Localisation />
				</DependenciesProvider>,
			);

			expect(routerPush).toHaveBeenCalledWith('/stages/deposer-offre');
		});
	});

	describe('quand l’étape 2 n’est pas remplie', () => {
		it('redirige vers l’étape 1 du formulaire', async () => {
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });
			const stageService = aStageService();
			const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
				getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
			});
			const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
				getInformationsEtape2: vi.fn().mockReturnValue(null),
			});

			render(
				<DependenciesProvider
					stageService={stageService}
					stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
					stageDeposerOffreEtape2PersistenceService={persistenceStage}
					stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
					<Localisation />
				</DependenciesProvider>,
			);

			expect(routerPush).toHaveBeenCalledWith('/stages/deposer-offre');
		});
	});

	describe('quand l’étape 1 et 2 sont remplies', () => {
		beforeEach(() => {
		});

		it('il peut cliquer sur le bouton Retour pour retourner vers l’étape 2', async () => {
			const stageService = aStageService();
			const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
				getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
			});
			const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
				getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
			});

			render(
				<DependenciesProvider
					stageService={stageService}
					stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
					stageDeposerOffreEtape2PersistenceService={persistenceStage}
					stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
					<Localisation />
				</DependenciesProvider>,
			);

			const retourLink = screen.getByRole('link', { name: 'Retour à l’étape précédente' });

			expect(retourLink).toHaveAttribute('href', '/stages/deposer-offre/votre-offre-de-stage');
		});

		it('affiche la troisième étape de formulaire', () => {
			const stageService = aStageService();
			const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
				getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
			});
			const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
				getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
			});

			render(
				<DependenciesProvider
					stageService={stageService}
					stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
					stageDeposerOffreEtape2PersistenceService={persistenceStage}
					stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
					<Localisation />
				</DependenciesProvider>,
			);

			expect(screen.getByText('Étape 3 sur 3 : Localisation du stage')).toBeInTheDocument();
			expect(screen.getByRole('combobox', { name: 'Pays Exemple : France' })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: 'Ville Exemple : Paris' })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: 'Adresse Exemple : 127 rue de Grenelle' })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: 'Code postal Exemple : 75007' })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: 'Région Exemple : Île-De-France' })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: 'Département Exemple : Yvelines' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Envoyer ma demande de dépôt d’offre' })).toBeInTheDocument();
		});

		it('il voit affiché des champs facultatifs', async () => {
			const labelRegion = 'Région Exemple : Île-De-France';
			const labelDepartement = 'Département Exemple : Yvelines';
			const stageService = aStageService();
			const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
				getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
			});
			const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
				getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
			});

			render(
				<DependenciesProvider
					stageService={stageService}
					stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
					stageDeposerOffreEtape2PersistenceService={persistenceStage}
					stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
					<Localisation />
				</DependenciesProvider>,
			);

			await userEvent.type(screen.getByRole('textbox', { name: labelRegion }), 's{backspace}');
			await userEvent.type(screen.getByRole('textbox', { name: labelDepartement }), 's{backspace}');

			expect(screen.getByRole('textbox', { name: labelRegion })).toBeValid();
			expect(screen.getByRole('textbox', { name: labelDepartement })).toBeValid();
		});

		it('le bouton de soumission est désactivé et affiche "Envoi en cours" pendant la soumission du formulaire', async () => {
			// GIVEN
			const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
				getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
			});
			const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
				getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
			});

			const user = userEvent.setup();
			const stageService = aStageService();
			vi.spyOn(stageService, 'enregistrerOffreDeStage').mockImplementation(() => new Promise(() => {}));

			render(
				<DependenciesProvider
					stageService={stageService}
					stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
					stageDeposerOffreEtape2PersistenceService={persistenceStage}
					stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
					<Localisation />
				</DependenciesProvider>,
			);

			await remplirFormulaireEtape3();

			// WHEN
			await user.click(screen.getByRole('button', { name: 'Envoyer ma demande de dépôt d’offre' }));

			// THEN
			const loadingSubmitButton = screen.getByRole('button', { name: 'Envoi en cours' });
			expect(loadingSubmitButton).toBeVisible();
			expect(loadingSubmitButton).toBeDisabled();
		});

		describe('quand l’étape 3 a déjà été remplie', () => {
			it('pré-remplit les champs avec les données déjà saisies', () => {
				// GIVEN
				const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
					getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
				});
				const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
					getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
				});
				const persistenceLocalisation = aStageDeposerOffreEtape3PersistenceService({
					getInformationsEtape3: vi.fn().mockReturnValue(aFormulaireEtapeLocalisation()),
				});

				// WHEN
				render(
					<DependenciesProvider
						stageService={aStageService()}
						stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
						stageDeposerOffreEtape2PersistenceService={persistenceStage}
						stageDeposerOffreEtape3PersistenceService={persistenceLocalisation}>
						<Localisation />
					</DependenciesProvider>,
				);

				// THEN
				expect(screen.getByRole('combobox', { name: 'Pays Exemple : France' })).toHaveValue('France');
				expect(screen.getByRole('textbox', { name: 'Ville Exemple : Paris' })).toHaveValue('Paris');
				expect(screen.getByRole('textbox', { name: 'Adresse Exemple : 127 rue de Grenelle' })).toHaveValue('34 avenue de l’Opéra');
				expect(screen.getByRole('textbox', { name: 'Code postal Exemple : 75007' })).toHaveValue('75000');
				expect(screen.getByRole('textbox', { name: 'Région Exemple : Île-De-France' })).toHaveValue('Ile-de-France');
				expect(screen.getByRole('textbox', { name: 'Département Exemple : Yvelines' })).toHaveValue('Paris');
			});
		});

		describe('modale d‘erreur', () => {
			it('lorsque la soumission est en erreur, ouvre la modale d‘erreur', async () => {
				const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
					getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
				});
				const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
					getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
				});

				const user = userEvent.setup();
				const stageService = aStageService({ enregistrerOffreDeStage: vi.fn() });
				vi.spyOn(stageService, 'enregistrerOffreDeStage').mockResolvedValue(createFailure(ErreurMetier.CONTENU_INDISPONIBLE));

				render(
					<DependenciesProvider
						stageService={stageService}
						stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
						stageDeposerOffreEtape2PersistenceService={persistenceStage}
						stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
						<Localisation />
					</DependenciesProvider>,
				);

				await remplirFormulaireEtape3();

				await user.click(screen.getByRole('button', { name: 'Envoyer ma demande de dépôt d’offre' }));

				expect(screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' })).toBeVisible();
			});

			it('lorsque je ferme la modale d‘erreur avec le bouton Fermer', async () => {
				const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
					getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
				});
				const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
					getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
				});

				const user = userEvent.setup();
				const stageService = aStageService({ enregistrerOffreDeStage: vi.fn() });
				vi.spyOn(stageService, 'enregistrerOffreDeStage').mockResolvedValue(createFailure(ErreurMetier.CONTENU_INDISPONIBLE));

				render(
					<DependenciesProvider
						stageService={stageService}
						stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
						stageDeposerOffreEtape2PersistenceService={persistenceStage}
						stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
						<Localisation />
					</DependenciesProvider>,
				);

				await remplirFormulaireEtape3();

				await user.click(screen.getByRole('button', { name: 'Envoyer ma demande de dépôt d’offre' }));

				const modaleErreur = screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' });
				expect(modaleErreur).toBeVisible();
				await user.click(within(modaleErreur).getByRole('button', { name:'Fermer' }));

				expect(screen.getByText('Étape 3 sur 3 : Localisation du stage')).toBeVisible();
			});

			it('lorsque je ferme la modale d‘erreur avec le bouton Retour au formulaire', async () => {
				const persistenceEntreprise = aStageDeposerOffreEtape1PersistenceService({
					getInformationsEtape1: vi.fn().mockReturnValue(aFormulaireEtapeEntreprise()),
				});
				const persistenceStage = aStageDeposerOffreEtape2PersistenceService({
					getInformationsEtape2: vi.fn().mockReturnValue(aFormulaireEtapeStage()),
				});

				const user = userEvent.setup();
				const stageService = aStageService({ enregistrerOffreDeStage: vi.fn() });
				vi.spyOn(stageService, 'enregistrerOffreDeStage').mockResolvedValue(createFailure(ErreurMetier.CONTENU_INDISPONIBLE));

				render(
					<DependenciesProvider
						stageService={stageService}
						stageDeposerOffreEtape1PersistenceService={persistenceEntreprise}
						stageDeposerOffreEtape2PersistenceService={persistenceStage}
						stageDeposerOffreEtape3PersistenceService={aStageDeposerOffreEtape3PersistenceService()}>
						<Localisation />
					</DependenciesProvider>,
				);

				await remplirFormulaireEtape3();

				await user.click(screen.getByRole('button', { name: 'Envoyer ma demande de dépôt d’offre' }));

				const modaleErreur = screen.getByRole('dialog', { name: 'Une erreur est survenue lors de l‘envoi du formulaire' });
				expect(modaleErreur).toBeVisible();
				await user.click(within(modaleErreur).getByRole('button', { name:'Retour au formulaire' }));

				expect(screen.getByText('Étape 3 sur 3 : Localisation du stage')).toBeVisible();
			});
		});
	});
});

async function remplirFormulaireEtape3() {
	const user = userEvent.setup();
	await user.type(screen.getByRole('combobox', { name: 'Pays Exemple : France' }), 'France');
	await user.click(screen.getByRole('option', { name: 'France' }));
	await user.type(screen.getByRole('textbox', { name: 'Ville Exemple : Paris' }), 'Toulon');
	await user.type(screen.getByRole('textbox', { name: 'Adresse Exemple : 127 rue de Grenelle' }), 'rue de la faim');
	await user.type(screen.getByRole('textbox', { name: 'Code postal Exemple : 75007' }), '83000');
}
