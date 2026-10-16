import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireRechercheAnnonceLogement,
} from '~/client/components/features/Logement/FormulaireRecherche/FormulaireRechercheAnnonceLogement';
import {
	generateRefinementListItem,
	mockUseRefinementList,
} from '~/client/components/ui/Meilisearch/mockMeilisearchUseFunctions';
import { mockLargeScreen, mockSmallScreen } from '~/client/components/window.mock';

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

	describe('en Desktop', () => {
		it('affiche les champs de recherche', () => {
			render(<FormulaireRechercheAnnonceLogement />);

			expect(screen.getByRole('textbox', { name: 'Ville' })).toBeVisible();
			expect(screen.getByRole('combobox', { name: 'Type d‘offre' })).toBeVisible();
			expect(screen.getByRole('combobox', { name: 'Type de bien' })).toBeVisible();
			expect(screen.getByRole('button', { name: 'Surface (m²)' })).toBeVisible();
			expect(screen.getByRole('button', { name: 'Prix' })).toBeVisible();
		});
	});

	describe('en Mobile', () => {
		beforeEach(() => {
			mockSmallScreen();
		});

		it('affiche uniquement le champ ville dans le formulaire', () => {
			render(<FormulaireRechercheAnnonceLogement />);

			expect(screen.getByRole('textbox', { name: 'Ville' })).toBeVisible();
		});

		it('affiche un bouton pour filtrer la recherche', () => {
			render(<FormulaireRechercheAnnonceLogement />);

			const buttonFiltre = screen.getByRole('button', { name: 'Filtrer ma recherche' });
			expect(buttonFiltre).toBeVisible();
		});

		describe('quand l‘utilisateur ouvre les filtres de recherche', () => {
			it('affiche la modale', async () => {
				const user = userEvent.setup();

				render(<FormulaireRechercheAnnonceLogement />);

				const buttonFiltre = screen.getByRole('button', { name: 'Filtrer ma recherche' });
				await user.click(buttonFiltre);

				const modalComponent = screen.getByRole('dialog');
				expect(modalComponent).toHaveClass('show');
			});

			it('affiche le champ type d‘offre', async () => {
				const user = userEvent.setup();
				spyed.mockImplementation(() => mockUseRefinementList({
					items: [
						generateRefinementListItem({ label: 'type 1', value: 'type1' }),
						generateRefinementListItem({ label: 'type 2', value: 'type2' }),
						generateRefinementListItem({ label: 'type 3', value: 'type3' }),
					],
				}));

				render(<FormulaireRechercheAnnonceLogement />);

				await user.click(screen.getByRole('button', { name: 'Filtrer ma recherche' }));

				const modal = screen.getByRole('dialog');
				const typeDOffre = within(modal).getByRole('group', { name: 'Type d‘offre' });
				expect(typeDOffre).toBeVisible();
				expect(within(typeDOffre).getByRole('checkbox', { name: 'Type 1' })).toBeVisible();
				expect(within(typeDOffre).getByRole('checkbox', { name: 'Type 2' })).toBeVisible();
				expect(within(typeDOffre).getByRole('checkbox', { name: 'Type 3' })).toBeVisible();
			});

			it('affiche le champ type de bien', async () => {
				const user = userEvent.setup();
				spyed.mockImplementation(() => mockUseRefinementList({
					items: [
						generateRefinementListItem({ label: 'type de bien 1', value: 'type1' }),
						generateRefinementListItem({ label: 'type de bien 2', value: 'type2' }),
						generateRefinementListItem({ label: 'type de bien 3', value: 'type3' }),
					],
				}));


				render(<FormulaireRechercheAnnonceLogement />);

				await user.click(screen.getByRole('button', { name: 'Filtrer ma recherche' }));
				const modal = screen.getByRole('dialog');
				await user.click(within(modal).getByText('Type de bien'));

				const typeDeBien = within(modal).getByRole('group', { name: 'Type de bien' });
				expect(typeDeBien).toBeVisible();
				expect(within(typeDeBien).getByRole('checkbox', { name: 'Type de bien 1' })).toBeVisible();
				expect(within(typeDeBien).getByRole('checkbox', { name: 'Type de bien 2' })).toBeVisible();
				expect(within(typeDeBien).getByRole('checkbox', { name: 'Type de bien 3' })).toBeVisible();
			});

			it('affiche le champ prix', async () => {
				spyed.mockImplementation(() => mockUseRefinementList({
					items: [
						generateRefinementListItem({ label: 'prix 1', value: 'prix1' }),
						generateRefinementListItem({ label: 'prix 2', value: 'prix2' }),
						generateRefinementListItem({ label: 'prix 3', value: 'prix3' }),
					],
				}));

				const user = userEvent.setup();

				render(<FormulaireRechercheAnnonceLogement />);

				await user.click(screen.getByRole('button', { name: 'Filtrer ma recherche' }));
				const modal = screen.getByRole('dialog');
				await user.click(within(modal).getByText('Prix'));

				const prix = within(modal).getByRole('group', { name: 'Prix' });
				expect(prix).toBeVisible();
				expect(within(prix).getByRole('spinbutton', { name: 'Minimum' })).toBeVisible();
				expect(within(prix).getByRole('spinbutton', { name: 'Maximum' })).toBeVisible();
			});

			it('affiche le champ surface', async () => {
				spyed.mockImplementation(() => mockUseRefinementList({
					items: [
						generateRefinementListItem({ label: 'surface 1', value: 'surface1' }),
						generateRefinementListItem({ label: 'surface 2', value: 'surface2' }),
						generateRefinementListItem({ label: 'surface 3', value: 'surface3' }),
					],
				}));
				const user = userEvent.setup();

				render(<FormulaireRechercheAnnonceLogement />);

				await user.click(screen.getByRole('button', { name: 'Filtrer ma recherche' }));
				const modal = screen.getByRole('dialog');
				await user.click(within(modal).getByText('Surface'));

				const surface = within(modal).getByRole('group', { name: 'Surface' });
				expect(surface).toBeVisible();
				expect(within(surface).getByRole('spinbutton', { name: 'Minimum' })).toBeVisible();
				expect(within(surface).getByRole('spinbutton', { name: 'Maximum' })).toBeVisible();
			});
		});
	});
});
