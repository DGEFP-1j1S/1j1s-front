import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		snaptr?: any
	}
}

export class SnapchatMarketingService {
	static readonly SERVICE_NAME = "snapchat";
	static readonly SCRIPT_URL = "https://sc-static.net/scevent.min.js";
	static readonly PIXEL_ID = "d48efe29-caa9-4f0c-86e8-353fc35a8b3f";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(SnapchatMarketingService.SERVICE_NAME, {
			cookies: ["_scid", "_scid_r", "_sctr", "sc_at"],
			js: function () {
				"use strict";
				if (!estSurPageCibleCampagne2026_11()) {
					return;
				}
				if (!window.snaptr) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const snaptr: any = function (...args: unknown[]) {
						if (snaptr.handleRequest) {
							snaptr.handleRequest(...args);
						} else {
							snaptr.queue.push(args);
						}
					};
					snaptr.queue = [];
					window.snaptr = snaptr;
					window.tarteaucitron.addScript(SnapchatMarketingService.SCRIPT_URL);
				}
				window.snaptr("init", SnapchatMarketingService.PIXEL_ID, {});
				window.snaptr("track", "PAGE_VIEW");
			},
			key: SnapchatMarketingService.SERVICE_NAME,
			name: "Snapchat",
			needConsent: true,
			type: "ads",
			uri: "https://values.snap.com/fr-FR/privacy/cookie-policy",
		});
	}
}
