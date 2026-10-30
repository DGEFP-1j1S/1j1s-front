import {
	render,
	screen,
	within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { ChampIntervalle } from '~/client/components/ui/Form/ChampIntervalle/ChampIntervalle';

const renderChampIntervalleComponent = (props?: { valeurMinInitiale?: number, valeurMaxInitiale?: number }) => {
	render(
		<form aria-label="formulaire">
			<ChampIntervalle
				name='test'
				label='test-label'
				placeholder='test-placeholder'
				unite='test-unité'
				min={20}
				max={200}
				{...props} />
		</form>,
	);
};

function valeursDuFormulaire() {
	return Object.fromEntries(new FormData(screen.getByRole('form', { name: 'formulaire' }) as HTMLFormElement));
}

describe('<ChampIntervalle/>', ()=> {
	it('reprend les valeurs initiales', () => {
		renderChampIntervalleComponent({ valeurMaxInitiale: 50, valeurMinInitiale: 12 });

		expect(screen.getByRole('button')).toHaveTextContent('De 12 test-unité à 50 test-unité');
		expect(valeursDuFormulaire()).toStrictEqual({ testMax: '50', testMin: '12' });
	});

	it('monte le composant', ()=> {
		renderChampIntervalleComponent();
		const meilisearchCustomRangeInputComponent = screen.getByLabelText('test-label');
		expect(meilisearchCustomRangeInputComponent).toBeInTheDocument();
	});

	it('contient deux champs inputs de type number', async () => {
		const user = userEvent.setup();
		renderChampIntervalleComponent();
		const button = screen.getByRole('button');

		await user.click(button);
		const inputMin = screen.getByLabelText('Minimum');
		const inputMax = screen.getByLabelText('Maximum');

		expect(inputMin).toBeInTheDocument();
		expect(inputMin).toHaveAttribute('type','number');

		expect(inputMax).toBeInTheDocument();
		expect(inputMax).toHaveAttribute('type','number');
	});

	it('contient un bouton Appliquer', async () => {
		const user = userEvent.setup();
		renderChampIntervalleComponent();
		const meilisearchCustomRangeInputComponent = screen.getByRole('button');

		await user.click(meilisearchCustomRangeInputComponent);

		const groupInputs = screen.getByRole('group');
		const submitButton = within(groupInputs).getByRole('button');

		expect(submitButton).toBeInTheDocument();
	});

	describe('quand on renseigne les champs minimum et maximum', () => {
		it('envoie les valeurs renseignées dans le formulaire', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMin = screen.getByLabelText('Minimum');
			await user.type(inputMin, '12');
			const inputMax = screen.getByLabelText('Maximum');
			await user.type(inputMax, '50');

			const groupInputs = screen.getByRole('group');
			const submitButton = within(groupInputs).getByRole('button');
			await user.click(submitButton);

			expect(valeursDuFormulaire()).toStrictEqual({ testMax: '50', testMin: '12' });
		});

		it('affiche dans le placeholder la bonne saisie', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMin = screen.getByLabelText('Minimum');
			await user.type(inputMin, '12');
			const inputMax = screen.getByLabelText('Maximum');
			await user.type(inputMax, '50');

			expect(meilisearchCustomRangeInputComponent).toHaveTextContent('De 12 test-unité à 50 test-unité');
		});

		it('ferme l‘affichage des champs au click sur le bouton Appliquer', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMin = screen.getByLabelText('Minimum');
			await user.type(inputMin, '12');
			const inputMax = screen.getByLabelText('Maximum');
			await user.type(inputMax, '50');

			const groupInputs = screen.getByRole('group');
			const submitButton = within(groupInputs).getByRole('button');
			await user.click(submitButton);

			expect(groupInputs).not.toBeInTheDocument();
		});
	});

	describe('quand on renseigne seulement le champ minimum', () => {
		it('n‘envoie que la valeur minimum dans le formulaire', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMin = screen.getByLabelText('Minimum');
			await user.type(inputMin, '12');


			const groupInputs = screen.getByRole('group');
			const submitButton = within(groupInputs).getByRole('button');
			await user.click(submitButton);

			expect(valeursDuFormulaire()).toStrictEqual({ testMin: '12' });
		});

		it('affiche dans le placeholder la bonne saisie', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMin = screen.getByLabelText('Minimum');
			await user.type(inputMin, '12');
			expect(meilisearchCustomRangeInputComponent).toHaveTextContent('A partir de 12 test-unité');
		});
	});

	describe('quand on renseigne seulement le champ maximum', () => {
		it('n‘envoie que la valeur maximum dans le formulaire', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMax = screen.getByLabelText('Maximum');
			await user.type(inputMax, '50');


			const groupInputs = screen.getByRole('group');
			const submitButton = within(groupInputs).getByRole('button');
			await user.click(submitButton);

			expect(valeursDuFormulaire()).toStrictEqual({ testMax: '50' });
		});

		it('affiche dans le placeholder la bonne saisie', async () => {
			const user = userEvent.setup();
			renderChampIntervalleComponent();
			const meilisearchCustomRangeInputComponent = screen.getByRole('button');

			await user.click(meilisearchCustomRangeInputComponent);

			const inputMax = screen.getByLabelText('Maximum');
			await user.type(inputMax, '50');
			expect(meilisearchCustomRangeInputComponent).toHaveTextContent('Jusqu‘à 50 test-unité');
		});
	});
  
});
