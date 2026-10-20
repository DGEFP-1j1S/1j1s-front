import React from 'react';

import { Carte } from '~/client/dsfr';

export function ExperiencesEurope() {
	return (
		<Carte
			horizontal
			titre="Je découvre les dispositifs pour m'accompagner dans mon projet"
			imageSrc="/images/passeport.webp"
			lien="/experience-europe">
			Découvrez les services destinés à vous aider à trouver l’expérience en Europe faite pour vous
		</Carte>
	);
}
