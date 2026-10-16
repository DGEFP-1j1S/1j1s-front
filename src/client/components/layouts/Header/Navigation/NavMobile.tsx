import { useRouter } from 'next/router';
import React from 'react';

import { NavItem } from '~/client/components/layouts/Header/Navigation/NavItem/NavItem';

import { Container } from '../../Container/Container';
import styles from './Nav.module.scss';
import { navigationItemList } from './NavigationStructure';
import { NavItemWithSubItems } from './NavItemWithSubItems';

export function NavMobile({ toggleModal }: { toggleModal: () => void }) {
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
		<Container>
			<nav role="navigation" aria-label="menu principal" data-testid="navigation-mobile">
				<ul className={styles.modalNavigationList}>
					<NavItem className={styles.navItem}  label={accueil.label} link={accueil.link} isActive={router.pathname === accueil.link} onClick={toggleModal} />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={offresNav} onClick={toggleModal} isMobile />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={orientationNav} onClick={toggleModal} isMobile />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={engagementNav} onClick={toggleModal} isMobile />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={logementsNav} onClick={toggleModal} isMobile />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={accompagnementNav} onClick={toggleModal} isMobile />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={aidesEtOutilsNav} onClick={toggleModal} isMobile />
					<NavItemWithSubItems className={styles.navItem} navigationItemWithChildren={employeurNav} onClick={toggleModal} isMobile />
				</ul>
			</nav>
		</Container>
	);
}
