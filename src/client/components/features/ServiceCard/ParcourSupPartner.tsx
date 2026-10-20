import React from 'react';

import { Carte } from '~/client/dsfr';

export function ParcourSupPartner() {
	return (
		<Carte
			horizontal
			titre="La plateforme de pré-inscription en première année de l’enseignement supérieur"
			imageSrc="/images/logos/parcoursup.svg"
			lien="https://www.parcoursup.fr/">
			Si vous êtes lycéen(ne) en réorientation, rendez-vous sur Parcoursup, la
			plateforme nationale de préinscription en première année de l’enseignement
			supérieur, pour candidater à la formation initiale de votre choix
		</Carte>
	);
}
