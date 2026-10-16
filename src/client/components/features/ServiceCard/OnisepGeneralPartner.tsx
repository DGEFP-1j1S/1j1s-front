import React from 'react';

import { Carte } from '~/client/dsfr';
import { HtmlHeadingTag } from '~/client/components/props';

export interface OnisepGeneralCardProps {
	headingLevel: HtmlHeadingTag
}

export function OnisepGeneralPartner({ headingLevel }: OnisepGeneralCardProps) {
	return (
		<Carte
			horizontal
			titre="Onisep : l’information pour l’orientation"
			imageSrc="/images/logos/onisep.svg"
			isContain={true}
			lien="https://www.onisep.fr/"
			titreAs={headingLevel}>
            L’Onisep est un établissement public, sous tutelle du ministère de
            l’Education nationale, de la Jeunesse et des Sports, et du
            ministère de l’Enseignement supérieur, de la Recherche et de
            l’Innovation. Il a pour mission d’informer sur les secteurs
            professionnels, les métiers et les formations via ses productions
            numériques, imprimées, et ses services. Il accompagne les familles
            et les équipes éducatives en leur fournissant des ressources, des
            outils et dispositifs permettant de construire un parcours de
            formation et un projet professionnel tout au long de la vie.
		</Carte>
	);
}
