import React from 'react';
import styles from './ServiceCard.module.scss';

interface ServiceCardListProps {
	heading?: string
	'aria-label'?: string,
}

export function ServiceCardList({ children, 'aria-label': ariaLabel, heading= "Découvrez des services faits pour vous" }: React.PropsWithChildren<ServiceCardListProps>) {
	const DEFAULT_LABEL = 'Liste des partenaires et des services';

	return (
		<section className={styles.serviceCardList}>
			<div className="fr-container">
				<h2>{ heading }</h2>
				<ul aria-label={ariaLabel ?? DEFAULT_LABEL} className='fr-grid-row fr-grid-row--gutters'>
					{
						React.Children.map(children, (child, index) => (
							<li key={index} className='fr-col-12 fr-col-lg-9 fr-m-auto'>
								{child}
							</li>
						))
					}
				</ul>
			</div>
		</section>
	);
}
