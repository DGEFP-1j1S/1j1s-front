import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { mockScrollIntoView } from '~/client/components/window.mock';

import { Combobox } from '.';

describe('<Combobox />', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});

	it('affiche un combobox', () => {
		render(
			<Combobox optionsAriaLabel="Pays">
				<Combobox.Option>Option 1</Combobox.Option>
				<Combobox.Option>Option 2</Combobox.Option>
				<Combobox.Option>Option 3</Combobox.Option>
			</Combobox>,
		);

		const input = screen.getByRole('combobox');

		expect(input).toBeVisible();
	});

	describe('default props', () => {
		it('accepte un ref', () => {
			const ref = vi.fn();

			render(
				<Combobox optionsAriaLabel="Pays" ref={ref}>
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(ref).toHaveBeenLastCalledWith(input);
		});
		it('accepte les props d’un input', () => {
			render(
				<Combobox optionsAriaLabel="Pays" disabled>
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAttribute('disabled');
		});
		it('accepte une value', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays" value="test" onChange={() => null}>
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			await user.click(input);
			await user.type(input, 'Salut');
			await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
			await user.keyboard(`{${KeyBoard.ENTER}}`);

			expect(input).toHaveValue('test');
		});
		it('accepte une defaultValue', () => {
			render(
				<Combobox optionsAriaLabel="Pays" defaultValue="test">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(input).toHaveValue('test');
		});
		it('prend la value de l’option quand la defaultValue match exactement une option', () => {
			render(
				<form aria-label="form">
					<Combobox optionsAriaLabel="Pays" defaultValue="Option 1" name="combobox">
						<Combobox.Option value="opt-1">Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>
				</form>,
			);

			const form = screen.getByRole('form');
			expect(form).toHaveFormValues({
				'combobox.label': 'Option 1',
				'combobox.value': 'opt-1',
			});
		});
		it('accepte du JSX en children des options', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option <strong>1</strong></Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			await user.click(input);
			await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
			await user.keyboard(`{${KeyBoard.ENTER}}`);

			expect(input).toHaveValue('Option 1');
		});
		it('accepte un classname pour styliser tout le composant', () => {
			const { container } = render(
				<Combobox optionsAriaLabel="Pays" className="test">
					<Combobox.Option>Option</Combobox.Option>
				</Combobox>,
			);

			// NOTE (GAFI 26-06-2023): Test explicitement qu'on place la classe sur le premier élément pour pouvoir tout styliser
			// eslint-disable-next-line testing-library/no-node-access
			expect(container.children).toHaveLength(1);
			// eslint-disable-next-line testing-library/no-node-access
			expect(container.firstChild).toHaveAttribute('class', expect.stringContaining('test'));
		});
		it('accepte un role', () => {
			render(
				<Combobox optionsAriaLabel="Pays" role="textbox">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('textbox');
			expect(input).toHaveAttribute('role', 'textbox');
		});
		it('accepte un aria-expanded', () => {
			render(
				<Combobox optionsAriaLabel="Pays" aria-expanded="true">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAttribute('aria-expanded', 'true');
		});
		it('accepte un aria-autocomplete', () => {
			render(
				<Combobox optionsAriaLabel="Pays" aria-autocomplete="both">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAttribute('aria-autocomplete', 'both');
		});
		it('accepte un aria-activedescendant', () => {
			render(
				<Combobox optionsAriaLabel="Pays" aria-activedescendant="test">
					<Combobox.Option id="test">Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(input).toHaveAttribute('aria-activedescendant', 'test');
		});

		it('merge la valeur pour aria-controls donné en props avec celle requise pour la liste', () => {
			render(
				<Combobox optionsAriaLabel="Pays" aria-controls="test">
					<Combobox.Option>Option 1</Combobox.Option>
				</Combobox>,
			);

			const combobox = screen.getByRole('combobox');
			const liste = screen.getByRole('listbox', { hidden: true });
			expect(combobox).toHaveAttribute('aria-controls', expect.stringContaining('test'));
			expect(combobox).toHaveAttribute('aria-controls', expect.stringContaining(liste.id));
		});
		it('n’ajoute pas undefined à la liste des aria-controls quand pas passé en props', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
				</Combobox>,
			);

			const combobox = screen.getByRole('combobox');
			expect(combobox).not.toHaveAttribute('aria-controls', expect.stringContaining('undefined'));
		});

		it('génère un id unique pour la liste', () => {
			render(
				<>
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
					</Combobox>
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
					</Combobox>
				</>,
			);

			const listes = screen.getAllByRole('listbox', { hidden: true });
			expect(listes[0].id).not.toEqual(listes[1].id);
		});

		it('maintient le type du bouton quand le composant est dans un formulaire', () => {
			render(
				<form>
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>
				</form>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('type', 'button');
		});

		describe('Events', () => {
			it('appelle onKeyDown quand une touche est pressée', async () => {
				const onKeyDown = vi.fn();
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays" onKeyDown={onKeyDown}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'A');

				expect(onKeyDown).toHaveBeenCalledTimes(1);
				expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'A' }));
			});
			it('appelle onChange et onInput quand on tape dans le champ', async () => {
				const user = userEvent.setup();
				const onChange = vi.fn();
				const onInput = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" onChange={onChange} onInput={onInput}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Opt');

				expect(onChange).toHaveBeenCalledTimes(3);
				expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ target: input }), 'Opt');
				expect(onInput).toHaveBeenCalledTimes(3);
				expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ target: input }), 'Opt');
			});
			it('appelle onChange et onInput quand on sélectionne une valeur au clavier', async () => {
				const user = userEvent.setup();
				const onChange = vi.fn();
				const onInput = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" value="Option" onChange={onChange} onInput={onInput}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ENTER}}`);

				expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ currentTarget: input }), 'Option 1');
				expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ currentTarget: input }), 'Option 1');
			});
			it('appelle onChange et onInput quand on sélectionne une valeur à la souris', async () => {
				const user = userEvent.setup();
				const onChange = vi.fn();
				const onInput = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" value="Option" onChange={onChange} onInput={onInput}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option');
				await user.click(screen.getByRole('option', { name: /Option 2/i }));

				expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ currentTarget: input }), 'Option 2');
				expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ currentTarget: input }), 'Option 2');
			});
			it('stop l’event de blur si nouveau focus toujours dans le combobox', async () => {
				const user = userEvent.setup();
				const onBlur = vi.fn();
				render(
					<>
						<Combobox optionsAriaLabel="Pays" onBlur={onBlur}>
							<Combobox.Option>Option 1</Combobox.Option>
						</Combobox>
					</>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				const button = screen.getByRole('button');
				await user.click(button);
				const option = screen.getByRole('option');
				await user.click(option);

				expect(onBlur).not.toHaveBeenCalled();
			});

			it.todo('appelle onChange et onInput quand ne match pas encore une option');
		});

		describe('<Combobox.Option />', () => {
			it('accepte un role', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option role="listitem">Option 1</Combobox.Option>
					</Combobox>,
				);

				const option = screen.getByRole('listitem', { hidden: true });
				expect(option).toHaveAttribute('role', 'listitem');
			});
			it('accepte un aria-selected', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option aria-selected="true">Option 1</Combobox.Option>
					</Combobox>,
				);

				const option = screen.getByRole('option', { hidden: true });
				expect(option).toHaveAttribute('aria-selected', 'true');
			});
			it('accepte un hidden', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option hidden={false}>Option 1</Combobox.Option>
					</Combobox>,
				);

				const option = screen.getByRole('option', { hidden: true });
				expect(option).not.toHaveAttribute('hidden');
			});
			it('accepte un id', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option id="test">Option 1</Combobox.Option>
					</Combobox>,
				);

				const option = screen.getByRole('option', { hidden: true });
				expect(option).toHaveAttribute('id', 'test');
			});
			it('appelle onClick quand on clique sur une option', async () => {
				const user = userEvent.setup();
				const onClick = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option id="test" onClick={onClick}>Option 1</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);
				const option = screen.getByRole('option');
				await user.click(option);

				expect(onClick).toHaveBeenCalledTimes(1);
				expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ target: option }));
			});
		});
	});

	describe('Navigation au clavier', () => {
		describe('Quand on appuie sur la flèche du bas', () => {
			it('affiche la liste de suggestions', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);

				const suggestionsList = screen.getByRole('listbox');
				expect(suggestionsList).toBeVisible();
				const suggestions = within(suggestionsList).getAllByRole('option');
				expect(suggestions).toHaveLength(3);
			});
			it('focus l’élément suivant de la liste', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);

				const suggestions = screen.getAllByRole('option');
				expect(input).toHaveAttribute('aria-activedescendant', suggestions[1].id);
				expect(suggestions[1]).toHaveAttribute('aria-selected', 'true');
			});
			it('focus le premier élément de la liste quand la liste est fermée', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);

				const suggestions = screen.getAllByRole('option');
				expect(input).toHaveAttribute('aria-activedescendant', suggestions[0].id);
				expect(suggestions[0]).toHaveAttribute('aria-selected', 'true');
			});
			it('revient au début de la liste quand on est sur le dernier élément', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);

				const suggestions = screen.getAllByRole('option');
				expect(input).toHaveAttribute('aria-activedescendant', suggestions[0].id);
				expect(suggestions[0]).toHaveAttribute('aria-selected', 'true');
			});
			it('conserve la position du curseur dans l’input', async () => {
				// NOTE (GAFI 13-06-2023): Impossible de reproduire le problème avec testing-library,
				//	Pour éviter de laisser du code non testé, test sur le détail d'implémentation
				const user = userEvent.setup();
				const onKeyDown = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" onKeyDown={onKeyDown}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);
				const input = screen.getByRole<HTMLInputElement>('combobox');
				await user.type(input, 'test');
				await user.keyboard(`{${KeyBoard.ARROW_LEFT}}`);

				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);

				expect(onKeyDown).toHaveBeenLastCalledWith(expect.objectContaining({ defaultPrevented: true }));
			});
		});
		describe('Quand on appuie sur la flèche du haut', () => {
			it('affiche la liste de suggestions', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

				const suggestionsList = screen.getByRole('listbox');
				expect(suggestionsList).toBeVisible();
				const suggestions = within(suggestionsList).getAllByRole('option');
				expect(suggestions).toHaveLength(3);
			});
			it('focus l’élément précédent de la liste', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

				const suggestions = screen.getAllByRole('option');
				expect(input).toHaveAttribute('aria-activedescendant', suggestions[1].id);
				expect(suggestions[1]).toHaveAttribute('aria-selected', 'true');
			});
			it('focus le dernier élément de la liste quand la liste est fermée', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

				const suggestions = screen.getAllByRole('option');
				expect(input).toHaveAttribute('aria-activedescendant', suggestions[2].id);
				expect(suggestions[2]).toHaveAttribute('aria-selected', 'true');
			});
			it('revient à la fin de la liste quand on est sur le premier élément', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

				const suggestions = screen.getAllByRole('option');
				expect(input).toHaveAttribute('aria-activedescendant', suggestions[2].id);
				expect(suggestions[2]).toHaveAttribute('aria-selected', 'true');
			});
			it('conserve la position du curseur dans l’input', async () => {
				// NOTE (GAFI 13-06-2023): Impossible de reproduire le problème avec testing-library,
				//	Pour éviter de laisser du code non testé, test sur le détail d'implémentation
				const user = userEvent.setup();
				const onKeyDown = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" onKeyDown={onKeyDown}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);
				const input = screen.getByRole<HTMLInputElement>('combobox');
				await user.type(input, 'test');
				await user.keyboard(`{${KeyBoard.ARROW_LEFT}}`);

				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

				expect(onKeyDown).toHaveBeenLastCalledWith(expect.objectContaining({ defaultPrevented: true }));
			});
		});
		describe('Quand on appuie sur Escape', () => {
			it('masque la liste', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);
				await user.keyboard(`{${KeyBoard.ESCAPE}}`);

				const suggestionsList = screen.getByRole('listbox', { hidden: true });
				expect(suggestionsList).not.toBeVisible();
			});
			it('retire l’option active du champ quand la liste est fermée', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				expect(input).toHaveAttribute('aria-activedescendant');

				await user.keyboard(`{${KeyBoard.ESCAPE}}`);

				expect(input).not.toHaveAttribute('aria-activedescendant');
			});
			it('reset la selection', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);
				await user.keyboard(`{${KeyBoard.ESCAPE}}`);

				const suggestions = screen.getAllByRole('option', { hidden: true });
				expect(input).not.toHaveAttribute('aria-activedescendant');
				suggestions.forEach((suggestion) => {
					expect(suggestion).toHaveAttribute('aria-selected', 'false');
				});
			});
		});
		describe('Quand on appuie sur Alt + flèche du bas', () => {
			it('ouvre la liste sans focus le premier élément', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ALT}>}{${KeyBoard.ARROW_DOWN}}{/${KeyBoard.ALT}}`);

				const suggestionsList = screen.getByRole('listbox');
				expect(suggestionsList).toBeVisible();
				const suggestions = screen.getAllByRole('option', { hidden: true });
				expect(input).not.toHaveAttribute('aria-activedescendant');
				expect(suggestions[0]).toHaveAttribute('aria-selected', 'false');
			});
		});
		describe('Quand on appuie sur Enter', () => {
			it('change la valeur de l’input quand le focus est sur un élément', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ENTER}}`);

				expect(input).toHaveValue('Option 1');
			});
			it('ferme la liste', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ENTER}}`);

				const suggestions = screen.getByRole('listbox', { hidden: true });
				expect(suggestions).not.toBeVisible();
			});
			it('submit le formulaire quand la liste est fermée', async () => {
				const user = userEvent.setup();
				const onSubmit = vi.fn((event) => event.preventDefault());
				render(
					<form onSubmit={onSubmit}>
						<Combobox optionsAriaLabel="Pays">
							<Combobox.Option>Option 1</Combobox.Option>
							<Combobox.Option>Option 2</Combobox.Option>
							<Combobox.Option>Option 3</Combobox.Option>
						</Combobox>
						<button>Submit</button>
					</form>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ENTER}}`);

				expect(onSubmit).toHaveBeenCalledTimes(1);
			});
			it('ne submit pas le formulaire quand on sélectionne un option', async () => {
				const user = userEvent.setup();
				const onSubmit = vi.fn();
				render(
					<form onSubmit={onSubmit}>
						<Combobox optionsAriaLabel="Pays">
							<Combobox.Option>Option 1</Combobox.Option>
							<Combobox.Option>Option 2</Combobox.Option>
							<Combobox.Option>Option 3</Combobox.Option>
						</Combobox>
					</form>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);
				await user.keyboard(`{${KeyBoard.ENTER}}`);

				expect(onSubmit).not.toHaveBeenCalled();
			});
		});
		it('scroll jusqu’à la nouvelle option active quand on change d’option active', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);
			const option = screen.getByRole('option', { hidden: true, name: /Option 3/i });
			// NOTE (GAFI 26-06-2023): viewport pas implémenté dans RTL, test sur le détail d'implémentation :(
			option.scrollIntoView = vi.fn();

			const input = screen.getByRole('combobox');
			await user.click(input);
			await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

			expect(option.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'nearest' }));
		});
		it('ne focus pas le bouton avec tab', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			await user.click(input);
			await user.tab();

			const button = screen.getByRole('button');
			expect(button).not.toHaveFocus();
		});
		it('ne donne pas le focus à la liste quand elle est ouverte et scrollable', () => {
			// NOTE (GAFI 23-08-2024): Un élément scrollable est automatiquement ajouté au taborder
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const list = screen.getByRole('listbox', { hidden: true });
			// NOTE (GAFI 23-08-2024): Pas mal lié à l'implémentation, mais on ne peut pas tester le comportement réel puisque
			//	testing-library ne permet pas d'importer le CSS ou d'émuler le rendu
			expect(list).toHaveAttribute('tabindex', '-1');
		});
	});

	describe('Interactions', () => {
		it('masque la liste de suggestions par défaut', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const suggestionsList = screen.getByRole('listbox', { hidden: true });
			expect(suggestionsList).not.toBeVisible();
		});
		it('fermer la liste quand on clique en dehors du combobox', async () => {
			const user = userEvent.setup();
			render(
				<>
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>
					Outside
				</>,
			);

			const button = screen.getByRole('button');
			await user.click(button);
			const outside = screen.getByText('Outside');
			await user.click(outside);

			const liste = screen.getByRole('listbox', { hidden: true });
			expect(liste).not.toBeVisible();
		});

		describe('Bouton chevron', () => {
			it('affiche la liste de suggestions quand on click sur le bouton', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);

				const suggestions = screen.getByRole('listbox');
				expect(suggestions).toBeVisible();
			});
			it('masque la liste de suggestions quand on click sur le bouton et que le menu est déplié', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);
				await user.click(button);

				const suggestions = screen.getByRole('listbox', { hidden: true });
				expect(suggestions).not.toBeVisible();
			});
			it('retourne le focus sur l’input quand on clique sur le bouton', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);

				const input = screen.getByRole('combobox');
				expect(input).toHaveFocus();
			});
			it('disable le bouton quand le composant est disabled', () => {
				render(
					<Combobox disabled optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				expect(button).toBeDisabled();
			});
			it('disable le bouton quand le composant est readonly', () => {
				render(
					<Combobox readOnly optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				expect(button).toBeDisabled();
			});
		});

		describe('Quand on clique sur une option', () => {
			it('change la valeur de l’input', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option');
				const option = screen.getByRole('option', { name: /Option 2/i });
				await user.click(option);

				expect(input).toHaveValue('Option 2');
			});
			it('ferme la liste', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option');
				const option = screen.getByRole('option', { name: /Option 2/i });
				await user.click(option);

				const suggestions = screen.getByRole('listbox', { hidden: true });
				expect(suggestions).not.toBeVisible();
			});
			it('retourne le focus sur l’input', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);
				const option = screen.getAllByRole('option')[0];
				await user.click(option);

				const input = screen.getByRole('combobox');
				expect(input).toHaveFocus();
			});
		});

		describe('Filtre', () => {
			it('ouvre la liste quand on commence à taper dans le champ', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Opt');

				const suggestions = screen.getByRole('listbox');
				expect(suggestions).toBeVisible();
			});
			it('filtre la liste quand on tape dans le champ', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option 1');

				const option1 = screen.getByRole('option', { name: 'Option 1' });
				expect(option1).toBeVisible();
				const option2 = screen.getByText('Option 2');
				expect(option2).not.toBeVisible();
			});
			it('skip les options masquées quand on passe à l’option suivante', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option 2');
				await user.keyboard(`{${KeyBoard.ARROW_DOWN}}`);

				const option = screen.getByRole('option', { name: 'Option 2' });
				expect(input).toHaveAttribute('aria-activedescendant', option.id);
				expect(option).toHaveAttribute('aria-selected', 'true');
			});
			it('skip les options masquées quand on passe à l’option précédente', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option 2');
				await user.keyboard(`{${KeyBoard.ARROW_UP}}`);

				const option = screen.getByRole('option', { name: 'Option 2' });
				expect(input).toHaveAttribute('aria-activedescendant', option.id);
				expect(option).toHaveAttribute('aria-selected', 'true');
			});
			it('ignore la casse quand les options sont filtrées', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>ABC</Combobox.Option>
						<Combobox.Option>abc</Combobox.Option>
						<Combobox.Option>Abc</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'a');

				const options = screen.getAllByRole('option');
				expect(options).toHaveLength(3);
			});
		});
	});

	describe('attributs ARIA', () => {
		it('marque les éléments pas sélectionnés avec aria-selected à false', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			expect(input).not.toHaveAttribute('aria-activedescendant');
			const suggestions = screen.getAllByRole('option', { hidden: true });
			expect(suggestions[0]).toHaveAttribute('aria-selected', 'false');
			expect(suggestions[1]).toHaveAttribute('aria-selected', 'false');
			expect(suggestions[2]).toHaveAttribute('aria-selected', 'false');
		});
		it('marque le combobox comme autocomplété par une liste', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const combobox = screen.getByRole('combobox');
			expect(combobox).toHaveAttribute('aria-autocomplete', 'list');
		});

		describe('aria-expanded', () => {
			it('marque le combobox comme étendu lorsque la liste est affichée', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);

				const combobox = screen.getByRole('combobox');
				expect(combobox).toHaveAttribute('aria-expanded', 'true');
			});
			it('marque le combobox comme replié lorsque la liste est masquée', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const combobox = screen.getByRole('combobox');
				expect(combobox).toHaveAttribute('aria-expanded', 'false');
			});
			it('marque le bouton comme étendu lorsque la liste est affichée', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);

				expect(button).toHaveAttribute('aria-expanded', 'true');
			});
			it('marque le bouton comme replié lorsque la liste est masquée', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				expect(button).toHaveAttribute('aria-expanded', 'false');
			});
		});

		describe('aria-controls', () => {
			it('marque le combobox comme contrôleur de la liste', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const combobox = screen.getByRole('combobox');
				const liste = screen.getByRole('listbox', { hidden: true });
				expect(combobox).toHaveAttribute('aria-controls', expect.stringContaining(liste.id));
			});
			it('marque le bouton comme contrôleur de la liste', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				const liste = screen.getByRole('listbox', { hidden: true });
				expect(button).toHaveAttribute('aria-controls', expect.stringContaining(liste.id));
			});
		});

		it('ajoute un label à la liste de suggestions avec optionsAriaLabel', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const button = screen.getByRole('button');
			await user.click(button);

			const liste = screen.getByRole('listbox', { hidden: true });
			expect(liste).toHaveAccessibleName('Pays');
		});

		it('ajoute un label au bouton avec optionsAriaLabel', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
				</Combobox>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveAccessibleName('Pays');
		});
	});

	describe('<Combobox.Option value />', () => {
		it('submit le label et la value de l’option quand présent', async () => {
			const user = userEvent.setup();
			render(
				<form aria-label="form">
					<Combobox name="combobox" optionsAriaLabel="Pays">
						<Combobox.Option value="test">Option 1</Combobox.Option>
					</Combobox>
				</form>,
			);

			const button = screen.getByRole('button', { name: 'Pays' });
			await user.click(button);
			const option = screen.getByRole('option');
			await user.click(option);

			expect(screen.getByRole('form')).toHaveFormValues({
				'combobox.label': 'Option 1',
				'combobox.value': 'test',
			});
		});
		it('ne submit pas le label et la value de l’option quand aucun nom n’est passé au combobox', async () => {
			const user = userEvent.setup();
			render(
				<form aria-label="form">
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option value="test">Option 1</Combobox.Option>
					</Combobox>
				</form>,
			);

			const button = screen.getByRole('button', { name: 'Pays' });
			await user.click(button);
			const option = screen.getByRole('option');
			await user.click(option);

			expect(screen.getByRole('form')).toHaveFormValues({
				'undefined.label': undefined,
				'undefined.value': undefined,
			});
		});
		it('submit le label comme value quand l’option n’a pas de value', async () => {
			const user = userEvent.setup();
			render(
				<form aria-label="form">
					<Combobox name="combobox" optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
					</Combobox>
				</form>,
			);

			const button = screen.getByRole('button', { name: 'Pays' });
			await user.click(button);
			const option = screen.getByRole('option');
			await user.click(option);

			expect(screen.getByRole('form')).toHaveFormValues({
				'combobox.label': 'Option 1',
				'combobox.value': 'Option 1',
			});
		});
		it('submit une value vide quand on submit sans sélectionner de valeur', async () => {
			const user = userEvent.setup();
			render(
				<form aria-label="form">
					<Combobox name="combobox" optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
					</Combobox>
				</form>,
			);

			const input = screen.getByRole('combobox');
			await user.type(input, 'test');

			expect(screen.getByRole('form')).toHaveFormValues({
				'combobox.label': 'test',
				'combobox.value': '',
			});
		});
		it('nomme la valeur avec la props valueName', async () => {
			const user = userEvent.setup();
			render(
				<form aria-label="form">
					<Combobox name="combobox" valueName="value" optionsAriaLabel="Pays">
						<Combobox.Option value="test">Option 1</Combobox.Option>
					</Combobox>
				</form>,
			);

			const input = screen.getByRole('combobox');
			await user.type(input, 'Option 1');

			expect(screen.getByRole('form')).toHaveFormValues({
				value: 'test',
			});
		});
		it('nomme le label avec la props name seulement quand un valueName est passé en props', async () => {
			const user = userEvent.setup();
			render(
				<form aria-label="form">
					<Combobox name="combobox" valueName="value" optionsAriaLabel="Pays">
						<Combobox.Option value="test">Option 1</Combobox.Option>
					</Combobox>
				</form>,
			);

			const input = screen.getByRole('combobox');
			await user.type(input, 'Option 1');

			expect(screen.getByRole('form')).toHaveFormValues({
				combobox: 'Option 1',
			});
		});
	});

	describe('validation', () => {
		describe('touched', () => {
			// NOTE (GAFI 07-07-2023): Ré-implémentation du sélecteur `:user-valid` (https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid)
			//	qui n'est pas encore suffisamment supporté (https://caniuse.com/mdn-css_selectors_user-valid)
			it('n’est pas marqué comme touché par défaut', () => {
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				expect(input).not.toHaveAttribute('data-touched', 'true');
			});
			it('marque le champ comme touché quand on quite le champ après avoir écrit dedans', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Opt');
				await user.tab();

				expect(input).toHaveAttribute('data-touched', 'true');
			});
			it('ne marque pas le champ tant qu’on ne quite pas le champ', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Opt');

				expect(input).not.toHaveAttribute('data-touched', 'true');

			});
			it('ne marque pas le champ comme touché quand on quite le champ sans avoir écrit dedans', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.tab();

				expect(input).not.toHaveAttribute('data-touched', 'true');
			});
			it('rapporte la validité du champ quand on marque le champ comme touché', async () => {
				const user = userEvent.setup();
				const onInvalid = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" required defaultValue="Option 1" onInvalid={onInvalid}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.clear(input);
				await user.tab();

				expect(onInvalid).toHaveBeenCalled();
			});
			it('rapporte la validité du champ quand on change la valeur après l’avoir touché', async () => {
				const user = userEvent.setup();
				const onInvalid = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" required onInvalid={onInvalid}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);
				const input = screen.getByRole('combobox');
				await user.type(input, 'A');
				await user.tab();

				await user.type(input, `{${KeyBoard.BACKSPACE}}`);

				expect(onInvalid).toHaveBeenCalled();
			});
			it('ne rapporte pas la validité du champ tant que le champ n’est pas touché', () => {
				const onInvalid = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" required value="" onInvalid={onInvalid}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				expect(onInvalid).not.toHaveBeenCalled();
			});
			it('appelle le callback onTouch quand le champ devient touched', async () => {
				const user = userEvent.setup();
				const onTouch = vi.fn();
				render(
					<Combobox optionsAriaLabel="Pays" required onTouch={onTouch}>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);
				const input = screen.getByRole('combobox');
				await user.type(input, 'A');
				await user.tab();

				await user.type(input, '{Backspace}');

				expect(onTouch).toHaveBeenCalledTimes(1);
				expect(onTouch).toHaveBeenCalledWith(true);
			});
		});

		describe('requireValidOption', () => {
			it('est invalide quand l’entrée n’appartient pas à la liste d’options', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays" requireValidOption>
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'test');

				expect(input).toBeInvalid();
			});
			it('est valide quand on sélectionne une options', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays" requireValidOption>
						<Combobox.Option>Option 1</Combobox.Option>
					</Combobox>,
				);

				const button = screen.getByRole('button');
				await user.click(button);
				const option = screen.getByRole('option');
				await user.click(option);

				const input = screen.getByRole('combobox');
				expect(input).toBeValid();
			});
			it('est valide quand entre le texte exacte d’une option', async () => {
				const user = userEvent.setup();
				render(
					<Combobox optionsAriaLabel="Pays" requireValidOption>
						<Combobox.Option>Option 1</Combobox.Option>
					</Combobox>,
				);

				const input = screen.getByRole('combobox');
				await user.type(input, 'Option 1');

				expect(input).toBeValid();
				expect(screen.queryByText('Veuillez sélectionner une option dans la liste')).not.toBeInTheDocument();
			});
			describe('lorsque l’option required est true', () => {
				it('est invalide quand l’entrée est vide', async () => {
					const user = userEvent.setup();
					render(
						<Combobox optionsAriaLabel="Pays" requireValidOption required>
							<Combobox.Option>Option 1</Combobox.Option>
						</Combobox>,
					);

					const input = screen.getByRole('combobox');
					await user.clear(input);

					expect(input).toBeInvalid();
				});
			});
			describe('lorsque l’option required est false', () => {
				it('est valide quand l’entrée est vide', async () => {
					const user = userEvent.setup();
					render(
						<Combobox optionsAriaLabel="Pays" requireValidOption required={false}>
							<Combobox.Option>Option 1</Combobox.Option>
						</Combobox>,
					);

					const input = screen.getByRole('combobox');
					await user.clear(input);

					expect(input).toBeValid();
				});
			});
		});
	});

	describe('<Combobox.Category />', () => {
		it('render un group d’options', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Category name="Options">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox.Category>
				</Combobox>,
			);

			const group = screen.getByRole('group', { hidden: true });
			expect(group).toBeInTheDocument();
		});
		it('nomme la catégorie', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Category name="Options">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox.Category>
				</Combobox>,
			);

			const group = screen.getByRole('group', { hidden: true });
			expect(group).toHaveAccessibleName('Options');
		});
		it('affiche le nom la catégorie', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Category name="Options">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox.Category>
				</Combobox>,
			);

			const categoryName = screen.getByText('Options');
			expect(categoryName).toBeInTheDocument();
		});
		it('masque les catégories qui n’ont pas de résultats de recherche', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Category name="Options">
						<Combobox.Option>Option 1</Combobox.Option>
						<Combobox.Option>Option 2</Combobox.Option>
						<Combobox.Option>Option 3</Combobox.Option>
					</Combobox.Category>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			await user.type(input, 'test');

			const category = screen.getByRole('group', { hidden: true });
			expect(category).not.toBeVisible();
		});
	});

	describe('<Combobox.AsyncMessage />', () => {
		it('render un élément avec le rôle status', () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.AsyncMessage>Chargement ...</Combobox.AsyncMessage>
				</Combobox>,
			);

			const loader = screen.getByRole('status', { hidden: true });
			expect(loader).toBeInTheDocument();
		});
		it('accepte une stratégie de filtre', async () => {
			const user = userEvent.setup();
			render(
				<Combobox optionsAriaLabel="Pays" filter={() => true}>
					<Combobox.Option>Option 1</Combobox.Option>
				</Combobox>,
			);

			const input = screen.getByRole('combobox');
			await user.type(input, 'test');

			const option = screen.getByRole('option', { name: 'Option 1' });
			expect(option).toBeVisible();
		});
	});

	describe('<Combobox.SyncMessagePasDeResultat />', () => {
		it('quand il n‘y a pas d‘option, affiche le message par défaut', async () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>test</Combobox.Option>
					<Combobox.Option>Abc</Combobox.Option>
					<Combobox.Option>def</Combobox.Option>
					<Combobox.SyncMessagePasDeResultat />
				</Combobox>,
			);
			const user = userEvent.setup();
			const input = screen.getByRole('combobox');
			await user.type(input, 'testet');

			const messagePasDeResultat = screen.getByRole('status');
			expect(messagePasDeResultat).toHaveTextContent('Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie est valide');
		});

		it('quand il n‘y a pas d‘option et qu‘un message customisé est donné, affiche le message', async () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>test</Combobox.Option>
					<Combobox.Option>Abc</Combobox.Option>
					<Combobox.Option>def</Combobox.Option>
					<Combobox.SyncMessagePasDeResultat>Pas de résultat</Combobox.SyncMessagePasDeResultat>
				</Combobox>,
			);
			const user = userEvent.setup();
			const input = screen.getByRole('combobox');
			await user.type(input, 'testet');

			const messagePasDeResultat = screen.getByRole('status');
			expect(messagePasDeResultat).toHaveTextContent('Pas de résultat');
		});

		it('quand il y a des options visible, n‘affiche pas le message', async () => {
			render(
				<Combobox optionsAriaLabel="Pays">
					<Combobox.Option>test</Combobox.Option>
					<Combobox.Option>Abc</Combobox.Option>
					<Combobox.Option>def</Combobox.Option>
					<Combobox.SyncMessagePasDeResultat>Pas de résultat</Combobox.SyncMessagePasDeResultat>
				</Combobox>,
			);
			const user = userEvent.setup();

			const input = screen.getByRole('combobox');
			await user.type(input, 'test');

			const messagePasDeResultat = screen.queryByRole('status');
			expect(messagePasDeResultat).not.toBeInTheDocument();
		});
	});
});
