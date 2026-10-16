import classNames from 'classnames';

import { HeroPrimaryText, HeroSecondaryText, HeroWithIllustration } from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './styles.module.scss';

export default function WorldSkillsBanner() {
	return (
		<HeroWithIllustration image="/images/campagne-world-skills-2024.webp" className={classNames(styles.banner, styles.worldSkills)}>
			<h2>
				<HeroPrimaryText>
					WorldSkills Lyon 2024, la Compétition Mondiale des Métiers.
				</HeroPrimaryText>
			</h2>
			<HeroSecondaryText>
				1jeune1solution s’engage en faveur de la jeunesse, venez nous rencontrer du 10 au 15 septembre lors de la compétition WorldSkills Lyon 2024.
			</HeroSecondaryText>
			<Link href="https://worldskills2024.com" appearance={'asSecondaryButton'} className={styles.cta}>
				Plus d’infos
				<Link.Icon />
			</Link>
		</HeroWithIllustration>
	);
}
