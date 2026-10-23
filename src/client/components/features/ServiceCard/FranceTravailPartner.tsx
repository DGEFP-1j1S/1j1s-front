import React from 'react';

import { Carte } from '~/client/dsfr';

export function FranceTravailPartner() {
	return (
		<Carte
			horizontal
			titre="France Travail propose un accompagnement individualisé pour les jeunes de 16 à 30 ans"
			imageSrc="/images/logos/france-travail.svg"
			lien="/articles/accompagnement-france-travail">
			Avec son dispositif d’accompagnement individualisé des jeunes (AIJ), France
			Travail propose à tous les jeunes demandeurs d’emploi de 16 à 30 ans, un
			accompagnement personnalisé intensif d’une durée de 3 à 6 mois pour les
			aider à trouver ou retrouver plus rapidement un emploi.
		</Carte>
	);
}
