import { render, screen } from '@testing-library/react';

import Footer from '~/client/components/layouts/Footer/Footer';

describe('Footer', () => {
	it('renders Footer component', () => {
		render(<Footer />);

		const footer = screen.getByRole('contentinfo');

		expect(footer).toBeVisible();
	});

	it('rends le composant avec le logo du ministère du travail', () => {
		render(<Footer />);


		const logo1 = screen.getByText('Ministère');
		const logo2 = screen.getByText('du travail');
		const logo3 = screen.getByText('et de l\'emploi');

		expect(logo1).toBeVisible();
		expect(logo2).toBeVisible();
		expect(logo3).toBeVisible();
	});

	it('renders Footer component with a link to legifrance.gouv.fr', () => {
		// When
		render(<Footer />);

		// Then
		const link = screen.getByRole('link', { name: 'legifrance.gouv.fr - nouvelle fenêtre' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.legifrance.gouv.fr/');
	});

	it('renders Footer component with a link to gouvernement.fr', () => {
		// When
		render(<Footer />);

		// Then
		const link = screen.getByRole('link', { name: 'gouvernement.fr - nouvelle fenêtre' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.gouvernement.fr/');
	});

	it('renders Footer component with a link to service-public.fr', () => {
		// When
		render(<Footer />);

		// Then
		const link = screen.getByRole('link', { name: 'service-public.fr - nouvelle fenêtre' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.service-public.fr/');
	});

	it('renders Footer component with a link to data.gouv.fr', () => {
		// When
		render(<Footer />);

		// Then
		const link = screen.getByRole('link', { name: 'data.gouv.fr - nouvelle fenêtre' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.data.gouv.fr/');
	});

	it('renders Footer component with a link to france.fr', () => {
		// When
		render(<Footer />);

		// Then
		const link = screen.getByRole('link', { name: 'france.fr - nouvelle fenêtre' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.france.fr/');
	});

	it('renders Footer component with a link to etalab.gouv.fr', () => {
		// When
		render(<Footer />);

		// Then
		const link = screen.getByRole('link', { name: 'etalab-2.0 - nouvelle fenêtre' });

		expect(link).toBeVisible();
		expect(link).toHaveAttribute('href', 'https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf');
	});
});
