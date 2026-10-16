import { anOffreDeStageDepot } from '~/client/services/stage/stageService.fixture';
import { RemunerationPeriode } from '~/server/stages/domain/remunerationPeriode';
import { anOffreDeStage } from '~/server/stages/domain/stages.fixture';
import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';
import { aStrapiOffreDeStage, aStrapiOffreDeStageDepot } from '~/server/stages/repository/strapiStages.fixture';
import { mapOffreStage, mapToStrapiDepotOffreDeStage } from '~/server/stages/repository/strapiStages.mapper';

const { mockRandomUUID } = vi.hoisted(() => ({
	mockRandomUUID: vi.fn(() => '123456789'),
}));
vi.mock('crypto', async (importOriginal) => {
	const actual = await importOriginal<typeof import('crypto')>();
	return ({ ...actual, default: { ...actual, randomUUID: mockRandomUUID }, randomUUID: mockRandomUUID });
});
vi.mock('node:crypto', async (importOriginal) => {
	const actual = await importOriginal<typeof import('crypto')>();
	return ({ ...actual, default: { ...actual, randomUUID: mockRandomUUID }, randomUUID: mockRandomUUID });
});
const uuidMocked = '123456789';

describe('strapiStage mapper', () => {
	describe('mapOffreDeStage', () => {
		it('map vers une offre de stage à afficher', () => {
			const offreDeStageResponse = aStrapiOffreDeStage({
				createdAt: '2023-01-06T07:49:10.773Z',
				dateDeDebutMax: '2024-09-01',
				dateDeDebutMin: '2024-09-01',
				description: 'Poste ouvert aux personnes en situation de handicap',
				domaines: [],
				dureeEnJour: 720,
				dureeEnJourMax: 800,
				employeur: {
					description: null,
					email: null,
					logoUrl: null,
					nom: 'La Relève',
					siteUrl: null,
				},
				id: 'anId',
				identifiantSource: '036780b7-95ba-4711-bf26-471d1f95051c',
				localisation: {
					adresse: null,
					codePostal: null,
					departement: null,
					pays: 'France',
					region: null,
					ville: null,
				},
				publishedAt: '2023-01-06T07:49:10.756Z',
				remunerationMax: 1100,
				remunerationMin: 900,
				remunerationPeriode: RemunerationPeriode.MONTHLY,
				slug: 'alternance-audit-tours-h-f-036780b7-95ba-4711-bf26-471d1f95051c',
				source: 'jobteaser' as SourceDesDonnées,
				sourceCreatedAt: '',
				sourcePublishedAt: '',
				sourceUpdatedAt: '',
				teletravailPossible: true,
				titre: 'Alternance Audit - Tours ( H/F)',
				updatedAt: '2023-01-06T07:49:10.773Z',
				urlDeCandidature: 'https://www.jobteaser.com/en/job-offers/10067252',
			});


			const result = mapOffreStage(offreDeStageResponse);
			const expectedResult = anOffreDeStage({
				dateDeDebutMax: '2024-09-01',
				dateDeDebutMin: '2024-09-01',
				description: 'Poste ouvert aux personnes en situation de handicap',
				domaines: [],
				dureeEnJour: 720,
				dureeEnJourMax: 800,
				employeur: {
					nom: 'La Relève',
				},
				id: 'anId',
				localisation: {
					pays: 'France',
				},
				remunerationMax: 1100,
				remunerationMin: 900,
				remunerationPeriode: RemunerationPeriode.MONTHLY,
				slug: 'alternance-audit-tours-h-f-036780b7-95ba-4711-bf26-471d1f95051c',
				source: SourceDesDonnées.JOBTEASER,
				teletravailPossible: true,
				titre: 'Alternance Audit - Tours ( H/F)',
				urlDeCandidature: 'https://www.jobteaser.com/en/job-offers/10067252',
			});
			expect(result).toEqual(expectedResult);
		});
	});
	describe('mapToStrapiDepotOffreDeStage', () => {
		it('map vers une offre de stage à enregistrer', () => {
			const offreDeStageToSave = anOffreDeStageDepot({
				dateDeDebutMax: '2023-02-03',
				dateDeDebutMin: '2023-02-03',
				description: 'Vous assurez la préparation des commandes clients en prélevant les produits dans les emplacements via le système informatique Vous prenez en charge la réception, le déchargement, le réapprovisionnement des produit Vous gérez la réception des commandes par les clients Vous veillez au rangement et à la propreté de la zone de travail',
				domaine: DomainesStage.ACHAT,
				duree: '30',
				employeur: {
					description: 'description entreprise',
					email: 'example@example.com',
					logoUrl: 'https://fake-url.com',
					nom: 'SNCF',
					siteUrl: 'https://fake-url.com',
				},
				localisation: {
					adresse: 'Vieux port Marseille',
					codePostal: '13000',
					departement: 'Var',
					pays: 'FR',
					region: 'Provence-Alpes-Côte d\'Azure',
					ville: 'Paris',
				},
				teletravailPossible: true,
				titre: 'Assistant conducteur train',
				urlDeCandidature: 'mailto:admin@example.com',
			});

			const offreDeStageMapped = mapToStrapiDepotOffreDeStage(offreDeStageToSave);

			const expectedResult = aStrapiOffreDeStageDepot({
				dateDeDebutMax: '2023-02-03',
				dateDeDebutMin: '2023-02-03',
				description: 'Vous assurez la préparation des commandes clients en prélevant les produits dans les emplacements via le système informatique Vous prenez en charge la réception, le déchargement, le réapprovisionnement des produit Vous gérez la réception des commandes par les clients Vous veillez au rangement et à la propreté de la zone de travail',
				domaines: [
					{ nom: DomainesStage.ACHAT },
				],
				dureeEnJour: 30,
				employeur: {
					description: 'description entreprise',
					email: 'example@example.com',
					logoUrl: 'https://fake-url.com',
					nom: 'SNCF',
					siteUrl: 'https://fake-url.com',
				},
				identifiantSource: uuidMocked,
				localisation: {
					adresse: 'Vieux port Marseille',
					codePostal: '13000',
					departement: 'Var',
					pays: 'FR',
					region: 'Provence-Alpes-Côte d\'Azure',
					ville: 'Paris',
				},
				remunerationMax: 560,
				remunerationMin: 560,
				remunerationPeriode: RemunerationPeriode.MONTHLY,
				teletravailPossible: true,
				titre: 'Assistant conducteur train',
				urlDeCandidature: 'mailto:admin@example.com',
			});

			expect(offreDeStageMapped).toEqual(expectedResult);
		});

		it('lorsque la rémunération n‘est pas présente, ne soumet pas de période de rémunération', () => {
			const offreDeStageToSave = anOffreDeStageDepot({
				remuneration: undefined,
			});

			const offreDeStageMapped = mapToStrapiDepotOffreDeStage(offreDeStageToSave);

			const expectedResult = aStrapiOffreDeStageDepot({
				remunerationMax: undefined,
				remunerationMin: undefined,
				remunerationPeriode: undefined,
			});

			expect(offreDeStageMapped).toEqual(expectedResult);
		});
	});
});

