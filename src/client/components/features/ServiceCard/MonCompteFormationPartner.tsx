import React from 'react';

import { ServiceCard } from './Card/ServiceCard';

export function MonCompteFormationPartner() {
	return (
		<ServiceCard
			linkLabel="Accéder à mon compte formation"
			logo="/images/logos/mon-compte-formation.svg"
			link="https://www.moncompteformation.gouv.fr/espace-prive/html/#/"
			title="Découvrez le dispositif Mon compte formation"
			titleAs={'h3'}>
			Le compte personnel de formation (CPF) permet d’acquérir des droits à la
			formation mobilisables tout au long de sa vie professionnelle. Il a une
			vocation universelle et s’adresse à tous les actifs.
		</ServiceCard>
	);
}
