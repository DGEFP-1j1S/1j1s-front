import { Either } from '~/server/errors/either';
import { Offre, OffreFiltre, OffreId, ResultatsRechercheOffre } from '~/server/offres/domain/offre';

export interface OffreRepository {
    paramètreParDéfaut: string | undefined
    get(id: OffreId): Promise<Either<Offre>>
    search(filtre: OffreFiltre): Promise<Either<ResultatsRechercheOffre>>
}
