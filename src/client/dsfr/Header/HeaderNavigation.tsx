import classNames from 'classnames';

import { navigationItemList } from '~/client/components/layouts/Header/Navigation/NavigationStructure';

import { HeaderNavItem } from './HeaderNavItem';
import { HeaderNavItemWithMenu } from './HeaderNavItemWithMenu';

interface HeaderNavigationProps {
	isOpen: boolean;
	onClose: () => void;
	isMobile?: boolean;
}

export function HeaderNavigation({ isOpen, onClose, isMobile = false }: HeaderNavigationProps) {
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
			className={classNames('fr-header__menu', 'fr-modal', { 'fr-modal--opened': isOpen })}
			id="header-menu"
			aria-labelledby="header-menu-button"
		>
			<div className="fr-container">
				<button className="fr-btn--close fr-btn" aria-controls="header-menu" onClick={onClose}>
					Fermer
				</button>
				<div className="fr-header__menu-links" />
				<nav className="fr-nav" role="navigation" aria-label="Menu principal">
					<ul className="fr-nav__list">
						<HeaderNavItem
							label={accueil.label}
							link={accueil.link}
							onClick={onClose}
						/>
						<HeaderNavItemWithMenu
							item={offresNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
						<HeaderNavItemWithMenu
							item={orientationNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
						<HeaderNavItemWithMenu
							item={engagementNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
						<HeaderNavItemWithMenu
							item={logementsNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
						<HeaderNavItemWithMenu
							item={accompagnementNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
						<HeaderNavItemWithMenu
							item={aidesEtOutilsNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
						<HeaderNavItemWithMenu
							buttonClassName="background--employeur"
							item={employeurNav}
							onClick={onClose}
							isMobile={isMobile}
						/>
					</ul>
				</nav>
			</div>
		</div>
	);
}
