import { render, screen } from '@testing-library/react';

import {
	FormulaireRechercheAnnonceLogement,
} from '~/client/components/features/Logement/FormulaireRecherche/FormulaireRechercheAnnonceLogement';
import {
	generateRefinementListItem,
	mockUseRefinementList,
} from '~/client/components/ui/Meilisearch/mockMeilisearchUseFunctions';
import { mockLargeScreen } from '~/client/components/window.mock';

import { useRefinementList } from 'react-instantsearch';
vi.mock('react-instantsearch');

const spyed = vi.mocked(useRefinementList);

describe('FormulaireRechercheAnnonceLogement', () => {
	it('affiche un formulaire', () => {
		render(<FormulaireRechercheAnnonceLogement />);

		const form = screen.getByRole('search');
		expect(form).toBeVisible();
	});

	beforeEach(() => {
		mockLargeScreen();
		spyed.mockImplementation(() => mockUseRefinementList({
			items: [generateRefinementListItem({ label: 'exemple', value: 'exemple' })],
			refine: vi.fn(),
		}));
	});

	it('affiche les champs de recherche', () => {
		render(<FormulaireRechercheAnnonceLogement />);

		expect(screen.getByRole('textbox', { name: /Ville/ })).toBeVisible();
		expect(screen.getByRole('combobox', { name: 'Type d‘offre Exemple : Location' })).toBeVisible();
		expect(screen.getByRole('combobox', { name: 'Type de bien Exemple : Appartement' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Surface (m²)' })).toBeVisible();
		expect(screen.getByRole('button', { name: 'Prix' })).toBeVisible();
	});
});
