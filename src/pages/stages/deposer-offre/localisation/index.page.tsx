import React from 'react';

import Localisation
	from '~/client/components/features/OffreDeStage/Deposer/Etape3Localisation/StageDeposerOffreFormulaireEtape3Localisation';
import { Head } from '~/client/components/head/Head';
import { Banner } from "~/client/components/ui/Hero/Hero";

export default function DeposerOffreStageEtape3Page() {

	return (
		<>
			<Head
				title={'Dépôt d’offre de stage - Étape 3 sur 3 : Localisation du stage | 1jeune1solution'}
				robots="index,follow" />
			<main id="contenu">
				<Banner>
					<h1>
						<span className="text--blue">Déposez votre offre de stage</span> sur 1jeune1solution
					</h1>
				</Banner>
				<Localisation />
			</main>
		</>
	);
}
