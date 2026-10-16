import { render, screen } from '@testing-library/react';

import { ErrorLayout } from '~/client/components/layouts/Error/ErrorLayout';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSessionStorage, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';

describe('ErrorLayout', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
		mockSessionStorage({
			getItem: vi.fn().mockReturnValue('/'),
		});
	});
	it('affiche le bouton de retour à la page précédente', () => {
		render(
			<DependenciesProvider sessionStorageService={aStorageService({ get: vi.fn().mockReturnValue(true) })}>
				<ErrorLayout><p>children</p></ErrorLayout>
			</DependenciesProvider>,
		);
		expect(screen.getByRole('link', { name: 'Retourner à la page précédente' })).toBeVisible();
	});
	it('affiche le bouton de retour vers la page d‘accueil', () => {
		render(
			<DependenciesProvider sessionStorageService={aStorageService()}>
				<ErrorLayout><p>children</p></ErrorLayout>
			</DependenciesProvider>,
		);
		expect(screen.getByRole('link', { name: 'Aller à l‘accueil' })).toBeVisible();
	});
});
