import { queryToArray, queryToValeurs } from '~/pages/api/utils/queryToArray.util';

describe('queryToArray', () => {
	it('découpe une valeur unique sur les virgules', () => {
		expect(queryToArray('CDD,CDI')).toStrictEqual(['CDD', 'CDI']);
	});
});

describe('queryToValeurs', () => {
	it('ne découpe pas une valeur unique sur les virgules', () => {
		expect(queryToValeurs('Lyon, Part-Dieu')).toStrictEqual(['Lyon, Part-Dieu']);
	});

	it('renvoie les valeurs d‘un paramètre répété', () => {
		expect(queryToValeurs(['Lyon, Part-Dieu', 'Paris'])).toStrictEqual(['Lyon, Part-Dieu', 'Paris']);
	});
});
