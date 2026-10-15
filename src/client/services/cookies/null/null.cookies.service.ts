import { CookiesService, EtatGestionnaireConsentement, Finalite } from '../cookies.service';

const ETAT_FERME: EtatGestionnaireConsentement = { banniereOuverte: false, panneauOuvert: false };

export class NullCookiesService implements CookiesService {
	isServiceAllowed(): boolean {
		return false;
	}

	addUser(): void {
		return;
	}

	addService(): void {
		return;
	}

	allowService(): void {
		return;
	}

	openPanel(): void {
		return;
	}

	closePanel(): void {
		return;
	}

	triggerServices() {
		return;
	}

	getFinalites(): Array<Finalite> {
		return [];
	}

	acceptAll(): void {
		return;
	}

	denyAll(): void {
		return;
	}

	saveChoices(): void {
		return;
	}

	getEtat(): EtatGestionnaireConsentement {
		return ETAT_FERME;
	}

	subscribe(): () => void {
		return () => {};
	}
}
