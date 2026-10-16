import { type Mock } from "vitest";


import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { KeyBoard } from '~/client/components/keyboard.fixture';
import { Pagination } from '~/client/components/ui/Pagination/Pagination';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockSmallScreen } from '~/client/components/window.mock';

const REVENIR_A_LA_PREMIERE_PAGE = 'Revenir à la première page';
const REVENIR_A_LA_PAGE_PRECENDENTE = 'Revenir à la page précédente';
const ALLER_A_LA_PAGE_SUIVANTE = 'Aller à la page suivante';
const ALLER_A_LA_DERNIERE_PAGE = 'Aller à la dernière page';

describe('Pagination', () => {
	beforeEach(() => {
		mockLargeScreen();
	});
	describe('quand il y a deja une page dans l‘url', () => {
		it('affiche directement la page dans la pagination', () => {
			mockUseRouter({ query: { page: '3' } });
			render(
				<Pagination numberOfResult={470} numberOfResultPerPage={30} />,
			);

			expect(screen.getByRole('link', { current: true, name: '3' })).toBeInTheDocument();
		});
	});

	describe('quand on souhaite limiter le nombre maximum de page visible', () => {
		it('doit afficher seulement les pages souhaitées', () => {
			mockUseRouter({});
			render(
				<Pagination numberOfResult={70000} numberOfResultPerPage={15} maxPage={66} />,
			);

			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('…')).toBeInTheDocument();
			expect(screen.getByText('67')).toBeInTheDocument();
			expect(screen.queryByText('68')).not.toBeInTheDocument();
		});
	});

	describe('quand il y a 100 résultats et 1O résultats par page à afficher', () => {
		describe('doit désactiver la return to first page et Page précédente', () => {
			it('doit afficher les 4 premières pages, une ellipse, la page 16, Page suivante et le go to last page', () => {
				mockUseRouter({});
				render(
					<Pagination numberOfResult={470} numberOfResultPerPage={30} />,
				);

				expect(screen.getByRole('link', { name: REVENIR_A_LA_PREMIERE_PAGE }).getAttribute('aria-disabled')).toBe('true');
				expect(screen.getByRole('link', { name: REVENIR_A_LA_PAGE_PRECENDENTE }).getAttribute('aria-disabled')).toBe('true');
				expect(screen.getByText('1')).toBeInTheDocument();
				expect(screen.getByText('2')).toBeInTheDocument();
				expect(screen.getByText('3')).toBeInTheDocument();
				expect(screen.getByText('4')).toBeInTheDocument();
				expect(screen.getByText('5')).toBeInTheDocument();
				expect(screen.queryByText('6')).not.toBeInTheDocument();
				expect(screen.getByText('…')).toBeInTheDocument();
				expect(screen.getByText('16')).toBeInTheDocument();
				expect(screen.getByRole('link', { name: ALLER_A_LA_PAGE_SUIVANTE }).getAttribute('aria-disabled')).toBe('false');
				expect(screen.getByRole('link', { name: ALLER_A_LA_DERNIERE_PAGE }).getAttribute('aria-disabled')).toBe('false');
			});
		});

		describe('quand l utilisateur clique sur 5 puis 9', () => {
			describe('en vue mobile', () => {
				it('doit afficher le return to the first page, le less than, 4 pages avant et après la page 9, une ellipse, le more than et le go to last page', async () => {
					mockSmallScreen();
					mockUseRouter({});
					render(
						<Pagination numberOfResult={470} numberOfResultPerPage={30} />,
					);

					const page3 = screen.getByRole('link', { current: false, name: '3' });
					fireEvent.click(page3);
					await screen.findByRole('link', { current: false, name: '5' });
					const page5 = screen.getByRole('link', { current: false, name: '5' });
					fireEvent.click(page5);

					expect(screen.getByRole('link', { name: REVENIR_A_LA_PREMIERE_PAGE }).getAttribute('aria-disabled')).toBe('false');
					expect(screen.getByRole('link', { name: REVENIR_A_LA_PAGE_PRECENDENTE }).getAttribute('aria-disabled')).toBe('false');
					expect(screen.getByText('3')).toBeInTheDocument();
					expect(screen.getByText('4')).toBeInTheDocument();
					expect(screen.getByText('5')).toBeInTheDocument();
					expect(screen.getByText('6')).toBeInTheDocument();
					expect(screen.getByText('7')).toBeInTheDocument();
					expect(screen.getByText('…')).toBeInTheDocument();
					expect(screen.getByText('16')).toBeInTheDocument();
					expect(screen.getByRole('link', { name: ALLER_A_LA_PAGE_SUIVANTE }).getAttribute('aria-disabled')).toBe('false');
					expect(screen.getByRole('link', { name: ALLER_A_LA_DERNIERE_PAGE }).getAttribute('aria-disabled')).toBe('false');
				});
			});

			it('doit afficher return to the first page, Page précédente, 4 pages avant et après la page 9, une ellipse, Page suivante et le go to last page', async () => {
				mockUseRouter({});
				render(
					<Pagination numberOfResult={470} numberOfResultPerPage={30} />,
				);

				const page5 = screen.getByRole('link', { current: false, name: '5' });
				fireEvent.click(page5);
				await screen.findByRole('link', { current: false, name: '9' });
				const page9 = screen.getByRole('link', { current: false, name: '9' });
				fireEvent.click(page9);

				expect(screen.getByRole('link', { name: REVENIR_A_LA_PREMIERE_PAGE }).getAttribute('aria-disabled')).toBe('false');
				expect(screen.getByRole('link', { name: REVENIR_A_LA_PAGE_PRECENDENTE }).getAttribute('aria-disabled')).toBe('false');
				expect(screen.getByText('5')).toBeInTheDocument();
				expect(screen.getByText('6')).toBeInTheDocument();
				expect(screen.getByText('7')).toBeInTheDocument();
				expect(screen.getByText('8')).toBeInTheDocument();
				expect(screen.getByText('9')).toBeInTheDocument();
				expect(screen.getByText('10')).toBeInTheDocument();
				expect(screen.getByText('11')).toBeInTheDocument();
				expect(screen.getByText('12')).toBeInTheDocument();
				expect(screen.getByText('13')).toBeInTheDocument();
				expect(screen.getByText('…')).toBeInTheDocument();
				expect(screen.getByText('16')).toBeInTheDocument();
				expect(screen.getByRole('link', { name: ALLER_A_LA_PAGE_SUIVANTE }).getAttribute('aria-disabled')).toBe('false');
				expect(screen.getByRole('link', { name: ALLER_A_LA_DERNIERE_PAGE }).getAttribute('aria-disabled')).toBe('false');

				// quand l‘utilisateur clique ensuite sur la dernière page (16)
				// doit afficher doit afficher return to the first page, Page précédente, 4 avant la page 16

				const page16 = screen.getByRole('link', { current: false, name: '16' });
				fireEvent.click(page16);

				expect(screen.getByRole('link', { name: REVENIR_A_LA_PREMIERE_PAGE }).getAttribute('aria-disabled')).toBe('false');
				expect(screen.getByRole('link', { name: REVENIR_A_LA_PAGE_PRECENDENTE }).getAttribute('aria-disabled')).toBe('false');
				expect(screen.getByText('12')).toBeInTheDocument();
				expect(screen.getByText('13')).toBeInTheDocument();
				expect(screen.getByText('14')).toBeInTheDocument();
				expect(screen.getByText('15')).toBeInTheDocument();
				expect(screen.queryByText('…')).not.toBeInTheDocument();
				expect(screen.getByText('16')).toBeInTheDocument();
				expect(screen.getByRole('link', { name: ALLER_A_LA_PAGE_SUIVANTE }).getAttribute('aria-disabled')).toBe('true');
				expect(screen.getByRole('link', { name: ALLER_A_LA_DERNIERE_PAGE }).getAttribute('aria-disabled')).toBe('true');
			});
		});

		describe('quand l utilisateur clique sur la pagination', () => {
			it('met à jour l url avec la valeur sélectionné', async () => {
				const routerPush = vi.fn();

				mockUseRouter({ push: routerPush });
				render(
					<Pagination numberOfResult={470} numberOfResultPerPage={30} />,
				);

				// l‘utilisateur clique sur la troisière page
				const page3 = screen.getByRole('link', { current: false, name: '3' });
				await userEvent.click(page3);

				// met à jour avec la page 3 dans l‘url
				expect(screen.getByRole('link', { current: true, name: '3' })).toBeInTheDocument();
				expect(routerPush).toHaveBeenCalledWith({ query: { page: 3 } });

				// l‘utilisateur clique sur la page suivante
				const goToNextPage = screen.getByRole('link', { name: ALLER_A_LA_PAGE_SUIVANTE });
				await userEvent.click(goToNextPage);

				// met à jour avec la page 4 dans l‘url
				expect(screen.getByRole('link', { current: false, name: '3' })).toBeInTheDocument();
				expect(screen.getByRole('link', { current: true, name: '4' })).toBeInTheDocument();
				expect(routerPush).toHaveBeenCalledWith({ query: { page: 4 } });

				// l‘utilisateur clique sur la page précédente
				const returnToPreviousPage = screen.getByRole('link', { name: REVENIR_A_LA_PAGE_PRECENDENTE });
				await userEvent.click(returnToPreviousPage);

				// met à jour avec la page 3 dans l‘url
				expect(screen.getByRole('link', { current: false, name: '4' })).toBeInTheDocument();
				expect(screen.getByRole('link', { current: true, name: '3' })).toBeInTheDocument();
				expect(routerPush).toHaveBeenCalledWith({ query: { page: 3 } });

				// l‘utilisateur clique sur go to last page
				const goToLastPage = screen.getByRole('link', { name: ALLER_A_LA_DERNIERE_PAGE });
				await userEvent.click(goToLastPage);

				// met à jour avec la page 16 dans l‘url
				expect(screen.getByRole('link', { current: true, name: '16' })).toBeInTheDocument();
				expect(routerPush).toHaveBeenCalledWith({ query: { page: 16 } });

				// l‘utilisateur clique sur return to fisrt page
				const returnToFirstPage = screen.getByRole('link', { name: REVENIR_A_LA_PREMIERE_PAGE });
				await userEvent.click(returnToFirstPage);

				// met à jour avec la page 1 dans l‘url
				expect(screen.getByRole('link', { current: true, name: '1' })).toBeInTheDocument();
				expect(routerPush).toHaveBeenCalledWith({ query: { page: 1 } });
			});
		});
	});

	describe('quand il y moins de 2 résultats', () => {
		it('n‘affiche pas la pagination', () => {
			mockUseRouter({});
			render(
				<Pagination numberOfResult={2} numberOfResultPerPage={25} />,
			);

			expect(screen.queryByRole('list')).not.toBeInTheDocument();
		});
	});

	describe('quand il y moins de 12 résultats et 1O résultats par page à afficher', () => {
		it('affiche la pagination avec 2 pages', () => {
			mockUseRouter({});
			render(
				<Pagination numberOfResult={12} numberOfResultPerPage={10} />,
			);
			expect(screen.getByRole('link', { current: true, name: '1' })).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.queryByText('3')).not.toBeInTheDocument();

		});
	});
	describe('je peux naviguer au clavier', () => {
		let routerPush: Mock;

		beforeEach(() => {
			routerPush = vi.fn();
			mockUseRouter({ push: routerPush, query: { page: '3' } });

		});

		it('la flèche retour', async () => {
			const user = userEvent.setup();
			render(
				<Pagination numberOfResult={70000} numberOfResultPerPage={15} maxPage={66} />,
			);

			const linkPagePrécédente = screen.getByRole('link', { name: REVENIR_A_LA_PAGE_PRECENDENTE });
			linkPagePrécédente.focus();
			await user.keyboard(KeyBoard.ENTER);

			expect(routerPush).toHaveBeenCalledWith({ query: { page: 2 } });
		});

		it('la flèche suivante', async () => {
			const user = userEvent.setup();
			render(
				<Pagination numberOfResult={10} numberOfResultPerPage={2} />,
			);

			const linkPagePrécédente = screen.getByRole('link', { name: ALLER_A_LA_PAGE_SUIVANTE });
			linkPagePrécédente.focus();
			await user.keyboard(KeyBoard.ENTER);

			expect(routerPush).toHaveBeenCalledWith({ query: { page: 4 } });
		});
		it('la flèche aller au début', async () => {
			const user = userEvent.setup();
			render(
				<Pagination numberOfResult={10} numberOfResultPerPage={2} />,
			);

			const linkPagePrécédente = screen.getByRole('link', { name: REVENIR_A_LA_PREMIERE_PAGE });
			linkPagePrécédente.focus();
			await user.keyboard(KeyBoard.ENTER);

			expect(routerPush).toHaveBeenCalledWith({ query: { page: 1 } });
		});
		it('la flèche aller à la fin', async () => {
			const user = userEvent.setup();
			render(
				<Pagination numberOfResult={10} numberOfResultPerPage={2} />,
			);

			const linkPagePrécédente = screen.getByRole('link', { name: ALLER_A_LA_DERNIERE_PAGE });
			linkPagePrécédente.focus();
			await user.keyboard(KeyBoard.ENTER);

			expect(routerPush).toHaveBeenCalledWith({ query: { page: 5 } });
		});
	});
});
