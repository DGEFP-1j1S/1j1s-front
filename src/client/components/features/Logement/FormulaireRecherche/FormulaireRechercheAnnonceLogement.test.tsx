import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireRechercheAnnonceLogement,
} from '~/client/components/features/Logement/FormulaireRecherche/FormulaireRechercheAnnonceLogement';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockScrollIntoView } from '~/client/components/window.mock';

const FACETTES = {
	typesBien: [{ nombre: 2, valeur: 'appartement' }],
	typesOffre: [{ nombre: 3, valeur: 'location' }],
};

describe('FormulaireRechercheAnnonceLogement', () => {
	beforeEach(() => {
		mockLargeScreen();
		mockScrollIntoView();
	});

	it('affiche un formulaire', () => {
		mockUseRouter({});
		render(<FormulaireRechercheAnnonceLogement facettes={FACETTES} />);

		const form = screen.getByRole('search');
		expect(form).toBeVisible();
	});

	it('affiche les champs de recherche', () => {
		mockUseRouter({});
		render(<FormulaireRechercheAnnonceLogement facettes={FACETTES} />);

		expect(screen.getByRole('textbox', { name: /Ville/ })).toBeVisible();
		expect(screen.getByRole('combobox', { name: 'Type d‘offre Exemple : Location' })).toBeVisible();
		expect(screen.getByRole('combobox', { name: 'Type de bien Exemple : Appartement' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Surface (m²)' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Prix' })).toBeVisible();
	});

	it('reprend la recherche de l‘URL dans les champs', () => {
		mockUseRouter({ query: { prixMax: '800', typesOffre: 'location', ville: 'Lyon' } });
		render(<FormulaireRechercheAnnonceLogement facettes={FACETTES} />);

		expect(screen.getByRole('textbox', { name: /Ville/ })).toHaveValue('Lyon');
		expect(screen.getByRole('combobox', { name: 'Type d‘offre Exemple : Location' })).toHaveTextContent('1 choix sélectionné');
		expect(screen.getByRole('button', { name: 'Prix' })).toHaveTextContent('Jusqu‘à 800 €');
	});

	it('à la soumission, met les critères de recherche dans l‘URL et revient à la première page', async () => {
		const user = userEvent.setup();
		const push = vi.fn();
		mockUseRouter({ push, query: { page: '4' } });
		render(<FormulaireRechercheAnnonceLogement facettes={FACETTES} />);

		await user.type(screen.getByRole('textbox', { name: /Ville/ }), 'Lyon');
		await user.click(screen.getByRole('combobox', { name: 'Type de bien Exemple : Appartement' }));
		await user.click(screen.getByRole('option', { name: 'Appartement' }));
		await user.click(screen.getByRole('button', { name: 'Prix' }));
		await user.type(screen.getByLabelText('Minimum'), '300');
		await user.type(screen.getByLabelText('Maximum'), '800');
		await user.click(screen.getByRole('button', { name: 'Appliquer' }));
		await user.click(screen.getByRole('button', { name: 'Rechercher' }));

		expect(push).toHaveBeenCalledWith({ query: 'ville=Lyon&typesBien=appartement&prixMin=300&prixMax=800&page=1' }, undefined, { scroll: false });
	});
});
