import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function ExperiencesEurope() {
	return (
		<ServiceCard
			imageFit="cover"
			linkLabel="En savoir plus"
			link="/experience-europe"
			logo="/images/passeport.webp"
			title="Je découvre les dispositifs pour m’accompagner dans mon projet"
			titleAs={'h3'}>
			Découvrez les services destinés à vous aider à trouver l’expérience en Europe faite pour vous
		</ServiceCard>
	);
}
