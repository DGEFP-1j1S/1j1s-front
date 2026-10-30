import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React, { useState } from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { ComboboxMultiple } from '~/client/components/ui/Form/Combobox/ComboboxMultiple/ComboboxMultiple';
import { mockScrollIntoView } from '~/client/components/window.mock';

function ComboboxMultipleAvecEtat({ onChange = vi.fn(), valeursInitiales = [] as Array<string> }) {
	const [value, setValue] = useState(valeursInitiales);
	const [inputValue, setInputValue] = useState('');
	return (
		<>
			<label htmlFor="ville">Ville</label>
			<ComboboxMultiple
				id="ville"
				optionsAriaLabel="villes"
				value={value}
				onChange={(optionValue) => {
					onChange(optionValue);
					setValue((precedent) => precedent.includes(optionValue)
						? precedent.filter((valeur) => valeur !== optionValue)
						: [...precedent, optionValue]);
				}}
				inputValue={inputValue}
				onInputValueChange={setInputValue}>
				<ComboboxMultiple.Option value="paris">Paris</ComboboxMultiple.Option>
				<ComboboxMultiple.Option value="lyon">Lyon</ComboboxMultiple.Option>
			</ComboboxMultiple>
		</>
	);
}

describe('<ComboboxMultiple />', () => {
	beforeEach(() => {
		mockScrollIntoView();
	});

	it('affiche une liste d‘options à choix multiples, fermée par défaut', () => {
		render(<ComboboxMultipleAvecEtat />);

		expect(screen.getByRole('combobox', { name: 'Ville' })).toHaveAttribute('aria-expanded', 'false');
		const listbox = screen.getByRole('listbox', { hidden: true });
		expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
		expect(listbox).not.toBeVisible();
	});

	it('ouvre la liste et transmet la saisie quand l‘utilisateur tape', async () => {
		const user = userEvent.setup();
		render(<ComboboxMultipleAvecEtat />);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.type(combobox, 'pa');

		expect(combobox).toHaveValue('pa');
		expect(combobox).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('listbox', { name: 'villes' })).toBeVisible();
	});

	it('coche les options correspondant aux valeurs', async () => {
		const user = userEvent.setup();
		render(<ComboboxMultipleAvecEtat valeursInitiales={['lyon']} />);

		await user.click(screen.getByRole('combobox', { name: 'Ville' }));

		expect(screen.getByRole('option', { name: 'Lyon' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('option', { name: 'Paris' })).toHaveAttribute('aria-selected', 'false');
	});

	it('au clic sur une option, transmet sa valeur et garde la liste ouverte ainsi que la saisie', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<ComboboxMultipleAvecEtat onChange={onChange} />);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.type(combobox, 'pa');
		await user.click(screen.getByRole('option', { name: 'Paris' }));

		expect(onChange).toHaveBeenCalledWith('paris');
		expect(screen.getByRole('option', { name: 'Paris' })).toHaveAttribute('aria-selected', 'true');
		expect(combobox).toHaveAttribute('aria-expanded', 'true');
		expect(combobox).toHaveValue('pa');
	});

	it('décoche une option cochée au clic', async () => {
		const user = userEvent.setup();
		render(<ComboboxMultipleAvecEtat valeursInitiales={['paris']} />);

		await user.click(screen.getByRole('combobox', { name: 'Ville' }));
		await user.click(screen.getByRole('option', { name: 'Paris' }));

		expect(screen.getByRole('option', { name: 'Paris' })).toHaveAttribute('aria-selected', 'false');
	});

	it('au clavier, coche l‘option active avec Entrée sans soumettre le formulaire', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event) => event.preventDefault());
		render(<form onSubmit={onSubmit}><ComboboxMultipleAvecEtat /></form>);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.click(combobox);
		await user.keyboard(`{${KeyBoard.ARROW_DOWN}}{${KeyBoard.ARROW_DOWN}}`);

		expect(combobox).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Lyon' }).id);

		await user.keyboard(`{${KeyBoard.ENTER}}`);

		expect(screen.getByRole('option', { name: 'Lyon' })).toHaveAttribute('aria-selected', 'true');
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('sans option active, Entrée soumet le formulaire', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event) => event.preventDefault());
		render(<form onSubmit={onSubmit}><ComboboxMultipleAvecEtat /></form>);

		await user.type(screen.getByRole('combobox', { name: 'Ville' }), 'pa');
		await user.keyboard(`{${KeyBoard.ENTER}}`);

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('ferme la liste avec Échap', async () => {
		const user = userEvent.setup();
		render(<ComboboxMultipleAvecEtat />);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.type(combobox, 'pa');
		await user.keyboard(`{${KeyBoard.ESCAPE}}`);

		expect(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	it('ferme la liste quand le focus quitte le champ', async () => {
		const user = userEvent.setup();
		render(<><ComboboxMultipleAvecEtat /><button>ailleurs</button></>);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.type(combobox, 'pa');
		await user.click(screen.getByRole('button', { name: 'ailleurs' }));

		expect(combobox).toHaveAttribute('aria-expanded', 'false');
	});

	it('vide la saisie quand le focus quitte le champ, sans toucher aux options cochées', async () => {
		const user = userEvent.setup();
		render(<><ComboboxMultipleAvecEtat valeursInitiales={['lyon']} /><button>ailleurs</button></>);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.type(combobox, 'pa');
		await user.click(screen.getByRole('button', { name: 'ailleurs' }));

		expect(combobox).toHaveValue('');
		expect(screen.getByRole('option', { hidden: true, name: 'Lyon' })).toHaveAttribute('aria-selected', 'true');
	});

	it('conserve la saisie quand on clique sur une option', async () => {
		const user = userEvent.setup();
		render(<ComboboxMultipleAvecEtat />);

		const combobox = screen.getByRole('combobox', { name: 'Ville' });
		await user.type(combobox, 'pa');
		await user.click(screen.getByRole('option', { name: 'Paris' }));

		expect(combobox).toHaveValue('pa');
	});
});
