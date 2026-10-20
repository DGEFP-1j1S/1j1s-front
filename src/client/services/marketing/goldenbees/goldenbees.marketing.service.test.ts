import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";
import { aTarteAuCitron } from "~/client/services/cookies/tarteaucitron/tarteAuCitron.fixture";

import { GoldenBeesMarketingService } from "./goldenbees.marketing.service";

function lancerLeService() {
	const cookiesService = aCookiesService();
	new GoldenBeesMarketingService(cookiesService);
	const config = vi.mocked(cookiesService.addService).mock.calls[0][1] as { js: () => void };
	config.js();
	return cookiesService;
}

describe("GoldenBeesMarketingService", () => {
	const fire = vi.fn();
	const gbTagBuilder = { build: vi.fn(() => ({ fire })) };

	beforeEach(() => {
		vi.clearAllMocks();
		window.GbTagBuilder = undefined;
		window.tarteaucitron = aTarteAuCitron();
	});

	describe("lorsque le script GoldenBees n'est pas encore chargé", () => {
		it("charge le script puis déclenche le tag", () => {
			// GIVEN
			window.tarteaucitron.addScript = vi.fn((_url: string, _id?: string, callback?: () => void) => {
				window.GbTagBuilder = gbTagBuilder;
				callback?.();
			});

			// WHEN
			const cookiesService = lancerLeService();

			// THEN
			expect(cookiesService.addService).toHaveBeenCalledWith("goldenbees", expect.objectContaining({ key: "goldenbees", needConsent: true, type: "ads" }));
			expect(window.tarteaucitron.addScript).toHaveBeenCalledWith(GoldenBeesMarketingService.SCRIPT_URL, "", expect.any(Function));
			expect(gbTagBuilder.build).toHaveBeenCalledWith("z5p34h");
			expect(fire).toHaveBeenCalledTimes(1);
		});
	});

	describe("lorsque le script GoldenBees est déjà chargé", () => {
		it("déclenche le tag sans recharger le script", () => {
			// GIVEN
			window.GbTagBuilder = gbTagBuilder;

			// WHEN
			lancerLeService();

			// THEN
			expect(window.tarteaucitron.addScript).not.toHaveBeenCalled();
			expect(fire).toHaveBeenCalledTimes(1);
		});
	});
});
