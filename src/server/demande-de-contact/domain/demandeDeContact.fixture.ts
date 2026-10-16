import { DemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact';
import { TypeÉtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export function aDemandeDeContactAccompagnement(overrides?: Partial<DemandeDeContactAccompagnement>): DemandeDeContactAccompagnement {
	return {
		age: 23,
		commentaire: 'Merci de me recontacter',
		commune: 'Paris (75006)',
		email: 'john.doe@email.com',
		nom: 'Doe',
		prénom: 'John',
		téléphone: '0606060606',
		établissement: {
			email: 'email@missionlocaledeparis.fr',
			nom: 'Mission locale pour l‘insertion professionnelle et sociale des jeunes (16-25 ans) - Paris - 1er 2e 3e 4e 9e 10e et 11e',
			type: TypeÉtablissement.MISSION_LOCALE,
		},
		...overrides,
	};
}
