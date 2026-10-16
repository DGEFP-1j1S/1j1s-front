import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import {
	isNavigationItem,
	NavigationItem,
	navigationItemList,
	NavigationItemWithChildren,
} from '~/client/components/layouts/Header/Navigation/NavigationStructure';
import { Link } from '~/client/components/ui/Link/Link';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/plan-du-site/index.analytics';
import styles from '~/pages/plan-du-site/index.module.scss';

export default function PlanDuSite() {
	useAnalytics(analytics);
	const isServicesJeunesVisibles = process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE === '0';

	function displayNavigationTree(item: NavigationItem | NavigationItemWithChildren) {

		if (isNavigationItem(item)) {
			return (
				<li key={item.link}><Link href={item.link}>{item.label}</Link></li>
			);
		} else {
			return (
				<li key={item.label}>
					<span id="sectionPlanDuSite">{item.label}</span>
					<ul aria-labelledby="sectionPlanDuSite">
						{item.children.map((sub) => displayNavigationTree(sub))}
					</ul>
				</li>
			);
		}
	}

	return (
		<>
			<Head
				title="Plan du site | 1jeune1solution"
				description="Plan du site"
				robots="index,follow" />
			<Container className={styles.planDuSiteContainer}>
				<main id="contenu">
					<h1 id="planDuSite" className={styles.planDuSiteTitre}>Plan du site</h1>
					<ul aria-labelledby="planDuSite">
						<li>
							<Link href={navigationItemList().accueil.link}>{navigationItemList().accueil.label}</Link>
						</li>

						{displayNavigationTree(navigationItemList().offresNav)}
						{displayNavigationTree(navigationItemList().orientationNav)}
						{displayNavigationTree(navigationItemList().engagementNav)}
						{displayNavigationTree(navigationItemList().logementsNav)}
						{displayNavigationTree(navigationItemList().accompagnementNav)}
						{displayNavigationTree(navigationItemList().aidesEtOutilsNav)}
						{displayNavigationTree(navigationItemList().employeurNav)}

						<li>
							{isServicesJeunesVisibles ?
								<Link href="/services-jeunes">Services Jeunes</Link> :
								<Link href="/espace-jeune">Espace Jeune</Link>
							}
						</li>
						<li><Link href="/faq">Foire aux questions</Link></li>
						<li><Link href="/cgu">Conditions Générales d’utilisation</Link></li>
						<li><Link href="/accessibilite">Accessibilité : Partiellement conforme</Link></li>
						<li><Link href="/mentions-legales">Mentions légales</Link></li>
						<li><Link href="/confidentialite">Politique de confidentialité</Link></li>
					</ul>
				</main>
			</Container>
		</>
	);
}
