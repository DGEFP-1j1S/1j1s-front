import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { SnapchatMarketingService } from "./snapchat.marketing.service";

function lancerLeService() {
	const cookiesService = aCookiesService();
	new SnapchatMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("SnapchatMarketingService", () => {
	beforeEach(() => {
		window.snaptr = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("déclare le service, charge le script et envoie la page vue", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			const cookiesService = lancerLeService();

			// THEN
			expect(cookiesService.addService).toHaveBeenCalledWith("snapchat1j1s", expect.objectContaining({ key: "snapchat1j1s", needConsent: true, type: "ads" }));
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://sc-static.net/scevent.min.js");
			expect(window.snaptr.queue).toEqual([["init", "d48efe29-caa9-4f0c-86e8-353fc35a8b3f", {}], ["track", "PAGE_VIEW"]]);
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
			expect(window.snaptr).toBeUndefined();
		});
	});
});
