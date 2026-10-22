import { ConfigurationService } from './configuration.service';
import { EnvironmentVariables } from './serverConfiguration.service';

export class ConfigurationServiceFixture implements ConfigurationService {
	private variables: EnvironmentVariables;

	getConfiguration(): EnvironmentVariables {
		return this.variables;
	}

	constructor(overrides?: Partial<EnvironmentVariables>) {
		this.variables = {
			API_ADRESSE_BASE_URL: 'https://api-adresse.data.gouv.fr/',
			API_ALTERNANCE_TOKEN: 'token',
			API_ALTERNANCE_URL: 'https://api-recette.apprentissage.beta.gouv.fr/api/',
			API_ENGAGEMENT_API_KEY_TOKEN: 'API_ENGAGEMENT_API_KEY_TOKEN',
			API_ENGAGEMENT_BASE_URL: 'https://api.api-engagement.beta.gouv.fr/v0/',
			API_ETABLISSEMENTS_PUBLICS: '',
			API_EURES_BASE_URL: 'https://webgate.acceptance.ec.europa.eu/eures-api/output/api/v1/jv/',
			API_EURES_IS_MOCK_ACTIVE: false,
			API_FRANCE_TRAVAIL_IS_MOCK_ACTIVE: false,
			API_FRANCE_TRAVAIL_OFFRES_URL: 'https://api.francetravail.io/partenaire/offresdemploi/v2/offres',
			API_FRANCE_TRAVAIL_REFERENTIEL_URL: 'https://api.francetravail.io/partenaire/offresdemploi/v2/referentiel',
			API_GEO_BASE_URL: 'https://geo.api.gouv.fr/',
			API_IMMERSION_FACILE_STAGE_3EME_API_KEY: 'API_IMMERSION_FACILE_STAGE_3EME_API_KEY',
			API_IMMERSION_FACILE_STAGE_3EME_URL: 'https://api.immersion-facile.beta.gouv.fr/v1/',
			API_LA_BONNE_ALTERNANCE_CALLER: '1jeune-1solution-test',
			API_LA_BONNE_ALTERNANCE_IS_ALTERNANCE_MOCK_ACTIVE: false,
			API_LA_BONNE_ALTERNANCE_URL: 'https://labonnealternance-recette.beta.gouv.fr/api/',
			API_ONISEP_ACCOUNT_EMAIL: 'email@example.com',
			API_ONISEP_ACCOUNT_PASSWORD: 'password-test',
			API_ONISEP_APPLICATION_ID: '123456789',
			API_ONISEP_BASE_URL: 'https://fake-onisep.fr',
			API_ONISEP_IS_MOCK_ACTIVE: false,
			API_TRAJECTOIRES_PRO_API_KEY: 'api-key',
			API_TRAJECTOIRES_PRO_CLIENT_ID: 'client-id',
			API_TRAJECTOIRES_PRO_CLIENT_SECRET: 'client-secret',
			API_TRAJECTOIRES_PRO_URL: 'https://trajectoires-pro-recette.apprentissage.beta.gouv.fr/api/',
			DUREE_VALIDITE_CACHE_CMS_EN_SECONDES: 20,
			ENVIRONMENT: 'test',
			FRANCE_TRAVAIL_CONNECT_CLIENT_ID: 'FRANCE_TRAVAIL_CONNECT_CLIENT_ID',
			FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET: 'FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET',
			FRANCE_TRAVAIL_CONNECT_SCOPE: 'FRANCE_TRAVAIL_CONNECT_SCOPE',
			FRANCE_TRAVAIL_CONNECT_URL: 'https://entreprise.francetravail.fr',
			FRANCE_TRAVAIL_IMAGES_HOSTNAME: '**.francetravail.fr',
			MAILER_SERVICE_ACTIVE: '',
			MAILER_SERVICE_REDIRECT_TO: '',
			NEXT_PUBLIC_1J1S_DOMAIN: '1jeune1solution.gouv.fr',
			NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE: true,
			NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH: 3,
			NEXT_PUBLIC_SENTRY_DSN: 'https://12345@sentry.fabrique.social.gouv.fr/79',
			NEXT_PUBLIC_SENTRY_ENVIRONMENT: 'local',
			NEXT_PUBLIC_SENTRY_LOG_LEVEL: 'info',
			NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: 1,
			NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST: 'APIs-Google,AdsBot-Google-Mobile,Googlebot,bingbot,Yandex',
			NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY: 'notTheMasterKey',
			NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL: 'http://localhost:7700',
			REDIS_URL: '',
			STRAPI_AUTH: '1j1s@gouv.fr:monmotdepasssécurisé',
			STRAPI_URL_API: 'http://localhost:1337/api/',
			TIPIMAIL_API_BASE_URL: '',
			TIPIMAIL_API_KEY: '',
			TIPIMAIL_API_USER: '',
			...overrides,
		};
	}
}
