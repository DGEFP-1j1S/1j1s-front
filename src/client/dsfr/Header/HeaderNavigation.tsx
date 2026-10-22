import { navigationItemList } from '~/client/components/layouts/Header/Navigation/NavigationStructure';

import { HeaderNavItem } from './HeaderNavItem';
import { HeaderNavItemWithMenu } from './HeaderNavItemWithMenu';

export function HeaderNavigation() {
	const {
		accueil,
		offresNav,
		orientationNav,
		engagementNav,
		logementsNav,
		accompagnementNav,
		aidesEtOutilsNav,
		employeurNav,
	} = navigationItemList();

	return (
		<div
			className="fr-header__menu fr-modal"
			id="header-menu"
			aria-labelledby="header-menu-button"
		>
			<div className="fr-container">
				<button className="fr-btn--close fr-btn" aria-controls="header-menu">
					Fermer
				</button>
				<div className="fr-header__menu-links" />
				<nav className="fr-nav" role="navigation" id="navigation" aria-label="Menu principal">
					<ul className="fr-nav__list">
						<HeaderNavItem
							label={accueil.label}
							link={accueil.link}
						/>
						<HeaderNavItemWithMenu
							item={offresNav}
						/>
						<HeaderNavItemWithMenu
							item={orientationNav}
						/>
						<HeaderNavItemWithMenu
							item={engagementNav}
						/>
						<HeaderNavItemWithMenu
							item={logementsNav}
						/>
						<HeaderNavItemWithMenu
							item={accompagnementNav}
						/>
						<HeaderNavItemWithMenu
							item={aidesEtOutilsNav}
						/>
						<HeaderNavItemWithMenu
							buttonClassName="background--employeur"
							item={employeurNav}
						/>
					</ul>
				</nav>
			</div>
		</div>
	);
}
