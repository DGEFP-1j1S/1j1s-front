import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import styles from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout.module.scss';
import { ErrorComponent } from '~/client/components/ui/ErrorMessage/ErrorComponent';
import { NoResultErrorMessage } from '~/client/components/ui/ErrorMessage/NoResultErrorMessage';
import { Skeleton } from '~/client/components/ui/Loader/Skeleton/Skeleton';
import { Pagination } from '~/client/components/ui/Pagination/Pagination';
import { Erreur } from '~/server/errors/erreur.types';

interface RechercherSolutionLayoutProps {
	banniere: React.ReactElement;
	erreurRecherche?: Erreur;
	etiquettesRecherche?: React.ReactElement;
	formulaireRecherche: React.ReactElement;
	isChargement: boolean;
	isEtatInitial: boolean;
	messageResultatRecherche: string | ReactElement;
	nombreTotalSolutions: number;
	paginationOffset?: number;
	maxPage?: number;
	listeSolutionElement: React.ReactElement;
	footnote?: ReactElement;
}

export function RechercherSolutionLayout(props: RechercherSolutionLayoutProps) {
	const {
		banniere,
		erreurRecherche,
		etiquettesRecherche,
		formulaireRecherche,
		messageResultatRecherche,
		nombreTotalSolutions,
		paginationOffset,
		maxPage,
		isChargement,
		isEtatInitial,
		listeSolutionElement,
		footnote,
	} = props;


	function getResultatsDeRecherche() {
		if (isEtatInitial) {
			return null;
		}
		if (erreurRecherche) {
			return <div role={'alert'}><ErrorComponent errorType={erreurRecherche} /></div>;
		}
		if (isChargement) {
			return (
				<>
					<div className={'separator'}>
						<Container className={styles.informationResultat}>
							<Skeleton type="line" isLoading={true} className={styles.nombreResultats}>
							</Skeleton>
						</Container>
					</div>

					<div className={classNames(styles.listeSolutionsWrapper, 'background-white-lilac')}>
						<Container>
							<Skeleton type="card"
								isLoading={true}
								repeat={2}
								className={styles.listeSolutions}>
							</Skeleton>
						</Container>
					</div>
				</>
			);
		}

		if (nombreTotalSolutions === 0) {
			return (
				<div role={'alert'}>
					<NoResultErrorMessage />
				</div>
			);
		}

		const isRechercheEnCoursOuPlusieursResultats = nombreTotalSolutions !== undefined && nombreTotalSolutions > 0;
		if (isRechercheEnCoursOuPlusieursResultats) {
			return (
				<>
					<div className={'separator'}>
						<Container className={styles.informationResultat}>
							{etiquettesRecherche}
							<div role={'status'}>
								<h2>{messageResultatRecherche}</h2>
							</div>
						</Container>
					</div>

					<div className={classNames(styles.listeSolutionsWrapper, 'background-white-lilac')}>
						<Container>
							{listeSolutionElement}
							{footnote && <div className={styles.footnote}>{footnote}</div>}
							{paginationOffset && nombreTotalSolutions && nombreTotalSolutions > paginationOffset && (
								<div className={styles.pagination}>
									<Pagination
										numberOfResult={nombreTotalSolutions}
										numberOfResultPerPage={paginationOffset}
										maxPage={maxPage} />
								</div>
							)}
						</Container>
					</div>
				</>
			);
		}
	}

	return (
		<>
			{banniere}
			<div className={styles.rechercheSolution} aria-busy={isChargement} aria-live="polite">
				<div className={'separator'}>
					<Container className={styles.rechercheSolutionFormWrapper}>
						{formulaireRecherche}
					</Container>
				</div>
				{getResultatsDeRecherche()}
			</div>
		</>
	);
}
