import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
	FormulaireRechercheAccompagnement,
} from '~/client/components/features/Accompagnement/FormulaireRecherche/FormulaireRechercheAccompagnement';
import {
	ResultatRechercherAccompagnement,
} from '~/client/components/features/Accompagnement/Rechercher/Resultat/ResultatRechercherAccompagnement';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { FranceTravailPartner } from '~/client/components/features/ServiceCard/FranceTravailPartner';
import { InfoJeunesPartner } from '~/client/components/features/ServiceCard/InfoJeunesPartner';
import { MissionsLocalesPartner } from '~/client/components/features/ServiceCard/MissionsLocalesPartner';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useAccompagnementQuery } from '~/client/hooks/useAccompagnementQuery';
import {
	EtablissementAccompagnementService,
} from '~/client/services/etablissementAccompagnement/etablissementAccompagnement.service';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { isSuccess } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import {
	EtablissementAccompagnement,
	TypeEtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import {Banner} from "~/client/components/ui/Hero/Hero";

export function RechercherAccompagnement() {
	const accompagnementQuery = useAccompagnementQuery();
	const etablissementAccompagnementService = useDependency<EtablissementAccompagnementService>('établissementAccompagnementService');

	const [etablissementAccompagnementList, setEtablissementAccompagnementList] = useState<EtablissementAccompagnement[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [erreurRecherche, setErreurRecherche] = useState<Erreur | undefined>(undefined);
	const [title, setTitle] = useState<string | undefined>();

	const rechercherEtablissementAccompagnement = useCallback(async () => {
		setIsLoading(true);
		setErreurRecherche(undefined);
		try {
			const response = await etablissementAccompagnementService.rechercher(accompagnementQuery);
			if (isSuccess(response)) {
				setTitle(formatRechercherSolutionDocumentTitle(`Rechercher un établissement d‘accompagnement ${response.result.length === 0 ? ' - Aucun résultat' : ''}`));
				setEtablissementAccompagnementList(response.result);
			} else {
				setTitle(formatRechercherSolutionDocumentTitle('Rechercher un établissement d‘accompagnement', response.errorType));
				setErreurRecherche(response.errorType);
			}
		} finally {
			setIsLoading(false);
		}
	}, [accompagnementQuery, etablissementAccompagnementService]);

	useEffect(function rechercherEtablissementAccompagnementEffect() {
		if (empty(accompagnementQuery)) {
			return;
		}
		rechercherEtablissementAccompagnement();
	}, [accompagnementQuery, rechercherEtablissementAccompagnement]);

	const messageResultatRecherche: string = useMemo(() => {
		const messageResultatRechercheSplit: string[] = [`${etablissementAccompagnementList.length}`];
		if (etablissementAccompagnementList.length > 1) {
			messageResultatRechercheSplit.push('établissements');
		} else {
			messageResultatRechercheSplit.push('établissement');
		}

		switch (accompagnementQuery.typeAccompagnement) {
			case TypeEtablissement.FRANCE_TRAVAIL:
				messageResultatRechercheSplit.push('d‘accompagnement pour les Agences France Travail');
				break;
			case TypeEtablissement.INFO_JEUNE:
				messageResultatRechercheSplit.push('d‘accompagnement pour les structures Infos Jeunes');
				break;
			case TypeEtablissement.MISSION_LOCALE:
				messageResultatRechercheSplit.push('d‘accompagnement pour les structures Missions Locales');
				break;
		}

		return messageResultatRechercheSplit.join(' ');
	}, [accompagnementQuery.typeAccompagnement, etablissementAccompagnementList.length]);

	const etiquettesRecherche = useMemo(() => {
		if (accompagnementQuery.ville && accompagnementQuery.codePostal) {
			return <TagList list={[`${accompagnementQuery.ville} (${accompagnementQuery.codePostal})`]} aria-label="Filtres de la recherche" />;
		} else {
			return undefined;
		}
	}, [accompagnementQuery.ville, accompagnementQuery.codePostal]);

	return (
		<>
			<Head
				title={title || 'Trouver un accompagnement | 1jeune1solution'}
				description="Trouver un accompagnement"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BanniereAccompagnement />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={etiquettesRecherche}
					formulaireRecherche={<FormulaireRechercheAccompagnement />}
					isChargement={isLoading}
					isEtatInitial={empty(accompagnementQuery)}
					messageResultatRecherche={messageResultatRecherche}
					nombreTotalSolutions={etablissementAccompagnementList?.length || 0}
					listeSolutionElement={<ListeEtablissementAccompagnement resultatList={etablissementAccompagnementList} />}
				/>
				<ServiceCardList heading="Découvrez d’autres services faits pour vous">
					<MissionsLocalesPartner />
					<InfoJeunesPartner />
					<FranceTravailPartner />
				</ServiceCardList>
			</main>
		</>
	);
}

function BanniereAccompagnement() {
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				<span className="text--blue">Je recherche un accompagnement proche de chez moi </span>
				pour être aidé dans mes démarches et mon parcours
			</h1>
		</Banner>
	);
}

interface ListeResultatProps {
  resultatList: EtablissementAccompagnement[]
}

function ListeEtablissementAccompagnement({ resultatList: resultatList }: ListeResultatProps) {
	if (!resultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Établissements d’accompagnement">
			{resultatList.map((etablissementAccompagnement: EtablissementAccompagnement) => (
				<li key={etablissementAccompagnement.id} className="fr-col-12">
					<ResultatRechercherAccompagnement etablissement={etablissementAccompagnement} />
				</li>
			))}
		</ul>
	);
}

