import { CookiesService } from '~/client/services/cookies/cookies.service';

import { MarketingService } from '../marketing.service';

export class LinkedinMarketingService implements MarketingService {
	private static PARTNER_ID = '1489890';
	private readonly cookiesService: CookiesService;

	constructor(cookiesService: CookiesService) {
		this.cookiesService = cookiesService;
		this.cookiesService.addService('linkedin-custom', {
			cookies: [],
			js: function () {
				'use strict';
				// @ts-expect-error TS2339
				window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
				// @ts-expect-error TS2339
				window._linkedin_data_partner_ids.push(LinkedinMarketingService.PARTNER_ID);
				(function (l) {
					if (!l) {
						// @ts-expect-error TS2339
						window.lintrk = function (a, b) {
							// @ts-expect-error TS2339
							window.lintrk.q.push([a, b]);
						};
						// @ts-expect-error TS2339
						window.lintrk.q = [];
					}
					// @ts-expect-error TS2339
					window.tarteaucitron.addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
					// @ts-expect-error TS2339
				})(window.lintrk);
			},
			key: 'linkedin-custom',
			name: 'LinkedIn',
			needConsent: true,
			type: 'ads',
			uri: 'https://fr.linkedin.com/legal/cookie-policy',
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	trackPage(_pagename: string): void {
	}
}
