import React from 'react';

import styles from '~/client/components/features/JeRecrute/DecouvrirDispositifs/DecouvrirDispositifs.module.scss';
import { Container } from '~/client/components/layouts/Container/Container';
import { Link } from '~/client/components/ui/Link/Link';
import { LBA_RECRUTEUR_URL } from '~/shared/lbaLandingUrls';

export function DécouvrirDispositifs () {
	return (
		<section>
			<Container className={styles.recruter}>
				<h1>Vous cherchez à recruter ?</h1>
				<p>Dans le cadre du plan 1 jeune, 1 solution, nous vous accompagnons dans la recherche de vos futurs collaborateurs.</p>
				<ul className={styles.offres}>
					<li>
						<Link href="/emplois/deposer-offre" appearance='asPrimaryButton' className={styles.offresLien}>Déposer une offre d‘emploi<Link.Icon /></Link>
					</li>
					<li>
						<Link href={LBA_RECRUTEUR_URL} appearance='asPrimaryButton' className={styles.offresLien}>Déposer une offre d’alternance<Link.Icon /></Link>
					</li>
					<li>
						<Link href="/stages/deposer-offre" appearance='asPrimaryButton' className={styles.offresLien}>Déposer une offre de stage<Link.Icon /></Link>
					</li>
				</ul>
			</Container>
		</section>
	);
}
