import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function FormationsEnApprentissageCard() {
	return (
		<ServiceCard
			linkLabel="Trouver ma formation"
			link="/formations/apprentissage"
			logo="/images/formations-apprentissage.webp"
			title="Vous êtes à la recherche d’une formation en apprentissage ?"
			titleAs={'h3'}
			imageFit={'cover'}>
			Trouvez la formation qu’il vous faut pour réaliser votre projet avec La bonne alternance
		</ServiceCard>
	);
}
