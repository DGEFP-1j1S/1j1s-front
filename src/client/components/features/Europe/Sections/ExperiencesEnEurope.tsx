import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';

import styles from '../EmploiEnEuropeContent.module.scss';

export function ExperiencesEnEurope() {
	return (
		<section className={styles.experience}>
			<LightHero className={styles.title}>
				<h1>
					<LightHeroPrimaryText>Je cherche une expérience </LightHeroPrimaryText>
					<LightHeroSecondaryText>en Europe</LightHeroSecondaryText>
				</h1>
			</LightHero>
			<p className={styles.description}>
					Trouvez des offres d’emploi, de stage et des volontariats internationaux au sein de pays Européens ainsi que
					des aides financières afin de partir à la découverte de nouvelles opportunités et de nouveaux pays !
			</p>
			<div className={styles.information}>
				<Icon name="information" />
				<p>
						Si vous êtes accompagné·e en mission locale, rapprochez-vous de votre conseiller pour en savoir plus sur les mobilités courtes
				</p>
			</div>
			<Link href="https://europa.eu/eures/portal/jv-se/home?lang=fr" appearance="asPrimaryButton">
					Trouver une offre d’emploi en Europe
				<Link.Icon />
			</Link>
		</section>
	);
}
