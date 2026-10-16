import { render, screen, within } from '@testing-library/react';

import { OffreDeStage } from '~/client/components/features/OffreDeStage/OffreDeStage';
import {
	aLocalisationStageIndexee,
	anOffreDeStageIndexee,
} from '~/client/components/features/OffreDeStage/offreDeStageIndexee.fixture';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { DomainesStage } from '~/server/stages/repository/domainesStage';

describe('Une carte d’offre de stage affiche des étiquettes', () => {

	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	function someDummy() {
		return;
	}

	describe('concernant les domaines du stage', () => {
		it('un domaine "Non renseigné" n’est pas affiché', () => {
			const displayedDomain = DomainesStage.MAINTENANCE;
			const displayedFormattedDomain = 'Qualité / Maintenance';
			const offreStage = anOffreDeStageIndexee({ domaines: [displayedDomain, DomainesStage.NON_RENSEIGNE] });

			render(<DependenciesProvider dateService={aDateService()}>
				<OffreDeStage hit={offreStage} sendEvent={someDummy} />
			</DependenciesProvider>,
			);

			const displayedTagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
			const displayedTagsTextContents = within(displayedTagsList).queryAllByRole('listitem').map((listItem) => listItem.textContent);
			expect(displayedTagsTextContents).toContain(displayedFormattedDomain);
			expect(displayedTagsTextContents).not.toContain('Non Renseigné');
		});
	});

	describe('concernant la localisation du stage', () => {
		it('si la ville est connue, affiche la ville', () => {
			const localisationWithCity = aLocalisationStageIndexee({ ville: 'Paris' });

			const offreStage = anOffreDeStageIndexee({ localisation: localisationWithCity });

			render(<DependenciesProvider dateService={aDateService()}>
				<OffreDeStage hit={offreStage} sendEvent={someDummy} />
			</DependenciesProvider>,
			);

			const displayedTagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
			const displayedTagsTextContents = within(displayedTagsList).queryAllByRole('listitem').map((listItem) => listItem.textContent);
			expect(displayedTagsTextContents).toContain(localisationWithCity.ville);
		});
		it('si la ville n’est pas connue, mais le département est connue, affiche le département', () => {
			const localisationWithDepartment = aLocalisationStageIndexee({ departement: 'Val de marne', ville: undefined });

			const offreStage = anOffreDeStageIndexee({ localisation: localisationWithDepartment });

			render(<DependenciesProvider dateService={aDateService()}>
				<OffreDeStage hit={offreStage} sendEvent={someDummy} />
			</DependenciesProvider>);

			const displayedTagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
			const displayedTagsTextContents = within(displayedTagsList).queryAllByRole('listitem').map((listItem) =>
				listItem.textContent);
			expect(displayedTagsTextContents).toContain(localisationWithDepartment.departement);
		});
		it('si ni la ville, ni le département ne sont connus, mais que la région est connue, affiche la région', () => {
			const localisationWithRegion = aLocalisationStageIndexee({
				departement: undefined,
				region: 'Ile de France',
				ville: undefined,
			});

			const offreStage = anOffreDeStageIndexee({ localisation: localisationWithRegion });

			render(<DependenciesProvider dateService={aDateService()}>
				<OffreDeStage hit={offreStage} sendEvent={someDummy} />
			</DependenciesProvider>);

			const displayedTagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
			const displayedTagsTextContents = within(displayedTagsList).queryAllByRole('listitem').map((listItem) =>
				listItem.textContent);
			expect(displayedTagsTextContents).toContain(localisationWithRegion.region);
		});
	});

	describe('concernant la durée du stage', () => {
		it('une durée catégorisée "Non renseignée" n’est pas affichée', () => {
			const offreStage = anOffreDeStageIndexee({ dureeCategorisee: 'Non renseigné' });

			render(<DependenciesProvider dateService={aDateService()}>
				<OffreDeStage hit={offreStage} sendEvent={someDummy} />
			</DependenciesProvider>);

			const displayedTagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
			const displayedTagsTextContents = within(displayedTagsList).queryAllByRole('listitem').map((listItem) =>
				listItem.textContent);
			expect(displayedTagsTextContents).not.toContain('Non renseigné');
		});
	});

	describe('concernant la date de début du stage', () => {
		describe('quand la date de début est une date précise', () => {
			it('la date précise est affichée', () => {
				const datePrecise = '2024-09-01';
				const offreStage = anOffreDeStageIndexee({ dateDeDebutMax: datePrecise, dateDeDebutMin: datePrecise });
				const dateService = aDateService();
				vi.spyOn(dateService, 'formatToHumanReadableDate').mockReturnValue('1 septembre 2024');

				render(<DependenciesProvider dateService={dateService}>
					<OffreDeStage hit={offreStage} sendEvent={someDummy} />
				</DependenciesProvider>);

				const tags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
				const tagDateDebut = within(tags).getAllByRole('listitem')
					.find((listItem) => listItem.textContent === 'Débute le 1 septembre 2024');
				expect(tagDateDebut).toBeVisible();
			});
		});

		describe('quand la date de début est une période de date', () => {
			it('la période de date de début est affichée', () => {
				const datePeriodeDebut = '2024-09-01';
				const datePeriodeFin = '2024-09-30';
				const offreStage = anOffreDeStageIndexee({
					dateDeDebutMax: datePeriodeFin,
					dateDeDebutMin: datePeriodeDebut,
				});

				const dateService = aDateService();
				vi.spyOn(dateService, 'formatToHumanReadableDate')
					.mockReturnValueOnce('1 septembre 2024')
					.mockReturnValueOnce('30 septembre 2024');

				render(<DependenciesProvider dateService={dateService}>
					<OffreDeStage hit={offreStage} sendEvent={someDummy} />
				</DependenciesProvider>);

				const tags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
				const tagDateDebut = within(tags).getAllByRole('listitem')
					.find((listItem) => listItem.textContent === 'Débute entre le 1 septembre 2024 et le 30 septembre 2024');
				expect(tagDateDebut).toBeVisible();
			});
		});

		describe('quand la date de début n’est pas définie', () => {
			it('le tag n’est pas affiché', () => {
				const offreStage = anOffreDeStageIndexee({ dateDeDebutMin: undefined });

				render(<DependenciesProvider dateService={aDateService()}>
					<OffreDeStage hit={offreStage} sendEvent={someDummy} />
				</DependenciesProvider>);

				const tags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
				const tagDateDebut = within(tags).getAllByRole('listitem')
					.find((listItem) => listItem.textContent?.includes('Débute le')) ?? null;
				expect(tagDateDebut).not.toBeInTheDocument();
			});
		});
	});

	describe('quand il n’y a aucune information concernant les domaines, la localisation, la duréecategorisée', () => {
		it('n’affiche aucune étiquettes les concernant, seule la date de début est affichée', () => {
			const offreStage = anOffreDeStageIndexee({
				domaines: [],
				dureeCategorisee: undefined,
				localisation: aLocalisationStageIndexee({
					departement: undefined,
					region: undefined,
					ville: undefined,
				}),
			});
			const dateService = aDateService();
			vi.spyOn(dateService, 'formatToHumanReadableDate').mockReturnValue('1 septembre 2024');

			render(<DependenciesProvider dateService={dateService}>
				<OffreDeStage hit={offreStage} sendEvent={someDummy} />
			</DependenciesProvider>);

			const displayedTagsList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
			const displayedTagsTextContents = within(displayedTagsList).queryAllByRole('listitem').map((listItem) => listItem.textContent);
			expect(displayedTagsTextContents).toHaveLength(1);
			expect(displayedTagsTextContents[0]).toBe('Débute le 1 septembre 2024');
		});
	});
})
;
