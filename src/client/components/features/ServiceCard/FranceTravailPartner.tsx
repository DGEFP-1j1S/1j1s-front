import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function FranceTravailPartner() {
	return (
		<ServiceCard
			title="France Travail propose un accompagnement individualisé pour les jeunes de 16 à 30 ans"
			logo="/images/logos/france-travail.svg"
			link="/articles/accompagnement-france-travail"
			linkLabel="En savoir plus"
			titleAs={'h3'}>
			Avec son dispositif d’accompagnement individualisé des jeunes (AIJ), France
			Travail propose à tous les jeunes demandeurs d’emploi de 16 à 30 ans, un
			accompagnement personnalisé intensif d’une durée de 3 à 6 mois pour les
			aider à trouver ou retrouver plus rapidement un emploi.
		</ServiceCard>
	);
}
