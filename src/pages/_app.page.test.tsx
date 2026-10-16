import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'next/router';
import React from 'react';

import { createMockRouter, mockUseRouter } from '~/client/components/useRouter.mock';
import { mockUUID } from '~/client/components/window.mock';
import { Dependencies } from '~/client/dependencies.container';
import { aCookiesService } from '~/client/services/cookies/cookies.service.fixture';

import App from './_app.page';


const mockDependencies: Partial<Dependencies> = {
	cookiesService: aCookiesService(),
};
vi.mock('~/client/dependencies.container', () => ({ default: () => mockDependencies }));

describe('<App />', () => {
	beforeAll(() => {
		mockUUID();
	});
	it('focus l’ancre au render', async () => {
		// NOTE (GAFI 25-04-2023): Parce qu'apparemment un NextRouter n'est pas un Router, mais que ça marche quand même
		const router = createMockRouter() as Router;
		mockUseRouter({ asPath: '/test#cible' });
		const Component = Object.assign(
			function Component() {
				return <button id="cible">Cible</button>;
			},
			{ getLayout: (page: React.ReactElement) => <>{page}</> },
		);

		render(<App pageProps={{}} Component={Component} router={router} />);

		const cible = screen.getByText('Cible');
		await waitFor(() => expect(cible).toHaveFocus());
	});
	describe('Trigger services tiers', () => {
		it('ne trigger pas les cookies à l’arrivée sur la page', () => {
			// NOTE (GAFI 26-11-2024): Les services sont automatiquement triggered au chargement de tarteaucitron
			const router = createMockRouter() as Router;
			mockUseRouter({});
			mockDependencies.cookiesService = aCookiesService({ triggerServices: vi.fn() });
			const Component = Object.assign(
				function Component() {
					return null;
				},
				{ getLayout: (page: React.ReactElement) => <>{page}</> },
			);

			render(<App pageProps={{}} Component={Component} router={router} />);

			expect(mockDependencies.cookiesService.triggerServices).not.toHaveBeenCalled();
		});
		it('trigger les cookies au changement de page', () => {
			mockDependencies.cookiesService = aCookiesService({ triggerServices: vi.fn() });
			const router = createMockRouter() as Router;
			mockUseRouter({ asPath: '/page-1' });
			const Component = Object.assign(
				function Component() {
					return null;
				},
				{ getLayout: (page: React.ReactElement) => <>{page}</> },
			);
			const { rerender } = render(<App pageProps={{}} Component={Component} router={router} />);

			mockUseRouter({ asPath: '/page-2' });
			rerender(<App pageProps={{}} Component={Component} router={router} />);

			expect(mockDependencies.cookiesService.triggerServices).toHaveBeenCalledTimes(1);
		});
	});
});
