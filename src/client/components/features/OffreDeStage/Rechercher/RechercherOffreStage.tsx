import React from 'react';

import {
	FormulaireRechercheOffreStage,
} from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage';
import { OffreDeStage } from '~/client/components/features/OffreDeStage/OffreDeStage';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useStageQuery } from '~/client/hooks/useStageQuery';
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
	const nombreDeResultats = resultats?.nombreDeResultats ?? 0;
	const filtresAppliques = [
		...(stageQuery.localisations ?? []),
		...(stageQuery.domaines ?? []).map(getCapitalizedItems),
		...(stageQuery.durees ?? []),
	];

	return (
		<main id="contenu">
			<RechercherSolutionLayout
				banniere={(
					<Banner>
						<h1 className="fr-h1 fr-mb-0">Des milliers d‘offres de stages sélectionnées pour vous</h1>
					</Banner>
				)}
				erreurRecherche={erreurRecherche}
				// NOTE : la clé recrée le formulaire quand l‘URL change (historique), pour que ses champs reflètent la recherche
				formulaireRecherche={<FormulaireRechercheOffreStage key={JSON.stringify(stageQuery)} facettes={resultats?.facettes ?? FACETTES_VIDES} />}
				etiquettesRecherche={filtresAppliques.length > 0 ? <TagList list={filtresAppliques} aria-label="Filtres de la recherche" /> : undefined}
				isChargement={false}
				isEtatInitial={false}
				messageResultatRecherche={messageResultatRecherche(nombreDeResultats, stageQuery.motCle)}
				nombreTotalSolutions={nombreDeResultats}
				paginationOffset={NOMBRE_RESULTATS_OFFRE_STAGE_PAR_PAGE}
				listeSolutionElement={<ListeOffreStage resultats={resultats?.resultats ?? []} />} />
		</main>
	);
}

function messageResultatRecherche(nombreDeResultats: number, motCle?: string) {
	const libelle = nombreDeResultats > 1 ? 'offres de stage' : 'offre de stage';
	return [`${nombreDeResultats} ${libelle}`, motCle && `pour ${motCle}`].filter(Boolean).join(' ');
}

function ListeOffreStage({ resultats }: { resultats: ResultatsRechercheOffreStage['resultats'] }) {
	if (!resultats.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Offres de stage">
			{resultats.map((offreDeStage) => (
				<li key={offreDeStage.slug} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<OffreDeStage hit={offreDeStage} />
				</li>
			))}
		</ul>
	);
}
