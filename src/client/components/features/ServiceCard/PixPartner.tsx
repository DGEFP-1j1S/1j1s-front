import React from 'react';

import { Carte } from '~/client/dsfr';

export function PixPartner() {
	return (
		<Carte
			horizontal
			titre="Testez vous sur Pix !"
			imageSrc="/images/logos/pix.svg"
			lien="https://app.pix.fr/campagnes/NRABNT181/presentation">
			Pix est un service en ligne qui permet d’évaluer et de développer vos compétences numériques de façon ludique et adapté à votre niveau.
		</Carte>
	);
}
