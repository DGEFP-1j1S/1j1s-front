import classNames from 'classnames';

import { HeroPrimaryText, HeroSecondaryText, HeroWithIllustration } from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './styles.module.scss';

export default function StageDeSecondeBanner() {
	return (
		<HeroWithIllustration image="/images/stages-seconde/banniere-stages-seconde.webp" className={classNames(styles.banner, styles.stageSeconde)}>
			<h2>
				<HeroPrimaryText>
					Un stage du 16 au 27 juin 2025
				</HeroPrimaryText>
			</h2>
			<HeroSecondaryText>
				pour permettre aux élèves de seconde générale et technologique de diversifier leur connaissance des
				métiers.
			</HeroSecondaryText>
			<Link href={process.env.NEXT_PUBLIC_STAGES_SECONDE_HOMEPAGE_URL ?? ''} appearance={'asSecondaryButton'} className={styles.cta}>
				Proposer un stage ou candidater
				<Link.Icon />
			</Link>
		</HeroWithIllustration>
	);
}
