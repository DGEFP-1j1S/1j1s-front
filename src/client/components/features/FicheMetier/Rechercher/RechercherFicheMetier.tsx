import React from 'react';

import {
	FormulaireRechercheFicheMetier,
} from '~/client/components/features/FicheMetier/FormulaireRecherche/FormulaireRechercheFicheMetier';
import { RésultatRechercherMétier } from '~/client/components/features/FicheMetier/Rechercher/ResultatRechercherMetier';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useFicheMetierQuery } from '~/client/hooks/useFicheMetierQuery';
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
	const nombreDeResultats = resultats?.nombreDeResultats ?? 0;
	const filtresAppliques = (ficheMetierQuery.centresInteret ?? []).map(getCapitalizedItems);

	return (
		<main id="contenu">
			<RechercherSolutionLayout
				banniere={(
					<Banner>
						<h1 className="fr-h1 fr-mb-0">Je trouve le métier qui me correspond</h1>
					</Banner>
				)}
				erreurRecherche={erreurRecherche}
				// NOTE : la clé recrée le formulaire quand l‘URL change (historique), pour que ses champs reflètent la recherche
				formulaireRecherche={<FormulaireRechercheFicheMetier key={JSON.stringify(ficheMetierQuery)} facettes={resultats?.facettes ?? FACETTES_VIDES} />}
				etiquettesRecherche={filtresAppliques.length > 0 ? <TagList list={filtresAppliques} aria-label="Filtres de la recherche" /> : undefined}
				isChargement={false}
				isEtatInitial={false}
				messageResultatRecherche={messageResultatRecherche(nombreDeResultats, ficheMetierQuery.motCle)}
				nombreTotalSolutions={nombreDeResultats}
				paginationOffset={NOMBRE_RESULTATS_FICHE_METIER_PAR_PAGE}
				listeSolutionElement={<ListeFicheMetier resultats={resultats?.resultats ?? []} />} />
		</main>
	);
}

function messageResultatRecherche(nombreDeResultats: number, motCle?: string) {
	const libelle = nombreDeResultats > 1 ? 'fiches métier' : 'fiche métier';
	return [`${nombreDeResultats} ${libelle}`, motCle && `pour ${motCle}`].filter(Boolean).join(' ');
}

function ListeFicheMetier({ resultats }: { resultats: ResultatsRechercheFicheMetier['resultats'] }) {
	if (!resultats.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Fiches métier">
			{resultats.map((ficheMetier, index) => (
				<li key={ficheMetier.nom_metier ?? index} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<RésultatRechercherMétier hit={ficheMetier} />
				</li>
			))}
		</ul>
	);
}
