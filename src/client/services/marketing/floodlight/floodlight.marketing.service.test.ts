import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { FloodlightMarketingService } from "./floodlight.marketing.service";

describe("FloodlightMarketingService", () => {
	beforeEach(() => {
		window.gtag = undefined;
		window.dataLayer = [];
		window.tarteaucitron = aTarteAuCitron();
	});

	it("envoie la conversion toutes pages à chaque exécution du service", () => {
		// GIVEN
		const cookiesService = aCookiesService();
		new FloodlightMarketingService(cookiesService);
		const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };

		// WHEN
		config.js();
		config.js();

		// THEN
		expect(cookiesService.addService).toHaveBeenCalledWith("floodlight", expect.objectContaining({ key: "floodlight", needConsent: true, type: "ads" }));
		expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
		const conversions = window.dataLayer
			.map((args) => Array.from(args))
			.filter((args) => args[0] === "event")
			.map((args) => args[2].send_to);
		expect(conversions).toEqual(["DC-3048978/appre0/2026-0+unique", "DC-3048978/appre0/2026-0+unique"]);
	});
});
