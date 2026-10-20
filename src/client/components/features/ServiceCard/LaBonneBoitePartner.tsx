import React from 'react';
import { Carte } from '~/client/dsfr';

export function LaBonneBoitePartner() {
	return (
		<Carte
			horizontal
			titre='Et si vous contactiez directement les entreprises ?'
			lien='https://labonneboite.francetravail.fr/' 
			imageSrc='/images/logos/la-bonne-boite.svg'
		>
			N’envoyez plus vos CV au hasard ! Identifiez et contactez les entreprises qui peuvent être susceptibles de
		 	recruter même si elles n’ont pas déposé d’offres. Nos outils détectent
		 	les entreprises qui vont probablement embaucher dans les 6 prochains
		 	mois.
		</Carte>
	);
}
