import { Formation, RésultatRechercheFormation } from '~/server/formations/domain/formation';
import { mapNiveauFormation } from '~/server/formations/domain/formation.mapper';
import {
	ID_FORMATION_SEPARATOR,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.repository';

import {
	ApiLaBonneAlternanceFormationRechercheResponse,
	ApiLaBonneAlternanceFormationRechercheResponseFormation,
	ApiLaBonneAlternanceFormationResponse,
} from './apiLaBonneAlternanceFormation';

export const mapRésultatRechercheFormation = (response: ApiLaBonneAlternanceFormationRechercheResponse): Array<RésultatRechercheFormation> => {
	return response.results.map((formation) => ({
		adresse: formation.place?.fullAddress,
		codeCertification: formation.cfd,
		codePostal: formation.place?.zipCode,
		id: mapIdFormation(formation),
		latitude: formation.place?.latitude,
		longitude: formation.place?.longitude,
		nomEntreprise: formation.company?.name,
		tags: [formation.place?.city, mapNiveauFormation(formation.diplomaLevel)],
		titre: formation.title,
	}));
};

function mapIdFormation(
	response: ApiLaBonneAlternanceFormationRechercheResponseFormation,
): RésultatRechercheFormation['id'] {
	return `${response.idRco}${ID_FORMATION_SEPARATOR}${response.cleMinistereEducatif ? response.cleMinistereEducatif : ''}`;
}

export function getCleMinistereEducatif(id: string): string {
	const idArray = id.split(ID_FORMATION_SEPARATOR);
	return idArray[1];
}

export const mapFormation = (response: ApiLaBonneAlternanceFormationResponse): Formation | undefined => {
	if (response.results.length === 0) return;

	const apiFormationResult = response.results[0];
	return {
		adresse: {
			adresseComplete: apiFormationResult.place?.fullAddress,
			codePostal: apiFormationResult.place?.zipCode,
			latitude: apiFormationResult.place?.latitude,
			longitude: apiFormationResult.place?.longitude,
		},
		description: apiFormationResult.training?.description,
		dureeIndicative: undefined, // NOTE (SULI 17-10-2023): LBA doit calculer cette donnée et nous la fournir dans un champ qu'ils nous préciseront
		nomEntreprise: apiFormationResult.company?.name,
		objectif: apiFormationResult.training?.objectif,
		tags: [apiFormationResult.place?.city || ''],
		titre: apiFormationResult.title,
	};
};

export const mapRésultatRechercheFormationToFormation = (résultatRechercheFormation: RésultatRechercheFormation): Formation => ({
	adresse: {
		adresseComplete: résultatRechercheFormation.adresse,
		codePostal: résultatRechercheFormation.codePostal,
		latitude: résultatRechercheFormation.latitude,
		longitude: résultatRechercheFormation.longitude,
	},
	nomEntreprise: résultatRechercheFormation.nomEntreprise,
	tags: [résultatRechercheFormation.tags[0] || ''],
	titre: résultatRechercheFormation.titre,
});
