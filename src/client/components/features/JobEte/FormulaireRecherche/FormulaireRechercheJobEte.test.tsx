import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import {
	FormulaireRechercheJobEte,
} from '~/client/components/features/JobEte/FormulaireRecherche/FormulaireRechercheJobEte';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { référentielDomaineList } from '~/client/domain/référentielDomaineList';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { createSuccess } from '~/server/errors/either';
import { aLocalisationListWithCommuneAndDépartement } from '~/server/localisations/domain/localisation.fixture';

describe('FormulaireRechercheJobEte', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});
	describe('en version mobile', () => {
		beforeEach(() => {
			mockSmallScreen();
		});

		describe('quand on recherche par mot clé', () => {
			it('ajoute le mot clé recherché aux query params', async () => {
				// GIVEN
				const localisationServiceMock = aLocalisationService();
				const routerPush = vi.fn();
				mockUseRouter({ push: routerPush });

				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheJobEte />
					</DependenciesProvider>,
				);

				const inputRechercheMotClé = screen.getByRole('textbox', { name: 'Métier, mot-clé (minimum 2 caractères) Exemples : boulanger, informatique…' });
				fireEvent.change(inputRechercheMotClé, { target: { value: 'boulanger' } });
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });

				// WHEN
				fireEvent.click(buttonRechercher);

				// THEN
				expect(routerPush).toHaveBeenCalledWith({ query: 'motCle=boulanger&page=1' }, undefined, { scroll: false });
			});
		});

		describe('quand on recherche par localisation', () => {
			it('ajoute la localisation aux query params', async () => {
				// GIVEN
				const localisationServiceMock = aLocalisationService();
				vi.spyOn(localisationServiceMock, 'rechercherLocalisation').mockResolvedValue(createSuccess(aLocalisationListWithCommuneAndDépartement()));
				const user = userEvent.setup();
				const routerPush = vi.fn();
				mockUseRouter({ push: routerPush });
				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheJobEte />
					</DependenciesProvider>,
				);

				const inputLocalisation = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.type(inputLocalisation, 'Par');
				const resultatsLocalisation = await screen.findAllByRole('option');
				await user.click(resultatsLocalisation[1]);

				// WHEN
				await user.click(buttonRechercher);

				// THEN
				expect(localisationServiceMock.rechercherLocalisation).toHaveBeenCalledWith('Par');
				expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('nomLocalisation=Paris') }, undefined, { scroll: false });
				expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codePostalLocalisation=75001') }, undefined, { scroll: false });
				expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('typeLocalisation=COMMUNE') }, undefined, { scroll: false });
				expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codeLocalisation=75101') }, undefined, { scroll: false });
			});
		});
	});

	describe('en version desktop', () => {
		beforeEach(() => {
			mockLargeScreen();
		});

		it('affiche les filtres avancés sans modale', async () => {
			// GIVEN
			const localisationServiceMock = aLocalisationService();
			mockUseRouter({ push: vi.fn() });
			render(
				<DependenciesProvider localisationService={localisationServiceMock}>
					<FormulaireRechercheJobEte />
				</DependenciesProvider>,
			);

			const button = screen.getByRole('combobox', { name: 'Domaines Exemple : Commerce, Immobilier…' });
			expect(button).toBeVisible();

		});

		describe('quand on filtre par domaine', () => {
			it('ajoute le domaine sélectionné aux query params', async () => {
				const user = userEvent.setup();
				const localisationServiceMock = aLocalisationService();
				const routerPush = vi.fn();
				mockUseRouter({ push: routerPush });

				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheJobEte />
					</DependenciesProvider>,
				);

				const select = screen.getByRole('combobox', { name: 'Domaines Exemple : Commerce, Immobilier…' });
				await user.click(select);
				const optionDomaine = screen.getByRole('option', { name: référentielDomaineList[2].libelle });
				await user.click(optionDomaine);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				expect(routerPush).toHaveBeenCalledWith({ query: `grandDomaine=${référentielDomaineList[2].code}&page=1` }, undefined, { scroll: false });
			});
		});
	});

	it('rempli automatiquement les champs avec les query params', () => {
		mockUseRouter({ query: {
			codeLocalisation: '75110',
			codePostalLocalisation: '75010',
			grandDomaine: référentielDomaineList[0].code,
			motCle: 'Boulanger',
			nomLocalisation: 'Paris',
			typeLocalisation: 'COMMUNE',
		} });

		render(
			<DependenciesProvider localisationService={aLocalisationService()}>
				<FormulaireRechercheJobEte />
			</DependenciesProvider>,
		);

		const motCle = screen.getByRole('textbox', { name: /Métier, mot-clé/i });
		expect(motCle).toHaveValue('Boulanger');
		const localisation = screen.getByRole('combobox', { name: /Localisation/i });
		expect(localisation).toHaveValue('Paris (75010)');

		expect(screen.getByRole('combobox', { name: 'Domaines Exemple : Commerce, Immobilier…' })).toHaveTextContent('1 choix sélectionné');
		expect(screen.getByDisplayValue(référentielDomaineList[0].code)).toBeInTheDocument();
	});
});
