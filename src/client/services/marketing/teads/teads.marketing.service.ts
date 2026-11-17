import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		zemApi?: any
	}
}

export class TeadsMarketingService {
	static readonly SERVICE_NAME = "teads";
	static readonly SCRIPT_URL = "https://js-tag.zemanta.com/zcpt.js";
	static readonly MARKETER_ID = "118693";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(TeadsMarketingService.SERVICE_NAME, {
			cookies: ["zuid", "zuid_b"],
			js: function () {
				"use strict";
				if (!estSurPageCibleCampagne2026_11()) {
					return;
				}
				if (!window.zemApi) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const zemApi: any = function (...args: unknown[]) {
						if (zemApi.dispatch) {
							zemApi.dispatch(...args);
						} else {
							zemApi.queue.push(args);
						}
					};
					zemApi.version = "1.0";
					zemApi.loaded = true;
					zemApi.marketerId = TeadsMarketingService.MARKETER_ID;
					zemApi.queue = [];
					window.zemApi = zemApi;
					window.tarteaucitron.addScript(TeadsMarketingService.SCRIPT_URL);
				}
				window.zemApi("track", "PAGE_VIEW");
			},
			key: TeadsMarketingService.SERVICE_NAME,
			name: "Teads (Outbrain)",
			needConsent: true,
			type: "ads",
			uri: "https://www.outbrain.com/privacy/cookies/",
		});
	}
}
