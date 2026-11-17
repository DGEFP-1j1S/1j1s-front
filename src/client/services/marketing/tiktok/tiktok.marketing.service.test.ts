import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { TiktokMarketingService } from "./tiktok.marketing.service";

function lancerLeService() {
	const cookiesService = aCookiesService();
	new TiktokMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("TiktokMarketingService", () => {
	beforeEach(() => {
		window.ttq = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("déclare le service, charge le script et envoie la page vue", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			const cookiesService = lancerLeService();

			// THEN
			expect(cookiesService.addService).toHaveBeenCalledWith("tiktok", expect.objectContaining({ key: "tiktok", needConsent: true, type: "ads" }));
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=C8JO5PDMP02EUPVMH92G&lib=ttq");
			expect(Array.from(window.ttq)).toEqual([["page"]]);
		});
	});

	describe("lorsque l'utilisateur est sur une autre page", () => {
		it("ne fait rien", () => {
			// GIVEN
			window.history.pushState({}, "", "/emplois");

			// WHEN
			lancerLeService();

			// THEN
			expect(window.tarteaucitron.addScript).not.toHaveBeenCalled();
			expect(window.ttq).toBeUndefined();
		});
	});
});
