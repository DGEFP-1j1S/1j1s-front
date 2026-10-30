import '~/test-utils';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import RechercherFicheMetierPage from '~/pages/decouvrir-les-metiers/index.page';
import { ResultatsRechercheFicheMetier } from '~/server/fiche-metier/domain/rechercheFicheMetier';

function desResultats(): ResultatsRechercheFicheMetier {
	return {
		facettes: {
			centresInteret: [{ nombre: 3, valeur: 'j‘aime bouger' }, { nombre: 1, valeur: 'je veux travailler de mes mains' }],
		},
		nombreDeResultats: 1,
		resultats: [{ accroche_metier: '<p>Maître dans sa cuisine</p>', nom_metier: 'cuisinier/ère' }],
	};
}

function afficherLaPage(resultats = desResultats(), routerQuery = {}) {
	const push = vi.fn();
	mockUseRouter({ push, query: routerQuery });
	mockSmallScreen();
	const view = render(
		<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<RechercherFicheMetierPage resultats={resultats} />
		</DependenciesProvider>,
	);
	return { ...view, push };
}

describe('<RechercherFicheMetierPage />', () => {
	beforeEach(() => {
		mockScrollIntoView();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = afficherLaPage();

		await expect(container).toBeAccessible();
	});

	it('doit rendre du HTML respectant la specification', async () => {
		const { container } = afficherLaPage();

		await screen.findByText('Je trouve le métier qui me correspond');

		expect(container.outerHTML).toHTMLValidate();
	});

	it('affiche le nombre de résultats et les fiches reçues du serveur', () => {
		afficherLaPage();

		expect(screen.getByText('1 fiche métier')).toBeVisible();
		expect(screen.getByRole('link', { name: /Cuisinier\/ère/ })).toHaveAttribute('href', '/decouvrir-les-metiers/cuisinier%2F%C3%A8re');
	});

	it('à la soumission, met les critères de recherche dans l‘URL et revient à la première page', async () => {
		const user = userEvent.setup();
		const { push } = afficherLaPage(desResultats(), { page: '3' });

		await user.type(screen.getByRole('textbox', { name: /Métier/ }), 'cuisinier');
		await user.click(screen.getByRole('combobox', { name: /Centres d‘intérêt/ }));
		await user.click(screen.getByRole('option', { name: 'J‘aime bouger' }));
		await user.click(screen.getByRole('button', { name: 'Rechercher' }));

		expect(push).toHaveBeenCalledWith({ query: 'motCle=cuisinier&centresInteret=j%E2%80%98aime+bouger&page=1' }, undefined, { scroll: false });
	});

	it('affiche les filtres de la recherche en cours', () => {
		afficherLaPage(desResultats(), { centresInteret: 'j‘aime bouger' });

		expect(screen.getByRole('list', { name: 'Filtres de la recherche' })).toHaveTextContent('J‘aime bouger');
	});
});
