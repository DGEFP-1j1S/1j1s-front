import React from 'react';

import { FormulaireRechercheFicheMetier } from '~/client/components/features/FicheMetier/FormulaireRecherche/FormulaireRechercheFicheMetier';
import { RésultatRechercherMétier } from '~/client/components/features/FicheMetier/Rechercher/ResultatRechercherMetier';
import { MétierDuSoinPartner } from '~/client/components/features/ServiceCard/MetiersDuSoinPartner';
import { Head } from '~/client/components/head/Head';
import { InstantSearchLayout } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import MeilisearchTagsList
	from '~/client/components/ui/Meilisearch/MeilisearchTagsList/MeilisearchTagsList';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/decouvrir-les-metiers/index.analytics';
import {ServiceCardList} from "~/client/components/features/ServiceCard/Card/ServiceCard";

const MEILISEARCH_INDEX = 'fiche-metier';
const HITS_PER_PAGE = 15;

export default function RechercherFicheMetierPage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Rechercher un métier | 1jeune1solution'}
				description="Trouver le métier qui vous correspond"
				robots="index,follow" />
			<InstantSearchLayout
				meilisearchIndex={MEILISEARCH_INDEX}
				nombreDeResultatParPage={HITS_PER_PAGE}
				titre="Je trouve le métier qui me correspond"
				formulaireDeRecherche={<FormulaireRechercheFicheMetier />}
				messageResultatRechercheLabelSingulier="fiche métier"
				messageResultatRechercheLabelPluriel="fiches métier"
				nombreDeSkeleton={2}
				resultatDeRecherche={RésultatRechercherMétier}
				tagList={<MeilisearchTagsList />}
				isAffichageListeDeResultatsDesktopDirectionRow />
			<ServiceCardList>
				<MétierDuSoinPartner />
			</ServiceCardList>
		</>
	);
}
