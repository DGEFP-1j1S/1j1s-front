import { MetierLaBonneAlternanceApiResponse } from '~/server/alternances/infra/repositories/apiLaBonneAlternance';
import { aMetier } from '~/server/metiers/domain/metierAlternance.fixture';
import { aMetierLaBonneAlternanceApiResponse } from '~/server/metiers/infra/apiLaBonneAlternanceMétier.fixture';
import { mapMetier } from '~/server/metiers/infra/apiLaBonneAlternanceMétier.mapper';

describe('mapMetier', () => {
	it('converti une response en liste de métiers', () => {
		const responseAPI: MetierLaBonneAlternanceApiResponse = aMetierLaBonneAlternanceApiResponse();

		const result = mapMetier(responseAPI);

		expect(result).toEqual([
			aMetier({ codeRomes: ['F1201', 'F1202', 'I1101'], label: 'Conduite de travaux, direction de chantier' }),
			aMetier({ codeRomes: ['F1106', 'F1104', 'I1101'], label: 'Ingéniérie en BTP (Bureau d études, conception technique, BIM, …)' }),
			aMetier({ codeRomes: ['H1209', 'H1504'], label: 'Génie électrique' }),
			aMetier({ codeRomes: ['I1304', 'I1602'], label: 'Aéronautique' }),
			aMetier({ codeRomes: ['H1201', 'H1505', 'H2301'], label: 'Chimie' }),
			aMetier({ codeRomes: ['H1206', 'H1402'], label: 'Electronique, informatique industrielle' }),
			aMetier({ codeRomes: ['F1106'], label: 'Electricité, climatisation, domotique, électronique' }),
			aMetier({ codeRomes: ['H1206'], label: 'Biologie, santé, sciences physiques' }),
			aMetier({ codeRomes: ['H1302', 'H1206'], label: 'Energie' }),
			aMetier({ codeRomes: ['I1310', 'I1502'], label: 'Mécanique, maintenance industrielle' }),
			aMetier({ codeRomes: ['H1208', 'I1301'], label: 'Robotique, systèmes automatisés' }),
		]);
	});
});
