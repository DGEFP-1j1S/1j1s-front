import React from 'react';

import Entreprise
	from '~/client/components/features/OffreDeStage/Deposer/Etape1Entreprise/StageDeposerOffreFormulaireEtape1Entreprise';
import { Head } from '~/client/components/head/Head';
import { Banner } from "~/client/components/ui/Hero/Hero";
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/stages/deposer-offre/index.analytics';

export const URL_DEPOSER_OFFRE = '/stages/deposer-offre';

export default function DeposerOffreStagePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Dépôt d’offre de stage - Étape 1 sur 3 : Votre entreprise | 1jeune1solution '}
				robots="index,follow" />
			<main id="contenu">
				<Banner>
					<h1>
						Je dépose une offre de stage sur 1jeune1solution
					</h1>
				</Banner>
				<Entreprise />
			</main>
		</>
	);
}
