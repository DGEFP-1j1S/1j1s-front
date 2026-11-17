import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React, { FormEvent } from 'react';

import { KeyBoard } from '~/client/components/keyboard.fixture';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { mockScrollIntoView } from '~/client/components/window.mock';

const SELECT_MULTIPLE_LABEL_DEFAULT_OPTION = 'Sélectionnez vos choix';
const DEFAULT_DEBOUNCE_TIMEOUT = 300;

describe('<SelectMultiple/>', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});

	describe('peut s‘associer avec Champ', () => {
		it('accepte un label et le lie au select', () => {
			render(<Champ>
				<Champ.Label>label</Champ.Label>
				<Champ.Input render={SelectMultiple} optionsAriaLabel={'options'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</Champ.Input>
			</Champ>);

			expect(screen.getByRole('combobox', { name: 'label' })).toBeVisible();
		});
	});

	describe('gestion erreur', () => {
		it('lorsque le select est requis, marque le champ comme requis', () => {
			render(<SelectMultiple optionsAriaLabel={'options'} required>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>,
			);

			expect(screen.getByRole('combobox')).toBeRequired();
		});
		it('lorsque le select est requis mais pas touché, n‘appelle pas onInvalid', () => {
			const onInvalid = vi.fn();
			render(<SelectMultiple optionsAriaLabel={'options'} required onInvalid={onInvalid}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>,
			);

			expect(onInvalid).not.toHaveBeenCalled();
		});

		it('lorsque le select est requis et que l‘utilisateur n‘a pas sélectionné d‘option, il ne peux pas soumettre le formulaire', async () => {
			const onSubmit = vi.fn();
			const user = userEvent.setup();

			render(<form onSubmit={onSubmit} aria-label={'form'}>
				<SelectMultiple optionsAriaLabel={'options'} required>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>
				<button>Submit</button>
			</form>);

			await user.click(screen.getByRole('button', { name: 'Submit' }));
			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('lorsque le select est requis et que l‘utilisateur désélectionne toutes les options, appelle onInvalid', async () => {
			const user = userEvent.setup();
			const onInvalid = vi.fn();
			render(<SelectMultiple optionsAriaLabel={'options'} defaultValue={['1']} required onInvalid={onInvalid}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>,
			);

			const select = screen.getByRole('combobox');
			await user.click(select);
			const option = screen.getByRole('option', { selected: true });
			await user.click(option);
			await user.tab();

			expect(onInvalid).toHaveBeenCalledTimes(1);
		});

		it('lorsque le select est requis et en erreur, lorsque l‘utilisateur sélectionne une option le select n‘est plus en erreur', async () => {
			const onInvalid = vi.fn();
			const user = userEvent.setup();
			render(<>
				<SelectMultiple
					optionsAriaLabel={'options'}
					required
					onInvalid={onInvalid}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>
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
				render(<SelectMultiple optionsAriaLabel={'options'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>);
				expect(screen.queryByRole('option')).not.toBeInTheDocument();
			});

			describe('lorsque l‘utilisateur fait "fleche du bas"', () => {
				it('la liste d‘options s‘ouvre sans changer le focus ou changer de séléction', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ARROW_DOWN);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					expect(screen.getAllByRole('option')).toHaveLength(2);
					expect(screen.getByRole('combobox')).toHaveFocus();
				});

				it('la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.click(screen.getByRole('combobox'));
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;

					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			describe('lorsque l‘utilisateur fait "fleche du haut"', () => {
				it('la liste d‘options s‘ouvre sans changer le focus ou changer de séléction', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ARROW_UP);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					expect(screen.getAllByRole('option')).toHaveLength(2);
					expect(screen.getByRole('combobox')).toHaveFocus();
				});

				it('la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

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

					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				});

				it('ne change pas le focus et la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.click(screen.getByRole('combobox'));
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.ENTER);

					expect(screen.getByRole('combobox')).toHaveFocus();
					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			describe('lorsque l‘utilisateur fait "Espace"', () => {
				it('la liste d‘options s‘ouvre', async () => {
					const user = userEvent.setup();
					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.SPACE);

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					expect(screen.getAllByRole('option')).toHaveLength(2);
				});

				it('ne change pas le focus et la précédente option qui avait le focus visuel est conservée', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.click(screen.getByRole('combobox'));
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ESCAPE);
					await user.keyboard(KeyBoard.SPACE);

					expect(screen.getByRole('combobox')).toHaveFocus();
					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});
			});

			it('lorsque l‘utilisateur fait "Home", la liste d‘options s‘ouvre et le focus visuel est placé sur la première option', async () => {
				const user = userEvent.setup();

				render(<SelectMultiple optionsAriaLabel={'options'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>);

				await user.click(screen.getByRole('combobox'));
				await user.keyboard(KeyBoard.ARROW_DOWN);
				const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);

				await user.keyboard(KeyBoard.ESCAPE);

				await user.keyboard(KeyBoard.HOME);
				expect(screen.getByRole('combobox')).toHaveFocus();
				const option1Id = screen.getByRole('option', { name: 'options 1' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
			});

			it('lorsque l‘utilisateur fait "End", la liste d‘options s‘ouvre et le focus visuel est placé sur la dernière option', async () => {
				const user = userEvent.setup();

				render(<SelectMultiple optionsAriaLabel={'options'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
				</SelectMultiple>);

				await user.click(screen.getByRole('combobox'));
				await user.keyboard(KeyBoard.ARROW_DOWN);
				const option2Id = screen.getByRole('option', { name: 'options 2' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);

				await user.keyboard(KeyBoard.ESCAPE);

				await user.keyboard(KeyBoard.END);
				expect(screen.getByRole('combobox')).toHaveFocus();
				const option3Id = screen.getByRole('option', { name: 'options 3' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3Id);
			});

			describe('lorsque l‘utilisateur tape des caractères', () => {
				it('lorsque l‘utilisateur tape un seul caractère, la liste d‘options s‘ouvre et déplace le focus visuel sur la première option qui match le caractère', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">ab</SelectMultiple.Option>
						<SelectMultiple.Option value="2">ha</SelectMultiple.Option>
						<SelectMultiple.Option value="3">bj</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard('h');

					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
					const option2Id = screen.getByRole('option', { name: 'ha' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});

				it('lorsque l‘utilisateur tape un caractère attend et retape un caractère, la liste d‘options s‘ouvre et déplace le focus visuel sur la première option qui match le deuxième caractère', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">ab</SelectMultiple.Option>
						<SelectMultiple.Option value="2">ha</SelectMultiple.Option>
						<SelectMultiple.Option value="3">bj</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard('h');

					await act(() => delay(DEFAULT_DEBOUNCE_TIMEOUT));
					await user.keyboard('a');

					const option1Id = screen.getByRole('option', { name: 'ab' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
					expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();
				});

				it('lorsque l‘utilisateur tape plusieurs caractères, la liste d‘options s‘ouvre et déplace le focus visuel sur la première option qui match les caractères', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options label'}>
						<SelectMultiple.Option value="1">abc</SelectMultiple.Option>
						<SelectMultiple.Option value="2">abd</SelectMultiple.Option>
						<SelectMultiple.Option value="3">ac</SelectMultiple.Option>
					</SelectMultiple>);

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

		it('l‘utilisateur sélectionne une option avec la souris, l‘option est ajoutée aux options sélectionnées', async () => {
			const user = userEvent.setup();
			let selectValues;

			render(<form aria-label="form"
				onSubmit={(formEvent) => {
					selectValues = getAllFormData(formEvent, 'name');
				}}>
				<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>
				<button>Submit</button>
			</form>);

			await user.click(screen.getByRole('combobox'));

			await user.click(screen.getByRole('option', { name: 'options 1' }));

			await user.click(screen.getByRole('option', { name: 'options 2' }));
			await user.click(screen.getByRole('button', { name: 'Submit' }));
			expect(selectValues).toEqual(['1', '2']);
		});

		it('l‘utilisateur sélectionne une option avec la souris, l‘option prend l‘attribut aria-selected et la liste d‘option ne se ferme pas', async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();

			render(<form aria-label="form">
				<SelectMultiple optionsAriaLabel={'options label'} onChange={onChange} name={'name'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>
			</form>);

			await user.click(screen.getByRole('combobox'));

			const option1 = screen.getByRole('option', { name: 'options 1' });
			await user.click(option1);
			expect(screen.getByRole('listbox', { name: 'options label' })).toBeVisible();

			const option2 = screen.getByRole('option', { name: 'options 2' });
			await user.click(option2);

			expect(option1).toHaveAttribute('aria-selected', 'true');
			expect(option2).toHaveAttribute('aria-selected', 'true');
		});

		describe('quand la liste d‘options est ouverte', () => {
			it('lorsque l‘utilisateur fait "Entrer", l‘option qui a le focus visuel est ajoutée aux options séléctionnés et la liste d‘option se ferme', async () => {
				const user = userEvent.setup();
				let selectValues;

				render(<form aria-label="form"
					onSubmit={(formEvent) => {
						selectValues = getAllFormData(formEvent, 'name');
					}}>
					<SelectMultiple optionsAriaLabel={'options'} name={'name'} defaultValue={['1']}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>
					<button>Submit</button>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ENTER);

				await user.click(screen.getByRole('button', { name: 'Submit' }));
				expect(selectValues).toEqual(['1', '2']);
				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
			});

			it('lorsque l‘utilisateur fait "Espace", l‘option qui a le focus visuel est ajoutée aux options séléctionnés et la liste d‘option ne se ferme pas', async () => {
				const user = userEvent.setup();
				let selectValues;
				render(<form aria-label="form"
					onSubmit={(formEvent) => {
						selectValues = getAllFormData(formEvent, 'name');
					}}>
					<SelectMultiple optionsAriaLabel={'options'}
						name={'name'}
						defaultValue={['1']}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>
					<button>Submit</button>
				</form>);

				await user.click(screen.getByRole('combobox'));

				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.SPACE);

				await user.click(screen.getByRole('button', { name: 'Submit' }));
				expect(selectValues).toEqual(['1', '2']);
			});

			it('lorsque l‘utilisateur fait "alt + fleche du haut", l‘option qui a le focus visuel est séléctionné et la liste d‘option se ferme', async () => {
				const user = userEvent.setup();
				render(<form aria-label="form">
					<SelectMultiple optionsAriaLabel={'options'} name="select">
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>
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
				expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ select: '2' });
			});

			describe('lorsque l‘utilisateur fait "Tab"', () => {
				it('sur une option pas encore séléctionnée, l‘option qui a le focus visuel n‘est pas séléctionnée, la liste d‘option se ferme et le focus se déplace sur le prochain élément focusable', async () => {
					const user = userEvent.setup();

					render(<form aria-label="form">
						<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
							<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
							<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
						</SelectMultiple>
						<input aria-label={'input label'} />
					</form>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.tab();

					expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ name: '' });
					expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
					expect(screen.getByRole('textbox', { name: 'input label' })).toHaveFocus();
				});

				it('sur une option pas déjà séléctionnée, l‘option qui a le focus visuel reste séléctionnée, la liste d‘option se ferme et le focus se déplace sur le prochain élément focusable', async () => {
					const user = userEvent.setup();

					render(<form aria-label="form">
						<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
							<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
							<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
						</SelectMultiple>
						<input aria-label={'input label'} />
					</form>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.SPACE);
					await user.tab();

					expect(screen.getByRole('form', { name: 'form' })).toHaveFormValues({ name: '2' });
					expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
					expect(screen.getByRole('textbox', { name: 'input label' })).toHaveFocus();
				});
			});

			it('lorsque l‘utilisateur fait "echap", ferme la liste d‘option sans séléctionner l‘option qui a le focus visuel', async () => {
				const user = userEvent.setup();
				let selectValues;
				render(<form aria-label="form"
					onSubmit={(formEvent) => {
						selectValues = getAllFormData(formEvent, 'name');
					}}>
					<SelectMultiple optionsAriaLabel={'options'}
						name={'name'}
						defaultValue={['1']}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>
					<button>Submit</button>
				</form>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ESCAPE);

				await user.click(screen.getByRole('button', { name: 'Submit' }));
				expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
				expect(selectValues).toEqual(['1']);
			});

			describe('lorsque l‘utilisateur fait "fleche du bas"', () => {
				it('déplace le focus visuel sur la prochaine option', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					const option2Id = screen.getByRole('option', { name: 'options 2' }).id;

					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option2Id);
				});

				it('lorsqu‘il est sur la dernière option, ne déplace pas le focus visuel', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
						<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					await user.keyboard(KeyBoard.ARROW_DOWN);
					const option3Id = screen.getByRole('option', { name: 'options 3' }).id;
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3Id);

					await user.keyboard(KeyBoard.ARROW_DOWN);
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3Id);
				});
			});

			describe('lorsque l‘utilisateur fait "fleche du haut"', () => {
				it('déplace le focus visuel sur la précédente option', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);
					await user.keyboard(KeyBoard.ARROW_DOWN);

					await user.keyboard(KeyBoard.ARROW_UP);

					const option1Id = screen.getByRole('option', { name: 'options 1' }).id;

					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
				});

				it('lorsqu‘il est sur la première option, ne déplace pas le focus visuel', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					await user.keyboard(KeyBoard.ARROW_UP);

					const option1Id = screen.getByRole('option', { name: 'options 1' }).id;

					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
				});
			});

			it('lorsque l‘utilisateur fait "Home", déplace le focus visuel sur la première option', async () => {
				const user = userEvent.setup();

				render(<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
				</SelectMultiple>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				await user.keyboard(KeyBoard.ARROW_DOWN);
				const option3Id = screen.getByRole('option', { name: 'options 3' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3Id);

				await user.keyboard(KeyBoard.HOME);
				const option1Id = screen.getByRole('option', { name: 'options 1' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option1Id);
			});

			it('lorsque l‘utilisateur fait "End", déplace le focus visuel sur la dernière option', async () => {
				const user = userEvent.setup();

				render(<SelectMultiple optionsAriaLabel={'options'} name={'name'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
				</SelectMultiple>);

				await user.tab();
				await user.keyboard(KeyBoard.ENTER);

				await user.keyboard(KeyBoard.END);
				const option3Id = screen.getByRole('option', { name: 'options 3' }).id;
				expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option3Id);
			});

			describe('lorsque l‘utilisateur fait "PageUp"', () => {
				it('s‘il y a plus de 10 options précédentes, déplace le focus visuel de 10 options plus haut', async () => {
					const user = userEvent.setup();
					const NUMBRE_OF_OPTIONS = 12;
					const optionsArray = new Array(NUMBRE_OF_OPTIONS).fill('');
					render(<SelectMultiple optionsAriaLabel={'options'} name="select">
						{optionsArray.map((_, index) => (
							<SelectMultiple.Option key={index} value={index + 1}>options {index + 1}</SelectMultiple.Option>
						))
						}
					</SelectMultiple>);

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

					render(<SelectMultiple optionsAriaLabel={'options'} name="select">
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
						<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
					</SelectMultiple>);

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

					render(<SelectMultiple optionsAriaLabel={'options'} name="select">
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
						<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
						<SelectMultiple.Option value="4">options 4</SelectMultiple.Option>
						<SelectMultiple.Option value="5">options 5</SelectMultiple.Option>
						<SelectMultiple.Option value="6">options 6</SelectMultiple.Option>
						<SelectMultiple.Option value="7">options 7</SelectMultiple.Option>
						<SelectMultiple.Option value="8">options 8</SelectMultiple.Option>
						<SelectMultiple.Option value="9">options 9</SelectMultiple.Option>
						<SelectMultiple.Option value="10">options 10</SelectMultiple.Option>
						<SelectMultiple.Option value="11">options 11</SelectMultiple.Option>
					</SelectMultiple>);

					await user.tab();
					await user.keyboard(KeyBoard.ENTER);

					await user.keyboard(KeyBoard.PAGE_DOWN);
					const option11 = screen.getByRole('option', { name: 'options 11' });
					expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', option11.id);
					expect(option11).toHaveAttribute('aria-selected', 'false');
				});

				it('s‘il y a moins de 10 options suivantes, déplace le focus visuel sur la dernière option', async () => {
					const user = userEvent.setup();

					render(<SelectMultiple optionsAriaLabel={'options'} name="select">
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
						<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
						<SelectMultiple.Option value="4">options 4</SelectMultiple.Option>
					</SelectMultiple>);

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

				render(<SelectMultiple optionsAriaLabel={'options'} name="select">
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					<SelectMultiple.Option value="3">options 3</SelectMultiple.Option>
				</SelectMultiple>);

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
				<SelectMultiple optionsAriaLabel={'options'}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>,
			);

			const list = screen.getByRole('listbox', { hidden: true });
			// NOTE (GAFI 23-08-2024): Pas mal lié à l'implémentation, mais on ne peut pas tester le comportement réel puisque
			//	testing-library ne permet pas d'importer le CSS ou d'émuler le rendu
			expect(list).toHaveAttribute('tabindex', '-1');
		});
	});

	describe('label options sélectionnées (placeholder)', () => {
		it('lorsqu‘aucune option est sélectionnée, je vois le placeholder par défaut', () => {

			render(<SelectMultiple optionsAriaLabel={'options'}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>);

			expect(screen.getByRole('combobox')).toHaveTextContent(SELECT_MULTIPLE_LABEL_DEFAULT_OPTION);
		});

		it('lorsqu‘une seule option est sélectionnée, son libellé est dans le bouton', async () => {
			const user = userEvent.setup();

			render(<SelectMultiple optionsAriaLabel={'options'}>
				<SelectMultiple.Option value="cdi">CDI</SelectMultiple.Option>
				<SelectMultiple.Option value="saisonnier">Saisonnier</SelectMultiple.Option>
			</SelectMultiple>);

			await user.click(screen.getByRole('combobox'));
			await user.click(screen.getByRole('option', { name: 'Saisonnier' }));

			expect(screen.getByRole('combobox')).toHaveTextContent(/^Saisonnier$/);
		});

		it('lorsqu‘au moins deux options sont sélectionnées, leurs libellés sont concaténés', async () => {
			const user = userEvent.setup();

			render(<SelectMultiple optionsAriaLabel={'options'}>
				<SelectMultiple.Option value="cdi">CDI</SelectMultiple.Option>
				<SelectMultiple.Option value="cdd">CDD</SelectMultiple.Option>
				<SelectMultiple.Option value="saisonnier">Saisonnier</SelectMultiple.Option>
			</SelectMultiple>);

			await user.click(screen.getByRole('combobox'));
			await user.click(screen.getByRole('option', { name: 'Saisonnier' }));
			await user.click(screen.getByRole('option', { name: 'CDI' }));

			expect(screen.getByRole('combobox')).toHaveTextContent(/^CDI, Saisonnier$/);
		});

		it('affiche les libellés des options sélectionnées par défaut', () => {
			render(<SelectMultiple optionsAriaLabel={'options'} defaultValue={['cdi', 'saisonnier']}>
				<SelectMultiple.Option value="cdi">CDI</SelectMultiple.Option>
				<SelectMultiple.Option value="saisonnier">Saisonnier</SelectMultiple.Option>
			</SelectMultiple>);

			expect(screen.getByRole('combobox')).toHaveTextContent(/^CDI, Saisonnier$/);
		});
	});

	describe('props', () => {
		it('appelle onChange quand une option est sélectionnée', async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			render(<SelectMultiple optionsAriaLabel={'options'} onChange={onChange}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>);

			await user.tab();
			await user.keyboard(KeyBoard.ENTER);
			await user.keyboard(KeyBoard.ARROW_DOWN);
			await user.keyboard(KeyBoard.SPACE);

			expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
				tagName: 'LI',
				textContent: 'options 2',
			}));
		});

		it('lorsque la value change, le select prend la valeur de value mise à jour', async () => {
			const user = userEvent.setup();
			let selectValues;

			const component = (value: Array<string>) => (
				<form role="form"
					aria-label={'test'}
					onSubmit={(formEvent) => {
						selectValues = getAllFormData(formEvent, 'name');
					}}>
					<SelectMultiple optionsAriaLabel={'options'} value={value} name="name">
						<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
						<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
					</SelectMultiple>
					<button>Submit</button>
				</form>
			);

			const { rerender } = render(component(['1']));

			rerender(component(['1', '2']));
			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(selectValues).toEqual(['1', '2']);
		});

		it('accepte une defaultValue et initialise le select avec cette value', async () => {
			const user = userEvent.setup();
			let selectValues;

			render(<form role="form"
				aria-label={'test'}
				onSubmit={(formEvent) => {
					selectValues = getAllFormData(formEvent, 'name');
				}}>
				<SelectMultiple optionsAriaLabel={'options'} name="name" defaultValue={['1', '2']}>
					<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
					<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
				</SelectMultiple>
				<button>Submit</button>
			</form>);

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(selectValues).toEqual(['1', '2']);
		});

		it('accepte une liste d‘options', async () => {
			const user = userEvent.setup();
			render(<SelectMultiple optionsAriaLabel={'options'}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>);

			await user.tab();
			await user.keyboard(KeyBoard.ENTER);

			const options = screen.getAllByRole('option');
			expect(options).toHaveLength(2);
			expect(options[0]).toHaveTextContent('options 1');
			expect(options[1]).toHaveTextContent('options 2');
		});
	});

	describe('touched', () => {
		it('lorsque l‘utilisateur n‘a pas interagit avec le champ, le select n‘est pas touched', () => {
			const onTouch = vi.fn();

			render(<SelectMultiple optionsAriaLabel={'options'} onTouch={onTouch}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>);

			const combobox = screen.getByRole('combobox');
			expect(onTouch).not.toHaveBeenCalled();
			expect(combobox).toHaveAttribute('data-touched', 'false');
		});

		it('lorsque l‘utilisateur ouvre puis ferme le select et quitte le champ, le select n’est pas touched', async () => {
			const user = userEvent.setup();
			const onTouch = vi.fn();

			render(<SelectMultiple optionsAriaLabel={'options'} onTouch={onTouch}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>);

			const combobox = screen.getByRole('combobox');
			await user.click(combobox);
			await user.keyboard(KeyBoard.ESCAPE);

			expect(onTouch).not.toHaveBeenCalled();
			expect(combobox).toHaveAttribute('data-touched', 'false');
		})
		;

		it('lorsque l‘utilisateur ouvre puis sélectionne une option et quitte le champ, le select est touched', async () => {
			const user = userEvent.setup();
			const onTouch = vi.fn();

			render(<SelectMultiple optionsAriaLabel={'options'} onTouch={onTouch}>
				<SelectMultiple.Option value="1">options 1</SelectMultiple.Option>
				<SelectMultiple.Option value="2">options 2</SelectMultiple.Option>
			</SelectMultiple>);

			const combobox = screen.getByRole('combobox');
			await user.click(combobox);
			await user.click(screen.getByRole('option', { name: 'options 1' }));
			await user.tab();

			expect(onTouch).toHaveBeenCalledWith(true);
			expect(combobox).toHaveAttribute('data-touched', 'true');
		});
	});
});

function getAllFormData(event: FormEvent<HTMLFormElement>, name: string) {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);
	return formData.getAll(name);
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
