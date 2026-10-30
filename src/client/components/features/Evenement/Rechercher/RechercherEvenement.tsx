import React from 'react';

import { FormulaireRechercheEvenement } from '~/client/components/features/Evenement/FormulaireRecherche/FormulaireRechercheEvenement';
import { ResultatRechercherEvenement } from '~/client/components/features/Evenement/ResultatRechercherEvenement';
import {
	LibelleResultats,
	RechercheIndexeeLayout
} from '~/client/components/layouts/RechercheIndexee/RechercheIndexeeLayout';
import { useEvenementQuery } from '~/client/hooks/useEvenementQuery';
import { Erreur } from '~/server/errors/erreur.types';
import {
	NOMBRE_RESULTATS_EVENEMENT_PAR_PAGE,
	ResultatsRechercheEvenement,
} from '~/server/evenements/domain/rechercheEvenement';

interface RechercherEvenementProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheEvenement
}

export function RechercherEvenement({ erreurRecherche, resultats }: RechercherEvenementProps) {
	const evenementQuery = useEvenementQuery();
	const libelleResultats: LibelleResultats = {
		intitule: {
			singulier: 'évènement',
			pluriel: 'évènements'
		},
		pourFiltre: evenementQuery.motCle
	}

	return (
		<RechercheIndexeeLayout
			titre="Des centaines d‘évènements de recrutement pour tous les jeunes, partout en France"
			formulaire={<FormulaireRechercheEvenement />}
			erreurRecherche={erreurRecherche}
			nombreDeResultats={resultats?.nombreDeResultats ?? 0}
			nombreDeResultatsParPage={NOMBRE_RESULTATS_EVENEMENT_PAR_PAGE}
			libelleResultats={libelleResultats}
			filtresAppliques={evenementQuery.lieux ?? []}
			resultats={resultats?.resultats ?? []}
			libelleListe="Évènements"
			cleResultat={(evenement, index) => evenement.slug ?? String(index)}
			afficherResultat={(evenement) => <ResultatRechercherEvenement evenement={evenement} />} />
	);
}
