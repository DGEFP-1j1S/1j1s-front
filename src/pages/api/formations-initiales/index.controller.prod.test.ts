// @vitest-environment node
import { testApiHandler } from 'next-test-api-route-handler';
import nock from 'nock';

import { rechercherFormationInitialeHandler } from '~/pages/api/formations-initiales/index.controller';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import {
	NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE,
	ResultatRechercheFormationsInitiales,
} from '~/server/formations-initiales/domain/formationInitiale';
import { aFormationInitiale } from '~/server/formations-initiales/domain/formationInitiale.fixture';
import {
	aResultatRechercheFormationInitialeApiResponse,
} from '~/server/formations-initiales/infra/onisepFormationInitiale.fixture';


vi.mock('~/server/services/serverConfiguration.service', () => {
	return { default: class {
		getConfiguration() {
			return {
				API_ADRESSE_BASE_URL: 'https://api-adresse.data.gouv.fr/',
				API_ENGAGEMENT_API_KEY_TOKEN: 'API_ENGAGEMENT_API_KEY_TOKEN',
				API_ENGAGEMENT_BASE_URL: 'https://api.api-engagement.beta.gouv.fr/v0/',
				API_ETABLISSEMENTS_PUBLICS: 'https://etablissements-publics.api.gouv.fr/v3/',
				API_FRANCE_TRAVAIL_OFFRES_URL: 'https://api.francetravail.io/partenaire/offresdemploi/v2/offres',
				API_FRANCE_TRAVAIL_REFERENTIEL_URL: 'https://api.francetravail.io/partenaire/offresdemploi/v2/referentiel',
				API_GEO_BASE_URL: 'https://geo.api.gouv.fr/',
				API_LA_BONNE_ALTERNANCE_CALLER: '1jeune1solution',
				API_LA_BONNE_ALTERNANCE_URL: 'https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/',
				API_ONISEP_ACCOUNT_EMAIL: 'fake@example.com',
				API_ONISEP_ACCOUNT_PASSWORD: 'password-bidon',
				API_ONISEP_APPLICATION_ID: '123456789',
				API_ONISEP_BASE_URL: 'https://api.opendata.onisep.fr/api/1.0',
				API_TRAJECTOIRES_PRO_URL: 'https://trajectoires-pro-recette.apprentissage.beta.gouv.fr/api/',
				DUREE_VALIDITE_CACHE_CMS_EN_SECONDES: 20,
				ENVIRONMENT: 'production',
				FRANCE_TRAVAIL_CONNECT_CLIENT_ID: 'FRANCE_TRAVAIL_CONNECT_CLIENT_ID',
				FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET: 'FRANCE_TRAVAIL_CONNECT_CLIENT_SECRET',
				FRANCE_TRAVAIL_CONNECT_SCOPE: 'FRANCE_TRAVAIL_CONNECT_SCOPE',
				FRANCE_TRAVAIL_CONNECT_URL: 'https://entreprise.francetravail.fr',
				LOGEMENT_IMAGE_URL_LIST: 'www.immojeune.com',
				MAILER_SERVICE_ACTIVE: '1',
				MAILER_SERVICE_REDIRECT_TO: '',
				NEXT_PUBLIC_ALTERNANCE_LBA_FEATURE: true,
				NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH: 3,
				NEXT_PUBLIC_INDEX_ANNONCE_DE_LOGEMENT: 'annonce-de-logement',
				NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE: 'offre-de-stage',
				NEXT_PUBLIC_SENTRY_DSN: 'https://123456789@sentry.fr/72',
				NEXT_PUBLIC_SENTRY_ENVIRONMENT: 'local',
				NEXT_PUBLIC_SENTRY_LOG_LEVEL: 'info',
				NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: 1,
				NEXT_PUBLIC_SENTRY_USER_AGENT_BLACKLIST: '"APIs-Google,AdsBot-Google-Mobile,Googlebot,bingbot,Yandex"',
				NEXT_PUBLIC_STAGE_SEARCH_ENGINE_API_KEY: 'notTheMasterKey',
				NEXT_PUBLIC_STAGE_SEARCH_ENGINE_BASE_URL: 'http://localhost:7700',
				REDIS_URL: '',
				STRAPI_AUTH: '1j1s@gouv.fr:monmotdepassesécurisé',
				STRAPI_URL_API: 'http://localhost:1337/api',
				TIPIMAIL_API_BASE_URL: 'https://api.tipimail.com/v1/',
				TIPIMAIL_API_KEY: 'TIPIMAIL_API_KEY',
				TIPIMAIL_API_USER: 'TIPIMAIL_API_USER',
			};
		}
	} };
});

describe('lorsque je veux faire une recherche de formations initiales', () => {
	it('en production, doit récupérer des formations initiales en mode authentifié', async () => {
		// GIVEN
		const motCle = 'informatique';
		const token = 'some-token';
		const onisepLoginResponse = {
			token,
		};
		const apiBaseUrl = 'https://api.opendata.onisep.fr/api/1.0';
		const apiAuthenticationUrl = `${apiBaseUrl}/login`;
		const apiSearchUrl = `${apiBaseUrl}/dataset/5fa591127f501`;
		const emailEncoded = encodeURIComponent('fake@example.com');
		const password = 'password-bidon';
		const getTokenRequestBody = `email=${emailEncoded}&password=${password}`;
		const getTokenRequestHeaders = { reqheaders: { 'Content-Type': 'application/x-www-form-urlencoded' } };
		const requestOptions = {
			reqheaders: {
				'Application-ID': '123456789',
				authorization: `Bearer ${token}`,
			},
		};
		const getTokenCall = nock(apiAuthenticationUrl)
			.post('', getTokenRequestBody, getTokenRequestHeaders)
			.reply(200, onisepLoginResponse);
		const searchFormationInitialeCall = nock(apiSearchUrl)
			.get(`/search?from=0&q=${motCle}&size=${NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE}`, undefined, requestOptions)
			.reply(200, aResultatRechercheFormationInitialeApiResponse);

		// WHEN
		await testApiHandler<ResultatRechercheFormationsInitiales | ErrorHttpResponse>({
			pagesHandler: (req, res) => rechercherFormationInitialeHandler(req, res),
			test: async ({ fetch }) => {
				const res = await fetch({ method: 'GET' });
				const reponseBody = await res.json();

				// THEN
				expect(getTokenCall.isDone()).toBe(true);
				expect(searchFormationInitialeCall.isDone()).toBe(true);
				expect(reponseBody).toEqual({ formationsInitiales: [aFormationInitiale()], nombreDeResultat: 150 });
			},
			url: `/formations-initiales?motCle=${motCle}&page=1`,
		});
	});
});
