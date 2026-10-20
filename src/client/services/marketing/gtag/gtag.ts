declare global {
	interface Window {
		dataLayer: IArguments[]
		gtag?: (...args: unknown[]) => void
	}
}

const GTAG_SCRIPT_URL = "https://www.googletagmanager.com/gtag/js?id=";

const comptesConfigures = new Set<string>();

export function loadGtag(accountId: string): void {
	window.dataLayer = window.dataLayer || [];
	if (!window.gtag) {
		window.gtag = function () {
			// eslint-disable-next-line prefer-rest-params
			window.dataLayer.push(arguments);
		};
		window.gtag("js", new Date());
		window.tarteaucitron.addScript(GTAG_SCRIPT_URL + accountId);
	}
	if (!comptesConfigures.has(accountId)) {
		window.gtag?.("config", accountId);
		comptesConfigures.add(accountId);
	}
}

export function sendGtagConversion(sendTo: string, extra?: Record<string, string>): void {
	window.gtag?.("event", "conversion", {
		allow_custom_scripts: true,
		send_to: sendTo,
		...extra,
	});
}
