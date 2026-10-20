import { useCallback, useEffect, useState } from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { Link } from '~/client/components/ui/Link/Link';

import { HeaderNavigation } from './HeaderNavigation';

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const openMenu = () => setIsMenuOpen(true);
	const closeMenu = useCallback(() => setIsMenuOpen(false), []);

	useEffect(() => {
		if (!isMenuOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === KeyBoard.ESCAPE) {
				closeMenu();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	}, [isMenuOpen, closeMenu]);

	return (
		<>
			<header role="banner" className="fr-header" id="header">
				<div className="fr-header__body">
					<div className="fr-container">
						<div className="fr-header__body-row">
							<div className="fr-header__brand fr-enlarge-link">
								<div className="fr-header__brand-top">
									<div className="fr-header__logo">
										<p className="fr-logo">
											Ministère<br />
											du Travail<br />
											et des solidarités
										</p>
									</div>
									<div className="fr-header__navbar">
										<button
											className="fr-btn--menu fr-btn"
											aria-controls="header-menu"
											aria-haspopup="menu"
											aria-expanded={isMenuOpen}
											id="header-menu-button"
											title="Menu"
											onClick={openMenu}
										>
											Menu
										</button>
									</div>
								</div>
								<div className="fr-header__service">
									<Link href="/" title="1jeune1solution (retour à l'accueil)">
										<p className="fr-header__service-title">1jeune1solution</p>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<HeaderNavigation isOpen={isMenuOpen} onClose={closeMenu} isMobile={isMenuOpen} />
			</header>
		</>
	);
}
