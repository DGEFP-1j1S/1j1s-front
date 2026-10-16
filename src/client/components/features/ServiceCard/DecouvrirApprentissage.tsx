import React from 'react';

import { LBA_CANDIDAT_URL } from '~/shared/lbaLandingUrls';

import { ServiceCard } from './Card/ServiceCard';

export function DecouvrirApprentissage() {
	return (
		<ServiceCard
			imageFit="cover"
			linkLabel="Découvrir l‘apprentissage"
			link={LBA_CANDIDAT_URL}
			logo="/images/campagne-apprentissage-jeune-sans-texte.webp"
			title="L’apprentissage est-il fait pour vous ?"
			titleAs="h3">
			Découvrez tout sur l‘apprentissage et simulez la rémunération que vous pourriez avoir en devenant apprenti&middot;e !
		</ServiceCard>
	);
}
