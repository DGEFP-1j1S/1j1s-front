import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function AidesFinancieresEurope() {
	return (
		<ServiceCard
			imageFit="cover"
			linkLabel="Simuler mes aides"
			link="/mes-aides"
			logo="/images/aides-financières.webp"
			title="Je cherche des aides financières pour vivre une expérience en Europe"
			titleAs={'h3'}>
			Simuler les aides auxquelles vous êtes éligibles afin de vivre au mieux votre expérience en Europe.
		</ServiceCard>
	);
}
