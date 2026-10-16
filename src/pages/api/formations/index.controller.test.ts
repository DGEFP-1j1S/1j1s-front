// @vitest-environment node
import { testApiHandler } from 'next-test-api-route-handler';
import nock from 'nock';

import { formationRechercheQuerySchema, rechercherFormationHandler } from '~/pages/api/formations/index.controller';
import { withValidation } from '~/pages/api/middlewares/validation/validation.middleware';
import { ErrorHttpResponse } from '~/pages/api/utils/response/response.type';
import { RésultatRechercheFormation } from '~/server/formations/domain/formation';
import { aRésultatRechercheFormationList } from '~/server/formations/domain/formation.fixture';
import {
	aLaBonneAlternanceApiRésultatRechercheFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';

const API_LA_BONNE_ALTERNANCE_URL = 'https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/v1/';

function interceptToutAppelFormationLaBonneAlternance(): nock.Scope {
	return nock(API_LA_BONNE_ALTERNANCE_URL)
		.get('/formations')
		.query(true)
		.reply(200, aLaBonneAlternanceApiRésultatRechercheFormationResponse());
}

describe('rechercher formation', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	describe('quand le paramètre niveau d’études n’est pas renseignée', () => {
		it('retournes une liste de formations filtrée sans prendre en compte le niveau d’études', async () => {
			const codeRomes = 'F1603,I1308';
			const caller = '1jeune1solution';
			const radius = '30';
			const codeCommune = '13180';
			const longitudeCommune = '15.845';
			const latitudeCommune = '2.37';

			nock('https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/v1/').get(
				`/formations?caller=${caller}&romes=${codeRomes}&insee=${codeCommune}&longitude=${longitudeCommune}&latitude=${latitudeCommune}&radius=${radius}`,
			).reply(200, aLaBonneAlternanceApiRésultatRechercheFormationResponse());

			await testApiHandler<Array<RésultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => rechercherFormationHandler(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });
					const json = await res.json();
					expect(json).toEqual(aRésultatRechercheFormationList());
				},
				url: `/formations?codeRomes=${codeRomes}&codeCommune=${codeCommune}&longitudeCommune=${longitudeCommune}&latitudeCommune=${latitudeCommune}&distanceCommune=${radius}`,
			});
		});
	});

	describe('quand le paramètre niveau d’études est renseignée', () => {
		it('retournes une liste de formations filtrée en prenant en compte le niveau d’études', async () => {
			const codeRomes = 'F1603,I1308';
			const caller = '1jeune1solution';
			const radius = '30';
			const codeCommune = '13180';
			const longitudeCommune = '15.845';
			const latitudeCommune = '2.37';
			const niveauEtudes = '6';
			const niveauEtudesLBA = '6 (Licence, BUT...)';

			nock('https://labonnealternance-recette.apprentissage.beta.gouv.fr/api/v1/').get(
				`/formations?caller=${caller}&romes=${codeRomes}&insee=${codeCommune}&longitude=${longitudeCommune}&latitude=${latitudeCommune}&radius=${radius}&diploma=${niveauEtudesLBA}`,
			).reply(200, aLaBonneAlternanceApiRésultatRechercheFormationResponse());

			await testApiHandler<Array<RésultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => rechercherFormationHandler(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });
					const json = await res.json();
					expect(json).toEqual(aRésultatRechercheFormationList());
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
		])('retourne une erreur 400 sans appeler La Bonne Alternance pour le code ROME %s', async (codeRomes) => {
			const scopeLaBonneAlternance = interceptToutAppelFormationLaBonneAlternance();

			await testApiHandler<Array<RésultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => withValidation({ query: formationRechercheQuerySchema }, rechercherFormationHandler)(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });

					expect(res.status).toEqual(400);
					expect(scopeLaBonneAlternance.isDone()).toEqual(false);
				},
				url: `/formations?codeRomes=${encodeURIComponent(codeRomes)}&codeCommune=13180&longitudeCommune=15.845&latitudeCommune=2.37&distanceCommune=30`,
			});
		});
	});

	describe('quand le format des codes ROME est valide', () => {
		// La casse minuscule est acceptée par La Bonne Alternance : le sondage direct (preuve 4 du diagnostic) montre que
		// romes=m1805 renvoie HTTP 200. Le pattern /^[A-Z]\d{4}$/ suggéré par le message d‘erreur du partenaire régresserait ce cas.
		it.each([
			'M1805',
			'm1805',
			'M1805,M1806',
		])('appelle La Bonne Alternance pour le code ROME %s', async (codeRomes) => {
			const scopeLaBonneAlternance = interceptToutAppelFormationLaBonneAlternance();

			await testApiHandler<Array<RésultatRechercheFormation> | ErrorHttpResponse>({
				pagesHandler: (req, res) => withValidation({ query: formationRechercheQuerySchema }, rechercherFormationHandler)(req, res),
				test: async ({ fetch }) => {
					const res = await fetch({ method: 'GET' });

					expect(res.status).toEqual(200);
					expect(scopeLaBonneAlternance.isDone()).toEqual(true);
				},
				url: `/formations?codeRomes=${encodeURIComponent(codeRomes)}&codeCommune=13180&longitudeCommune=15.845&latitudeCommune=2.37&distanceCommune=30`,
			});
		});
	});
});
