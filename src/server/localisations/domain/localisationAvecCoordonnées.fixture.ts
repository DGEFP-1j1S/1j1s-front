import {
	Commune,
	RésultatsRechercheCommune,
} from './localisationAvecCoordonnées';
import { LocalisationAvecCoordonnéesRepository } from './localisationAvecCoordonnées.repository';

export function aLocalisationAvecCoordonnéesRepository() : LocalisationAvecCoordonnéesRepository {
	return {
		getCommuneList: vi.fn(),
	};
}

export function aRésultatsRechercheCommune(communeList?: Array<Commune>): RésultatsRechercheCommune {
	return {
		résultats: communeList ?? aCommuneList(),
	};
}


export function aCommuneList(): Commune[] {
	return [
		aCommune(),
		aCommune({
			code: '75115',
			codePostal: '75015',
			coordonnées: {
				latitude: 48.863367,
				longitude: 2.397152,
			},
			ville: 'Paris 15e Arrondissement',
		}),
	];
}


export function aCommune(override?: Partial<Commune>): Commune{
	return {
		code: '75056',
		codePostal: '75006',
		coordonnées: {
			latitude: 48.859,
			longitude: 2.347,
		},
		ville: 'Paris',
		...override,
	};
}
