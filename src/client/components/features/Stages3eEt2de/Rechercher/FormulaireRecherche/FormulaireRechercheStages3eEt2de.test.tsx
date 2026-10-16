import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireRechercheStages3eEt2de,
} from '~/client/components/features/Stages3eEt2de/Rechercher/FormulaireRecherche/FormulaireRechercheStages3eEt2de';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aMetierService } from '~/client/services/metiers/metier.fixture';
import { aStage3eEt2deService } from '~/client/services/stage3eEt2de/stage3eEt2de.service.fixture';
import { createSuccess } from '~/server/errors/either';
import {
	aCommune,
	aRésultatsRechercheCommune,
} from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

describe('FormulaireRechercheStages3eEt2de', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	it('quand la query comporte la localisation, ajoute la valeur correspondante dans l‘input', () => {
		const routerPush = vi.fn();

		mockUseRouter({
			push: routerPush, query: {
				...aCommuneQuery({
					codeCommune: '75056',
					codePostal: '75006',
					latitudeCommune: '48.859',
					longitudeCommune: '2.347',
					ville: 'Paris',
				}),
				distanceCommune: '100',
			},
		});
		render(
			<DependenciesProvider
				localisationService={aLocalisationService()}
				stage3eEt2deService={aStage3eEt2deService()}
				metierStage3eEt2deService={aMetierService()}>
				<FormulaireRechercheStages3eEt2de />
			</DependenciesProvider>,
		);

		const combobox = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
		expect(combobox).toBeVisible();
		expect(combobox).toHaveValue('Paris (75006)');
		expect(screen.getByDisplayValue('2.347')).toBeInTheDocument();
		expect(screen.getByDisplayValue('48.859')).toBeInTheDocument();
		expect(screen.getByDisplayValue('75056')).toBeInTheDocument();
		expect(screen.getByRole('combobox', { name: 'Rayon Exemple : 30 km' })).toHaveTextContent('100 km');
	});

	it('quand on recherche par métier, ajoute le métier recherché aux query params', async () => {
		// GIVEN
		const routerPush = vi.fn();
		const user = userEvent.setup();

		mockUseRouter({
			push: routerPush, query: {
				...aCommuneQuery({
					codeCommune: '75056',
					codePostal: '75006',
					latitudeCommune: '48.859',
					longitudeCommune: '2.347',
					ville: 'Paris',
				}),
				distanceCommune: '10',
			},
		});
		const metierService = aMetierService();
		vi.spyOn(metierService, 'rechercherMetier').mockResolvedValue(createSuccess([
			{ code: 'codeMetier', label: 'boulanger' },
		]));
		const localisationService = aLocalisationService();

		render(
			<DependenciesProvider
				localisationService={localisationService}
				stage3eEt2deService={aStage3eEt2deService()}
				metierStage3eEt2deService={metierService}>
				<FormulaireRechercheStages3eEt2de />
			</DependenciesProvider>,
		);

		// WHEN
		const inputRechercheMetier = screen.getByRole('combobox', { name: 'Métier (facultatif) Exemples : boulangerie, enseignement' });
		await user.type(inputRechercheMetier, 'boulanger');
		const boulangerOption = await screen.findByRole('option', { name: 'boulanger' });
		await user.click(boulangerOption);
		const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
		await user.click(buttonRechercher);

		// THEN
		expect(inputRechercheMetier).toHaveValue('boulanger');
		expect(inputRechercheMetier).toBeValid();
		expect(screen.getByRole('search', { name: 'Rechercher un stage de 3e et 2de' })).toBeValid();
		expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('libelleMetier=boulanger&codeMetier=codeMetier') }, undefined, { shallow: true });
	});

	it('quand on recherche par localisation, ajoute la localisation aux query params', async () => {
		const routerPush = vi.fn();
		const user = userEvent.setup();
		mockUseRouter({ push: routerPush });

		const localisationService = aLocalisationService();
		const commune = aCommune({
			codePostal: '75006',
			ville: 'Paris',
		});

		vi.spyOn(localisationService, 'rechercherCommune').mockResolvedValue(createSuccess(aRésultatsRechercheCommune([commune])));
		render(
			<DependenciesProvider
				stage3eEt2deService={aStage3eEt2deService()}
				metierStage3eEt2deService={aMetierService()}
				localisationService={localisationService}>
				<FormulaireRechercheStages3eEt2de />
			</DependenciesProvider>,
		);

		// WHEN
		const comboboxLocalisation = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
		await user.type(comboboxLocalisation, 'Paris');

		const boulangerOption = await screen.findByRole('option', { name: 'Paris (75006)' });
		await user.click(boulangerOption);

		const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
		await user.click(buttonRechercher);

		expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codeCommune=75056') }, undefined, { shallow: true });
		expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('latitudeCommune=48.859&longitudeCommune=2.347') }, undefined, { shallow: true });
		expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codePostal=75006') }, undefined, { shallow: true });
		expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('ville=Paris') }, undefined, { shallow: true });
		expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('distanceCommune=10') }, undefined, { shallow: true });
	});

	it('ne lance pas la recherche si la localisation n‘est pas présente', async () => {
		mockUseRouter({});
		const user = userEvent.setup();
		const stage3eEt2deService = aStage3eEt2deService();
		render(
			<DependenciesProvider
				stage3eEt2deService={stage3eEt2deService}
				metierStage3eEt2deService={aMetierService()}
				localisationService={aLocalisationService()}>
				<FormulaireRechercheStages3eEt2de />
			</DependenciesProvider>,
		);

		const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
		await user.click(buttonRechercher);

		expect(stage3eEt2deService.rechercherStage3eEt2de).not.toHaveBeenCalled();
	});
});
