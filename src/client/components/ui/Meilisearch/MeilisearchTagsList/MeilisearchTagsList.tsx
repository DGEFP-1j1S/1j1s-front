import React from 'react';
import { useCurrentRefinements, UseCurrentRefinementsProps } from 'react-instantsearch';

import { Icon } from '~/client/components/ui/Icon/Icon';

import { getCapitalizedItems } from '../getCapitalizedItems';
import styles from './MeilisearchTagsList.module.scss';

export default function MeilisearchTagsList(props: UseCurrentRefinementsProps) {
	const { items, refine } = useCurrentRefinements(props);
	const isItemListEmpty = items.length === 0;

	if (isItemListEmpty) return null;

	return (
		<ul aria-label="liste des filtres appliqués" className={styles.tagList}>
			{items.map((item) => {
				return item.refinements.map((refinement, index) => (
					<li key={index}>
						<button
							aria-label={`${refinement.label} - supprimer le filtre`}
							onClick={() => refine(refinement)}
							type="button"
							className="fr-tag fr-tag--green-emeraude">
							{getCapitalizedItems(refinement.label)}
							<Icon name="close"/>
						</button>
					</li>
				));
			})}
		</ul>
	);
}
