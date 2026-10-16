import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { KeyBoard } from '~/client/components/keyboard.fixture';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { mockScrollIntoView } from '~/client/components/window.mock';

const SELECT_SIMPLE_LABEL_DEFAULT_OPTION = 'Sélectionnez votre choix';
const DEFAULT_DEBOUNCE_TIMEOUT = 300;

describe('<SelectSimpleSimple/>', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});

	describe('peut s‘associer avec Champ', () => {
		it('accepte un label et le lie au select', () => {
			render(<Champ>
				<Champ.Label>label</Champ.Label>
				<Champ.Input render={SelectSimple} optionsAriaLabel={'options'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</Champ.Input>
			</Champ>);

			expect(screen.getByRole('combobox', { name: 'label' })).toBeVisible();
		});
	});

	describe('gestion erreur', () => {
		it('lorsque le select est requis, marque le champ comme requis', () => {
			render(<SelectSimple optionsAriaLabel={'options'} required>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>,
			);

			expect(screen.getByRole('combobox')).toBeRequired();
		});

		it('lorsque le select est requis mais pas touché, n‘appelle pas onInvalid', () => {
			const onInvalid = vi.fn();
			render(<SelectSimple optionsAriaLabel={'options'} required onInvalid={onInvalid}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>,
			);

			expect(onInvalid).not.toHaveBeenCalled();
		});

		it('lorsque le select est requis et que l‘utilisateur n‘a pas sélectionné d‘option, il ne peux pas soumettre le formulaire', async () => {
			const onSubmit = vi.fn();
			const user = userEvent.setup();
			render(<form onSubmit={onSubmit} aria-label={'form'}>
				<SelectSimple optionsAriaLabel={'options'} required>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>
				<button>Submit</button>
			</form>);

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('lorsque le select est requis et que l‘utilisateur sélectionne une valeur vide et quitte le champ, appelle onInvalid', async () => {
			const user = userEvent.setup();
			const onInvalid = vi.fn();
			render(<SelectSimple optionsAriaLabel={'options'} required defaultValue='1' onInvalid={onInvalid}>
				<SelectSimple.Option value="">aucune option</SelectSimple.Option>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>,
			);

			await user.click(screen.getByRole('combobox'));
			await user.click(screen.getByRole('option', { name: 'aucune option' }));
			await user.tab();
			expect(onInvalid).toHaveBeenCalledTimes(1);
		});

		it('lorsque le select est requis et en erreur, lorsque l‘utilisateur sélectionne une option le select n‘est plus en erreur', async () => {
			const onInvalid = vi.fn();
			const user = userEvent.setup();
			render(<>
				<SelectSimple
					optionsAriaLabel={'options'}
					required
					onInvalid={onInvalid}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>
			</>);
			await user.tab();
			await user.keyboard(KeyBoard.ENTER);
			await user.keyboard(KeyBoard.ESCAPE);
			onInvalid.mockReset();

			await user.keyboard(KeyBoard.ENTER);
			await user.keyboard(KeyBoard.ARROW_DOWN);
			await user.keyboard(KeyBoard.ENTER);

			expect(onInvalid).toHaveBeenCalledTimes(0);
			expect(screen.getByRole('textbox', { hidden: true })).toBeValid();
		});
	});

	describe('interaction support', () => {
		describe('quand la liste d‘options est fermée', () => {
			it('les options sont masquées', () => {
				render(<SelectSimple optionsAriaLabel={'options'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>);

				expect(screen.queryByRole('option')).not.toBeInTheDocument();
				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
			});

			describe('lorsque l‘utilisateur fait "fleche du bas"', () => {
				it('la liste d‘options s‘ouvre sans changer le focus', async () => {
					const user = userEvent.setup();

					render(<SelectSimple optionsAriaLabel={'options label'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ARROW_DOWN);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					expect(screen.getAllByRole('option')).toHaveLength(2);
					expect(screen.getByRole('combobox')).toHaveFocus();
				});

				it('la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.click(screen.getByRole('combobox'));
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			describe('lorsque l‘utilisateur fait "fleche du haut"', () => {
				it('la liste d‘options s‘ouvre sans changer le focus', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options label'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ARROW_UP);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					expect(screen.getAllByRole('option')).toHaveLength(2);
					expect(screen.getByRole('combobox')).toHaveFocus();
				});

				it('la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.click(screen.getByRole('combobox'));
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.ARROW_UP);

					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			describe('lorsque l‘utilisateur fait "Entrer"', () => {
				it('ouvre la liste d‘options', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options label'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				});

				it('ne change pas le focus et la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					const combobox = screen.getByRole('combobox');
					await user.click(combobox);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.ENTER);

					expect(combobox).toHaveFocus();
					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(combobox).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			describe('lorsque l‘utilisateur fait "Espace"', () => {
				it('la liste d‘options s‘ouvre', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options label'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.SPACE);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					expect(screen.getAllByRole('option')).toHaveLength(2);
				});

				it('ne change pas le focus et la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					const combobox = screen.getByRole('combobox');
					await user.click(combobox);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.SPACE);

					expect(combobox).toHaveFocus();
					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(combobox).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			it('lorsque l‘utilisateur fait "Home", la liste d‘options s‘ouvre et le focus visuel est placé sur la première option', async () => {
				const user = userEvent.setup();
				render(<SelectSimple optionsAriaLabel={'options label'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>);

				const combobox = screen.getByRole('combobox');
				await user.click(combobox);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
				expect(combobox).toHaveAttribute('aria-activedescendant', option2Id);

				await user.keyboard(KeyBoard.ESCAPE);

				await user.keyboard(KeyBoard.HOME);

				expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				const option1Id = screen.getByRole('option', { name: 'options 1' }).id;
				expect(combobox).toHaveAttribute('aria-activedescendant', option1Id);
			});

			it('lorsque l‘utilisateur fait "End", la liste d‘options s‘ouvre et le focus visuel est placé sur la dernière option', async () => {
				const user = userEvent.setup();
				render(<SelectSimple optionsAriaLabel={'options label'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					<SelectSimple.Option value="3">options 3</SelectSimple.Option>
				</SelectSimple>);

				const combobox = screen.getByRole('combobox');
				await user.click(combobox);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
				expect(combobox).toHaveAttribute('aria-activedescendant', option2Id);
				await user.keyboard(KeyBoard.ESCAPE);

				await user.keyboard(KeyBoard.END);
				expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				const option3Id = screen.getByRole('option', { name: 'options 3' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3Id);
			});

			describe('lorsque l‘utilisateur tape des caractères', () => {
				it('lorsque l‘utilisateur tape un seul caractère, la liste d‘options s‘ouvre, reste ouverte et déplace le focus visuel sur la première option qui match le caractère', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options label'}>
						<SelectSimple.Option value="1">ab</SelectSimple.Option>
						<SelectSimple.Option value="2">ha</SelectSimple.Option>
						<SelectSimple.Option value="3">bj</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard('h');

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					const option2Id = screen.getByRole('option', { name: 'ha' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);

					await act(() => delay(DEFAULT_DEBOUNCE_TIMEOUT));
					await user.keyboard('a');

					const option1Id = screen.getByRole('option', { name: 'ab' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				});

				it('lorsque l‘utilisateur tape plusieurs caractères, la liste d‘options s‘ouvre et déplace le focus visuel sur la première option qui match les caractères', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options label'}>
						<SelectSimple.Option value="1">abc</SelectSimple.Option>
						<SelectSimple.Option value="2">abd</SelectSimple.Option>
						<SelectSimple.Option value="3">ac</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard('abd');

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					const option2Id = screen.getByRole('option', { name: 'abd' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);

					await act(() => delay(DEFAULT_DEBOUNCE_TIMEOUT));
					await user.keyboard('abc');

					const option1Id = screen.getByRole('option', { name: 'abc' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				});
			});
		});

		it('l‘utilisateur séléctionne une option avec la souris, séléctionne l‘option et ferme la liste d‘option', async () => {
			const user = userEvent.setup();
			render(<form aria-label={'form'}>
				<SelectSimple optionsAriaLabel={'options'} name={'name'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>
			</form>);
			const combobox = screen.getByRole('combobox');
			await user.click(combobox);
			await user.click(screen.getByRole('option', { name: 'options 2' }));

			expect(screen.getByRole('option', {
				hidden: true,
				name: 'options 2',
			})).toHaveAttribute('aria-selected', 'true');
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
			expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ name: '2' });
		});

		describe('quand la liste d‘options est ouverte', () => {
			it('lorsque l‘utilisateur fait "Entrer", l‘option qui a le focus visuel est séléctionnée la liste d‘option se ferme et le placeholder se met à jour', async () => {
				const user = userEvent.setup();
				render(<form aria-label="form">
					<SelectSimple optionsAriaLabel={'options'} name={'select'}>
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ENTER);

				expect(screen.getByRole('option', {
					hidden: true,
					name: 'options 2',
				})).toHaveAttribute('aria-selected', 'true');
				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
				expect(screen.getByRole('combobox')).toHaveTextContent('options 2');
				expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '2' });
			});

			it('lorsque l‘utilisateur fait "Espace", l‘option qui a le focus visuel est séléctionné, la liste d‘option se ferme et le placeholder se met à jour', async () => {
				const user = userEvent.setup();
				render(<form aria-label="form">
					<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.SPACE);

				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
				expect(screen.getByRole('option', {
					hidden: true,
					name: 'options 2',
				})).toHaveAttribute('aria-selected', 'true');
				expect(screen.getByRole('combobox')).toHaveTextContent('options 2');
				expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '2' });
			});

			it('lorsque l‘utilisateur fait "alt + fleche du haut", l‘option qui a le focus visuel est séléctionné et la liste d‘option se ferme', async () => {
				const user = userEvent.setup();
				render(<form aria-label="form">
					<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ALT_AND_ARROW_UP);

				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
				expect(screen.getByRole('option', {
					hidden: true,
					name: 'options 2',
				})).toHaveAttribute('aria-selected', 'true');
				expect(screen.getByRole('combobox')).toHaveTextContent('options 2');
				expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '2' });
			});

			it('lorsque l‘utilisateur fait "Tab", l‘option qui a le focus visuel est séléctionné, la liste d‘option se ferme, le placeholder se met à jour et le focus se déplace sur le prochain élément focusable', async () => {
				const user = userEvent.setup();
				render(<form aria-label="form">
					<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>
					<input aria-label="input label"></input>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.tab();

				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
				expect(screen.getByRole('combobox')).toHaveTextContent('options 2');
				expect(screen.getByRole('option', {
					hidden: true,
					name: 'options 2',
				})).toHaveAttribute('aria-selected', 'true');
				expect(screen.getByRole('textbox', { name: 'input label' })).toHaveFocus();
				expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '2' });
			});

			it('lorsque l‘utilisateur fait "echap", ferme la liste d‘option sans séléctionner l‘option qui a le focus visuel', async () => {
				const user = userEvent.setup();
				render(<form aria-label="form">
					<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ESCAPE);

				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
				expect(screen.getByRole('combobox')).toHaveTextContent('Sélectionnez votre choix');
				expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '' });
			});

			describe('lorsque l‘utilisateur fait "fleche du bas"', () => {
				it('déplace le focus visuel sur la prochaine option sans la séléctionner', async () => {
					const user = userEvent.setup();
					render(<form aria-label="form">
						<SelectSimple optionsAriaLabel={'options'} name="select">
							<SelectSimple.Option value="1">options 1</SelectSimple.Option>
							<SelectSimple.Option value="2">options 2</SelectSimple.Option>
						</SelectSimple>
					</form>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					const option2 = screen.getByRole('option', { name: 'options 2' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2.id);
					expect(option2).toHaveAttribute('aria-selected', 'false');
					expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '' });
				});

				it('lorsque le focus visuel est déjà sur la dernière option, ne déplace pas le focus visuel', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);
					const combobox = screen.getByRole('combobox');

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(combobox).toHaveAttribute('aria-activedescendant', option2Id);

					await user.keyboard(KeyBoard.ARROW_DOWN);
					expect(combobox).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			describe('lorsque l‘utilisateur fait "fleche du haut"', () => {
				it('déplace le focus visuel sur la précédente option sans la séléctionner', async () => {
					const user = userEvent.setup();
					render(<form aria-label="form">
						<SelectSimple optionsAriaLabel={'options'} name="select">
							<SelectSimple.Option value="1">options 1</SelectSimple.Option>
							<SelectSimple.Option value="2">options 2</SelectSimple.Option>
						</SelectSimple>
					</form>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					await user.keyboard(KeyBoard.ARROW_UP);

					const option1 = screen.getByRole('option', { name: 'options 1' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1.id);
					expect(option1).toHaveAttribute('aria-selected', 'false');
					expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '' });
				});

				it('lorsqu‘il est sur la première option, ne déplace pas le focus visuel', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					await user.keyboard(KeyBoard.ARROW_UP);
					const option1Id = screen.getByRole('option', { name: 'options 1' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
				});
			});

			it('lorsque l‘utilisateur fait "Home", déplace le focus visuel sur la première option sans la selectionner', async () => {
				const user = userEvent.setup();
				render(<SelectSimple optionsAriaLabel={'options'} name="select">
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);

				await user.keyboard(KeyBoard.HOME);
				const option1 = screen.getByRole('option', { name: 'options 1' });
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1.id);
				expect(option1).toHaveAttribute('aria-selected', 'false');
			});

			it('lorsque l‘utilisateur fait "End", déplace le focus visuel sur la dernière option sans la selectionner', async () => {
				const user = userEvent.setup();

				render(<SelectSimple optionsAriaLabel={'options'} name="select">
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					<SelectSimple.Option value="3">options 3</SelectSimple.Option>
				</SelectSimple>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);

				await user.keyboard(KeyBoard.END);
				const option3 = screen.getByRole('option', { name: 'options 3' });
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3.id);
				expect(option3).toHaveAttribute('aria-selected', 'false');

			});

			describe('lorsque l‘utilisateur fait "PageUp"', () => {
				it('s‘il y a plus de 10 options précédentes, déplace le focus visuel de 10 options plus haut', async () => {
					const user = userEvent.setup();
					const NUMBRE_OF_OPTIONS = 12;
					const optionsArray = new Array(NUMBRE_OF_OPTIONS).fill('');

					render(<SelectSimple optionsAriaLabel={'options'} name="select">
						{ optionsArray.map((_, index) => (
							<SelectSimple.Option key={index} value={index + 1}>options {index + 1}</SelectSimple.Option>
						))
						}
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.END);
					const option12 = screen.getByRole('option', { name: 'options 12' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option12.id);

					await user.keyboard(KeyBoard.PAGE_UP);
					const option2 = screen.getByRole('option', { name: 'options 2' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2.id);
					expect(option2).toHaveAttribute('aria-selected', 'false');
				});

				it('s‘il y a moins de 10 options précédentes, déplace le focus visuel sur la première option', async () => {
					const user = userEvent.setup();
					render(<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
						<SelectSimple.Option value="3">options 3</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					await user.keyboard(KeyBoard.PAGE_UP);
					const option1 = screen.getByRole('option', { name: 'options 1' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1.id);
					expect(option1).toHaveAttribute('aria-selected', 'false');
				});
			});

			describe('lorsque l‘utilisateur fait "PageDown"', () => {
				it('s‘il y a plus de 10 options suivantes, déplace le focus visuel de 10 options plus bas', async () => {
					const user = userEvent.setup();

					render(<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
						<SelectSimple.Option value="3">options 3</SelectSimple.Option>
						<SelectSimple.Option value="4">options 4</SelectSimple.Option>
						<SelectSimple.Option value="5">options 5</SelectSimple.Option>
						<SelectSimple.Option value="6">options 6</SelectSimple.Option>
						<SelectSimple.Option value="7">options 7</SelectSimple.Option>
						<SelectSimple.Option value="8">options 8</SelectSimple.Option>
						<SelectSimple.Option value="9">options 9</SelectSimple.Option>
						<SelectSimple.Option value="10">options 10</SelectSimple.Option>
						<SelectSimple.Option value="11">options 11</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					await user.keyboard(KeyBoard.PAGE_DOWN);
					const option11 = screen.getByRole('option', { name: 'options 11' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option11.id);
					expect(option11).toHaveAttribute('aria-selected', 'false');
				});

				it('s‘il y a moins de 10 options suivantes, déplace le focus visuel sur la dernière option', async () => {
					const user = userEvent.setup();

					render(<SelectSimple optionsAriaLabel={'options'} name="select">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
						<SelectSimple.Option value="3">options 3</SelectSimple.Option>
						<SelectSimple.Option value="4">options 4</SelectSimple.Option>
					</SelectSimple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					await user.keyboard(KeyBoard.PAGE_DOWN);
					const option4 = screen.getByRole('option', { name: 'options 4' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option4.id);
					expect(option4).toHaveAttribute('aria-selected', 'false');
				});
			});

			it('lorsque l‘option active change, scroll jusqu’à la nouvelle option active', async () => {
				const user = userEvent.setup();

				render(<SelectSimple optionsAriaLabel={'options'} name="select">
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					<SelectSimple.Option value="3">options 3</SelectSimple.Option>
				</SelectSimple>);

				const option = screen.getByRole('option', { hidden: true, name: 'options 2' });
				option.scrollIntoView = vi.fn();

				const input = screen.getByRole('combobox');
				await user.click(input);
				await user.keyboard(KeyBoard.ARROW_DOWN);

				expect(option.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'nearest' }));
			});
		});
		
		it('ne donne pas le focus à la liste quand elle est ouverte et scrollable', () => {
			// NOTE (GAFI 23-08-2024): Un élément scrollable est automatiquement ajouté au taborder
			render(
				<SelectSimple optionsAriaLabel={'options'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>,
			);

			const list = screen.getByRole('listbox', { hidden: true });
			// NOTE (GAFI 23-08-2024): Pas mal lié à l'implémentation, mais on ne peut pas tester le comportement réel puisque
			//	testing-library ne permet pas d'importer le CSS ou d'émuler le rendu
			expect(list).toHaveAttribute('tabindex', '-1');
		});
	});

	describe('label de l‘option sélectionné (placeholder)', () => {
		it('affiche le placeholder lorsqu‘un placeholder est donné en props', () => {

			render(<SelectSimple optionsAriaLabel={'options'} placeholder={'placeholder'}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			expect(screen.getByRole('combobox')).toHaveTextContent('placeholder');
		});

		it('lorsqu‘aucune option est séléctionnée, je vois le placeholder par défaut', () => {

			render(<SelectSimple optionsAriaLabel={'options'}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			expect(screen.getByRole('combobox')).toHaveTextContent(SELECT_SIMPLE_LABEL_DEFAULT_OPTION);
		});

		it('lorsqu‘une option est séléctionnée, je vois le libellé de l‘option dans le placeholder', async () => {
			const user = userEvent.setup();

			render(<SelectSimple optionsAriaLabel={'options'}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			await user.click(screen.getByRole('combobox'));
			await user.click(screen.getByRole('option', { name: 'options 1' }));

			expect(screen.getByRole('combobox')).toHaveTextContent('options 1');
		});
	});

	describe('props', () => {
		it('appelle onChange quand une valeur est selectionné', async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			render(<SelectSimple optionsAriaLabel={'options'} onChange={onChange}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			await user.tab();
			await user.keyboard(KeyBoard.ENTER);
			const option = screen.getByRole('option', { name: 'options 2' });
			await user.click(option);

			expect(onChange).toHaveBeenCalledWith(option);
		});

		it('lorsque la value change, le select prend la valeur de value mise à jour', async () => {
			const component = (value: string) => (
				<form role="form" aria-label={'test'}>
					<SelectSimple optionsAriaLabel={'options'} value={value} name="name">
						<SelectSimple.Option value="1">options 1</SelectSimple.Option>
						<SelectSimple.Option value="2">options 2</SelectSimple.Option>
					</SelectSimple>
				</form>
			);

			const { rerender } = render(component('1'));


			rerender(component('2'));

			expect(screen.getByRole('combobox')).toHaveTextContent('options 2');
			expect(screen.getByRole('form', { name: 'test' })).toHaveFormValues({ name: '2' });
		});

		it('accepte une defaultValue et initialise le select avec cette value', () => {
			render(<SelectSimple optionsAriaLabel={'options'} defaultValue={'1'}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			expect(screen.getByRole('combobox')).toHaveTextContent('options 1');
		});

		it('accepte une liste d‘options', async () => {
			const user = userEvent.setup();
			render(<SelectSimple optionsAriaLabel={'options'}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			await user.tab();
			await user.keyboard(KeyBoard.ENTER);

			const options = screen.getAllByRole('option');
			expect(options).toHaveLength(2);
			expect(options[0]).toHaveTextContent('options 1');
			expect(options[1]).toHaveTextContent('options 2');
		});

		it('lorsque l‘on donne un name, on peut récupérer la valeur séléctionnée depuis ce nom', async () => {
			const user = userEvent.setup();

			render(<form role="form">
				<SelectSimple optionsAriaLabel={'options'} name={'nomSelect'}>
					<SelectSimple.Option value="1">options 1</SelectSimple.Option>
					<SelectSimple.Option value="2">options 2</SelectSimple.Option>
				</SelectSimple>
			</form>);

			await user.tab();
			await user.keyboard(KeyBoard.ENTER);
			await user.keyboard(KeyBoard.ARROW_DOWN);
			await user.keyboard(KeyBoard.SPACE);

			expect(screen.getByRole('form')).toHaveFormValues({ nomSelect: '2' });
		});
	});

	describe('touched', () => {
		it('lorsque l‘utilisateur n‘a pas interagit avec le champ, le select n‘est pas touched', () => {
			const onTouch = vi.fn();

			render(<SelectSimple optionsAriaLabel={'options'} onTouch={onTouch}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			const combobox = screen.getByRole('combobox');
			expect(onTouch).not.toHaveBeenCalled();
			expect(combobox).toHaveAttribute('data-touched', 'false');
		});

		it('lorsque l‘utilisateur ouvre puis ferme le select et quitte le champ, le select n’est pas touched', async () => {
			const user = userEvent.setup();
			const onTouch = vi.fn();

			render(<SelectSimple optionsAriaLabel={'options'} onTouch={onTouch}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			const combobox = screen.getByRole('combobox');
			await user.click(combobox);
			await user.keyboard(KeyBoard.ESCAPE);
			await user.tab();

			expect(onTouch).not.toHaveBeenCalled();
			expect(combobox).toHaveAttribute('data-touched', 'false');
		});

		it('lorsque l‘utilisateur ouvre puis sélectionne une option et quitte le champ, le select est touched', async () => {
			const user = userEvent.setup();
			const onTouch = vi.fn();

			render(<SelectSimple optionsAriaLabel={'options'} onTouch={onTouch}>
				<SelectSimple.Option value="1">options 1</SelectSimple.Option>
				<SelectSimple.Option value="2">options 2</SelectSimple.Option>
			</SelectSimple>);

			const combobox = screen.getByRole('combobox');
			await user.click(combobox);
			await user.click(screen.getByRole('option', { name: 'options 1' }));
			await user.tab();

			expect(onTouch).toHaveBeenCalledWith(true);
			expect(combobox).toHaveAttribute('data-touched', 'true');
		});
	});
});

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
