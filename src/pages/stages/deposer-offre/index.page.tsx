import React from 'react';

import Entreprise
	from '~/client/components/features/OffreDeStage/Déposer/Étape1Entreprise/StageDeposerOffreFormulaireÉtape1Entreprise';
import { Head } from '~/client/components/head/Head';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/stages/deposer-offre/index.analytics';
import styles from '~/pages/stages/deposer-offre/index.module.scss';

export const ETAPE_ENTREPRISE = 'formulaireEtape1';
export const ETAPE_OFFRE_DE_STAGE = 'formulaireEtape2';
export const ETAPE_LOCALISATION = 'formulaireEtape3';

export const URL_DEPOSER_OFFRE = '/stages/deposer-offre';

export default function DeposerOffreStagePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Dépôt d’offre de stage - Étape 1 sur 3 : Votre entreprise | 1jeune1solution '}
				robots="index,follow" />
			<main id="contenu">
				<div className={styles.section}>
					<LightHero>
						<h1>
							<LightHeroPrimaryText>
								Je dépose une offre de stage
							</LightHeroPrimaryText>
							<LightHeroSecondaryText>
								sur 1jeune1solution
							</LightHeroSecondaryText>
						</h1>
					</LightHero>
				</div>
				<Entreprise />
			</main>
		</>
	);
}
