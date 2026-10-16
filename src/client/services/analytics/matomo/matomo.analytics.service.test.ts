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
});
