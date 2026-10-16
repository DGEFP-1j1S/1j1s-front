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
					Échangez avec un professionnel avec My Job Glasses !
				</HeroPrimaryText>
			</h2>
			<HeroSecondaryText>
				<b><i>1Jeune1Solution</i></b> s&apos;est associé à <b><i>My Job Glasses</i></b> pour
				vous permettre de rencontrer des professionnels qui répondront à vos questions sur leur métier.
			</HeroSecondaryText>
			<Link href="/myjobglasses" appearance={'asSecondaryButton'} className={styles.cta}>
				Trouver un professionnel
				<Link.Icon />
			</Link>
		</HeroWithIllustration>
	);
}
