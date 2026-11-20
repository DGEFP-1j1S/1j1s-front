import '~/test-utils';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { HeadMock } from '~/client/components/head.mock';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import RechercherFicheMetierPage from '~/pages/decouvrir-les-metiers/index.page';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { ResultatsRechercheFicheMetier } from '~/server/fiche-metier/domain/rechercheFicheMetier';

vi.mock('next/head', () => ({ default: HeadMock }));

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

	describe('titre de la page', () => {
		it('reprend le titre par défaut quand aucune recherche n‘est lancée', () => {
			afficherLaPage();

			expect(document.title).toBe('Rechercher un métier | 1jeune1solution');
		});

		it('indique la page courante quand on parcourt les résultats sans critère', () => {
			afficherLaPage({ ...desResultats(), nombreDeResultats: 792 }, { page: '2' });

			expect(document.title).toBe('792 fiches métier (page 2/53) | 1jeune1solution');
		});

		it('reprend le nombre de résultats et le mot-clé de la recherche', () => {
			afficherLaPage({ ...desResultats(), nombreDeResultats: 4 }, { centresInteret: 'j‘aime bouger', motCle: 'cuisinier' });

			expect(document.title).toBe('4 fiches métier pour cuisinier | 1jeune1solution');
		});

		it('indique qu‘il n‘y a aucun résultat', () => {
			afficherLaPage({ ...desResultats(), nombreDeResultats: 0, resultats: [] }, { motCle: 'astronaute' });

			expect(document.title).toBe('Aucune fiche métier pour astronaute | 1jeune1solution');
		});

		it('indique une erreur quand la demande est incorrecte', () => {
			mockUseRouter({ query: { motCle: 'cuisinier' } });
			mockSmallScreen();
			render(
				<DependenciesProvider analyticsService={aManualAnalyticsService()}>
					<RechercherFicheMetierPage erreurRecherche={ErreurMetier.DEMANDE_INCORRECTE} />
				</DependenciesProvider>,
			);

			expect(document.title).toBe('Erreur : Rechercher un métier | 1jeune1solution');
		});
	});
});
