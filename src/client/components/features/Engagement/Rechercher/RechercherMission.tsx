import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BanniereMission } from '~/client/components/features/Engagement/Rechercher/BanniereMission';
import {
	FormulaireRechercheMissionEngagement,
} from '~/client/components/features/Engagement/Rechercher/FormulaireRecherche/FormulaireRechercheMissionEngagement';
import {
	EtiquettesFiltreMission,
} from '~/client/components/features/Engagement/Rechercher/ResultatsRecherche/EtiquettesFiltreMission';
import { ListeMissions } from '~/client/components/features/Engagement/Rechercher/ResultatsRecherche/ListeMissions';
import { ServiceCard, ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { EnTete } from '~/client/components/ui/EnTete/EnTete';
import { Footnote } from '~/client/components/ui/Footnote/Footnote';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useMissionEngagementQuery } from '~/client/hooks/useMissionEngagementQuery';
import { MissionEngagementService } from '~/client/services/missionEngagement/missionEngagement.service';
import empty from '~/client/utils/empty';
import { EngagementCategory } from '~/client/utils/engagementsCategory.enum';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import {
	bénévolatDomaineList,
	Mission,
	NOMBRE_RÉSULTATS_MISSION_PAR_PAGE,
	serviceCiviqueDomaineList,
} from '~/server/engagement/domain/engagement';
import { isSuccess } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';

interface RechercherMissionProps {
	category: EngagementCategory.BENEVOLAT | EngagementCategory.SERVICE_CIVIQUE
}

interface Option {
	libellé: string;
	valeur: string;
}

export function RechercherMission(props: RechercherMissionProps) {
	const { category } = props;
	const missionEngagementService = useDependency<MissionEngagementService>('missionEngagementService');
	const missionEngagementQuery = useMissionEngagementQuery();
	const [missionList, setMissionList] = useState<Mission[]>([]);
	const [nombreResultats, setNombreResultats] = useState(0);


	function recupererLibelleDepuisValeur(optionList: Array<Option>, valeur: string): string {
		const optionTrouvée = optionList.find((option) => option.valeur === valeur);
		return optionTrouvée?.libellé || '';
	}

	const isServiceCivique = useMemo(() => {
		return category === EngagementCategory.SERVICE_CIVIQUE;
	}, [category]);

	const [isLoading, setIsLoading] = useState(false);
	const [erreurRecherche, setErreurRecherche] = useState<Erreur | undefined>(undefined);
	const [title, setTitle] = useState<string>(`Rechercher une mission de ${isServiceCivique ? 'service civique' : 'bénévolat'} | 1jeune1solution'`);

	const rechercherMission = useCallback(async () => {
		setIsLoading(true);
		setErreurRecherche(undefined);
		try {
			const response = await missionEngagementService.rechercherMission(missionEngagementQuery, category);
			if (isSuccess(response)) {
				setTitle(formatRechercherSolutionDocumentTitle(`Rechercher une mission de  ${isServiceCivique ? 'service civique' : 'bénévolat'} ${response.result.résultats.length === 0 ? ' - Aucun résultat' : ''}`));
				setMissionList(response.result.résultats);
				setNombreResultats(response.result.nombreRésultats);
			} else {
				setTitle(formatRechercherSolutionDocumentTitle(`Rechercher une mission de ${isServiceCivique ? 'service civique' : 'bénévolat'}`, response.errorType));
				setErreurRecherche(response.errorType);
			}
		} finally {
			setIsLoading(false);
		}
	}, [category, isServiceCivique, missionEngagementQuery, missionEngagementService]);

	useEffect(() => {
		if (empty(missionEngagementQuery)) {
			return;
		}
		rechercherMission();
	}, [missionEngagementQuery, rechercherMission]);

	const domainQuery = missionEngagementQuery?.domain;
	const domaine = domainQuery && recupererLibelleDepuisValeur(isServiceCivique ? serviceCiviqueDomaineList : bénévolatDomaineList, domainQuery);

	return (
		<>
			<Head
				title={title || `Rechercher une mission de ${isServiceCivique ? 'service civique' : 'bénévolat'} | 1jeune1solution`}
				description="Se rendre utile tout en préparant son avenir grâce aux missions de service civique"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BanniereMission isServiceCivique={isServiceCivique} />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={<EtiquettesFiltreMission />}
					formulaireRecherche={<FormulaireRechercheMissionEngagement domainList={isServiceCivique ? serviceCiviqueDomaineList : bénévolatDomaineList} />}
					isChargement={isLoading}
					isEtatInitial={empty(missionEngagementQuery)}
					messageResultatRecherche={(
						<>
							{messageNombreResultats({
								domaine: domaine,
								isServiceCivique: isServiceCivique,
								nombreResultats: nombreResultats,
							})}
							<Footnote.Reference to="partenaires" id="partenaires-reference" />
						</>
					)}
					nombreTotalSolutions={nombreResultats}
					paginationOffset={NOMBRE_RÉSULTATS_MISSION_PAR_PAGE}
					listeSolutionElement={<ListeMissions resultatList={missionList} isServiceCivique={isServiceCivique} />}
					footnote={(
						<Footnote htmlFor="partenaires-reference" id="partenaires">
							les annonces listées ci-dessus nous sont fournies par nos partenaires (<a href="/cgu#3.-services">liste disponible dans les <abbr title="Conditions Générales d'Utilisation">CGU</abbr></a>)
						</Footnote>
					)} />
				<EnTete heading="Consultez nos articles et découvrez des services faits pour vous" />
				{isServiceCivique ? (
					<ServiceCardList>
						<ServiceCard
							linkLabel="Lire l'article"
							logo="/images/logos/service-civique.svg"
							link="/articles/faire-un-service-civique"
							title="Pourquoi faire un service civique ?"
							titleAs={'h3'}>
							Découvrez l’univers du service civique : ses missions, sa rémunération et les perspectives d’avenir qu’offre cet engagement enrichissant !
						</ServiceCard>
						<ServiceCard
							linkLabel="Lire l'article"
							logo="/images/logos/service-civique.svg"
							link="/articles/service-civique-jeunes"
							title="L'impact du service civique sur les jeunes"
							titleAs={'h3'}>
							Découvrez comment le service civique favorise le développement personnel et professionnel des jeunes engagés !
						</ServiceCard>
					</ServiceCardList>
				) : (
					<ServiceCardList>
						<ServiceCard
							linkLabel="Lire l'article"
							logo="/images/bénévolat-disponible-article.webp"
							link="/articles/des-missions-de-benevolat-toujours-disponibles"
							title="Des missions de bénévolat toujours disponibles"
							titleAs={'h3'}>
							Trouver des centaines d’offres sur la plateforme.
						</ServiceCard>
					</ServiceCardList>
				)}
			</main>
		</>
	);
}

export function messageNombreResultats({ nombreResultats, isServiceCivique, domaine }: {
	nombreResultats: number,
	isServiceCivique: boolean,
	domaine?: string
}): string {
	const motMission = (nombreResultats > 1) ? 'missions' : 'mission';
	const categorie = isServiceCivique ? 'service civique' : 'bénévolat';

	return [
		nombreResultats.toString(),
		motMission,
		`de ${categorie}`,
		domaine && `pour ${domaine}`,
	].filter(Boolean)
		.join(' ');
}

