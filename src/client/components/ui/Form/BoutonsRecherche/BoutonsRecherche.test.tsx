import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';

describe('BoutonsRecherche', () => {
	it('affiche un bouton de soumission Rechercher', () => {
		render(<BoutonsRecherche onReinitialiser={vi.fn()} />);

		expect(screen.getByRole('button', { name: 'Rechercher' })).toHaveAttribute('type', 'submit');
	});

	it('au clic sur Réinitialiser, appelle onReinitialiser sans soumettre le formulaire', async () => {
		const user = userEvent.setup();
		const onReinitialiser = vi.fn();
		const onSubmit = vi.fn((event) => event.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<BoutonsRecherche onReinitialiser={onReinitialiser} />
			</form>,
		);

		await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));

		expect(onReinitialiser).toHaveBeenCalledTimes(1);
		expect(onSubmit).not.toHaveBeenCalled();
	});
});
