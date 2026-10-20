import { CookiesService } from "~/client/services/cookies/cookies.service";

declare global {
	interface Window {
		GbTagBuilder?: { build: (id: string) => { fire: () => void } }
	}
}

export class GoldenBeesMarketingService {
	static readonly SERVICE_NAME = "goldenbees";
	static readonly SCRIPT_URL = "https://cdn.goldenbees.fr/proxy?url=http%3A%2F%2Fstatic.goldenbees.fr%2Fcdn%2Fjs%2Fgtag%2Fgoldentag-min.js&attachment=0";
	static readonly TAG_ID = "z5p34h";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(GoldenBeesMarketingService.SERVICE_NAME, {
			cookies: [],
			js: function () {
				"use strict";
				const fire = () => window.GbTagBuilder?.build(GoldenBeesMarketingService.TAG_ID).fire();
				if (window.GbTagBuilder) {
					fire();
				} else {
					window.tarteaucitron.addScript(GoldenBeesMarketingService.SCRIPT_URL, "", fire);
				}
			},
			key: GoldenBeesMarketingService.SERVICE_NAME,
			name: "GoldenBees",
			needConsent: true,
			type: "ads",
			uri: "https://www.goldenbees.fr/politique-cookies",
		});
	}
}
