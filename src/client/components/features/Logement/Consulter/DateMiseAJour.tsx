import React from 'react';

import { useDependency } from '~/client/context/dependenciesContainer.context';
import { DateService } from '~/client/services/date/date.service';

import styles from './ConsulterAnnonce.module.scss';

export function DateMiseÀJour({ date }: { date: Date }) {
	const dateService = useDependency<DateService>('dateService');
	return (
		<span className={styles.date}>
			Annonce mise à jour le <time dateTime={date.toISOString()}>
				{dateService.formatToHumanReadableDate(date)}
			</time>
		</span>
	);
}

