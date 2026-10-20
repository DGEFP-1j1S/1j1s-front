import React from 'react';

import { Carte } from '~/client/dsfr';

export function SimulationAlternancePartner() {
	return (
		<Carte
			horizontal
			titre="Vous êtes alternant ?"
			imageSrc="/images/logos/portail-alternance.png"
			lien="https://labonnealternance.apprentissage.beta.gouv.fr/salaire-alternant">
			<strong>Simulez en quelques clics</strong> et moins de 3 minutes le montant de la
			rémunération à laquelle vous aurez droit en fonction de votre formation et de votre contrat.
		</Carte>
	);
}
