import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { AdformMarketingService, CampagnesAdform } from "./adform.marketing.service";

function lancerLeService(campagnes: CampagnesAdform) {
	const cookiesService = aCookiesService();
	new AdformMarketingService(cookiesService, campagnes);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

function pagenamesEnvoyes() {
	return (window._adftrack as Array<{ pagename: string }>).map((track) => decodeURIComponent(track.pagename));
}

describe("AdformMarketingService", () => {
	beforeEach(() => {
		window._adftrack = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	it("déclare le service adform auprès du gestionnaire de cookies", () => {
		// WHEN
		const cookiesService = lancerLeService({ campagne2026_10: true, campagne2026_11: false });

		// THEN
		expect(cookiesService.addService).toHaveBeenCalledWith("adform1j1s", expect.objectContaining({ key: "adform1j1s", needConsent: true, type: "ads" }));
		expect(window.tarteaucitron.addScript).toHaveBeenCalledWith("https://s2.adform.net/banners/scripts/st/trackpoint-async.js");
		expect(window._adftrack).toEqual([expect.objectContaining({ HttpHost: "server.adform.net", pm: 2867419 })]);
	});

	describe("lorsque les deux campagnes sont actives et que l'utilisateur est sur la page d'accueil", () => {
		it("envoie les deux pagenames", () => {
			// GIVEN
			window.history.pushState({}, "", "/");

			// WHEN
			lancerLeService({ campagne2026_10: true, campagne2026_11: true });

			// THEN
			expect(pagenamesEnvoyes()).toEqual([
				"2026-10-1jeune1solution.gouv.fr-PageArrivee-PageArrivee",
				"2026-08-1jeune1solution.gouv.fr-PageArrivee-PageAriveeLaSecuriteDesSalaries",
			]);
			expect(window.tarteaucitron.addScript).toHaveBeenCalledTimes(1);
		});
	});

	describe("lorsque les deux campagnes sont actives et que l'utilisateur est sur une autre page", () => {
		it("envoie uniquement le pagename de la campagne 2026-10", () => {
			// GIVEN
			window.history.pushState({}, "", "/emplois");

			// WHEN
			lancerLeService({ campagne2026_10: true, campagne2026_11: true });

			// THEN
			expect(pagenamesEnvoyes()).toEqual(["2026-10-1jeune1solution.gouv.fr-PageArrivee-PageArrivee"]);
		});
	});

	describe("lorsque seule la campagne 2026-11 est active et que l'utilisateur est sur une autre page", () => {
		it("ne charge pas le script", () => {
			// GIVEN
			window.history.pushState({}, "", "/emplois");

			// WHEN
			lancerLeService({ campagne2026_10: false, campagne2026_11: true });

			// THEN
			expect(window.tarteaucitron.addScript).not.toHaveBeenCalled();
			expect(window._adftrack).toBeUndefined();
		});
	});
});
