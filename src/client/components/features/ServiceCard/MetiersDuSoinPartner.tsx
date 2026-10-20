import React from 'react';

import { Carte } from '~/client/dsfr';

export function MétierDuSoinPartner() {
	return (
		<Carte
			horizontal
			titre="Renseignez-vous sur les métiers du soin"
			imageSrc="/images/logos/métiers-du-soin.svg"
			imageAlt="Les métiers du soin et de l'accompagnement recrutent"
			lien="https://solidarites-sante.gouv.fr/metiers-et-concours/metiers-soin-et-accompagnement/metiersdusoin">
			Vous aussi devenez aide-soignant, infirmier, éducateur spécialisé,
			accompagnant éducatif et social…. Renseignez-vous sur les métiers du soin
			et de l’accompagnement et découvrez toutes les formations pour les
			rejoindre.
		</Carte>
	);
}
