import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function EurasmusPlusPartner() {
	return (
		<ServiceCard
			imageFit="cover"
			linkLabel="Acceder au site web"
			link="https://info.erasmusplus.fr/"
			logo="/images/logos/erasmus-plus.webp"
			title="Le programme “ERASMUS+”"
			titleAs={'h3'}>
			Il vous donne la possibilité de séjourner à l’étranger pour renforcer vos compétences et accroître votre employabilité.
		</ServiceCard>
	);
}
