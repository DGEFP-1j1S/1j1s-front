import { useMemo } from 'react';

import { TypeEtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

export function useAccompagnementLogo(typeÉtablissement: TypeEtablissement) {
	return useMemo(() => {
		switch (typeÉtablissement) {
			case TypeEtablissement.INFO_JEUNE:
				return '/images/logos/info-jeunes.svg';
			case TypeEtablissement.MISSION_LOCALE:
				return '/images/logos/union-mission-locale.svg';
			case TypeEtablissement.FRANCE_TRAVAIL:
				return '/images/logos/france-travail.svg';
			default:
				return '';
		}
	}, [typeÉtablissement]);
}
