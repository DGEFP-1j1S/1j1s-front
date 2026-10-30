import React from 'react';

import { AnnonceDeLogement } from '~/client/components/features/Logement/Annonce';
import {
	DEVISE,
	FormulaireRechercheAnnonceLogement,
	UNITE_SURFACE,
} from '~/client/components/features/Logement/FormulaireRecherche/FormulaireRechercheAnnonceLogement';
import {
	LibelleResultats,
	RechercheIndexeeLayout
} from '~/client/components/layouts/RechercheIndexee/RechercheIndexeeLayout';
import { useAnnonceDeLogementQuery } from '~/client/hooks/useAnnonceDeLogementQuery';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { Erreur } from '~/server/errors/erreur.types';
import {
	NOMBRE_RESULTATS_ANNONCE_DE_LOGEMENT_PAR_PAGE,
	ResultatsRechercheAnnonceDeLogement,
} from '~/server/logements/domain/rechercheAnnonceDeLogement';

interface RechercherAnnonceDeLogementProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheAnnonceDeLogement
}

const FACETTES_VIDES: ResultatsRechercheAnnonceDeLogement['facettes'] = { typesBien: [], typesOffre: [] };

export function RechercherAnnonceDeLogement({ erreurRecherche, resultats }: RechercherAnnonceDeLogementProps) {
	const annonceQuery = useAnnonceDeLogementQuery();
	const libelleResultats: LibelleResultats = {
		intitule: {
			singulier: 'annonce pour étudiants',
			pluriel: 'annonces pour étudiants'
		},
		pourFiltre: annonceQuery.ville
	}

	return (
		<RechercheIndexeeLayout
			titre="Plus de 3 000 offres de logements étudiants et de locations jeune actif partout en France"
			formulaire={<FormulaireRechercheAnnonceLogement facettes={resultats?.facettes ?? FACETTES_VIDES} />}
			erreurRecherche={erreurRecherche}
			nombreDeResultats={resultats?.nombreDeResultats ?? 0}
			nombreDeResultatsParPage={NOMBRE_RESULTATS_ANNONCE_DE_LOGEMENT_PAR_PAGE}
			libelleResultats={libelleResultats}
			filtresAppliques={[
				...(annonceQuery.typesOffre ?? []).map(getCapitalizedItems),
				...(annonceQuery.typesBien ?? []).map(getCapitalizedItems),
				...libellesIntervalle(annonceQuery.surfaceMin, annonceQuery.surfaceMax, UNITE_SURFACE),
				...libellesIntervalle(annonceQuery.prixMin, annonceQuery.prixMax, DEVISE),
			]}
			resultats={resultats?.resultats ?? []}
			libelleListe="Annonces de logement"
			cleResultat={(annonce) => annonce.slug}
			afficherResultat={(annonce) => <AnnonceDeLogement annonce={annonce} />} />
	);
}

function libellesIntervalle(min: string | undefined, max: string | undefined, unite: string) {
	return [
		min && `A partir de ${min} ${unite}`,
		max && `Jusqu‘à ${max} ${unite}`,
	].filter((libelle): libelle is string => Boolean(libelle));
}
