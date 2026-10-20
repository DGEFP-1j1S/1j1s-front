export type CookiesServiceConfig = Record<string, unknown>;
export type CookiesServiceUser = unknown;

export type ServiceConsentement = {
	id: string
	nom: string
	description?: string
	autorise?: boolean
};

export type Finalite = {
	id: string
	titre: string
	description?: string
	obligatoire: boolean
	services: Array<ServiceConsentement>
};

export type EtatGestionnaireConsentement = {
	banniereOuverte: boolean
	panneauOuvert: boolean
};

export interface CookiesService {
  addService(nom: string, config?: CookiesServiceConfig): void;

  addUser(nom: string, value: CookiesServiceUser): void;

  isServiceAllowed(nom: string): boolean;

  allowService(nom: string): void;

  openPanel(): void;

  closePanel(): void;

	triggerServices(): void;

	getFinalites(): Array<Finalite>;

	acceptAll(): void;

	denyAll(): void;

	saveChoices(choix: Record<string, boolean>): void;

	getEtat(): EtatGestionnaireConsentement;

	subscribe(listener: () => void): () => void;
}
