import React from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import styles from '~/client/components/layouts/ConsulterOffre/ConsulterOffreLayout.module.scss';
import { Container } from '~/client/components/layouts/Container/Container';

interface ConsulterOffreLayoutProps {
  children: React.ReactNode;
}

export function ConsulterOffreLayout(props: React.PropsWithChildren<ConsulterOffreLayoutProps>) {
	const { children } = props;

	return (
		<main id="contenu" className={styles.container}>
			<BackButton className={styles.layoutButton} />
			<Container className={styles.layoutContainer}>
				<article className={styles.layout}>
					{children}
				</article>
			</Container>
		</main>
	);
}
