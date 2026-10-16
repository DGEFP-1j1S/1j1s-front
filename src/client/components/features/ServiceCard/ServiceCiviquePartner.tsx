import React from 'react';

import { ServiceCard } from '~/client/components/features/ServiceCard/Card/ServiceCard';

export function ServiceCiviquePartner() {
	return (
		<ServiceCard
			linkLabel="Trouver sa mission"
			logo="/images/logos/service-civique.svg"
			link="/service-civique"
			title="Le Service Civique, pour acquérir de l’expérience et préparer son avenir"
			titleAs={'h3'}>
			Avec ou sans diplôme, engagez-vous dans des missions d’intérêt général
			en France ou à l’étranger. Indemnisé 601€/mois, il vous permettra d’acquérir ou de développer vos
			compétences dans de nombreux domaines. Ouvert aux 16-25 ans (30 ans pour
			les jeunes en situation de handicap).
		</ServiceCard>
	);
}
