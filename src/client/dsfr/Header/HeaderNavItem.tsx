import { useRouter } from 'next/router';
import { MouseEvent, ReactNode } from 'react';

import { Link } from '~/client/components/ui/Link/Link';
import { useIsInternalLink } from '~/client/hooks/useIsInternalLink';

interface HeaderNavItemProps {
	label: string | ReactNode;
	link: string;
	onClick?: () => void;
}

export function HeaderNavItem({ label, link, onClick }: HeaderNavItemProps) {
	const router = useRouter();
	const isActive = router.pathname === link;
	const isCurrentUrl = link === router.asPath;
	const isInternalLink = useIsInternalLink(link);

	function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
		if (isCurrentUrl) {
			event.preventDefault();
		}
		onClick?.();
	}

	return (
		<li className="fr-nav__item">
			<Link
				href={link}
				prefetch={false}
				className="fr-nav__link"
				aria-current={isActive ? 'page' : undefined}
				onClick={handleClick}
			>
				{label}
				{!isInternalLink && <Link.Icon />}
			</Link>
		</li>
	);
}
