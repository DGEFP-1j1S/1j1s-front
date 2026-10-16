import classNames from 'classnames';
import React from 'react';

import { FormulaireRechercheFicheMetier } from '~/client/components/features/FicheMétier/FormulaireRecherche/FormulaireRechercheFicheMetier';
import { RésultatRechercherMétier } from '~/client/components/features/FicheMétier/Rechercher/RésultatRechercherMétier';
import { MétierDuSoinPartner } from '~/client/components/features/ServiceCard/MétiersDuSoinPartner';
import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { InstantSearchLayout } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import { EnTete } from '~/client/components/ui/EnTete/EnTete';
import MeilisearchTagsList
	from '~/client/components/ui/Meilisearch/MeilisearchTagsList/MeilisearchTagsList';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/decouvrir-les-metiers/index.analytics';
import styles from '~/pages/decouvrir-les-metiers/index.module.scss';

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
				titre="Je trouve le métier"
				sousTitre="qui me correspond"
				formulaireDeRecherche={<FormulaireRechercheFicheMetier />}
				messageResultatRechercheLabelSingulier="fiche métier"
				messageResultatRechercheLabelPluriel="fiches métier"
				nombreDeSkeleton={2}
				resultatDeRecherche={RésultatRechercherMétier}
				tagList={<MeilisearchTagsList />}
				isAffichageListeDeResultatsDesktopDirectionRow />
			<EnTete heading="Découvrez des services faits pour vous" />
			<div className={classNames(styles.additionalSection, 'background-white-lilac')}>
				<Container className={styles.partnerCardContainer}>
					<MétierDuSoinPartner />
				</Container>
			</div>
		</>
	);
}
