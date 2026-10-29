import { Either } from '~/server/errors/either';

export interface EvenementService {
	rechercherLieux(saisie: string): Promise<Either<Array<string>>>
}
