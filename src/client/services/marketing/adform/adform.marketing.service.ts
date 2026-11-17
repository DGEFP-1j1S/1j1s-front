import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";

declare global {
	interface Window {
		_adftrack?: unknown
	}
}

export interface CampagnesAdform {
	campagne2026_10: boolean
	campagne2026_11: boolean
}

export class AdformMarketingService {
	static readonly SERVICE_NAME = "adform";
	static readonly SCRIPT_URL = "https://s2.adform.net/banners/scripts/st/trackpoint-async.js";
	static readonly CLIENT_ID_1J1S = 2867419;
	static readonly PAGENAME = "2026-10-1jeune1solution.gouv.fr-PageArrivee-PageArrivee";
	static readonly PAGENAME_2026_11 = "2026-08-1jeune1solution.gouv.fr-PageArrivee-PageAriveeLaSecuriteDesSalaries";

	constructor(cookiesService: CookiesService, campagnes: CampagnesAdform) {
		cookiesService.addService(AdformMarketingService.SERVICE_NAME, {
			cookies: [],
			js: function () {
				"use strict";
				const pagenames: string[] = [];
				if (campagnes.campagne2026_10) {
					pagenames.push(AdformMarketingService.PAGENAME);
				}
				if (campagnes.campagne2026_11 && estSurPageCibleCampagne2026_11()) {
					pagenames.push(AdformMarketingService.PAGENAME_2026_11);
				}
				if (pagenames.length === 0) {
					return;
				}
				const adftrack = Array.isArray(window._adftrack) ? window._adftrack : (window._adftrack ? [window._adftrack] : []);
				pagenames.forEach((pagename) => adftrack.push({
					HttpHost: "server.adform.net",
					divider: encodeURIComponent("|"),
					pagename: encodeURIComponent(pagename),
					pm: AdformMarketingService.CLIENT_ID_1J1S,
				}));
				window._adftrack = adftrack;
				window.tarteaucitron.addScript(AdformMarketingService.SCRIPT_URL);
			},
			key: AdformMarketingService.SERVICE_NAME,
			name: "Adform",
			needConsent: true,
			type: "ads",
			uri: "https://site.adform.com/privacy-center/website-privacy/website-cookie-policy/",
		});
	}
}
