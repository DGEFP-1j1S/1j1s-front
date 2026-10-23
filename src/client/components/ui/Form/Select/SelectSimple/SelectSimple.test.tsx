import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React, { ComponentProps, useState } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { mockScrollIntoView } from '~/client/components/window.mock';

const SELECT_SIMPLE_LABEL_DEFAULT_OPTION = 'Sélectionnez votre choix';

function ControlledSelectSimple({ value: valueProps = '', onChange, ...rest }: Omit<ComponentProps<typeof SelectSimple>, 'value' | 'onChange'> & { value?: string, onChange?: (value: string) => void }) {
	const [value, setValue] = useState(valueProps);
	return (
		<SelectSimple
			{...rest}
			value={value}
			onChange={(newValue) => {
				setValue(newValue);
				onChange?.(newValue);
			}}
		/>
	);
}

describe('<SelectSimple/>', () => {
	beforeAll(() => {
		mockScrollIntoView();
	});

	const optionsList = [{
		libellé: "options 1",
		valeur: "1"
	}, {
		libellé: "options 2",
		valeur: "2"
	}]
	const onChange = () => {}

	describe('peut s‘associer avec Champ', () => {
		it('accepte un label et le lie au select', () => {
			render(<Champ>
				<Champ.Label>label</Champ.Label>
				<Champ.Input render={SelectSimple} optionsList={optionsList} onChange={onChange} />
			</Champ>);

			expect(screen.getByRole('combobox', { name: 'label' })).toBeVisible();
		});
	});

	describe('gestion erreur', () => {
		it('lorsque le select est requis, marque le champ comme requis', () => {
			render(<SelectSimple optionsList={optionsList} onChange={onChange} required/>);

			expect(screen.getByRole('combobox')).toBeRequired();
		});

		it('lorsque le select est requis mais pas touché, n‘appelle pas onInvalid', () => {
			const onInvalid = vi.fn();
			render(<SelectSimple optionsList={optionsList} onChange={onChange} required/>);

			expect(onInvalid).not.toHaveBeenCalled();
		});

		it('lorsque le select est requis et que l‘utilisateur n‘a pas sélectionné d‘option, il ne peux pas soumettre le formulaire', async () => {
			const onSubmit = vi.fn();
			const user = userEvent.setup();
			render(<form onSubmit={onSubmit} aria-label={'form'}>
				<SelectSimple optionsList={optionsList} onChange={onChange} required/>
				<button>Submit</button>
			</form>);

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(onSubmit).not.toHaveBeenCalled();
		});

		it('lorsque le select est requis et que l‘utilisateur sélectionne une option, le select n‘est plus en erreur', async () => {
			const user = userEvent.setup();
			render(<ControlledSelectSimple optionsList={optionsList} required/>);

			const combobox = screen.getByRole('combobox');
			await user.selectOptions(combobox, '1');

			expect(combobox).toBeValid();
		});

		it('lorsque le select est requis, après avoir sélectionné une option, il n‘est plus en erreur à la soumission', async () => {
			const onInvalid = vi.fn();
			const user = userEvent.setup();
			render(<form aria-label={'form'}>
				<ControlledSelectSimple optionsList={optionsList} required onInvalid={onInvalid}/>
				<button>Submit</button>
			</form>);

			const combobox = screen.getByRole('combobox');
			await user.selectOptions(combobox, '1');
			await user.click(screen.getByRole('button', { name: 'Submit' }));

			expect(onInvalid).not.toHaveBeenCalled();
			expect(combobox).toBeValid();
		});
	});

	describe('label de l‘option sélectionné (placeholder)', () => {
		it('affiche le placeholder lorsqu‘un placeholder est donné en props', () => {

			render(<SelectSimple optionsList={optionsList} onChange={onChange} placeholder={'placeholder'}/>);

			expect(screen.getByRole('combobox')).toHaveTextContent('placeholder');
		});

		it('lorsqu‘aucune option est sélectionnée, je vois le placeholder par défaut', () => {

			render(<SelectSimple optionsList={optionsList} onChange={onChange} />);

			expect(screen.getByRole('combobox')).toHaveTextContent(SELECT_SIMPLE_LABEL_DEFAULT_OPTION);
		});

		it('lorsqu‘une option est sélectionnée, je vois le libellé de l‘option dans le placeholder', async () => {
			const user = userEvent.setup();

			render(<ControlledSelectSimple optionsList={optionsList} />);

			const combobox = screen.getByRole('combobox');
			await user.selectOptions(combobox, '1');

			expect(combobox).toHaveValue('1');
			expect(screen.getByRole('option', { name: 'options 1' })).toBeInstanceOf(HTMLOptionElement);
			expect((screen.getByRole('option', { name: 'options 1' }) as HTMLOptionElement).selected).toBe(true);
		});
	});

	describe('props', () => {
		it('appelle onChange quand une valeur est sélectionnée', async () => {
			const user = userEvent.setup();
			const onChangeSpy = vi.fn();
			render(<SelectSimple optionsList={optionsList} onChange={onChangeSpy}/>);

			await user.selectOptions(screen.getByRole('combobox'), '2');

			expect(onChangeSpy).toHaveBeenCalledWith('2');
		});

		it('lorsque la value change, le select prend la valeur de value mise à jour', () => {
			const component = (value: string) => (
				<form role="form" aria-label={'test'}>
					<SelectSimple optionsList={optionsList} onChange={onChange} value={value} name="name" />
				</form>
			);

			const { rerender } = render(component('1'));


			rerender(component('2'));

			expect(screen.getByRole('combobox')).toHaveValue('2');
			expect(screen.getByRole('form', { name: 'test' })).toHaveFormValues({ name: '2' });
		});

		it('accepte une defaultValue et initialise le select avec cette value', () => {
			render(<SelectSimple optionsList={optionsList} onChange={onChange} defaultValue={'1'}/>);

			expect(screen.getByRole('combobox')).toHaveTextContent('options 1');
		});

		it('accepte une liste d‘options', async () => {
			render(<SelectSimple optionsList={optionsList} onChange={onChange} />);

			const options = screen.getAllByRole('option');
			expect(options).toHaveLength(3);
			expect(options[1]).toHaveTextContent('options 1');
			expect(options[2]).toHaveTextContent('options 2');
		});

		it('lorsque l‘on donne un name, on peut récupérer la valeur sélectionnée depuis ce nom', async () => {
			const user = userEvent.setup();

			render(<form role="form">
				<ControlledSelectSimple optionsList={optionsList} name={'nomSelect'}/>
			</form>);

			await user.selectOptions(screen.getByRole('combobox'), '2');

			expect(screen.getByRole('form')).toHaveFormValues({ nomSelect: '2' });
		});
	});

	describe('touched', () => {
		it('lorsque l‘utilisateur n‘a pas interagit avec le champ, le select n‘est pas touched', () => {
			const onTouch = vi.fn();

			render(<SelectSimple optionsList={optionsList} onChange={onChange} onTouch={onTouch}/>);

			const combobox = screen.getByRole('combobox');
			expect(onTouch).not.toHaveBeenCalled();
			expect(combobox).toHaveAttribute('data-touched', 'false');
		});

		it('lorsque l‘utilisateur ouvre puis quitte le champ sans sélectionner d‘option, le select n’est pas touched', async () => {
			const user = userEvent.setup();
			const onTouch = vi.fn();

			render(<ControlledSelectSimple optionsList={optionsList} onTouch={onTouch}/>);

			const combobox = screen.getByRole('combobox');
			await user.click(combobox);
			await user.tab();

			expect(onTouch).not.toHaveBeenCalled();
			expect(combobox).toHaveAttribute('data-touched', 'false');
		});

		it('lorsque l‘utilisateur sélectionne une option puis quitte le champ, le select est touched', async () => {
			const user = userEvent.setup();
			const onTouch = vi.fn();

			render(<ControlledSelectSimple optionsList={optionsList} onTouch={onTouch}/>);

			const combobox = screen.getByRole('combobox');
			await user.selectOptions(combobox, '1');
			await user.tab();

			expect(onTouch).toHaveBeenCalledWith(true);
			expect(combobox).toHaveAttribute('data-touched', 'true');
		});
	});
});
