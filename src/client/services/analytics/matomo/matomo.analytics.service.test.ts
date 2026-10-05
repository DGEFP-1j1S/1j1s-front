import { aCookiesService } from '~/client/services/cookies/cookies.service.fixture';

import { MatomoAnalyticsService } from './matomo.analytics.service';

describe('MatomoAnalyticsService', () => {
	process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_SITE_ID = 'site-id';
	process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_HOST = 'https://matomo.1j1s.fr/';
	process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_CUSTOM_JS_PATH = 'piwik.js';
	it('initialise le service matomo', () => {
		const cookiesService = aCookiesService();

		new MatomoAnalyticsService(cookiesService);

		expect(cookiesService.addService).toHaveBeenCalledWith('matomocloud');
		expect(cookiesService.addUser).toHaveBeenCalledWith('matomoId', 'site-id');
		expect(cookiesService.addUser).toHaveBeenCalledWith('matomoHost', 'https://matomo.1j1s.fr/');
		expect(cookiesService.addUser).toHaveBeenCalledWith('matomoCustomJSPath', 'piwik.js');
	});

	describe("envoyerEvenement", () => {
		afterEach(() => {
			delete window._paq;
		});

		it("ajoute un trackEvent dans la file _paq", () => {
			// GIVEN
			const matomoAnalyticsService = new MatomoAnalyticsService(aCookiesService());

			// WHEN
			matomoAnalyticsService.envoyerEvenement({ action: "clic", categorie: "accueil", nom: "bouton" });

			// THEN
			expect(window._paq).toEqual([["trackEvent", "accueil", "clic", "bouton"]]);
		});

		it("conserve les commandes deja presentes dans la file _paq", () => {
			// GIVEN
			window._paq = [["trackPageView"]];
			const matomoAnalyticsService = new MatomoAnalyticsService(aCookiesService());

			// WHEN
			matomoAnalyticsService.envoyerEvenement({ action: "clic", categorie: "accueil", nom: "bouton" });

			// THEN
			expect(window._paq).toEqual([["trackPageView"], ["trackEvent", "accueil", "clic", "bouton"]]);
		});
	});
});
