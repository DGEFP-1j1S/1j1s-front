import '~/test-utils';

import { render, screen } from '@testing-library/react';

import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import ApplicationMobilePage, { getServerSideProps } from '~/pages/application-mobile/index.page';

function afficherLaPage(estLive: boolean) {
	mockSmallScreen();
	return render(
		<DependenciesProvider analyticsService={aManualAnalyticsService()}>
			<ApplicationMobilePage estLive={estLive} />
		</DependenciesProvider>,
	);
}

describe('<ApplicationMobilePage />', () => {
	describe.each([
		['avant le lancement', false, 'Bientôt disponible sur App Store et Google Play !'],
		['une fois l‘application disponible', true, "Télécharge l’application dès maintenant !"],
	])('%s', (_, estLive, titre) => {
		it('affiche la version correspondante', () => {
			afficherLaPage(estLive);

			expect(screen.getByText(titre)).toBeVisible();
		});

		it('n‘a pas de défaut d‘accessibilité', async () => {
			const { container } = afficherLaPage(estLive);

			await expect(container).toBeAccessible();
		});

		it('doit rendre du HTML respectant la specification', () => {
			const { container } = afficherLaPage(estLive);

			expect(container.outerHTML).toHTMLValidate();
		});
	});
});

describe('getServerSideProps', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it.each([
		['1', true],
		['0', false],
		['true', false],
		[undefined, false],
	])('avec NEXT_PUBLIC_APP_MOBILE_1J1S_LIVE=%s, estLive vaut %s', async (valeur, estLive) => {
		if (valeur === undefined) {
			vi.stubEnv('NEXT_PUBLIC_APP_MOBILE_1J1S_LIVE', undefined);
		} else {
			vi.stubEnv('NEXT_PUBLIC_APP_MOBILE_1J1S_LIVE', valeur);
		}

		const resultat = await getServerSideProps();

		expect(resultat).toStrictEqual({ props: { estLive } });
	});
});
