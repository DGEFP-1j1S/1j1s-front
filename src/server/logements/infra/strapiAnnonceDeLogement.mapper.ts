import { Image } from '~/server/cms/domain/image';

import { AnnonceDeLogement } from '../domain/annonceDeLogement';
import { StrapiAnnonceDeLogement } from './strapiAnnonceDeLogement';

export function mapAnnonceLogement(annonceLogementResponse: StrapiAnnonceDeLogement): AnnonceDeLogement {
	return {
		bilanEnergetique: annonceLogementResponse.bilanEnergetique,
		charge: annonceLogementResponse.charge,
		dateDeDisponibilite: new Date(annonceLogementResponse.dateDeDisponibilite),
		dateDeMiseAJour: new Date(annonceLogementResponse.sourceUpdatedAt),
		description: annonceLogementResponse.description,
		devise: annonceLogementResponse.devise,
		garantie: annonceLogementResponse.garantie,
		imageList: annonceLogementResponse.imagesUrl?.map(mapImage) || [],
		localisation: annonceLogementResponse.localisation,
		meuble: annonceLogementResponse.meuble,
		nombreDePieces: annonceLogementResponse.nombreDePieces,
		prix: annonceLogementResponse.prix,
		prixHT: annonceLogementResponse.prixHT,
		servicesInclus: annonceLogementResponse.servicesInclus.map((service) => service.nom),
		servicesOptionnels: annonceLogementResponse.servicesOptionnels.map((service) => service.nom),
		source: annonceLogementResponse.source,
		surface: annonceLogementResponse.surface,
		surfaceMax: annonceLogementResponse.surfaceMax,
		titre: annonceLogementResponse.titre,
		type: annonceLogementResponse.type,
		typeBien: annonceLogementResponse.typeBien,
		urlDeCandidature: annonceLogementResponse.url,
		etage: annonceLogementResponse.etage,
	};
}

function mapImage(imageUrl: { value: string }): Image {
	return {
		alt: '',
		src: imageUrl.value,
	};
}
