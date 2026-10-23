import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import {
	FormulaireRechercheOffreEmploi,
} from '~/client/components/features/OffreEmploi/FormulaireRecherche/FormulaireRechercheOffreEmploi';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockScrollIntoView } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { referentielDomaineList } from '~/client/domain/referentielDomaineList';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { CONTRAT_CDD, EXPÉRIENCE_DEBUTANT, TEMPS_PLEIN } from '~/server/offres/domain/offre';

describe('FormulaireRechercheOffreEmploi', () => {
	beforeEach(() => {
		mockScrollIntoView();
		mockLargeScreen();
	});

	describe('quand on filtre', () => {
		beforeEach(() => {
			mockLargeScreen();
		});

		describe('par type de contrat', () => {
			it('ajoute les types de contrat aux query params', async () => {
				const localisationServiceMock = aLocalisationService();
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheOffreEmploi />
					</DependenciesProvider>,
				);

				const selectTypeContrat = screen.getByRole('combobox', { name: 'Types de contrats Exemple : CDI, CDD…' });
				await user.click(selectTypeContrat);

				const inputTypeDeContrat = screen.getByRole('option', { name: CONTRAT_CDD.libelléCourt });
				await user.click(inputTypeDeContrat);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				expect(routerPush).toHaveBeenCalledWith({ query: 'typeDeContrats=CDD&page=1' }, undefined, { scroll: false });
			});
		});

		describe('par domaine', () => {
			it('ajoute le domaine sélectionné aux query params', async () => {
				const localisationServiceMock = aLocalisationService();
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheOffreEmploi />
					</DependenciesProvider>,
				);

				const selectDomaine = screen.getByRole('combobox', { name: 'Domaines Exemple : Commerce, Immobilier…' });
				await user.click(selectDomaine);

				const optionDomaine = screen.getByRole('option', { name: referentielDomaineList[2].libelle });
				await user.click(optionDomaine);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				expect(routerPush).toHaveBeenCalledWith({ query: `grandDomaine=${referentielDomaineList[2].code}&page=1` }, undefined, { scroll: false });
			});
		});

		describe('par niveau demandé', () => {
			it('ajoute le niveau demandé sélectionné aux query params', async () => {
				const localisationServiceMock = aLocalisationService();
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheOffreEmploi />
					</DependenciesProvider>,
				);

				const comboboxNiveau = screen.getByRole('combobox', { name: 'Niveau demandé Exemple : De 1 à 3 ans' });
				await user.selectOptions(comboboxNiveau, EXPÉRIENCE_DEBUTANT.valeur);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				expect(routerPush).toHaveBeenCalledWith({ query: `experienceExigence=${EXPÉRIENCE_DEBUTANT.valeur}&page=1` }, undefined, { scroll: false });
			});
		});

		describe('par temps de travail', () => {
			it('ajoute les temps de travail aux query params', async () => {
				const localisationServiceMock = aLocalisationService();
				const routerPush = vi.fn();
				const user = userEvent.setup();
				mockUseRouter({ push: routerPush });

				render(
					<DependenciesProvider localisationService={localisationServiceMock}>
						<FormulaireRechercheOffreEmploi />
					</DependenciesProvider>,
				);

				const comboboxTempsTravail = screen.getByRole('combobox', { name: 'Temps de travail Exemple : temps plein, temps partiel…' });
				await user.selectOptions(comboboxTempsTravail, TEMPS_PLEIN.valeur);

				const buttonRechercher = screen.getByRole('button', { name: 'Rechercher' });
				await user.click(buttonRechercher);

				expect(routerPush).toHaveBeenCalledWith({ query: `tempsDeTravail=${TEMPS_PLEIN.valeur}&page=1` }, undefined, { scroll: false });
			});
		});
	});

	describe('quand les query params sont présents', () => {
		describe('que le type de localisation est une commune', () => {
			it('rempli automatiquement les champs de recherche', () => {
				mockUseRouter({
					query: {
						codeLocalisation: '75110',
						codePostalLocalisation: '75010',
						experienceExigence: EXPÉRIENCE_DEBUTANT.valeur,
						grandDomaine: referentielDomaineList[0].code,
						motCle: 'Boulanger',
						nomLocalisation: 'Paris',
						tempsDeTravail: 'tempsPlein',
						typeDeContrats: 'CDD',
						typeLocalisation: 'COMMUNE',
					},
				});

				render(
					<DependenciesProvider localisationService={aLocalisationService()}>
						<FormulaireRechercheOffreEmploi />
					</DependenciesProvider>,
				);

				const motCle = screen.getByRole('textbox', { name: /Métier, mot-clé/i });
				expect(motCle).toHaveValue('Boulanger');
				const localisation = screen.getByRole('combobox', { name: /Localisation/i });
				expect(localisation).toHaveValue('Paris (75010)');

				expect(screen.getByRole('option', { hidden: true, name: CONTRAT_CDD.libelléCourt })).toHaveAttribute('aria-selected', 'true');
				expect(screen.getByRole('option', { hidden: true, name: TEMPS_PLEIN.libellé })).toHaveProperty('selected', true);
				expect(screen.getByRole('option', { hidden: true, name: EXPÉRIENCE_DEBUTANT.libellé })).toHaveProperty('selected', true);
				expect(screen.getByRole('option', { hidden: true, name: referentielDomaineList[0].libelle })).toHaveAttribute('aria-selected', 'true');
			});
		});
		describe('que le type de localisation est un département', () => {
			it('rempli automatiquement les champs de recherche', () => {
				mockUseRouter({
					query: {
						codeLocalisation: '75',
						experienceExigence: EXPÉRIENCE_DEBUTANT.valeur,
						grandDomaine: referentielDomaineList[0].code,
						motCle: 'Boulanger',
						nomLocalisation: 'Paris',
						tempsDeTravail: TEMPS_PLEIN.valeur,
						typeDeContrats: 'CDD',
						typeLocalisation: 'DEPARTEMENT',
					},
				});

				render(
					<DependenciesProvider localisationService={aLocalisationService()}>
						<FormulaireRechercheOffreEmploi />
					</DependenciesProvider>,
				);

				const motCle = screen.getByRole('textbox', { name: /Métier, mot-clé/i });
				expect(motCle).toHaveValue('Boulanger');
				const localisation = screen.getByRole('combobox', { name: /Localisation/i });
				expect(localisation).toHaveValue('Paris (75)');

				expect(screen.getByRole('option', { hidden: true, name: CONTRAT_CDD.libelléCourt })).toHaveAttribute('aria-selected', 'true');
				expect(screen.getByRole('option', { hidden: true, name: TEMPS_PLEIN.libellé })).toHaveProperty('selected', true);
				expect(screen.getByRole('option', { hidden: true, name: EXPÉRIENCE_DEBUTANT.libellé })).toHaveProperty('selected', true);
				expect(screen.getByRole('option', { hidden: true, name: referentielDomaineList[0].libelle })).toHaveAttribute('aria-selected', 'true');
			});
		});
	});

	describe('lorsque la recherche est déjà celle affichée', () => {
		it('ne pousse pas de navigation lorsque le formulaire est resoumis inchangé', async () => {
			const routerPush = vi.fn();
			const user = userEvent.setup();
			mockUseRouter({
				asPath: '/emplois?motCle=boulanger&page=1',
				push: routerPush,
				query: { motCle: 'boulanger', page: '1' },
			});

			render(
				<DependenciesProvider localisationService={aLocalisationService()}>
					<FormulaireRechercheOffreEmploi />
				</DependenciesProvider>,
			);

			await user.click(screen.getByRole('button', { name: 'Rechercher' }));

			expect(routerPush).not.toHaveBeenCalled();
		});

		it('pousse quand même la navigation lorsque la page est en état d‘erreur, pour permettre le réessai', async () => {
			const routerPush = vi.fn();
			const user = userEvent.setup();
			mockUseRouter({
				asPath: '/emplois?motCle=boulanger&page=1',
				push: routerPush,
				query: { motCle: 'boulanger', page: '1' },
			});

			render(
				<DependenciesProvider localisationService={aLocalisationService()}>
					<FormulaireRechercheOffreEmploi enEtatErreur />
				</DependenciesProvider>,
			);

			await user.click(screen.getByRole('button', { name: 'Rechercher' }));

			expect(routerPush).toHaveBeenCalledTimes(1);
			expect(routerPush).toHaveBeenCalledWith({ query: 'motCle=boulanger&page=1' }, undefined, { scroll: false });
		});

		it('pousse la navigation lorsque le mot clé est modifié', async () => {
			const routerPush = vi.fn();
			const user = userEvent.setup();
			mockUseRouter({
				asPath: '/emplois?motCle=boulanger&page=1',
				push: routerPush,
				query: { motCle: 'boulanger', page: '1' },
			});

			render(
				<DependenciesProvider localisationService={aLocalisationService()}>
					<FormulaireRechercheOffreEmploi />
				</DependenciesProvider>,
			);

			await user.type(screen.getByRole('textbox', { name: /Métier, mot-clé/i }), 'ie');
			await user.click(screen.getByRole('button', { name: 'Rechercher' }));

			expect(routerPush).toHaveBeenCalledTimes(1);
			expect(routerPush).toHaveBeenCalledWith({ query: 'motCle=boulangerie&page=1' }, undefined, { scroll: false });
		});
	});
});

