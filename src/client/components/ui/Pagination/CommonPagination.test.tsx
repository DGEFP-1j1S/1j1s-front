import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { CommonPagination, CommonPaginationProps } from '~/client/components/ui/Pagination/CommonPagination';
import { mockLargeScreen } from '~/client/components/window.mock';

function aCommonPaginationProps(overrides?: Partial<CommonPaginationProps>): CommonPaginationProps {
	return {
		currentPage: 2,
		isFirstPage: false,
		isLastPage: false,
		lastPage: 4,
		numberOfPageList: [0, 1, 2, 3],
		onPageClick: vi.fn(),
		...overrides,
	};
}

describe('CommonPagination', () => {
	beforeEach(() => {
		mockLargeScreen();
	});

	describe('quand l‘utilisateur clique sur le numéro de la page courante', () => {
		it('n‘appelle pas onPageClick', async () => {
			const user = userEvent.setup();
			const onPageClick = vi.fn();
			render(<CommonPagination {...aCommonPaginationProps({ currentPage: 2, onPageClick })} />);

			await user.click(screen.getByRole('link', { current: true, name: '3' }));

			expect(onPageClick).not.toHaveBeenCalled();
		});
	});

	describe('quand l‘utilisateur clique sur le numéro d‘une autre page', () => {
		it('appelle onPageClick avec cette page', async () => {
			const user = userEvent.setup();
			const onPageClick = vi.fn();
			render(<CommonPagination {...aCommonPaginationProps({ currentPage: 2, onPageClick })} />);

			await user.click(screen.getByRole('link', { current: false, name: '4' }));

			expect(onPageClick).toHaveBeenCalledTimes(1);
			expect(onPageClick).toHaveBeenCalledWith(3);
		});
	});
});
