import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import {
	FormulaireRechercherFormationAlternance,
} from '~/client/components/features/FormationAlternance/FormulaireRecherche/FormulaireRechercherFormationAlternance';
import {
	EtiquettesFiltreFormationAlternance,
} from '~/client/components/features/FormationAlternance/Rechercher/EtiquettesFiltreFormationAlternance';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { CarifOrefPartner } from '~/client/components/features/ServiceCard/CarifOrefPartner';
import { DecouvrirApprentissage } from '~/client/components/features/ServiceCard/DecouvrirApprentissage';
import { MétierDuSoinPartner } from '~/client/components/features/ServiceCard/MetiersDuSoinPartner';
import { MonCompteFormationPartner } from '~/client/components/features/ServiceCard/MonCompteFormationPartner';
import { ParcourSupPartner } from '~/client/components/features/ServiceCard/ParcourSupPartner';
import { PixPartner } from '~/client/components/features/ServiceCard/PixPartner';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Carte } from '~/client/dsfr';
import { useFormationQuery } from '~/client/hooks/useFormationQuery';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { Erreur } from '~/server/errors/erreur.types';
import { ResultatRechercheFormation } from '~/server/formations/domain/formation';
import { transformObjectToQueryString } from '~/server/services/utils/urlParams.util';
import {Banner} from "~/client/components/ui/Hero/Hero";

const PREFIX_TITRE_PAGE = 'Rechercher une formation en apprentissage';

type RechercherFormationProps = {
	erreurRecherche?: never
	resultats: Array<ResultatRechercheFormation>
} | {
	erreurRecherche: Erreur
	resultats?: never
} | {
	erreurRecherche?: never
	resultats?: never
}

export default function RechercherFormationAlternance({ resultats: formationAlternanceList = [], erreurRecherche }: RechercherFormationProps) {
	const formationQuery = useFormationQuery();
	const router = useRouter();
	const nombreResultats = formationAlternanceList.length;

	const title = formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${nombreResultats === 0 ? ' - Aucun résultat' : ''}`);

	const messageRésultatRecherche: string = useMemo(() => {
		const messageRésultatRechercheSplit: string[] = [`${nombreResultats}`];
		if (nombreResultats > 1) {
			messageRésultatRechercheSplit.push('formations en alternance');
		} else if (nombreResultats === 1) {
			messageRésultatRechercheSplit.push('formation en alternance');
		} else {
			return '';
		}
		if (formationQuery.libelleMetier) {
			messageRésultatRechercheSplit.push(`pour ${formationQuery.libelleMetier}`);
		}
		return messageRésultatRechercheSplit.join(' ');
	}, [nombreResultats, formationQuery.libelleMetier]);

	return (
		<>
			<Head
				title={title}
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BannièreFormation />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={<EtiquettesFiltreFormationAlternance />}
					formulaireRecherche={<FormulaireRechercherFormationAlternance enEtatErreur={erreurRecherche != null} />}
					isChargement={false}
					isEtatInitial={empty(formationQuery)}
					messageResultatRecherche={messageRésultatRecherche}
					nombreTotalSolutions={nombreResultats}
					listeSolutionElement={(
						<ListeFormation
							résultatList={formationAlternanceList}
							queryParams={transformObjectToQueryString({
								...router.query,
								libelleMetier: undefined,
							})} />
					)
					} />
					<ServiceCardList>
						<DecouvrirApprentissage />
						<MonCompteFormationPartner />
						<ParcourSupPartner />
						<CarifOrefPartner />
						<PixPartner />
						<MétierDuSoinPartner />
					</ServiceCardList>
			</main>
		</>
	);
}

function BannièreFormation() {
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				<span className="text--blue">Des milliers de formations en alternance </span>
				pour vous permettre de réaliser votre projet professionnel
			</h1>
		</Banner>
	);
}

interface ListeRésultatProps {
	résultatList: ResultatRechercheFormation[]
	queryParams: string
}

function ListeFormation({ résultatList, queryParams }: ListeRésultatProps) {
	if (!résultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Formations en alternance">
			{résultatList.map((formation) => (
				<li key={formation.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={formation.titre}
						lien={getLienOffre(formation, queryParams)}
						tags={formation.tags as string[]}>
						{formation.nomEntreprise}
						{formation.adresse && <><br />Adresse : {formation.adresse}</>}
					</Carte>
				</li>
			))}
		</ul>
	);
}

// TODO (BRUJ 05/08/2024): Le lien devrait être construit côté serveur
function getLienOffre(formation: ResultatRechercheFormation, queryParams: string) {
	return `/formations/apprentissage/${encodeURIComponent(formation.id)}?${queryParams}&codeCertification=${formation.codeCertification}`;
}
