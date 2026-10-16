import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function OnisepMetierPartner() {
	return (
		<ServiceCard
			linkLabel="Découvrir les métiers"
			link="/decouvrir-les-metiers"
			logo="/images/logos/onisep.svg"
			title="Besoin d‘informations sur les métiers ?"
			titleAs={'h3'}>
			Renseignez-vous sur les différents métiers avec l’ONISEP. Trouvez un métier qui vous correspond parmi plus de 700
			fiches.
		</ServiceCard>
	);
}
