import { render, screen } from '@testing-library/react';
import React from 'react';

import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { mockScrollIntoView } from '~/client/components/window.mock';

describe('<SelectOption />', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});

	it('accepte un id et le passe à l‘option', () => {
		render(<SelectMultiple optionsAriaLabel={'options'}>
			<SelectMultiple.Option value="1" id="id1">option 1</SelectMultiple.Option>
			<SelectMultiple.Option value="2">option 2</SelectMultiple.Option>
		</SelectMultiple>);

		expect(screen.getByRole('option', { hidden: true, name: 'option 1' })).toHaveAttribute('id', 'id1');
	});

	it('accepte une value et la passe à l‘option', () => {
		render(<SelectMultiple optionsAriaLabel={'options'}>
			<SelectMultiple.Option value="1">option 1</SelectMultiple.Option>
			<SelectMultiple.Option value="2">option 2</SelectMultiple.Option>
		</SelectMultiple>);

		expect(screen.getByRole('option', { hidden: true, name: 'option 1' })).toHaveAttribute('data-value', '1');
	});
});
