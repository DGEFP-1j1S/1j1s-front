import { ConfigurationService } from '~/server/services/configuration.service';

export default class ServerConfigurationService implements ConfigurationService {
	getConfiguration(): EnvironmentVariables {
		return {
			API_ADRESSE_BASE_URL: ServerConfigurationService.getOrThrowError('API_ADRESSE_BASE_URL'),
			API_ALTERNANCE_TOKEN: ServerConfigurationService.getOrThrowError('API_ALTERNANCE_TOKEN'),
			API_ALTERNANCE_URL: ServerConfigurationService.getOrThrowError('API_ALTERNANCE_URL'),
			API_ENGAGEMENT_API_KEY_TOKEN: ServerConfigurationService.getOrThrowError('API_ENGAGEMENT_API_KEY_TOKEN'),
			API_ENGAGEMENT_BASE_URL: ServerConfigurationService.getOrThrowError('API_ENGAGEMENT_BASE_URL'),
			API_ETABLISSEMENTS_PUBLICS: ServerConfigurationService.getOrThrowError('API_ETABLISSEMENTS_PUBLICS'),
			API_EURES_BASE_URL: ServerConfigurationService.getOrThrowError('API_EURES_BASE_URL'),
			API_EURES_IS_MOCK_ACTIVE: Boolean(Number(ServerConfigurationService.getOrDefault('API_EURES_IS_MOCK_ACTIVE', '0'))),
			API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE: Boolean(Number(ServerConfigurationService.getOrDefault('API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE', '0'))),
			API_FRANCE_TRAVAIL_OFFRES_URL: ServerConfigurationService.getOrThrowError('API_FRANCE_TRAVAIL_OFFRES_URL'),
			API_FRANCE_TRAVAIL_REFERENTIEL_URL: ServerConfigurationService.getOrThrowError('API_FRANCE_TRAVAIL_REFERENTIEL_URL'),
			API_GEO_BASE_URL: ServerConfigurationService.getOrThrowError('API_GEO_BASE_URL'),
			API_IMMERSION_FACILE_STAGE_3EME_API_KEY: ServerConfigurationService.getOrThrowError('API_IMMERSION_FACILE_STAGE_3EME_API_KEY'),
			API_IMMERSION_FACILE_STAGE_3EME_URL: ServerConfigurationService.getOrThrowError('API_IMMERSION_FACILE_STAGE_3EME_URL'),
			API_LA_BONNE_ALTERNANCE_CALLER: ServerConfigurationService.getOrThrowError('API_LA_BONNE_ALTERNANCE_CALLER'),
			API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE: Boolean(Number(ServerConfigurationService.getOrDefault('API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE', '0'))),
			API_LA_BONNE_ALTERNANCE_URL: ServerConfigurationService.getOrThrowError('API_LA_BONNE_ALTERNANCE_URL'),
			API_ONISEP_ACCOUNT_EMAIL: ServerConfigurationService.getOrThrowError('API_ONISEP_ACCOUNT_EMAIL'),
			API_ONISEP_ACCOUNT_PASSWORD: ServerConfigurationService.getOrThrowError('API_ONISEP_ACCOUNT_PASSWORD'),
			API_ONISEP_APPLICATION_ID: ServerConfigurationService.getOrThrowError('API_ONISEP_APPLICATION_ID'),
			API_ONISEP_BASE_URL: ServerConfigurationService.getOrThrowError('API_ONISEP_BASE_URL'),
			API_ONISEP_IS_MOCK_ACTIVE: Boolean(Number(ServerConfigurationService.getOrDefault('API_ONISEP_IS_MOCK_ACTIVE', '0'))),
			API_TRAJECTOIRES_PRO_API_KEY: ServerConfigurationService.getOrThrowError('API_TRAJECTOIRES_PRO_API_KEY'),
			API_TRAJECTOIRES_PRO_CLIENT_ID: ServerConfigurationService.getOrThrowError('API_TRAJECTOIRES_PRO_CLIENT_ID'),
			API_TRAJECTOIRES_PRO_CLIENT_SECRET: ServerConfigurationService.getOrThrowError('API_TRAJECTOIRES_PRO_CLIENT_SECRET'),
			API_TRAJECTOIRES_PRO_URL: ServerConfigurationService.getOrThrowError('API_TRAJECTOIRES_PRO_URL'),
			DUREE_VALIDITE_CACHE_CMS_EN_SECONDES: Number(ServerConfigurationService.getOrThrowError('DUREE_VALIDITE_CACHE_CMS_EN_SECONDES')),
			ENVIRONMENT: ServerConfigurationService.getOrDefault('ENVIRONMENT', 'local'),
			FRANCE_TRAVAIL_CONNECT_CLIENT_ID: ServerConfigurationService.getOrThrowError('FRANCE_TRAVAIL_CONNECT_CLIENT_ID'),
			FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET: ServerConfigurationService.getOrThrowError('FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET'),
			FRANCE_TRAVAIL_CONNECT_SCOPE: ServerConfigurationService.getOrThrowError('FRANCE_TRAVAIL_CONNECT_SCOPE').replace(/,/g, ' '),
			FRANCE_TRAVAIL_CONNECT_URL: ServerConfigurationService.getOrThrowError('FRANCE_TRAVAIL_CONNECT_URL'),
			FRANCE_TRAVAIL_IMAGES_HOSTNAME: ServerConfigurationService.getOrThrowError('FRANCE_TRAVAIL_IMAGES_HOSTNAME'),
			MAILER_SERVICE_ACTIVE: ServerConfigurationService.getOrDefault('MAILER_SERVICE_ACTIVE', '0'),

			LOGEMENT_IMAGE_URL_LIST: ServerConfigurationService.getOrThrowError('LOGEMENT_IMAGE_URL_LIST'),
			MAILER_SERVICE_REDIRECT_TO: ServerConfigurationService.getOrDefault('MAILER_SERVICE_REDIRECT_TO', ''),
			NEXT_PUBLIC_1J1S_DOMAIN: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_1J1S_DOMAIN'),
			NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE: Boolean(Number(ServerConfigurationService.getOrDefault('NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE', '0'))),
			NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH: Number(ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH')),
			NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT'),
			NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE'),
			NEXT_PUBLIC_SENTRY_DSN: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_SENTRY_DSN'),
			NEXT_PUBLIC_SENTRY_ENVIRONMENT: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_SENTRY_ENVIRONMENT'),
			NEXT_PUBLIC_SENTRY_LOG_LEVEL: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_SENTRY_LOG_LEVEL'),
			NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: Number(ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST')),
			NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST'),
			NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY'),
			NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL: ServerConfigurationService.getOrThrowError('NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL'),
			REDIS_URL: ServerConfigurationService.getOrDefault('REDIS_URL', ''),
			STRAPI_AUTH: ServerConfigurationService.matchOrThrowError('STRAPI_AUTH', /^(.+):(.+)$/),
			STRAPI_URL_API: ServerConfigurationService.getOrThrowError('STRAPI_URL_API'),
			TIPIMAIL_API_BASE_URL: ServerConfigurationService.getOrThrowError('TIPIMAIL_API_BASE_URL'),
			TIPIMAIL_API_KEY: ServerConfigurationService.getOrThrowError('TIPIMAIL_API_KEY'),
			TIPIMAIL_API_USER: ServerConfigurationService.getOrThrowError('TIPIMAIL_API_USER'),
		};
	}

	private static getOrThrowError(name: string): string {
		const environmentVariable = process.env[name];
		if (!environmentVariable) {
			throw new EnvironmentVariablesException(
				`Variable ${name} missing from environment!`,
			);
		} else {
			return environmentVariable;
		}
	}

	private static matchOrThrowError(name: string, match: RegExp): string {
		const value = ServerConfigurationService.getOrThrowError(name);
		if (!match.test(value)) {
			throw new EnvironmentVariablesException(`Variable ${name} must match ${match}`);
		}
		return value;
	}

	private static getOrDefault(name: string, defaultValue: string): string {
		const environmentVariable = process.env[name];
		return environmentVariable || defaultValue;
	}
}

class EnvironmentVariablesException extends Error {
	constructor(readonly message: string) {
		super(message);
	}
}

export interface EnvironmentVariables {
	readonly API_ADRESSE_BASE_URL: string
	readonly NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH: number
	readonly NEXT_PUBLIC_SENTRY_LOG_LEVEL: string
	readonly NEXT_PUBLIC_1J1S_DOMAIN: string
	readonly NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT: string
	readonly NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE: string
	readonly NEXT_PUBLIC_SENTRY_DSN: string
	readonly NEXT_PUBLIC_SENTRY_ENVIRONMENT: string
	readonly NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST: string
	readonly NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: number
	readonly API_ENGAGEMENT_API_KEY_TOKEN: string
	readonly API_ENGAGEMENT_BASE_URL: string
	readonly API_ETABLISSEMENTS_PUBLICS: string
	readonly API_EURES_BASE_URL: string
	readonly API_EURES_IS_MOCK_ACTIVE: boolean
	readonly API_GEO_BASE_URL: string
	readonly API_IMMERSION_FACILE_STAGE_3EME_API_KEY: string
	readonly API_IMMERSION_FACILE_STAGE_3EME_URL: string
	readonly API_LA_BONNE_ALTERNANCE_CALLER: string
	readonly API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE: boolean
	readonly API_LA_BONNE_ALTERNANCE_URL: string
	readonly API_ALTERNANCE_URL: string
	readonly API_ALTERNANCE_TOKEN: string
	readonly API_ONISEP_BASE_URL: string
	readonly API_ONISEP_ACCOUNT_EMAIL: string
	readonly API_ONISEP_ACCOUNT_PASSWORD: string
	readonly API_ONISEP_APPLICATION_ID: string
	readonly API_ONISEP_IS_MOCK_ACTIVE: boolean
	readonly API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE: boolean
	readonly API_FRANCE_TRAVAIL_OFFRES_URL: string
	readonly API_FRANCE_TRAVAIL_REFERENTIEL_URL: string
	readonly API_TRAJECTOIRES_PRO_URL: string
	readonly API_TRAJECTOIRES_PRO_CLIENT_ID: string
	readonly API_TRAJECTOIRES_PRO_CLIENT_SECRET: string
	readonly API_TRAJECTOIRES_PRO_API_KEY: string
	readonly ENVIRONMENT: string
	readonly DUREE_VALIDITE_CACHE_CMS_EN_SECONDES: number
	readonly MAILER_SERVICE_ACTIVE: string
	readonly LOGEMENT_IMAGE_URL_LIST: string
	readonly MAILER_SERVICE_REDIRECT_TO: string
	readonly NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE: boolean
	readonly NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY: string
	readonly NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL: string
	readonly FRANCE_TRAVAIL_CONNECT_CLIENT_ID: string
	readonly FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET: string
	readonly FRANCE_TRAVAIL_CONNECT_SCOPE: string
	readonly FRANCE_TRAVAIL_CONNECT_URL: string
	readonly FRANCE_TRAVAIL_IMAGES_HOSTNAME: string
	readonly REDIS_URL: string
	readonly STRAPI_AUTH: string
	readonly STRAPI_URL_API: string
	readonly TIPIMAIL_API_BASE_URL: string
	readonly TIPIMAIL_API_KEY: string
	readonly TIPIMAIL_API_USER: string
}
