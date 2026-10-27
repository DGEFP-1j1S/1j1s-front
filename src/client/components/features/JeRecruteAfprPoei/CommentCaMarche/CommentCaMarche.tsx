import React from 'react';

import { Image } from '~/client/components/ui/Img';

export function CommentCaMarche() {
	return (
		<section className="fr-container">
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="r-col-12 fr-col-lg-6">
					<h2>Comment ça marche ?</h2>
					<ol>
						<li>Vous déposez votre offre d’emploi en ligne sur notre site ou en contactant votre conseiller</li>
						<li>Vous sélectionnez un candidat prêt à se former</li>
						<li>Vous définissez un parcours de formation seul ou avec France Travail</li>
						<li>Vous signez une convention avant le début de la formation</li>
						<li>Vous signez le contrat de travail après la réalisation du bilan et l’aide est versée</li>
					</ol>
				</div>
				<Image
					className="fr-col-12 fr-col-lg-6 fr-hidden fr-unhidden-lg"
					src="/illustrations/mentorat-citoyen.svg"
					alt=""
					width={500}
					height={300}
				/>
			</div>
		</section>
	);
}
