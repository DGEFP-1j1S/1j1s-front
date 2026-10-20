import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import {
	FormulaireRechercheFormationInitiale,
} from '~/client/components/features/FormationInitiale/Rechercher/FormulaireRecherche/FormulaireRechercheFormationInitiale';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Carte } from '~/client/dsfr';
import { Banner } from '~/client/components/ui/Hero/Hero';
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
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { CarifOrefPartner } from '~/client/components/features/ServiceCard/CarifOrefPartner';
import { FormationsEnApprentissageCard } from '~/client/components/features/ServiceCard/FormationsEnApprentissageCard';
import { MonCompteFormationPartner } from '~/client/components/features/ServiceCard/MonCompteFormationPartner';
import { ParcourSupPartner } from '~/client/components/features/ServiceCard/ParcourSupPartner';
import { PixPartner } from '~/client/components/features/ServiceCard/PixPartner';

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
					banniere={<BanniereFormationInitiale />}
					erreurRecherche={erreurRecherche}
					formulaireRecherche={<FormulaireRechercheFormationInitiale />}
					isChargement={isLoading}
					isEtatInitial={empty(formationInitialeQuery)}
					messageResultatRecherche={messageResultatRecherche}
					nombreTotalSolutions={nombreDeResultat}
					paginationOffset={NOMBRE_RÉSULTATS_FORMATIONS_INITIALES_PAR_PAGE}
					listeSolutionElement={<ListeFormationInitiale resultatList={resultatList} />}
				/>
				<ServiceCardList>
					<CarifOrefPartner />
					<FormationsEnApprentissageCard />
					<ParcourSupPartner />
					<MonCompteFormationPartner />
					<PixPartner />
				</ServiceCardList>
			</main>
		</>
	);
}


function BanniereFormationInitiale() {
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				Des milliers de formations pour vous permettre de réaliser votre projet professionnel
			</h1>
		</Banner>
	);
}

interface ListResultatProps {
	resultatList: Array<FormationInitiale>
}

function ListeFormationInitiale({ resultatList }: ListResultatProps) {
	if (!resultatList.length) return null;

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
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Formations Initiales">
			{resultatList
				.filter((formation) => formation.identifiant)
				.map((formation: FormationInitiale) => (
					<li key={formation.libelle} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
						<Carte
							titre={formation.libelle}
							lien={getLienOffre(formation.identifiant)}
							tags={getTags(formation)} />
					</li>
				))}
		</ul>
	);
}
