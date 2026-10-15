import { CookiesService, EtatGestionnaireConsentement } from './cookies.service';

export function aCookiesService(override?: Partial<CookiesService>): CookiesService {
	const etat: EtatGestionnaireConsentement = { banniereOuverte: false, panneauOuvert: false };
	return {
		acceptAll: vi.fn(),
		addService: vi.fn(),
		addUser: vi.fn(),
		allowService: vi.fn(),
		closePanel: vi.fn(),
		denyAll: vi.fn(),
		getEtat: vi.fn(() => etat),
		getFinalites: vi.fn(() => []),
		isServiceAllowed: vi.fn(() => true),
		openPanel: vi.fn(),
		saveChoices: vi.fn(),
		subscribe: vi.fn(() => () => {}),
		triggerServices: vi.fn(),
		...override,
	};
}
