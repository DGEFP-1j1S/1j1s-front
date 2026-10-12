import React from 'react';

import OffreStage
	from '~/client/components/features/OffreDeStage/Deposer/Etape2Stage/StageDeposerOffreFormulaireEtape2Stage';
import { Head } from '~/client/components/head/Head';
import { Banner } from "~/client/components/ui/Hero/Hero";

export default function DeposerOffreStageEtape2Page() {

	return (
		<>
			<Head
				title={'Dépôt d’offre de stage - Étape 2 sur 3 : Votre offre de stage | 1jeune1solution'}
				robots="index,follow" />
			<main id="contenu">
				<Banner>
					<h1>
						<span className="text--blue">Déposez votre offre de stage</span> sur 1jeune1solution
					</h1>
				</Banner>
				<OffreStage />
			</main>
		</>
	);
}
