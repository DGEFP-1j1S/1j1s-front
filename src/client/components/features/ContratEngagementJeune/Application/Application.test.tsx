import { render, screen } from '@testing-library/react';

import Application from '~/client/components/features/ContratEngagementJeune/Application/Application';

describe('<Application />', () => {
	it('affiche de téléchargement de l‘application sur Google Play', () => {
		// Given
		const name = 'Télécharger sur Google Play';

		// When
		render(<Application />);

		// Then
		const link = screen.getByRole('link', { name });
		expect(link).toBeVisible();
	});

	it('affiche de téléchargement de l‘application sur l‘App Store', () => {
		// Given
		const name = 'Télécharger sur APP Store';

		// When
		render(<Application />);

		// Then
		const link = screen.getByRole('link', { name });
		expect(link).toBeVisible();
	});
});
