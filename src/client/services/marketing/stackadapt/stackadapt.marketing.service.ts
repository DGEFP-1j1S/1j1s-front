import { CookiesService } from "~/client/services/cookies/cookies.service";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		saq?: any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_saq?: any
	}
}

export class StackAdaptMarketingService {
	static readonly SERVICE_NAME = "stackadapt";
	static readonly SCRIPT_URL = "https://tags.srv.stackadapt.com/events.js";
	static readonly RETARGETING_ID = "XzQuJ7NAHjZOZzvzlF4O9y";
	static readonly CONVERSION_ID = "Pc2cmRve2H3kgsqFR4Pxcq";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(StackAdaptMarketingService.SERVICE_NAME, {
			cookies: ["sa-user-id", "sa-user-id-v2", "sa-user-id-v3", "sa-camp-*"],
			js: function () {
				"use strict";
				if (!window.saq) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const saq: any = function (...args: unknown[]) {
						if (saq.callMethod) {
							saq.callMethod(...args);
						} else {
							saq.queue.push(args);
						}
					};
					saq.push = saq;
					saq.loaded = true;
					saq.version = "1.0";
					saq.queue = [];
					window.saq = saq;
					window._saq = saq;
					window.tarteaucitron.addScript(StackAdaptMarketingService.SCRIPT_URL);
				}
				window.saq("rt", StackAdaptMarketingService.RETARGETING_ID);
				window.saq("conv", StackAdaptMarketingService.CONVERSION_ID);
			},
			key: StackAdaptMarketingService.SERVICE_NAME,
			name: "StackAdapt (Manageo)",
			needConsent: true,
			type: "ads",
			uri: "https://www.stackadapt.com/legal-document-centre/platform-and-services-privacy-policy",
		});
	}
}
