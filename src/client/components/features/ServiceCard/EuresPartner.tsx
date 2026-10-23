import React from 'react';

import { Carte } from '~/client/dsfr';

export function EuresPartner() {
	return (
		<Carte
			horizontal
			titre="Le programme de mobilité ciblé EURES"
			imageSrc="/images/logos/eures.webp"
			lien="https://europa.eu/eures/portal/jv-se/home?lang=fr">
			Il vous aide à trouver un emploi, une formation ou un apprentissage dans un autre État membre de l’Union européenne.
		</Carte>
	);
}
