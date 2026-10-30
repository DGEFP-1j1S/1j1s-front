import classNames from 'classnames';
import React, { useMemo } from 'react';

import styles from '~/client/components/features/Logement/Annonce.module.scss';
import { AnnonceDeLogementIndexee } from '~/server/logements/domain/annonceDeLogementIndexee';
import { Card } from '~/client/components/ui/Card/Card';
import { Carousel } from '~/client/components/ui/Carousel/Carousel';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import { TextIcon } from '~/client/components/ui/TextIcon/TextIcon';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { DateService } from '~/client/services/date/date.service';

const TYPE_DE_LOGEMENT_INTERGENERATIONNEL = 'habitation intergénérationnelle';

export function AnnonceDeLogement(props: { hit: AnnonceDeLogementIndexee }) {
	const annonce = props.hit;
	const typeDeLogement = annonce.type === TYPE_DE_LOGEMENT_INTERGENERATIONNEL ? 'intergénérationnel' : annonce.type;
	const dateService = useDependency<DateService>('dateService');
	const dateDeLAnnonce = dateService.formatToHumanReadableDate(new Date(annonce.dateDeMiseAJour));

	return (
		<Card layout="vertical" className={styles.Card}>
			<Card.Title id={`${annonce.slug}`} titleAs="h3" className={styles.cardTextContent}>{annonce.titre}</Card.Title>
			<CardImage imageSrcList={annonce.imagesUrl} />

			<span className={classNames(styles.CardEnTete, styles.cardTextContent)}>
				<span className={styles.CardEnTeteType}>{typeDeLogement}</span>
				<span className={styles.CardEnTeteDate}>postée le {dateDeLAnnonce}</span>
			</span>

			<Card.Content className={classNames(styles.CardContenu, styles.cardTextContent)}>
				<dl className={styles.CardDescription}>
					<dt>Surface</dt>
					<dd>{annonce.surfaceAAfficher}</dd>
					<dt>Prix</dt>
					<dd>{annonce.prix} {annonce.devise}<sup>CC</sup></dd>
				</dl>
			</Card.Content>

			<span className={classNames(styles.CardFooter, styles.cardTextContent)}>
				<TextIcon
					icon="map-pin"
					iconPosition="left"
					className={styles.localisation}>
					<span>{annonce.localisationAAfficher}</span>
				</TextIcon>
				<Link
					href={`/logements/annonces/${annonce.slug}`}
					key={annonce.slug}
					className={styles.CardFooterCallToAction}
					prefetch={false}
					appearance={'asQuaternaryButton'}
					aria-labelledby={`${annonce.slug}`}>
					Lire l‘annonce
					<Link.Icon />
				</Link>
			</span>
		</Card>
	);
}

type ImageSrcListProps = Array<string>

function CardImage(props: { imageSrcList: ImageSrcListProps }) {
	const { imageSrcList } = props;
	const hasNoImage = imageSrcList.length === 0;
	const hasOnlyOneImage = imageSrcList.length === 1;

	if (hasNoImage) return (
		<div className={styles.CardImageWrapper}>
			<Image src={'/images/image-par-defaut-carte.webp'} alt="" width={360} height={180} />
		</div>
	);

	if (hasOnlyOneImage) return (
		<div className={styles.CardImageWrapper}>
			<Image src={imageSrcList[0]} alt="" width={360} height={180} />
		</div>
	);

	return <CardAnnonceCarousel imageSrcList={imageSrcList} />;
}

const CardAnnonceCarousel = (props: { imageSrcList: ImageSrcListProps }) => {
	const { imageSrcList } = props;
	const formattedList = imageSrcList.map((src) => ({ alt: undefined, src }));
	const MAX_IMAGE_WIDTH = 360;
	const MAX_IMAGE_HEIGHT = 180;
	const firstFourthImages = useMemo(() => formattedList.slice(0, 4), [formattedList]);

	return (
		<Carousel
			imageList={firstFourthImages}
			className={styles.CardImageWrapper}
			imagesSize={{ height: MAX_IMAGE_HEIGHT, width: MAX_IMAGE_WIDTH }}
			aria-label="Photos du logement" />
	);
};
