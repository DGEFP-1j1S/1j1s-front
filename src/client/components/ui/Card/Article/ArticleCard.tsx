import classNames from 'classnames';
import React from 'react';

import { HtmlHeadingTag } from '~/client/components/props';
import styles from '~/client/components/ui/Card/Article/ArticleCard.module.scss';
import { Card } from '~/client/components/ui/Card/Card';
import { IconName } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';

interface ArticleCardProps {
	iconName?: IconName
	imageSrc: string
	link: string
	titleLabel: string
	titleHeadingTag: HtmlHeadingTag
	imageFit?: 'cover' | 'contain'
	linkLabel?: string
}

export function ArticleCard({
	className,
	children,
	iconName,
	imageSrc,
	link,
	titleLabel,
	titleHeadingTag,
	imageFit = 'cover',
	linkLabel = 'Lire l‘article',
}: ArticleCardProps & React.HTMLAttributes<HTMLLinkElement>) {
	const imageClassName = classNames(styles.illustration, imageFit === 'contain' && styles.contain);

	return (
		<Card className={classNames(className, styles.card)} layout={'vertical'}>
			<Card.Image className={imageClassName} src={imageSrc} width={320} height={180} aria-hidden />
			<Card.Content className={styles.content}>
				<Card.Title className={styles.title} titleAs={titleHeadingTag}>{titleLabel}</Card.Title>
				{children}
				<Link appearance={'asQuaternaryButton'} href={link}>
					{linkLabel}
					<Link.Icon name={iconName ?? 'arrow-right'} />
				</Link>
			</Card.Content>
		</Card>
	);
}
