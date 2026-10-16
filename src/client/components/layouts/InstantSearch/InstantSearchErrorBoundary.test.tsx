import { render, screen } from '@testing-library/react';

import { InstantSearchErrorBoundary } from '~/client/components/layouts/InstantSearch/InstantSearchErrorBoundary';
import { mockUseInstantSearch } from '~/client/components/ui/Meilisearch/mockMeilisearchUseFunctions';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';

import { useInstantSearch } from 'react-instantsearch';
vi.mock('react-instantsearch');

const spyOnInstantSearch = vi.mocked(useInstantSearch);


const ChildrenComponent = () => {
	return <div aria-label="composant enfant">je suis le composant enfant</div>;
};
describe('InstantSearchErrorBoundary', () => {
	beforeEach(() => {
		mockUseRouter({});
		mockLargeScreen();
	});

	describe('Quant instantsearch n‘est pas en erreur', () => {
		it('retourne le composant enfant', () => {
			spyOnInstantSearch.mockImplementation(() => mockUseInstantSearch({ error: undefined }));
			render(
				<InstantSearchErrorBoundary>
					<ChildrenComponent />
				</InstantSearchErrorBoundary>,
			);
			const childrenComponentContent = screen.getByLabelText('composant enfant');
			expect(childrenComponentContent).toBeInTheDocument();
		});
	});

	describe('Quant instantsearch est en erreur', () => {
		it('retourne le composant service indisponible', () => {
			spyOnInstantSearch.mockImplementation(() => mockUseInstantSearch({
				error: {
					message: 'MeilisearchCommunicationError',
					name: 'Error',
				},
			}));
			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<InstantSearchErrorBoundary>
						<ChildrenComponent />
					</InstantSearchErrorBoundary>
				</DependenciesProvider>,
			);

			const errorContent = screen.getByRole('heading', { level: 2 });
			expect(errorContent).toBeInTheDocument();
			expect(errorContent).toHaveTextContent('Service Indisponible');
		});
	});
});
