import classNames from 'classnames';
import React from 'react';

import { Phases } from '~/client/components/features/Entreprendre/Réseau/EntreprendreReseau';
import styles from '~/client/components/features/Entreprendre/Réseau/PhasesProjet/EntreprendreRéseauStadesProjet.module.scss';
import { Tag } from '~/client/components/ui/Tag/Tag';

interface EntreprendreRéseauPhasesProjetProps extends React.ComponentPropsWithoutRef<'ol'> {
  phases: Phases
}

export function EntreprendreRéseauPhasesProjet({ className, phases, ...rest }: EntreprendreRéseauPhasesProjetProps) {
	const _classNames = classNames(styles.phaseList, className);

	return (
		<ol className={_classNames} aria-label="Phases d‘accompagnement" {...rest}>
			<li className={styles.phaseListItem}>
				<Tag className={classNames({ [styles.strike]: !phases.anteCréation })}>
          Phase ante-création
					{!phases.anteCréation && <span className="sr-only"> non disponible</span>}
				</Tag>
			</li>
			<li className={styles.phaseListItem}>
				<Tag className={classNames({ [styles.strike]: !phases.test })}>
          Phase test
					{!phases.test && <span className="sr-only"> non disponible</span>}
				</Tag>
			</li>
			<li className={styles.phaseListItem}>
				<Tag className={classNames({ [styles.strike]: !phases.postCréation })}>
          Phase post-création
					{!phases.postCréation && <span className="sr-only"> non disponible</span>}
				</Tag>
			</li>
		</ol>
	);
}
