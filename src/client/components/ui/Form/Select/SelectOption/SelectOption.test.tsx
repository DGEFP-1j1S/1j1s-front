import { render, screen } from '@testing-library/react';
import React from 'react';

import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { mockScrollIntoView } from '~/client/components/window.mock';

describe('<Select />', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});

	describe('SelectOption', () => {
		it('accepte un id et le passe à l‘option', () => {
			render(<SelectSimple optionsAriaLabel={'options'}>
				<SelectSimple.Option value="1" id="id1">option 1</SelectSimple.Option>
				<SelectSimple.Option value="2">option 2</SelectSimple.Option>
			</SelectSimple>);

			expect(screen.getByRole('option', { hidden: true, name: 'option 1' })).toHaveAttribute('id', 'id1');
		});

		it('accepte une value et la passe à l‘option', () => {
			render(<SelectSimple optionsAriaLabel={'options'}>
				<SelectSimple.Option value="1">option 1</SelectSimple.Option>
				<SelectSimple.Option value="2">option 2</SelectSimple.Option>
			</SelectSimple>);

			expect(screen.getByRole('option', { hidden: true, name: 'option 1' })).toHaveAttribute('data-value', '1');
		});
	});
});
