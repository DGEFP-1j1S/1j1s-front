import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import {
	FormulaireRechercheAlternance,
} from '~/client/components/features/Alternance/Rechercher/FormulaireRecherche/FormulaireRechercheAlternance';
import { Metier } from '~/client/components/ui/Form/Combobox/ComboboxMetiers/Metier';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aMetier, aMetierService } from '~/client/services/metiers/metier.fixture';
import { createSuccess } from '~/server/errors/either';
import { aListeDeMetierLaBonneAlternance } from '~/server/metiers/domain/metierAlternance.fixture';

describe('FormulaireRechercheAlternance', () => {
	beforeEach(() => {
		mockSmallScreen();
	});
	describe('quand le composant est affiché sans recherche', () => {
		it('affiche un formulaire pour la recherche d‘alternance, sans échantillon de résultat', async () => {
			// GIVEN
			const localisationService = aLocalisationService();
			mockUseRouter({});

			// WHEN
			render(
				<DependenciesProvider
					localisationService={localisationService}
					metierLbaService={aMetierService()}>
					<FormulaireRechercheAlternance />
				</DependenciesProvider>,
			);
			const formulaireRechercheAlternance = screen.getByRole('form');

			// THEN
			expect(formulaireRechercheAlternance).toBeInTheDocument();
		});
		it('lorsque je séléctionne une commune, affiche le champ rayon', async () => {
			render(
				<DependenciesProvider
					localisationService={aLocalisationService()}
					metierLbaService={aMetierService()}>
					<FormulaireRechercheAlternance />
				</DependenciesProvider>,
			);

			const user = userEvent.setup();

			const comboboxCommune = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
			await user.type(comboboxCommune, 'Pari');
			const localisationOptions = await screen.findAllByRole('option');
			await user.click(localisationOptions[0]);

			expect(screen.getByRole('combobox', { name: 'Rayon Exemple : 30 km' })).toBeVisible();
		});
	});

	describe('lorsqu‘on recherche par localisation et par métier', () => {
		it('les informations de la localisation et du métier sont ajoutées à l’url', async () => {
			// Given
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });
			const aMetierList: Array<Metier> = [aMetier({
				code: 'F1201,F1202,I1101',
				label: 'Conduite de travaux, direction de chantier',
			})];

			const localisationService = aLocalisationService();
			const metierService = aMetierService();
			vi.spyOn(metierService, 'rechercherMetier').mockResolvedValue(createSuccess(aMetierList));
			// When
			render(
				<DependenciesProvider
					localisationService={localisationService}
					metierLbaService={metierService}>
					<FormulaireRechercheAlternance />
				</DependenciesProvider>,
			);

			const user = userEvent.setup();
			const inputMetiers = screen.getByRole('combobox', { name: 'Domaine Exemples : boulangerie, enseignement' });
			await user.type(inputMetiers, 'boulang');
			const firstMetierOption = await screen.findByRole('option', { name: aListeDeMetierLaBonneAlternance()[0].label });
			await user.click(firstMetierOption);


			const comboboxCommune = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
			await user.type(comboboxCommune, 'Pari');
			const localisationOptions = await screen.findAllByRole('option');
			await user.click(localisationOptions[0]);

			const submitButton = screen.getByRole('button', { name: 'Rechercher' });
			await user.click(submitButton);

			// Then
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('libelleMetier=Conduite+de+travaux%2C+direction+de+chantier') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codeRomes=F1201%2CF1202%2CI1101') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codeCommune=75056') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('latitudeCommune=48.859') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('longitudeCommune=2.347') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('codePostal=75006') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('ville=Paris') }, undefined, { scroll: false });
			expect(routerPush).toHaveBeenCalledWith({ query: expect.stringContaining('distanceCommune=10') }, undefined, { scroll: false });
		});
	});

	describe('lorsqu‘on recherche par métier mais pas par commune', () => {
		it('n‘effectue pas de recherche', async () => {
			// Given
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });
			const aMetierList: Array<Metier> = [aMetier({
				code: 'F1201,F1202,I1101',
				label: 'Conduite de travaux, direction de chantier',
			})];

			const localisationService = aLocalisationService();
			const metierService = aMetierService();
			vi.spyOn(metierService, 'rechercherMetier').mockResolvedValue(createSuccess(aMetierList));
			// When
			render(
				<DependenciesProvider
					localisationService={localisationService}
					metierLbaService={metierService}>
					<FormulaireRechercheAlternance />
				</DependenciesProvider>,
			);

			const user = userEvent.setup();
			const inputMetiers = screen.getByRole('combobox', { name: 'Domaine Exemples : boulangerie, enseignement' });
			await user.type(inputMetiers, 'boulang');
			const firstMetierOption = await screen.findByRole('option', { name: aListeDeMetierLaBonneAlternance()[0].label });
			await user.click(firstMetierOption);

			const submitButton = screen.getByRole('button', { name: 'Rechercher' });
			await user.click(submitButton);

			// Then
			expect(routerPush).not.toHaveBeenCalled();
		});
	});

	describe('lorsqu‘on recherche par commune mais pas par métier', () => {
		it('n‘effectue pas de recherche', async () => {
			// Given
			const routerPush = vi.fn();
			mockUseRouter({ push: routerPush });
			const aMetierList: Array<Metier> = [aMetier({
				code: 'F1201,F1202,I1101',
				label: 'Conduite de travaux, direction de chantier',
			})];

			const localisationService = aLocalisationService();
			const metierService = aMetierService();
			vi.spyOn(metierService, 'rechercherMetier').mockResolvedValue(createSuccess(aMetierList));
			// When
			render(
				<DependenciesProvider
					localisationService={localisationService}
					metierLbaService={metierService}>
					<FormulaireRechercheAlternance />
				</DependenciesProvider>,
			);

			const user = userEvent.setup();

			const comboboxCommune = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
			await user.type(comboboxCommune, 'Pari');
			const localisationsOptions = await screen.findAllByRole('option');
			await user.click(localisationsOptions[0]);

			const submitButton = screen.getByRole('button', { name: 'Rechercher' });
			await user.click(submitButton);

			// Then
			expect(routerPush).not.toHaveBeenCalled();
		});
	});

	it('rempli automatiquement les champs lorsque les query params sont présents', () => {
		mockUseRouter({
			query: {
				codeRomes: 'D1102,D1104',
				distanceCommune: '10',
				libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
				...aCommuneQuery({
					codeCommune: '75056',
					codePostal: '75001',
					latitudeCommune: '48.859',
					longitudeCommune: '2.347',
					ville: 'Paris',
				}),
			},
		});

		render(
			<DependenciesProvider localisationService={aLocalisationService()} metierLbaService={aMetierService()}>
				<FormulaireRechercheAlternance />
			</DependenciesProvider>,
		);

		const inputMetiers = screen.getByRole('combobox', { name: 'Domaine Exemples : boulangerie, enseignement' });
		expect(inputMetiers).toHaveValue('Boulangerie, pâtisserie, chocolaterie');
		const localisation = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
		expect(localisation).toHaveValue('Paris (75001)');

		const comboboxRayon = screen.getByRole('combobox', { name: 'Rayon Exemple : 30 km' });
		expect(comboboxRayon).toHaveTextContent('10 km');
		expect(screen.getByDisplayValue('10')).toBeInTheDocument();
	});

	it('laisse le champ domaine vide quand il manque les codes romes dans les query params', () => {
		mockUseRouter({
			query: {
				libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
			},
		});

		render(
			<DependenciesProvider localisationService={aLocalisationService()} metierLbaService={aMetierService()}>
				<FormulaireRechercheAlternance />
			</DependenciesProvider>,
		);

		const inputMetiers = screen.getByRole('combobox', { name: 'Domaine Exemples : boulangerie, enseignement' });
		expect(inputMetiers).toHaveValue('');
		const form = screen.getByRole('form');
		expect(form).not.toHaveFormValues({
			codeRomes: expect.anything(),
			libelleMetier: expect.anything(),
		});
	});
	it('laisse le champ domaine vide quand il manque le libellé dans les query params', () => {
		mockUseRouter({
			query: {
				codeRomes: 'D1102,D1104',
			},
		});

		render(
			<DependenciesProvider localisationService={aLocalisationService()} metierLbaService={aMetierService()}>
				<FormulaireRechercheAlternance />
			</DependenciesProvider>,
		);

		const domaine = screen.getByRole('combobox', { name: /Domaine/i });
		expect(domaine).toHaveValue('');
		const form = screen.getByRole('form');
		expect(form).not.toHaveFormValues({
			codeRomes: expect.anything(),
			libelleMetier: expect.anything(),
		});
	});

	describe('lorsqu‘on effectue une recherche', () => {
		it('appelle la fonction onSubmit', async () => {
			// Given
			const localisationService = aLocalisationService();
			mockUseRouter({});
			const onSubmit = vi.fn();

			// When
			render(
				<DependenciesProvider
					localisationService={localisationService}
					metierLbaService={aMetierService()}>
					<FormulaireRechercheAlternance onSubmit={onSubmit} />
				</DependenciesProvider>,
			);

			const user = userEvent.setup();
			const inputMetiers = screen.getByRole('combobox', { name: 'Domaine Exemples : boulangerie, enseignement' });
			await user.type(inputMetiers, 'boulang');
			const firstMetierOption = await screen.findByRole('option', { name: aListeDeMetierLaBonneAlternance()[0].label });
			await user.click(firstMetierOption);

			const comboboxCommune = screen.getByRole('combobox', { name: 'Localisation Exemples : Paris, Béziers…' });
			await user.type(comboboxCommune, 'Pari');
			const localisationOptions = await screen.findAllByRole('option');
			await user.click(localisationOptions[0]);

			const submitButton = screen.getByRole('button', { name: 'Rechercher' });
			await user.click(submitButton);

			// Then
			expect(onSubmit).toHaveBeenCalled();
		});
	});
});
