import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import {
	EtiquettesFiltreOffreEmploi,
} from '~/client/components/features/OffreEmploi/Rechercher/EtiquettesFiltreOffreEmploi';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { LaBonneBoitePartner } from '~/client/components/features/ServiceCard/LaBonneBoitePartner';
import { OnisepMetierPartner } from '~/client/components/features/ServiceCard/OnisepMetierPartner';
import { ServiceCiviquePartner } from '~/client/components/features/ServiceCard/ServiceCiviquePartner';
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
import { useOffreQuery } from '~/client/hooks/useOffreQuery';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { Erreur } from '~/server/errors/erreur.types';
import {
	MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL,
	NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE,
	Offre,
	RésultatsRechercheOffre,
} from '~/server/offres/domain/offre';

// NOTE (BRUJ 06/05/2024): Pour éviter les hydratation mismatch lié au usebreakpoint on désactive le srr sur des composants spécifiques cf https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const FormulaireRechercheOffreEmploi = dynamic(() => import('../FormulaireRecherche/FormulaireRechercheOffreEmploi').then((mod) => mod.FormulaireRechercheOffreEmploi), { ssr: false });

const PREFIX_TITRE_PAGE = 'Rechercher un emploi';
const LOGO_FRANCE_TRAVAIL = '/images/logos/france-travail.svg';

interface RechercherOffreEmploiProps {
	erreurRecherche?: Erreur
	resultats?: RésultatsRechercheOffre
}

export function RechercherOffreEmploi(props: RechercherOffreEmploiProps) {
	const offreQuery = useOffreQuery();

	const title = formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${props.resultats?.nombreRésultats === 0 ? ' - Aucun résultat' : ''}`);
	const offreEmploiList = props.resultats?.résultats || [];
	const nombreRésultats = props.resultats?.nombreRésultats || 0;
	const erreurRecherche = props.erreurRecherche;

	const messageRésultatRecherche: string = useMemo(() => {
		const messageRésultatRechercheSplit: string[] = [`${nombreRésultats}`];
		if (nombreRésultats > 1) {
			messageRésultatRechercheSplit.push('offres d‘emplois');
		} else {
			messageRésultatRechercheSplit.push('offre d‘emploi');
		}
		if (offreQuery.motCle) {
			messageRésultatRechercheSplit.push(`pour ${offreQuery.motCle}`);
		}
		return messageRésultatRechercheSplit.join(' ');
	}, [nombreRésultats, offreQuery.motCle]);

	return (
		<>
			<Head
				title={title}
				description="Plus de 400 000 offres d‘emplois et d‘alternances sélectionnées pour vous"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BannièreOffreEmploi />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={<EtiquettesFiltreOffreEmploi />}
					formulaireRecherche={<FormulaireRechercheOffreEmploi enEtatErreur={erreurRecherche != null} />}
					isChargement={false}
					isEtatInitial={empty(offreQuery)}
					messageResultatRecherche={messageRésultatRecherche}
					nombreTotalSolutions={nombreRésultats}
					paginationOffset={NOMBRE_RÉSULTATS_OFFRE_PAR_PAGE}
					maxPage={MAX_PAGE_ALLOWED_BY_FRANCE_TRAVAIL - 1}
					listeSolutionElement={<ListeOffreEmploi résultatList={offreEmploiList} />} />
				<EnTete heading="Découvrez des services faits pour vous" />
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

function ListeOffreEmploi({ résultatList }: ListeRésultatProps) {
	if (!résultatList.length) {
		return undefined;
	}

	return (
		<ListeRésultatsRechercherSolution aria-label="Offres d‘emplois">
			{résultatList.map((offreEmploi: Offre) => (
				<li key={offreEmploi.id}>
					<ResultatRechercherSolution
						étiquetteOffreList={offreEmploi.étiquetteList}
						intituléOffre={offreEmploi.intitulé}
						lienOffre={`/emplois/${offreEmploi.id}`}
						logo={offreEmploi.entreprise.logo || LOGO_FRANCE_TRAVAIL}
						logoAlt={offreEmploi.entreprise.logo ? '' : 'France travail'}
						sousTitreOffre={offreEmploi.entreprise.nom} />
				</li>
			))}
		</ListeRésultatsRechercherSolution>
	);
}

function BannièreOffreEmploi() {
	return (
		<LightHero>
			<h1>
				<LightHeroPrimaryText>Des milliers d‘offres d‘emplois</LightHeroPrimaryText>
				<LightHeroSecondaryText>sélectionnées pour vous par France Travail</LightHeroSecondaryText>
			</h1>
		</LightHero>
	);
}
