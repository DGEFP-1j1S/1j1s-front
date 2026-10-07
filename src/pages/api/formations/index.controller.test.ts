// @vitest-environment node
import { testApiHandler } from 'next-test-api-route-handler';
import nock from 'nock';

import { formationRechercheQuerySchema, rechercherFormationHandler } from '~/pages/api/formations/index.controller';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { ResultatRechercheFormation } from '~/server/formations/domain/formation';
import { aResultatRechercheFormationList } from '~/server/formations/domain/formation.fixture';
import {
	anApiAlternanceResultatRechercheFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';

const API_ALTERNANCE_URL = 'https://api-recette.apprentissage.beta.gouv.fr/api/';

function interceptToutAppelFormationApiAlternance(): nock.Scope {
	return nock(API_ALTERNANCE_URL)
		.get('/formation/v1/search')
		.query(true)
		.reply(200, anApiAlternanceResultatRechercheFormationResponse());
}

describe('rechercher formation', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	describe('quand le paramètre niveau d’études n’est pas renseignée', () => {
		it('retournes une liste de formations filtrée sans prendre en compte le niveau d’études', async () => {
			const codeRomes = 'F1603,I1308';
			const radius = '30';
			const codeCommune = '13180';
			const longitudeCommune = '15.845';
			const latitudeCommune = '2.37';

			nock(API_ALTERNANCE_URL).get(
				`/formation/v1/search?romes=${codeRomes}&longitude=${longitudeCommune}&latitude=${latitudeCommune}&radius=${radius}`,
			).reply(200, anApiAlternanceResultatRechercheFormationResponse());

			await testApiHandler<Array<ResultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => rechercherFormationHandler(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });
					const json = await res.json();
					expect(json).toEqual(aResultatRechercheFormationList());
				},
				url: `/formations?codeRomes=${codeRomes}&codeCommune=${codeCommune}&longitudeCommune=${longitudeCommune}&latitudeCommune=${latitudeCommune}&distanceCommune=${radius}`,
			});
		});
	});

	describe('quand le paramètre niveau d’études est renseignée', () => {
		it('retournes une liste de formations filtrée en prenant en compte le niveau d’études', async () => {
			const codeRomes = 'F1603,I1308';
			const radius = '30';
			const codeCommune = '13180';
			const longitudeCommune = '15.845';
			const latitudeCommune = '2.37';
			const niveauEtudes = '6';

			nock(API_ALTERNANCE_URL).get(
				`/formation/v1/search?romes=${codeRomes}&longitude=${longitudeCommune}&latitude=${latitudeCommune}&radius=${radius}&target_diploma_level=${niveauEtudes}`,
			).reply(200, anApiAlternanceResultatRechercheFormationResponse());

			await testApiHandler<Array<ResultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => rechercherFormationHandler(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });
					const json = await res.json();
					expect(json).toEqual(aResultatRechercheFormationList());
				},
				url: `/formations?codeRomes=${codeRomes}&codeCommune=${codeCommune}&longitudeCommune=${longitudeCommune}&latitudeCommune=${latitudeCommune}&distanceCommune=${radius}&niveauEtudes=${niveauEtudes}`,
			});
		});
	});

	describe('quand le format des codes ROME est invalide', () => {
		it.each([
			'abc',
			'XXXXX',
			'1234A',
			'M180',
			'M18050',
			'M1805,',
		])('retourne une erreur 400 sans appeler l’API Alternance pour le code ROME %s', async (codeRomes) => {
			const scopeApiAlternance = interceptToutAppelFormationApiAlternance();

			await testApiHandler<Array<ResultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => withValidation({ query: formationRechercheQuerySchema }, rechercherFormationHandler)(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });

					expect(res.status).toEqual(400);
					expect(scopeApiAlternance.isDone()).toEqual(false);
				},
				url: `/formations?codeRomes=${encodeURIComponent(codeRomes)}&codeCommune=13180&longitudeCommune=15.845&latitudeCommune=2.37&distanceCommune=30`,
			});
		});
	});

	describe('quand le format des codes ROME est valide', () => {
		// NOTE (JUFE 05-10-2026): la casse minuscule reste acceptée côté 1j1s, le repository remet les codes en majuscules
		// avant d‘appeler l‘API Alternance qui, elle, n‘accepte que /^[A-Z]\d{4}$/.
		it.each([
			'M1805',
			'm1805',
			'M1805,M1806',
		])('appelle l’API Alternance pour le code ROME %s', async (codeRomes) => {
			const scopeApiAlternance = interceptToutAppelFormationApiAlternance();

			await testApiHandler<Array<ResultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => withValidation({ query: formationRechercheQuerySchema }, rechercherFormationHandler)(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });

					expect(res.status).toEqual(200);
					expect(scopeApiAlternance.isDone()).toEqual(true);
				},
				url: `/formations?codeRomes=${encodeURIComponent(codeRomes)}&codeCommune=13180&longitudeCommune=15.845&latitudeCommune=2.37&distanceCommune=30`,
			});
		});
	});
});
