import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { AmnetMarketingService } from "./amnet.marketing.service";

function conversionsEnvoyees() {
	return window.dataLayer
		.map((args) => Array.from(args))
		.filter((args) => args[0] === "event")
		.map((args) => args[2].send_to);
}

function comptesConfigures() {
	return window.dataLayer
		.map((args) => Array.from(args))
		.filter((args) => args[0] === "config")
		.map((args) => args[1]);
}

function lancerLeService() {
	const cookiesService = aCookiesService();
	new AmnetMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("AmnetMarketingService", () => {
	beforeEach(() => {
		window.gtag = undefined;
		window.dataLayer = [];
		window.tarteaucitron = aTarteAuCitron();
	});

	it("déclare le service amnet et charge gtag sur toutes les pages", () => {
		// GIVEN
		window.history.pushState({}, "", "/emplois");

		// WHEN
		const cookiesService = lancerLeService();

		// THEN
		expect(cookiesService.addService).toHaveBeenCalledWith("amnet", expect.objectContaining({ key: "amnet", needConsent: true, type: "ads" }));
		expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://www.googletagmanager.com/gtag/js?id=DC-3988071");
		expect(comptesConfigures()).toEqual(["DC-3988071", "DC-18216702"]);
		expect(conversionsEnvoyees()).toEqual([]);
	});

	describe("lorsque l'utilisateur est sur la page d'accueil", () => {
		it("envoie la conversion de la page cible", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			lancerLeService();

			// THEN
			expect(conversionsEnvoyees()).toEqual(["DC-3988071/invmedia/2026-0+standard", "DC-18216702/dicom0/dicom_mk+standard"]);
		});
	});
});
