import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

const GTAG_URL = "https://www.googletagmanager.com/gtag/js?id=";

function dataLayerCalls() {
	return window.dataLayer.map((args) => Array.from(args));
}

describe("gtag", () => {
	let gtag: typeof import("./gtag");

	beforeEach(async () => {
		vi.resetModules();
		window.gtag = undefined;
		window.dataLayer = [];
		window.tarteaucitron = aTarteAuCitron();
		gtag = await import("./gtag");
	});

	describe("loadGtag", () => {
		it("charge le script gtag une seule fois même pour plusieurs comptes", () => {
			// WHEN
			gtag.loadGtag("DC-1");
			gtag.loadGtag("DC-2");

			// THEN
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith(GTAG_URL + "DC-1");
		});

		it("configure chaque compte une seule fois", () => {
			// WHEN
			gtag.loadGtag("DC-1");
			gtag.loadGtag("DC-1");
			gtag.loadGtag("DC-2");

			// THEN
			const configs = dataLayerCalls().filter((args) => args[0] === "config");
			expect(configs).toEqual([["config", "DC-1"], ["config", "DC-2"]]);
		});
	});

	describe("sendGtagConversion", () => {
		it("pousse l'événement de conversion dans le dataLayer", () => {
			// GIVEN
			gtag.loadGtag("DC-1");

			// WHEN
			gtag.sendGtagConversion("DC-1/type/cat+standard", { u2: "https://exemple.fr" });

			// THEN
			expect(dataLayerCalls()).toContainEqual(["event", "conversion", {
				allow_custom_scripts: true,
				send_to: "DC-1/type/cat+standard",
				u2: "https://exemple.fr",
			}]);
		});
	});
});
