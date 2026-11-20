import { CookiesService } from "~/client/services/cookies/cookies.service";

import { estSurPageCibleCampagne2026_11 } from "../campagne-2026-11";
import { loadGtag, sendGtagConversion } from "../gtag/gtag";

export class AmnetMarketingService {
	static readonly SERVICE_NAME = "amnet";
	static readonly ACCOUNT_ID = "DC-3988071";
	static readonly PAGE_CIBLE = "DC-3988071/invmedia/2026-0+standard";
	static readonly ACCOUNT_ID_DV360 = "DC-18216702";
	static readonly PAGE_CIBLE_DV360 = "DC-18216702/dicom0/dicom_mk+standard";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(AmnetMarketingService.SERVICE_NAME, {
			cookies: ["_gcl_au", "IDE", "test_cookie"],
			js: function () {
				"use strict";
				loadGtag(AmnetMarketingService.ACCOUNT_ID);
				loadGtag(AmnetMarketingService.ACCOUNT_ID_DV360);
				if (estSurPageCibleCampagne2026_11()) {
					sendGtagConversion(AmnetMarketingService.PAGE_CIBLE);
					sendGtagConversion(AmnetMarketingService.PAGE_CIBLE_DV360);
				}
			},
			key: AmnetMarketingService.SERVICE_NAME,
			name: "Amnet (Google Campaign Manager)",
			needConsent: true,
			type: "ads",
			uri: "https://policies.google.com/technologies/cookies?hl=fr",
		});
	}
}
