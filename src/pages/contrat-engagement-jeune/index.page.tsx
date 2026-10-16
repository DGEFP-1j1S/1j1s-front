import React from 'react';

import Accompagnement from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement';
import Actions from '~/client/components/features/ContratEngagementJeune/Actions/Actions';
import Allocations from '~/client/components/features/ContratEngagementJeune/Allocations/Allocations';
import Application from '~/client/components/features/ContratEngagementJeune/Application/Application';
import { Banniere } from '~/client/components/features/ContratEngagementJeune/Banniere/Banniere';
import DemandeContactCEJ from '~/client/components/features/ContratEngagementJeune/DemandeDeContactCEJ/DemandeContactCEJ';
import PourquoiCEstFaitPourMoi from '~/client/components/features/ContratEngagementJeune/Pourquoi/PourquoiCEstFaitPourMoi';
import QuEstCeQueCEst from '~/client/components/features/ContratEngagementJeune/QuEstCeQueCest/QuEstCeQueCEst';
import QuEstCeQueJyGagne from '~/client/components/features/ContratEngagementJeune/QuEstCeQueJyGagne/QuEstCeQueJyGagne';
import { Témoignages } from '~/client/components/features/ContratEngagementJeune/Témoignages/Témoignages';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/contrat-engagement-jeune/index.analytics';

export default function ContratEngagementJeune() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Contrat d’engagement jeune | 1jeune1solution"
				description="Plus de 400 000 offres d‘emplois et d‘alternances sélectionnées pour vous"
				robots="index,follow" />
			<main id="contenu">
				<Banniere />
				<QuEstCeQueCEst />
				<Actions />
				<PourquoiCEstFaitPourMoi />
				<QuEstCeQueJyGagne />
				<Allocations />
				<Témoignages />
				<Accompagnement />
				<DemandeContactCEJ />
				<Application />
			</main>
		</>
	);
}
