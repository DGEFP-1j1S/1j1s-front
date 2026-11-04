import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { ChampFacette } from '~/client/components/ui/Form/ChampFacette/ChampFacette';
import { mockScrollIntoView } from '~/client/components/window.mock';

describe('<ChampFacette />', () => {
	beforeEach(() => {
		mockScrollIntoView();
	});

	it('propose les valeurs de la facette triées, avec une majuscule', async () => {
		const user = userEvent.setup();
		render(<ChampFacette label="Domaines" name="domaines" valeursInitiales={[]} facettes={[{ nombre: 1, valeur: 'conseil' }, { nombre: 3, valeur: 'audit' }]} />);

		await user.click(screen.getByRole('combobox', { name: 'Domaines' }));

		expect(screen.getAllByRole('option').map((option) => option.textContent)).toStrictEqual(['Audit', 'Conseil']);
	});

	it('garde proposée une valeur cochée absente de la facette, pour pouvoir la décocher', async () => {
		const user = userEvent.setup();
		render(<ChampFacette label="Domaines" name="domaines" valeursInitiales={['droit']} facettes={[{ nombre: 3, valeur: 'audit' }]} />);

		await user.click(screen.getByRole('combobox', { name: 'Domaines' }));

		expect(screen.getByRole('option', { name: 'Droit' })).toHaveAttribute('aria-selected', 'true');
	});
});
