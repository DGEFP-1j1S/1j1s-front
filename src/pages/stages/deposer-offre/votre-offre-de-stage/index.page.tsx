import React from 'react';

import OffreStage
	from '~/client/components/features/OffreDeStage/Déposer/Étape2Stage/StageDeposerOffreFormulaireÉtape2Stage';
import { Head } from '~/client/components/head/Head';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';

import styles from './DeposerOffreStageEtape2Stage.module.scss';

export default function DeposerOffreStageEtape2Page() {

	return (
		<>
			<Head
				title={'Dépôt d’offre de stage - Étape 2 sur 3 : Votre offre de stage | 1jeune1solution'}
				robots="index,follow" />
			<main id="contenu">
				<div className={styles.section}>
					<LightHero>
						<h1>
							<LightHeroPrimaryText>
								Déposez votre offre de stage
							</LightHeroPrimaryText>
							<LightHeroSecondaryText>
								sur 1jeune1solution
							</LightHeroSecondaryText>
						</h1>
					</LightHero>
				</div>
				<OffreStage />
			</main>
		</>
	);
}
