import '~/test-utils';

import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { anOffreDeStageIndexee } from '~/client/components/features/OffreDeStage/offreDeStageIndexee.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockScrollIntoView, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { aStageService } from '~/client/services/stage/stageService.fixture';
import RechercherOffreStagePage from '~/pages/stages/index.page';
import { createSuccess } from '~/server/errors/either';
import { ResultatsRechercheOffreStage } from '~/server/stages/domain/rechercheOffreStage';

function desResultats(): ResultatsRechercheOffreStage {
	return {
		facettes: {
			domaines: [{ nombre: 3, valeur: 'audit' }, { nombre: 1, valeur: 'conseil' }],
			durees: [{ nombre: 2, valeur: '2 mois' }, { nombre: 2, valeur: '< 1 mois' }],
		},
		nombreDeResultats: 1,
		resultats: [anOffreDeStageIndexee({ slug: 'stage-audit', titre: 'Stage en audit' })],
	};
}

// NOTE : async pour attendre le chargement initial des localisations proposées
async function renderPage(resultats = desResultats(), routerQuery = {}, localisationsProposees: Array<string> = []) {
	const push = vi.fn();
	mockUseRouter({ push, query: routerQuery });
	mockSmallScreen();
	const stageService = aStageService({ rechercherLocalisations: vi.fn().mockResolvedValue(createSuccess(localisationsProposees)) });
	const view = render(
		<DependenciesProvider
			analyticsService={aManualAnalyticsService()}
			dateService={aDateService()}
			stageService={stageService}>
			<RechercherOffreStagePage resultats={resultats} />
		</DependenciesProvider>,
	);
	await waitFor(() => expect(stageService.rechercherLocalisations).toHaveBeenCalledWith(''));
	return { ...view, push };
}

describe('<RechercherOffreStagePage />', () => {
	beforeEach(() => {
		mockScrollIntoView();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = await renderPage();

		await expect(container).toBeAccessible();
	});

	it('doit rendre du HTML respectant la specification', async () => {
		const { container } = await renderPage();

		await screen.findByText('Des milliers d‘offres de stages sélectionnées pour vous');

		expect(container.outerHTML).toHTMLValidate();
	});

	it('affiche le nombre de résultats et les offres reçues du serveur', async () => {
		await renderPage();

		expect(screen.getByText('1 offre de stage')).toBeVisible();
		expect(screen.getByRole('link', { name: /Stage en audit/ })).toHaveAttribute('href', '/stages/stage-audit');
	});

	it('propose les domaines et les durées issus des facettes, triés', async () => {
		const user = userEvent.setup();
		await renderPage();

		await user.click(screen.getByRole('combobox', { name: 'Durée de stage' }));

		const durees = screen.getAllByRole('option').map((option) => option.textContent);
		expect(durees).toStrictEqual(['< 1 mois', '2 mois']);
	});

	it('à la soumission, met les critères de recherche dans l‘URL et revient à la première page', async () => {
		const user = userEvent.setup();
		const { push } = await renderPage(desResultats(), { page: '3' });

		await user.type(screen.getByRole('textbox', { name: /Métiers, mots clés/ }), 'juriste');
		await user.click(screen.getByRole('combobox', { name: 'Domaines' }));
		await user.click(screen.getByRole('option', { name: 'Audit' }));
		await user.click(screen.getByRole('button', { name: 'Rechercher' }));

		expect(push).toHaveBeenCalledWith({ query: 'motCle=juriste&domaines=audit&page=1' }, undefined, { scroll: false });
	});

	it('affiche les filtres de la recherche en cours', async () => {
		await renderPage(desResultats(), { domaines: 'audit', localisations: 'Paris' });

		const filtres = screen.getByRole('list', { name: 'Filtres de la recherche' });
		expect(filtres).toHaveTextContent('Paris');
		expect(filtres).toHaveTextContent('Audit');
	});

	describe('quand une localisation contient une virgule', () => {
		it('la met dans l‘URL comme une seule valeur, en répétant le paramètre pour chaque localisation', async () => {
			const user = userEvent.setup();
			const { push } = await renderPage(desResultats(), {}, ['Lyon, Part-Dieu', 'Paris']);
			await screen.findByRole('option', { hidden: true, name: 'Lyon, Part-Dieu' });

			await user.click(screen.getByRole('combobox', { name: /Localisation/ }));
			await user.click(screen.getByRole('option', { name: 'Lyon, Part-Dieu' }));
			await user.click(screen.getByRole('option', { name: 'Paris' }));
			await user.click(screen.getByRole('button', { name: 'Rechercher' }));

			expect(push).toHaveBeenCalledWith({ query: 'localisations=Lyon%2C+Part-Dieu&localisations=Paris&page=1' }, undefined, { scroll: false });
		});

		it('la relit dans l‘URL comme une seule valeur', async () => {
			await renderPage(desResultats(), { localisations: 'Lyon, Part-Dieu' });

			const filtres = screen.getByRole('list', { name: 'Filtres de la recherche' });
			expect(within(filtres).getAllByRole('listitem')).toHaveLength(1);
			expect(filtres).toHaveTextContent('Lyon, Part-Dieu');
		});
	});
});
