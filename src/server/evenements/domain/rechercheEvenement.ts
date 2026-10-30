import { Either } from '~/server/errors/either';

export const NOMBRE_RESULTATS_EVENEMENT_PAR_PAGE = 15;

export type EvenementIndexe = {
	titre: string
	organismeOrganisateur: string
	lieu: string
	dateDebut: string
	dateFin: string
	slug: string
};

export interface FiltreRechercheEvenement {
	motCle?: string
	lieux: Array<string>
	page: number
}

export interface ResultatsRechercheEvenement {
	nombreDeResultats: number
	resultats: Array<EvenementIndexe>
}

export interface RechercheEvenementRepository {
	rechercher(filtre: FiltreRechercheEvenement): Promise<Either<ResultatsRechercheEvenement>>
	rechercherLieux(saisie: string): Promise<Either<Array<string>>>
}
