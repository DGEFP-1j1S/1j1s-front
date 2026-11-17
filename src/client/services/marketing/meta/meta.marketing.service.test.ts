import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { MetaMarketingService } from "./meta.marketing.service";

function lancerLeService() {
	const cookiesService = aCookiesService();
	new MetaMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("MetaMarketingService", () => {
	beforeEach(() => {
		window.fbq = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("déclare le service, charge le script et envoie la page vue", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			const cookiesService = lancerLeService();

			// THEN
			expect(cookiesService.addService).toHaveBeenCalledWith("metapixel", expect.objectContaining({ key: "metapixel", needConsent: true, type: "ads" }));
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://connect.facebook.net/en_US/fbevents.js");
			expect(window.fbq.queue).toEqual([["init", "523325854541523"], ["track", "PageView"]]);
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
			expect(window.fbq).toBeUndefined();
		});
	});
});
