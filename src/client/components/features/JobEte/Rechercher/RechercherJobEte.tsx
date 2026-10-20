import React, { useMemo } from 'react';

import {
	FormulaireRechercheJobEte,
} from '~/client/components/features/JobEte/FormulaireRecherche/FormulaireRechercheJobEte';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Carte } from '~/client/dsfr';
import {
	formatLibelleLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/formatLibelleLocalisation';
import {
	getCodeLibelleLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/getCodeLibelleLocalisation';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useOffreQuery } from '~/client/hooks/useOffreQuery';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { Erreur } from '~/server/errors/erreur.types';
import {
	MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL,
	NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE,
	Offre,
	ResultatsRechercheOffre,
} from '~/server/offres/domain/offre';
import { Banner } from '~/client/components/ui/Hero/Hero';

const PREFIX_TITRE_PAGE = 'Rechercher un job d’été';

interface RechercherJobEteProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheOffre
}

export function RechercherJobEte(props: RechercherJobEteProps) {
	const offreEmploiQuery = useOffreQuery();

	const title = formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${props.resultats?.nombreRésultats === 0 ? ' - Aucun résultat' : ''}`);
	const jobEteList = props.resultats?.résultats || [];
	const nombreResultats = props.resultats?.nombreRésultats || 0;
	const erreurRecherche = props.erreurRecherche;

	const messageResultatRecherche: string = useMemo(() => {
		const messageResultatRechercheSplit: string[] = [`${nombreResultats}`];
		if (nombreResultats > 1) {
			messageResultatRechercheSplit.push('offres de jobs d’été');
		} else {
			messageResultatRechercheSplit.push('offre de job d’été');
		}
		if (offreEmploiQuery.motCle) {
			messageResultatRechercheSplit.push(`pour ${offreEmploiQuery.motCle}`);
		}
		return messageResultatRechercheSplit.join(' ');
	}, [nombreResultats, offreEmploiQuery.motCle]);

	const etiquettesRecherche = useMemo(() => {
		if (offreEmploiQuery.nomLocalisation) {
			return (
				<TagList list={[
					formatLibelleLocalisation(
						offreEmploiQuery.nomLocalisation,
						getCodeLibelleLocalisation(offreEmploiQuery.codeLocalisation, offreEmploiQuery.codePostalLocalisation, offreEmploiQuery.typeLocalisation) || '',
					),
				]}
				aria-label="Filtres de la recherche" />
			);
		} else {
			return undefined;
		}
	}, [offreEmploiQuery.codeLocalisation, offreEmploiQuery.codePostalLocalisation, offreEmploiQuery.nomLocalisation, offreEmploiQuery.typeLocalisation]);

	return (
		<>
			<Head
				title={title}
				description="Des milliers de jobs d’été sélectionnés pour vous"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BanniereJobEte />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={etiquettesRecherche}
					formulaireRecherche={<FormulaireRechercheJobEte />}
					isChargement={false}
					isEtatInitial={empty(offreEmploiQuery)}
					messageResultatRecherche={messageResultatRecherche}
					nombreTotalSolutions={nombreResultats}
					paginationOffset={NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE}
					maxPage={MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL - 1}
					listeSolutionElement={<ListeOffreJobEte resultatList={jobEteList} />} />
			</main>
		</>
	);
}

interface ListeResultatProps {
	resultatList: Offre[]
}

function ListeOffreJobEte({ resultatList }: ListeResultatProps) {
	if (!resultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Offres de jobs d’été">
			{resultatList.map((offreEmploi: Offre) => (
				<li key={offreEmploi.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={offreEmploi.intitulé}
						lien={`/jobs-ete/${offreEmploi.id}`}
						tags={offreEmploi.étiquetteList}>
						{offreEmploi.entreprise.nom}
					</Carte>
				</li>
			))}
		</ul>
	);
}

function BanniereJobEte() {
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				Des milliers de jobs d’été sélectionnés pour vous par France Travail
			</h1>
		</Banner>
	);
}
