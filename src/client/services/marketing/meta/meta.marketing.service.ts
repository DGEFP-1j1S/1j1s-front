import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fbq?: any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_fbq?: any
	}
}

export class MetaMarketingService {
	static readonly SERVICE_NAME = "metapixel";
	static readonly SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";
	static readonly PIXEL_ID = "523325854541523";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(MetaMarketingService.SERVICE_NAME, {
			cookies: ["_fbp", "fr"],
			js: function () {
				"use strict";
				if (!estSurPageCibleCampagne2026_11()) {
					return;
				}
				if (!window.fbq) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const fbq: any = function (...args: unknown[]) {
						if (fbq.callMethod) {
							fbq.callMethod(...args);
						} else {
							fbq.queue.push(args);
						}
					};
					fbq.push = fbq;
					fbq.loaded = true;
					fbq.version = "2.0";
					fbq.queue = [];
					window.fbq = fbq;
					window._fbq = window._fbq || fbq;
					window.tarteaucitron.addScript(MetaMarketingService.SCRIPT_URL);
				}
				window.fbq("init", MetaMarketingService.PIXEL_ID);
				window.fbq("track", "PageView");
			},
			key: MetaMarketingService.SERVICE_NAME,
			name: "Meta Pixel",
			needConsent: true,
			type: "ads",
			uri: "https://www.facebook.com/privacy/policies/cookies/",
		});
	}
}
