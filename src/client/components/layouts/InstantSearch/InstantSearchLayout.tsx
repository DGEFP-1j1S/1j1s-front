import { SendEventForHits } from 'instantsearch.js/es/lib/utils/createSendEventForHits';
import { BaseHit } from 'instantsearch.js/es/types/results';
import React, { useRef } from 'react';
import { Configure, Hits, InstantSearch, useInstantSearch, useStats } from 'react-instantsearch';

import { InstantSearchErrorBoundary } from '~/client/components/layouts/InstantSearch/InstantSearchErrorBoundary';
import { ListeDesResultats } from '~/client/components/layouts/InstantSearch/ListeDesResultats';
import { MeiliSearchPagination } from '~/client/components/ui/Meilisearch/MeilisearchPagination/MeiliSearchPagination';
import { MessageResultatRecherche } from '~/client/components/ui/Meilisearch/MessageResultatRecherche/MessageResultatRecherche';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { RechercheClientService } from '~/client/dependencies.container';
import { useSynchronizedRef } from '~/client/hooks/useSynchronizedRef';
import { Banner } from "~/client/components/ui/Hero/Hero";

export interface HitProps<THit extends BaseHit> {
    hit: THit;
    sendEvent: SendEventForHits;
}

export type HitComponent<THit extends BaseHit> = React.JSXElementConstructor<HitProps<THit>>;

interface AfficherResultatDeRechercheProps<THit extends BaseHit> {
    nombreDeResultatParPage: number
    messageResultatRechercheLabelSingulier: string
    messageResultatRechercheLabelPluriel: string
    nombreDeSkeleton: number
    isAffichageListeDeResultatsDesktopDirectionRow: boolean
    resultatDeRecherche: HitComponent<THit>
}

interface InstantSearchLayoutProps<THit extends BaseHit> extends AfficherResultatDeRechercheProps<THit> {
    meilisearchIndex: string
    titre: string
    formulaireDeRecherche: React.ReactElement
    tagList: React.ReactElement
}

export function InstantSearchLayout<THit extends BaseHit = BaseHit>(props: InstantSearchLayoutProps<THit>) {
	const {
		meilisearchIndex,
		nombreDeResultatParPage,
		titre,
		formulaireDeRecherche,
		tagList,
		messageResultatRechercheLabelSingulier,
		messageResultatRechercheLabelPluriel,
		nombreDeSkeleton,
		resultatDeRecherche ,
		isAffichageListeDeResultatsDesktopDirectionRow,
	} = props;

	const searchClient = useDependency<RechercheClientService>('rechercheClientService');
	const listeDesResultatsRef = useRef<HTMLElement>(null);

	const scrollToTopOfListeDesResultats = () => {
		listeDesResultatsRef.current?.scrollIntoView(true);
	};

	return (
		<main id="contenu">
			<Banner>
				<h1 className="fr-h1 fr-mb-0">
					{titre}
				</h1>
			</Banner>
			<InstantSearch
				searchClient={searchClient}
				indexName={meilisearchIndex}
				routing /* NOTE (SULI 19-02-2024): Cf PR https://github.com/DNUM-SocialGouv/1j1s-front/pull/2711 pour réutiliser createInstantSearchRouterNext*/
				future={{ preserveSharedStateOnUnmount: true }}>
				<InstantSearchErrorBoundary>
					<>
						{/* @ts-expect-error -- le type de la prop hitsPerPage est manquant dans Configure */}
						<Configure hitsPerPage={nombreDeResultatParPage} />
						<section>
							<div className="fr-container">
								{formulaireDeRecherche}
							</div>
						</section>
						<div className='fr-container fr-py-4w'>
							{tagList}
						</div>
						<AfficherResultatDeRecherche
							messageResultatRechercheLabelSingulier={messageResultatRechercheLabelSingulier}
							messageResultatRechercheLabelPluriel={messageResultatRechercheLabelPluriel}
							nombreDeSkeleton={nombreDeSkeleton}
							resultatDeRecherche={resultatDeRecherche as HitComponent<BaseHit>}
							isAffichageListeDeResultatsDesktopDirectionRow={isAffichageListeDeResultatsDesktopDirectionRow}
							nombreDeResultatParPage={nombreDeResultatParPage}
							scrollToTopOfListeDesResultats={scrollToTopOfListeDesResultats}
							ref={listeDesResultatsRef} />
					</>
				</InstantSearchErrorBoundary>
			</InstantSearch>
		</main>
	);
}

type AfficherResultatDeRechercheWithScrollProps<THit extends BaseHit = BaseHit> =
    AfficherResultatDeRechercheProps<THit>
    & { scrollToTopOfListeDesResultats: () => void };

const AfficherResultatDeRecherche = React.forwardRef(function AfficherResultatDeRecherche<THit extends BaseHit>(props: AfficherResultatDeRechercheWithScrollProps<THit>, outerRef: React.Ref<HTMLElement> | null) {
	const {
		messageResultatRechercheLabelSingulier,
		messageResultatRechercheLabelPluriel,
		nombreDeSkeleton,
		resultatDeRecherche,
		isAffichageListeDeResultatsDesktopDirectionRow,
		nombreDeResultatParPage,
		scrollToTopOfListeDesResultats,
	} = props;

	const LOADING_STATUS = 'loading';
	const STALLED_STATUS = 'stalled';

	const { status, results } = useInstantSearch();
	const isSettingUp: boolean = results.__isArtificial ?? false;
	const { nbHits } = useStats();

	const ref = useSynchronizedRef(outerRef);

	const isInstantSearchLoading = (status === LOADING_STATUS || status === STALLED_STATUS) && isSettingUp;

	return (
		<>
			<section>
				<div className='fr-container'>
					<MessageResultatRecherche
						labelSingulier={messageResultatRechercheLabelSingulier}
						labelPluriel={messageResultatRechercheLabelPluriel}
						isLoading={isInstantSearchLoading}
						numberOfResult={nbHits} />

				</div>
			</section>
			<ListeDesResultats
				ref={ref}
				resultats={<Hits hitComponent={resultatDeRecherche} />}
				skeletonRepeat={nombreDeSkeleton}
				pagination={(
					<MeiliSearchPagination numberOfResultPerPage={nombreDeResultatParPage}
																					 className='fr-grid-row fr-mt-3w justify-center'
																					 onPageChange={scrollToTopOfListeDesResultats} />
				)}
				isLoading={isInstantSearchLoading}
				isAffichageListeDeResultatsDesktopDirectionRow={isAffichageListeDeResultatsDesktopDirectionRow} />
		</>
	);
});
