import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { TeadsMarketingService } from "./teads.marketing.service";

function lancerLeService() {
	const cookiesService = aCookiesService();
	new TeadsMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("TeadsMarketingService", () => {
	beforeEach(() => {
		window.zemApi = undefined;
		window.__$$OBGeoZone = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("déclare le service, charge le script et envoie la page vue", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			const cookiesService = lancerLeService();

			// THEN
			expect(cookiesService.addService).toHaveBeenCalledWith("teads", expect.objectContaining({ key: "teads", needConsent: true, type: "ads" }));
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://js-tag.zemanta.com/zcpt.js");
			expect(window.zemApi.queue).toEqual([["track", "PAGE_VIEW"]]);
			expect(window.__$$OBGeoZone).toEqual("all");
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
			expect(window.zemApi).toBeUndefined();
			expect(window.__$$OBGeoZone).toBeUndefined();
		});
	});
});
