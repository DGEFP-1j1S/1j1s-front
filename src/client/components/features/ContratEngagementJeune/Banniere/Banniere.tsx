import banniereImage from 'public/images/cej.webp';
import React from 'react';

import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './Banniere.module.scss';

export function Banniere() {
	return (
		<div className={styles.banniere}>
			<div className={styles.banniereContent}>
				<div className={styles.banniereTextContent}>
					<h1 className={styles.titre}>Le Contrat d’Engagement Jeune, la solution pour vous&nbsp;!</h1>
					<p className={styles.banniereAccroche}>Découvrez le CEJ, un parcours personnalisé pour vous aider à définir votre projet professionnel et trouver un emploi.</p>
					<Link
						className={styles.cta}
						href="#accompagnement"
						appearance={'asSecondaryButton'}>
						Trouver son accompagnement CEJ
						<Link.Icon name="angle-right" />
					</Link>
				</div>
			</div>
			<Image
				className={styles.banniereContentImage}
				priority
				src={banniereImage}
				alt={'Contrat d‘engagement jeune, finie la galère, trouvez un métier qui va vous plaire.'}
				width={800}
				height={400} />
		</div>
	);
}

