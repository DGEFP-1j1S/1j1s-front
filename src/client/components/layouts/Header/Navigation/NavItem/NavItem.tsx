import { useRouter } from 'next/router';
import React, { MouseEvent, MouseEventHandler, ReactNode } from 'react';

import { Link } from '~/client/components/ui/Link/Link';
import { useIsInternalLink } from '~/client/hooks/useIsInternalLink';

import styles from '../Nav.module.scss';

interface NavItemProps {
	label: string | ReactNode
	link: string
	isActive: boolean
	onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function NavItem({
	className,
	label,
	link,
	isActive,
	onClick,
}: NavItemProps & React.HTMLAttributes<HTMLLIElement>) {
	const isInternalLink = useIsInternalLink(link);
	const router = useRouter();
	const isCurrentUrl = link === router.asPath;

	function onNavItemClick(event: MouseEvent<HTMLAnchorElement>): void {
		if (isCurrentUrl) {
			event.preventDefault();
		}
		// NOTE: onClick ferme le menu mobile : il doit être appelé même sur l‘url courante, sinon la modale reste ouverte.
		onClick?.(event);
	}

	return (
		<li className={className}>
			<Link href={link} prefetch={false} className={styles.navItemLabel} aria-current={isActive} onClick={onNavItemClick}>
				{label}
				{!isInternalLink && <Link.Icon className={styles.externalRedirectionIcon} />}
			</Link>
		</li>
	);
}
