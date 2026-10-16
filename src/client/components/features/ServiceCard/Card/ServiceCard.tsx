import classNames from 'classnames';
import React, { useId } from 'react';

import { HtmlHeadingTag } from '~/client/components/props';
import { Card } from '~/client/components/ui/Card/Card';
import { Link } from '~/client/components/ui/Link/Link';
import { useIsInternalLink } from '~/client/hooks/useIsInternalLink';

import styles from './ServiceCard.module.scss';

interface ServiceCardListProps {
	'aria-label'?: string,
}

export function ServiceCardList({ children, 'aria-label': ariaLabel }: React.PropsWithChildren<ServiceCardListProps>) {
	const DEFAULT_LABEL = 'Liste des partenaires et des services';
	return (
		<div className={styles.services}>
			<ul aria-label={ariaLabel ?? DEFAULT_LABEL}>
				{
					React.Children.map(children, (child, index) => (
						<li key={index}>
							{child}
						</li>
					))
				}
			</ul>
		</div>
	);
}

interface ServiceCardProps {
	children: React.ReactNode
	imageFit?: 'cover' | 'contain'
	logo: string
	logoAlt?: string
	link: string
	linkLabel: string
	title: string
	titleAs: HtmlHeadingTag
}

export function ServiceCard(props: ServiceCardProps & React.HTMLAttributes<HTMLLinkElement>) {
	const {
		className, imageFit = 'contain', logo, logoAlt = '', link, linkLabel, title, titleAs, children,
	} = props;
	const idLink = useId();
	const idIntitulé = useId();

	const isInternalLink = useIsInternalLink(link);
	const linkTitle = !isInternalLink ? `${linkLabel} - nouvelle fenêtre` : undefined;

	return (
		<Card
			layout={'vertical'}
			data-testid={`card-${idIntitulé}`}
			className={classNames(
				styles.card,
				className,
				styles.serviceCard,
				imageFit === 'cover' && styles.cardCover)}>
			<Card.Image className={styles.cardLogo} src={logo} width={140} height={140} alt={logoAlt} />
			<Card.Content className={styles.cardBody}>
				<Card.Title id={idIntitulé} titleAs={titleAs} className={styles.cardTitle}>{title}</Card.Title>
				<p>{children}</p>
				<Link
					href={link}
					title={linkTitle}
					aria-labelledby={`${idIntitulé} ${idLink}`}
					className={styles.cardAction}
					appearance="asQuaternaryButton"
					id={idLink}>
					{linkLabel}
					<Link.Icon />
				</Link>
			</Card.Content>
		</Card>
	);
}
