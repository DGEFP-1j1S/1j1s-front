import React from 'react';

import { Carte } from '~/client/dsfr';

export function ServiceCiviquePartner() {
	return (
		<Carte
			horizontal
			titre="Le Service Civique, pour acquérir de l'expérience et préparer son avenir"
			imageSrc="/images/logos/service-civique.svg"
			lien="/service-civique">
			Avec ou sans diplôme, engagez-vous dans des missions d’intérêt général
			en France ou à l’étranger. Indemnisé 601€/mois, il vous permettra d’acquérir ou de développer vos
			compétences dans de nombreux domaines. Ouvert aux 16-25 ans (30 ans pour
			les jeunes en situation de handicap).
		</Carte>
	);
}
