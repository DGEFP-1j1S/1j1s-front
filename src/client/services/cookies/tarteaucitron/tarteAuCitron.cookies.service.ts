import { CookiesService, EtatGestionnaireConsentement, Finalite } from '../cookies.service';
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
  lang: Record<string, unknown>,
  reloadThePage: boolean,
  userInterface: {
    respond: (bouton: HTMLButtonElement, value: boolean) => void,
    respondAll: (status: boolean, type?: string, allowSafeAnalytics?: boolean) => void,
    openPanel: () => void,
    closePanel: () => void,
  }
	state: Record<TarteAuCitronServiceName, boolean | 'wait'>,
	triggerJobsAfterAjaxCall: () => void,
	addScript: (url: string, id?: string, callback?: () => void) => void,
}

type TarteAuCitronCategorie = { title?: string, details?: string };

const FINALITE_OBLIGATOIRE = 'obligatoire';

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
		orientation: 'bottom',
		privacyUrl: '/confidentialite',
		readmoreLink: '/confidentialite',
		removeCredit: true,
		serviceDefaultState: 'wait',
		showAlertSmall: false,
		showIcon: false,
		useExternalCss: false,
		useExternalJs: false,
	};
	private readonly tarteaucitron: TarteAuCitron;
	private etat: EtatGestionnaireConsentement = { banniereOuverte: false, panneauOuvert: false };
	private readonly listeners = new Set<() => void>();

	constructor(tarteaucitron: TarteAuCitron) {
		this.tarteaucitron = tarteaucitron;
		this.ecouterInterface();
		this.tarteaucitron.init(TarteAuCitronCookiesService.INIT_CONFIG);
		this.tarteaucitron.job = this.tarteaucitron.job || [];
	}

	private ecouterInterface() {
		window.addEventListener('tac.open_alert', () => this.mettreAJourEtat({ banniereOuverte: true }));
		window.addEventListener('tac.close_alert', () => this.mettreAJourEtat({ banniereOuverte: false }));
		window.addEventListener('tac.open_panel', () => this.mettreAJourEtat({ panneauOuvert: true }));
		window.addEventListener('tac.close_panel', () => this.mettreAJourEtat({ panneauOuvert: false }));
	}

	private mettreAJourEtat(changement: Partial<EtatGestionnaireConsentement>) {
		this.etat = { ...this.etat, ...changement };
		this.listeners.forEach((listener) => listener());
	}

	getEtat(): EtatGestionnaireConsentement {
		return this.etat;
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
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
		this.repondre(nom, true);
	}

	private repondre(nom: TarteAuCitronServiceName, autorise: boolean) {
		// tarteaucitron déduit le service de l'id du bouton, quelle que soit la réponse
		const allowButton = document.getElementById(`${nom}Allowed`);

		if (!allowButton || !(allowButton instanceof HTMLButtonElement)) {
			throw new FailedToAllowServiceError(nom, 'bouton introuvable');
		}

		this.tarteaucitron.userInterface.respond(allowButton, autorise);
	}

	openPanel(): void {
		return this.tarteaucitron.userInterface.openPanel();
	}

	closePanel(): void {
		this.tarteaucitron.userInterface.closePanel();
	}

	triggerServices() {
		this.tarteaucitron.triggerJobsAfterAjaxCall();
	}

	getFinalites(): Array<Finalite> {
		const lang = this.tarteaucitron.lang;
		const finalites: Array<Finalite> = [{
			description: texte(lang.mandatoryText),
			id: FINALITE_OBLIGATOIRE,
			obligatoire: true,
			services: [],
			titre: texte(lang.mandatoryTitle) ?? 'Cookies obligatoires',
		}];

		for (const id of this.tarteaucitron.job ?? []) {
			const service = this.tarteaucitron.services[id];
			if (!service) continue;

			const type = String(service.type);
			let finalite = finalites.find((finalite) => finalite.id === type);
			if (!finalite) {
				const categorie = lang[type] as TarteAuCitronCategorie | undefined;
				finalite = {
					description: categorie?.details,
					id: type,
					obligatoire: false,
					services: [],
					titre: categorie?.title ?? type,
				};
				finalites.push(finalite);
			}

			const etat = this.tarteaucitron.state[id];
			finalite.services.push({
				autorise: typeof etat === 'boolean' ? etat : undefined,
				description: texte(lang[id]),
				id,
				nom: texte(service.name) ?? id,
			});
		}

		return finalites;
	}

	acceptAll(): void {
		this.tarteaucitron.userInterface.respondAll(true);
	}

	denyAll(): void {
		this.tarteaucitron.userInterface.respondAll(false, '', true);
		if (this.tarteaucitron.reloadThePage) {
			window.location.reload();
		}
	}

	saveChoices(choix: Record<TarteAuCitronServiceName, boolean>): void {
		Object.entries(choix).forEach(([nom, autorise]) => this.repondre(nom, autorise));
		this.closePanel();
	}
}

function texte(valeur: unknown): string | undefined {
	return typeof valeur === 'string' ? valeur : undefined;
}
