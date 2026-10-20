import React from 'react';

import { Carte } from '~/client/dsfr';

export function FormationsEnApprentissageCard() {
	return (
		<Carte
			horizontal
			titre="Vous êtes à la recherche d'une formation en apprentissage ?"
			imageSrc="/images/formations-apprentissage.webp"
			lien="/formations/apprentissage">
			Trouvez la formation qu’il vous faut pour réaliser votre projet avec La bonne alternance
		</Carte>
	);
}
