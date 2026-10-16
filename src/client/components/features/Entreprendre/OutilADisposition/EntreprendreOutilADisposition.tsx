import React from 'react';

import styles
	from '~/client/components/features/Entreprendre/OutilADisposition/EntreprendreOutilADisposition.module.scss';
import { Link } from '~/client/components/ui/Link/Link';

interface EntreprendreOutilADispositionProps {
  link: string
  linkLabel: string
  description: string
}

export function EntreprendreOutilADisposition({ link, linkLabel, description }: EntreprendreOutilADispositionProps) {
	return (
		<div className={styles.entreprendreOutilADisposition}>
			<p>{description}</p>
			<Link appearance="asPrimaryButton" href={link}>
				{linkLabel}
				<Link.Icon />
			</Link>
		</div>
	);
}
