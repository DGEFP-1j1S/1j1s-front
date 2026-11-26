import React from 'react';

import { Button } from '~/client/dsfr';

interface BoutonsRechercheProps {
	onReinitialiser: () => void
}

export function BoutonsRecherche({ onReinitialiser }: BoutonsRechercheProps) {
	return (
		<ul className="fr-btns-group fr-btns-group--inline-sm fr-btns-group--center fr-btns-group--lg">
			<li>
				<Button appearance="secondary" label="Réinitialiser" type="button" onClick={onReinitialiser} />
			</li>
			<li>
				<Button label="Rechercher" type="submit" />
			</li>
		</ul>
	);
}
