import { Either } from '~/server/errors/either';
import { FicheMétierHttp } from '~/server/fiche-metier/domain/ficheMetierHttp';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

export const NOMBRE_RESULTATS_FICHE_METIER_PAR_PAGE = 15;

/** fiche métier telle qu‘indexée : les champs imbriqués (centres d‘intérêt…) n‘y sont que des libellés */
export type FicheMetierIndexee = Partial<Pick<FicheMétierHttp, 'accroche_metier' | 'nom_metier'>>;

export interface FiltreRechercheFicheMetier {
	motCle?: string
	centresInteret: Array<string>
	page: number
}

export interface ResultatsRechercheFicheMetier {
	nombreDeResultats: number
	resultats: Array<FicheMetierIndexee>
	facettes: {
		centresInteret: Array<Facette>
	}
}

export interface RechercheFicheMetierRepository {
	rechercher(filtre: FiltreRechercheFicheMetier): Promise<Either<ResultatsRechercheFicheMetier>>
}
