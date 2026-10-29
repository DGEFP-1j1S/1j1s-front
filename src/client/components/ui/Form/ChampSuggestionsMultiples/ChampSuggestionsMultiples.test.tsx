import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { ChampSuggestionsMultiples } from '~/client/components/ui/Form/ChampSuggestionsMultiples/ChampSuggestionsMultiples';
import { mockScrollIntoView } from '~/client/components/window.mock';
import { createSuccess } from '~/server/errors/either';

async function afficherChamp(rechercher = vi.fn().mockResolvedValue(createSuccess(['Paris', 'Lyon'])), valeursInitiales: Array<string> = []) {
	render(
		<form aria-label="formulaire">
			<ChampSuggestionsMultiples
				label="Localisation"
				name="localisations"
				optionsAriaLabel="villes"
				valeursInitiales={valeursInitiales}
				rechercher={rechercher}
				messagePasDeResultat="Aucune localisation"
				placeholder={(nombre) => (nombre ? `${nombre} cochée(s)` : undefined)} />
		</form>,
	);
	await waitFor(() => expect(rechercher).toHaveBeenCalledWith(''));
	return rechercher;
}

function valeursDuFormulaire() {
	return new FormData(screen.getByRole('form', { name: 'formulaire' }) as HTMLFormElement).getAll('localisations');
}

describe('<ChampSuggestionsMultiples />', () => {
	beforeEach(() => {
		mockScrollIntoView();
	});

	it('propose les valeurs les plus fréquentes dès l‘ouverture', async () => {
		const user = userEvent.setup();
		await afficherChamp();

		await user.click(screen.getByRole('combobox', { name: 'Localisation' }));

		expect(screen.getAllByRole('option').map((option) => option.textContent)).toStrictEqual(['Paris', 'Lyon']);
	});

	it('cherche les suggestions correspondant à la saisie', async () => {
		const user = userEvent.setup();
		const rechercher = await afficherChamp();

		await user.type(screen.getByRole('combobox', { name: 'Localisation' }), 'ly');

		expect(rechercher).toHaveBeenLastCalledWith('ly');
	});

	it('envoie les valeurs cochées dans le formulaire et les garde en tête de liste', async () => {
		const user = userEvent.setup();
		await afficherChamp(vi.fn().mockResolvedValue(createSuccess(['Paris', 'Lyon'])), ['Marseille']);

		await user.click(screen.getByRole('combobox', { name: 'Localisation' }));
		await user.click(screen.getByRole('option', { name: 'Lyon' }));

		expect(valeursDuFormulaire()).toStrictEqual(['Marseille', 'Lyon']);
		expect(screen.getAllByRole('option').map((option) => option.textContent)).toStrictEqual(['Marseille', 'Lyon', 'Paris']);
		expect(screen.getByRole('combobox', { name: 'Localisation' })).toHaveAttribute('placeholder', '2 cochée(s)');
	});

	it('affiche un message quand aucune suggestion ne correspond à la saisie', async () => {
		const user = userEvent.setup();
		await afficherChamp(vi.fn().mockResolvedValue(createSuccess([])));

		await user.type(screen.getByRole('combobox', { name: 'Localisation' }), 'zz');

		expect(await screen.findByRole('status')).toHaveTextContent('Aucune localisation');
	});
});
