import { CookiesService } from "~/client/services/cookies/cookies.service";

import { loadGtag, sendGtagConversion } from "../gtag/gtag";

export class FloodlightMarketingService {
	static readonly SERVICE_NAME = "floodlight";
	static readonly ACCOUNT_ID = "DC-3048978";
	static readonly TOUTES_PAGES = "DC-3048978/appre0/2026-0+unique";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(FloodlightMarketingService.SERVICE_NAME, {
			cookies: ["_gcl_au", "IDE", "test_cookie"],
			js: function () {
				"use strict";
				loadGtag(FloodlightMarketingService.ACCOUNT_ID);
				sendGtagConversion(FloodlightMarketingService.TOUTES_PAGES);
			},
			key: FloodlightMarketingService.SERVICE_NAME,
			name: "Google Campaign Manager",
			needConsent: true,
			type: "ads",
			uri: "https://policies.google.com/technologies/cookies",
		});
	}
}
