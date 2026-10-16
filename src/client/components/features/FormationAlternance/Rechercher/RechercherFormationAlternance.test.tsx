import { render, screen, within } from '@testing-library/react';

import RechercherFormationAlternance
	from '~/client/components/features/FormationAlternance/Rechercher/RechercherFormationAlternance';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import { aLocalisationService } from '~/client/services/localisation/localisation.service.fixture';
import { aMetierService } from '~/client/services/metiers/metier.fixture';
import { NiveauRequisLibelle } from '~/server/formations/domain/formation';
import { aResultatRechercheFormation } from '~/server/formations/domain/formation.fixture';

describe('RechercherFormation', () => {
	beforeEach(() => {
		mockSmallScreen();
	});

	it('affiche un formulaire de recherche et une liste de services en relation', () => {
		mockUseRouter({});
		render(
			<DependenciesProvider
				metierLbaService={aMetierService()}
				localisationService={aLocalisationService()}>
				<RechercherFormationAlternance />
			</DependenciesProvider>,
		);

		expect(screen.getByRole('form')).toBeVisible();
		expect(screen.getByRole('heading', { level: 2, name: 'Découvrez des services faits pour vous' })).toBeVisible();

		const listeDeServices = screen.getByRole('list', { name: 'Liste des partenaires et des services' });
		const campagneApprentissageCard = within(listeDeServices).getByRole('heading', { name: /L’apprentissage est-il fait pour vous ?/i });
		const cpfCard = within(listeDeServices).getByRole('heading', { name: /Découvrez le dispositif Mon compte formation/i });
		const parcoursupCard = within(listeDeServices).getByRole('heading', { name: /La plateforme de pré-inscription en première année de l’enseignement supérieur/i });
		const carifOrefCard = within(listeDeServices).getByRole('heading', { name: /Besoin d’une formation qualifiante pour préparer votre entrée, votre maintien ou votre retour sur le marché du travail ?/i });
		const metiersDuSoinCard = within(listeDeServices).getByRole('heading', { name: /Renseignez-vous sur les métiers du soin/i });
		const pixCard = within(listeDeServices).getByRole('heading', { name: /Testez vous sur Pix !/i });
		expect(campagneApprentissageCard).toBeVisible();
		expect(cpfCard).toBeVisible();
		expect(parcoursupCard).toBeVisible();
		expect(carifOrefCard).toBeVisible();
		expect(metiersDuSoinCard).toBeVisible();
		expect(pixCard).toBeVisible();
	});

	describe('quand la recherche est lancée', () => {
		beforeEach(() => {
			mockUseRouter({
				query: {
					...aCommuneQuery({
						codeCommune: '75056',
						codePostal: '75001',
						latitudeCommune: '48.859',
						longitudeCommune: '2.347',
						ville: 'Paris',
					}),
					codeRomes: 'D1102,D1104',
					distanceCommune: '10',
					libelleMetier: 'Boulangerie, pâtisserie, chocolaterie',
					niveauEtudes: '4',
				},
			});
		});

		it('affiche les résultats sous forme de lien', () => {
			const resultatRechercheFormationAlternance = [
				aResultatRechercheFormation({
					adresse: '1 rue de la République',
					codeCertification: '999',
					id: '123',
					nomEntreprise: 'Glacier Poul',
					tags: ['Paris', NiveauRequisLibelle.NIVEAU_5],
					titre: 'Glacier',
				}),
				aResultatRechercheFormation({ id: '456' }),
			];

			render(
				<DependenciesProvider
					metierLbaService={aMetierService()}
					localisationService={aLocalisationService()}>
					<RechercherFormationAlternance resultats={resultatRechercheFormationAlternance} />
				</DependenciesProvider>,
			);

			const formationsAlternances = screen.getByRole('list', { name: 'Formations en alternance' });
			// NOTE (BRUJ 08-08-2024): getByRole renvoie aussi les descendant indirectes
			// eslint-disable-next-line testing-library/no-node-access
			const formationsAlternancesListCards= formationsAlternances?.querySelectorAll<HTMLElement>(':scope > li');
			expect(formationsAlternancesListCards).toHaveLength(2);

			const firstCard = formationsAlternancesListCards[0];
			expect(within(firstCard).getByRole('heading', { name: 'Glacier' })).toBeVisible();
			expect(within(firstCard).getByText('Glacier Poul')).toBeVisible();
			expect(within(firstCard).getByText('Adresse : 1 rue de la République')).toBeVisible();
			expect(within(firstCard).getByRole('list')).toBeVisible();

			const formationLienCandidature = within(firstCard).getByRole('link');
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('/formations/apprentissage/'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('123?'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('distanceCommune=10'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('niveauEtudes=4'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('codeCommune=75056'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('latitudeCommune=48.859'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('longitudeCommune=2.347'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('ville=Paris'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('codeCertification=999'));
			expect(formationLienCandidature).toHaveAttribute('href', expect.stringContaining('codeRomes=D1102%2CD1104'));
		});

		it('lorsqu‘il n‘y a pas de résultat affiche un message', () => {
			render(
				<DependenciesProvider
					metierLbaService={aMetierService()}
					localisationService={aLocalisationService()}>
					<RechercherFormationAlternance resultats={[]} />
				</DependenciesProvider>,
			);

			expect(screen.getByText('0 résultat')).toBeVisible();
		});

		describe('nombre de résultat', () => {
			it('quand il y a un résultat, affiche le nombre de résultat au singulier', () => {
				const resultatRechercheFormationAlternance = [
					aResultatRechercheFormation(),
				];

				render(
					<DependenciesProvider
						metierLbaService={aMetierService()}
						localisationService={aLocalisationService()}>
						<RechercherFormationAlternance resultats={resultatRechercheFormationAlternance} />
					</DependenciesProvider>,
				);

				expect(screen.getByText('1 formation en alternance pour Boulangerie, pâtisserie, chocolaterie')).toBeVisible();
			});

			it('quand il y a plusieurs résultats, affiche le nombre de résultat au pluriel', () => {
				const resultatRechercheFormationAlternance = [
					aResultatRechercheFormation({ id: '123' }),
					aResultatRechercheFormation({ id: '234' }),
				];

				render(
					<DependenciesProvider
						metierLbaService={aMetierService()}
						localisationService={aLocalisationService()}>
						<RechercherFormationAlternance resultats={resultatRechercheFormationAlternance} />
					</DependenciesProvider>,
				);

				expect(screen.getByText('2 formations en alternance pour Boulangerie, pâtisserie, chocolaterie')).toBeVisible();
			});
		});
	});

	it('quand la recherche n‘est pas lancée, n‘affiche pas de résultat', () => {
		mockUseRouter({});

		render(
			<DependenciesProvider
				metierLbaService={aMetierService()}
				localisationService={aLocalisationService()}>
				<RechercherFormationAlternance />
			</DependenciesProvider>,
		);

		const nbRésultats = screen.queryByText(/^[0-9]+ formation(s)? en alternance$/);
		expect(nbRésultats).not.toBeInTheDocument();
		expect(screen.queryByRole('list', { name: 'Formations en alternance' })).not.toBeInTheDocument();
	});
});

