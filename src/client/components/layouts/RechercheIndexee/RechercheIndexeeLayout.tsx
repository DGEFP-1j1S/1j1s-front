import { useRouter } from 'next/router';
import React from 'react';

import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { Erreur } from '~/server/errors/erreur.types';

export type LibelleResultats = {
	intitule: {
		singulier: string;
		pluriel: string;
	},
	pourFiltre?: string;
}

interface RechercheIndexeeLayoutProps<Resultat> {
	titre: string
	formulaire: React.ReactElement
	erreurRecherche?: Erreur
	nombreDeResultats: number
	nombreDeResultatsParPage: number
	libelleResultats: LibelleResultats
	filtresAppliques: Array<string>
	resultats: Array<Resultat>
	libelleListe: string
	cleResultat: (resultat: Resultat, index: number) => string
	afficherResultat: (resultat: Resultat) => React.ReactNode
}

export function RechercheIndexeeLayout<Resultat>({
	titre,
	formulaire,
	erreurRecherche,
	nombreDeResultats,
	nombreDeResultatsParPage,
	libelleResultats,
	filtresAppliques,
	resultats,
	libelleListe,
	cleResultat,
	afficherResultat,
}: RechercheIndexeeLayoutProps<Resultat>) {
	const { query } = useRouter();
	const libelle = nombreDeResultats > 1 ? libelleResultats.intitule.pluriel : libelleResultats.intitule.singulier;
	const messageResultatRecherche = [`${nombreDeResultats} ${libelle}`, libelleResultats.pourFiltre && `pour ${libelleResultats.pourFiltre}`]
		.filter(Boolean)
		.join(' ');

	return (
		<main id="contenu">
			<RechercherSolutionLayout
				banniere={(
					<Banner>
						<h1 className="fr-h1 fr-mb-0">{titre}</h1>
					</Banner>
				)}
				erreurRecherche={erreurRecherche}
				// NOTE : la clé recrée le formulaire quand l‘URL change (historique), pour que ses champs reflètent la recherche
				formulaireRecherche={<React.Fragment key={JSON.stringify(query)}>{formulaire}</React.Fragment>}
				etiquettesRecherche={filtresAppliques.length > 0 ? <TagList list={filtresAppliques} aria-label="Filtres de la recherche" /> : undefined}
				isChargement={false}
				isEtatInitial={false}
				messageResultatRecherche={messageResultatRecherche}
				nombreTotalSolutions={nombreDeResultats}
				paginationOffset={nombreDeResultatsParPage}
				listeSolutionElement={resultats.length > 0 ? (
					<ul className="fr-grid-row fr-grid-row--gutters" aria-label={libelleListe}>
						{resultats.map((resultat, index) => (
							<li key={cleResultat(resultat, index)} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
								{afficherResultat(resultat)}
							</li>
						))}
					</ul>
				) : <></>} />
		</main>
	);
}
