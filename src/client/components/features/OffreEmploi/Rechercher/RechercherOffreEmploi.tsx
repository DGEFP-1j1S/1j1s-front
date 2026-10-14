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
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { Carte } from '~/client/dsfr';
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
import {BannerWithIllustration} from '~/client/components/ui/Hero/Hero';

// NOTE (BRUJ 06/05/2024): Pour éviter les hydratation mismatch lié au usebreakpoint on désactive le srr sur des composants spécifiques cf https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const FormulaireRechercheOffreEmploi = dynamic(() => import('../FormulaireRecherche/FormulaireRechercheOffreEmploi').then((mod) => mod.FormulaireRechercheOffreEmploi), { ssr: false });

const PREFIX_TITRE_PAGE = 'Rechercher un emploi';

interface RechercherOffreEmploiProps {
	erreurRecherche?: Erreur
	resultats?: ResultatsRechercheOffre
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
	if (!résultatList.length) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Offres d’emplois">
			{résultatList.map((offreEmploi: Offre) => (
				<li key={offreEmploi.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={offreEmploi.intitulé}
						lien={`/emplois/${offreEmploi.id}`}
						tags={offreEmploi.étiquetteList.map((tag) => <>{tag}</>)}>
						{offreEmploi.entreprise.nom}
					</Carte>
				</li>
			))}
		</ul>
	);
}

function BannièreOffreEmploi() {
	return (
		<BannerWithIllustration image="/images/offres-emploi-banner.png">
			<h1 className="fr-h1 fr-mb-0">
				Des milliers d‘offres d‘emplois sélectionnées pour vous par France Travail
			</h1>
		</BannerWithIllustration>
	);
}
