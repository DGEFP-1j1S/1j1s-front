import classNames from 'classnames';
import React from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { BilanEnergetiqueLogement } from '~/client/components/features/Logement/Consulter/BilanEnergetiqueLogement';
import { DescriptionDuLogement } from '~/client/components/features/Logement/Consulter/DescriptionDuLogement';
import { InformationsGénérales } from '~/client/components/features/Logement/Consulter/InformationsGénérales';
import { Services } from '~/client/components/features/Logement/Consulter/Services';
import { Container } from '~/client/components/layouts/Container/Container';
import { Image as ImageProps } from '~/client/components/props';
import { Carousel } from '~/client/components/ui/Carousel/Carousel';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import { AnnonceDeLogement, AnnonceDeLogementSource } from '~/server/logements/domain/annonceDeLogement';

import styles from './ConsulterAnnonce.module.scss';
import { DateMiseÀJour } from './DateMiseÀJour';

interface ConsulterAnnonceDeLogementProps {
	annonceDeLogement: AnnonceDeLogement
}

function AnnonceEntête({ children }: { children: React.ReactNode }) {
	return (
		<Container className={styles.entête}>
			<header className={styles.displayContents}>
				{children}
			</header>
		</Container>
	);
}

function TypeBien({ children }: { children: React.ReactNode }) {
	return <span className={styles.type}>{children}</span>;
}

export function ConsulterAnnonce({ annonceDeLogement }: ConsulterAnnonceDeLogementProps) {
	const {
		dateDeMiseAJour,
		type,
		typeBien,
		titre,
		description,
		imageList,
		source,
		urlDeCandidature,
		bilanEnergetique,
	} = annonceDeLogement;
	return (
		<main id="contenu" className={styles.gridLayout}>
			<BackButton className={styles.boutonRetour} />
			<AnnonceSource source={source} className={styles.mobileOnly} data-testid="source-annonce-mobile" />
			<AnnonceCarousel imageUrlList={imageList} />
			<AnnonceEntête>
				<h1>{titre}</h1>
				<DateMiseÀJour date={dateDeMiseAJour} />
				<TypeBien>{type} - {typeBien}</TypeBien>
			</AnnonceEntête>
			<Container className={styles.annonceBody}>
				<div>
					<InformationsGénérales annonce={annonceDeLogement} />
					<DescriptionDuLogement>{description}</DescriptionDuLogement>
					<Services inclus={annonceDeLogement.servicesInclus} optionnels={annonceDeLogement.servicesOptionnels} />
					<BilanEnergetiqueLogement
						consommationEnergetique={bilanEnergetique.consommationEnergetique}
						emissionDeGaz={bilanEnergetique.emissionDeGaz} />
				</div>
				<CandidaterDesktop source={source} urlDeCandidature={urlDeCandidature} data-testid="source-annonce-desktop" />
			</Container>
			<div className={styles.lienDeCandidatureMobile}>
				<Link appearance="asPrimaryButton" href={urlDeCandidature}>
					Voir l‘annonce
					<Link.Icon />
				</Link>
			</div>
		</main>
	);
}

const AnnonceCarousel = ({ imageUrlList }: { imageUrlList: Array<ImageProps> | [] }) => {
	const MAX_IMAGE_WIDTH = 720;
	const MAX_IMAGE_HEIGHT = 400;

	return (
		<div className={styles.carouselWrapper}>
			<Carousel
				imageList={imageUrlList}
				className={styles.carousel}
				hideIndicators
				imagesSize={{ height: MAX_IMAGE_HEIGHT, width: MAX_IMAGE_WIDTH }}
				aria-label="Photos du logement" />
		</div>
	);
};

type AnnonceSourceProps = {
	source: AnnonceDeLogementSource
	className?: string
}

function AnnonceSource({ source, className, ...rest }: AnnonceSourceProps) {
	switch (source) {
		case 'immojeune':
			return (
				<span className={classNames(styles.source, className)} {...rest}>
						Ce bien est diffusé par <Image src="/images/logement/immojeune.webp" alt="immojeune" width="95" height="44" />
				</span>
			);
		case 'studapart':
			return (
				<span className={classNames(styles.source, className)} {...rest}>
						Ce bien est diffusé par <Image src="/images/logement/studapart.webp"
						alt="studapart"
						width="95"
																					 height="44" />
				</span>
			);
		default:
			return null;
	}
}

type CandidaterDesktopProps = { source: AnnonceDeLogementSource, urlDeCandidature: string }
function CandidaterDesktop({ source, urlDeCandidature, ...rest }: CandidaterDesktopProps) {
	return (
		<div className={classNames(styles.cardCandidater)} {...rest}>
			<AnnonceSource source={source} />
			<Link
				appearance="asPrimaryButton"
				href={urlDeCandidature}>
				Voir l‘annonce
				<Link.Icon />
			</Link>
		</div>
	);
}
