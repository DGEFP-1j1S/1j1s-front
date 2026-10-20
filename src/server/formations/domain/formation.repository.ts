import { Either } from '~/server/errors/either';
import { Formation, FormationFiltre, ResultatRechercheFormation } from '~/server/formations/domain/formation';

export interface FormationRepository {
	search(filtre: FormationFiltre): Promise<Either<Array<ResultatRechercheFormation>>>
	get(id: string, filtre?: FormationFiltre): Promise<Either<Formation>>
}
