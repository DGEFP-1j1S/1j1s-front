import { GetStaticPropsResult } from 'next';
import React, { useMemo } from 'react';

import { ServicesJeunes } from '~/client/components/features/ServicesJeunes/ServicesJeunes';
import { Head } from '~/client/components/head/Head';
import SeeMoreItemList from '~/client/components/ui/SeeMore/SeeMoreItemList';
import { Carte } from "~/client/dsfr";
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/espace-jeune/index.analytics';
import { Actualite } from '~/server/actualites/domain/actualite';
import { isFailure } from '~/server/errors/either';
import { ServiceJeune } from '~/server/services-jeunes/domain/servicesJeunes';
import { dependencies } from '~/server/start';

import { Banner } from "~/client/components/ui/Hero/Hero";

interface EspaceJeunePageProps {
	cartesActualites: Actualite[]
	serviceJeuneList: Array<ServiceJeune>
}

const MAX_VISIBLE_ACTUALITES_LENGTH = 3;

export default function EspaceJeunePage({ cartesActualites, serviceJeuneList }: EspaceJeunePageProps) {
	useAnalytics(analytics);

	const articleCardList: React.ReactNode[] = useMemo(() => {
		return cartesActualites.map((carte, index) => (
			<Carte
				key={index}
				titre={carte.titre}
				lien={carte.link}
				imageSrc={carte.bannière?.src}
				imageAlt={carte.bannière?.alt}
			>
				{carte.extraitContenu}
			</Carte>
		));
	}, [cartesActualites]);

	return (
		<>
			<Head
				title="Actualités et services jeunes | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<section className='fr-container' aria-label="les actualités">
					<Banner>
						<h1>Actualités et services jeune</h1>
						<h2>Retrouvez une sélection des dernières actualités relatives aux jeunes</h2>
					</Banner>
					<div className='fr-container'>
						<SeeMoreItemList seeLessAriaLabel={'Voir moins de résultats sur les actualités'}
														 seeMoreAriaLabel={'Voir plus de résultats sur les actualités'}
														 numberOfVisibleItems={MAX_VISIBLE_ACTUALITES_LENGTH}
														 itemList={articleCardList} />
					</div>
				</section>
				<section className='fr-container' aria-label="les services jeunes">
					<Banner>
						<h2>
							Services jeunes, retrouvez les services conçus pour vous : entrée dans la vie professionnelle, orientation, formation, accompagnement
						</h2>
					</Banner>
					<ServicesJeunes cardList={serviceJeuneList} />
				</section>
			</main>
		</>
	);
}

export async function getStaticProps(): Promise<GetStaticPropsResult<EspaceJeunePageProps>> {
	const isEspaceJeuneVisible = process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE === '1';
	if (!isEspaceJeuneVisible) {
		return { notFound: true, revalidate: 1 };
	}
	
	const serviceJeuneList = await dependencies.servicesJeunesDependencies.consulterLesServicesJeunesUseCase.handle();
	const cartesActualitesResponse = await dependencies.actualitesDependencies.consulterActualitesUseCase.handle();

	if (isFailure(serviceJeuneList) || isFailure(cartesActualitesResponse)) {
		return {
			props: {
				cartesActualites: [],
				serviceJeuneList: [],
			},
			revalidate: 1,
		};
	}

	return {
		props: {
			cartesActualites: JSON.parse(JSON.stringify(cartesActualitesResponse.result)),
			serviceJeuneList: JSON.parse(JSON.stringify(serviceJeuneList.result)),
		},
		revalidate: dependencies.cmsDependencies.duréeDeValiditéEnSecondes(),
	};
}
