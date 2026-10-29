import { AnnonceDeLogementIndexee } from '~/client/components/features/Logement/AnnonceDeLogementIndexee';
import { Either } from '~/server/errors/either';
import { Facette, Intervalle } from '~/server/services/meilisearch/rechercheIndexee';

export const NOMBRE_RESULTATS_ANNONCE_DE_LOGEMENT_PAR_PAGE = 9;

export interface FiltreRechercheAnnonceDeLogement {
	ville?: string
	typesOffre: Array<string>
	typesBien: Array<string>
	prix: Intervalle
	surface: Intervalle
	page: number
}

export interface ResultatsRechercheAnnonceDeLogement {
	nombreDeResultats: number
	resultats: Array<AnnonceDeLogementIndexee>
	facettes: {
		typesOffre: Array<Facette>
		typesBien: Array<Facette>
	}
}

export interface RechercheAnnonceDeLogementRepository {
	rechercher(filtre: FiltreRechercheAnnonceDeLogement): Promise<Either<ResultatsRechercheAnnonceDeLogement>>
}
