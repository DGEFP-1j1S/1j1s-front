import { CookiesService } from '~/client/services/cookies/cookies.service';

import { AnalyticsService } from '../analytics.service';

export class MatomoAnalyticsService implements AnalyticsService {
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
}
