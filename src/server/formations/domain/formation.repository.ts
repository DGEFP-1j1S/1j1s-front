import { Either } from '~/server/errors/either';
import { Formation, FormationFiltre, RésultatRechercheFormation } from '~/server/formations/domain/formation';

export interface FormationRepository {
	search(filtre: FormationFiltre): Promise<Either<Array<RésultatRechercheFormation>>>
	get(id: string, filtre?: FormationFiltre): Promise<Either<Formation>>
}
