import { AccompagnementQueryParams } from '~/client/hooks/useAccompagnementQuery';
import { DemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact';
import { Either } from '~/server/errors/either';
import {
	EtablissementAccompagnement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export interface EtablissementAccompagnementService {
	rechercher(queryParams: AccompagnementQueryParams): Promise<Either<EtablissementAccompagnement[]>>

	envoyerDemandeContact(demandeDeContactAccompagnement: DemandeDeContactAccompagnement): Promise<Either<void>>
}
