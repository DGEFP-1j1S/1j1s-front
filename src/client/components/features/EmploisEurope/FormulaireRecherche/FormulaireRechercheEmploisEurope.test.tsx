import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireRechercheEmploisEurope,
} from '~/client/components/features/EmploisEurope/FormulaireRecherche/FormulaireRechercheEmploisEurope';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { EURES_POSITION_SCHEDULE_TYPE } from '~/client/domain/codesTempsTravailEures';
import { NiveauDEtudeValue } from '~/server/emplois-europe/domain/niveauDEtudes';
import { EURES_CONTRACT_TYPE } from '~/server/emplois-europe/infra/typesContratEures';

describe('FormulaireRechercheEmploisEurope', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	beforeEach(() => {
		mockSmallScreen();
	});
	describe('en version mobile', () => {
		beforeEach(() => {
			mockSmallScreen();
		});

		describe('quand on recherche par mot clé', () => {
			it('ajoute le mot clé recherché aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				// WHEN
				const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Métier, mot-clé ou entreprise Exemple : boulanger, marketing, Google' });
				await user.type(inputRechercheMotCle, 'boulanger');
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN
				expect(routerPush).toHaveBeenCalledWith({ query: 'motCle=boulanger&page=1' }, undefined, { shallow: true });
			});
		});
		describe('quand on recherche par localisation', () => {
			it('ajoute la localisation aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				// WHEN
				const inputRechercheLocalisation = screen.getByRole('combobox', { name: 'Localisation (pays) Exemple : Belgique, Allemagne' });
				await user.type(inputRechercheLocalisation, 'Espagne');
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN
				expect(routerPush).toHaveBeenCalledWith({ query: 'libellePays=Espagne&codePays=ES&page=1' }, undefined, { shallow: true });
			});
		});
	});

	describe('en version desktop', () => {
		beforeEach(() => {
			mockLargeScreen();
		});

		it('affiche les filtres avancés sans modale', async () => {
			mockUseRouter({});

			render(
				<FormulaireRechercheEmploisEurope />,
			);

			expect(screen.getByRole('combobox', { name: 'Type de contrat Exemple : Alternance, Contrat déterminé' })).toBeVisible();
			expect(screen.getByRole('combobox', { name: 'Temps de travail Exemple : Temps plein, temps partiel' })).toBeVisible();
			expect(screen.getByRole('combobox', { name: 'Niveau d‘études demandé Exemple : Master, Bachelor' })).toBeVisible();
		});

		describe('quand on recherche par type de contrat', () => {
			it('ajoute les types de contrat aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				// WHEN
				const button = screen.getByRole('combobox', { name: 'Type de contrat Exemple : Alternance, Contrat déterminé' });
				await user.click(button);
				const checkboxApprentissage = screen.getByRole('option', { name: 'Apprentissage' });
				await user.click(checkboxApprentissage);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN
				expect(routerPush).toHaveBeenCalledWith({ query: `typeContrat=${EURES_CONTRACT_TYPE.Apprenticeship}&page=1` }, undefined, { shallow: true });
			});
		});

		it('affiche les types de contrat choisis dans le bouton dès qu’ils sont modifiés', async () => {
			const user = userEvent.setup();
			mockUseRouter({});
			render(<FormulaireRechercheEmploisEurope />);
			const button = screen.getByRole('combobox', { name: 'Type de contrat Exemple : Alternance, Contrat déterminé' });

			await user.click(button);
			await user.click(screen.getByRole('option', { name: 'Bénévole' }));
			expect(button).toHaveTextContent(/^Bénévole$/);

			await user.click(screen.getByRole('option', { name: 'Apprentissage' }));
			expect(button).toHaveTextContent(/^Apprentissage, Bénévole$/);

			await user.click(screen.getByRole('option', { name: 'Bénévole' }));
			expect(button).toHaveTextContent(/^Apprentissage$/);
		});

		describe('quand on recherche par temps de travail', () => {
			it('ajoute les temps de travail aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				// WHEN
				const button = screen.getByRole('combobox', { name: 'Temps de travail Exemple : Temps plein, temps partiel' });
				await user.click(button);

				const checkboxTempsDeTravail = screen.getByRole('option', { name: 'Temps plein' });
				await user.click(checkboxTempsDeTravail);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN
				expect(routerPush).toHaveBeenCalledWith({ query: `tempsDeTravail=${EURES_POSITION_SCHEDULE_TYPE.FullTime}&page=1` }, undefined, { shallow: true });
			});
		});

		describe('quand on recherche par niveau d‘étude', () => {
			it('ajoute les niveaux d‘étude aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				// WHEN
				const button = screen.getByRole('combobox', { name: 'Niveau d‘études demandé Exemple : Master, Bachelor' });
				await user.click(button);

				const checkboxNiveauEtude = screen.getByRole('option', { name: 'Master (Bac+5)' });
				await user.click(checkboxNiveauEtude);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN

				expect(routerPush).toHaveBeenCalledWith({ query: `niveauEtude=${NiveauDEtudeValue.MASTER}&page=1` }, undefined, { shallow: true });
			});
		});

		describe('quand on recherche par secteur d‘activité', () => {
			it('ajoute les secteurs d’activités aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				// WHEN
				const button = screen.getByRole('combobox', { name: 'Domaines Exemple : Agriculture, Communication' });
				await user.click(button);

				const checkboxSecteurActivite = screen.getByRole('option', { name: 'Agriculture, sylviculture et pêche' });
				await user.click(checkboxSecteurActivite);

				const checkboxSecteurActiviteSecondOption = screen.getByRole('option', { name: 'Hébergement et restauration' });
				await user.click(checkboxSecteurActiviteSecondOption);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN

				expect(routerPush).toHaveBeenCalledWith({ query: 'secteurActivite=A%2CI&page=1' }, undefined, { shallow: true });
			});
		});
	});
	it('rempli automatiquement les champs lorsque les query params sont présents', async () => {
		mockLargeScreen();
		mockUseRouter({ query: {
			codePays: 'ES',
			libellePays: 'Espagne',
			motCle: 'boulanger',
			secteurActivite: 'B',
			tempsDeTravail: EURES_POSITION_SCHEDULE_TYPE.FullTime,
		},
		});
		const user = userEvent.setup();

		render(
			<FormulaireRechercheEmploisEurope />,
		);

		const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Métier, mot-clé ou entreprise Exemple : boulanger, marketing, Google' });
		expect(inputRechercheMotCle).toHaveValue('boulanger');
		const inputRechercheLocalisation = screen.getByRole('combobox', { name: 'Localisation (pays) Exemple : Belgique, Allemagne' });
		expect(inputRechercheLocalisation).toHaveValue('Espagne');

		const button = screen.getByRole('combobox', { name: 'Temps de travail Exemple : Temps plein, temps partiel' });
		await user.click(button);

		const optionTempsPlein = screen.getByRole('option', { name: 'Temps plein' });
		expect(optionTempsPlein).toHaveAttribute('aria-selected', 'true');
	});
	it('laisse le champ localisation vide si il manque le code pays dans les query params', async () => {
		mockUseRouter({ query: {
			libellePays: 'Pays inconnu',
			motCle: 'boulanger',
		} });

		render(
			<FormulaireRechercheEmploisEurope />,
		);

		const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Métier, mot-clé ou entreprise Exemple : boulanger, marketing, Google' });
		expect(inputRechercheMotCle).toHaveValue('boulanger');
		const inputRechercheLocalisation = screen.getByRole('combobox', { name: 'Localisation (pays) Exemple : Belgique, Allemagne' });
		expect(inputRechercheLocalisation).toHaveValue('');
	});
	it('laisse le champ localisation vide si il manque le libellé pays dans les query params', async () => {
		mockUseRouter({ query: {
			codePays: 'ES',
			motCle: 'boulanger',
		} });

		render(
			<FormulaireRechercheEmploisEurope />,
		);

		const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Métier, mot-clé ou entreprise Exemple : boulanger, marketing, Google' });
		expect(inputRechercheMotCle).toHaveValue('boulanger');
		const inputRechercheLocalisation = screen.getByRole('combobox', { name: 'Localisation (pays) Exemple : Belgique, Allemagne' });
		expect(inputRechercheLocalisation).toHaveValue('');
	});
	describe('quand on réinitialise le formulaire', () => {
		const query = {
			codePays: 'ES',
			libellePays: 'Espagne',
			motCle: 'boulanger',
			niveauEtude: NiveauDEtudeValue.MASTER,
			secteurActivite: 'A',
			tempsDeTravail: EURES_POSITION_SCHEDULE_TYPE.FullTime,
			typeContrat: EURES_CONTRACT_TYPE.Apprenticeship,
		};

		beforeEach(() => {
			mockLargeScreen();
		});

		it('vide tous les champs sans relancer la recherche', async () => {
			// GIVEN
			const routerPush = vi.fn();
			const user = userEvent.setup();
			mockUseRouter({ push: routerPush, query });
			render(<FormulaireRechercheEmploisEurope />);

			// WHEN
			await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));

			// THEN
			expect(screen.getByRole('textbox', { name: 'Métier, mot-clé ou entreprise Exemple : boulanger, marketing, Google' })).toHaveValue('');
			expect(screen.getByRole('combobox', { name: 'Localisation (pays) Exemple : Belgique, Allemagne' })).toHaveValue('');
			expect(screen.getByRole('option', { hidden: true, name: 'Apprentissage' })).toHaveAttribute('aria-selected', 'false');
			expect(screen.getByRole('option', { hidden: true, name: 'Temps plein' })).toHaveAttribute('aria-selected', 'false');
			expect(screen.getByRole('option', { hidden: true, name: 'Master (Bac+5)' })).toHaveAttribute('aria-selected', 'false');
			expect(screen.getByRole('option', { hidden: true, name: 'Agriculture, sylviculture et pêche' })).toHaveAttribute('aria-selected', 'false');
			expect(routerPush).not.toHaveBeenCalled();
		});

		it('soumet une recherche vide après réinitialisation', async () => {
			// GIVEN
			const routerPush = vi.fn();
			const user = userEvent.setup();
			mockUseRouter({ push: routerPush, query });
			render(<FormulaireRechercheEmploisEurope />);

			// WHEN
			await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
			await user.click(screen.getByRole('button', { name: 'Rechercher' }));

			// THEN
			expect(routerPush).toHaveBeenCalledWith({ query: 'page=1' }, undefined, { shallow: true });
		});
	});
});
