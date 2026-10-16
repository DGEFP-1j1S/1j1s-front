import {
	render,
	screen,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';

import { useSearchBox } from 'react-instantsearch';
vi.mock('react-instantsearch');

vi.mocked(useSearchBox);

describe('<MeilisearchInput/>', () => {
	it('ne retourne pas de form', () => {
		render(
	  <MeilisearchInput
				label='Ville'
				name="ville"
				placeholder="Exemples : Paris, Toulouse" />,
		);
		const form = screen.queryByRole('form');
		expect(form).not.toBeInTheDocument();
	});

	it('contient un input associé à label', () => {
		render(
	  <MeilisearchInput
				label='Ville'
				name="ville"
				placeholder="Exemples : Paris, Toulouse" />,
		);
		const input = screen.getByLabelText('Ville', { selector: 'input' });
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('name', 'ville');
		expect(input).toHaveAttribute('placeholder', 'Exemples : Paris, Toulouse');
	});

	it('ne contient pas de button reset quand le champ est vide', () => {
		render(
	  <MeilisearchInput
				label='Ville'
				name="ville"
				placeholder="Exemples : Paris, Toulouse" />,
		);

		const resetButton = screen.queryByRole('button');
		expect(resetButton).not.toBeInTheDocument();

	});

	it('contient un button reset quand le champ est rempli', async() => {
		render(
	  <MeilisearchInput
				label='Ville'
				name="ville"
				placeholder="Exemples : Paris, Toulouse" />,
		);
		const user = userEvent.setup();
		const input = screen.getByLabelText('Ville', { selector: 'input' });
		await user.type(input, 'pa');

		const resetButton = screen.queryByRole('button');
		expect(resetButton).toBeInTheDocument();
	});

	it('rend le titre du bouton reset par défaut quand celui ci n‘est pas précisé', async () => {
		render(
	  <MeilisearchInput
				label='Ville'
				name="ville"
				placeholder="Exemples : Paris, Toulouse" />,
		);
		const user = userEvent.setup();
		const input = screen.getByLabelText('Ville', { selector: 'input' });
		await user.type(input, 'pa');

		const resetButton = screen.queryByRole('button');
		expect(resetButton).toHaveAttribute('title', 'Vider le champ de recherche');
	});

	it('rend le titre du bouton reset passé en paramètre quand celui ci est précisé', async () => {
		render(
	  <MeilisearchInput
				label='Ville'
				name="ville"
				placeholder="Exemples : Paris, Toulouse"
				resetTitle={'Vider le champ ville'} />,
		);
		const user = userEvent.setup();
		const input = screen.getByLabelText('Ville', { selector: 'input' });
		await user.type(input, 'pa');

		const resetButton = screen.queryByRole('button');
		expect(resetButton).toHaveAttribute('title', 'Vider le champ ville');
	});
});
