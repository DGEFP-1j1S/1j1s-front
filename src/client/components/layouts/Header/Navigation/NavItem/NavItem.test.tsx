import { fireEvent, render, screen } from '@testing-library/react';

import { NavItem } from '~/client/components/layouts/Header/Navigation/NavItem/NavItem';
import { mockUseRouter } from '~/client/components/useRouter.mock';

describe('NavItem', () => {
	beforeEach(() => {
		mockUseRouter({});
	});

	it('affiche un lien avec le bon label', () => {
		render(<NavItem link="/test" isActive label={'je suis le label'} />);

		expect(screen.getByRole('link', { name: 'je suis le label' })).toBeVisible();
	});

	it('affiche le lien est actif, la propriété aria-current est a true', () => {
		render(<NavItem link="/test" isActive label={'je suis le label'} />);

		expect(screen.getByRole('link', { name: 'je suis le label' })).toHaveAttribute('aria-current', 'true');
	});

	it('lorsque le lien est une redirection externe, ajoute l‘information au label', () => {
		render(<NavItem link="https://test.com" isActive label={'je suis le label'} />);

		expect(screen.getByRole('link', { name: 'je suis le label - nouvelle fenêtre' })).toBeVisible();
	});

	describe('lorsque le lien pointe vers l‘url courante', () => {
		it('empêche la navigation mais appelle quand même le onClick fourni, qui ferme le menu mobile', () => {
			mockUseRouter({ asPath: '/emplois' });
			const onClick = vi.fn();
			render(<NavItem link="/emplois" isActive label={'Emplois'} onClick={onClick} />);

			const navigationNonEmpechee = fireEvent.click(screen.getByRole('link', { name: 'Emplois' }));

			expect(navigationNonEmpechee).toBe(false);
			expect(onClick).toHaveBeenCalledTimes(1);
			expect(onClick.mock.calls[0][0].defaultPrevented).toBe(true);
		});
	});

	describe('lorsque le lien pointe vers la même page mais avec des filtres différents', () => {
		it('laisse passer la navigation', () => {
			mockUseRouter({ asPath: '/emplois?motCle=x' });
			const onClick = vi.fn();
			render(<NavItem link="/emplois" isActive label={'Emplois'} onClick={onClick} />);

			const navigationNonEmpechee = fireEvent.click(screen.getByRole('link', { name: 'Emplois' }));

			expect(navigationNonEmpechee).toBe(true);
			expect(onClick).toHaveBeenCalledTimes(1);
		});
	});
});
