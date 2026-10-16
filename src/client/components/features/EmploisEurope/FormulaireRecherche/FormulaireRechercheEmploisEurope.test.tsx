import { render, screen, within } from '@testing-library/react';
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
		it('le bouton de filtre avancé à le type button pour ne pas prendre automatiquement le type submit', () => {
			mockUseRouter({});

			render(
				<FormulaireRechercheEmploisEurope />,
			);
			const buttonFiltresAvances = screen.getByRole('button', { name: 'Filtrer ma recherche' });

			expect(buttonFiltresAvances).toHaveAttribute('type', 'button');
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
		describe('quand on recherche par type de contrat', () => {
			it('ajoute les types de contrat aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				const buttonFiltresAvances = screen.getByRole('button', { name: 'Filtrer ma recherche' });

				// WHEN
				await user.click(buttonFiltresAvances);
				const modalComponent = screen.getByRole('dialog');
				const checkboxApprentissage = within(modalComponent).getByRole('checkbox', { name: 'Apprentissage' });
				await user.click(checkboxApprentissage);
				const buttonAppliquerFiltres = within(modalComponent).getByRole('button', { name: 'Appliquer les filtres' });
				await user.click(buttonAppliquerFiltres);
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN
				expect(routerPush).toHaveBeenCalledWith({ query: `typeContrat=${EURES_CONTRACT_TYPE.Apprenticeship}&page=1` }, undefined, { shallow: true });
			});
		});
		describe('quand on recherche par temps de travail', () => {
			it('ajoute les types de temps de travail aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				const buttonFiltresAvances = screen.getByRole('button', { name: 'Filtrer ma recherche' });

				// WHEN
				await user.click(buttonFiltresAvances);
				const modalComponent = screen.getByRole('dialog');
				const checkboxTempsDeTravail = within(modalComponent).getByRole('checkbox', { name: 'Temps partiel' });
				await user.click(checkboxTempsDeTravail);
				const buttonAppliquerFiltres = within(modalComponent).getByRole('button', { name: 'Appliquer les filtres' });
				await user.click(buttonAppliquerFiltres);
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN

				expect(routerPush).toHaveBeenCalledWith({ query: `tempsDeTravail=${EURES_POSITION_SCHEDULE_TYPE.PartTime}&page=1` }, undefined, { shallow: true });
			});
		});
		describe('quand on recherche par niveau d’étude', () => {
			it('ajoute les niveaux d’étude aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				const buttonFiltresAvances = screen.getByRole('button', { name: 'Filtrer ma recherche' });

				// WHEN
				await user.click(buttonFiltresAvances);
				const modalComponent = screen.getByRole('dialog');
				const checkboxNiveauEtude = within(modalComponent).getByRole('checkbox', { name: 'Master (Bac+5)' });
				await user.click(checkboxNiveauEtude);
				const buttonAppliquerFiltres = within(modalComponent).getByRole('button', { name: 'Appliquer les filtres' });
				await user.click(buttonAppliquerFiltres);
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN

				expect(routerPush).toHaveBeenCalledWith({ query: `niveauEtude=${NiveauDEtudeValue.MASTER}&page=1` }, undefined, { shallow: true });
			});
		});

		describe('quand on recherche par secteur d‘activité', () => {
			it('ajoute les secteurs d‘activité aux query params', async () => {
				// GIVEN
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<FormulaireRechercheEmploisEurope />,
				);

				const buttonFiltresAvances = screen.getByRole('button', { name: 'Filtrer ma recherche' });

				// WHEN
				await user.click(buttonFiltresAvances);
				const modalComponent = screen.getByRole('dialog');

				const checkboxSecteurActivite = within(modalComponent).getByRole('checkbox', { name: 'Agriculture, sylviculture et pêche' });
				await user.click(checkboxSecteurActivite);

				const checkboxSecteurActiviteSecondOption = within(modalComponent).getByRole('checkbox', { name: 'Hébergement et restauration' });
				await user.click(checkboxSecteurActiviteSecondOption);

				const buttonAppliquerFiltres = within(modalComponent).getByRole('button', { name: 'Appliquer les filtres' });
				await user.click(buttonAppliquerFiltres);
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				// THEN

				expect(routerPush).toHaveBeenCalledWith({ query: 'secteurActivite=A%2CI&page=1' }, undefined, { shallow: true });
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
});
