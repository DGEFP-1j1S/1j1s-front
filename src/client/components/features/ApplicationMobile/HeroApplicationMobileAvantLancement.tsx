import React from 'react';
import { Image } from "~/client/components/ui/Img";

export function HeroApplicationMobileAvantLancement() {
	return (
		<section className="background--blue-light fr-py-9w">
			<div className="fr-container">
				<div className="fr-grid-row fr-grid-row--gutters">
					<div className="fr-col-lg-7 fr-col-12">
						<h1 className="fr-h1">La nouvelle application 1Jeune1Solution</h1>
						<p className="fr-text--lead fr-mb-8w">L’app 15-30 ans est ouverte à tous les jeunes et t’accompagne dans tous tes projets : études, logements, emploi mobilité santé loisir et bien plus.</p>
						<p className="fr-h5">Bientôt disponible sur App Store et Google Play !</p>
					</div>
					<div className="fr-col-lg-5 fr-hidden fr-unhidden-lg justify-center">
						<Image
							src="/images/application-mobile/screen-app-mobile.png"
							alt="Capture de l'écran d'accueil de l'application mobile 1Jeune1solution"
							width="258"
							height="504"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
