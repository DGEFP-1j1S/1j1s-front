import React from 'react';

import { Carte } from '~/client/dsfr';

export function EurasmusPlusPartner() {
	return (
		<Carte
			horizontal
			titre="Le programme « ERASMUS+ »"
			imageSrc="/images/logos/erasmus-plus.webp"
			lien="https://info.erasmusplus.fr/">
			Il vous donne la possibilité de séjourner à l’étranger pour renforcer vos compétences et accroître votre employabilité.
		</Carte>
	);
}
