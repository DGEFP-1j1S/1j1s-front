import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Combobox } from '~/client/components/ui/Form/Combobox';
import { Input } from '~/client/components/ui/Form/Input';

import { Champ } from './Champ';

describe('<Champ/>', () => {
	it('lorsqu‘on séléctionne un élément valide, le message d‘erreur se met bien à jour', async () => {
		const user = userEvent.setup();
		render(
			<Champ>
				<Champ.Input render={Combobox} requireValidOption optionsAriaLabel={'foo'}>
					<Combobox.Option>Option 1</Combobox.Option>
					<Combobox.Option>Option 2</Combobox.Option>
					<Combobox.Option>Option 3</Combobox.Option>
					<Champ.Error />
				</Champ.Input>
			</Champ>,
		);

		const input = screen.getByRole('combobox');
		await user.type(input, 'O');
		await user.click(screen.getByRole('option', { name: 'Option 1' }));
		await user.tab();

		expect(input).toHaveAccessibleDescription('');
	});

	it('accepte un className en plus du style "champ" déjà en place', () => {
		const { container } = render(
			<Champ className={'someStyle'}>
				<Champ.Input render={Input} />
			</Champ>,
		);

		// eslint-disable-next-line testing-library/no-node-access
		expect(container.children[0]).toHaveAttribute('class', 'champ someStyle');
	});

	it('affiche son contenu', () => {
		render(
			<Champ>
				<Champ.Input render={Input} />
			</Champ>,
		);

		expect(screen.getByRole('textbox')).toBeVisible();
	});

	it('lie le champ avec son message d’erreur', async () => {

		render(
			<Champ>
				<Champ.Input render={Input} validation={() => 'Message d’erreur'} />
				<Champ.Error />
			</Champ>,
		);
		await touchChamp();

		const input = screen.getByRole('textbox');
		expect(input).toHaveAccessibleDescription('Message d’erreur');
	});

	it('lie le champ avec son label', () => {
		render(
			<Champ>
				<Champ.Label>Prénom</Champ.Label>
				<Champ.Input render={Input} />
			</Champ>,
		);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAccessibleName('Prénom');
	});

	describe('<Champ.Input/>', () => {
		it('accepte un composant a afficher', () => {
			render(
				<Champ>
					<Champ.Input render={Combobox} disabled optionsAriaLabel={'foo'} />
				</Champ>,
			);

			const input = screen.getByRole('combobox');

			expect(input).toBeVisible();
		});

		it('accepte les propriété d‘un input', async () => {
			render(
				<Champ>
					<Champ.Input render={Input} disabled aria-label={'foo'} />
				</Champ>,
			);

			const input = screen.getByRole('textbox');

			expect(input).toBeDisabled();
			expect(input).toHaveAccessibleName('foo');
		});

		it('accepte une ref', () => {
			const ref = vi.fn();
			render(
				<Champ>
					<Champ.Input render={Input} ref={ref} />
				</Champ>,
			);

			expect(ref).toHaveBeenCalledTimes(1);
			expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
		});

		it('accepte un onChange', async () => {
			const onChange = vi.fn();
			render(
				<Champ>
					<Champ.Input render={Input} onChange={onChange} />
				</Champ>,
			);

			const user = userEvent.setup();
			const input = screen.getByRole('textbox');
			await user.type(input, 'a');

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ target: input }));
		});

		it('accepte un onInvalid et l‘appelle quand l‘input est invalid', async () => {
			const onInvalid = vi.fn();
			render(
				<Champ>
					<Champ.Input render={Input} onInvalid={onInvalid} required />
				</Champ>,
			);

			const user = userEvent.setup();
			const input = screen.getByRole('textbox');

			await touchChamp();

			await user.clear(input);
			await user.tab();

			expect(onInvalid).toHaveBeenCalledTimes(1);
			expect(onInvalid).toHaveBeenLastCalledWith(expect.objectContaining({ target: input }));
		});

		describe('aria-invalid', () => {
			it('lorsque je suis en erreur, aria-invalid est à true', async () => {
				const user = userEvent.setup();
				render(
					<Champ>
						<Champ.Input render={Input} required />
						<Champ.Error />
					</Champ>,
				);

				const input = screen.getByRole('textbox');
				await user.type(input, 'a');
				await user.tab();

				await user.clear(input);

				expect(input).toHaveAttribute('aria-invalid', 'true');
			});

			it('lorsque je fournis une valeur valide, aria-invalid est à false', async () => {
				const user = userEvent.setup();
				render(
					<Champ>
						<Champ.Input render={Input} required />
						<Champ.Error />
					</Champ>,
				);

				const input = screen.getByRole('textbox');
				await user.type(input, 'a');
				await user.tab();

				expect(input).toHaveAttribute('aria-invalid', 'false');
			});

		});

		it('accepte un onTouch', async () => {
			const onTouch = vi.fn();
			render(
				<Champ>
					<Champ.Input render={Input} onTouch={onTouch} />
				</Champ>,
			);

			const user = userEvent.setup();
			const input = screen.getByRole('textbox');
			await user.type(input, 'a');
			await user.tab();

			expect(onTouch).toHaveBeenCalledTimes(1);
			expect(onTouch).toHaveBeenCalledWith(true);
		});

		it('merge le aria-describedby donné par le parent avec celui du message d’erreur et de l‘indication', async () => {
			render(
				<Champ>
					<Champ.Input render={Input} aria-describedby="description" validation={() => 'Ceci est une erreur'} />
					<p id="description">Ceci est une description</p>
					<Champ.Error />
					<Champ.Hint>Ceci est une indication</Champ.Hint>
				</Champ>,
			);
			await touchChamp();

			const input = screen.getByRole('textbox');
			expect(input).toHaveAccessibleDescription(expect.stringContaining('Ceci est une description'));
			expect(input).toHaveAccessibleDescription(expect.stringContaining('Ceci est une erreur'));
			expect(input).toHaveAccessibleDescription(expect.stringContaining('Ceci est une indication'));
		});

		it('lorsque je ne fournis pas d‘indication et d‘erreur, le aria-describedby est vide', () => {
			render(<Champ>
				<Champ.Input render={Input} />
			</Champ>);

			const erreur = screen.getByRole('textbox');
			expect(erreur).toHaveAccessibleDescription('');
		});

		it('lorsque je fournis un id à l‘indication, le aria-describedby contient l‘indication', () => {
			render(<Champ>
				<Champ.Input render={Input} />
				<Champ.Hint id="idExpected">Je suis l‘indication</Champ.Hint>
			</Champ>);

			const erreur = screen.getByRole('textbox');
			expect(erreur).toHaveAccessibleDescription('Je suis l‘indication');
		});

		it('lorsque je fournis un id à l‘erreur, le aria-describedby contient l‘erreur quand le champ est bien en erreur', async () => {
			render(<Champ>
				<Champ.Input render={Input} validation={() => 'Ceci est une erreur'} />
				<Champ.Error id="idExpected" />
			</Champ>);
			await touchChamp();

			const input = screen.getByRole('textbox');
			expect(input).toHaveAccessibleDescription('Ceci est une erreur');
		});

		it("lorsque je fournis un id à l'input, le label et l'input sont liés", () => {
			render(<Champ>
				<Champ.Label>Prénom</Champ.Label>
				<Champ.Input render={Input} id="idExpected" />
			</Champ>);

			const input = screen.getByRole('textbox');
			expect(input).toHaveAccessibleName('Prénom');
		});
	});

	describe('<Champ.Error/>', () => {
		it('accepte les propriété de l‘Erreur', async () => {
			render(
				<Champ>
					<Champ.Input render={Input} validation={() => 'Je suis l‘erreur'} />
					<Champ.Error className="foo" data-test="test" />
				</Champ>,
			);
			await touchChamp();

			const erreur = screen.getByText('Je suis l‘erreur');
			expect(erreur).toHaveAttribute('class', expect.stringContaining('foo'));
			expect(erreur).toHaveAttribute('data-test', 'test');
		});

		it('quand je fournis un id, utiliser cet id', async () => {
			render(
				<Champ>
					<Champ.Input render={Input} validation={() => 'Je suis l‘erreur'} />
					<Champ.Error id="idExpected" />
				</Champ>,
			);
			await touchChamp();

			const erreur = screen.getByText('Je suis l‘erreur');
			expect(erreur).toHaveAttribute('id', 'idExpected');
		});

		it('lorsque le champ n‘est pas touched, n‘affiche pas l‘erreur', () => {
			render(
				<Champ>
					<Champ.Input render={Input} validation={() => 'Je suis l‘erreur'} />
					<Champ.Error />
				</Champ>,
			);

			const erreur = screen.queryByText('Je suis l‘erreur');
			expect(erreur).not.toBeInTheDocument();
		});



		it('lorsque le champ est touched et qu’il y a une erreur, affiche l‘erreur', async () => {
			const user = userEvent.setup();
			render(
				<Champ>
					<Champ.Input render={Input} required />
					<Champ.Error />
				</Champ>,
			);

			const input = screen.getByRole('textbox');
			await user.type(input, 'a');
			await user.tab();

			await user.clear(input);

			const erreur = screen.getByText('Constraints not satisfied');

			expect(erreur).toBeVisible();
		});

		it('lorsque le champ est required, que je le laisse vide et que je tente de soumettre le formulaire qui le contient, affiche l‘erreur', async () => {
			const user = userEvent.setup();
			render(
				<form>
					<Champ>
						<Champ.Input render={Input} required />
						<Champ.Error />
					</Champ>
					<button>Soumettre</button>
				</form>,
			);

			const boutonSoumissionFormulaire = screen.getByRole('button', { name: 'Soumettre' });
			await user.click(boutonSoumissionFormulaire);

			const erreur = screen.getByText('Constraints not satisfied');

			expect(erreur).toBeVisible();
		});

		it('lorsque le champ est touched et qu’il n’y a pas d’erreur, n’affiche pas l‘erreur et l‘input n‘a pas l‘id de l‘erreur dans son attribut aria-describedby', async () => {
			// Given
			const user = userEvent.setup();
			render(
				<Champ>
					<Champ.Input render={Input} id={'input-id'} required />
					<Champ.Error id={'erreur-id'} data-testid={'erreur-id'} />
				</Champ>,
			);

			// When
			const input = screen.getByRole('textbox');
			await user.type(input, 'a');
			await user.tab();

			// Then
			const erreur = screen.queryByTestId('erreur-id');
			const inputAriaDescribedBy = input.getAttribute('aria-describedby');

			expect(erreur).toBeNull();
			expect(inputAriaDescribedBy?.includes('erreur-id')).toBeFalsy();
		});
	});
});

async function touchChamp() {
	const user = userEvent.setup();
	const input = screen.getByRole('textbox');
	await user.type(input, 'a');
	await user.tab();
}
