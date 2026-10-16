import {
	mapFiltreNiveauEtudeVise,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormationFiltre.mapper';

describe('mapFiltreNiveauEtudeVise', () => {
	it('un niveau 3 doit correspondre au filtre "3 (CAP...)"', () => {
		// WHEN
		const result = mapFiltreNiveauEtudeVise('3');

		// THEN
		expect(result).toBe('3 (CAP...)');
	});

	it('un niveau 4 doit correspondre au filtre "4 (BAC...)"', () => {
		// WHEN
		const result = mapFiltreNiveauEtudeVise('4');

		// THEN
		expect(result).toBe('4 (BAC...)');
	});

	it('un niveau 5 doit correspondre au filtre "5 (BTS, DEUST...)"', () => {
		// WHEN
		const result = mapFiltreNiveauEtudeVise('5');

		// THEN
		expect(result).toBe('5 (BTS, DEUST...)');
	});

	it('un niveau 6 doit correspondre au filtre "6 (Licence, BUT...)"', () => {
		// WHEN
		const result = mapFiltreNiveauEtudeVise('6');

		// THEN
		expect(result).toBe('6 (Licence, BUT...)');
	});

	it('un niveau 7 doit correspondre au filtre "7 (Master, titre ingénieur...)"', () => {
		// WHEN
		const result = mapFiltreNiveauEtudeVise('7');

		// THEN
		expect(result).toBe('7 (Master, titre ingénieur...)');
	});

	it('un niveau autre que 3, 4, 5, 6, ou 7 ne correspond pas à un filtre, donc ne retourne rien', () => {
		// WHEN
		const result = mapFiltreNiveauEtudeVise('1');

		// THEN
		expect(result).toBe(undefined);
	});
});
