import { Link } from '~/client/components/ui/Link/Link';

import { HeaderNavigation } from './HeaderNavigation';

export function Header() {
	return (
		<>
			<header role="banner" className="fr-header">
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
											data-fr-opened="false"
											aria-controls="header-menu"
											aria-haspopup="menu"
											id="header-menu-button"
											title="Menu"
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
				<HeaderNavigation />
			</header>
		</>
	);
}
