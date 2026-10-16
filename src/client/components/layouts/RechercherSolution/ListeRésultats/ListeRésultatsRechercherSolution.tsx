import React from 'react';

import styles from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution.module.scss';

export function ListeRésultatsRechercherSolution({ children, ...rest }: React.ComponentPropsWithoutRef<'ul'>) {
	return (
		<ul className={styles.listeRésultatsRechercherSolution} {...rest}>
			{children}
		</ul>
	);
}
