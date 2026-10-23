import { CookiesService } from "~/client/services/cookies/cookies.service";

declare global {
	interface Window {
		GbTagBuilder?: { build: (id: string) => { fire: () => void } }
	}
}

const TITRE_IFRAME_GOLDENBEES = "GoldenBees tag";
let observateurIframesGoldenBees: MutationObserver | undefined;

// Le tag GoldenBees remplit une iframe via document.open() et delegue document.close() a un script inline
// bloque par notre CSP : sans fermeture manuelle, la page reste indefiniment en chargement
function fermerLesIframesGoldenBees() {
	if (observateurIframesGoldenBees) {
		return;
	}
	observateurIframesGoldenBees = new MutationObserver((mutations) => {
		mutations.flatMap((mutation) => Array.from(mutation.addedNodes))
			.filter((noeud): noeud is HTMLIFrameElement => noeud instanceof HTMLIFrameElement && noeud.title === TITRE_IFRAME_GOLDENBEES)
			.forEach((iframe) => iframe.contentDocument?.close());
	});
	observateurIframesGoldenBees.observe(document.body, { childList: true });
}

export class GoldenBeesMarketingService {
	static readonly SERVICE_NAME = "goldenbees";
	static readonly SCRIPT_URL = "https://cdn.goldenbees.fr/proxy?url=http%3A%2F%2Fstatic.goldenbees.fr%2Fcdn%2Fjs%2Fgtag%2Fgoldentag-min.js&attachment=0";
	static readonly TAG_ID = "z5p34h";

	constructor(cookiesService: CookiesService) {
		cookiesService.addService(GoldenBeesMarketingService.SERVICE_NAME, {
			cookies: [],
			js: function () {
				"use strict";
				fermerLesIframesGoldenBees();
				const fire = () => window.GbTagBuilder?.build(GoldenBeesMarketingService.TAG_ID).fire();
				if (window.GbTagBuilder) {
					fire();
				} else {
					window.tarteaucitron.addScript(GoldenBeesMarketingService.SCRIPT_URL, "", fire);
				}
			},
			key: GoldenBeesMarketingService.SERVICE_NAME,
			name: "GoldenBees",
			needConsent: true,
			type: "ads",
			uri: "https://www.goldenbees.fr/politique-cookies",
		});
	}
}
