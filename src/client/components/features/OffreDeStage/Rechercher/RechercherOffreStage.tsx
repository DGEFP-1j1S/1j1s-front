import React from 'react';

import {
	FormulaireRechercheOffreStage,
} from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage';
import { OffreDeStage } from '~/client/components/features/OffreDeStage/OffreDeStage';
import {
	LibelleResultats,
	RechercheIndexeeLayout
} from '~/client/components/layouts/RechercheIndexee/RechercheIndexeeLayout';
import { useStageQuery } from '~/client/hooks/useStageQuery';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { Erreur } from '~/server/errors/erreur.types';
import {
	NOMBRE_RESULTATS_OFFRE_STAGE_PAR_PAGE,
	ResultatsRechercheOffreStage,
} from '~/server/stages/domain/rechercheOffreStage';

interface RechercherOffreStageProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheOffreStage
}

const FACETTES_VIDES: ResultatsRechercheOffreStage['facettes'] = { domaines: [], durees: [] };

export function RechercherOffreStage({ erreurRecherche, resultats }: RechercherOffreStageProps) {
	const stageQuery = useStageQuery();
	const libelleResultats: LibelleResultats = {
		intitule: {
			singulier: 'offre de stage',
			pluriel: 'offres de stage'
		},
		pourFiltre: stageQuery.motCle
	}

	return (
		<RechercheIndexeeLayout
			titre="Des milliers d‘offres de stages sélectionnées pour vous"
			formulaire={<FormulaireRechercheOffreStage facettes={resultats?.facettes ?? FACETTES_VIDES} />}
			erreurRecherche={erreurRecherche}
			nombreDeResultats={resultats?.nombreDeResultats ?? 0}
			nombreDeResultatsParPage={NOMBRE_RESULTATS_OFFRE_STAGE_PAR_PAGE}
			libelleResultats={libelleResultats}
			filtresAppliques={[
				...(stageQuery.localisations ?? []),
				...(stageQuery.domaines ?? []).map(getCapitalizedItems),
				...(stageQuery.durees ?? []),
			]}
			resultats={resultats?.resultats ?? []}
			libelleListe="Offres de stage"
			cleResultat={(offreDeStage) => offreDeStage.slug}
			afficherResultat={(offreDeStage) => <OffreDeStage offreDeStage={offreDeStage} />} />
	);
}
