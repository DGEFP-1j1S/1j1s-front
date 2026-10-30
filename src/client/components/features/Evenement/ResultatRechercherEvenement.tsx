import React from 'react';

import styles from '~/client/components/features/Evenement/ResultatRechercherEvenement.module.scss';
import { Card } from '~/client/components/ui/Card/Card';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { formatEventDateTime } from '~/client/utils/formatEventDateTime.util';
import { EvenementIndexe } from '~/server/evenements/domain/rechercheEvenement';

export function ResultatRechercherEvenement(props: { hit: EvenementIndexe }) {
	const { titre, organismeOrganisateur, dateDebut, dateFin, lieu, slug } = props.hit;

	return (
		<Link href={`/evenements/${slug}`} className={'underline-none'}>
			<Card className={styles.resultatCard} layout={'vertical'}>
				<Card.Content className={styles.content}>
					<div className={styles.event}>
						<div className={styles.eventDetails}>{formatEventDateTime(dateDebut, dateFin)} <span
							className={styles.eventOrganizer}>- {organismeOrganisateur}</span>
						</div>
						<div className={styles.eventTitle}>{titre}</div>
					</div>
				</Card.Content>
				<div className={styles.tagLink}>
					<TagList list={[lieu]} aria-label="Lieu de l‘évènement" />
					<Card.FakeLink
						icon={<Icon name={'angle-right'} />}
						label={'En savoir plus'} />
				</div>
			</Card>
		</Link>
	);
}
