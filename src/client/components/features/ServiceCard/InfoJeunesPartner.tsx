import React from 'react';

import { Carte } from '~/client/dsfr';

export function InfoJeunesPartner() {
	return (
		<Carte
			horizontal
			titre="Info Jeunes, le réseau d'accueil et d'information des jeunes en France au service d'une ambition : explorer les possibles !"
			imageSrc="/images/logos/info-jeunes.svg"
			lien="/articles/info-jeunes">
			La structure Info Jeunes (SIJ) accueille tous les jeunes (de 12 à 30 ans)
			anonymement et gratuitement. On vous aide à trouver des informations et on
			vous accompagne sur des sujets comme : scolarité, formation, emploi,
			logement, loisirs, départ vers l’étranger, aides pour un projet...
		</Carte>
	);
}
