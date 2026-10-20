import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FocusEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import {
	isNavigationItem,
	NavigationItem,
	NavigationItemWithChildren,
} from '~/client/components/layouts/Header/Navigation/NavigationStructure';
import { Link } from '~/client/components/ui/Link/Link';

interface HeaderNavItemWithMenuProps {
	item: NavigationItemWithChildren;
	onClick?: () => void;
	isMobile?: boolean;
	buttonClassName?: string;
}

export function HeaderNavItemWithMenu({ item, onClick, isMobile = false, buttonClassName = "" }: HeaderNavItemWithMenuProps) {
	const router = useRouter();
	const containerRef = useRef<HTMLLIElement>(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const menuId = `menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`;

	const isChildActive = useCallback(
		function checkChildActive(navItem: NavigationItemWithChildren): boolean {
			return navItem.children.some((child) => {
				return isNavigationItem(child)
					? child.link === router.pathname
					: checkChildActive(child);
			});
		},
		[router.pathname]
	);

	const hasActiveChild = useMemo(() => isChildActive(item), [isChildActive, item]);

	useEffect(() => {
		setIsExpanded(hasActiveChild && isMobile);
	}, [hasActiveChild, isMobile]);

	const handleBlur = useCallback((event: FocusEvent<HTMLLIElement>) => {
		const stillInside = event.currentTarget.contains(event.relatedTarget);
		if (!stillInside) {
			setIsExpanded(false);
		}
	}, []);

	const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
		if (event.key === KeyBoard.ESCAPE) {
			setIsExpanded(false);
		}
	}, []);

	function handleItemClick() {
		setIsExpanded(false);
		onClick?.();
	}

	return (
		<li className="fr-nav__item" ref={containerRef} onBlur={handleBlur} onKeyUp={handleKeyUp}>
			<button
				className={`fr-nav__btn ${buttonClassName}`}
				aria-expanded={isExpanded}
				aria-controls={menuId}
				aria-current={hasActiveChild ? true : undefined}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{item.label}
			</button>
			<div className={classNames('fr-collapse', 'fr-menu', { 'fr-collapse--expanded': isExpanded })} id={menuId}>
				<ul className="fr-menu__list">
					{item.children.map((child) =>
						isNavigationItem(child) ? (
							<MenuLink
								key={child.link}
								item={child}
								onClick={handleItemClick}
							/>
						) : (
							<HeaderNavItemWithMenu
								key={child.label}
								item={child}
								onClick={onClick}
								isMobile={isMobile}
							/>
						)
					)}
				</ul>
			</div>
		</li>
	);
}

function MenuLink({ item, onClick }: { item: NavigationItem; onClick?: () => void }) {
	const router = useRouter();
	const isActive = router.pathname === item.link;

	return (
		<li>
			<Link
				href={item.link}
				prefetch={false}
				className="fr-nav__link"
				aria-current={isActive ? 'page' : undefined}
				onClick={onClick}
			>
				{item.label}
			</Link>
		</li>
	);
}
