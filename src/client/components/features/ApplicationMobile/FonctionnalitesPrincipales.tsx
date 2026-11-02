import React from "react";
import { Image } from "~/client/components/ui/Img";

export function FonctionnalitesPrincipales() {
	return (
		<section className="fr-mb-5w">
			<div className="fr-container fr-p-10w background--blue-light">
				<h2>Les principales fonctionnalités de l&#39;application</h2>
				<ul className="fr-grid-row fr-grid-row--gutters">
					{ fonctionnalitesAppMobile.map(fonc => (
						<li key={fonc.imageSrc} className="fr-col-lg-3 fr-col-md-6 fr-col-12">
							<div className="fr-hidden fr-unhidden-md">
								<Image
									src={fonc.imageSrc}
									alt={fonc.imageAlt}
									width="258"
									height="504"
								/>
							</div>
							<p className="fr-text--md fr-text--bold fr-mb-0">
								{fonc.description}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

type FonctionnaliteAppMobile	= {
	description: string
	imageSrc: string
	imageAlt: string
}

const fonctionnalitesAppMobile: FonctionnaliteAppMobile[] = [
	{
		description: "Des pistes d’actions personnalisées",
		imageSrc: "/images/application-mobile/screen-app-pistes.png",
		imageAlt: `Capture de l'écran "Mes pistes à explorer" de l'application mobile 1Jeune1solution`
	},
	{
		description: "La recherche d’offres d’emploi, d’alternance, d’immersion et de service civique",
		imageSrc: "/images/application-mobile/screen-app-offres.png",
		imageAlt: `Capture de l'écran "Offres" de l'application mobile 1Jeune1solution`
	},
	{
		description: "La recherche d’évènements",
		imageSrc: "/images/application-mobile/screen-app-evenements.png",
		imageAlt: `Capture de l'écran "Agenda" de l'application mobile 1Jeune1solution`,
	},
	{
		description: "Une messagerie instantanée avec mon conseiller référent",
		imageSrc: "/images/application-mobile/screen-app-messagerie.png",
		imageAlt: `Capture de l'écran "Messagerie" de l'application mobile 1Jeune1solution`,
	}
]
