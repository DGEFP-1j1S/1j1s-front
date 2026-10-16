import { useMemo } from 'react';

import { TypeÉtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export function useAccompagnementLogo(typeÉtablissement: TypeÉtablissement) {
	return useMemo(() => {
		switch (typeÉtablissement) {
			case TypeÉtablissement.INFO_JEUNE:
				return '/images/logos/info-jeunes.svg';
			case 'mission_locale':
				return '/images/logos/union-mission-locale.svg';
			case TypeÉtablissement.FRANCE_TRAVAIL:
				return '/images/logos/france-travail.svg';
			default:
				return '';
		}
	}, [typeÉtablissement]);
}
