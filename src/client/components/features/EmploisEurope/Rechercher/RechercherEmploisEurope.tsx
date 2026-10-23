import { useCallback, useEffect, useMemo, useState } from 'react';

import { BanniereEmploisEurope } from '~/client/components/features/EmploisEurope/BanniereEmploisEurope';
import {
	FormulaireRechercheEmploisEurope,
} from '~/client/components/features/EmploisEurope/FormulaireRecherche/FormulaireRechercheEmploisEurope';
import {
	EtiquettesFiltresRecherche,
} from '~/client/components/features/EmploisEurope/Rechercher/EtiquettesFiltresRecherche';
import { getTagsFromAnnonce } from '~/client/components/features/EmploisEurope/tags.utils';
import { Carte } from '~/client/dsfr';
import { AidesFinancieresEurope } from '~/client/components/features/ServiceCard/AidesFinancieresEurope';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { EurasmusPlusPartner } from '~/client/components/features/ServiceCard/ErasmusPlusPartner';
import { EuresPartner } from '~/client/components/features/ServiceCard/EuresPartner';
import { ExperiencesEurope } from '~/client/components/features/ServiceCard/ExperiencesEurope';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useEmploiEuropeQuery } from '~/client/hooks/useEmploiEuropeQuery';
import { EmploiEuropeService } from '~/client/services/europe/emploiEurope.service';
import empty from '~/client/utils/empty';
import { formatNumberWithSpace } from '~/client/utils/formatNumberWithSpace';
import { EmploiEurope } from '~/server/emplois-europe/domain/emploiEurope';
import {
	EMPLOIS_EUROPE_ITEMS_PER_PAGE,
	EMPLOIS_EUROPE_LAST_VISIBLE_PAGE_ALLOWED,
} from '~/server/emplois-europe/infra/repositories/apiEuresEmploiEurope';
import { isSuccess } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';

export default function RechercherEmploisEurope() {
	const emploiEuropeQuery = useEmploiEuropeQuery();
	const emploiEuropeService = useDependency<EmploiEuropeService>('emploiEuropeService');
	const [emploiEuropeList, setEmploiEuropeList] = useState<EmploiEurope[]>([]);
	const [nombreResultats, setNombreResultats] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [erreurRecherche, setErreurRecherche] = useState<Erreur | undefined>(undefined);

	const rechercherEmploiEurope = useCallback(async () => {
		setIsLoading(true);
		setErreurRecherche(undefined);
		try {
			// TODO (BRUJ 24/07/2024): Devrait être en SSR
			const response = await emploiEuropeService.rechercherEmploiEurope(emploiEuropeQuery);
			if (isSuccess(response)) {
				setEmploiEuropeList(response.result.offreList);
				setNombreResultats(response.result.nombreResultats);
			} else {
				setErreurRecherche(response.errorType);
			}
		} finally {
			setIsLoading(false);
		}
	}, [emploiEuropeQuery, emploiEuropeService]);

	useEffect(() => {
		if (empty(emploiEuropeQuery)) {
			return;
		}
		rechercherEmploiEurope();
	}, [emploiEuropeQuery, rechercherEmploiEurope]);

	const messageResultatRecherche: string = useMemo(() => {
		const nombreResultatsFormaté = formatNumberWithSpace(nombreResultats);

		const messageResultatRechercheSplit: string[] = [`${nombreResultatsFormaté}`];
		if (nombreResultats > 1) {
			messageResultatRechercheSplit.push('offres d’emplois en Europe');
		} else {
			messageResultatRechercheSplit.push('offre d’emploi en Europe');
		}
		if (emploiEuropeQuery.motCle) {
			messageResultatRechercheSplit.push(`pour ${emploiEuropeQuery.motCle}`);
		}
		return messageResultatRechercheSplit.join(' ');
	}, [nombreResultats, emploiEuropeQuery.motCle]);

	return (
		<>
			<Head
				title="Rechercher un emploi en Europe | 1jeune1solution"
				description="Des milliers d’offres d’emplois en Europe sélectionnées pour vous par EURES"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BanniereEmploisEurope />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={<EtiquettesFiltresRecherche />}
					formulaireRecherche={<FormulaireRechercheEmploisEurope />}
					isChargement={isLoading}
					isEtatInitial={empty(emploiEuropeQuery)}
					nombreTotalSolutions={nombreResultats}
					paginationOffset={EMPLOIS_EUROPE_ITEMS_PER_PAGE}
					listeSolutionElement={<ListeResultatsEmploiEurope resultatList={emploiEuropeList} />}
					messageResultatRecherche={messageResultatRecherche}
					maxPage={EMPLOIS_EUROPE_LAST_VISIBLE_PAGE_ALLOWED - 1} />
					<ServiceCardList heading="Découvrez les dispositifs pour vous accompagner dans votre projet">
						<EuresPartner />
						<EurasmusPlusPartner />
						<AidesFinancieresEurope />
						<ExperiencesEurope />
					</ServiceCardList>
			</main>
		</>
	);
}

function ListeResultatsEmploiEurope({ resultatList }: { resultatList: EmploiEurope[] }) {
	if (!resultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters">
			{resultatList.map((emploiEurope) => (
				<li key={emploiEurope.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={emploiEurope.titre ? <span lang={emploiEurope.codeLangueDeLOffre ?? ''}>{emploiEurope.titre}</span> : "Offre d’emploi sans titre"}
						lien={`/emplois-europe/${emploiEurope.id}`}
						tags={getTagsFromAnnonce(emploiEurope)}>
						{emploiEurope.nomEntreprise}
					</Carte>
				</li>
			))}
		</ul>
	);
}
