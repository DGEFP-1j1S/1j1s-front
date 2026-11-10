import '~/test-utils';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { anEvenementService } from '~/client/services/evenement/evenementService.fixture';
import PageEvenements from '~/pages/evenements/index.page';
import { createSuccess } from '~/server/errors/either';
import { ResultatsRechercheEvenement } from '~/server/evenements/domain/rechercheEvenement';

function desResultats(): ResultatsRechercheEvenement {
	return {
		nombreDeResultats: 1,
		resultats: [{
			dateDebut: '2022-12-01T08:00:00.000Z',
			dateFin: '2022-12-01T10:00:00.000Z',
			lieu: 'Paris',
			organismeOrganisateur: 'Agence France Travail',
			slug: 'forum-emploi',
			titre: 'Forum de l‘emploi',
		}],
	};
}

function afficherLaPage(resultats?: ResultatsRechercheEvenement, routerQuery = {}) {
	const push = vi.fn();
	mockUseRouter({ push, query: routerQuery });
	mockSmallScreen();
	const evenementService = anEvenementService({ rechercherLieux: vi.fn().mockResolvedValue(createSuccess(['Lyon'])) });
	const view = render(
		<DependenciesProvider analyticsService={aManualAnalyticsService()} evenementService={evenementService}>
			<PageEvenements resultats={resultats} />
		</DependenciesProvider>,
	);
	return { ...view, evenementService, push };
}

describe('<PageEvenements />', () => {
	beforeEach(() => {
		mockScrollIntoView();
	});

	describe('quand la recherche d‘évènements est désactivée', () => {
		beforeEach(() => {
			vi.stubEnv('NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE', '0');
		});
		afterEach(() => {
			vi.unstubAllEnvs();
		});

		it('n‘a pas de défaut d‘accessibilité', async () => {
			const { container } = afficherLaPage();

			await expect(container).toBeAccessible();
		});

		it('doit rendre du HTML respectant la specification', async () => {
			const { container } = afficherLaPage();

			expect(container.outerHTML).toHTMLValidate();
		});

		it('n‘affiche pas de formulaire de recherche', async () => {
			afficherLaPage();

			expect(screen.queryByRole('search')).not.toBeInTheDocument();
		});
	});

	describe('quand la recherche d‘évènements est activée', () => {
		beforeEach(() => {
			vi.stubEnv('NEXT_PUBLIC_RECHERCHE_EVENEMENT_FEATURE', '1');
		});
		afterEach(() => {
			vi.unstubAllEnvs();
		});

		async function afficherLaRecherche(routerQuery = {}) {
			const vue = afficherLaPage(desResultats(), routerQuery);
			// NOTE : on attend que les lieux proposés au chargement soient affichés
			await screen.findByRole('option', { hidden: true, name: 'Lyon' });
			return vue;
		}

		it('n‘a pas de défaut d‘accessibilité', async () => {
			const { container } = await afficherLaRecherche();

			await expect(container).toBeAccessible();
		});

		it('doit rendre du HTML respectant la specification', async () => {
			const { container } = await afficherLaRecherche();

			expect(container.outerHTML).toHTMLValidate();
		});

		it('affiche le nombre de résultats et les évènements reçus du serveur', async () => {
			await afficherLaRecherche();

			expect(screen.getByText('1 évènement')).toBeVisible();
			expect(screen.getByRole('link', { name: /Forum de l‘emploi/ })).toHaveAttribute('href', '/evenements/forum-emploi');
			expect(screen.getByText(/jeu\. 1 décembre de 09:00 à 11:00/)).toBeVisible();
		});

		it('à la soumission, met les critères de recherche dans l‘URL et revient à la première page', async () => {
			const user = userEvent.setup();
			const { push } = await afficherLaRecherche({ page: '2' });

			await user.type(screen.getByRole('textbox', { name: /Mot-clé/ }), 'cuisinier');
			await user.click(screen.getByRole('button', { name: 'Rechercher' }));

			expect(push).toHaveBeenCalledWith({ query: 'motCle=cuisinier&page=1' }, undefined, { scroll: false });
		});
	});
});
