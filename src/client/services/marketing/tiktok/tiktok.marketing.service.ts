import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";

declare global {
	interface Window {
		TiktokAnalyticsObject?: string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ttq?: any
	}
}

const METHODES = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function differer(cible: any, methode: string) {
	cible[methode] = function (...args: unknown[]) {
		cible.push([methode, ...args]);
	};
}

export class TiktokMarketingService {
	static readonly SERVICE_NAME = "tiktok1j1s";
	static readonly SCRIPT_URL = "https://analytics.tiktok.com/i18n/pixel/events.js";
	static readonly PIXEL_ID = "C8JO5PDMP02EUPVMH92G";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(TiktokMarketingService.SERVICE_NAME, {
			cookies: ["_ttp", "_tt_enable_cookie", "ttcsid"],
			js: function () {
				"use strict";
				if (!estSurPageCibleCampagne2026_11()) {
					return;
				}
				if (!window.ttq) {
					const pixelId = TiktokMarketingService.PIXEL_ID;
					window.TiktokAnalyticsObject = "ttq";
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const ttq: any = [];
					ttq.methods = METHODES;
					METHODES.forEach((methode) => differer(ttq, methode));
					ttq.instance = function (id: string) {
						const instance = ttq._i[id] || [];
						METHODES.forEach((methode) => differer(instance, methode));
						return instance;
					};
					ttq._i = { [pixelId]: [] };
					ttq._i[pixelId]._u = TiktokMarketingService.SCRIPT_URL;
					ttq._t = { [pixelId]: Date.now() };
					ttq._o = { [pixelId]: {} };
					window.ttq = ttq;
					window.tarteaucitron.addScript(`${TiktokMarketingService.SCRIPT_URL}?sdkid=${pixelId}&lib=ttq`);
				}
				window.ttq.page();
			},
			key: TiktokMarketingService.SERVICE_NAME,
			name: "TikTok Pixel",
			needConsent: true,
			type: "ads",
			uri: "https://www.tiktok.com/legal/page/global/cookie-policy/fr",
		});
	}
}
