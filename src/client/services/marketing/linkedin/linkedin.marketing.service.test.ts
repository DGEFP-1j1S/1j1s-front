import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { LinkedinMarketingService } from "./linkedin.marketing.service";

function lancerLeService() {
	const cookiesService = aCookiesService();
	new LinkedinMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("LinkedinMarketingService", () => {
	beforeEach(() => {
		window.lintrk = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("déclare le service, charge le script et envoie la page vue", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			const cookiesService = lancerLeService();

			// THEN
			expect(cookiesService.addService).toHaveBeenCalledWith("linkedin", expect.objectContaining({ key: "linkedin", needConsent: true, type: "ads" }));
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://snap.licdn.com/li.lms-analytics/insight.min.js");
			expect(window._linkedin_data_partner_ids).toContain("1489890");
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
			expect(window.lintrk).toBeUndefined();
		});
	});
});
