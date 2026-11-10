import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { ChampIntervalle } from '~/client/components/ui/Form/ChampIntervalle/ChampIntervalle';

const renderChampIntervalleComponent = (props?: { valeurMinInitiale?: number, valeurMaxInitiale?: number }) => {
	render(
		<form aria-label="formulaire">
			<ChampIntervalle
				legend="test-legende"
				name='test'
				labelMinimum='test-minimum'
				labelMaximum='test-maximum'
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

describe('<ChampIntervalle/>', () => {
	it('affiche deux champs de type number avec l‘unité dans le label', () => {
		renderChampIntervalleComponent();

		const inputMin = screen.getByRole('spinbutton', { name: 'test-minimum (test-unité)' });
		const inputMax = screen.getByRole('spinbutton', { name: 'test-maximum (test-unité)' });
		expect(inputMin).toBeVisible();
		expect(inputMin).toHaveAttribute('min', '20');
		expect(inputMin).toHaveAttribute('max', '200');
		expect(inputMax).toBeVisible();
		expect(inputMax).toHaveAttribute('min', '20');
		expect(inputMax).toHaveAttribute('max', '200');
	});

	it("regroupe les deux champs dans un groupe nommé par la légende", () => {
		// WHEN
		renderChampIntervalleComponent();

		// THEN
		const groupe = screen.getByRole("group", { name: "test-legende" });
		expect(within(groupe).getByRole("spinbutton", { name: "test-minimum (test-unité)" })).toBeVisible();
		expect(within(groupe).getByRole("spinbutton", { name: "test-maximum (test-unité)" })).toBeVisible();
	});

	it('reprend les valeurs initiales', () => {
		renderChampIntervalleComponent({ valeurMaxInitiale: 50, valeurMinInitiale: 12 });

		expect(screen.getByRole('spinbutton', { name: 'test-minimum (test-unité)' })).toHaveValue(12);
		expect(screen.getByRole('spinbutton', { name: 'test-maximum (test-unité)' })).toHaveValue(50);
		expect(valeursDuFormulaire()).toStrictEqual({ testMax: '50', testMin: '12' });
	});

	it('envoie les valeurs renseignées dans le formulaire', async () => {
		const user = userEvent.setup();
		renderChampIntervalleComponent();

		await user.type(screen.getByRole('spinbutton', { name: 'test-minimum (test-unité)' }), '12');
		await user.type(screen.getByRole('spinbutton', { name: 'test-maximum (test-unité)' }), '50');

		expect(valeursDuFormulaire()).toStrictEqual({ testMax: '50', testMin: '12' });
	});

	it('envoie une valeur vide pour une borne non renseignée', async () => {
		const user = userEvent.setup();
		renderChampIntervalleComponent();

		await user.type(screen.getByRole('spinbutton', { name: 'test-minimum (test-unité)' }), '12');

		expect(valeursDuFormulaire()).toStrictEqual({ testMax: '', testMin: '12' });
	});

	it('vide la borne quand on efface sa saisie', async () => {
		const user = userEvent.setup();
		renderChampIntervalleComponent({ valeurMinInitiale: 12 });

		await user.clear(screen.getByRole('spinbutton', { name: 'test-minimum (test-unité)' }));

		expect(valeursDuFormulaire()).toStrictEqual({ testMax: '', testMin: '' });
	});
});
