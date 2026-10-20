import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { StackAdaptMarketingService } from "./stackadapt.marketing.service";

describe("StackAdaptMarketingService", () => {
	beforeEach(() => {
		window.saq = undefined;
		window._saq = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	it("charge le script une seule fois et envoie le retargeting et la conversion à chaque exécution", () => {
		// GIVEN
		const cookiesService = aCookiesService();
		new StackAdaptMarketingService(cookiesService);
		const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };

		// WHEN
		config.js();
		config.js();

		// THEN
		expect(cookiesService.addService).toHaveBeenCalledWith("stackadapt", expect.objectContaining({ key: "stackadapt", needConsent: true, type: "ads" }));
		expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
		expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://tags.srv.stackadapt.com/events.js");
		expect(window.saq.queue).toEqual([
			["rt", "XzQuJ7NAHjZOZzvzlF4O9y"],
			["conv", "Pc2cmRve2H3kgsqFR4Pxcq"],
			["rt", "XzQuJ7NAHjZOZzvzlF4O9y"],
			["conv", "Pc2cmRve2H3kgsqFR4Pxcq"],
		]);
	});
});
