import { useRouter } from 'next/router';
import React from 'react';

import { Container } from '../../Container/Container';
import styles from './Nav.module.scss';
import { NavDesktopEmployeur } from './NavDesktopEmployeur';
import { navigationItemList } from './NavigationStructure';
import { NavItem } from './NavItem/NavItem';
import { NavItemWithSubItems } from './NavItemWithSubItems';

export const ID_NAV_DESKTOP = 'header-navigation-desktop';
export function NavDesktop() {
	const {
		accueil,
		accompagnementNav,
		aidesEtOutilsNav,
		employeurNav,
		engagementNav,
		offresNav,
		orientationNav,
		logementsNav,
	} = navigationItemList();
	const router = useRouter();

	return (
		<div className={styles.navigationDesktop}>
			<Container>
				<nav id={ID_NAV_DESKTOP}
					className={styles.navigationDesktopNavigation}
					role="navigation"
					data-testid="navigation-desktop"
					aria-label="Menu principal">
					<ul className={styles.navigationDesktopList}>
						<NavItem className={styles.navItem} label={accueil.label} link={accueil.link} isActive={router.pathname === accueil.link} />
						<NavItemWithSubItems className={styles.navItem}  navigationItemWithChildren={offresNav} />
						<NavItemWithSubItems className={styles.navItem}  navigationItemWithChildren={orientationNav} />
						<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={engagementNav} />
						<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={logementsNav} />
						<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={accompagnementNav} />
						<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={aidesEtOutilsNav} />
						<NavDesktopEmployeur item={employeurNav} />
					</ul>
				</nav>
			</Container>
		</div>
	);
}
