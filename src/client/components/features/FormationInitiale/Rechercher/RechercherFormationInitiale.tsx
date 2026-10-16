import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import {
	FormulaireRechercheFormationInitiale,
} from '~/client/components/features/FormationInitiale/Rechercher/FormulaireRecherche/FormulaireRechercheFormationInitiale';
import {
	ListeDesServicesInteressants,
} from '~/client/components/features/FormationInitiale/Rechercher/ServicesInteressants/ListeDesServicesInteressants';
import { Head } from '~/client/components/head/Head';
import {
	ListeRésultatsRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useFormationInitialeQuery } from '~/client/hooks/useFormationInitialeQuery';
import { FormationInitialeService } from '~/client/services/formationInitiale/formationInitiale.service';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { isSuccess } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import {
	FormationInitiale,
	NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE,
} from '~/server/formations-initiales/domain/formationInitiale';

const PREFIX_TITRE_PAGE = 'Rechercher une formation initiale';

export function RechercherFormationInitiale() {
	const router = useRouter();

	const formationInitialeService = useDependency<FormationInitialeService>('formationInitialeService');
	const [title, setTitle] = useState<string>(`${PREFIX_TITRE_PAGE} | 1jeune1solution`);
	const [erreurRecherche, setErreurRecherche] = useState<Erreur | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	const [resultatList, setResultatList] = useState<Array<FormationInitiale>>([]);
	const [nombreDeResultat, setNombreDeResultat] = useState<number>(0);

	const formationInitialeQuery = useFormationInitialeQuery();

	const rechercherFormationInitiale = useCallback(async () => {
		setIsLoading(true);
		setErreurRecherche(undefined);

		try {
			const response = await formationInitialeService.rechercherFormationInitiale(formationInitialeQuery);
			if (isSuccess(response)) {
				setTitle(formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${response.result.nombreDeResultat === 0 ? ' - Aucun résultat' : ''}`));
				const formationInitiales = response.result.formationsInitiales;
				setResultatList(formationInitiales);
				setNombreDeResultat(response.result.nombreDeResultat);
			} else {
				setTitle(formatRechercherSolutionDocumentTitle(PREFIX_TITRE_PAGE, response.errorType));
				setErreurRecherche(response.errorType);
			}
		} finally {
			setIsLoading(false);
		}
	}, [formationInitialeQuery, formationInitialeService]);

	useEffect(() => {
		if (empty(formationInitialeQuery)) {
			return;
		}
		rechercherFormationInitiale();
	}, [formationInitialeQuery, rechercherFormationInitiale]);

	function getMessageResultatTrouve() {
		const formationName = router.query.motCle === undefined ? '' : `pour ${router.query.motCle}`;
		return `${nombreDeResultat} formation${nombreDeResultat > 1 ? 's' : ''} ${formationName}`;
	}

	const messageResultatRecherche = resultatList?.length > 0 ? getMessageResultatTrouve() : '';

	return (
		<>
			<Head
				title={title}
				description="Des milliers de formations pour vous permettre de réaliser votre projet professionnel"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={banniere()}
					erreurRecherche={erreurRecherche}
					formulaireRecherche={<FormulaireRechercheFormationInitiale />}
					isChargement={isLoading}
					isEtatInitial={empty(formationInitialeQuery)}
					messageResultatRecherche={messageResultatRecherche}
					nombreTotalSolutions={nombreDeResultat}
					paginationOffset={NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE}
					listeSolutionElement={<ListeFormationInitiale resultatList={resultatList} />} />

				<ListeDesServicesInteressants />
			</main>
		</>
	);
}


function banniere() {
	return (
		<LightHero>
			<h1>
				<LightHeroPrimaryText>Des milliers de formations pour vous permettre</LightHeroPrimaryText>
				<LightHeroSecondaryText>de réaliser votre projet professionnel</LightHeroSecondaryText>
			</h1>
		</LightHero>
	);
}

interface ListResultatProps {
	resultatList: Array<FormationInitiale>
}

function ListeFormationInitiale({ resultatList }: ListResultatProps) {
	if (!resultatList) {
		return undefined;
	}

	function getLienOffre(identifiant?: string) {
		return identifiant ? `/formations-initiales/${encodeURIComponent(identifiant)}` : undefined;
	}

	function getTags(formation: FormationInitiale) {
		const tags = [];
		if (formation.isCertifiante) tags.push('Certifiante');
		tags.push(formation.niveauDeSortie);
		tags.push(formation.duree);
		return tags;
	}

	return (
		<ListeRésultatsRechercherSolution aria-label="Formations Initiales">
			{resultatList.map((formation: FormationInitiale) => (
				<li key={formation.libelle}>
					<ResultatRechercherSolution
						étiquetteOffreList={getTags(formation)}
						intituléOffre={formation.libelle}
						logo={'/images/logos/fallback.svg'}
						lienOffre={getLienOffre(formation.identifiant)} />
				</li>
			))}
		</ListeRésultatsRechercherSolution>
	);
}
