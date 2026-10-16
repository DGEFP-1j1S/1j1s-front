import { CookiesService } from '../cookies.service';
import FailedToAllowServiceError from '../FailedToAllowService.error';

export type TarteAuCitronServiceConfig<T> = Record<string, T>;
export type TarteAuCitronInitConfig = Record<string, unknown>;
export type TarteAuCitronUser = unknown;
export type TarteAuCitronServiceName = string;

export type TarteAuCitron = {
  user: Record<string, TarteAuCitronUser>,
  services: Record<TarteAuCitronServiceName, TarteAuCitronServiceConfig<unknown>>,
  init: (config: TarteAuCitronInitConfig) => void,
  job?: TarteAuCitronServiceName[],
  userInterface: {
    respond: (bouton: HTMLButtonElement, value: boolean) => void,
    openPanel: () => void,
  }
	state: Record<TarteAuCitronServiceName, boolean>,
	triggerJobsAfterAjaxCall: () => void,
}

export class TarteAuCitronCookiesService implements CookiesService {
	private static CONSENT_MANAGER_COOKIE_NAME = 'consentement';
	private static INIT_CONFIG = {
		AcceptAllCta: true,
		DenyAllCta: true,
		adblocker: false,
		bodyPosition: 'bottom',
		closePopup: false,
		cookieName: TarteAuCitronCookiesService.CONSENT_MANAGER_COOKIE_NAME,
		cookieslist: true,
		groupServices: false,
		handleBrowserDNTRequest: false,
		hashtag: '#tarteaucitron',
		highPrivacy: true,
		iconPosition: 'BottomLeft',
		iconSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAxQzE1LjMxMzcgMSAxOCAzLjY4NjI5IDE4IDdWOEgyMEMyMC41NTIzIDggMjEgOC40NDc3MiAyMSA5VjIxQzIxIDIxLjU1MjMgMjAuNTUyMyAyMiAyMCAyMkg0QzMuNDQ3NzIgMjIgMyAyMS41NTIzIDMgMjFWOUMzIDguNDQ3NzIgMy40NDc3MiA4IDQgOEg2VjdDNiAzLjY4NjI5IDguNjg2MjkgMSAxMiAxWk0xOSAxMEg2VjIwSDE5VjEwWk05IDE3VjE5SDdWMTdIOVpNOSAxNFYxNkg3VjE0SDlaTTkgMTFWMTNIN1YxMUg5Wk0xMiAzQzkuNzkwODYgMyA4IDQuNzkwODYgOCA3VjhIMTZWN0MxNiA0Ljc5MDg2IDE0LjIwOTEgMyAxMiAzWiIgZmlsbD0iIzAwMDA5MSIvPgo8L3N2Zz4K',
		mandatory: true,
		mandatoryCta: true,
		moreInfoLink: true,
		orientation: 'middle',
		privacyUrl: '/confidentialite',
		readmoreLink: '/confidentialite',
		removeCredit: true,
		serviceDefaultState: 'wait',
		showAlertSmall: false,
		showIcon: true,
		useExternalCss: false,
		useExternalJs: false,
	};
	private readonly tarteaucitron: TarteAuCitron;

	constructor(tarteaucitron: TarteAuCitron) {
		this.tarteaucitron = tarteaucitron;
		this.tarteaucitron.init(TarteAuCitronCookiesService.INIT_CONFIG);
		this.tarteaucitron.job = this.tarteaucitron.job || [];
	}

	addService(nom: string, config?: TarteAuCitronServiceConfig<unknown>): void {
		if (config != undefined) {
			this.tarteaucitron.services[nom] = config;
		}
		this.tarteaucitron.job?.push(nom);
	}

	addUser(userName: string, value: TarteAuCitronUser): void {
		this.tarteaucitron.user[userName] = value;
	}

	isServiceAllowed(serviceName: TarteAuCitronServiceName): boolean {
		return Boolean(this.tarteaucitron.state[serviceName]);
	}

	allowService(nom: TarteAuCitronServiceName): void {
		const allowButton = document.getElementById(`${nom}Allowed`);

		if (!allowButton || !(allowButton instanceof HTMLButtonElement)) {
			throw new FailedToAllowServiceError(nom, 'bouton introuvable');
		}

		this.tarteaucitron.userInterface.respond(allowButton, true);
	}

	openPanel(): void {
		return this.tarteaucitron.userInterface.openPanel();
	}

	triggerServices() {
		this.tarteaucitron.triggerJobsAfterAjaxCall();
	}
}
