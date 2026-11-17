import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";

declare global {
	interface Window {
		_linkedin_partner_id?: string
		_linkedin_data_partner_ids?: string[]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		lintrk?: any
	}
}

export class LinkedinMarketingService {
	static readonly SERVICE_NAME = "linkedin";
	static readonly SCRIPT_URL = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
	static readonly PARTNER_ID = "1489890";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(LinkedinMarketingService.SERVICE_NAME, {
			cookies: ["li_sugr", "bcookie", "lidc", "UserMatchHistory", "AnalyticsSyncHistory", "li_fat_id"],
			js: function () {
				"use strict";
				if (!estSurPageCibleCampagne2026_11() || window.lintrk) {
					return;
				}
				window._linkedin_partner_id = LinkedinMarketingService.PARTNER_ID;
				window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
				window._linkedin_data_partner_ids.push(LinkedinMarketingService.PARTNER_ID);
				const lintrk = function (a: unknown, b: unknown) {
					lintrk.q.push([a, b]);
				};
				lintrk.q = [] as unknown[][];
				window.lintrk = lintrk;
				window.tarteaucitron.addScript(LinkedinMarketingService.SCRIPT_URL);
			},
			key: LinkedinMarketingService.SERVICE_NAME,
			name: "LinkedIn Insight Tag",
			needConsent: true,
			type: "ads",
			uri: "https://fr.linkedin.com/legal/cookie-policy",
		});
	}
}
