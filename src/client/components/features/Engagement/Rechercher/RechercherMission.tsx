import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BanniereMission } from '~/client/components/features/Engagement/Rechercher/BanniereMission';
import {
	FormulaireRechercheMissionEngagement,
} from '~/client/components/features/Engagement/Rechercher/FormulaireRecherche/FormulaireRechercheMissionEngagement';
import {
	EtiquettesFiltreMission,
} from '~/client/components/features/Engagement/Rechercher/ResultatsRecherche/EtiquettesFiltreMission';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { Carte } from '~/client/dsfr';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
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
				{isServiceCivique ? (
					<ServiceCardList heading="Consultez nos articles et découvrez des services faits pour vous">
						<Carte
							horizontal
							imageSrc="/images/logos/service-civique.svg"
							lien="/articles/faire-un-service-civique"
							titre="Pourquoi faire un service civique ?">
							Découvrez l’univers du service civique : ses missions, sa rémunération et les perspectives d’avenir qu’offre cet engagement enrichissant !
						</Carte>
						<Carte
							horizontal
							imageSrc="/images/logos/service-civique.svg"
							lien="/articles/service-civique-jeunes"
							titre="L’impact du service civique sur les jeunes">
							Découvrez comment le service civique favorise le développement personnel et professionnel des jeunes engagés !
						</Carte>
					</ServiceCardList>
				) : (
					<ServiceCardList heading="Consultez nos articles et découvrez des services faits pour vous">
						<Carte
							horizontal
							imageSrc="/images/bénévolat-disponible-article.webp"
							lien="/articles/des-missions-de-benevolat-toujours-disponibles"
							titre="Des missions de bénévolat toujours disponibles">
							Trouver des centaines d’offres sur la plateforme.
						</Carte>
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

function ListeMissions({ resultatList, isServiceCivique }: { resultatList: Mission[], isServiceCivique: boolean }) {
	if (!resultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label={isServiceCivique ? 'Offre pour le service civique' : 'Offre pour le bénévolat'}>
			{resultatList.map((mission: Mission) => (
				<li key={mission.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={mission.titre}
						lien={isServiceCivique ? `/service-civique/${mission.id}` : `/benevolat/${mission.id}`}
						tags={mission.etiquetteList}>
						{mission.nomEntreprise}
					</Carte>
				</li>
			))}
		</ul>
	);
}

