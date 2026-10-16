import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function EuresPartner() {
	return (
		<ServiceCard
			linkLabel="Acceder au site web"
			link="https://europa.eu/eures/portal/jv-se/home?lang=fr"
			logo="/images/logos/eures.webp"
			title="Le programme de mobilité ciblé EURES"
			titleAs={'h3'}>
			Il vous aide à trouver un emploi, une formation ou un apprentissage dans un autre État membre de l’Union européenne.
		</ServiceCard>
	);
}
