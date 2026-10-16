import { type Mock } from "vitest";

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import {
	FormulaireRechercheAccompagnement,
} from '~/client/components/features/Accompagnement/FormulaireRecherche/FormulaireRechercheAccompagnement';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';

describe('FormulaireRechercheAccompagnement', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	describe('lorsqu‘on recherche par commune', () => {
		it('les informations de la commune sont ajoutées à l’url',  async() => {
			// GIVEN
			const routerPush = vi.fn();

			mockUseRouter({ push: routerPush, query: {
				typeAccompagnement: 'mission_locale',
			} });
			const localisationServiceMock = aLocalisationService();

			render(
				<DependenciesProvider localisationService={localisationServiceMock}>
					<FormulaireRechercheAccompagnement />
				</DependenciesProvider>,
			);

			const user = userEvent.setup();
			const comboboxCommune = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
			await user.type(comboboxCommune, 'Pari');
			const resultListCommune = await screen.findAllByRole('option');
			await user.click(resultListCommune[0]);
			const submitButton = screen.getByRole('button', { name: 'Rechercher' });

			// WHEN
			await user.click(submitButton);

			// THEN
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codeCommune=75056') }, undefined, { shallow: true });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('latitudeCommune=48.859') }, undefined, { shallow: true });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('longitudeCommune=2.347') }, undefined, { shallow: true });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codePostal=75006') }, undefined, { shallow: true });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('ville=Paris') }, undefined, { shallow: true });
		});
	});
	describe('lorsqu‘on recherche par type d‘accompagnement', () => {
		let localisationServiceMock: LocalisationService;
		let routerPush: Mock;

		beforeEach(() => {
			routerPush = vi.fn();
			mockUseRouter({ push: routerPush });
			localisationServiceMock = aLocalisationService();
		});
		it('affiche le filtre type d‘accompagnement', () => {
			render(
				<DependenciesProvider localisationService={localisationServiceMock}>
					<FormulaireRechercheAccompagnement />
				</DependenciesProvider>,
			);

			const selectTypeAccompagnement = screen.getByRole('combobox', { name:'Type d‘accompagnement Exemple : Missions locales' });
			expect(selectTypeAccompagnement).toBeVisible();
		});
	});

	it('rempli les champs du formulaire avec les query params', async () => {
		mockUseRouter({ query: {
			typeAccompagnement: 'mission_locale',
			...aCommuneQuery({
				codePostal: '75001',
				ville: 'Paris',
			}),
		} });

		render(
			<DependenciesProvider localisationService={aLocalisationService()}>
				<FormulaireRechercheAccompagnement />
			</DependenciesProvider>,
		);

		const localisation = screen.getByRole('combobox', { name: /Localisation/i });
		expect(localisation).toHaveValue('Paris (75001)');
		const selectTypeAccompagnement = screen.getByRole('combobox', { name:'Type d‘accompagnement Exemple : Missions locales' });
		expect(selectTypeAccompagnement).toHaveTextContent('Missions locales');
		expect(screen.getByDisplayValue('mission_locale')).toBeInTheDocument();
	});
});
