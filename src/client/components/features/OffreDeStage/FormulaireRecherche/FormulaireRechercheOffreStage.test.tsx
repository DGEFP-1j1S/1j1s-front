import {
	sortByDurationAscending,
	sortWithNonRenseigneAtTheEnd,
} from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

function anFacedValue(override ?: { name: string }): Facette {
	return {
		nombre: 1,
		valeur: override?.name ?? 'name',
	};
}

describe('sortWithNonRenseigneAtTheEnd', () => {
	it('tri les données par ordre ascendant avec Non rensigné à la fin', () => {
		const data = [
			anFacedValue({ name: 'ab' }),
			anFacedValue({ name: 'non renseigné' }),
			anFacedValue({ name: 's' }),
			anFacedValue({ name: 'n' }),
			anFacedValue({ name: 'a' }),
		];

		const sortedData = data.sort(sortWithNonRenseigneAtTheEnd);

		expect(sortedData).toStrictEqual([
			anFacedValue({ name: 'a' }),
			anFacedValue({ name: 'ab' }),
			anFacedValue({ name: 'n' }),
			anFacedValue({ name: 's' }),
			anFacedValue({ name: 'non renseigné' }),
		]);
	});
});

describe('sortByDurationAscending', () => {
	it('tri les données par ordre ascendant avec < 1 mois au début', () => {
		const data = [
			anFacedValue({ name: '< 1 mois' }),
			anFacedValue({ name: 'non renseigné' }),
			anFacedValue({ name: '3 mois' }),
			anFacedValue({ name: '1 mois' }),
			anFacedValue({ name: '2 mois' }),
			anFacedValue({ name: '> 6 mois' }),
		];

		const sortedData = data.sort(sortByDurationAscending);


		expect(sortedData).toStrictEqual([
			anFacedValue({ name: '< 1 mois' }),
			anFacedValue({ name: '1 mois' }),
			anFacedValue({ name: '2 mois' }),
			anFacedValue({ name: '3 mois' }),
			anFacedValue({ name: '> 6 mois' }),
			anFacedValue({ name: 'non renseigné' }),
		]);
	});
});
