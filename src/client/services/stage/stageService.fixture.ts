import { StageService } from '~/client/services/stage/stage.service';
import { createSuccess } from '~/server/errors/either';
import { OffreDeStageDepot, OffreStageDepotEmployeur } from '~/server/stages/domain/stages';
import { DomainesStage } from '~/server/stages/repository/domainesStage';

export function aStageService(override?: Partial<StageService>): StageService {
	return {
		enregistrerOffreDeStage: vi.fn().mockResolvedValue(createSuccess(undefined)),
		rechercherLocalisations: vi.fn().mockResolvedValue(createSuccess([])),
		...override,
	};
}

export function anEmployeurDepotStage(overrides?: Partial<OffreStageDepotEmployeur>): OffreStageDepotEmployeur {
	return {
		description: 'description entreprise',
		email: 'example@example.com',
		logoUrl: 'https://fake-url.com',
		nom: 'SNCF',
		siteUrl: 'https://fake-url.com',
		...overrides,
	};
}

export function anOffreDeStageDepot(overrides?: Partial<OffreDeStageDepot>): OffreDeStageDepot {
	return {
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
		remuneration: 560,
		teletravailPossible: true,
		titre: 'Assistant conducteur train',
		urlDeCandidature: 'mailto:admin@example.com',
		...overrides,
	};
}
