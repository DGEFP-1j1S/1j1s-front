import React from 'react';

import { Carte } from '~/client/dsfr';
import { LBA_CANDIDAT_URL } from '~/shared/lbaLandingUrls';

export function DecouvrirApprentissage() {
	return (
		<Carte
			horizontal
			titre="L’apprentissage est-il fait pour vous ?"
			imageSrc="/images/campagne-apprentissage-jeune-sans-texte.webp"
			lien={LBA_CANDIDAT_URL}>
			Découvrez tout sur l’apprentissage et simulez la rémunération que vous pourriez avoir en devenant apprenti&middot;e !
		</Carte>
	);
}
