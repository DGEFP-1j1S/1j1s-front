import React from 'react';

import { Carte } from '~/client/dsfr';

export function CarifOrefPartner() {
	return (
		<Carte
			horizontal
			titre="Besoin d’une formation qualifiante pour préparer votre entrée, votre maintien ou votre retour sur le marché du travail ? "
			imageSrc="/images/logos/carif-oref.svg"
			lien="/articles/le-reseau-des-carif-oref-vous-accompagne">
			Notre partenaire Carif-Oref vous permet de trouver la formation qu’il vous faut en fonction de votre localisation,
			du type de métier auquel vous souhaitez être préparé, du niveau de qualification souhaité et bien plus encore !
		</Carte>
	);
}
