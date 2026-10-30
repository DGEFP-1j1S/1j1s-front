import React from 'react';

import {
	FormulaireRechercheFicheMetier,
} from '~/client/components/features/FicheMetier/FormulaireRecherche/FormulaireRechercheFicheMetier';
import { ResultatRechercherMetier } from '~/client/components/features/FicheMetier/Rechercher/ResultatRechercherMetier';
import {
	LibelleResultats,
	RechercheIndexeeLayout
} from '~/client/components/layouts/RechercheIndexee/RechercheIndexeeLayout';
import { useFicheMetierQuery } from '~/client/hooks/useFicheMetierQuery';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { Erreur } from '~/server/errors/erreur.types';
import {
	NOMBRE_RESULTATS_FICHE_METIER_PAR_PAGE,
	ResultatsRechercheFicheMetier,
} from '~/server/fiche-metier/domain/rechercheFicheMetier';

interface RechercherFicheMetierProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheFicheMetier
}

const FACETTES_VIDES: ResultatsRechercheFicheMetier['facettes'] = { centresInteret: [] };

export function RechercherFicheMetier({ erreurRecherche, resultats }: RechercherFicheMetierProps) {
	const ficheMetierQuery = useFicheMetierQuery();
	const libelleResultats: LibelleResultats = {
		intitule: {
			singulier: 'fiche métier',
			pluriel: 'fiches métier'
		},
		pourFiltre: ficheMetierQuery.motCle
	}

	return (
		<RechercheIndexeeLayout
			titre="Je trouve le métier qui me correspond"
			formulaire={<FormulaireRechercheFicheMetier facettes={resultats?.facettes ?? FACETTES_VIDES} />}
			erreurRecherche={erreurRecherche}
			nombreDeResultats={resultats?.nombreDeResultats ?? 0}
			nombreDeResultatsParPage={NOMBRE_RESULTATS_FICHE_METIER_PAR_PAGE}
			libelleResultats={libelleResultats}
			filtresAppliques={(ficheMetierQuery.centresInteret ?? []).map(getCapitalizedItems)}
			resultats={resultats?.resultats ?? []}
			libelleListe="Fiches métier"
			cleResultat={(ficheMetier, index) => ficheMetier.nom_metier ?? String(index)}
			afficherResultat={(ficheMetier) => <ResultatRechercherMetier ficheMetier={ficheMetier} />} />
	);
}
