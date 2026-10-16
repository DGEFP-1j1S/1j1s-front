import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';

import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';

import styles from './ConsulterAnnonce.module.scss';

const MAX_DESCRIPTION_LENGTH = 650;
const DESCRIPTION_LENGTH_THRESHOLD = 450;

interface BoutonEtendreProps {
	onClick: () => void
	estÉtendu: boolean
	'aria-controls': string
}

function BoutonEtendre({ onClick, estÉtendu, 'aria-controls': ariaControls }: BoutonEtendreProps) {
	return (
		<ButtonComponent
			className={styles.readMore}
			appearance={'quaternary'}
			label={estÉtendu ? 'Afficher moins' : 'Lire la suite'}
			icon={estÉtendu ? <Icon name={'angle-up'} /> : <Icon name={'angle-down'} />}
			iconPosition={'right'}
			onClick={onClick}
			type="button"
			aria-expanded={estÉtendu}
			aria-controls={ariaControls} />
	);
}

type DescriptionDuLogementProps = {
	children: string
}

function cropDescription(description: string) {
	const premièreEspaceAprèsThreshold = description.indexOf(' ', DESCRIPTION_LENGTH_THRESHOLD);
	return description.slice(0, premièreEspaceAprèsThreshold);
}

export const DescriptionDuLogement = ({ children }: DescriptionDuLogementProps) => {
	const [descriptionÉtendue, setDescriptionÉtendue] = useState(false);
	const longueDescription = children.length > MAX_DESCRIPTION_LENGTH;
	const titleRef = useRef<HTMLHeadingElement>(null);

	let description = children;
	if (longueDescription && !descriptionÉtendue) {
		description = cropDescription(description) + ' …';
	}

	const toogle = useCallback(function toogle() {
		titleRef.current?.focus();
		setDescriptionÉtendue(!descriptionÉtendue);
	}, [descriptionÉtendue, titleRef]);

	return (
		<section className={classNames(styles.card, styles.descriptionDuLogement)}
						 aria-labelledby="description-annonce-title">
			<h2 id="description-annonce-title" ref={titleRef} tabIndex={-1}>Description du Logement</h2>
			<p id="description-annonce">{description}</p>
			{longueDescription && (
				<BoutonEtendre
					onClick={toogle}
					estÉtendu={descriptionÉtendue}
					aria-controls="description-annonce" />
			)}
		</section>
	);
};
