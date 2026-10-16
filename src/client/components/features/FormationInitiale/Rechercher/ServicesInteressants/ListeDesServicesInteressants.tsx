import React from 'react';

import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { CarifOrefPartner } from '~/client/components/features/ServiceCard/CarifOrefPartner';
import { FormationsEnApprentissageCard } from '~/client/components/features/ServiceCard/FormationsEnApprentissageCard';
import { MonCompteFormationPartner } from '~/client/components/features/ServiceCard/MonCompteFormationPartner';
import { ParcourSupPartner } from '~/client/components/features/ServiceCard/ParcourSupPartner';
import { PixPartner } from '~/client/components/features/ServiceCard/PixPartner';
import { EnTete } from '~/client/components/ui/EnTete/EnTete';

export function ListeDesServicesInteressants() {
	return (
		<>
			<EnTete heading='Des services faits pour vous' headingLevel={'h2'} />
			<ServiceCardList>
				<CarifOrefPartner />
				<FormationsEnApprentissageCard />
				<ParcourSupPartner />
				<MonCompteFormationPartner />
				<PixPartner />
			</ServiceCardList>
		</>
	);;
}
