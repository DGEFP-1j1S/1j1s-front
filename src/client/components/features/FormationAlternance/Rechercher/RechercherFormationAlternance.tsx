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
import { MétierDuSoinPartner } from '~/client/components/features/ServiceCard/MétiersDuSoinPartner';
import { MonCompteFormationPartner } from '~/client/components/features/ServiceCard/MonCompteFormationPartner';
import { ParcourSupPartner } from '~/client/components/features/ServiceCard/ParcourSupPartner';
import { PixPartner } from '~/client/components/features/ServiceCard/PixPartner';
import { Head } from '~/client/components/head/Head';
import {
	ListeRésultatsRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import { EnTete } from '~/client/components/ui/EnTete/EnTete';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import { useFormationQuery } from '~/client/hooks/useFormationQuery';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { Erreur } from '~/server/errors/erreur.types';
import { RésultatRechercheFormation } from '~/server/formations/domain/formation';
import { transformObjectToQueryString } from '~/server/services/utils/urlParams.util';

const PREFIX_TITRE_PAGE = 'Rechercher une formation en apprentissage';

type RechercherFormationProps = {
	erreurRecherche?: never
	resultats: Array<RésultatRechercheFormation>
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
				<EnTete heading="Découvrez des services faits pour vous" />
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
		<LightHero>
			<h1>
				<LightHeroPrimaryText>Des milliers de formations en alternance</LightHeroPrimaryText>
			</h1>
			<LightHeroSecondaryText>pour vous permettre de réaliser votre projet professionnel</LightHeroSecondaryText>
		</LightHero>
	);
}

interface ListeRésultatProps {
	résultatList: RésultatRechercheFormation[]
	queryParams: string
}

function ListeFormation({ résultatList, queryParams }: ListeRésultatProps) {
	if (!résultatList.length) {
		return undefined;
	}

	return (

		<ListeRésultatsRechercherSolution aria-label="Formations en alternance">
			{résultatList.map((formation) => (
				<li key={formation.id}>
					<ResultatRechercherSolution
						lienOffre={getLienOffre(formation, queryParams)}
						intituléOffre={formation.titre}
						// TODO (BRUJ 05/08/2024): les tags devraient être constitués côté client
						étiquetteOffreList={formation.tags as string[]}>
						<section>
							<div>{formation.nomEntreprise && formation.nomEntreprise}</div>
							<div>Adresse : {formation.adresse && formation.adresse}</div>
						</section>
					</ResultatRechercherSolution>
				</li>
			))}
		</ListeRésultatsRechercherSolution>
	);
}

// TODO (BRUJ 05/08/2024): Le lien devrait être construit côté serveur
function getLienOffre(formation: RésultatRechercheFormation, queryParams: string) {
	return `/formations/apprentissage/${encodeURIComponent(formation.id)}?${queryParams}&codeCertification=${formation.codeCertification}`;
}
