import classNames from 'classnames';
import React from 'react';

import { HeroPrimaryText, HeroSecondaryText, HeroWithIllustration } from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';

import styles from '../styles.module.scss';

export default function MyJobGlassesBanner() {
	return (
		<HeroWithIllustration image="/images/myjobglasses.webp" className={classNames(styles.banner)}>
			<h2>
				<HeroPrimaryText>
					Employeurs : Trouvez vos futurs apprentis sur 1jeune1solution
				</HeroPrimaryText>
			</h2>
			<HeroSecondaryText>
				Déposez gratuitement vos offres en apprentissage et gagnez en visibilité auprès des jeunes en recherche d’une opportunité
			</HeroSecondaryText>
			<Link href="https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs?utm_source=1j1s&utm_medium=website&utm_campaign=recruteurs_landinglba1j1s:" appearance={'asSecondaryButton'} className={styles.cta}>
				Déposer offre
				<Link.Icon />
			</Link>
		</HeroWithIllustration>
	);
}
