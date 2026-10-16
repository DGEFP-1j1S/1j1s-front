import { RemunerationPeriode } from '~/server/stages/domain/remunerationPeriode';
import { DomainesStage } from '~/server/stages/repository/domainesStage';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';
import { OffreStageDepotStrapi, OffreStageResponseStrapi } from '~/server/stages/repository/strapiStages';

export function aStrapiOffreDeStage(override?: Partial<OffreStageResponseStrapi>): OffreStageResponseStrapi {
	return {
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
		remunerationMax: 1000,
		remunerationMin: 1000,
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
		...override,
	};
}

export function aStrapiOffreDeStageDepot(overrides?: Partial<OffreStageDepotStrapi>): OffreStageDepotStrapi {
	return {
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
		identifiantSource: '123456789',
		localisation: {
			adresse: 'Vieux port Marseille',
			codePostal: '13000',
			departement: 'Var',
			pays: 'FR',
			region: 'Provence-Alpes-Côte d\'Azure',
			ville: 'Paris',
		},
		publishedAt: null,
		remunerationMax: 560,
		remunerationMin: 560,
		remunerationPeriode: RemunerationPeriode.MONTHLY,
		source: SourceDesDonnées.INTERNE,
		teletravailPossible: true,
		titre: 'Assistant conducteur train',
		urlDeCandidature: 'mailto:admin@example.com',
		...overrides,
	};
}
