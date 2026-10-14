import React, { useMemo } from 'react';

import {
	FormulaireRechercheJobEtudiant,
} from '~/client/components/features/JobEtudiant/FormulaireRecherche/FormulaireRechercheJobEtudiant';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { LaBonneBoitePartner } from '~/client/components/features/ServiceCard/LaBonneBoitePartner';
import { OnisepMetierPartner } from '~/client/components/features/ServiceCard/OnisepMetierPartner';
import { ServiceCiviquePartner } from '~/client/components/features/ServiceCard/ServiceCiviquePartner';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Carte } from '~/client/dsfr';
import {
	formatLibelleLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/formatLibelleLocalisation';
import {
	getCodeLibelleLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/getCodeLibelleLocalisation';
import { Banner } from '~/client/components/ui/Hero/Hero';
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

const PREFIX_TITRE_PAGE = 'Rechercher un job étudiant';

interface RechercherJobEtudiantProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheOffre
}

export function RechercherJobÉtudiant(props: RechercherJobEtudiantProps) {
	const offreEmploiQuery = useOffreQuery();

	const title = formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${props.resultats?.nombreRésultats === 0 ? ' - Aucun résultat' : ''}`);
	const jobÉtudiantList = props.resultats?.résultats || [];
	const nombreRésultats = props.resultats?.nombreRésultats || 0;
	const erreurRecherche = props.erreurRecherche;

	const messageRésultatRecherche: string = useMemo(() => {
		const messageRésultatRechercheSplit: string[] = [`${nombreRésultats}`];
		if (nombreRésultats > 1) {
			messageRésultatRechercheSplit.push('offres de jobs étudiants');
		} else {
			messageRésultatRechercheSplit.push('offre de job étudiant');
		}
		if (offreEmploiQuery.motCle) {
			messageRésultatRechercheSplit.push(`pour ${offreEmploiQuery.motCle}`);
		}
		return messageRésultatRechercheSplit.join(' ');
	}, [nombreRésultats, offreEmploiQuery.motCle]);

	const étiquettesRecherche = useMemo(() => {
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
				description="Des milliers de jobs étudiants sélectionnés pour vous"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BannièreJobÉtudiant />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={étiquettesRecherche}
					formulaireRecherche={<FormulaireRechercheJobEtudiant />}
					isChargement={false}
					isEtatInitial={empty(offreEmploiQuery)}
					messageResultatRecherche={messageRésultatRecherche}
					nombreTotalSolutions={nombreRésultats}
					paginationOffset={NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE}
					maxPage={MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL - 1}
					listeSolutionElement={<ListeOffreJobÉtudiant résultatList={jobÉtudiantList} />} />
				<ServiceCardList>
					<LaBonneBoitePartner />
					<OnisepMetierPartner />
					<ServiceCiviquePartner />
				</ServiceCardList>
			</main>
		</>
	);
}

interface ListeRésultatProps {
  résultatList: Offre[]
}

function ListeOffreJobÉtudiant({ résultatList }: ListeRésultatProps) {
	if (!résultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Offres de jobs étudiants">
			{résultatList.map((offreEmploi: Offre) => (
				<li key={offreEmploi.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={offreEmploi.intitulé}
						lien={`/jobs-etudiants/${offreEmploi.id}`}
						tags={offreEmploi.étiquetteList}>
						{offreEmploi.entreprise.nom}
					</Carte>
				</li>
			))}
		</ul>
	);
}

function BannièreJobÉtudiant() {
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				Des milliers de jobs étudiants sélectionnés pour vous par France Travail
			</h1>
		</Banner>
	);
}
