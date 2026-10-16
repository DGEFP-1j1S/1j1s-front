import classNames from 'classnames';

import { HeroPrimaryText, HeroSecondaryText, HeroWithIllustration } from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './styles.module.scss';

export default function ApprentissageBanner() {
	return (
		<HeroWithIllustration image="/images/campagne-apprentissage-banniere.webp" className={classNames(styles.banner, styles.apprentissage)}>
			<h2>
				<HeroPrimaryText>
          Contrat, éligibilité ? Avantages ?
				</HeroPrimaryText>
			</h2>
			<HeroSecondaryText>
        Retrouvez toutes les réponses à vos questions sur l’apprentissage dans notre FAQ.
			</HeroSecondaryText>
			<Link href={'/faq/apprentissage-employeurs-apprentis'} appearance={'asSecondaryButton'} className={styles.cta}>
        Consultez notre FAQ
				<Link.Icon />
			</Link>
		</HeroWithIllustration>
	);
}
