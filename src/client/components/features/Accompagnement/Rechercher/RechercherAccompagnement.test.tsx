import { render, screen, within } from '@testing-library/react';
import React from 'react';

import {
	RechercherAccompagnement,
} from '~/client/components/features/Accompagnement/Rechercher/RechercherAccompagnement';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import {
	anEtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.fixture';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { createFailure, createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { TypeÉtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {
	anEtablissementAccompagnement,
	anEtablissementAccompagnementList,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

describe('RechercherAccompagnement', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('quand aucune recherche n‘est lancée', () => {
		it('affiche un formulaire de recherche, sans résultat ou message d‘erreur', () => {
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationServiceMock = aLocalisationService();

			mockUseRouter({});
			render(
				<DependenciesProvider
					localisationService={localisationServiceMock}
					établissementAccompagnementService={établissementAccompagnementService}>
					<RechercherAccompagnement />
				</DependenciesProvider>,
			);

			// WHEN
			const formulaireRechercheEtablissementAccompagnement = screen.getByRole('form');
			const résultatRechercheEtablissementAccompagnementList = screen.queryByRole('list', { name: 'Établissements d‘accompagnement' });
			const rechercheEtablissementAccompagnementNombreResultats = screen.queryByRole('heading', {
				level: 2,
				name: /établissement/,
			});
			const zeroResultsMessage = screen.queryByText('0 résultat');
			const errorMessage = screen.queryByText('Erreur - Demande incorrecte');

			// THEN
			expect(formulaireRechercheEtablissementAccompagnement).toBeInTheDocument();
			expect(résultatRechercheEtablissementAccompagnementList).not.toBeInTheDocument();
			expect(rechercheEtablissementAccompagnementNombreResultats).not.toBeInTheDocument();
			expect(zeroResultsMessage).not.toBeInTheDocument();
			expect(errorMessage).not.toBeInTheDocument();
		});
	});

	describe('quand on recherche un établissement d‘accompagnement', () => {
		describe('quand aucun résultat ne correspond à la recherche', () => {
			it('affiche un message aucun résultat', async () => {
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				établissementAccompagnementService.rechercher = vi.fn().mockResolvedValue(createSuccess([]));
				const localisationServiceMock = aLocalisationService();

				mockUseRouter({
					query: {
						codeCommune: '75056',
						codePostal: '75006',
						typeAccompagnement: TypeÉtablissement.INFO_JEUNE,
						ville: 'Paris',
					},
				});
				render(
					<DependenciesProvider
						localisationService={localisationServiceMock}
						établissementAccompagnementService={établissementAccompagnementService}>
						<RechercherAccompagnement />
					</DependenciesProvider>,
				);

				const aucunRésultat = await screen.findByText('0 résultat');
				expect(aucunRésultat).toBeInTheDocument();
			});
		});

		describe('quand le service nous retourne une erreur', () => {
			it('affiche un message d‘erreur', async () => {
				const établissementAccompagnementService = anEtablissementAccompagnementService();
				établissementAccompagnementService.rechercher = vi.fn().mockResolvedValue(createFailure(ErreurMetier.DEMANDE_INCORRECTE));
				const localisationServiceMock = aLocalisationService();

				mockUseRouter({
					query: {
						codeCommune: '75056',
						codePostal: '75006',
						typeAccompagnement: TypeÉtablissement.INFO_JEUNE,
						ville: 'Paris',
					},
				});
				render(
					<DependenciesProvider
						localisationService={localisationServiceMock}
						établissementAccompagnementService={établissementAccompagnementService}>
						<RechercherAccompagnement />
					</DependenciesProvider>,
				);

				// WHEN
				const demandeIncorrecte = await screen.findByText('Erreur - Demande incorrecte');
				expect(demandeIncorrecte).toBeInTheDocument();
			});
		});

		describe('quand on filtre par localisation et type d‘accompagnement', () => {
			it('retourne des établissements liés à la localisation et type d‘accompagnement', async () => {
				const etablissementAccompagnementService = anEtablissementAccompagnementService();
				vi.spyOn(etablissementAccompagnementService, 'rechercher').mockResolvedValue(createSuccess([
					anEtablissementAccompagnement({ id: '1', nom: 'Point information jeunesse - Saint-Céré' }),
					anEtablissementAccompagnement({ id: '2', nom: 'Point information jeunesse - Figeac' }),
					anEtablissementAccompagnement({ id: '3', nom: 'Point information jeunesse - Saint-Céré' }),
				]));
				const localisationServiceMock = aLocalisationService();

				mockUseRouter({
					query: {
						codeCommune: '75056',
						codePostal: '75006',
						typeAccompagnement: TypeÉtablissement.INFO_JEUNE,
						ville: 'Paris',
					},
				});
				render(
					<DependenciesProvider
						localisationService={localisationServiceMock}
						établissementAccompagnementService={etablissementAccompagnementService}>
						<RechercherAccompagnement />
					</DependenciesProvider>,
				);

				// WHEN
				const résultatRechercheÉtablissementAccompagnementListHeader = await screen.findByRole('list', { name: 'Établissements d‘accompagnement' });
				const résultatRechercheÉtablissementAccompagnementTitle = await within(résultatRechercheÉtablissementAccompagnementListHeader).findAllByRole('heading', { level: 3 });

				const rechercheÉtablissementAccompagnementNombreRésultats = await screen.findByText('3 établissements d‘accompagnement pour les structures Infos Jeunes');

				// THEN
				expect(résultatRechercheÉtablissementAccompagnementTitle).toHaveLength(3);

				expect(rechercheÉtablissementAccompagnementNombreRésultats).toBeInTheDocument();
				expect(résultatRechercheÉtablissementAccompagnementTitle[0].textContent).toEqual('Point information jeunesse - Saint-Céré');
				expect(résultatRechercheÉtablissementAccompagnementTitle[1].textContent).toEqual('Point information jeunesse - Figeac');
				expect(résultatRechercheÉtablissementAccompagnementTitle[2].textContent).toEqual('Point information jeunesse - Saint-Céré');
			});
		});

		it('affiche les informations des cards', () => {
			// Given
			mockUseRouter({});
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationService = aLocalisationService();
			render(
				<DependenciesProvider
					établissementAccompagnementService={établissementAccompagnementService}
					localisationService={localisationService}>
					<RechercherAccompagnement />
				</DependenciesProvider>,
			);

			// When
			const partenaireList = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
			const partenaireListItemList = within(partenaireList).getAllByRole('listitem');
			// Then
			expect(partenaireList).toBeInTheDocument();
			expect(partenaireListItemList).toHaveLength(3);
			partenaireListItemList.forEach((partenaireListItem) => {
				expect(within(partenaireListItem).getByRole('link')).toBeInTheDocument();
			});
		});
	});

	describe('quand la localisation ou le type d‘accompagnement est manquant', () => {
		it('n‘effectue pas la recherche', async () => {
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const localisationServiceMock = aLocalisationService();

			mockUseRouter({});
			render(
				<DependenciesProvider
					localisationService={localisationServiceMock}
					établissementAccompagnementService={établissementAccompagnementService}>
					<RechercherAccompagnement />
				</DependenciesProvider>,
			);

			// WHEN
			const résultatRechercheÉtablissementAccompagnementListHeader = screen.queryByRole('list', { name: 'Établissements d‘accompagnement' });
			const rechercheÉtablissementAccompagnementNombreRésultats = screen.queryByText('3 établissements d‘accompagnement pour les structures Infos Jeunes');

			// THEN
			expect(résultatRechercheÉtablissementAccompagnementListHeader).not.toBeInTheDocument();
			expect(rechercheÉtablissementAccompagnementNombreRésultats).not.toBeInTheDocument();
		});
	});

	describe('quand le type d‘accompagnement est Mission Locale', () => {
		it('affiche le bouton "Je souhaite être rappelé"', async () => {
			const établissementAccompagnementService = anEtablissementAccompagnementService();
			const anEtablissementMissionLocalList = anEtablissementAccompagnementList({ type: TypeÉtablissement.MISSION_LOCALE });
			vi.spyOn(établissementAccompagnementService, 'rechercher').mockResolvedValue(createSuccess(anEtablissementMissionLocalList));
			const localisationServiceMock = aLocalisationService();

			mockUseRouter({
				query: {
					codeCommune: '75056',
					codePostal: '75006',
					typeAccompagnement: TypeÉtablissement.MISSION_LOCALE,
					ville: 'Paris',
				},
			});
			render(
				<DependenciesProvider
					localisationService={localisationServiceMock}
					établissementAccompagnementService={établissementAccompagnementService}>
					<RechercherAccompagnement />
				</DependenciesProvider>,
			);

			// WHEN
			const résultatRechercheÉtablissementAccompagnementListHeader = await screen.findByRole('list', { name: 'Établissements d‘accompagnement' });
			const résultatRechercheÉtablissementAccompagnementButton = within(résultatRechercheÉtablissementAccompagnementListHeader).getAllByRole('button', { name: 'Je souhaite être contacté(e)' })[0];

			// THEN
			expect(résultatRechercheÉtablissementAccompagnementButton).toBeVisible();
		});
	});
});
