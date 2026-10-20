import React from 'react';

import { Carte } from '~/client/dsfr';

export function PassPartner() {
	return (
		<Carte
			horizontal
			titre="Recherche une offre d'alternance dans la fonction publique"
			imageSrc="/images/logos/pass.png"
			imageAlt="PASS, Place de l'apprentissage et des stages dans la fonction publique"
			lien="https://www.pass.fonction-publique.gouv.fr/">
			La fonction publique accueille des apprentis dans tous les domaines et
			de tous niveaux. Découvrez les offres sur la place de l’apprentissage et des stages.
		</Carte>
	);
}
