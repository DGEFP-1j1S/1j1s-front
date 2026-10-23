import React, { useMemo } from 'react';

import SeeMoreItemList from '~/client/components/ui/SeeMore/SeeMoreItemList';
import useSanitize from '~/client/hooks/useSanitize';
import { ServiceJeune } from '~/server/services-jeunes/domain/servicesJeunes';
import { Carte } from "~/client/dsfr";

interface ServicesJeunesProps {
	cardList: Array<ServiceJeune>
}

const NUMBER_OF_VISIBLE_ITEMS = 6;

export function ServicesJeunes(props: ServicesJeunesProps) {
	const { cardList } = props;

	const cardListToDisplay = useMemo(() =>
		cardList.map((carte, index) =>
			<ServiceJeuneCard serviceJeune={carte} key={index} />,
		), [cardList]);

	return (
		<>
			<section className="fr-container fr-pb-5w">
				{ props.cardList.length > 0 ? (
					<SeeMoreItemList
						seeLessLabel="Voir moins de services"
						seeMoreLabel="Voir plus de services"
						seeLessAriaLabel={'Voir moins de services conçus pour les jeunes'}
						seeMoreAriaLabel={'Voir plus de services conçus pour les jeunes'}
						numberOfVisibleItems={NUMBER_OF_VISIBLE_ITEMS}
						itemList={cardListToDisplay} />
				)
					: <p>Aucun service disponible. Veuillez modifier votre sélection.</p>}
			</section>
		</>
	);
}

interface ServiceJeuneCardProps {
	serviceJeune: ServiceJeune;
}

function ServiceJeuneCard({ serviceJeune }: ServiceJeuneCardProps) {
	const {
		categorie,
		banniere,
		link,
		concerne,
		titre: dirtyTitre,
	} = serviceJeune;
	const titre = useSanitize(dirtyTitre);

	return (
		<Carte
			titre={titre}
			imageSrc={banniere?.src ?? '/images/image-par-defaut-carte.webp'}
			imageAlt={banniere?.alt ?? ''}
			lien={link}
			tags={[categorie.libelle]}
		>
			{concerne}
		</Carte>
	);
}
