import React, { useMemo } from 'react';

import { HitProps } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import { Carte } from '~/client/dsfr';
import useSanitize from '~/client/hooks/useSanitize';
import { formatCarriageReturnToHtml } from '~/client/utils/formatCarriageReturnToHtml';
import { mapFicheMetier } from '~/server/fiche-metier/domain/ficheMetierHttp';
import { StrapiFicheMetier } from '~/server/fiche-metier/infra/strapiFicheMetier';

export function RésultatRechercherMétier(props: HitProps<Partial<StrapiFicheMetier>>) {
	const ficheMetier = mapFicheMetier(props.hit);
	const accrocheMétier = useSanitize(formatCarriageReturnToHtml(ficheMetier.accrocheMetier));
	const nomMetier = useMemo(() => {
		return `${ficheMetier.nomMetier?.charAt(0).toUpperCase()}${ficheMetier.nomMetier?.slice(1)}`;
	}, [ficheMetier.nomMetier]);

	if (!ficheMetier.nomMetier) return null;

	return (
		<Carte
			titre={nomMetier}
			lien={`/decouvrir-les-metiers/${encodeURIComponent(ficheMetier.nomMetier)}`}>
			<span dangerouslySetInnerHTML={{ __html: accrocheMétier || '' }} />
		</Carte>
	);
}
