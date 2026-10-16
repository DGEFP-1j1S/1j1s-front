import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function PixPartner() {
	return (
		<ServiceCard
			linkLabel="Evaluer mes compétences"
			link="https://app.pix.fr/campagnes/NRABNT181/presentation"
			logo="/images/logos/pix.svg"
			title="Testez vous sur Pix !"
			titleAs={'h3'}>
			Pix est un service en ligne qui permet d’évaluer et de développer vos compétences numériques de façon ludique et adapté à votre niveau.
		</ServiceCard>
	);
}
