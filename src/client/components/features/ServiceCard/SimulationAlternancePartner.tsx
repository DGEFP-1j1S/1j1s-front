import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function SimulationAlternancePartner() {
	return (
		<ServiceCard
			linkLabel="J’accède au site web"
			logo="/images/logos/portail-alternance.png"
			link="https://labonnealternance.apprentissage.beta.gouv.fr/salaire-alternant"
			title="Vous êtes alternant ?"
			titleAs={'h3'}>
			<strong>Simulez en quelques clics</strong> et moins de 3 minutes le montant de la
			rémunération à laquelle vous aurez droit en fonction de votre formation et de votre contrat.
		</ServiceCard>
	);
}
