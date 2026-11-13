

import { AnnonceDeLogement, AnnonceDeLogementService } from './annonceDeLogement';

export function anAnnonceDeLogement(override?: Partial<AnnonceDeLogement>): AnnonceDeLogement {
	return {
		bilanEnergetique: {
			consommationEnergetique: 'A',
			emissionDeGaz: 'B',
		},
		charge: 100,
		dateDeDisponibilite: new Date('11/11/11'),
		dateDeMiseAJour: new Date('1/1/2022'),
		description: 'appart à saisir',
		devise: '€',
		garantie: 50,
		imageList: [],
		localisation: { ville: 'paris' },
		meuble: true,
		nombreDePieces: 1,
		prix: 1000,
		prixHT: 980,
		servicesInclus: [
			AnnonceDeLogementService.INTERNET,
			AnnonceDeLogementService.ASPIRATEUR,
		],
		servicesOptionnels: [
			AnnonceDeLogementService.TV,
			AnnonceDeLogementService.LOCAL_A_VELO,
		],
		source: 'immojeune',
		surface: 10,
		surfaceMax: 12,
		titre: 'mon titre',
		type: 'Location',
		typeBien: 'Appartement',
		urlDeCandidature: 'https://www.lien-immo-jeune.com',
		etage: 1,
		...override,
	};
}
