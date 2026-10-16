import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { FocusEvent,useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { Icon } from '~/client/components/ui/Icon/Icon';

import styles from './Nav.module.scss';
import { isNavigationItem, NavigationItemWithChildren } from './NavigationStructure';
import { NavItem } from './NavItem/NavItem';

interface NavItemWithSubItemsProps {
	onClick?: () => void;
	navigationItemWithChildren: NavigationItemWithChildren;
	isMobile?: boolean
}

export function NavItemWithSubItems({
	className,
	onClick,
	navigationItemWithChildren,
	isMobile = false,
}: NavItemWithSubItemsProps & React.HTMLAttributes<HTMLLIElement>) {
	const optionRef = useRef<HTMLLIElement>(null);
	const router = useRouter();
	const [isExpanded, setIsExpanded] = useState(false);

	const isNavItemHasOneOfTheseChildrenActive = useCallback(function isItemHasOneOfTheseChildrenActive(item: NavigationItemWithChildren): boolean {
		return item.children.some((subItem) => {
			return isNavigationItem(subItem) ? subItem.link === router.pathname : isItemHasOneOfTheseChildrenActive(subItem);
		});
	}, [router.pathname]);

	const isNavItemActive = useMemo(() => isNavItemHasOneOfTheseChildrenActive(navigationItemWithChildren), [isNavItemHasOneOfTheseChildrenActive, navigationItemWithChildren]);

	useEffect(() => { // initialisation de l'état côté client, une fois le router dispo
		setIsExpanded(isNavItemActive && isMobile);
	}, [isNavItemActive, isMobile]);

	const onBlur = useCallback(function onBlur(event: FocusEvent<HTMLLIElement>) {
		const newFocusStillInSubItems = event.currentTarget.contains(event.relatedTarget);
		
		if (!newFocusStillInSubItems) {
			setIsExpanded(false);
			return;
		}
		
	}, []);

	const closeMenuOnEscape = useCallback((event: React.KeyboardEvent) => {
		if (event.key === KeyBoard.ESCAPE) {
			setIsExpanded(false);
		}
	}, []);

	function onNavItemSelected() {
		setIsExpanded(false);
		if (onClick) {
			onClick();
		}
	}

	const subNav = navigationItemWithChildren.children.map((subItem) => {
		if (isNavigationItem(subItem)) {
			return (
				<NavItem className={styles.subNavItem}
					key={subItem.label?.toString()}
					label={subItem.label}
					link={subItem.link}
					isActive={router.pathname === subItem.link}
					onClick={onNavItemSelected} />
			);
		}
		return (
			<NavItemWithSubItems
				key={subItem.label?.toString()}
				className={styles.navItem}
				navigationItemWithChildren={subItem}
				onClick={onClick}
				isMobile />
		);
	});

	return (
		<li ref={optionRef} className={className} onBlur={onBlur} onKeyUp={closeMenuOnEscape}>
			<button
				className={classNames(styles.subNavItemButton)}
				onClick={() => setIsExpanded(!isExpanded)}
				aria-expanded={isExpanded}>
				<span className={styles.subNavItemButtonLabel} aria-current={isNavItemActive}>
					{navigationItemWithChildren.label}
				</span>
				<Icon className={isExpanded ? styles.subNavItemButtonIconExpanded : styles.subNavItemButtonIcon} name="angle-down" />
			</button>
			{isExpanded && <ul className={styles.subNavItemList}>{subNav}</ul>}
		</li>
	);
}
