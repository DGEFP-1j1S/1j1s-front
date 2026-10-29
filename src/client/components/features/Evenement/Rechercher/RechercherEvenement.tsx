import React from 'react';

import { FormulaireRechercheEvenement } from '~/client/components/features/Evenement/FormulaireRecherche/FormulaireRechercheEvenement';
import { RésultatRechercherEvenement } from '~/client/components/features/Evenement/ResultatRechercherEvenement';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { TagList } from '~/client/components/ui/Tag/TagList';
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
	const nombreDeResultats = resultats?.nombreDeResultats ?? 0;
	const filtresAppliques = evenementQuery.lieux ?? [];

	return (
		<main id="contenu">
			<RechercherSolutionLayout
				banniere={(
					<Banner>
						<h1 className="fr-h1 fr-mb-0">Des centaines d‘évènements de recrutement pour tous les jeunes, partout en France</h1>
					</Banner>
				)}
				erreurRecherche={erreurRecherche}
				// NOTE : la clé recrée le formulaire quand l‘URL change (historique), pour que ses champs reflètent la recherche
				formulaireRecherche={<FormulaireRechercheEvenement key={JSON.stringify(evenementQuery)} />}
				etiquettesRecherche={filtresAppliques.length > 0 ? <TagList list={filtresAppliques} aria-label="Filtres de la recherche" /> : undefined}
				isChargement={false}
				isEtatInitial={false}
				messageResultatRecherche={messageResultatRecherche(nombreDeResultats, evenementQuery.motCle)}
				nombreTotalSolutions={nombreDeResultats}
				paginationOffset={NOMBRE_RESULTATS_EVENEMENT_PAR_PAGE}
				listeSolutionElement={<ListeEvenement resultats={resultats?.resultats ?? []} />} />
		</main>
	);
}

function messageResultatRecherche(nombreDeResultats: number, motCle?: string) {
	const libelle = nombreDeResultats > 1 ? 'évènements' : 'évènement';
	return [`${nombreDeResultats} ${libelle}`, motCle && `pour ${motCle}`].filter(Boolean).join(' ');
}

function ListeEvenement({ resultats }: { resultats: ResultatsRechercheEvenement['resultats'] }) {
	if (!resultats.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Évènements">
			{resultats.map((evenement, index) => (
				<li key={evenement.slug ?? index} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<RésultatRechercherEvenement hit={evenement} />
				</li>
			))}
		</ul>
	);
}
