import { ResultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnees';
import { ApiAdresseResponse } from '~/server/localisations/infra/repositories/apiAdresse.response';

export function mapRésultatsRechercheCommune(response: ApiAdresseResponse): ResultatsRechercheCommune {
	return {
		résultats: response.features.map(({ properties, geometry }) => {
			return {
				code: properties.citycode,
				codePostal: properties.postcode,
				coordonnées: {
					latitude: geometry.coordinates[1],
					longitude: geometry.coordinates[0],
				},
				ville: properties.city,
			};
		}),
	};
}
