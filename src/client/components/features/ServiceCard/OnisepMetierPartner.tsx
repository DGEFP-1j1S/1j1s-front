import React from 'react';
import { Carte } from '~/client/dsfr';

export function OnisepMetierPartner() {
	return (
		<Carte
			horizontal
			titre='Besoin d‘informations sur les métiers ?'
			lien='/decouvrir-les-metiers' 
			imageSrc='/images/logos/onisep.svg'
		>
			Renseignez-vous sur les différents métiers avec l’ONISEP. Trouvez un métier qui vous correspond parmi plus de 700 fiches.
		</Carte>
	);
}
