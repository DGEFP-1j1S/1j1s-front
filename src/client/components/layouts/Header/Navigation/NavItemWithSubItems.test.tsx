import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import {
	NavigationItem,
	NavigationItemWithChildren,
} from '~/client/components/layouts/Header/Navigation/NavigationStructure';
import { mockUseRouter } from '~/client/components/useRouter.mock';

import { NavItemWithSubItems } from './NavItemWithSubItems';

function aNavigationItem(overrides?: Partial<NavigationItemWithChildren>) {
	return {
		children: [
			{ label: 'Sub Item 1', link: '#sub1' },
			{ label: 'Sub Item 2', link: '#sub2' },
		],
		label: 'Test Menu',
		...overrides,
	};
}
function aNavigationSubItem(overrides?: Partial<NavigationItem>) {
	return {
		label: 'Sub Item 1',
		link: '#sub1',
		...overrides,
	};
}

describe('NavItemWithSubItems', () => {
	beforeAll(() => {
		mockUseRouter({});
	});

	it('affiche le bouton du menu', () => {
		const nav = aNavigationItem({ label: 'Menu' });

		render(<NavItemWithSubItems navigationItemWithChildren={nav} />);
		
		expect(screen.getByRole('button', { name: 'Menu' })).toBeVisible();
	});
	it('masque le sous-menu par défaut', () => {
		const nav = aNavigationItem({
			children: [ aNavigationSubItem({ label: 'SubItem' }) ],
			label: 'Menu',
		});
		render(<NavItemWithSubItems navigationItemWithChildren={nav} />);

		const menuButton = screen.getByRole('button', { name: 'Menu' });
		expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		const subMenu = screen.queryByRole('link', { name: 'SubItem' });
		expect(subMenu).not.toBeInTheDocument();
	});

	describe('lorsque je clique sur le bouton du menu', () => {
		it('doit afficher le sous-menu', async () => {
			const user = userEvent.setup();
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({ label: 'SubItem' }) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);

			const menuButton = screen.getByRole('button', { name: 'Menu' });
			await user.click(menuButton);

			expect(menuButton).toHaveAttribute('aria-expanded', 'true');
			expect(screen.getByRole('link', { name: /SubItem/i })).toBeVisible();
		});
		describe('et que le menu est déjà déplié', () => {
			it('masque le menu', async () => {
				const user = userEvent.setup();
				const nav = aNavigationItem({
					children: [ aNavigationSubItem({ label: 'SubItem' }) ],
					label: 'Menu',
				});
				render(<NavItemWithSubItems navigationItemWithChildren={nav} />);
				const menuButton = screen.getByRole('button', { name: 'Menu' });
				await user.click(menuButton);

				await user.click(menuButton);

				expect(menuButton).toHaveAttribute('aria-expanded', 'false');
				expect(screen.queryByText('SubItem')).not.toBeInTheDocument();
			});
		});
	});

	describe('lorsque la page actuelle appartient au sous-menu', () => {
		// FIXME (GAFI 09-09-2024): le aria-current est actuellement sur le span
		it.skip('marque le bouton comme section actuelle', async () => {
			mockUseRouter({ pathname: '/current-page' });
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({
					label: 'Current Page',
					link: '/current-page',
				}) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);

			const menuButton = screen.getByRole('button', { name: 'Menu' });
			expect(menuButton).toHaveAttribute('aria-current', 'true');
		});
		it('marque le lien comme page actuelle', async () => {
			mockUseRouter({ pathname: '/current-page' });
			const user = userEvent.setup();
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({
					label: 'Current Page',
					link: '/current-page',
				}) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);

			const menuButton = screen.getByRole('button', { name: 'Menu' });
			await user.click(menuButton);

			const linkMenu = screen.getByRole('link', { name: 'Current Page' });
			// FIXME (GAFI 09-09-2024): Idéalement aria-current="page"
			expect(linkMenu).toHaveAttribute('aria-current', 'true');
		});
	});
	describe('lorsque la page actuelle n’appartient pas au sous-menu', () => {
		// FIXME (GAFI 09-09-2024): le aria-current est actuellement sur le span
		it.skip('marque le bouton comme section pas actuelle', async () => {
			mockUseRouter({ pathname: '/current-page' });
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({
					label: 'Other Page',
					link: '/other-page',
				}) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);

			const menuButton = screen.getByRole('button', { name: 'Menu' });
			expect(menuButton).not.toHaveAttribute('aria-current', 'false');
		});
		it('marque le lien comme page actuelle', async () => {
			const user = userEvent.setup();
			mockUseRouter({ pathname: '/current-page' });
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({
					label: 'Other Page',
					link: '/other-page',
				}) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);

			const menuButton = screen.getByRole('button', { name: 'Menu' });
			await user.click(menuButton);

			const linkMenu = screen.getByRole('link', { name: 'Other Page' });
			expect(linkMenu).toHaveAttribute('aria-current', 'false');
		});
	});

	describe('lorsque le menu perd le focus', () => {
		it('ferme le sous-menu', async () => {
			const user = userEvent.setup();
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({ label: 'SubItem' }) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);
			const button = screen.getByRole('button', { name: 'Menu' });
			await user.click(button);
			const subItem = screen.getByRole('link', { name: 'SubItem' });

			await userEvent.tab();
			await userEvent.tab();

			expect(subItem).not.toBeInTheDocument();
		});
	});

	describe('lorsque le focus entre dans le sous menu', () => {
		it('ne doit pas fermer le sous-menu', async () => {
			const user = userEvent.setup();
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({ label: 'SubItem' }) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);
			const button = screen.getByRole('button', { name: 'Menu' });
			await user.click(button);
			const subItem = screen.getByRole('link', { name: 'SubItem' });

			await userEvent.tab();

			expect(subItem).toBeVisible();
			expect(subItem).toHaveFocus();
		});
	});

	describe('lorsque j‘appuis sur la touche ECHAP', () => {
		it('doit fermer le sous-menu', async () => {
			const user = userEvent.setup();
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({ label: 'SubItem' }) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);
			await user.click(screen.getByRole('button', { name: 'Menu' }));
			const sousMenu = screen.getByRole('link', { name: 'SubItem' });

			await user.keyboard(`{${KeyBoard.ESCAPE}}`);

			expect(sousMenu).not.toBeInTheDocument();
		});
	});

	describe('lorsque je clique en dehors du sous-menu', () => {
		it('ferme le sous-menu', async () => {
			const user = userEvent.setup();
			const nav = aNavigationItem({
				children: [ aNavigationSubItem({ label: 'SubItem' }) ],
				label: 'Menu',
			});
			render(<NavItemWithSubItems navigationItemWithChildren={nav} />);
			await user.click(screen.getByRole('button', { name: 'Menu' }));
			const sousMenu = screen.getByRole('link', { name: /SubItem/i });

			await user.click(document.body);

			expect(sousMenu).not.toBeInTheDocument();
		});
	});

	it('lorsque l‘utilisateur clique sur un lien, appelle la props onClick une fois', async () => {
		// FIXME (GAFI 09-09-2024): Idéalement, on voudrait passer l'event au handler pour pouvoir faire un preventDefault
		//	et même passer en composition pour ne pas avoir à le gérer à la main
		const onClick = vi.fn();
		const user = userEvent.setup();
		render(
			<NavItemWithSubItems
				navigationItemWithChildren={aNavigationItem()}
				onClick={onClick} />,
		);
		const button = screen.getByRole('button', { name: 'Test Menu' });
		await user.click(button);

		const subItem = screen.getByRole('link', { name: /Sub Item 1/i });
		await user.click(subItem);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it.todo('reprise de focus à la fermeture du sous-menu quand le focus est dans le sous-menu');
	it.todo('En mobile, le menu ne doit pas se fermer à la perte du focus (ça ressemble plus à un disclosure ou accordéon)');
});
