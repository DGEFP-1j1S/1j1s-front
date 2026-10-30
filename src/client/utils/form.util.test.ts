import { getFormAsQuery, getFormAsQueryAvecValeursRepetees } from '~/client/utils/form.util';

function unFormulaire(champs: Array<[string, string]>) {
	const formulaire = document.createElement('form');
	champs.forEach(([name, value]) => {
		const input = document.createElement('input');
		input.name = name;
		input.value = value;
		formulaire.appendChild(input);
	});
	return formulaire;
}

const WHITELIST = { localisations: undefined, motCle: undefined, page: undefined };

describe('getFormAsQuery', () => {
	it('joint les valeurs multiples par une virgule', () => {
		const formulaire = unFormulaire([['localisations', 'Lyon'], ['localisations', 'Paris']]);

		expect(getFormAsQuery(formulaire, WHITELIST)).toBe('localisations=Lyon%2CParis&page=1');
	});
});

describe('getFormAsQueryAvecValeursRepetees', () => {
	it('répète le paramètre des valeurs multiples, qui peuvent contenir des virgules', () => {
		const formulaire = unFormulaire([['motCle', 'juriste'], ['localisations', 'Lyon, Part-Dieu'], ['localisations', 'Paris']]);

		expect(getFormAsQueryAvecValeursRepetees(formulaire, WHITELIST)).toBe('motCle=juriste&localisations=Lyon%2C+Part-Dieu&localisations=Paris&page=1');
	});

	it('ignore les champs vides et hors liste blanche', () => {
		const formulaire = unFormulaire([['motCle', ''], ['inconnu', 'x'], ['localisations', 'Paris']]);

		expect(getFormAsQueryAvecValeursRepetees(formulaire, WHITELIST, false)).toBe('localisations=Paris');
	});
});
