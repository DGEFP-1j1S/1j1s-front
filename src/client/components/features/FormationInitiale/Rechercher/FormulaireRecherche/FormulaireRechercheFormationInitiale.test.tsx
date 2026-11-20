import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import {
	FormulaireRechercheFormationInitiale,
} from '~/client/components/features/FormationInitiale/Rechercher/FormulaireRecherche/FormulaireRechercheFormationInitiale';
import { mockUseRouter } from '~/client/components/useRouter.mock';

describe('FormulaireRechercheFormationInitiale', () => {
	it('Je vois les champs du formulaire de recherche', () => {
		mockUseRouter({});

		render(<FormulaireRechercheFormationInitiale />);
		const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Domaine, mot-clé… Exemples: boulanger, informatique' });
		expect(inputRechercheMotCle).toBeVisible();

		const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
		expect(buttonRechercher).toBeVisible();
	});
	describe('lorsque je fais une recherche', () => {
		it('ajoute le mot clé au query params', async () => {
			const user = userEvent.setup();
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });

			render(<FormulaireRechercheFormationInitiale />);
			const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Domaine, mot-clé… Exemples: boulanger, informatique' });
			await user.type(inputRechercheMotCle, 'boulanger');

			const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
			await user.click(buttonRechercher);

			expect(routerPush).toHaveBeenCalledWith({ query: 'motCle=boulanger&page=1' }, undefined, { shallow: true });
		});
	});
	describe('lorsque je fais une recherche sans remplir le formulaire', () => {
		it('ajoute un mot clé vide au query params', async () => {
			const user = userEvent.setup();
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });

			render(<FormulaireRechercheFormationInitiale />);

			const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
			await user.click(buttonRechercher);

			expect(routerPush).toHaveBeenCalledWith({ query: 'page=1' }, undefined, { shallow: true });
		});
	});
	it('rempli automatiquement les champs avec les query params', () => {
		mockUseRouter({
			query: {
				motCle: 'boulanger',
			},
		});

		render(<FormulaireRechercheFormationInitiale />);

		const inputRechercheMotCle = screen.getByRole('textbox', { name: 'Domaine, mot-clé… Exemples: boulanger, informatique' });
		expect(inputRechercheMotCle).toHaveValue('boulanger');
	});
	describe('quand on réinitialise le formulaire', () => {
		it('vide le champ sans lancer la recherche', async () => {
			const user = userEvent.setup();
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush, query: { motCle: 'boulanger' } });

			render(<FormulaireRechercheFormationInitiale />);
			await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));

			expect(screen.getByRole('textbox', { name: 'Domaine, mot-clé… Exemples: boulanger, informatique' })).toHaveValue('');
			expect(routerPush).not.toHaveBeenCalled();
		});
	});
});
