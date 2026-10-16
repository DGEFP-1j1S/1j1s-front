import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { InstantSearch, useInstantSearch, usePagination, useStats } from 'react-instantsearch';
vi.mock('react-instantsearch');

import { InstantSearchLayout } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import { aRechercheClientService } from '~/client/components/layouts/InstantSearch/InstantSearchLayout.fixture';
import {
	mockUseInstantSearch,
	mockUsePagination,
} from '~/client/components/ui/Meilisearch/mockMeilisearchUseFunctions';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';

const spyOnUseStats = vi.mocked(useStats);
const spyOnInstantSearch = vi.mocked(InstantSearch);
const spyOnUseInstantSearch = vi.mocked(useInstantSearch);
const spyedPagination = vi.mocked(usePagination);

describe('<InstantSearchLayout />', () => {
	beforeEach(() => {
		mockLargeScreen();
		mockUseRouter({});

		spyOnUseStats.mockImplementation(() => ({
			areHitsSorted: false,
			nbHits: 2,
			nbPages: 1,
			page: 0,
			processingTimeMS: 0,
			query: '',
		}));
		spyOnUseInstantSearch.mockImplementation(() => mockUseInstantSearch({
			error: undefined,
			results: { __isArtificial: false } as never,
		}));
		spyOnInstantSearch.mockImplementation((props) => {
			return <>{props.children}</>;
		});
		spyedPagination.mockImplementation(() => mockUsePagination({
			currentRefinement: 2,
			isFirstPage: false,
			isLastPage: false,
			nbHits: 35,
			nbPages: 3,
		}));
	});
	it('scroll en haut des résultats quand on change de page', async () => {
		const user = userEvent.setup();
		render(
			<DependenciesProvider
				rechercheClientService={aRechercheClientService()}>
				<InstantSearchLayout
					meilisearchIndex="fake"
					titre="Titre"
					sousTitre="Sous-titre"
					formulaireDeRecherche={<div></div>}
					tagList={<div></div>}
					nombreDeResultatParPage={2}
					messageResultatRechercheLabelSingulier="résultat trouvé"
					messageResultatRechercheLabelPluriel="résultats trouvés"
					nombreDeSkeleton={1}
					isAffichageListeDeResultatsDesktopDirectionRow={true}
					resultatDeRecherche={() => <></>} />
			</DependenciesProvider>,
		);
		await screen.findByRole('heading', { name: /2 résultats trouvés/ });
		const résultats = screen.getByRole('region', { name: /Résultats de la recherche/i });
		résultats.scrollIntoView = vi.fn();

		const pageSuivant = screen.getByRole('link', { name: /Page suivante/i });
		await user.click(pageSuivant);

		expect(résultats.scrollIntoView).toHaveBeenCalledTimes(1);
		expect(résultats.scrollIntoView).toHaveBeenCalledWith(true);
	});
});
