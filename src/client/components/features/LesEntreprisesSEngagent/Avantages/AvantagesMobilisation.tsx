import illustration from 'public/illustrations/rejoindre-la-mobilisation.svg';
import React from 'react';

import styles from '~/client/components/features/LesEntreprisesSEngagent/Avantages/AvantagesMobilisation.module.scss';
import { Container } from '~/client/components/layouts/Container/Container';
import { Image } from '~/client/components/ui/Img';

export default function AvantagesMobilisation() {
	return (
		<Container className={styles.container}>
			<Image src={illustration} width={448} height={300} alt="" />
			<section className={styles.avantages}>
				<h2>
					Quels avantages à rejoindre la mobilisation pour les jeunes ?
				</h2>
				<ul>
					<li>Mettez en avant tous vos engagements pour les jeunes en créant votre page dédiée</li>
					<li>Publiez vos offres d’emploi sur la plateforme</li>
					<li>Bénéficiez d’un accompagnement par un Conseiller France Travail (rappel sous 72h)</li>
					<li>Relayez vos engagements par intermédiaire d’un kit de communication #1jeune1solution</li>
				</ul>
			</section>
		</Container>
	);
}
