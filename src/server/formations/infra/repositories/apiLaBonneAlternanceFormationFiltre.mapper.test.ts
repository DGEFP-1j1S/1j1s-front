import {
	aFormationQuery,
	aFormationQueryWithNiveauEtudes,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';
import {
	mapFiltreToQueryParams,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormationFiltre.mapper';

describe('mapFiltreToQueryParams', () => {
	it('mappe les paramètres obligatoires', () => {
		// WHEN
		const result = mapFiltreToQueryParams(aFormationQuery());

		// THEN
		expect(result).toBe('romes=F1603,I1308&longitude=29.10&latitude=48.2&radius=30');
	});

	describe('quand le niveau d’études est renseigné', () => {
		it('le mappe sur le niveau de diplôme européen attendu par l’api', () => {
			// WHEN
			const result = mapFiltreToQueryParams(aFormationQueryWithNiveauEtudes());

			// THEN
			expect(result).toBe('romes=F1603,I1308&longitude=29.10&latitude=48.2&radius=30&target_diploma_level=6');
		});
	});

	describe('quand le niveau d’études n’est pas renseigné', () => {
		it('n’ajoute pas le paramètre de niveau de diplôme', () => {
			// WHEN
			const result = mapFiltreToQueryParams(aFormationQuery());

			// THEN
			expect(result).not.toContain('target_diploma_level');
		});
	});

	describe('quand les codes ROME sont en minuscules', () => {
		it('les passe en majuscules car l’api Alternance les refuse autrement', () => {
			// WHEN
			const result = mapFiltreToQueryParams({ ...aFormationQuery(), codeRomes: ['f1603', 'i1308'] });

			// THEN
			expect(result).toContain('romes=F1603,I1308');
		});
	});
});
