import styles from './EmploiEnEuropeContent.module.scss';
import { Dispositifs, ExperiencesEnEurope, LiensUtiles } from './Sections';

export function EmploiEnEuropeContent() {
	return (
		<main id="contenu" className={styles.emploiEnEurope}>
			<ExperiencesEnEurope />
			<Dispositifs />
			<LiensUtiles />
		</main>
	);
}
