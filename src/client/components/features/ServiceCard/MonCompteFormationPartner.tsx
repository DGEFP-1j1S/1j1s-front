import React from 'react';

import { Carte } from '~/client/dsfr';

export function MonCompteFormationPartner() {
	return (
		<Carte
			horizontal
			titre="Découvrez le dispositif Mon compte formation"
			imageSrc="/images/logos/mon-compte-formation.svg"
			lien="https://www.moncompteformation.gouv.fr/espace-prive/html/#/">
			Le compte personnel de formation (CPF) permet d’acquérir des droits à la
			formation mobilisables tout au long de sa vie professionnelle. Il a une
			vocation universelle et s’adresse à tous les actifs.
		</Carte>
	);
}
