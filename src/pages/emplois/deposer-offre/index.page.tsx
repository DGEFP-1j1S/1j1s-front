import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import {
	Hero,
	HeroPrimaryText,
	HeroSecondaryText,
} from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/emplois/deposer-offre/index.analytics';
import styles from '~/pages/emplois/deposer-offre/index.module.scss';

const POLITIQUE_DE_CONFIDENTIALITÉ_URL = 'https://urldefense.com/v3/__https:/immersion-facile-1.gitbook.io/mentions-legales/politique-de-confidentialite__;!!FiWPmuqhD5aF3oDTQnc!iyqpB-G35-BrqkJViRoO2702VTRuXwLqnyLallEQawiA6ZOpWOZVGffzeAty1JVAg0Xd80FiILE_IXJnt1sB9oIiZimxZ8LNd0uw6vjcAPSzA4r2pq_h$';
const CONDITIONS_GÉNÉRALES_UTILISATION_URL = 'https://urldefense.com/v3/__https:/immersion-facile-1.gitbook.io/mentions-legales/conditions-generales-dutilisation__;!!FiWPmuqhD5aF3oDTQnc!iyqpB-G35-BrqkJViRoO2702VTRuXwLqnyLallEQawiA6ZOpWOZVGffzeAty1JVAg0Xd80FiILE_IXJnt1sB9oIiZimxZ8LNd0uw6vjcAPSzA1Bc6hKW$';

export default function DéposerUneOffreDEmploi() {
	useAnalytics(analytics);

	return (
		<main id="contenu">
			<Head
				title="Déposer une offre d‘emploi ou d‘alternance | 1jeune1solution"
				robots="index,follow" />
			<Hero>
				<h1>
					<HeroPrimaryText className={styles.heroTitle}>
						Je dépose une offre d‘emploi ou d‘alternance sur 1jeune1solution
					</HeroPrimaryText>
				</h1>
				<HeroSecondaryText className={styles.heroSubtitle}>
					En partenariat avec France Travail
				</HeroSecondaryText>
			</Hero>
			<Container>
				<p>
					Afin de renforcer la sécurisation de vos données et faciliter le dépôt de vos offres d’emploi,
					rendez-vous sur : <Link href={'https://pro.francetravail.fr/depotoffrerecruteur/accueil'} target={'_blank'}>francetravail.fr</Link>.<br /><br />

					Si vous avez besoin d’échanger avec un conseiller, contactez le 39 95 (service gratuit + le prix d’un appel local, du lundi au samedi inclus, de 7h30 à 20h).
					Depuis l’étranger (entreprises frontalières par exemple), composez le +33 1 77 86 39 95.

					Vous pouvez également programmer une demande de rappel par un conseiller sur : <Link href={'https://urldefense.com/v3/__https:/pro.francetravail.fr/accueil/demandederappel__;!!FiWPmuqhD5aF3oDTQnc!iyqpB-G35-BrqkJViRoO2702VTRuXwLqnyLallEQawiA6ZOpWOZVGffzeAty1JVAg0Xd80FiILE_IXJnt1sB9oIiZimxZ8LNd0uw6vjcAPSzA24d3k1P$'}>francetravail.fr</Link>
					.

					Pour rappel, le numéro unique 3995 vous permet d’échanger avec un conseiller du lundi au samedi inclus, de
					7h30 à 20h, avec un système de demande de rappel en cas d’indisponibilité.
				</p>
				<br />
				<p className={styles.rgpd}>
					Vous êtes informé que vos données sont collectées et traitées par France Travail pour traiter votre demande de dépôt d‘offre.
					Pour en savoir plus sur vos droits, consultez la <Link href={POLITIQUE_DE_CONFIDENTIALITÉ_URL}>Politique de Confidentialité</Link> de France Travail.
					En cliquant sur « confirmer » vous reconnaissez avoir pris connaissance et accepter les <Link href={CONDITIONS_GÉNÉRALES_UTILISATION_URL}>Conditions Générales d‘Utilisation</Link> de France Travail.
				</p>
			</Container>
		</main>
	);
}

