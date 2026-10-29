import React from 'react';

import { AnnonceDeLogement } from '~/client/components/features/Logement/Annonce';
import {
	DEVISE,
	FormulaireRechercheAnnonceLogement,
	UNITE_SURFACE,
} from '~/client/components/features/Logement/FormulaireRecherche/FormulaireRechercheAnnonceLogement';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useAnnonceDeLogementQuery } from '~/client/hooks/useAnnonceDeLogementQuery';
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
	const nombreDeResultats = resultats?.nombreDeResultats ?? 0;
	const filtresAppliques = [
		...(annonceQuery.typesOffre ?? []).map(getCapitalizedItems),
		...(annonceQuery.typesBien ?? []).map(getCapitalizedItems),
		...libellesIntervalle(annonceQuery.surfaceMin, annonceQuery.surfaceMax, UNITE_SURFACE),
		...libellesIntervalle(annonceQuery.prixMin, annonceQuery.prixMax, DEVISE),
	];

	return (
		<main id="contenu">
			<RechercherSolutionLayout
				banniere={(
					<Banner>
						<h1 className="fr-h1 fr-mb-0">Plus de 3 000 offres de logements étudiants et de locations jeune actif partout en France</h1>
					</Banner>
				)}
				erreurRecherche={erreurRecherche}
				// NOTE : la clé recrée le formulaire quand l‘URL change (historique), pour que ses champs reflètent la recherche
				formulaireRecherche={<FormulaireRechercheAnnonceLogement key={JSON.stringify(annonceQuery)} facettes={resultats?.facettes ?? FACETTES_VIDES} />}
				etiquettesRecherche={filtresAppliques.length > 0 ? <TagList list={filtresAppliques} aria-label="Filtres de la recherche" /> : undefined}
				isChargement={false}
				isEtatInitial={false}
				messageResultatRecherche={messageResultatRecherche(nombreDeResultats, annonceQuery.ville)}
				nombreTotalSolutions={nombreDeResultats}
				paginationOffset={NOMBRE_RESULTATS_ANNONCE_DE_LOGEMENT_PAR_PAGE}
				listeSolutionElement={<ListeAnnonceDeLogement resultats={resultats?.resultats ?? []} />} />
		</main>
	);
}

function libellesIntervalle(min: string | undefined, max: string | undefined, unite: string) {
	return [
		min && `A partir de ${min} ${unite}`,
		max && `Jusqu‘à ${max} ${unite}`,
	].filter((libelle): libelle is string => Boolean(libelle));
}

function messageResultatRecherche(nombreDeResultats: number, ville?: string) {
	const libelle = nombreDeResultats > 1 ? 'annonces pour étudiants' : 'annonce pour étudiants';
	return [`${nombreDeResultats} ${libelle}`, ville && `pour ${ville}`].filter(Boolean).join(' ');
}

function ListeAnnonceDeLogement({ resultats }: { resultats: ResultatsRechercheAnnonceDeLogement['resultats'] }) {
	if (!resultats.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Annonces de logement">
			{resultats.map((annonce) => (
				<li key={annonce.slug} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<AnnonceDeLogement hit={annonce} />
				</li>
			))}
		</ul>
	);
}
