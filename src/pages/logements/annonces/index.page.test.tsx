import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import AnnoncesPage from '~/pages/logements/annonces/index.page';
import { ResultatsRechercheAnnonceDeLogement } from '~/server/logements/domain/rechercheAnnonceDeLogement';

function desResultats(): ResultatsRechercheAnnonceDeLogement {
	return {
		facettes: {
			typesBien: [{ nombre: 2, valeur: 'appartement' }],
			typesOffre: [{ nombre: 3, valeur: 'location' }],
		},
		nombreDeResultats: 1,
		resultats: [{
			dateDeDisponibilite: '2024-09-01',
			dateDeMiseAJour: '2024-08-01',
			devise: '€',
			imagesUrl: [],
			localisationAAfficher: 'Lyon (69001)',
			prix: 500,
			slug: 'studio-lyon',
			surfaceAAfficher: '20 m²',
			titre: 'Studio à Lyon',
			type: 'location',
			typeBien: 'appartement',
			url: 'https://www.immojeune.com/studio-lyon',
		}],
	};
}

function afficherLaPage(routerQuery = {}) {
	mockUseRouter({ query: routerQuery });
	mockSmallScreen();
	return render(
		<DependenciesProvider analyticsService={aManualAnalyticsService()} dateService={aDateService()} sessionStorageService={aStorageService()}>
			<AnnoncesPage resultats={desResultats()} />
		</DependenciesProvider>,
	);
}

describe('<AnnoncesPage />', () => {
	beforeEach(() => {
		vi.stubEnv('NEXT_PUBLIC_LOGEMENT_FEATURE', '1');
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

		await screen.findByText('Plus de 3 000 offres de logements étudiants et de locations jeune actif partout en France');

		expect(container.outerHTML).toHTMLValidate();
	});

	it('affiche le nombre de résultats et les annonces reçues du serveur', () => {
		afficherLaPage({ ville: 'Lyon' });

		expect(screen.getByText('1 annonce pour étudiants pour Lyon')).toBeVisible();
		expect(screen.getByRole('heading', { name: 'Studio à Lyon' })).toBeVisible();
	});

	it('affiche les filtres de la recherche en cours, dont les intervalles', () => {
		afficherLaPage({ prixMax: '600', surfaceMin: '20', typesBien: 'appartement' });

		const filtres = screen.getByRole('list', { name: 'Filtres de la recherche' });
		expect(filtres).toHaveTextContent('Appartement');
		expect(filtres).toHaveTextContent('A partir de 20 m²');
		expect(filtres).toHaveTextContent('Jusqu‘à 600 €');
	});

	it('affiche un service indisponible quand la recherche de logements est désactivée', () => {
		vi.stubEnv('NEXT_PUBLIC_LOGEMENT_FEATURE', '0');

		afficherLaPage();

		expect(screen.queryByRole('search')).not.toBeInTheDocument();
	});
});
