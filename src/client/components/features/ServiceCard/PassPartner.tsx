import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function PassPartner() {
	return (
		<ServiceCard
			linkLabel="Accéder au site web"
			link="https://www.pass.fonction-publique.gouv.fr/"
			logo="/images/logos/pass.png"
			logoAlt="PASS, Place de l'apprentissage et des stages dans la fonction publique"
			title="Recherche une offre d'alternance dans la fonction publique"
			titleAs={'h3'}>
			La fonction publique accueille des apprentis dans tous les domaines et
			de tous niveaux. Découvrez les offres sur la place de l’apprentissage et des stages.
		</ServiceCard>
	);
}
