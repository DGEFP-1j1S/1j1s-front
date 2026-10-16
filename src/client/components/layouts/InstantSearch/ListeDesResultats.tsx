import classNames from 'classnames';
import React from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import styles from '~/client/components/layouts/InstantSearch/ListeDesResultats.module.scss';
import { Footnote } from '~/client/components/ui/Footnote/Footnote';
import { Skeleton } from '~/client/components/ui/Loader/Skeleton/Skeleton';
import { useSynchronizedRef } from '~/client/hooks/useSynchronizedRef';

interface ListeDesResultatsProps {
	resultats: React.ReactElement
	isLoading: boolean
	isAffichageListeDeResultatsDesktopDirectionRow: boolean
	skeletonRepeat: number
	pagination: React.ReactNode
}

export const ListeDesResultats = React.forwardRef<HTMLElement | null, ListeDesResultatsProps>(function ListeDesResultats(props: ListeDesResultatsProps, outerRef) {
	const { resultats, isLoading, isAffichageListeDeResultatsDesktopDirectionRow, skeletonRepeat, pagination } = props;
	const ref = useSynchronizedRef(outerRef);

	return (
		<section className={styles.listeDesResultatsWrapper} ref={ref} aria-label='Résultats de la recherche'>
			<Container
				className={classNames({ [styles.listeDesResultats]: !isAffichageListeDeResultatsDesktopDirectionRow })}>
				<Skeleton
					type="card"
					isLoading={isLoading}
					repeat={skeletonRepeat}
					className={classNames({ [styles.skeletonAffichageDesktopDirectionRow]: !isAffichageListeDeResultatsDesktopDirectionRow })}>
					<>
						{resultats}
						{pagination}
						<Footnote htmlFor="partenaires-reference" id="partenaires" className={styles.footnote}>
							les annonces listées ci-dessus nous sont fournies par nos partenaires (<a href="/cgu#3.-services">liste disponible dans les <abbr title="Conditions Générales d'Utilisation">CGU</abbr></a>)
						</Footnote>
					</>
				</Skeleton>
			</Container>
		</section>
	);
});
