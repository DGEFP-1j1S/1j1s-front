import classNames from 'classnames';

import { HeroPrimaryText, HeroSecondaryText, HeroWithIllustration } from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './styles.module.scss';

export default function FeteDesMetiersBanner() {
	return (
		<HeroWithIllustration image="/images/campagne-fete-des-metiers.webp" className={classNames(styles.banner, styles.feteDesMetiers)}>
			<h2>
				<HeroPrimaryText>
					La Fête des Métiers et de l’Alternance vous donne les clés de l’avenir !
				</HeroPrimaryText>
			</h2>
			<HeroSecondaryText>
				Un salon incontournable pour découvrir des métiers, des formations et des opportunités concrètes !
			</HeroSecondaryText>
			<HeroSecondaryText>
				Rendez-vous le 21 mai 2025 à Paris Montreuil Expo, entrée libre.
			</HeroSecondaryText>
			<Link href="https://www.fetedelalternance.com/" appearance={'asSecondaryButton'} className={styles.cta}>
				Informations sur la Fête des Métiers 2025
				<Link.Icon />
			</Link>
		</HeroWithIllustration>
	);
}
