import { AnnonceDeLogementService } from '~/server/logements/domain/annonceDeLogement';
import { anAnnonceDeLogement } from '~/server/logements/domain/annonceDeLogement.fixture';
import { aStrapiAnnonceDeLogement } from '~/server/logements/infra/strapiAnnonceDeLogement.fixture';
import { mapAnnonceLogement } from '~/server/logements/infra/strapiAnnonceDeLogement.mapper';

describe('Strapi annonce de logement mapper', () => {
	it('map vers une annonce de logement', () => {
		// GIVEN
		const strapiAnnonceDeLogement = aStrapiAnnonceDeLogement({
			bilanEnergetique: {
				consommationEnergetique: 'A',
				emissionDeGaz: 'B',
			},
			charge: 100,
			dateDeDisponibilite: '11/11/11',
			description: 'appart à saisir',
			devise: '€',
			etage: 1,
			garantie: 50,
			localisation: { ville: 'paris' },
			meuble: true,
			nombreDePieces: 1,
			prix: 1000,
			prixHT: 980,
			servicesInclus: [
				{ nom: AnnonceDeLogementService.INTERNET },
				{ nom: AnnonceDeLogementService.ASPIRATEUR },
			],
			servicesOptionnels: [
				{ nom: AnnonceDeLogementService.TV },
				{ nom: AnnonceDeLogementService.LOCAL_A_VELO },
			],
			slug: 'logement-slug',
			source: 'immojeune',
			sourceCreatedAt: new Date('2022-01-01T00:00:00.000Z'),
			sourceUpdatedAt: new Date('2022-01-01T00:00:00.000Z'),
			surface: 10,
			surfaceMax: 12,
			titre: 'mon titre',
			type: 'Location',
			typeBien: 'Appartement',
			url: 'lien-immo-jeune.com',
		});

		// WHEN
		const resultAnnonceDeLogement = mapAnnonceLogement(strapiAnnonceDeLogement);

		// THEN
		expect(resultAnnonceDeLogement).toStrictEqual(anAnnonceDeLogement({
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
			urlDeCandidature: 'lien-immo-jeune.com',
			etage: 1,
		}));
	});
	it('la liste d’images est correctement mappée', () => {
		// GIVEN
		const strapiAnnonceDeLogement = aStrapiAnnonceDeLogement({
			imagesUrl: [
				{ value: '/image/1' },
				{ value: '/image/2' },
			],
		});

		// WHEN
		const resultAnnonceDeLogement = mapAnnonceLogement(strapiAnnonceDeLogement);

		// THEN
		expect(resultAnnonceDeLogement).toStrictEqual(anAnnonceDeLogement({
			imageList: [
				{
					alt: '',
					src: '/image/1',
				},
				{
					alt: '',
					src: '/image/2',
				},
			],
		}));
	});
});
