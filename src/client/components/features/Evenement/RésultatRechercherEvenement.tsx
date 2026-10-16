import React from 'react';

import { Evenement } from '~/client/components/features/Evenement/Evenement.type';
import styles from '~/client/components/features/Evenement/RésultatRechercherEvenement.module.scss';
import { HitProps } from '~/client/components/layouts/InstantSearch/InstantSearchLayout';
import { Card } from '~/client/components/ui/Card/Card';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { formatEventDateTime } from '~/client/utils/formatEventDateTime.util';

export function RésultatRechercherEvenement(props: HitProps<Evenement>) {
	const { titreEvenement, organismeOrganisateur, dateDebut, dateFin, lieuEvenement, slug } = props.hit;

	return (
		<Link href={`evenements/${slug}`} className={'underline-none'}>
			<Card className={styles.resultatCard} layout={'vertical'}>
				<Card.Content className={styles.content}>
					<div className={styles.event}>
						<div className={styles.eventDetails}>{formatEventDateTime(dateDebut, dateFin)} <span
							className={styles.eventOrganizer}>- {organismeOrganisateur}</span>
						</div>
						<div className={styles.eventTitle}>{titreEvenement}</div>
					</div>
				</Card.Content>
				<div className={styles.tagLink}>
					<TagList list={[lieuEvenement]} aria-label="Lieu de l‘évènement" />
					<Card.FakeLink
						appearance={'quaternary'}
						icon={<Icon name={'angle-right'} />}
						label={'En savoir plus'} />
				</div>
			</Card>
		</Link>
	);
}
