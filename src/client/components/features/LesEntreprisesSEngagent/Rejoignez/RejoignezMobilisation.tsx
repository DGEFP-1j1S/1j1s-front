import React from 'react';

import styles from '~/client/components/features/LesEntreprisesSEngagent/Rejoignez/RejoignezMobilisation.module.scss';
import { Container } from '~/client/components/layouts/Container/Container';
import { LightHero, LightHeroPrimaryText } from '~/client/components/ui/Hero/LightHero';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';

export default function RejoignezMobilisation() {
	const urlRejoindreLaMobilisation = process.env.NEXT_PUBLIC_LES_ENTREPRISES_S_ENGAGENT_URL ?? '';

	return (
		<div className={styles.content}>
			<Container className={styles.container}>
				<div className={styles.lesEntreprisesSEngagent}>
					<Image src="/icons/les-entreprises-s-engagent.svg" alt="" width={65} height={65} />
					<span className={styles.lesEntreprisesSEngagentTitle}>Les entreprises s‘engagent</span>
				</div>
				<LightHero className={styles.initiativeJeuneTitle}>
					<h1>
						<span className={styles.initiativeJeuneQuestion}>Votre entreprise recrute ou porte une initiative pour les jeunes ?</span>
						<LightHeroPrimaryText>Rejoignez la mobilisation !</LightHeroPrimaryText>
					</h1>
				</LightHero>
				<p className={styles.description}>
					<b>La jeunesse est notre priorité.</b> Partout en France, des entreprises, chacune à leur échelle et selon leurs
				possibilités, cherchent ou apportent toutes sortes de solutions pour les jeunes. Rejoignez-les, et <b>bénéficiez
				de services inédits</b> : un accompagnement personnalisé si vous le souhaitez, des aides pour communiquer, etc.
				</p>
				<div className={styles.linkAsButtonWrapper}>
					<Link href={urlRejoindreLaMobilisation} appearance="asPrimaryButton">
					Rejoindre la mobilisation
						<Link.Icon />
					</Link>
					<Link href="https://lesentreprises-sengagent.gouv.fr/les-entreprises-engagees" appearance="asSecondaryButton">
					Découvrir les entreprises engagées
						<Link.Icon />
					</Link>
				</div>
			</Container>
		</div>
	);
}
