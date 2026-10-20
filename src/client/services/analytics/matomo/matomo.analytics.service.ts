import { CookiesService } from '~/client/services/cookies/cookies.service';

import { EvenementAnalytics } from "../analytics";
import { AnalyticsService, EvenementAnalyticsService } from "../analytics.service";

declare global {
	interface Window {
		_paq?: Array<Array<unknown>>
	}
}

export class MatomoAnalyticsService implements AnalyticsService, EvenementAnalyticsService {
	private static MATOMO_SERVICE = 'matomocloud';
	private readonly cookiesService: CookiesService;

	constructor(cookiesService: CookiesService) {
		this.cookiesService = cookiesService;
		this.cookiesService.addUser('matomoId', process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_SITE_ID);
		this.cookiesService.addUser('matomoHost', process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_HOST);
		this.cookiesService.addUser('matomoCustomJSPath', process.env.NEXT_PUBLIC_ANALYTICS_MATOMO_CUSTOM_JS_PATH);
		this.cookiesService.addUser('matomoFullTracking', true);
		this.cookiesService.addService(MatomoAnalyticsService.MATOMO_SERVICE);
	}

	isAllowed(): boolean {
		return this.cookiesService.isServiceAllowed(MatomoAnalyticsService.MATOMO_SERVICE);
	}

	envoyerEvenement({ categorie, action, nom }: EvenementAnalytics): void {
		// NOTE : la file _paq est consommee par matomo.js une fois charge (avec ou sans consentement cookies)
		window._paq = window._paq || [];
		window._paq.push(["trackEvent", categorie, action, nom]);
	}
}
