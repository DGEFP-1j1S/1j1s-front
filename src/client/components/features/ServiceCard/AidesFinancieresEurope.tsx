import React from 'react';

import { Carte } from '~/client/dsfr';

export function AidesFinancieresEurope() {
	return (
		<Carte
			horizontal
			titre="Je cherche des aides financières pour vivre une expérience en Europe"
			imageSrc="/images/aides-financières.webp"
			lien="/mes-aides">
			Simuler les aides auxquelles vous êtes éligibles afin de vivre au mieux votre expérience en Europe.
		</Carte>
	);
}
