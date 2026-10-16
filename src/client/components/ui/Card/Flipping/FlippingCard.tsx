import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HtmlHeadingTag } from '~/client/components/props';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import styles from '~/client/components/ui/Card/Flipping/FlippingCard.module.scss';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import MarkdownToHtml from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml';
import { useIsInternalLink } from '~/client/hooks/useIsInternalLink';
import { ServiceJeuneCategorie, ServiceJeuneCodeCategorie } from '~/server/services-jeunes/domain/servicesJeunes';

interface FlippingCardProps {
	imageUrl?: string
	link?: string
	title: string
	category?: ServiceJeuneCategorie
	titleAs?: HtmlHeadingTag
	flippingCardContent: string
	className?: string
}

export function FlippingCard(props: FlippingCardProps) {
	const { category, imageUrl, link, title, titleAs, flippingCardContent, className, ...rest } = props;
	const cardFlipRef = useRef<HTMLDivElement>(null);
	const isInternalLink = useIsInternalLink(link ?? '');
	const [isCardFlipped, setIsCardFlipped] = useState(false);
	const [isAnimationOn, setIsAnimationOn] = useState(false);
	const hasFlipCardContent = !!flippingCardContent.length;
	const flipButton = useRef<HTMLButtonElement>(null);

	const categoryClass = useMemo(() => {
		switch (category?.code) {
			case ServiceJeuneCodeCategorie.ACCOMPAGNEMENT:
				return styles.categoryAccompagnement;
			case ServiceJeuneCodeCategorie.ORIENTATION_FORMATION:
				return styles.categoryOrienterFormer;
			case ServiceJeuneCodeCategorie.ENTREE_VIE_PROFESSIONELLE:
				return styles.categoryVieProfessionnelle;
			case ServiceJeuneCodeCategorie.AIDES_FINANCIERES:
				return styles.categoryAidesFinancieres;
			case ServiceJeuneCodeCategorie.ENGAGEMENT:
				return styles.categoryEngagement;
			case ServiceJeuneCodeCategorie.LOGEMENT:
				return styles.categoryLogement;
		}
	}, [category]);

	useEffect(function setFocusOnFlip() {
		if (isCardFlipped) {
			const currentItem = cardFlipRef.current;
			const firstElement = currentItem?.getElementsByTagName('button')[0];
			firstElement?.focus();
		}
	}, [isCardFlipped]);

	const flipCard = useCallback((reverse = false) => {
		setIsAnimationOn(!isAnimationOn);
		if (reverse) {
			setTimeout(() => {
				setIsCardFlipped(!isCardFlipped);
				if (flipButton.current) {
					flipButton.current.focus();
				}
			}, 500);
		} else {
			setIsCardFlipped(!isCardFlipped);
		}
	}, [isAnimationOn, flipButton, isCardFlipped]);

	return (
		<div className={classNames(styles.cardWrapper, { [styles.flipped]: isAnimationOn }, className)} {...rest}>
			<div className={classNames(styles.card, styles.recto)}>
				<Image src={imageUrl ?? '/images/image-par-defaut-carte.webp'} alt="" width={360} height={180} />
				{category && <div className={classNames(styles.category, categoryClass)}>{category.libelle}</div>}

				<div className={styles.body}>
					<CardTitle className={styles.bodyTitle} titleAs={titleAs}>{title}</CardTitle>
					<div
						className={styles.actionWrapper}>
						{hasFlipCardContent && (
							<ButtonComponent
								label="Pour qui ?"
								appearance={'quaternary'}
								ref={flipButton}
								onClick={() => flipCard()} />
						)}
						{link && (
							<Link href={link} prefetch={false} appearance="asPrimaryButton">
								{isInternalLink ? 'Lire l‘article' : 'En savoir plus'}
								<Link.Icon />
							</Link>
						)}
					</div>
				</div>
			</div>
			<div ref={cardFlipRef} className={classNames(styles.card, styles.verso)}>
				<button
					onClick={() => flipCard(true)}
					aria-label="masquer la section pour qui">
					<Icon name="angle-left" aria-hidden="true" />
				</button>
				<div className={styles.title}>Pour qui ?</div>
				<MarkdownToHtml markdown={flippingCardContent} className={styles.content} />
			</div>
		</div>
	);
}

function CardTitle(props: { titleAs?: HtmlHeadingTag } & React.HTMLAttributes<HTMLTitleElement>) {
	const { children, className, titleAs } = props;
	return React.createElement(titleAs || 'h3', { className: className }, children);
}
