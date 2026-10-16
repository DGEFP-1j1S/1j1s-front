import React from 'react';

import {
	FormulaireRechercheOffreStage,
} from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage';
import { OffreDeStage } from '~/client/components/features/OffreDeStage/OffreDeStage';
import { Head } from '~/client/components/head/Head';
import { InstantSearchLayout } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import MeilisearchTagsList
	from '~/client/components/ui/Meilisearch/MeilisearchTagsList/MeilisearchTagsList';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/stages/index.analytics';

const HITS_PER_PAGE = 15;
const MEILISEARCH_INDEX = `${process.env.NEXT_PUBLIC_INDEX_OFFRE_DE_STAGE}`;

export default function RechercherOffreStagePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Rechercher un stage | 1jeune1solution'}
				description="Des milliers d‘offres de stages sélectionnées pour vous"
				robots="index,follow" />
			<InstantSearchLayout
				meilisearchIndex={MEILISEARCH_INDEX}
				nombreDeResultatParPage={HITS_PER_PAGE}
				titre="Des milliers d‘offres de stages"
				sousTitre="sélectionnées pour vous"
				formulaireDeRecherche={<FormulaireRechercheOffreStage />}
				messageResultatRechercheLabelSingulier="offre de stage"
				messageResultatRechercheLabelPluriel="offres de stage"
				nombreDeSkeleton={2}
				resultatDeRecherche={OffreDeStage}
				tagList={<MeilisearchTagsList />}
				isAffichageListeDeResultatsDesktopDirectionRow />
		</>
	);
}
