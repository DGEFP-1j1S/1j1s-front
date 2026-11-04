import {
	sortByDurationAscending,
	sortWithNonRenseigneAtTheEnd,
} from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

function uneFacette(override ?: { name: string }): Facette {
	return {
		nombre: 1,
		valeur: override?.name ?? 'name',
	};
}

describe('sortWithNonRenseigneAtTheEnd', () => {
	it('tri les données par ordre ascendant avec Non renseigné à la fin', () => {
		const data = [
			uneFacette({ name: 'ab' }),
			uneFacette({ name: 'non renseigné' }),
			uneFacette({ name: 's' }),
			uneFacette({ name: 'n' }),
			uneFacette({ name: 'a' }),
		];

		const sortedData = data.sort(sortWithNonRenseigneAtTheEnd);

		expect(sortedData).toStrictEqual([
			uneFacette({ name: 'a' }),
			uneFacette({ name: 'ab' }),
			uneFacette({ name: 'n' }),
			uneFacette({ name: 's' }),
			uneFacette({ name: 'non renseigné' }),
		]);
	});
});

describe('sortByDurationAscending', () => {
	it('tri les données par ordre ascendant avec < 1 mois au début', () => {
		const data = [
			uneFacette({ name: '< 1 mois' }),
			uneFacette({ name: 'non renseigné' }),
			uneFacette({ name: '3 mois' }),
			uneFacette({ name: '1 mois' }),
			uneFacette({ name: '2 mois' }),
			uneFacette({ name: '> 6 mois' }),
		];

		const sortedData = data.sort(sortByDurationAscending);


		expect(sortedData).toStrictEqual([
			uneFacette({ name: '< 1 mois' }),
			uneFacette({ name: '1 mois' }),
			uneFacette({ name: '2 mois' }),
			uneFacette({ name: '3 mois' }),
			uneFacette({ name: '> 6 mois' }),
			uneFacette({ name: 'non renseigné' }),
		]);
	});
});
