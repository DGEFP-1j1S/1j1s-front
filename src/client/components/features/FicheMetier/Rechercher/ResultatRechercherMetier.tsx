import React, { useMemo } from 'react';

import { Carte } from '~/client/dsfr';
import useSanitize from '~/client/hooks/useSanitize';
import { formatCarriageReturnToHtml } from '~/client/utils/formatCarriageReturnToHtml';
import { mapFicheMetier } from '~/server/fiche-metier/domain/ficheMetierHttp';
import { FicheMetierIndexee } from '~/server/fiche-metier/domain/rechercheFicheMetier';

export function ResultatRechercherMetier(props: { hit: FicheMetierIndexee }) {
	const ficheMetier = mapFicheMetier(props.hit);
	const accrocheMetier = useSanitize(formatCarriageReturnToHtml(ficheMetier.accrocheMetier));
	const nomMetier = useMemo(() => {
		return `${ficheMetier.nomMetier?.charAt(0).toUpperCase()}${ficheMetier.nomMetier?.slice(1)}`;
	}, [ficheMetier.nomMetier]);

	if (!ficheMetier.nomMetier) return null;

	return (
		<Carte
			titre={nomMetier}
			lien={`/decouvrir-les-metiers/${encodeURIComponent(ficheMetier.nomMetier)}`}
			descriptionAs="div">
			<div dangerouslySetInnerHTML={{ __html: accrocheMetier || '' }} />
		</Carte>
	);
}
