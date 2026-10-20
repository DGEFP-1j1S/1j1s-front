import {
	CampagneApprentissageEntreprises,
} from '~/client/components/features/CampagneApprentissage/CampagneApprentissageEntreprises/CampagneApprentissageEntreprises';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import styles from '~/pages/apprentissage/index.module.scss';
import analyticsPageConfig from '~/pages/apprentissage-entreprises/index.analytics';

export default function ApprentissageEntreprises () {
	useAnalytics(analyticsPageConfig);

	return (
		<>
			<Head title="Découvrir les avantages de l’apprentissage pour les entreprises | 1jeune1solution" robots="index,follow" />
			<main id="contenu" className={styles.contenu}>
				<CampagneApprentissageEntreprises />
			</main>
		</>
	);
}
