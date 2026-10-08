import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { SeedtagMarketingService } from "./seedtag.marketing.service";

function conversionsEnvoyees() {
	return window.dataLayer
		.map((args) => Array.from(args))
		.filter((args) => args[0] === "event")
		.map((args) => args[2].send_to);
}

function lancerLeService() {
	const cookiesService = aCookiesService();
	new SeedtagMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("SeedtagMarketingService", () => {
	beforeEach(() => {
		window.gtag = undefined;
		window.dataLayer = [];
		window.tarteaucitron = aTarteAuCitron();
	});

	it("déclare le service seedtag auprès du gestionnaire de cookies", () => {
		// WHEN
		const cookiesService = lancerLeService();

		// THEN
		expect(cookiesService.addService).toHaveBeenCalledWith("seedtag", expect.objectContaining({
			key: "seedtag",
			needConsent: true,
			type: "ads",
		}));
		expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://www.googletagmanager.com/gtag/js?id=DC-10089018");
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("envoie la conversion toutes pages et la conversion page d'accueil", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			lancerLeService();

			// THEN
			expect(conversionsEnvoyees()).toEqual([
				"DC-10089018/invmedia/fr_ga00a+standard",
				"DC-10089018/invmedia/fr_ga00-+standard",
			]);
		});
	});

	describe("lorsque l'utilisateur est sur une autre page", () => {
		it("envoie uniquement la conversion toutes pages", () => {
			// GIVEN
			window.history.pushState({}, "", "/emplois");

			// WHEN
			lancerLeService();

			// THEN
			expect(conversionsEnvoyees()).toEqual(["DC-10089018/invmedia/fr_ga00a+standard"]);
		});
	});
});
