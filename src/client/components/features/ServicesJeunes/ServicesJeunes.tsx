import React, { useMemo } from 'react';

import styles from '~/client/components/features/ServicesJeunes/ServicesJeunes.module.scss';
import { Container } from '~/client/components/layouts/Container/Container';
import { FlippingCard } from '~/client/components/ui/Card/Flipping/FlippingCard';
import SeeMoreItemList from '~/client/components/ui/SeeMore/SeeMoreItemList';
import useSanitize from '~/client/hooks/useSanitize';
import { ServiceJeune } from '~/server/services-jeunes/domain/servicesJeunes';

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
			<Container className={styles.container}>
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
			</Container>
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
		<FlippingCard
			className={styles.card}
			category={categorie}
			imageUrl={banniere?.src}
			link={link}
			title={titre}
			flippingCardContent={concerne} />
	);
}
