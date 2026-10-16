import React from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import { ID_NAV_MOBILE } from '~/client/components/layouts/Header/HeaderBody';
import { ID_NAV_DESKTOP } from '~/client/components/layouts/Header/Navigation/NavDesktop';
import styles from '~/client/components/ui/SkipLink/SkipLink.module.scss';

export default function SkipLink() {
	return (
		<div className={styles.skipLinkWrapper}>
			<Container>
				<ul tabIndex={-1}>
					<li><a href="#contenu">Contenu principal</a></li>
					<li className={styles.desktopOnly}><a href={`#${ID_NAV_DESKTOP}`}>Menu</a></li>
					<li className={styles.mobileOnly}><a href={`#${ID_NAV_MOBILE}`}>Menu</a></li>
					<li><a href="#footer">Pied de page</a></li>
				</ul>
			</Container>
		</div>
	);
}
