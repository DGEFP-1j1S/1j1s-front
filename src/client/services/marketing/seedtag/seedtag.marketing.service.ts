import { CookiesService } from "~/client/services/cookies/cookies.service";

import { loadGtag, sendGtagConversion } from "../gtag/gtag";

export class SeedtagMarketingService {
	static readonly SERVICE_NAME = "seedtag";
	static readonly ACCOUNT_ID = "DC-10089018";
	static readonly TOUTES_PAGES = "DC-10089018/invmedia/fr_ga00a+standard";
	static readonly PAGE_ACCUEIL = "DC-10089018/invmedia/fr_ga00-+standard";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(SeedtagMarketingService.SERVICE_NAME, {
			cookies: ["_gcl_au", "IDE", "test_cookie"],
			js: function () {
				"use strict";
				loadGtag(SeedtagMarketingService.ACCOUNT_ID);
				const u2 = window.location.href;
				sendGtagConversion(SeedtagMarketingService.TOUTES_PAGES, { u2 });
				if (window.location.pathname === "/") {
					sendGtagConversion(SeedtagMarketingService.PAGE_ACCUEIL, { u2 });
				}
			},
			key: SeedtagMarketingService.SERVICE_NAME,
			name: "Seedtag",
			needConsent: true,
			type: "ads",
			uri: "https://www.seedtag.com/fr/cookies-policy/",
		});
	}
}
