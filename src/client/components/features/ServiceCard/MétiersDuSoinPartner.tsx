import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function MétierDuSoinPartner() {
	return (
		<ServiceCard
			linkLabel="En savoir plus"
			logo="/images/logos/métiers-du-soin.svg"
			logoAlt="Les métiers du soin et de l’accompagnement recrutent"
			link="https://solidarites-sante.gouv.fr/metiers-et-concours/metiers-soin-et-accompagnement/metiersdusoin"
			title="Renseignez-vous sur les métiers du soin"
			titleAs={'h3'}>
			Vous aussi devenez aide-soignant, infirmier, éducateur spécialisé,
			accompagnant éducatif et social…. Renseignez-vous sur les métiers du soin
			et de l’accompagnement et découvrez toutes les formations pour les
			rejoindre.
		</ServiceCard>
	);
}
