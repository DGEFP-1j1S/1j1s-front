import React from 'react';

import { ServiceCard } from '~/client/components/features/ServiceCard/Card/ServiceCard';

export function LaBonneBoitePartner() {
	return (
		<ServiceCard
			linkLabel="Accéder au site web"
			logo="/images/logos/la-bonne-boite.svg"
			logoAlt="La Bonne Boite, Pôle Emploi"
			link="https://labonneboite.francetravail.fr/"
			title="Et si vous contactiez directement les entreprises ?"
			titleAs={'h3'}>
			N’envoyez plus vos CV au hasard ! Identifiez et contactez les entreprises qui peuvent être susceptibles de
			recruter même si elles n’ont pas déposé d’offres. Nos outils détectent
			les entreprises qui vont probablement embaucher dans les 6 prochains
			mois.
		</ServiceCard>
	);
}
