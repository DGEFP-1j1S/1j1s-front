import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireRechercheOffreStage,
	sortByDurationAscending,
	sortWithNonRenseigneAtTheEnd,
} from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStageService } from '~/client/services/stage/stageService.fixture';
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

describe('FormulaireRechercheOffreStage', () => {
	beforeEach(() => {
		mockLargeScreen();
		mockScrollIntoView();
	});

	it('à la réinitialisation, vide tous les champs sans lancer la recherche', async () => {
		const user = userEvent.setup();
		const push = vi.fn();
		mockUseRouter({
			push,
			query: {
				domaines: 'achats',
				durees: '< 1 mois',
				localisations: 'Paris',
				motCle: 'designer',
			},
		});
		render(
			<DependenciesProvider stageService={aStageService()}>
				<FormulaireRechercheOffreStage facettes={{
					domaines: [uneFacette({ name: 'achats' })],
					durees: [uneFacette({ name: '< 1 mois' })],
				}} />
			</DependenciesProvider>,
		);
		const formulaire = screen.getByRole('search') as HTMLFormElement;
		expect(Array.from(new FormData(formulaire)).filter(([, valeur]) => valeur !== '')).toHaveLength(4);

		await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));

		expect(screen.getByRole('textbox', { name: /Métiers, mots clés/ })).toHaveValue('');
		const valeursRenseignees = Array.from(new FormData(formulaire)).filter(([, valeur]) => valeur !== '');
		expect(valeursRenseignees).toEqual([]);
		expect(push).not.toHaveBeenCalled();
	});
});
