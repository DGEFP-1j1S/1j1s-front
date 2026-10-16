import { Either } from '~/server/errors/either';
import { Offre, OffreFiltre, OffreId, RésultatsRechercheOffre } from '~/server/offres/domain/offre';

export interface OffreRepository {
    paramètreParDéfaut: string | undefined
    get(id: OffreId): Promise<Either<Offre>>
    search(filtre: OffreFiltre): Promise<Either<RésultatsRechercheOffre>>
}
