export type CookiesServiceConfig = Record<string, unknown>;
export type CookiesServiceUser = unknown;

export interface CookiesService {
  addService(nom: string, config?: CookiesServiceConfig): void;

  addUser(nom: string, value: CookiesServiceUser): void;

  isServiceAllowed(nom: string): boolean;

  allowService(nom: string): void;

  openPanel(): void;

	triggerServices(): void;
}
