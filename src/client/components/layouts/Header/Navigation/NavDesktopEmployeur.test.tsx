import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { mockUseRouter } from '~/client/components/useRouter.mock';

import { NavDesktopEmployeur } from './NavDesktopEmployeur';

describe('NavDesktopEmployeur', () => {
	const mockItem = {
		children: [
			{
				label: 'Sous-section 1',
				link: '/employeurs/sous-section-1',
			},
			{
				label: 'Sous-section 2',
				link: '/employeurs/sous-section-2',
			},
		],
		label: 'Employeurs',
	};

	beforeEach(() => {
		mockUseRouter({});	
	});

	it('doit afficher le label sur le bouton du menu principal', () => {
		render(<NavDesktopEmployeur item={mockItem} />);

		expect(screen.getByRole('button', { name: 'Employeurs' })).toBeVisible();
	});

	it("doit ouvrir le sous-menu lorsqu'on clique sur le bouton principal", async () => {
		const user = userEvent.setup();

		render(<NavDesktopEmployeur item={mockItem} />);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(screen.getByRole('link', { name: 'Sous-section 1' })).toBeVisible();
	});

	it("doit fermer le sous-menu lorsqu'on clique à nouveau sur le bouton principal", async () => {
		const user = userEvent.setup();

		render(<NavDesktopEmployeur item={mockItem} />);

		const button = screen.getByRole('button');

		await user.click(button);
		expect(screen.getByRole('link', { name: 'Sous-section 1' })).toBeVisible();

		await user.click(button);
		expect(screen.getByText('Sous-section 1')).toBeVisible();
	});

	it('doit afficher correctement la structure du menu', async () => {
		const user = userEvent.setup();

		render(<NavDesktopEmployeur item={mockItem} />);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(screen.getByRole('link', { name:'Sous-section 1' })).toBeVisible();
		expect(screen.getByRole('link', { name: 'Sous-section 2' })).toBeVisible();
	});
});
